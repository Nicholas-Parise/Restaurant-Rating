import express from "express";
import db from "../utils/db";
import * as dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/ses', async (req, res) => {
  
  console.log(req.body);

  const snsMessage = req.body;

  if (snsMessage.Type === "SubscriptionConfirmation") {
    await fetch(snsMessage.SubscribeURL);
    return res.sendStatus(200);
  }

  const message = JSON.parse(snsMessage.Message);

  try {
    if (message.notificationType === "Bounce") {
      const bounced = message.bounce.bouncedRecipients;

      for (const r of bounced) {
        await db.query(
          "UPDATE users SET email_status='bounced' WHERE email=$1",
          [r.emailAddress]
        );
      }
    }

    if (message.notificationType === "Complaint") {
      const complained = message.complaint.complainedRecipients;

      for (const r of complained) {
        await db.query(
          "UPDATE users SET email_status='complained' WHERE email=$1",
          [r.emailAddress]
        );
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("SES webhook error:", err);
    res.sendStatus(500);
  }
});

export default router;