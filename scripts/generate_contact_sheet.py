import json

with open('/Users/harshitgoyal/marvelous/public/assets/gallery/art_gallery_data.json') as f:
    items = json.load(f)

html = ["""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Marvelous Art Gallery — Verified Crops</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #110a07; color: #f5efe7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; }
  h1 { font-weight: 300; letter-spacing: 0.08em; color: #e5ceb0; margin-bottom: 8px; font-size: 28px; }
  p.sub { color: #a89a8f; margin-bottom: 24px; font-size: 14px; }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
  .filter-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(229,206,176,0.3); color: #e5ceb0; padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(229,206,176,0.2); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, border-color 0.2s; }
  .card:hover { transform: translateY(-3px); border-color: #e5ceb0; }
  .card-img-wrap { width: 100%; height: 260px; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
  .card img { width: 100%; height: 100%; object-fit: cover; }
  .card-badge { position: absolute; top: 10px; left: 10px; background: rgba(18,11,7,0.85); color: #e5ceb0; font-size: 9px; letter-spacing: 0.12em; padding: 3px 8px; border-radius: 3px; border: 1px solid rgba(229,206,176,0.3); }
  .card-year { position: absolute; top: 10px; right: 10px; background: rgba(18,11,7,0.85); color: #d0c0b0; font-size: 9px; padding: 3px 6px; border-radius: 3px; }
  .card-content { padding: 14px; display: flex; flex-direction: column; gap: 4px; flex-grow: 1; }
  .card-title { font-size: 14px; font-weight: 500; color: #fff; line-height: 1.3; }
  .card-subtitle { font-size: 12px; color: #c4b5a5; }
  .card-artist { font-size: 11px; color: #e5ceb0; margin-top: 4px; }
  .card-meta { margin-top: auto; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 10px; color: #7f7267; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <h1>MΛRVELOUS SALON · ART GALLERY CATALOG</h1>
  <p class="sub">58 curated and cleanly cropped original high-fidelity works across Bridal Couture, Miss Multinational, Celebrity Makeovers, Schwarzkopf Masterclasses, and Ashok Vihar Atelier Sanctuary.</p>
  
  <div class="grid">
"""]

for it in items:
    html.append(f"""
    <div class="card" data-cat="{it['category']}">
      <div class="card-img-wrap">
        <img src="{it['src']}" alt="{it['title']}" loading="lazy" />
        <span class="card-badge">{it['tag']}</span>
        <span class="card-year">{it['year']}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">{it['title']}</h3>
        <p class="card-subtitle">{it['subtitle']}</p>
        <p class="card-artist">{it['artist']}</p>
        <div class="card-meta">
          <span>#{it['id']:02d} · {it['width']}x{it['height']}</span>
          <span>{it['category'].upper()}</span>
        </div>
      </div>
    </div>
    """)

html.append("""
  </div>
</body>
</html>
""")

with open('/Users/harshitgoyal/marvelous/public/gallery-contact-sheet.html', 'w') as f:
    f.write("".join(html))
print("Updated public/gallery-contact-sheet.html")
