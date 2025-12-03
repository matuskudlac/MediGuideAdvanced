import requests

try:
    response = requests.get('http://127.0.0.1:8000/api/products/')
    response.raise_for_status()
    data = response.json()
    
    if 'results' in data:
        count = len(data['results'])
        total = data.get('count', 'Unknown')
        print(f"API returned {count} items in 'results'.")
        print(f"Total count in metadata: {total}")
    else:
        count = len(data)
        print(f"API returned {count} items (no pagination keys found).")
        
except Exception as e:
    print(f"Error: {e}")
