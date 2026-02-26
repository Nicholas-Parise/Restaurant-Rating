import reverseAddr
import psycopg2

import os 
from dotenv import load_dotenv

load_dotenv()

connection = psycopg2.connect(database=os.getenv("DBNAME"), user=os.getenv("DBUSERNAME"), password=os.getenv("DBPASSWORD"), host=os.getenv("PROD_HOST"), port=5432)
cursor = connection.cursor()

BATCH_SIZE = 100
last_id = 0

update_stmt =('''
    UPDATE locations 
        SET 
            housenumber = COALESCE(%s, housenumber),  
            addr = COALESCE(%s, addr),
            city = COALESCE(%s, city),
            province = COALESCE(%s, province),
            country = COALESCE(%s, country),
            postalcode = COALESCE(%s, postalcode),
            updated = NOW()
        WHERE id = %s
    ''')

while True:
    cursor.execute('''SELECT id, lat, lon from locations 
                WHERE id > %s
                    AND (housenumber IS NULL
                    OR addr IS NULL 
                    OR city IS NULL 
                    OR province IS NULL 
                    OR country IS NULL 
                    OR postalcode IS NULL)
                ORDER BY id
                LIMIT %s;''',(last_id , BATCH_SIZE))

    record = cursor.fetchall()

    if not record:
        print("Done.")
        break

    for row in record:
        id, lat, lon = row
        last_id = id
        
        try:
            res = reverseAddr.reverseAddress(lat, lon)
            addr = res.get("address", {})
            #print(addr)
            #print(res["source"])
            house_number = addr.get("house_number")
            road = addr.get("road")
            city = addr.get("city") or addr.get("town") or addr.get("village")
            province = addr.get("state") or addr.get("province")
            country = addr.get("country")
            postcode = addr.get("postcode")

            #print(house_number, road, city, province, country, postcode, id)

            data = (house_number, road, city, province, country, postcode, id)

            cursor.execute(update_stmt, data)
        except Exception as e:
            print(f"Error on id {id}: {e}")

    connection.commit()
    print("Done: ",last_id," rows")

'''
house = reverseAddr.get_nearby_house_numbers(lat,lon)
print(house)
'''

