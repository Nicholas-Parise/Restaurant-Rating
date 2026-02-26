import requests
import math

BASE_URL = "http://localhost:8080"

OVERPASS = "http://localhost:12345/api/interpreter"

OVERPASS_ONLINE = "https://overpass-api.de/api/interpreter"


# city, town and village is the same.
# state AND province also the same
REQUIRED_FIELDS = [
    "road",
    "suburb",
    "city",
    "town",
    "village",
    "state",
    "province",
    "postcode",
    "country"
]

def is_complete(addr):
    for field in REQUIRED_FIELDS:
        # city/town/village are interchangeable
        if field in ["city", "town", "village"]:
            if not (addr.get("city") or addr.get("town") or addr.get("village")):
                return False
        # state/province are interchangeable
        elif field in ["state", "province"]:
            if not (addr.get("state") or addr.get("province")):
                return False
        else:
            if not addr.get(field):
                return False
    return True


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



def layered_reverse(lat, lon):
    zoom_levels = [18, 16, 14, 10, 8, 5]

    merged = {}

    for zoom in zoom_levels:
        r = requests.get(
            f"{BASE_URL}/reverse",
            params={
                "format": "json",
                "lat": lat,
                "lon": lon,
                "zoom": zoom,
                "addressdetails": 1
            },
            timeout=10
        )
        r.raise_for_status()

        addr = r.json().get("address", {})

        for k, v in addr.items():
            if k not in merged:
                merged[k] = v

    return merged



def reverseAddress(lat, lon):
    rev = reverse(lat, lon)
    base_addr = rev.get("address", {}).copy()

    # If already complete, return immediately
    if is_complete(base_addr):
        rev["source"] = "reverse_complete"
        return rev

    nearby = layered_reverse(lat, lon)

    #print("nearby: ",nearby)


    # collect nearest
    for candidate in nearby:
        candidate_addr = candidate or {}

        if not isinstance(candidate_addr, dict):
            continue

        for key, value in candidate_addr.items():
            if key not in base_addr or not base_addr.get(key):
                base_addr[key] = value


        if is_complete(base_addr):
            break

    rev["address"] = base_addr
    rev["source"] = "reverse_accumulated"

    return rev

