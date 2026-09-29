import os
import cv2
import numpy as np
from PIL import Image

src_folder = '/Users/harshitgoyal/.gemini/antigravity-ide/brain/f4dc23fc-cdbb-4248-aa36-54bd427285b3/.user_uploaded'
dest_folder = '/Users/harshitgoyal/marvelous/public/assets/gallery'

files = sorted([f for f in os.listdir(src_folder) if f.endswith('.jpg')])

def get_best_photo_bbox(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return None
    h, w, c = img.shape
    
    # Check if already a standalone photo (e.g. landscape or wide)
    if w > 550 or h < 800:
        return (0, 0, w, h)
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Calculate row-by-row means and stds
    row_means = np.mean(gray[:, 10:w-10], axis=1)
    row_stds = np.std(gray[:, 10:w-10], axis=1)
    
    # An Instagram photo is a region with high texture (std > 20) and non-pure color
    # Let's find regions where std > 18 or (mean not in [245..255] and mean not in [0..20])
    is_photo_row = np.zeros(h, dtype=bool)
    for y in range(h):
        m = row_means[y]
        s = row_stds[y]
        # Photo row condition: not pure white UI bar and not pure dark UI bar
        if s > 18 or (25 < m < 242):
            is_photo_row[y] = True
            
    # Find contiguous photo row intervals
    intervals = []
    start = None
    for y in range(50, h - 30):
        if is_photo_row[y]:
            if start is None:
                start = y
        else:
            if start is not None:
                if (y - start) >= 180: # Must be at least 180px tall to be the main photo
                    intervals.append((start, y))
                start = None
    if start is not None and (h - 30 - start) >= 180:
        intervals.append((start, h - 30))
        
    # If no intervals found with >= 180, take the longest interval
    if not intervals:
        longest = (180, 180 + w)
    else:
        # Choose the interval with highest height (or the one closest to standard photo heights: 471 or 588)
        # Usually the post photo is the largest block
        intervals.sort(key=lambda iv: iv[1] - iv[0], reverse=True)
        longest = intervals[0]
        
    y1, y2 = longest
    
    # Refine y1 and y2: trim any remaining white/black rows at the boundary
    while y1 < y2 - 100:
        m = row_means[y1]
        s = row_stds[y1]
        if (m > 246 and s < 18) or (m < 22 and s < 15):
            y1 += 1
        else:
            break
            
    while y2 > y1 + 100:
        m = row_means[y2-1]
        s = row_stds[y2-1]
        if (m > 246 and s < 18) or (m < 22 and s < 15):
            y2 -= 1
        else:
            break
            
    # Horizontal bounds: check for letterbox padding
    col_means = np.mean(gray[y1+10:y2-10, :], axis=0)
    col_stds = np.std(gray[y1+10:y2-10, :], axis=0)
    x1 = 0
    x2 = w
    while x1 < 30 and ((col_means[x1] > 248 and col_stds[x1] < 12) or (col_means[x1] < 18 and col_stds[x1] < 12)):
        x1 += 1
    while x2 > w - 30 and ((col_means[x2-1] > 248 and col_stds[x2-1] < 12) or (col_means[x2-1] < 18 and col_stds[x2-1] < 12)):
        x2 -= 1

    return (x1, y1, x2, y2)

results = []
for idx, f in enumerate(files):
    p = os.path.join(src_folder, f)
    bbox = get_best_photo_bbox(p)
    if not bbox:
        continue
    x1, y1, x2, y2 = bbox
    orig_im = Image.open(p)
    cropped = orig_im.crop((x1, y1, x2, y2))
    
    out_name = f"marvelous_art_{idx+1:02d}.jpg"
    out_path = os.path.join(dest_folder, out_name)
    cropped.save(out_path, quality=95)
    results.append((idx+1, f, out_name, x2-x1, y2-y1, round((y2-y1)/(x2-x1), 2)))

print(f"Refined {len(results)} image crops.")
for r in results:
    if r[3] < 200 or r[4] < 200 or r[5] < 0.6 or r[5] > 1.6:
        print("Flagged:", r)
