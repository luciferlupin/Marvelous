import os, json
import cv2
import numpy as np
from PIL import Image

src_folder = '/Users/harshitgoyal/.gemini/antigravity-ide/brain/f4dc23fc-cdbb-4248-aa36-54bd427285b3/.user_uploaded'
dest_folder = '/Users/harshitgoyal/marvelous/public/assets/gallery'
os.makedirs(dest_folder, exist_ok=True)

with open('/Users/harshitgoyal/marvelous/public/assets/gallery/ocr_analysis.json') as f:
    ocr_data = json.load(f)

# Map index to OCR data
ocr_map = {item['index']: item for item in ocr_data}
files = sorted([f for f in os.listdir(src_folder) if f.endswith('.jpg')])

gallery_items = []

for idx, f in enumerate(files):
    img_idx = idx + 1
    p = os.path.join(src_folder, f)
    img = cv2.imread(p)
    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. Determine bounding box
    if w > 550 or h < 700:
        # Direct photo
        x1, y1, x2, y2 = 0, 0, w, h
    else:
        # Check specific screen types:
        # Check if it's a Justdial screenshot (black top bar + black bottom bar + ads)
        # y=800..980 has text 'Justdial' or 'Buyers'
        ocr_item = ocr_map.get(img_idx, {})
        full_text = ocr_item.get('text', '').lower()
        
        if 'justdial' in full_text or 'buyers' in full_text:
            # Justdial photo view: Photo is between y=340 and y=590
            # Find photo boundaries in central region
            row_stds = np.std(gray, axis=1)
            row_means = np.mean(gray, axis=1)
            # Find photo start around y=300..360
            y1 = 330
            while y1 < 400 and (row_means[y1] < 15 or row_stds[y1] < 10):
                y1 += 1
            # Find photo end around y=550..620
            y2 = 600
            while y2 > 500 and (row_means[y2-1] < 15 or row_stds[y2-1] < 10):
                y2 -= 1
            x1, x2 = 0, w
        else:
            # Standard Instagram post or story
            row_means = np.mean(gray[:, 10:w-10], axis=1)
            row_stds = np.std(gray[:, 10:w-10], axis=1)
            
            # Find photo row mask
            is_photo = (row_stds > 18) | ((row_means > 25) & (row_means < 240))
            
            # Find longest contiguous stretch
            intervals = []
            start = None
            for y in range(60, h - 40):
                if is_photo[y]:
                    if start is None:
                        start = y
                else:
                    if start is not None:
                        if y - start >= 180:
                            intervals.append((start, y))
                        start = None
            if start is not None and (h - 40 - start) >= 180:
                intervals.append((start, h - 40))
                
            if intervals:
                intervals.sort(key=lambda iv: iv[1] - iv[0], reverse=True)
                y1, y2 = intervals[0]
            else:
                y1, y2 = 180, 180 + w
                
            # Trim borders
            while y1 < y2 - 100 and ((row_means[y1] > 245 and row_stds[y1] < 15) or (row_means[y1] < 20 and row_stds[y1] < 12)):
                y1 += 1
            while y2 > y1 + 100 and ((row_means[y2-1] > 245 and row_stds[y2-1] < 15) or (row_means[y2-1] < 20 and row_stds[y2-1] < 12)):
                y2 -= 1
                
            x1, x2 = 0, w
            col_means = np.mean(gray[y1+10:y2-10, :], axis=0)
            col_stds = np.std(gray[y1+10:y2-10, :], axis=0)
            while x1 < 30 and ((col_means[x1] > 248 and col_stds[x1] < 10) or (col_means[x1] < 18 and col_stds[x1] < 10)):
                x1 += 1
            while x2 > w - 30 and ((col_means[x2-1] > 248 and col_stds[x2-1] < 10) or (col_means[x2-1] < 18 and col_stds[x2-1] < 10)):
                x2 -= 1

    # Crop and save
    orig_im = Image.open(p)
    cropped = orig_im.crop((x1, y1, x2, y2))
    
    out_file = f"marvelous_art_{img_idx:02d}.jpg"
    cropped.save(os.path.join(dest_folder, out_file), quality=95)
    
    # 2. Categorize and build story metadata based on OCR text
    text_lower = ocr_map.get(img_idx, {}).get('text', '').lower()
    
    category = "couture"
    artist = "Marvelous Salon & Academy"
    title = "Signature Haute Artistry"
    subtitle = "Atelier Creation"
    tag = "HAUTE COUTURE"
    date_str = ""
    
    # Extract date if found
    for year in ['2018', '2019', '2020', '2021', '2022', '2023', '2024']:
        if year in text_lower:
            date_str = year
            break
            
    if 'miss multinational' in text_lower or 'multinational' in text_lower or 'miss usa' in text_lower or 'mexico' in text_lower or 'starlets' in text_lower:
        category = "international"
        tag = "GLOBAL PAGEANT"
        if 'miss usa' in text_lower or 'dvninieto' in text_lower:
            title = "Miss USA 2018 · World Winner"
            subtitle = "Official Makeup by Bhavna Pahwa"
            artist = "MUA Bhavna Pahwa"
        elif 'india' in text_lower:
            title = "Miss Multinational India '18"
            subtitle = "Simran Sharma · Atelier Styling"
            artist = "Marvelous Salon Partner"
        elif 'new zealand' in text_lower:
            title = "Miss Multinational New Zealand"
            subtitle = "Simrat Gill · Crown Makeup"
            artist = "MUA Bhavna Pahwa"
        elif 'myanmar' in text_lower:
            title = "Miss Multinational Myanmar"
            subtitle = "Pan Thway · International Stage"
            artist = "Marvelous Salon Partner"
        elif 'mexico' in text_lower:
            title = "Miss Multinational Mexico"
            subtitle = "Tania Morales · Pageant Glamour"
            artist = "Marvelous Salon Partner"
        elif 'malaysia' in text_lower:
            title = "Miss Multinational Malaysia"
            subtitle = "Haute Runway Transformation"
            artist = "Marvelous Salon Partner"
        else:
            title = "Miss Multinational 2018 Finale"
            subtitle = "Official Beauty & Makeup Partner"
            artist = "Marvelous Salon & Academy"
            
    elif 'taapsee' in text_lower or 'mahima' in text_lower or 'sana khan' in text_lower or 'bollywood' in text_lower or 'nier' in text_lower:
        category = "celebrity"
        tag = "CELEBRITY & AWARDS"
        if 'taapsee' in text_lower:
            title = "Taapsee Pannu · Bollywood Glamour"
            subtitle = "Haute Makeover by Bhavna Pahwa"
            artist = "MUA Bhavna Pahwa"
        elif 'mahima' in text_lower:
            title = "Mahima Chaudhary · Special Appearance"
            subtitle = "Atelier Masterpiece at Crowne Plaza"
            artist = "Marvelous Salon"
        elif 'sana khan' in text_lower:
            title = "Sana Khan · Star Transformation"
            subtitle = "Red Carpet Makeover at Crowne Plaza"
            artist = "Marvelous Salon"
        elif 'nier' in text_lower or 'award' in text_lower:
            title = "National Excellence Award"
            subtitle = "National Institute of Education & Research"
            artist = "Marvelous Leadership"
        else:
            title = "Bollywood Mr & Miss India"
            subtitle = "Official Makeup & Hair Partner"
            artist = "Marvelous Salon & Academy"
            
    elif 'schwarzkopf' in text_lower or 'florian' in text_lower:
        category = "hair"
        tag = "MASTERCLASS"
        title = "Schwarzkopf Professional × Florian Hurel"
        subtitle = "Masterclass & Global Colour Innovations"
        artist = "Marvelous Academy"
        
    elif 'sagan' in text_lower or 'bridal' in text_lower or 'photoshoot' in text_lower or 'makeover' in text_lower or 'client' in text_lower:
        category = "bridal"
        tag = "BRIDAL COUTURE"
        if 'sagan' in text_lower:
            title = "The Sagan Ceremony Makeover"
            subtitle = "Luminous Glow & Sculpted Eyes"
            artist = "MUA Bhavna Pahwa"
        elif 'photoshoot' in text_lower:
            title = "Editorial Photoshoot Transformation"
            subtitle = "Haute Occasion Silhouette"
            artist = "MUA Bhavna Pahwa"
        else:
            title = "Bespoke Bridal Transformation"
            subtitle = "Heritage Royal Glamour"
            artist = "MUA Bhavna Pahwa"
            
    elif 'ambience' in text_lower or 'massage' in text_lower or 'justdial' in text_lower:
        category = "sanctuary"
        tag = "THE ATELIER"
        title = "Ashok Vihar Luxury Salon Sanctuary"
        subtitle = "Architectural Styling Suites & Spas"
        artist = "Marvelous Salon Interiors"
        
    elif 'academy' in text_lower or 'courses' in text_lower or 'enroll' in text_lower:
        category = "academy"
        tag = "ACADEMY"
        title = "Marvelous Salon Academy Training"
        subtitle = "Professional Hair & Makeup Diploma"
        artist = "Marvelous Academy"

    gallery_items.append({
        "id": img_idx,
        "src": f"/assets/gallery/{out_file}",
        "width": x2 - x1,
        "height": y2 - y1,
        "aspect_ratio": round((y2 - y1) / (x2 - x1), 2),
        "title": title,
        "subtitle": subtitle,
        "artist": artist,
        "category": category,
        "tag": tag,
        "year": date_str or "Heritage Edit",
        "ocr_snippet": text_lower[:120]
    })

print(f"Processed and cataloged {len(gallery_items)} gallery artworks.")

# Save JSON
with open('/Users/harshitgoyal/marvelous/public/assets/gallery/art_gallery_data.json', 'w') as jf:
    json.dump(gallery_items, jf, indent=2)

print("Saved public/assets/gallery/art_gallery_data.json")
