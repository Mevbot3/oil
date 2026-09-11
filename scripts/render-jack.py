#!/usr/bin/env python3
"""$OIL is now Live. — animated pumpjack loop."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

W, H = 1280, 720
FPS = 30
SECONDS = 5
FRAMES = FPS * SECONDS
REVS = 2  # full crank turns per loop, so the loop is seamless

GOLD = (232, 184, 74)
GOLD_HOT = (255, 214, 110)
GOLD_MID = (196, 150, 52)
CREAM = (244, 236, 220)
INK = (10, 9, 7)

OUT = Path("/tmp/oil-jack/frames")
STILL = Path("/tmp/oil-jack/still.png")
FONTS = {
    "anton": "/home/ubuntu/.local/share/fonts/Anton-Regular.ttf",
    "news": "/tmp/newsreader/Newsreader.ttf",
    "news_i": "/tmp/newsreader/Newsreader-Italic.ttf",
}
STEEL = "/opt/cursor/artifacts/assets/live-bg-steel.png"

GROUND_Y = 604


def font(key: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONTS[key], size)


def layer() -> Image.Image:
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def ellipse(d: ImageDraw.ImageDraw, x, y, r, fill=None, width=0, outline=None):
    box = [x - r, y - r, x + r, y + r]
    if width:
        d.ellipse(box, outline=outline or fill, width=width)
    else:
        d.ellipse(box, fill=fill, outline=outline)


def thick(d: ImageDraw.ImageDraw, p1, p2, w, fill):
    """A beam drawn as a quad so it keeps its weight at any angle."""
    (x1, y1), (x2, y2) = p1, p2
    dx, dy = x2 - x1, y2 - y1
    ln = math.hypot(dx, dy) or 1.0
    nx, ny = -dy / ln * w / 2, dx / ln * w / 2
    d.polygon(
        [
            (x1 + nx, y1 + ny),
            (x2 + nx, y2 + ny),
            (x2 - nx, y2 - ny),
            (x1 - nx, y1 - ny),
        ],
        fill=fill,
    )


def make_bg() -> Image.Image:
    steel = Image.open(STEEL).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    steel = ImageEnhance.Brightness(steel).enhance(1.3)
    steel = ImageEnhance.Contrast(steel).enhance(1.18)
    steel = ImageEnhance.Color(steel).enhance(1.25)
    img = steel.convert("RGBA")

    # low sun behind the jack, right of frame
    glow = layer()
    d = ImageDraw.Draw(glow)
    d.ellipse([760, 150, 1400, 700], fill=(255, 176, 66, 62))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    img = Image.alpha_composite(img, glow)

    core = layer()
    d = ImageDraw.Draw(core)
    d.ellipse([980, 330, 1240, 560], fill=(255, 200, 96, 70))
    core = core.filter(ImageFilter.GaussianBlur(64))
    img = Image.alpha_composite(img, core)

    # ground haze and a soft horizon
    ground = layer()
    d = ImageDraw.Draw(ground)
    d.rectangle([0, GROUND_Y, W, H], fill=(6, 5, 4, 210))
    d.line([(0, GROUND_Y), (W, GROUND_Y)], fill=(*GOLD_MID, 90), width=2)
    ground = ground.filter(ImageFilter.GaussianBlur(3))
    img = Image.alpha_composite(img, ground)

    # keep the left side dark so type stays readable
    scrim = layer()
    d = ImageDraw.Draw(scrim)
    d.rectangle([0, 0, 760, H], fill=(4, 4, 3, 150))
    scrim = scrim.filter(ImageFilter.GaussianBlur(90))
    img = Image.alpha_composite(img, scrim)

    vig = layer()
    d = ImageDraw.Draw(vig)
    for i, a in enumerate((110, 68, 38)):
        m = 34 + i * 30
        d.rectangle([0, 0, W, m], fill=(0, 0, 0, a))
        d.rectangle([0, H - m, W, H], fill=(0, 0, 0, a))
        d.rectangle([0, 0, m, H], fill=(0, 0, 0, a // 2))
        d.rectangle([W - m, 0, W, H], fill=(0, 0, 0, a // 2))
    vig = vig.filter(ImageFilter.GaussianBlur(26))
    return Image.alpha_composite(img, vig)


def beam_angle(theta: float, geo: dict) -> float:
    """Solve the walking beam angle for a crank angle, four-bar style."""
    px, py = geo["pivot"]
    b = geo["rear"]
    cx, cy = geo["crank"]
    r = geo["crank_r"]
    pitman = geo["pitman"]
    pin = (cx + r * math.cos(theta), cy + r * math.sin(theta))

    def err(phi: float) -> float:
        rx = px + b * math.cos(phi)
        ry = py + b * math.sin(phi)
        return math.hypot(pin[0] - rx, pin[1] - ry) - pitman

    lo, hi = -0.42, 0.42
    flo, fhi = err(lo), err(hi)
    if flo * fhi > 0:
        # geometry out of reach; fall back to the nearest limit
        return lo if abs(flo) < abs(fhi) else hi
    for _ in range(48):
        mid = (lo + hi) / 2
        if err(lo) * err(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2


GEO = {
    "pivot": (0.0, -156.0),
    "rear": 104.0,
    "front": 138.0,
    "crank": (128.0, -58.0),
    "crank_r": 32.0,
    "pitman": 100.0,
    "head_r": 42.0,
}


def horsehead(front, phi, head_r):
    """Outline of the horsehead hung off the front of the walking beam."""
    fwd = (-math.cos(phi), -math.sin(phi))  # pivot -> front
    perp = (-fwd[1], fwd[0])
    if perp[1] < 0:
        perp = (-perp[0], -perp[1])  # keep it pointing down

    def at(a_deg: float, r: float):
        a = math.radians(a_deg)
        return (
            front[0] + r * (math.cos(a) * fwd[0] + math.sin(a) * perp[0]),
            front[1] + r * (math.cos(a) * fwd[1] + math.sin(a) * perp[1]),
        )

    outer = [at(a, head_r) for a in range(-52, 108, 8)]
    return [front, *outer], at(100, head_r * 0.95)


def draw_jack(
    img: Image.Image,
    theta: float,
    scale: float,
    origin: tuple[float, float],
    body,
    edge,
    rim_w: int,
) -> Image.Image:
    """Draw one pumpjack silhouette. origin is the base center on the ground."""
    ox, oy = origin
    s = scale

    def P(x: float, y: float) -> tuple[float, float]:
        return (ox + x * s, oy + y * s)

    def PT(pt) -> tuple[float, float]:
        return P(pt[0], pt[1])

    geo = GEO
    phi = beam_angle(theta, geo)
    px, py = geo["pivot"]
    rear = (px + geo["rear"] * math.cos(phi), py + geo["rear"] * math.sin(phi))
    front = (px - geo["front"] * math.cos(phi), py - geo["front"] * math.sin(phi))
    cx, cy = geo["crank"]
    pin = (cx + geo["crank_r"] * math.cos(theta), cy + geo["crank_r"] * math.sin(theta))
    counter = (cx - geo["crank_r"] * math.cos(theta), cy - geo["crank_r"] * math.sin(theta))

    head_pts, bridle = horsehead(front, phi, geo["head_r"])
    # the polish rod stays vertical; the head curve is what takes up the swing
    rod_x = front[0] - geo["head_r"] * 0.10

    jack = layer()
    d = ImageDraw.Draw(jack)

    # pad and skid
    d.polygon([P(-164, 12), P(196, 12), P(186, 0), P(-154, 0)], fill=body)
    d.polygon([P(-104, 0), P(158, 0), P(158, -18), P(-104, -18)], fill=body)

    # wellhead the rod disappears into
    d.polygon(
        [
            P(rod_x - 24, -34),
            P(rod_x + 24, -34),
            P(rod_x + 18, 0),
            P(rod_x - 18, 0),
        ],
        fill=body,
    )
    # polish rod
    thick(d, P(rod_x, bridle[1]), P(rod_x, -30), 9 * s, body)
    # bridle cable from the head down to the rod
    thick(d, PT(bridle), P(rod_x, bridle[1] + 6), 4 * s, body)

    # samson post
    thick(d, P(-52, -18), P(px - 11, py), 16 * s, body)
    thick(d, P(52, -18), P(px + 11, py), 16 * s, body)
    thick(d, P(-32, -80), P(32, -80), 9 * s, body)

    # gearbox and prime mover
    d.polygon([P(96, -18), P(160, -18), P(154, -80), P(104, -80)], fill=body)
    d.polygon([P(24, -18), P(84, -18), P(84, -48), P(24, -48)], fill=body)

    # crank hub, counterweight, pitman
    ellipse(d, *P(cx, cy), 22 * s, body)
    thick(d, PT(counter), PT(pin), 26 * s, body)
    ellipse(d, *PT(counter), 24 * s, body)
    thick(d, PT(pin), PT(rear), 11 * s, body)

    # walking beam and saddle
    thick(d, PT(front), PT(rear), 23 * s, body)
    ellipse(d, *P(px, py), 16 * s, body)

    # horsehead
    d.polygon([PT(p) for p in head_pts], fill=body)

    # gold rim light on the sunward (right) edges
    if rim_w:
        rw = max(1, int(rim_w * s))
        rd = ImageDraw.Draw(jack)
        rd.line([PT(front), PT(rear)], fill=edge, width=rw)
        rd.line([P(52, -18), P(px + 11, py)], fill=edge, width=rw)
        rd.line([PT(pin), PT(rear)], fill=edge, width=rw)
        rd.line([P(160, -18), P(154, -80)], fill=edge, width=rw)
        ellipse(rd, *PT(counter), 24 * s, None, width=rw, outline=edge)
        rd.line([PT(p) for p in head_pts[: len(head_pts) // 2]], fill=edge, width=rw)

    return Image.alpha_composite(img, jack)


def dust(t: float) -> Image.Image:
    """Drifting embers. Every term is periodic over the loop so the gif cuts clean."""
    lay = layer()
    d = ImageDraw.Draw(lay)
    phase = t / SECONDS
    span = H * 0.7
    for i in range(70):
        seed = i * 12.9898
        x = (math.sin(seed) * 0.5 + 0.5) * W
        rise = span * (1 + i % 3)  # whole spans per loop, so it wraps
        y = 110 + ((math.cos(seed) * 0.5 + 0.5) * span - phase * rise) % span
        tw = 0.4 + 0.6 * (0.5 + 0.5 * math.sin(phase * math.tau * (2 + i % 3) + seed))
        r = 0.9 + (i % 3) * 0.7
        a = int(40 + 110 * tw * (x / W))
        ellipse(d, x, y, r, (255, 216, 128, a))
    return lay


def draw_type(img: Image.Image) -> Image.Image:
    lay = layer()
    d = ImageDraw.Draw(lay)
    f = font("news", 96)
    fi = font("news_i", 96)
    x, y = 92, 300
    a, b = "$OIL", " is now Live."
    wa = d.textbbox((0, 0), a, font=f)[2]
    # glow so the type sits above the steel
    glow = layer()
    gd = ImageDraw.Draw(glow)
    gd.text((x, y), a, font=f, fill=(*GOLD_HOT, 120))
    gd.text((x + wa, y), b, font=fi, fill=(0, 0, 0, 170))
    glow = glow.filter(ImageFilter.GaussianBlur(18))
    lay = Image.alpha_composite(lay, glow)
    d = ImageDraw.Draw(lay)
    d.text((x, y), a, font=f, fill=GOLD)
    d.text((x + wa, y), b, font=fi, fill=CREAM)
    d.line([(x + 4, y + 132), (x + 250, y + 132)], fill=(*GOLD, 210), width=3)
    return Image.alpha_composite(img, lay)


def draw_chrome(img: Image.Image, pulse: float) -> Image.Image:
    out = img.copy()
    d = ImageDraw.Draw(out)
    kicker = font("news", 20)
    d.text((52, 38), "OIL", font=kicker, fill=CREAM)
    d.text((52, 62), "on Pons", font=kicker, fill=(*GOLD, 235))

    live_f = font("anton", 24)
    label = "LIVE"
    bb = d.textbbox((0, 0), label, font=live_f)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    pad_x, pad_y = 16, 9
    x2, y1 = W - 52, 36
    x1 = x2 - tw - pad_x * 2
    y2 = y1 + th + pad_y * 2
    d.rounded_rectangle([x1, y1, x2, y2], radius=3, outline=GOLD, width=2)
    d.text((x1 + pad_x, y1 + pad_y - 5), label, font=live_f, fill=GOLD)
    dot_a = int(120 + 135 * pulse)
    ellipse(d, x1 - 16, (y1 + y2) / 2, 5, (255, 120, 90, dot_a))

    d.text((52, H - 52), "$OIL", font=font("news", 20), fill=(*CREAM, 190))
    return out


def render_frame(t: float, bg: Image.Image) -> Image.Image:
    theta = t / SECONDS * REVS * math.tau
    img = bg.copy()

    # distant jack, darker and slower for depth
    img = draw_jack(
        img,
        theta * 0.58 + 1.9,
        0.42,
        (338, GROUND_Y - 8),
        (7, 7, 6, 220),
        (*GOLD_MID, 60),
        2,
    )
    # hero jack against the sun
    img = draw_jack(
        img,
        theta,
        1.18,
        (1002, GROUND_Y + 4),
        (9, 8, 6, 252),
        (*GOLD_HOT, 185),
        2,
    )

    img = Image.alpha_composite(img, dust(t))
    img = draw_type(img)
    pulse = 0.5 + 0.5 * math.sin(t * math.tau / 1.25)
    return draw_chrome(img, pulse)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    bg = make_bg()
    still = None
    for i in range(FRAMES):
        frame = render_frame(i / FPS, bg)
        frame.convert("RGB").save(OUT / f"{i:03d}.png")
        if i == 18:
            still = frame
        if i % 30 == 0:
            print(f"frame {i}/{FRAMES}", flush=True)
    if still:
        still.convert("RGB").save(STILL, quality=95)
    print("done")


if __name__ == "__main__":
    main()
