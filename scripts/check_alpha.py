from PIL import Image
from pathlib import Path
for name in ["/home/ubuntu/webdev-static-assets/rollz-3d-fries-transparent.png", "/home/ubuntu/webdev-static-assets/rollz-3d-fries-alpha-clean.png"]:
    im = Image.open(name)
    print(Path(name).name, im.mode, im.getpixel((0, 0)), im.getpixel((100, 100)))
