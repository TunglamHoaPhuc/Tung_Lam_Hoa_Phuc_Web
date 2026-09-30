import re
import json

with open('c:/Users/MY PC/Tung_Lam_Hoa_Phuc_Web/scratch/sample_gdrive.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for "CT_HPHP_KINHDIGIAO_01" in the html
idx = html.find("CT_HPHP_KINHDIGIAO_01")
print("Index of CT_HPHP_KINHDIGIAO_01:", idx)
if idx != -1:
    print("Surrounding 500 chars:")
    print(html[max(0, idx-300):min(len(html), idx+300)])

# Also search in JS arrays
# Usually Google Drive uses `_DRIVE_ivd` or arrays like:
# [..., "1abc...", ..., "CT_HPHP_KINHDIGIAO_01", ...]
matches = re.findall(r'\["[a-zA-Z0-9_-]{25,}"[^\]]*?CT_HPHP_KINHDIGIAO_01', html)
print("\nJS matches before name:", len(matches))
for m in matches[:5]:
    print("  ", m)

matches_after = re.findall(r'CT_HPHP_KINHDIGIAO_01[^\]]*?"([a-zA-Z0-9_-]{25,})"', html)
print("\nJS matches after name:", len(matches_after))
for m in matches_after[:5]:
    print("  ", m)
