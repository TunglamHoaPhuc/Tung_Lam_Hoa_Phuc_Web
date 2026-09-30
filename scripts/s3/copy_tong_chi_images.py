import os
import shutil

src_dirs = [
    r'E:\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\TÔNG CHỈ TU HỌC\IMAGE',
    r'E:\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\TÔNG CHỈ TU HỌC',
]

dest_dir = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\public\images\tong-chi'
os.makedirs(dest_dir, exist_ok=True)

copied = []

for sdir in src_dirs:
    if os.path.exists(sdir):
        for item in os.listdir(sdir):
            sp = os.path.join(sdir, item)
            if os.path.isfile(sp) and any(item.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg']):
                # create clean ascii filename or safe filename
                dp = os.path.join(dest_dir, item)
                shutil.copy2(sp, dp)
                copied.append(item)

print(f"Copied {len(copied)} images to {dest_dir}:")
for c in copied:
    print(f" - /images/tong-chi/{c}")
