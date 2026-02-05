import reverseAddr
import psycopg2

import os 
from dotenv import load_dotenv

load_dotenv()

connection = psycopg2.connect(database=os.getenv("DBNAME"), user=os.getenv("DBUSERNAME"), password=os.getenv("DBPASSWORD"), host=os.getenv("PROD_HOST"), port=5432)

cursor = connection.cursor()

cursor.execute("SELECT id, lat, lon from locations LIMIT 5;")

record = cursor.fetchall()

#print("Data from Db: ", record)

#for row in record:
#print("Data from row:- ", row)
#lat = row[1]
#lon = row[2]

lat=45.53541564941406
lon=-73.5724105834961
house = reverseAddr.get_nearby_house_numbers(lat,lon)
print(house)

'''
res = reverseAddr.reverseAddress(lat, lon)
addr = res.get("address", {})
print(addr)
print(res["source"])
print(addr.get("house_number"), addr.get("road"), addr.get("city"),addr.get("state"),addr.get("country"),addr.get("postcode"))
'''