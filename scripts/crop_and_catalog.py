import os, sys, json
import cv2
import numpy as np
from PIL import Image

src_folder = '/Users/harshitgoyal/.gemini/antigravity-ide/brain/f4dc23fc-cdbb-4248-aa36-54bd427285b3/.user_uploaded'
dest_folder = '/Users/harshitgoyal/marvelous/public/assets/gallery'
os.makedirs(dest_folder, exist_ok=True)

files = sorted([f for f in os.listdir(src_folder) if f.endswith('.jpg')])

def detect_precise_photo_bounds(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return None
    h, w, c = img.shape

    # Check for direct photos without mobile Instagram frame
    if w > 550 or h < 800:
        return (0, 0, w, h), "direct", 1.0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Check light mode vs dark mode in Instagram post
    header_sample = gray[120:165, 20:w-20]
    header_mean = np.mean(header_sample)
    is_dark = header_mean < 80
    
    row_means = np.mean(gray[:, 10:w-10], axis=1)
    row_stds = np.std(gray[:, 10:w-10], axis=1)
    
    # 1. Find Top Boundary
    y_top = None
    if not is_dark:
        # Search between y=140 and y=240 for white profile header ending
        for y in range(140, 240):
            # Profile row is white: row_means > 244, row_stds < 18
            if row_means[y] > 240 and row_stds[y] < 20:
                # Look for transition
                if y + 1 < h and (row_means[y+1] <= 238 or row_stds[y+1] >= 20):
                    y_top = y + 1
                    break
    else:
        # Search between y=140 and y=240 for dark profile header ending
        for y in range(140, 240):
            if row_means[y] < 25 and row_stds[y] < 15:
                if y + 1 < h and (row_means[y+1] >= 28 or row_stds[y+1] >= 18):
                    y_top = y + 1
                    break

    # Fallback for stories / reels or non-standard header
    if y_top is None:
        # Check from 50 downwards
        for y in range(50, 260):
            if not is_dark:
                if row_means[y] > 242 and row_stds[y] < 18 and (row_means[y+1] <= 240 or row_stds[y+1] >= 20):
                    y_top = y + 1
                    break
            else:
                if row_means[y] < 22 and row_stds[y] < 15 and (row_means[y+1] >= 25 or row_stds[y+1] >= 18):
                    y_top = y + 1
                    break

    if y_top is None:
        y_top = 180

    # 2. Find Bottom Boundary
    # Instagram photos typically have min height ~250 and max height ~640
    y_bottom = None
    min_h = 240
    max_search_y = min(h - 30, y_top + 680)

    for y in range(y_top + min_h, max_search_y):
        if not is_dark:
            # Action bar / carousel dots row is white
            if y + 3 < h and all(row_means[y+k] > 244 and row_stds[y+k] < 16 for k in range(1, 4)):
                y_bottom = y
                break
        else:
            # Action bar is dark
            if y + 3 < h and all(row_means[y+k] < 25 and row_stds[y+k] < 15 for k in range(1, 4)):
                y_bottom = y
                break

    # Fallback aspect ratio heuristics if boundary was not a crisp solid bar
    if y_bottom is None or (y_bottom - y_top) < 200:
        # Standard Instagram heights for width 471:
        # Square: 471
        # Portrait 4:5: 588
        # 16:9 landscape: 265
        candidate_square = y_top + w
        candidate_portrait = y_top + int(w * 1.25)
        if candidate_portrait < h - 50:
            y_bottom = candidate_portrait
        elif candidate_square < h - 50:
            y_bottom = candidate_square
        else:
            y_bottom = min(h - 40, y_top + 471)

    # 3. Horizontal bounds (check for lateral padding or letterbox)
    x1 = 0
    x2 = w
    col_means = np.mean(gray[y_top+15:y_bottom-15, :], axis=0)
    col_stds = np.std(gray[y_top+15:y_bottom-15, :], axis=0)
    
    if not is_dark:
        while x1 < 40 and col_means[x1] > 248 and col_stds[x1] < 12:
            x1 += 1
        while x2 > w - 40 and col_means[x2-1] > 248 and col_stds[x2-1] < 12:
            x2 -= 1
    else:
        while x1 < 40 and col_means[x1] < 18 and col_stds[x1] < 12:
            x1 += 1
        while x2 > w - 40 and col_means[x2-1] < 18 and col_stds[x2-1] < 12:
            x2 -= 1

    return (x1, y_top, x2, y_bottom), "dark" if is_dark else "light", round((y_bottom-y_top)/(x2-x1), 2)

catalog = []
for idx, f in enumerate(files):
    p = os.path.join(src_folder, f)
    bounds_info = detect_precise_photo_bounds(p)
    if not bounds_info:
        continue
    (x1, y1, x2, y2), mode, ratio = bounds_info
    
    # Read and crop with PIL for lossless quality
    orig_im = Image.open(p)
    cropped = orig_im.crop((x1, y1, x2, y2))
    
    # Save cropped image
    out_name = f"marvelous_art_{idx+1:02d}.jpg"
    out_path = os.path.join(dest_folder, out_name)
    cropped.save(out_path, quality=95)
    
    catalog.append({
        "id": idx + 1,
        "source": f,
        "cropped_file": out_name,
        "width": x2 - x1,
        "height": y2 - y1,
        "aspect_ratio": ratio,
        "mode": mode,
        "bounds": [x1, y1, x2, y2]
    })

print(f"Successfully cropped {len(catalog)} images into {dest_folder}")

with open("/Users/harshitgoyal/marvelous/public/assets/gallery/catalog.json", "w") as jf:
    json.dump(catalog, jf, indent=2)

# Generate visual contact sheet HTML
html = [
    "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Marvelous Gallery Crops</title>",
    "<style>",
    "body { font-family: -apple-system, sans-serif; background: #120b08; color: #f5efe7; padding: 20px; }",
    "h1 { color: #e5ceb0; font-weight: 300; }",
    ".grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }",
    ".card { background: rgba(255,255,255,0.05); border: 1px solid rgba(229,206,176,0.2); border-radius: 8px; overflow: hidden; }",
    ".card img { width: 100%; height: 260px; object-fit: cover; display: block; }",
    ".meta { padding: 8px 12px; font-size: 11px; color: #d0c0b0; }",
    ".meta strong { color: #fff; display: block; font-size: 12px; margin-bottom: 4px; }",
    "</style></head><body>",
    f"<h1>Marvelous Art Gallery Crops ({len(catalog)} images)</h1>",
    "<div class='grid'>"
]

for item in catalog:
    html.append(f"""
    <div class='card'>
        <img src='/assets/gallery/{item["cropped_file"]}' alt='Photo {item["id"]}' />
        <div class='meta'>
            <strong>#{item['id']} · {item['cropped_file']}</strong>
            <span>{item['width']}x{item['height']} (ratio: {item['aspect_ratio']})</span>
            <div>Mode: {item['mode']}</div>
        </div>
    </div>
    """)

html.append("</div></body></html>")

with open("/Users/harshitgoyal/marvelous/public/gallery-contact-sheet.html", "w") as hf:
    hf.write("".join(html))

print("Contact sheet created at public/gallery-contact-sheet.html")
