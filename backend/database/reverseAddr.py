import requests
import math

BASE_URL = "http://localhost:8080"


OVERPASS = "http://localhost:12345/api/interpreter"

OVERPASS_ONLINE = "https://overpass-api.de/api/interpreter"

def get_nearby_house_numbers(lat, lon, radius=50):
    query = f"""
    [out:json]
    [timeout:90];
    (
      node(around:{radius},{lat},{lon})["addr:housenumber"];
      way(around:{radius},{lat},{lon})["addr:housenumber"];
    );
    out center tags;
    """

    r = requests.post(OVERPASS_ONLINE, data=query, timeout=60)
    r.raise_for_status()
    print(r.url)
    print(query)

    try:
        data = r.json()
    except Exception as e:
        print("Overpass response was invalid JSON:")
        print(r.text[:500])
        raise e

    nums = []
    elements = []

    for element in data['elements']:
        elements.append(element)

    elements.sort(key=lambda item:sort_haversine(item,lat,lon))

    for element in elements:
        print(element)
        
        hn = element["tags"].get("addr:housenumber")
        if hn:
            nums.append(hn)

    return nums


def sort_haversine(item,lat,lon):
    if not item:
        return float('inf')
    
    # Node
    if 'lat' in item and 'lon' in item:
        lat1, lon1 = item['lat'], item['lon']
    # Way
    elif 'center' in item:
        lat1, lon1 = item['center']['lat'], item['center']['lon']
    else:
        return float('inf')
    
    return haversine(lat1, lon1, lat, lon)


def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = phi2 - phi1
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return int(2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a)))





def reverse(lat, lon):
    r = requests.get(
        f"{BASE_URL}/reverse",
        params={
            "format": "json",
            "lat": lat,
            "lon": lon,
            "zoom": 18,
            "addressdetails": 1
        },
        timeout=10
    )
    r.raise_for_status()
    return r.json()


def find_nearby_house_number(lat, lon, road, city, radius_m=10000):
    delta = radius_m / 111_320

    r = requests.get(
        f"{BASE_URL}/search",
        params={
            "format": "json",
            "street": road,
            "city": city,
            "viewbox": f"{lon-delta},{lat+delta},{lon+delta},{lat-delta}",
            "bounded": 1,
            "addressdetails": 1,
            "limit": 50
        },
        timeout=10
    )
    r.raise_for_status()
    print(r.url)
    for res in r.json():
        addr = res.get("address", {})

        if "house_number" in addr:
            hn = addr.get("house_number")
            return int(hn)

    return None

def reverseAddress(lat, lon):
    rev = reverse(lat, lon)
    addr = rev.get("address", {})

    if "house_number" in addr:
        rev["source"] = "direct"
        return rev

    road = addr.get("road")
    city = addr.get("city") or addr.get("town") or addr.get("village")

    if not road or not city:
        rev["source"] = "no_context"
        return rev

    nearby = find_nearby_house_number(lat, lon, road, city)

    if nearby is not None:
        rev["source"] = "estimated"
        addr["house_number"] = nearby + 2
        return rev

    rev["source"] = "no_context"
    return rev
