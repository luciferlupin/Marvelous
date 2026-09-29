import os, sys
import cv2
import numpy as np
from PIL import Image

src_folder = '/Users/harshitgoyal/.gemini/antigravity-ide/brain/f4dc23fc-cdbb-4248-aa36-54bd427285b3/.user_uploaded'
dest_folder = '/Users/harshitgoyal/marvelous/public/assets/gallery'
os.makedirs(dest_folder, exist_ok=True)

files = sorted([f for f in os.listdir(src_folder) if f.endswith('.jpg')])
print(f"Total uploaded files found: {len(files)}")

def find_crop_bounds(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return None
    h, w, c = img.shape
    
    # Check if already a standalone photo (e.g. landscape or width > 500)
    if w > 550 or h < 800:
        # Check if there are black letterbox bars or status bars
        return (0, 0, w, h), "direct_photo"
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Instagram screenshots on iPhone:
    # Status bar: 0..45 px
    # Nav bar: ~45..110 px ("< Posts marvelous_salon_academy")
    # Post header: ~110..175 px (avatar + username + menu dots)
    # Background in light mode: ~255 (white)
    # Background in dark mode: ~0-20 (black)
    
    # Check if post header area (rows 120-160) is light or dark
    header_sample = gray[120:165, 20:w-20]
    header_mean = np.mean(header_sample)
    is_dark_mode = header_mean < 80
    
    # Calculate row-by-row statistics across central width
    row_means = np.mean(gray[:, 15:w-15], axis=1)
    row_stds = np.std(gray[:, 15:w-15], axis=1)
    
    # Search for top boundary (where header background transitions to the photo)
    # Typically occurs between y = 150 and y = 230
    y_top = None
    if not is_dark_mode:
        # In light mode: look for transition from white background (mean > 240, std < 18) to photo
        for y in range(150, 230):
            if row_means[y] > 242 and row_stds[y] < 20:
                # Check next 3 rows to see if they deviate from white
                if any(row_means[y+k] < 235 or row_stds[y+k] > 22 for k in range(1, 4)):
                    y_top = y + 1
                    break
    else:
        # In dark mode: look for transition from dark background (mean < 25, std < 15) to photo
        for y in range(150, 230):
            if row_means[y] < 25 and row_stds[y] < 15:
                if any(row_means[y+k] > 30 or row_stds[y+k] > 18 for k in range(1, 4)):
                    y_top = y + 1
                    break
                    
    # Fallback if not found in standard range
    if y_top is None:
        # Could be a scrolled screenshot where post header is higher up, or a story/reel
        # Let's find first significant image region between 60 and 250
        for y in range(60, 250):
            if not is_dark_mode:
                if row_means[y] > 240 and (row_means[y+1] <= 240 or row_stds[y+1] > 20):
                    y_top = y + 1
                    break
            else:
                if row_means[y] < 25 and (row_means[y+1] >= 25 or row_stds[y+1] > 20):
                    y_top = y + 1
                    break
    
    if y_top is None:
        y_top = 180 # default safe estimate
        
    # Search for bottom boundary
    # In Instagram, posts are either square (1:1 -> height == width == 471),
    # 4:5 portrait (height == width * 1.25 == ~589),
    # or landscape (height < 471, e.g. ~265 or ~350..400)
    # Below the photo is the action bar (like/comment/share) on white or black
    y_bottom = None
    min_photo_h = 240
    max_search_y = min(h - 40, y_top + 680)
    
    for y in range(y_top + min_photo_h, max_search_y):
        if not is_dark_mode:
            # Look for 3 consecutive white rows
            if y + 3 < h and all(row_means[y+k] > 245 and row_stds[y+k] < 16 for k in range(1, 4)):
                y_bottom = y
                break
        else:
            # Look for 3 consecutive dark rows
            if y + 3 < h and all(row_means[y+k] < 25 and row_stds[y+k] < 15 for k in range(1, 4)):
                y_bottom = y
                break
                
    if y_bottom is None:
        # Check standard aspect ratios: square (w), 4:5 (w*1.25), 1.33:1 (w*1.33)
        # Let's inspect rows around y_top + 471 and y_top + 589
        for test_h in [int(w * 1.25), int(w * 1.33), w]:
            candidate_y = y_top + test_h
            if candidate_y < h - 40:
                y_bottom = candidate_y
                break
        if y_bottom is None:
            y_bottom = y_top + w
            
    # X bounds: usually full width (0..w), but check for white or black side bars
    col_means = np.mean(gray[y_top+20:y_bottom-20, :], axis=0)
    x_left = 0
    x_right = w
    if not is_dark_mode:
        while x_left < 30 and col_means[x_left] > 250:
            x_left += 1
        while x_right > w - 30 and col_means[x_right - 1] > 250:
            x_right -= 1
    else:
        while x_left < 30 and col_means[x_left] < 15:
            x_left += 1
        while x_right > w - 30 and col_means[x_right - 1] < 15:
            x_right -= 1

    return (x_left, y_top, x_right, y_bottom), "dark" if is_dark_mode else "light"

crops = []
for idx, f in enumerate(files):
    p = os.path.join(src_folder, f)
    res = find_crop_bounds(p)
    if res:
        bounds, mode = res
        x1, y1, x2, y2 = bounds
        crops.append((f, x1, y1, x2, y2, x2-x1, y2-y1, mode))

print(f"Processed {len(crops)} images.")
for c in crops[:15]:
    print(c)
