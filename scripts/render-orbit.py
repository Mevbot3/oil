#!/usr/bin/env python3
"""Richer $OIL orbit loop — steel plate, glow trails, real barrel."""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

W, H = 1280, 720
CX, CY = 640, 368
FPS = 30
SECONDS = 5
FRAMES = FPS * SECONDS

GOLD = (232, 184, 74)
GOLD_HOT = (255, 214, 110)
GOLD_MID = (196, 150, 52)
GOLD_DIM = (120, 88, 28)
CREAM = (244, 236, 220)
INK = (10, 10, 10)

OUT = Path("/tmp/oil-orbit-v2/frames")
STILL = Path("/tmp/oil-orbit-v2/still.png")
FONTS = {
    "anton": "/home/ubuntu/.local/share/fonts/Anton-Regular.ttf",
    "news": "/tmp/newsreader/Newsreader.ttf",
    "news_i": "/tmp/newsreader/Newsreader-Italic.ttf",
}
STEEL = "/opt/cursor/artifacts/assets/live-bg-steel.png"
BARREL_SVG = "/workspace/public/brand/barrel-mascot.svg"
BARREL_PNG = "/tmp/oil-orbit-v2/barrel.png"

ORBIT = 250
PLATE_R = 150
ICON_R = 64


def font(key: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONTS[key], size)


def new_layer(size: tuple[int, int] | None = None) -> Image.Image:
    return Image.new("RGBA", size or (W, H), (0, 0, 0, 0))


def ellipse(draw: ImageDraw.ImageDraw, x: float, y: float, r: float, fill, width=0, outline=None):
    box = [x - r, y - r, x + r, y + r]
    if width:
        draw.ellipse(box, outline=outline or fill, width=width)
    else:
        draw.ellipse(box, fill=fill, outline=outline)


