from collections import deque
from pathlib import Path

from PIL import Image

SOURCE = Path("/home/ubuntu/upload/rollz-3d-fries-alpha-clean.png")
OUTPUT = Path("/home/ubuntu/webdev-static-assets/rollz-intro-food-art-v4.png")


def is_checkerboard_pixel(red: int, green: int, blue: int, alpha: int) -> bool:
    """Match only the pale, neutral checkerboard tiles baked into the canvas."""
    chroma = max(red, green, blue) - min(red, green, blue)
    brightness = (red + green + blue) / 3
    return alpha > 0 and chroma <= 16 and brightness >= 202


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    queue: deque[tuple[int, int]] = deque()
    visited: set[tuple[int, int]] = set()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        red, green, blue, alpha = pixels[x, y]
        if not is_checkerboard_pixel(red, green, blue, alpha):
            continue

        pixels[x, y] = (red, green, blue, 0)
        for next_x, next_y in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= next_x < width and 0 <= next_y < height and (next_x, next_y) not in visited:
                queue.append((next_x, next_y))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT, optimize=True)
    transparent_pixels = sum(1 for _, _, _, alpha in image.getdata() if alpha == 0)
    total_pixels = width * height
    print(f"Saved {OUTPUT}")
    print(f"Transparent pixels: {transparent_pixels}/{total_pixels} ({transparent_pixels / total_pixels:.1%})")


if __name__ == "__main__":
    main()
