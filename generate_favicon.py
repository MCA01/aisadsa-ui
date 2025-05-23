from PIL import Image
import cairosvg
import io

# Convert SVG to PNG in memory
png_data = cairosvg.svg2png(url='public/favicon.svg', output_width=256, output_height=256)

# Open the PNG data with Pillow
img = Image.open(io.BytesIO(png_data))

# Create different sizes
sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
favicon_images = []

for size in sizes:
    resized = img.resize(size, Image.Resampling.LANCZOS)
    favicon_images.append(resized)

# Save as ICO
favicon_images[0].save(
    'public/favicon.ico',
    format='ICO',
    sizes=sizes,
    append_images=favicon_images[1:]
)

# Save other required sizes for web
img.resize((192, 192), Image.Resampling.LANCZOS).save('public/logo192.png')
img.resize((512, 512), Image.Resampling.LANCZOS).save('public/logo512.png') 