def make_bg() -> Image.Image:
    steel = Image.open(STEEL).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    steel = ImageEnhance.Brightness(steel).enhance(1.45)
    steel = ImageEnhance.Contrast(steel).enhance(1.2)
    steel = ImageEnhance.Color(steel).enhance(1.3)
    img = steel.convert("RGBA")
    light = new_layer()
    d = ImageDraw.Draw(light)
    d.ellipse([680, -120, 1520, 560], fill=(255, 196, 80, 48))
    light = light.filter(ImageFilter.GaussianBlur(88))
    img = Image.alpha_composite(img, light)
    pool = new_layer()
    d = ImageDraw.Draw(pool)
    d.ellipse([CX - 460, CY - 320, CX + 460, CY + 360], fill=(255, 190, 70, 28))
    pool = pool.filter(ImageFilter.GaussianBlur(74))
    img = Image.alpha_composite(img, pool)
    vig = new_layer()
    vd = ImageDraw.Draw(vig)
    for i, a in enumerate((110, 70, 40)):
        m = 36 + i * 30
        vd.rectangle([0, 0, W, m], fill=(0, 0, 0, a))
        vd.rectangle([0, H - m, W, H], fill=(0, 0, 0, a))
        vd.rectangle([0, 0, m, H], fill=(0, 0, 0, a // 2))
        vd.rectangle([W - m, 0, W, H], fill=(0, 0, 0, a // 2))
    vig = vig.filter(ImageFilter.GaussianBlur(26))
    return Image.alpha_composite(img, vig)


def make_ring_glow(radius: float, width: int, color, blur: int, alpha: int) -> Image.Image:
    layer = new_layer()
    d = ImageDraw.Draw(layer)
    ellipse(d, CX, CY, radius, None, width=width, outline=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def dashed_ring(draw: ImageDraw.ImageDraw, r: float, start: float, dash: float, gap: float, color, width: int):
    a = start
    end = start + 360
    while a < end:
        draw.arc([CX - r, CY - r, CX + r, CY + r], a, min(a + dash, end), fill=color, width=width)
        a += dash + gap


def raster_barrel() -> Image.Image:
    os.system(f"rsvg-convert -w 280 -h 280 {BARREL_SVG} -o {BARREL_PNG}")
    mascot = Image.open(BARREL_PNG).convert("RGBA")
    # restore a readable flame above the drum so it doesn't die at icon size
    canvas = Image.new("RGBA", (280, 320), (0, 0, 0, 0))
    canvas.paste(mascot, (0, 40), mascot)
    d = ImageDraw.Draw(canvas)
    d.line([(188, 58), (210, 18), (228, 48), (242, 8)], fill=(*GOLD_HOT, 255), width=10)
    ellipse(d, 246, 8, 9, (*GOLD_HOT, 255))
    return canvas


def draw_drop(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = size
    pts = [
        (s * 0.50, s * 0.06),
        (s * 0.80, s * 0.46),
        (s * 0.74, s * 0.72),
        (s * 0.50, s * 0.92),
        (s * 0.26, s * 0.72),
        (s * 0.20, s * 0.46),
    ]
    d.polygon(pts, fill=(*GOLD, 255))
    d.ellipse([s * 0.26, s * 0.48, s * 0.74, s * 0.92], fill=(*GOLD_HOT, 255))
    d.ellipse([s * 0.36, s * 0.20, s * 0.54, s * 0.40], fill=(255, 236, 180, 230))
    return img


def draw_uso(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = size / 2
    r = size * 0.46
    ellipse(d, c, c, r, (*GOLD_HOT, 255))
    ellipse(d, c, c, r * 0.86, (*GOLD, 255))
    ellipse(d, c, c, r * 0.86, None, width=max(3, size // 32), outline=(*INK, 200))
    ellipse(d, c, c, r * 0.98, None, width=3, outline=(255, 236, 180, 200))
    f = font("anton", max(22, int(size * 0.28)))
    t = "USO"
    bb = d.textbbox((0, 0), t, font=f)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    d.text((c - tw / 2, c - th / 2 - size * 0.02), t, font=f, fill=INK)
    return img


def draw_jack(size: int, nod: float) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = float(size)
    gold = (*GOLD_HOT, 255)
    dark = (*INK, 255)
    # base pad
    d.rounded_rectangle([s * 0.10, s * 0.86, s * 0.90, s * 0.96], radius=5, fill=gold)
    # filled A-frame
    d.polygon(
        [
            (s * 0.28, s * 0.86),
            (s * 0.50, s * 0.26),
            (s * 0.72, s * 0.86),
            (s * 0.62, s * 0.86),
            (s * 0.50, s * 0.46),
            (s * 0.38, s * 0.86),
        ],
        fill=gold,
    )
    d.polygon([(s * 0.36, s * 0.62), (s * 0.64, s * 0.62), (s * 0.62, s * 0.70), (s * 0.38, s * 0.70)], fill=gold)
    beam_y = s * 0.28 + nod * s * 0.05
    head_y = s * 0.16 + nod * s * 0.11
    tail_y = s * 0.38 - nod * s * 0.10
    # walking beam as a thick quad
    d.polygon(
        [
            (s * 0.12, head_y - s * 0.04),
            (s * 0.90, tail_y - s * 0.04),
            (s * 0.90, tail_y + s * 0.05),
            (s * 0.12, head_y + s * 0.05),
        ],
        fill=gold,
    )
    # horsehead
    d.pieslice(
        [s * 0.00, head_y - s * 0.10, s * 0.28, head_y + s * 0.18],
        200,
        40,
        fill=gold,
    )
    d.rectangle([s * 0.07, head_y + s * 0.04, s * 0.14, s * 0.86], fill=gold)
    ellipse(d, s * 0.88, tail_y + s * 0.04, s * 0.09, gold)
    ellipse(d, s * 0.88, tail_y + s * 0.04, s * 0.04, dark)
    return img


def icon_pedestal(icon: Image.Image, disc_r: int) -> Image.Image:
    pad = disc_r * 2 + 72
    img = Image.new("RGBA", (pad, pad), (0, 0, 0, 0))
    c = pad / 2
    glow = Image.new("RGBA", (pad, pad), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    ellipse(gd, c, c + 4, disc_r + 16, (255, 200, 80, 110))
    glow = glow.filter(ImageFilter.GaussianBlur(14))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)
    ellipse(d, c, c + 4, disc_r, (8, 7, 5, 242))
    ellipse(d, c, c + 4, disc_r, None, width=5, outline=(*GOLD_HOT, 255))
    ellipse(d, c, c + 4, disc_r - 9, None, width=2, outline=(*GOLD_DIM, 210))
    iw, ih = icon.size
    scale = (disc_r * 1.95) / max(iw, ih)
    icon = icon.resize((max(1, int(iw * scale)), max(1, int(ih * scale))), Image.Resampling.LANCZOS)
    ix = int(c - icon.size[0] / 2)
    iy = int(c + 2 - icon.size[1] / 2)
    img.paste(icon, (ix, iy), icon)
    return img


def make_plate(pulse: float) -> Image.Image:
    layer = new_layer()
    r = PLATE_R
    bloom = new_layer()
    bd = ImageDraw.Draw(bloom)
    ellipse(bd, CX, CY, r + 22 + pulse * 10, (255, 200, 80, int(55 + pulse * 50)))
    bloom = bloom.filter(ImageFilter.GaussianBlur(20))
    layer = Image.alpha_composite(layer, bloom)
    d = ImageDraw.Draw(layer)
    ellipse(d, CX, CY, r, (8, 7, 5, 240))
    for i, col, w in (
        (0, (*GOLD_HOT, 255), 8),
        (7, (*INK, 190), 2),
        (11, (*GOLD_MID, 240), 3),
    ):
        ellipse(d, CX, CY, r - i, None, width=w, outline=col)
    sheen = new_layer()
    sd = ImageDraw.Draw(sheen)
    sd.ellipse([CX - 86, CY - 140, CX + 36, CY - 16], fill=(255, 230, 160, 32))
    sheen = sheen.filter(ImageFilter.GaussianBlur(16))
    layer = Image.alpha_composite(layer, sheen)
    return layer


def draw_chrome(base: Image.Image) -> Image.Image:
    img = base.copy()
    d = ImageDraw.Draw(img)
    kicker = font("news", 20)
    live_f = font("anton", 24)
    d.text((52, 38), "OIL", font=kicker, fill=CREAM)
    d.text((52, 62), "on Pons", font=kicker, fill=(*GOLD, 235))
    label = "LIVE"
    bb = d.textbbox((0, 0), label, font=live_f)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    pad_x, pad_y = 16, 9
    x2, y1 = W - 52, 36
    x1 = x2 - tw - pad_x * 2
    y2 = y1 + th + pad_y * 2
    d.rounded_rectangle([x1, y1, x2, y2], radius=3, outline=GOLD, width=2)
    d.text((x1 + pad_x, y1 + pad_y - 5), label, font=live_f, fill=GOLD)
    foot = font("news", 20)
    d.text((52, H - 52), "$OIL", font=foot, fill=(*CREAM, 190))
    return img


def draw_type(img: Image.Image, pulse: float) -> Image.Image:
    layer = new_layer()
    d = ImageDraw.Draw(layer)
    live = font("news_i", 50)
    drill = font("anton", 74)
    t1 = "$OIL is live."
    t2 = "DRILL IT"
    b1 = d.textbbox((0, 0), t1, font=live)
    b2 = d.textbbox((0, 0), t2, font=drill)
    w1 = b1[2] - b1[0]
    w2, h2 = b2[2] - b2[0], b2[3] - b2[1]
    x1, y1 = CX - w1 / 2, CY - 58
    x2, y2 = CX - w2 / 2, CY + 6
    d.text((x1, y1), t1, font=live, fill=CREAM)
    glow = new_layer()
    gd = ImageDraw.Draw(glow)
    gd.text((x2, y2), t2, font=drill, fill=(*GOLD_HOT, int(100 + pulse * 100)))
    glow = glow.filter(ImageFilter.GaussianBlur(int(10 + pulse * 7)))
    layer = Image.alpha_composite(layer, glow)
    d = ImageDraw.Draw(layer)
    d.text((x2, y2), t2, font=drill, fill=GOLD_HOT)
    uy = y2 + h2 + 8
    lw = w2 * (0.70 + 0.14 * pulse)
    d.line([(CX - lw / 2, uy), (CX + lw / 2, uy)], fill=(*GOLD, 235), width=3)
    return Image.alpha_composite(img, layer)


def sparks(t: float) -> Image.Image:
    layer = new_layer()
    d = ImageDraw.Draw(layer)
    for i in range(56):
        seed = i * 17.13
        ang = (seed + t * (16 + (i % 5) * 8)) * math.pi / 180
        rad = 200 + (i * 41) % 180
        x = CX + math.cos(ang) * rad
        y = CY + math.sin(ang) * rad * 0.94
        twinkle = 0.35 + 0.65 * (0.5 + 0.5 * math.sin(t * 7 + seed))
        r = 1.3 + (i % 4) * 0.7
        a = int(90 + 150 * twinkle)
        ellipse(d, x, y, r, (255, 214, 110, a))
    return layer


def gauge_ticks(draw: ImageDraw.ImageDraw, t: float) -> None:
    r = 188
    spin = t * 18
    for i in range(36):
        ang = math.radians(i * 10 + spin)
        inner = r - (7 if i % 3 == 0 else 4)
        x1 = CX + math.cos(ang) * inner
        y1 = CY + math.sin(ang) * inner
        x2 = CX + math.cos(ang) * r
        y2 = CY + math.sin(ang) * r
        col = (*GOLD_HOT, 200) if i % 3 == 0 else (*GOLD_DIM, 130)
        draw.line([(x1, y1), (x2, y2)], fill=col, width=2 if i % 3 == 0 else 1)


def render_frame(
    t: float,
    bg: Image.Image,
    ring_a: Image.Image,
    ring_b: Image.Image,
    barrel: Image.Image,
    uso: Image.Image,
    drop: Image.Image,
) -> Image.Image:
    img = bg.copy()
    img = Image.alpha_composite(img, ring_a)
    img = Image.alpha_composite(img, ring_b)
    d = ImageDraw.Draw(img)
    ellipse(d, CX, CY, ORBIT, None, width=4, outline=(*GOLD, 230))
    ellipse(d, CX, CY, 188, None, width=2, outline=(*GOLD_DIM, 160))
    dashed_ring(d, ORBIT + 52, -t * 52, 16, 9, (*GOLD_HOT, 220), 4)
    dashed_ring(d, ORBIT + 52, -t * 52 + 180, 16, 9, (*GOLD, 110), 2)
    # traveling hot arc
    hot = (t * 72) % 360
    d.arc([CX - ORBIT, CY - ORBIT, CX + ORBIT, CY + ORBIT], hot - 18, hot + 18, fill=(*GOLD_HOT, 255), width=7)
    gauge_ticks(d, t)

    icons = [
        ("barrel", 0),
        ("uso", 90),
        ("drop", 180),
        ("jack", 270),
    ]
    spin = t * 72

    trails = new_layer()
    td = ImageDraw.Draw(trails)
    for _name, base in icons:
        ang0 = math.radians(base + spin)
        for k in range(1, 16):
            ang = ang0 - k * 0.08
            x = CX + math.cos(ang) * ORBIT
            y = CY + math.sin(ang) * ORBIT
            a = int(18 + 100 * (1 - k / 16))
            ellipse(td, x, y, 20 - k * 0.7, (255, 200, 80, a))
    trails = trails.filter(ImageFilter.GaussianBlur(7))
    img = Image.alpha_composite(img, trails)

    nod = math.sin(t * math.pi * 2)
    jack = icon_pedestal(draw_jack(160, nod), ICON_R)
    sprites = {"barrel": barrel, "uso": uso, "drop": drop, "jack": jack}

    for name, base in icons:
        ang = math.radians(base + spin)
        x = CX + math.cos(ang) * ORBIT
        y = CY + math.sin(ang) * ORBIT
        spr = sprites[name]
        img.paste(spr, (int(x - spr.size[0] / 2), int(y - spr.size[1] / 2)), spr)

    pulse = 0.5 + 0.5 * math.sin(t * math.pi * 2 / 1.4)
    img = Image.alpha_composite(img, make_plate(pulse))
    img = draw_type(img, pulse)
    img = Image.alpha_composite(img, sparks(t))
    img = draw_chrome(img)
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    bg = make_bg()
    ring_a = make_ring_glow(ORBIT, 22, GOLD_HOT, 18, 150)
    ring_b = make_ring_glow(ORBIT + 52, 12, GOLD, 14, 90)
    barrel = icon_pedestal(raster_barrel(), ICON_R)
    uso = icon_pedestal(draw_uso(150), ICON_R)
    drop = icon_pedestal(draw_drop(150), ICON_R)

    still = None
    for i in range(FRAMES):
        t = i / FPS
        frame = render_frame(t, bg, ring_a, ring_b, barrel, uso, drop)
        frame.convert("RGB").save(OUT / f"{i:03d}.png")
        if i == 10:
            still = frame
        if i % 30 == 0:
            print(f"frame {i}/{FRAMES}", flush=True)
    if still:
        still.convert("RGB").save(STILL, quality=95)
    print("done", OUT)


if __name__ == "__main__":
    main()
