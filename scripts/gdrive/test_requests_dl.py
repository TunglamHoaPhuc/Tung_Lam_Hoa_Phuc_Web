import requests
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_id = '1btFa06_DDTnBho0cE66K1V6gSNfeoPId'
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

url = f'https://drive.google.com/uc?export=download&id={file_id}'
resp = session.get(url, stream=True)

print("Status:", resp.status_code)
print("Content-Type:", resp.headers.get('Content-Type'))
print("Content-Disposition:", resp.headers.get('Content-Disposition'))

# If it returned HTML warning page
if 'text/html' in resp.headers.get('Content-Type', ''):
    html = resp.text
    # find form action and inputs
    m_action = re.search(r'<form[^>]*action="([^"]+)"', html)
    action = m_action.group(1) if m_action else 'https://drive.usercontent.google.com/download'
    inputs = dict(re.findall(r'<input[^>]*name="([^"]+)"[^>]*value="([^"]+)"', html))
    print("Parsed action:", action)
    print("Parsed inputs:", inputs)
    
    # Send GET/POST with these params
    resp2 = session.get(action, params=inputs, stream=True)
    print("Resp2 Status:", resp2.status_code)
    print("Resp2 Content-Type:", resp2.headers.get('Content-Type'))
    print("Resp2 Content-Disposition:", resp2.headers.get('Content-Disposition'))
    print("Resp2 Content-Length:", resp2.headers.get('Content-Length'))
    
    # Read first 100 bytes
    chunk = next(resp2.iter_content(100))
    print("First 100 bytes of audio:", chunk[:30])
