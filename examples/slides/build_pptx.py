#!/usr/bin/env python3
"""
Generate examples/slides/miles-templates.pptx — a set of Miles slide templates
in real PowerPoint, mirroring the HTML deck (deck.html) and the patterns in
../../presentation-patterns.md.

This is a *system demo / starter*, NOT a replacement for the official
`Miles template 2026.pptx`, which remains the source of truth (it has locked
master layouts, real photography, the full 43-layout set). This file proves the
tokens + assets map cleanly into .pptx and gives a lightweight starting point.

Fonts follow the official template's choice: Manrope for headings (Gelica's EULA
forbids .pptx embedding), DM Sans for body. Those fonts must be installed on the
machine that opens the file; they are not embedded here.

Run:
    pip install python-pptx
    python build_pptx.py
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_AUTO_SIZE
from pptx.oxml.ns import qn

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "..", "assets"))

# ---- Brand tokens ----
KREM = RGBColor(0xFB, 0xF0, 0xE5)
KREM_DEEP = RGBColor(0xF3, 0xE3, 0xD0)
BURG = RGBColor(0x45, 0x0D, 0x21)
ROD = RGBColor(0xFF, 0x30, 0x3B)
HEAD = "Manrope"          # PPTX heading font (sanctioned Gelica fallback)
BODY = "DM Sans"          # body font

EMU_W, EMU_H = Inches(13.333), Inches(7.5)
MX = Inches(0.85)         # side margin
MY = Inches(0.55)         # top/bottom margin

prs = Presentation()
prs.slide_width = EMU_W
prs.slide_height = EMU_H
BLANK = prs.slide_layouts[6]


def slide(bg=KREM):
    s = prs.slides.add_slide(BLANK)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = bg
    return s


def text(s, left, top, width, height, runs, size=18, font=BODY, bold=False,
         align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, line=1.2, italic=False,
         letter=None):
    """runs: str, or list of (text, RGBColor, bold) for mixed-colour lines."""
    tb = s.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.auto_size = MSO_AUTO_SIZE.NONE
    p = tf.paragraphs[0]
    p.alignment = align
    p.line_spacing = line
    if isinstance(runs, str):
        runs = [(runs, None, bold)]
    for t, color, b in runs:
        r = p.add_run()
        r.text = t
        r.font.size = Pt(size)
        r.font.name = font
        r.font.bold = bool(b)
        r.font.italic = italic
        r.font.color.rgb = color or BURG
        if letter is not None:
            _spacing(r, letter)
    return tb


def _spacing(run, pts):
    run.font._rPr.set('spc', str(int(pts * 100)))


def rrect(s, left, top, width, height, fill=None, lineclr=None, linew=1.5,
          radius=0.5):
    sp = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    try:
        sp.adjustments[0] = radius
    except Exception:
        pass
    if fill is None:
        sp.fill.background()
    else:
        sp.fill.solid(); sp.fill.fore_color.rgb = fill
    if lineclr is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = lineclr; sp.line.width = Pt(linew)
    sp.shadow.inherit = False
    return sp


def pill(s, left, top, text_, fill, fg, size=12, width=None, pad=Inches(0.18)):
    w = width or (Inches(0.10) * len(text_) + pad * 2)
    h = Inches(0.42)
    sp = rrect(s, left, top, w, h, fill=fill, lineclr=(BURG if fill is None else None),
               radius=0.5)
    tf = sp.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = text_
    r.font.size = Pt(size); r.font.name = BODY; r.font.bold = True
    r.font.color.rgb = fg
    return sp


def oval(s, left, top, d, fill=None, lineclr=BURG, linew=1.5):
    sp = s.shapes.add_shape(MSO_SHAPE.OVAL, left, top, d, d)
    if fill is None:
        sp.fill.background()
    else:
        sp.fill.solid(); sp.fill.fore_color.rgb = fill
    sp.line.color.rgb = lineclr; sp.line.width = Pt(linew)
    sp.shadow.inherit = False
    return sp


def img(s, path, left, top, width=None, height=None):
    return s.shapes.add_picture(os.path.join(ASSETS, path), left, top,
                                width=width, height=height)


def chrome(s, dark=False):
    """Hamburger top-left, Miles wordmark top-right."""
    clr = KREM if dark else BURG
    for k in range(3):
        ln = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, MX, MY + Inches(0.06 * k),
                                Inches(0.30), Pt(2.2))
        ln.fill.solid(); ln.fill.fore_color.rgb = clr
        ln.line.fill.background(); ln.shadow.inherit = False
    logo = "logos/miles-logo-cream.png" if dark else "logos/miles-logo-red.png"
    w = Inches(1.15)
    img(s, logo, EMU_W - MX - w, MY - Inches(0.03), width=w)


def kicker(s, left, top, txt, dark=False):
    text(s, left, top, Inches(6), Inches(0.5),
         [(txt, KREM if dark else ROD, False)], size=15, font=HEAD, italic=True)


# ============================== SLIDES ==============================

# 1 · Cover cream
s = slide()
chrome(s)
text(s, MX, Inches(4.7), Inches(6), Inches(0.4), [("Oslo · 2026", ROD, False)], size=13, font=BODY)
img(s, "logos/miles-logo-red.png", MX, Inches(5.05), width=Inches(5.0))
text(s, MX, Inches(6.55), Inches(6), Inches(0.5), "Slide-maler i Miles' designsystem.", size=18, font=HEAD)

# 2 · Cover red flood
s = slide(ROD)
chrome(s, dark=True)
text(s, MX, Inches(4.7), Inches(6), Inches(0.4), [("Bergen · 2026", KREM, False)], size=13)
img(s, "logos/miles-logo-cream.png", MX, Inches(5.05), width=Inches(5.0))

# 3 · Cover burgundy flood
s = slide(BURG)
chrome(s, dark=True)
text(s, MX, Inches(4.7), Inches(6), Inches(0.4), [("Trondheim · 2026", KREM, False)], size=13)
img(s, "logos/miles-logo-cream.png", MX, Inches(5.05), width=Inches(5.0))

# 4 · Illustration cover
s = slide()
chrome(s)
text(s, MX, Inches(2.5), Inches(6.3), Inches(2.0),
     [("Vi elsker å løse\n", BURG, False), ("utfordringer", ROD, False), ("!", BURG, False)],
     size=44, font=HEAD, bold=True, line=1.0)
text(s, MX, Inches(4.7), Inches(5.0), Inches(1.0),
     "Et verdidrevet konsulentselskap med varme for hverandre.", size=18, font=HEAD)
img(s, "illustrations/catching-ideas-net.png", Inches(8.0), Inches(1.7), height=Inches(4.4))

# 5 · TOC
s = slide()
chrome(s)
kicker(s, MX, MY + Inches(0.7), "Innholdsoversikt")
text(s, MX, MY + Inches(1.1), Inches(9), Inches(0.8), "Hva vi skal innom", size=30, font=HEAD, bold=True)
cards = [("Del 1: Bli kjent", ["Hvem vi er", "Våre verdier"]),
         ("Del 2: Tjenester", ["Data og AI", "Sky og plattform"]),
         ("Del 3: Samarbeid", ["Teamet", "Veien videre"])]
cw, gap = Inches(3.6), Inches(0.35)
x0 = MX
for i, (title, items) in enumerate(cards):
    cx = x0 + i * (cw + gap)
    rrect(s, cx, Inches(3.0), cw, Inches(3.3), fill=None, lineclr=BURG, radius=0.06)
    pill(s, cx + Inches(0.3), Inches(3.3), title, fill=BURG, fg=KREM, size=13)
    for j, it in enumerate(items):
        pill(s, cx + Inches(0.3), Inches(4.05) + j * Inches(0.6), it, fill=None, fg=BURG, size=12)

# 6 · Chapter divider red, title in frame
s = slide(ROD)
chrome(s, dark=True)
fr = rrect(s, Inches(2.6), Inches(2.5), Inches(8.1), Inches(2.5), fill=None, lineclr=KREM, radius=0.08)
text(s, Inches(3.0), Inches(2.85), Inches(7.3), Inches(0.4), [("Kapittel 02", KREM, False)], size=14, align=PP_ALIGN.CENTER)
text(s, Inches(3.0), Inches(3.35), Inches(7.3), Inches(1.4), [("Tjenesteområdene våre", KREM, False)], size=40, font=HEAD, bold=True, align=PP_ALIGN.CENTER, line=1.0)

# 7 · Standard content
s = slide()
chrome(s)
kicker(s, MX, Inches(2.2), "Slik jobber vi")
text(s, MX, Inches(2.65), Inches(6.0), Inches(1.4),
     [("Smarte løsninger i ", BURG, False), ("samarbeid", ROD, False)], size=34, font=HEAD, bold=True, line=1.05)
text(s, MX, Inches(4.0), Inches(5.6), Inches(2.0),
     "Vi møter mennesker med faglig autoritet og varme. Vi lytter, forstår problemet, og bygger noe robust og varig sammen med dere.",
     size=18, font=BODY, line=1.5)
img(s, "illustrations/person-laptop-orbit.png", Inches(8.1), Inches(1.9), height=Inches(4.0))

# 8 · Service-area intro
s = slide()
chrome(s)
text(s, MX, Inches(2.2), Inches(6), Inches(0.4), [("TJENESTEOMRÅDE", ROD, False)], size=12, font=BODY, bold=True, letter=1.5)
text(s, MX, Inches(2.65), Inches(6), Inches(1.2), "Data og AI", size=48, font=HEAD, bold=True)
text(s, MX, Inches(6.2), Inches(6.5), Inches(0.8),
     "Maskinlæring · dataplattformer · MLOps · generativ AI · beslutningsstøtte · datakvalitet",
     size=14, font=BODY)
img(s, "service-icons/data-and-ai-circle.png", Inches(8.7), Inches(2.0), height=Inches(3.4))

# 9 · All service areas
s = slide()
chrome(s)
kicker(s, Inches(0), Inches(2.4), "Våre tjenesteområder")
# centre the kicker
text(s, Inches(0), Inches(2.4), EMU_W, Inches(0.5), [("Våre tjenesteområder", ROD, False)],
     size=18, font=HEAD, italic=True, align=PP_ALIGN.CENTER)
svcs = [("strategic-it-circle.png", "Strategisk IT"),
        ("cloud-circle.png", "Teknologi, sky og plattform"),
        ("data-and-ai-circle.png", "Data og AI"),
        ("ux-and-innovation-circle.png", "Brukeropplevelse og innovasjon"),
        ("transformation-and-people-circle.png", "Transformasjon og mennesker")]
n = len(svcs); d = Inches(1.5); gapx = (EMU_W - 2 * MX - n * d) / (n - 1)
for i, (f, label) in enumerate(svcs):
    cx = MX + i * (d + gapx)
    img(s, "service-icons/" + f, cx, Inches(3.2), width=d)
    text(s, cx - Inches(0.25), Inches(4.85), d + Inches(0.5), Inches(0.8),
         [(label, BURG, False)], size=13, font=BODY, align=PP_ALIGN.CENTER, line=1.15)

# 10 · Red split panel
s = slide()
half = EMU_W / 2
left_rect = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, half, EMU_H)
left_rect.fill.solid(); left_rect.fill.fore_color.rgb = ROD; left_rect.line.fill.background(); left_rect.shadow.inherit = False
right_rect = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, half, 0, half, EMU_H)
right_rect.fill.solid(); right_rect.fill.fore_color.rgb = KREM; right_rect.line.fill.background(); right_rect.shadow.inherit = False
text(s, MX, Inches(2.6), half - MX - Inches(0.4), Inches(0.4), [("Mye er nytt", KREM, False)], size=15, font=HEAD, italic=True)
text(s, MX, Inches(3.05), half - MX - Inches(0.4), Inches(1.2), [("En ny verktøykasse", KREM, False)], size=32, font=HEAD, bold=True)
text(s, MX, Inches(4.1), half - MX - Inches(0.4), Inches(1.0), [("Nye plattformer, ny AI, nye muligheter.", KREM, False)], size=17, font=BODY)
text(s, half + Inches(0.4), Inches(2.6), half - MX - Inches(0.4), Inches(0.4), [("Mye består", ROD, False)], size=15, font=HEAD, italic=True)
text(s, half + Inches(0.4), Inches(3.05), half - MX - Inches(0.4), Inches(1.2), "Faglig autoritet og varme", size=32, font=HEAD, bold=True)
text(s, half + Inches(0.4), Inches(4.1), half - MX - Inches(0.4), Inches(1.0), "Verdiene og menneskene er de samme.", size=17, font=BODY)
img(s, "logos/miles-logo-cream.png", MX, MY, width=Inches(1.0))

# 11 · Team
s = slide()
chrome(s)
text(s, Inches(0), Inches(1.5), EMU_W, Inches(0.5), [("Teamet ditt", ROD, False)], size=18, font=HEAD, italic=True, align=PP_ALIGN.CENTER)
members = [("Senior konsulent", "Navn Navnesen", "Løsningsarkitekt"),
           ("Konsulent", "Navn Navnesen", "Data scientist"),
           ("Senior konsulent", "Navn Navnesen", "UX-designer")]
d = Inches(1.7); gap = Inches(1.1); total = len(members) * d + (len(members) - 1) * gap
x0 = (EMU_W - total) / 2
for i, (role, nm, rl) in enumerate(members):
    cx = x0 + i * (d + gap)
    oval(s, cx, Inches(2.4), d, fill=KREM_DEEP, lineclr=BURG)
    pill(s, cx + d/2 - Inches(0.9), Inches(4.25), role, fill=ROD, fg=KREM, size=11, width=Inches(1.8))
    text(s, cx - Inches(0.4), Inches(4.8), d + Inches(0.8), Inches(0.4), [(nm, BURG, True)], size=15, font=BODY, align=PP_ALIGN.CENTER)
    text(s, cx - Inches(0.4), Inches(5.2), d + Inches(0.8), Inches(0.4), [(rl, RGBColor(0x6a,0x2f,0x44), False)], size=13, font=BODY, align=PP_ALIGN.CENTER)
text(s, Inches(0), Inches(6.3), EMU_W, Inches(0.4), [("Bytt de runde brønnene mot svart-hvitt-portretter.", RGBColor(0x6a,0x2f,0x44), False)], size=13, font=BODY, align=PP_ALIGN.CENTER, italic=True)

# 12 · Closing red
s = slide(ROD)
img(s, "logos/miles-logo-cream.png", MX, MY, width=Inches(1.6))
text(s, MX, Inches(3.9), Inches(10), Inches(1.2), [("Takk for tiden din! :)", KREM, False)], size=48, font=HEAD, bold=True)
labels = ["←  Forside", "←  Innholdsoversikten", "←  Har du noe på hjertet?"]
x = MX
for lb in labels:
    p = pill(s, x, Inches(5.4), lb, fill=KREM, fg=BURG, size=13, width=Inches(0.11) * len(lb) + Inches(0.5))
    x += p.width + Inches(0.25)

out = os.path.join(HERE, "miles-templates.pptx")
prs.save(out)
print("wrote", out, "—", len(prs.slides._sldIdLst), "slides")
