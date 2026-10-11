from pathlib import Path

from PIL import Image


source = Path("/home/ubuntu/webdev-static-assets/rollz-intro-food-art-v4.png")
target = Path("/home/ubuntu/webdev-static-assets/rollz-intro-food-art-v4.webp")

with Image.open(source) as image:
    image = image.convert("RGBA")
    image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    image.save(target, "WEBP", quality=88, method=6)

print(target)
