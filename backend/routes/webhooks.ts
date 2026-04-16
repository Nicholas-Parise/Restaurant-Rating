import express from "express";
import db from "../utils/db";
import createNotification from "../middleware/createNotification";
import * as dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/ses', async (req, res) => {

  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);
  console.log("everything:", req);

  let snsMessage;

  // Handle different payload formats
  if (typeof req.body === "string") {
    snsMessage = JSON.parse(req.body);
  } else {
    snsMessage = req.body;
  }

  if (!snsMessage) {
    console.error("Empty SNS payload");
    return res.sendStatus(400);
  }
  try {

    if (snsMessage.Type === "SubscriptionConfirmation") {
      const url = new URL(snsMessage.SubscribeURL);
      if (!url.hostname.endsWith("amazonaws.com")) {
        throw new Error("Invalid SNS confirmation URL");
      }
      await fetch(snsMessage.SubscribeURL);
      return res.sendStatus(200);
    }

    const message = JSON.parse(snsMessage.Message);


    if (message.eventType === "Bounce" || message.notificationType === "Bounce") {
      const bounced = message.bounce?.bouncedRecipients || [];
      const bounceType = message.bounce?.bounceType;

      let status = "temporary";
      if (bounceType === "Permanent") {
        status = "bounced";
      }

      for (const r of bounced) {
        console.log("Bounced:", r.emailAddress);

        await db.query(`
          INSERT INTO email_suppression (email, status, retry_count)
          VALUES ($1, $2, CASE WHEN $2 = 'temporary' THEN 1 ELSE 0 END)
          ON CONFLICT (email)
          DO UPDATE SET
            status = CASE
              WHEN email_suppression.status = 'complained' THEN email_suppression.status
              WHEN EXCLUDED.status = 'complained' THEN 'complained'
              WHEN EXCLUDED.status = 'bounced' THEN 'bounced'
              ELSE EXCLUDED.status
            END,  
            retry_count = CASE 
              WHEN EXCLUDED.status = 'temporary' 
                THEN email_suppression.retry_count + 1
              ELSE email_suppression.retry_count
            END,
            updated = NOW()
          `, [r.emailAddress, status]);
      }
    }

    if (message.eventType === "Complaint" || message.notificationType === "Complaint") {
      const complained = message.complaint?.complainedRecipients || [];

      for (const r of complained) {
        console.log("Complained:", r.emailAddress);

        await db.query(`
          INSERT INTO email_suppression (email, status)
          VALUES ($1, $2)
          ON CONFLICT (email)
          DO UPDATE SET
            status = EXCLUDED.status,
            updated = NOW()
          `, [r.emailAddress, 'complained']);
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("SES webhook error:", err);
    res.sendStatus(500);
  }
});

export default router;