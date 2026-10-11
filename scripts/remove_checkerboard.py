from collections import deque
from pathlib import Path
from PIL import Image

src = Path('/home/ubuntu/webdev-static-assets/rollz-3d-fries-alpha-clean.png')
out = Path('/home/ubuntu/webdev-static-assets/rollz-3d-fries-alpha-final.png')
im = Image.open(src).convert('RGBA')
pix = im.load(); w, h = im.size

def bg(x, y):
    r, g, b, a = pix[x, y]
    return max(r, g, b) - min(r, g, b) <= 8 and min(r, g, b) >= 220

seen = bytearray(w * h)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if bg(x, y): q.append((x, y)); seen[y*w+x] = 1
for y in range(h):
    for x in (0, w - 1):
        if bg(x, y) and not seen[y*w+x]: q.append((x, y)); seen[y*w+x] = 1
while q:
    x, y = q.popleft()
    for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
        if 0 <= nx < w and 0 <= ny < h and not seen[ny*w+nx] and bg(nx, ny):
            seen[ny*w+nx] = 1; q.append((nx, ny))
for y in range(h):
    for x in range(w):
        if seen[y*w+x]:
            r, g, b, _ = pix[x, y]
            pix[x, y] = (r, g, b, 0)
im.save(out, optimize=True)
print(out, im.mode, pix[0,0], pix[w//2,h//2])
