import reverseAddr
import psycopg2
from concurrent.futures import ThreadPoolExecutor, as_completed

import os 
from dotenv import load_dotenv
import time

load_dotenv()

connection = psycopg2.connect(
    database=os.getenv("DBNAME"), 
    user=os.getenv("DBUSERNAME"), 
    password=os.getenv("DBPASSWORD"), 
    host=os.getenv("PROD_HOST"), 
    port=5432)

cursor = connection.cursor()

BATCH_SIZE = 100
THREADS = 8
last_id = 0

UPDATE_STMT = ('''UPDATE locations 
                    SET 
                        housenumber = COALESCE(%s, housenumber),  
                        addr = COALESCE(%s, addr),
                        city = COALESCE(%s, city),
                        province = COALESCE(%s, province),
                        country = COALESCE(%s, country),
                        postalcode = COALESCE(%s, postalcode),
                        geocode_attempted = TRUE,  
                        updated = NOW()
                    WHERE id = %s
                ''')

SELECT_STMT = ('''SELECT id, lat, lon from locations 
                WHERE id > %s
                    AND geocode_attempted = FALSE
                    AND (housenumber IS NULL
                    OR addr IS NULL 
                    OR city IS NULL 
                    OR province IS NULL 
                    OR country IS NULL 
                    OR postalcode IS NULL)
                ORDER BY id
                LIMIT %s;''')

# function to process row, send data to API
# @return the data to input into the DB
def process_row(row):
    id, lat, lon = row
    try:
        res = reverseAddr.reverseAddress(lat, lon)
        addr = res.get("address", {})
        house_number = addr.get("house_number")
        road = addr.get("road")
        city = addr.get("city") or addr.get("town") or addr.get("village")
        province = addr.get("state") or addr.get("province")
        country = addr.get("country")
        postcode = addr.get("postcode")

        data = (house_number, road, city, province, country, postcode, id)
        return data 
    except Exception as e:
        print(f"Error on id {id}: {e}")
        return None

# main while loop
while True:
    cursor.execute(SELECT_STMT, (last_id , BATCH_SIZE))

    records = cursor.fetchall()

    if not records:
        print("Done.")
        break

    last_id = records[-1][0]
    results = []

    with ThreadPoolExecutor(max_workers=THREADS) as executor:
        futures = [executor.submit(process_row, r) for r in records]

        for future in as_completed(futures):
            data = future.result()
            if data:
                results.append(data)

    '''
    # single threaded approach
    for row in records:
        id, lat, lon = row
        last_id = id
        data = process_row(row)
        results.append(data)
    '''

    for data in results:
        cursor.execute(UPDATE_STMT, data)

    connection.commit()
    print("Done: ",last_id," rows")
    time.sleep(0.05)

'''
house = reverseAddr.get_nearby_house_numbers(lat,lon)
print(house)
'''

