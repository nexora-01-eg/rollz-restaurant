from pathlib import Path

from PIL import Image


SOURCE = Path("/home/ubuntu/webdev-static-assets/rollz-3d-location-map-base.png")
DESTINATION = Path("/home/ubuntu/webdev-static-assets/rollz-3d-location-map.webp")
MAX_EDGE = 1680


def main() -> None:
    with Image.open(SOURCE) as source:
        image = source.convert("RGB")
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        image.save(DESTINATION, "WEBP", quality=88, method=6)


if __name__ == "__main__":
    main()
