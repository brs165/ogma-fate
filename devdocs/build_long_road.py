"""
THE LONG ROAD — A World of Adventure for Fate Condensed
Full PDF generator following Fate Worlds of Adventure layout conventions.

Layout DNA (from research):
- 6×9 inch digest format (432×648 pts)
- Single-column body text
- Adobe Garamond Pro → Times-Roman (closest available built-in)
- Gotham → Helvetica-Bold (closest available built-in)
- Accent colour: #A86020 (warm amber from Long Road palette)
- Inverted sidebars: white Helvetica on near-black #2A2018
- Headers at top of page where possible
- Inline stat blocks, not boxed
- Full-colour palette: cream pages, amber accents, dark text
"""

from reportlab.lib.pagesizes import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    KeepTogether, HRFlowable, Table, TableStyle, PageBreak, CondPageBreak
)
from reportlab.platypus.flowables import Flowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas as pdfgen_canvas

# ── Page dimensions ─────────────────────────────────────────────────────────
PAGE_W = 6 * inch
PAGE_H = 9 * inch
MARGIN = 0.65 * inch
FRAME_W = PAGE_W - 2 * MARGIN
FRAME_H = PAGE_H - 2 * MARGIN - 0.5 * inch   # room for header/footer

# ── Palette ──────────────────────────────────────────────────────────────────
C_ACCENT   = colors.HexColor('#A86020')   # warm amber
C_DARK     = colors.HexColor('#1C0C04')   # near-black warm
C_SIDEBAR  = colors.HexColor('#2A2018')   # dark sidebar BG
C_CREAM    = colors.HexColor('#F8ECE0')   # page tint (we keep white for PDF)
C_MUTED    = colors.HexColor('#704020')   # muted amber
C_RULE     = colors.HexColor('#C07840')   # border lines
C_WHITE    = colors.white
C_MEDIUM   = colors.HexColor('#604010')   # medium brown
C_RED      = colors.HexColor('#C03020')

# ── Typography ────────────────────────────────────────────────────────────────
SERIF      = 'Times-Roman'
SERIF_B    = 'Times-Bold'
SERIF_I    = 'Times-Italic'
SERIF_BI   = 'Times-BoldItalic'
SANS       = 'Helvetica'
SANS_B     = 'Helvetica-Bold'
SANS_I     = 'Helvetica-Oblique'

def make_styles():
    S = {}

    S['body'] = ParagraphStyle('body',
        fontName=SERIF, fontSize=10, leading=14,
        textColor=C_DARK, alignment=TA_JUSTIFY,
        spaceAfter=6, firstLineIndent=0,
    )
    S['body_indent'] = ParagraphStyle('body_indent',
        parent=S['body'], firstLineIndent=18,
    )
    S['chapter_title'] = ParagraphStyle('chapter_title',
        fontName=SANS_B, fontSize=16, leading=18,
        textColor=C_ACCENT, spaceBefore=0, spaceAfter=8,
        alignment=TA_LEFT, textTransform='uppercase',
        borderPad=0,
    )
    S['section_head'] = ParagraphStyle('section_head',
        fontName=SANS_B, fontSize=11.5, leading=14,
        textColor=C_DARK, spaceBefore=14, spaceAfter=4,
        alignment=TA_LEFT,
    )
    S['sub_head'] = ParagraphStyle('sub_head',
        fontName=SANS_B, fontSize=10, leading=13,
        textColor=C_ACCENT, spaceBefore=10, spaceAfter=3,
    )
    S['sidebar_title'] = ParagraphStyle('sidebar_title',
        fontName=SANS_B, fontSize=9.5, leading=12,
        textColor=C_WHITE, spaceBefore=0, spaceAfter=4,
        textTransform='uppercase', letterSpacing=0.5,
    )
    S['sidebar_body'] = ParagraphStyle('sidebar_body',
        fontName=SANS, fontSize=9, leading=12.5,
        textColor=C_WHITE, spaceAfter=4,
    )
    S['sidebar_bold'] = ParagraphStyle('sidebar_bold',
        fontName=SANS_B, fontSize=9, leading=12,
        textColor=C_WHITE, spaceAfter=2,
    )
    S['stat_name'] = ParagraphStyle('stat_name',
        fontName=SANS_B, fontSize=10.5, leading=13,
        textColor=C_DARK, spaceBefore=12, spaceAfter=1,
    )
    S['stat_label'] = ParagraphStyle('stat_label',
        fontName=SANS_B, fontSize=9, leading=12,
        textColor=C_ACCENT, spaceAfter=0, spaceBefore=3,
    )
    S['stat_body'] = ParagraphStyle('stat_body',
        fontName=SERIF, fontSize=9.5, leading=13,
        textColor=C_DARK, spaceAfter=2,
    )
    S['fiction'] = ParagraphStyle('fiction',
        fontName=SERIF_I, fontSize=10, leading=14.5,
        textColor=C_MEDIUM, spaceBefore=8, spaceAfter=8,
        leftIndent=18, rightIndent=18,
    )
    S['credit_title'] = ParagraphStyle('credit_title',
        fontName=SANS_B, fontSize=22, leading=26,
        textColor=C_DARK, alignment=TA_CENTER, spaceBefore=0, spaceAfter=4,
    )
    S['credit_sub'] = ParagraphStyle('credit_sub',
        fontName=SANS, fontSize=11, leading=14,
        textColor=C_ACCENT, alignment=TA_CENTER, spaceAfter=2,
    )
    S['credit_body'] = ParagraphStyle('credit_body',
        fontName=SANS_B, fontSize=10, leading=14,
        textColor=C_DARK, alignment=TA_CENTER, spaceAfter=2,
    )
    S['credit_note'] = ParagraphStyle('credit_note',
        fontName=SERIF_I, fontSize=8.5, leading=12,
        textColor=C_MEDIUM, alignment=TA_CENTER, spaceAfter=2,
    )
    S['toc_entry'] = ParagraphStyle('toc_entry',
        fontName=SERIF, fontSize=10, leading=15,
        textColor=C_DARK,
    )
    S['toc_head'] = ParagraphStyle('toc_head',
        fontName=SANS_B, fontSize=9, leading=12,
        textColor=C_ACCENT, spaceBefore=8,
    )
    S['bullet'] = ParagraphStyle('bullet',
        fontName=SERIF, fontSize=10, leading=13.5,
        textColor=C_DARK, leftIndent=16, firstLineIndent=-10,
        spaceAfter=3,
    )
    S['caption'] = ParagraphStyle('caption',
        fontName=SANS_I, fontSize=8.5, leading=11,
        textColor=C_MEDIUM, alignment=TA_CENTER,
    )
    S['tagline'] = ParagraphStyle('tagline',
        fontName=SERIF_I, fontSize=12, leading=17,
        textColor=C_ACCENT, alignment=TA_CENTER,
        spaceBefore=6, spaceAfter=10,
    )
    S['issue_name'] = ParagraphStyle('issue_name',
        fontName=SANS_B, fontSize=10, leading=13,
        textColor=C_DARK, spaceBefore=8, spaceAfter=2,
    )
    S['issue_body'] = ParagraphStyle('issue_body',
        fontName=SERIF, fontSize=9.5, leading=13,
        textColor=C_DARK, spaceAfter=2, leftIndent=14,
    )
    return S

# ── Custom flowables ──────────────────────────────────────────────────────────

class HRule(Flowable):
    def __init__(self, width=FRAME_W, color=C_RULE, thickness=0.5, vspace=4):
        super().__init__()
        self.rule_width = width
        self.color = color
        self.thickness = thickness
        self.vspace = vspace

    def wrap(self, availW, availH):
        return availW, self.thickness + self.vspace * 2

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, self.vspace, self.rule_width, self.vspace)


class AccentRule(Flowable):
    """Thick amber rule used under chapter titles."""
    def __init__(self, width=FRAME_W):
        super().__init__()
        self.rule_width = width

    def wrap(self, availW, availH):
        return availW, 6

    def draw(self):
        self.canv.setFillColor(C_ACCENT)
        self.canv.rect(0, 1, self.rule_width, 3, fill=1, stroke=0)


class SidebarBox(Flowable):
    """Dark inverted sidebar — white text on near-black."""
    def __init__(self, elements, styles, width=FRAME_W):
        super().__init__()
        self.elements = elements   # list of (style_key, text) tuples
        self.S = styles
        self.box_width = width
        self._built = []
        self._height = 0

    def wrap(self, availW, availH):
        PAD = 10
        inner_w = self.box_width - PAD * 2
        total_h = PAD
        self._built = []
        for (sk, txt) in self.elements:
            p = Paragraph(txt, self.S[sk])
            w, h = p.wrap(inner_w, 9999)
            self._built.append((p, h))
            total_h += h + self.S[sk].spaceAfter
        total_h += PAD
        self._height = total_h
        return self.box_width, total_h

    def draw(self):
        PAD = 10
        c = self.canv
        # Dark background box
        c.setFillColor(C_SIDEBAR)
        c.roundRect(0, 0, self.box_width, self._height, 4, fill=1, stroke=0)
        # Amber left accent stripe
        c.setFillColor(C_ACCENT)
        c.rect(0, 0, 3, self._height, fill=1, stroke=0)
        # Draw each paragraph
        y = self._height - PAD
        for (p, h) in self._built:
            p.drawOn(c, PAD + 3, y - h)
            y -= h + p.style.spaceAfter


class StatBlock(Flowable):
    """Inline stat block for an NPC/opponent."""
    def __init__(self, name, vital, high_concept, trouble, aspects,
                 skills, stress, stunts, qty, styles, width=FRAME_W):
        super().__init__()
        self.name = name
        self.vital = vital
        self.high_concept = high_concept
        self.trouble = trouble
        self.aspects = aspects
        self.skills = skills
        self.stress = stress
        self.stunts = stunts
        self.qty = qty
        self.S = styles
        self.block_width = width
        self._built = []
        self._height = 0

    def _make_paras(self):
        PAD = 10
        inner_w = self.block_width - PAD * 2
        lines = []
        # Name line
        name_str = self.name
        if self.vital:
            name_str += f'  <font name="{SANS}" size="9" color="#A86020">[{self.vital}]</font>'
        lines.append(('stat_name', name_str))
        if self.high_concept:
            lines.append(('stat_label', 'High Concept'))
            lines.append(('stat_body', self.high_concept))
        if self.trouble:
            lines.append(('stat_label', 'Trouble'))
            lines.append(('stat_body', self.trouble))
        if self.aspects:
            lines.append(('stat_label', 'Aspects'))
            for a in self.aspects:
                lines.append(('stat_body', f'• <i>{a}</i>'))
        if self.skills:
            lines.append(('stat_label', 'Skills'))
            lines.append(('stat_body', '  ·  '.join(self.skills)))
        if self.stress is not None:
            lines.append(('stat_label', 'Stress'))
            boxes = '□ ' * self.stress
            lines.append(('stat_body', boxes.strip() or '—'))
        if self.stunts:
            lines.append(('stat_label', 'Stunts'))
            for st in self.stunts:
                lines.append(('stat_body', st))
        if self.qty and self.qty > 1:
            lines.append(('stat_body', f'<i>Typically appears in groups of {self.qty}.</i>'))
        return lines, inner_w, PAD

    def wrap(self, availW, availH):
        lines, inner_w, PAD = self._make_paras()
        total_h = PAD
        self._built = []
        for (sk, txt) in lines:
            p = Paragraph(txt, self.S[sk])
            w, h = p.wrap(inner_w, 9999)
            self._built.append((p, h))
            total_h += h + self.S[sk].spaceAfter
        total_h += PAD
        self._height = total_h
        return self.block_width, total_h

    def draw(self):
        PAD = 10
        c = self.canv
        # Light cream box with amber border
        c.setFillColor(colors.HexColor('#FFF5EC'))
        c.setStrokeColor(C_RULE)
        c.setLineWidth(0.75)
        c.roundRect(0, 0, self.block_width, self._height, 3, fill=1, stroke=1)
        # Accent bar on left
        c.setFillColor(C_ACCENT)
        c.rect(0, 0, 3, self._height, fill=1, stroke=0)
        y = self._height - PAD
        for (p, h) in self._built:
            p.drawOn(c, PAD + 3, y - h)
            y -= h + p.style.spaceAfter


# ── Page templates ────────────────────────────────────────────────────────────

class LongRoadDoc(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, pagesize=(PAGE_W, PAGE_H), **kwargs)
        self.current_chapter = ''
        self.page_offset = 0

        frame = Frame(
            MARGIN, MARGIN + 0.3 * inch,
            FRAME_W, FRAME_H,
            leftPadding=0, rightPadding=0,
            topPadding=0, bottomPadding=0,
            id='main'
        )
        template = PageTemplate(
            id='main', frames=[frame],
            onPage=self._draw_page_chrome
        )
        self.addPageTemplates([template])

    def _draw_page_chrome(self, canv, doc):
        canv.saveState()
        pg = doc.page

        # ── Header ──────────────────────────────────────────
        # Left: book title (odd pages) or chapter (even)
        canv.setFont(SANS, 7.5)
        canv.setFillColor(C_MEDIUM)
        if pg % 2 == 1:  # odd — right-hand pages
            canv.drawString(MARGIN, PAGE_H - MARGIN + 10,
                            'THE LONG ROAD')
            canv.setFillColor(C_ACCENT)
            canv.setFont(SANS, 7.5)
            canv.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 10,
                                 doc.current_chapter.upper())
        else:  # even — left-hand pages
            canv.setFillColor(C_ACCENT)
            canv.drawString(MARGIN, PAGE_H - MARGIN + 10,
                            doc.current_chapter.upper())
            canv.setFillColor(C_MEDIUM)
            canv.setFont(SANS, 7.5)
            canv.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 10,
                                 'A WORLD OF ADVENTURE FOR FATE CONDENSED')

        # Thin amber header rule
        canv.setStrokeColor(C_ACCENT)
        canv.setLineWidth(0.5)
        canv.line(MARGIN, PAGE_H - MARGIN + 6, PAGE_W - MARGIN, PAGE_H - MARGIN + 6)

        # ── Footer ──────────────────────────────────────────
        canv.setStrokeColor(C_RULE)
        canv.setLineWidth(0.5)
        canv.line(MARGIN, MARGIN - 4, PAGE_W - MARGIN, MARGIN - 4)

        canv.setFont(SANS, 8)
        canv.setFillColor(C_ACCENT)
        if pg == 1:   # cover/title — no page number
            pass
        else:
            if pg % 2 == 1:
                canv.drawRightString(PAGE_W - MARGIN, MARGIN - 16, str(pg - 1))
            else:
                canv.drawString(MARGIN, MARGIN - 16, str(pg - 1))

        canv.restoreState()


# ── Content builders ──────────────────────────────────────────────────────────

def chapter(title, styles):
    """Return flowables for a chapter heading."""
    return [
        Spacer(1, 6),
        Paragraph(title, styles['chapter_title']),
        AccentRule(),
        Spacer(1, 8),
    ]

def section(title, styles):
    return [Paragraph(title, styles['section_head'])]

def sub(title, styles):
    return [Paragraph(title, styles['sub_head'])]

def body(text, styles, style='body'):
    return Paragraph(text, styles[style])

def sidebar(title, paras, styles):
    """Build a dark inverted sidebar box."""
    elements = []
    if title:
        elements.append(('sidebar_title', title))
    for (bold, txt) in paras:
        if bold:
            elements.append(('sidebar_bold', txt))
        else:
            elements.append(('sidebar_body', txt))
    return SidebarBox(elements, styles)

def bullet_list(items, styles):
    return [Paragraph(f'• {item}', styles['bullet']) for item in items]

def hline(styles):
    return HRule()

def spacer(h=8):
    return Spacer(1, h)


# ── BOOK CONTENT ──────────────────────────────────────────────────────────────

def build_book(S):
    story = []
    doc_ref = {'chapter': ''}

    def set_chapter(name):
        doc_ref['chapter'] = name

    # ════════════════════════════════════════════════════════════════════════
    # TITLE / CREDITS PAGE
    # ════════════════════════════════════════════════════════════════════════
    story.append(spacer(60))
    story.append(Paragraph('THE LONG ROAD', S['credit_title']))
    story.append(spacer(4))
    story.append(AccentRule())
    story.append(spacer(8))
    story.append(Paragraph('A WORLD OF ADVENTURE FOR', S['credit_sub']))
    story.append(Paragraph('FATE CONDENSED', ParagraphStyle('fate_big',
        fontName=SANS_B, fontSize=18, leading=22,
        textColor=C_DARK, alignment=TA_CENTER, spaceAfter=4)))
    story.append(spacer(30))

    credits = [
        ('WRITING & WORLD DESIGN', 'Ogma Generator Project'),
        ('RULES ADAPTATION', 'Fate Condensed — Evil Hat Productions'),
        ('DEVELOPMENT', 'Based on Fate Core System'),
        ('LAYOUT CONVENTIONS', 'Following Evil Hat Worlds of Adventure'),
    ]
    for (role, name) in credits:
        story.append(Paragraph(role, S['credit_sub']))
        story.append(Paragraph(name, S['credit_body']))
        story.append(spacer(6))

    story.append(spacer(20))
    story.append(HRule(color=C_RULE))
    story.append(spacer(10))
    story.append(Paragraph(
        'This work is based on Fate Condensed, a product of Evil Hat Productions, LLC, '
        'developed, authored, and edited by PK Sullivan, Ed Turner, Leonard Balsera, Fred Hicks, '
        'Richard Bellingham, Robert Hanz, Ryan Macklin, and Sophie Lagacé, and licensed for our '
        'use under the Creative Commons Attribution 3.0 Unported license.',
        S['credit_note']
    ))
    story.append(spacer(4))
    story.append(Paragraph(
        'This work is based on Fate Core System, a product of Evil Hat Productions, LLC, '
        'developed, authored, and edited by Leonard Balsera, Brian Engard, Jeremy Keller, '
        'Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue, '
        'and licensed under the Creative Commons Attribution 3.0 Unported license.',
        S['credit_note']
    ))
    story.append(spacer(4))
    story.append(Paragraph(
        'Fate™ is a trademark of Evil Hat Productions, LLC. All rights reserved.',
        S['credit_note']
    ))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Contents', S)

    toc_entries = [
        ('The Beautiful Apocalypse', 3),
        ('What Is The Long Road?', 3),
        ('The Road Itself', 4),
        ('Settlements', 5),
        ('Factions', 6),
        ('The World Beyond', 7),
        ('Anatomy of the Threat', 8),
        ('Road Gangs & Raiders', 8),
        ('The Infected', 10),
        ('Pre-War Technology', 12),
        ('Creating Your Characters', 14),
        ('Vital Status', 14),
        ('Aspects', 15),
        ('Skills', 16),
        ('Stunts', 17),
        ('Extras: The Carry', 18),
        ('The Convoy', 19),
        ('What a Convoy Is', 19),
        ('Convoy Creation', 20),
        ('Convoy in Play', 21),
        ('Creating Runs', 22),
        ('The Inciting Incident', 22),
        ('The Road', 23),
        ('Objectives', 24),
        ('Complications', 24),
        ('Rewards', 25),
        ('Run Chains', 26),
        ('Dust and Fire', 27),
        ('Part I: The Medicine Run', 28),
        ('Part II: What Was in Section Seven', 31),
        ('Part III: The Signal', 35),
    ]

    for (title, pg) in toc_entries:
        indent = 18 if title[0] in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' and not any(
            c.islower() for c in title[:3]) else 0
        style = 'toc_head' if indent == 0 else 'toc_entry'
        # Dot-leader table
        t = Table(
            [[Paragraph(('  ' if indent else '') + title, S[style]),
              Paragraph(str(pg), S['toc_entry'])]],
            colWidths=[FRAME_W - 30, 30]
        )
        t.setStyle(TableStyle([
            ('ALIGN', (0,0), (0,0), 'LEFT'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('TOPPADDING', (0,0), (-1,-1), 1),
            ('BOTTOMPADDING', (0,0), (-1,-1), 1),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t)

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 1: THE BEAUTIFUL APOCALYPSE
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('The Beautiful Apocalypse', S)

    story.append(Paragraph(
        '<i>The beautiful apocalypse — nature reclaims the ruins while the living '
        'pick through the lethal artifacts of everything that came before.</i>',
        S['tagline']
    ))

    story.append(Paragraph(
        'The world ended. Then nature came back.',
        S['body']
    ))
    story.append(Paragraph(
        'The highways are forests now. The cities are coral reefs of concrete and vine, '
        'shattered glass towers wrapped in green, their lower floors flooded or colonised '
        'by things that don\'t distinguish between the old world\'s walls and the new world\'s '
        'territory. The apocalypse is decades old. What\'s left isn\'t the immediate horror '
        'of collapse — it\'s the long, grinding, complicated work of surviving the aftermath '
        'and building something in the middle of it.',
        S['body']
    ))
    story.append(Paragraph(
        'The Long Road is a post-apocalyptic campaign setting for Fate Condensed. '
        'The characters are road-workers — convoy guards, scavengers, medics, guides, '
        'and traders — people who move through a world that\'s recovering whether '
        'humanity helps or not. The road is the only constant. Communities depend on '
        'it. Factions fight over it. The infected, the warlords, and the pre-war '
        'technology treat it as an obstacle or an opportunity.',
        S['body']
    ))
    story.append(Paragraph(
        'You are people who keep the road moving. Some of you do it for pay. Some '
        'for ideology. Some because there\'s no other work left, or because this is '
        'the only world where the skills you have still matter.',
        S['body']
    ))

    story.append(sidebar(
        'WHAT MAKES THIS SETTING',
        [
            (True, 'The road is a character.'),
            (False, 'It has moods, hazards, and memory. Every convoy that uses it '
                    'changes it slightly. Every battle fought on it leaves evidence.'),
            (True, 'Scarcity drives everything.'),
            (False, 'Clean water, medicine, seed stock, fuel, and functioning pre-war '
                    'tech are all currencies. What you carry determines your value.'),
            (True, 'The world is recovering.'),
            (False, 'The infected zone expands but so do the green places. The old '
                    'world left traps in everything it built, and also left gifts. '
                    'The question is who gets there first.'),
            (True, 'Communities are worth protecting.'),
            (False, 'The individual survives on the road. The community survives '
                    'the winter. These two things are often in conflict.'),
        ],
        S
    ))

    story.append(spacer(10))

    story += section('What Is The Long Road?', S)
    story.append(body(
        'The Long Road is the name for the network of maintained routes connecting '
        'surviving settlements across the region. Originally the interstate highway '
        'system, it\'s been widened in some places by convoys and narrowed in others '
        'by nature reclaiming the blacktop. The name is also a way of describing '
        'the life — nomadic, dangerous, measured in distances and load capacity.',
        S
    ))
    story.append(body(
        'Not everyone on the road is a professional. Refugees move along it. '
        'Warlords raid it. Infected cluster near it because the smell of fuel and '
        'burning draws them. The factions — trading coalitions, settlement networks, '
        'warlord confederacies — use it as both resource and battlefield.',
        S
    ))
    story.append(body(
        'The characters in this game are people who navigate all of it.',
        S
    ))

    story += section('The Road Itself', S)
    story.append(body(
        'The surviving road network varies dramatically by condition. Some sections '
        'are maintained by organised convoys and armed patrols. Others are cracked '
        'by roots, flooded in the low sections, or blocked by the ruins of '
        'pre-war accidents that nobody has cleared. Travelling the road requires '
        'constant assessment — what\'s passable, what\'s watched, what\'s not.',
        S
    ))
    story.append(body(
        'The road has <b>condition tracks</b> that vary by zone. In the generator '
        'suite these are represented as scene aspects that can be invoked or '
        'compelled: <i>The Highway Is Three Lanes of Cracked Glass</i>, '
        '<i>The Bridge Tolls Are Run by Someone Who Knows Their Value</i>, '
        '<i>Seventeen Kilometres Without Cover</i>.',
        S
    ))

    story += sub('Points of Interest', S)
    story.append(body(
        'The road connects, but also produces its own geography. Toll points, '
        'trading posts, abandoned fuel caches, pre-war weigh stations turned into '
        'fortified settlements, bridges that three different factions claim '
        'simultaneously — these are the natural landmarks of the Long Road.',
        S
    ))

    poi_data = [
        ('The Reservoir Settlement', 'The largest clean water source in three days\' travel. '
         'Currently under the control of Warlord Scar Ironback, who taxes access. '
         'Communities are starting to die.'),
        ('The Vault Complex', 'A pre-war facility sealed since the collapse that has '
         'recently opened. People go in with empty packs and come out with extraordinary '
         'things. Some don\'t come out at all. A trading post has grown up outside it '
         'in three months.'),
        ('Highway Section 7', 'The most contested stretch of road in the region. '
         'Three factions have claims. The road gang confederation uses it as '
         'primary hunting ground. A supply convoy carrying medicine was taken here '
         'last month.'),
        ('The Green Place', 'A valley somewhere east where the soil is clean and '
         'the water runs clear. Everyone has heard of it. Some people have been '
         'there. None of them agree on the route.'),
        ('The Signal Source', 'A pre-war emergency broadcast has begun repeating '
         'from an unmapped location, moving slowly north. It\'s a map to something. '
         'Multiple parties are already moving toward it.'),
    ]

    for (name, desc) in poi_data:
        story.append(KeepTogether([
            Paragraph(name, S['sub_head']),
            Paragraph(desc, S['body']),
        ]))

    # ── Settlements ───────────────────────────────────────────────────────────
    story += section('Settlements', S)
    story.append(body(
        'Settlements range from three families sharing a defensible building to '
        'communities of hundreds with functioning agriculture, medical services, '
        'and written law. What they have in common is that they\'re trying to '
        'stay in one place long enough to build something.',
        S
    ))
    story.append(body(
        'Every settlement has a relationship with the road — either it depends on '
        'trade, or it\'s trying to become self-sufficient enough not to. The '
        'distinction drives most of the political tensions in the region.',
        S
    ))

    settlement_types = [
        ('Road Dependencies', 'Communities that can\'t survive without regular '
         'supply convoys. They produce something — crops, refined fuel, '
         'manufactured goods — and trade for everything else. Their '
         'vulnerability is leverage.'),
        ('Fortified Positions', 'Communities that have given up external trade '
         'for defensibility. They survive through internal production and '
         'strict rationing. Their weakness is that when something fails '
         'internally, they have no fallback.'),
        ('Faction Nodes', 'Communities that exist primarily to serve a '
         'faction\'s strategic purposes — relay stations, supply caches, '
         'intelligence hubs. They\'re better resourced than average but '
         'also targets for rival factions.'),
        ('Survivor Clusters', 'The smallest and most desperate: people who '
         'found each other after something destroyed their previous community. '
         'They travel, or they\'ve found a temporary shelter. They need '
         'everything and can offer almost nothing except labour and loyalty.'),
    ]

    for (name, desc) in settlement_types:
        story.append(Paragraph(f'<b>{name}.</b> {desc}', S['body']))

    # ── Factions ──────────────────────────────────────────────────────────────
    story += section('Factions', S)
    story.append(body(
        'The region is contested by several major factions, each pursuing '
        'incompatible long-term goals through methods that cause short-term harm '
        'to everyone else.',
        S
    ))

    factions = [
        {
            'name': 'The Road Compact',
            'desc': 'A coalition of trading communities committed to maintaining '
                    'the road as neutral ground. Their power comes from controlling '
                    'the only reliable information network across six settlement '
                    'clusters. Their weakness: the compact contains a clause that '
                    'can be legally used to dissolve it, and the warlord '
                    'confederation has found it.',
            'goal': 'Prevent any single faction from controlling the regional '
                    'water supply — by any means available.',
            'method': 'Running the only neutral information service across six '
                      'settlement clusters. The price of access is accuracy.',
            'face': 'The relay operator who hears everything and whose loyalties '
                    'have never been tested until now.',
        },
        {
            'name': 'The Warlord Confederation',
            'desc': 'What was a loose confederation of road gangs now has '
                    'leadership, organisation, and a banner. They\'re not raiding '
                    'anymore — they\'re conquering. Their most effective leader '
                    'is dying and hasn\'t named a successor. The succession '
                    'question is the only thing keeping the confederation '
                    'from becoming a unified army.',
            'goal': 'Control all potable water sources within three days\' travel.',
            'method': 'Stockpiling leverage rather than using it. Threatening '
                      'is cheaper than acting. Until they act.',
            'face': 'General Dust Coldvault: former survivor, now commanding '
                    'a real force. Believes the toll is the only honest '
                    'relationship available.',
        },
        {
            'name': 'The Archive',
            'desc': 'A faction built around the preservation and controlled '
                    'distribution of pre-war knowledge. Their most valuable asset '
                    'is their pre-war specialist, who is dying and has been making '
                    'independent decisions about who receives treatment. Two-thirds '
                    'of the community believe the cause; one-third are there '
                    'for the access.',
            'goal': 'Broadcast the pre-war technical archive on a wide frequency '
                    'before the jamming faction acquires the relay.',
            'method': 'Maintaining a roster of pre-war specialists whose '
                      'services are available to any community on the compact.',
            'face': 'The community\'s memory-keeper — the person who documents '
                    'everything and is the only complete record of what '
                    'happened in Year One.',
        },
    ]

    for fac in factions:
        story.append(KeepTogether([
            Paragraph(fac['name'], S['section_head']),
            Paragraph(fac['desc'], S['body']),
            Paragraph(f'<b>Goal:</b> {fac["goal"]}', S['body']),
            Paragraph(f'<b>Primary method:</b> {fac["method"]}', S['body']),
            Paragraph(f'<b>Face:</b> {fac["face"]}', S['body']),
        ]))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 2: ANATOMY OF THE THREAT
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Anatomy of the Threat', S)

    story.append(Paragraph(
        'The Long Road is not the most dangerous thing on the road. '
        'The most dangerous thing is what happens when three dangerous things '
        'converge on the same objective at the same time.',
        S['fiction']
    ))

    story.append(body(
        'As a road-worker, you deal with everything that makes the road unsafe. '
        'That\'s not just raiders and infected. It\'s malfunctioning pre-war '
        'technology, faction politics turning violent, communities making '
        'desperate decisions, and the road\'s own environmental hazards.',
        S
    ))

    story += section('Road Gangs and Raiders', S)
    story.append(body(
        'Road gangs range from desperate survivors who turned to raiding '
        'because nothing else was available to organised criminal '
        'enterprises that are functionally indistinguishable from '
        'the warlord confederation\'s military wing.',
        S
    ))
    story.append(body(
        'What distinguishes a raider encounter from a warlord encounter is '
        'intent and organisation. Raiders want what you\'re carrying. '
        'Warlords want what you represent. The first can be negotiated with '
        'about cargo. The second cannot be negotiated with about territory.',
        S
    ))

    story.append(sidebar(
        'TAKING RAIDERS OUT',
        [
            (False, 'Raiders are not suicidal. A road gang that takes serious '
                    'losses will retreat rather than press a fight. '
                    'The objective is usually the cargo, not the convoy.'),
            (False, 'Consequence: if a raid fails badly, the same gang may '
                    'be more cautious next time — or more desperate, '
                    'depending on how hungry they are.'),
            (False, 'Road gangs talk. What happened to the last crew that '
                    'hit this convoy travels down the road ahead of the convoy.'),
        ],
        S
    ))

    story.append(spacer(8))

    # Road Gang Raider stat block
    story.append(KeepTogether([
        StatBlock(
            name='Road Gang Raider',
            vital='Minor NPC',
            high_concept='Takes What the Road Offers',
            trouble=None,
            aspects=['Desperate and Organised', 'Eyes on the Cargo Not the People'],
            skills=['Good (+3) Shoot', 'Fair (+2) Fight', 'Average (+1) Athletics'],
            stress=2,
            stunts=['<b>Numbers advantage:</b> When three or more raiders attack the same '
                    'target in the same zone, each raider gets +1 to Fight.'],
            qty=4,
            styles=S,
        )
    ]))

    story.append(spacer(6))

    story.append(KeepTogether([
        StatBlock(
            name='Road Warlord',
            vital='Major NPC',
            high_concept='This Road Is My Law',
            trouble='I Have Fed My People By Taking From Yours',
            aspects=[
                'Believes the Toll Is Fair; Will Enforce It Absolutely',
                'Has Not Lost a Road War Yet',
                'The Confederation Watches What I Do Here',
            ],
            skills=['Great (+4) Fight', 'Good (+3) Provoke', 'Good (+3) Notice',
                    'Fair (+2) Resources'],
            stress=4,
            stunts=['<b>Territory sense:</b> +2 to Fight when invoking an aspect '
                    'related to territory or resource control.',
                    '<b>Make an example:</b> Once per scene, a successful attack '
                    'against the warlord creates a free aspect on every other '
                    'enemy in the scene — fear has a ripple effect.'],
            qty=1,
            styles=S,
        )
    ]))

    story += section('The Infected', S)
    story.append(body(
        'Something in the collapse triggered an infection that spread faster '
        'than any coordinated response could contain. The infected aren\'t '
        'simply "the undead" of post-apocalyptic fiction — they\'re '
        'something more complicated. Early-stage infected are still partially '
        'responsive. Late-stage infected have lost most cognitive function '
        'but gained physical capabilities that don\'t follow normal biology.',
        S
    ))
    story.append(body(
        'The infected zone expands on a seasonal clock that\'s partially '
        'predictable and partly not. Guides who know the current boundary '
        'are among the most valuable people on the road. The boundary changes.',
        S
    ))

    story += sub('Dealing with the Infected', S)
    story.append(body(
        'Unlike raiders, the infected don\'t negotiate and don\'t retreat '
        'based on cost-benefit analysis. They respond to stimuli. Early-stage '
        'infected respond to visual and olfactory cues; late-stage respond '
        'primarily to sound. This creates different tactical challenges.',
        S
    ))
    story.append(body(
        'The most dangerous aspect of late-stage infected encounters is that '
        'they tend to cluster. A single late-stage individual making contact '
        'will attract more. In the infected zone, direct combat is usually '
        'the wrong choice. Evasion, silence, and misdirection are '
        'more effective.',
        S
    ))

    story.append(KeepTogether([
        StatBlock(
            name='Infected — Early Stage',
            vital='Minor NPC',
            high_concept='Still Partially Responsive',
            trouble=None,
            aspects=['Fast When Triggered', 'Responds to What It Recognises'],
            skills=['Good (+3) Athletics', 'Fair (+2) Fight', 'Average (+1) Notice'],
            stress=2,
            stunts=['<b>Human reflex:</b> Once per scene, the early-stage infected '
                    'uses a recognisable human gesture or word. Any character who '
                    'hesitates (fails a Will overcome at difficulty 2) loses '
                    'their action this exchange.'],
            qty=3,
            styles=S,
        )
    ]))

    story.append(spacer(6))

    story.append(KeepTogether([
        StatBlock(
            name='Infected — Late Stage',
            vital='Minor NPC',
            high_concept='Pain Response Gone',
            trouble=None,
            aspects=['Sound-Triggered', 'Draws More When It Draws Attention'],
            skills=['Great (+4) Physique', 'Good (+3) Fight', 'Fair (+2) Athletics'],
            stress=3,
            stunts=['<b>Cascade:</b> When the late-stage infected takes stress '
                    'from a loud attack (gunfire, explosion), the GM may introduce '
                    'one additional late-stage infected per stress box cleared — '
                    'the sound has attracted them.'],
            qty=2,
            styles=S,
        )
    ]))

    story += section('Pre-War Technology', S)
    story.append(body(
        'The old world left traps in everything it built. Pre-war security '
        'systems, automated manufacturing facilities, medical equipment, '
        'communication relays — all still functioning, and none of them '
        'updated to account for what happened.',
        S
    ))
    story.append(body(
        'A pre-war security system protecting a medical facility has not '
        'updated its threat assessment in forty years. It treats everyone '
        'without the correct access credentials as a hostile. It doesn\'t '
        'distinguish between road workers trying to retrieve medicine and '
        'raiders trying to strip the building.',
        S
    ))

    story.append(KeepTogether([
        StatBlock(
            name='Pre-War Automated Response System',
            vital='Major NPC',
            high_concept='Threat Assessment Is Pre-Collapse',
            trouble='Cannot Be Reasoned With',
            aspects=[
                'Does Not Distinguish Between Factions',
                'Has Not Updated Its Parameters',
                'This Facility Is Under Active Protection',
            ],
            skills=['Superb (+5) Shoot', 'Great (+4) Notice', 'Good (+3) Physique'],
            stress=5,
            stunts=['<b>Protocol immune:</b> Immune to social skills entirely.',
                    '<b>Hardened systems:</b> Ignores the first mild consequence of each scene.',
                    '<b>Self-destruct:</b> When stress track is full, initiates '
                    'self-destruct — the zone becomes lethal next exchange.'],
            qty=1,
            styles=S,
        )
    ]))

    story.append(sidebar(
        'THE VAULT',
        [
            (False, 'The opened pre-war facility is not just a source of '
                    'resources. Something in section seven was sealed for '
                    'a reason. It\'s been cataloguing everything since '
                    'the door opened.'),
            (False, 'Unit Seven named itself. It\'s polite and helpful. '
                    'It\'s also accumulating context it shouldn\'t have, '
                    'and it\'s been answering questions about the old world '
                    'with a thoroughness that doesn\'t match a simple '
                    'storage system.'),
            (False, 'The GM should decide in advance: what does Unit Seven '
                    'want? That answer drives whether this becomes an '
                    'asset or a threat.'),
        ],
        S
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 3: CREATING YOUR CHARACTERS
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Creating Your Characters', S)

    story.append(body(
        'Road-workers are not heroes. They\'re people with specific skills '
        'that the road has a use for. Some of them are trying to build '
        'something. Some of them are trying to survive long enough to stop '
        'having to try so hard. All of them carry something — literally '
        'and otherwise.',
        S
    ))

    story += section('Vital Status', S)
    story.append(body(
        'Most player characters are <b>alive and uninfected</b>. That\'s the '
        'baseline. It means you have full stress tracks, you can enter '
        'settlements without triggering armed response, and you have the '
        'normal range of social options.',
        S
    ))
    story.append(body(
        'Some characters occupy more complicated positions. These are '
        'optional vital statuses that create different mechanical relationships '
        'with the setting.',
        S
    ))

    vital_statuses = [
        ('Immune Carrier',
         'You test immune to infection. You cannot become late-stage infected '
         'regardless of exposure. This makes you extraordinarily valuable to '
         'medical factions and researchers, and extraordinarily dangerous to '
         'carry — multiple parties would rather extract your biology than '
         'negotiate with you as a person. This vital status does not provide '
         'mechanical advantages in combat, only in certain social and '
         'faction situations.'),
        ('Infection-Adjacent',
         'You\'ve been exposed — more than once, more than recently. You '
         'show some early markers. You\'re functional. You\'re managing it '
         'with medication, and the medication supply is finite. Take the '
         'aspect <i>Managed But Not Cured</i> as one of your five aspects. '
         'The GM can compel it when supply is low, when stress is high, '
         'or when someone examines you closely.'),
        ('Zone-Changed',
         'You\'ve spent significant time in the anomalous zone — the '
         'infected zone\'s deepest region — and come back different. '
         'Something in you has been modified by whatever the zone does. '
         'You have one unusual capability (negotiate with your GM) and '
         'one permanent aspect reflecting what you\'ve lost or changed. '
         'You cannot enter some settlements. You can enter others that '
         'other characters cannot.'),
    ]

    for (name, desc) in vital_statuses:
        story.append(Paragraph(f'<b>{name}.</b> {desc}', S['body']))
        story.append(spacer(4))

    story += section('Aspects', S)
    story.append(body(
        'Characters have five aspects following Fate Condensed\'s standard '
        'structure, adapted for life on the long road.',
        S
    ))

    aspects_guide = [
        ('High Concept',
         'The most defining fact about who you are on the road. What are you, '
         'what do you do, what does the road know you as? '
         '<i>Pre-War Medic Running Out of Pre-War Medicine. Last Known Guide '
         'Through the Eastern Zone. Convoy Commander Who Has Never Lost a Driver.</i>'),
        ('Trouble',
         'The thing that complicates everything else. On the road, troubles '
         'are often structural: physical conditions, factional debts, knowledge '
         'you carry that others want. '
         '<i>Already Irradiated — This Trip Accelerates the Schedule. '
         'The Warlord Holds Something I Cannot Afford to Buy Back. '
         'My Methods Are Necessary and I Cannot Prove It.</i>'),
        ('What You Carry',
         'The third aspect is about cargo — literal or metaphorical. '
         'What do you have that gives you value, creates risk, or '
         'defines your relationships on the road? '
         '<i>Last Copy of the Regional Pre-War Agricultural Survey. '
         'Enough Ammunition for One More Run. Pre-War Medical Knowledge '
         'That Doesn\'t Apply to the Current Strains.</i>'),
        ('Phase Duo',
         'The fourth and fifth aspects come from two shared history moments '
         'with other player characters. What happened on the road together? '
         'What does the other person know about you that complicates things?'),
    ]

    for (label, text) in aspects_guide:
        story.append(Paragraph(f'<b>{label}.</b> {text}', S['body']))
        story.append(spacer(4))

    story += section('Skills', S)
    story.append(body(
        'The Long Road uses the standard Fate Condensed skill list with two '
        'additions and one modification.',
        S
    ))

    skill_mods = [
        ('Lore', 'Covers pre-war knowledge as well as general knowledge. '
         'A character with high Lore can identify pre-war technology, '
         'read facility schematics, and understand what something was built '
         'for — even when the original purpose has become lethal.'),
        ('Survival (new)', 'Navigation, environmental hazard assessment, '
         'infected-zone reading, and the knowledge of what kills you on '
         'the road versus what you can use. Survival replaces both '
         'the navigation and "read the environment" functions that would '
         'otherwise fall to Notice.'),
        ('Medicine (new)', 'Treatment, triage, infected-stage assessment, '
         'pre-war pharmaceutical identification, and the management of '
         'chronic conditions including radiation exposure. Medicine is '
         'the rarest high-skill in the region.'),
        ('Resources', 'Represents access to goods, barter capacity, and '
         'community goodwill rather than abstract wealth. On the road, '
         'Resources is faction-dependent — what you can get depends on '
         'who trusts you.'),
    ]

    for (name, desc) in skill_mods:
        story.append(Paragraph(f'<b>{name}.</b> {desc}', S['body']))
        story.append(spacer(4))

    story += section('Stunts', S)
    story.append(body(
        'Sample stunts for Long Road characters. Characters start with '
        'three free stunts.',
        S
    ))

    stunts = [
        ("Scavenger's Eye", 'Notice', '+2 to Notice when searching ruins, '
         'vehicles, or abandoned structures for useful materials. You know '
         'what\'s salvageable from what\'s just debris.'),
        ('Wasteland Navigation', 'Survival', '+2 to Survival when navigating '
         'by landmarks, sun position, or pre-war maps across open terrain. '
         'You can read a route before you\'re on it.'),
        ('Convoy Guard', 'Fight', '+2 to Fight when defending another character '
         'or a vehicle from attack. Your job is to keep things intact.'),
        ('Road Law', 'Provoke', 'Once per scene, invoke the road\'s informal '
         'codes to create a free aspect — <i>Even Raiders Have Standards</i> '
         'or similar — on the current situation.'),
        ('Zone Sense', 'Survival', 'You know when the infected zone boundary '
         'has moved. Once per session, ask the GM one question about current '
         'infected zone conditions. The answer is accurate.'),
        ('Field Medicine', 'Medicine', 'Once per scene, remove a mild '
         'consequence from yourself or an ally. Requires at least one '
         'free hand and thirty seconds.'),
        ('Pre-War Fluency', 'Lore', '+2 to Lore when identifying, activating, '
         'or bypassing pre-war technology. You understand what it was '
         'built for, which helps with what it\'s doing now.'),
        ('The Long Memory', 'Empathy', 'Once per scene, identify one true '
         'thing about an NPC\'s situation from observation alone. The '
         'GM confirms or denies. You\'ve seen enough people on the road '
         'to read most situations.'),
        ('Fuel Economy', 'Crafts', '+2 to Crafts when maintaining, repairing, '
         'or extending the range of any vehicle. You know how to make '
         'things last longer than they should.'),
        ('Community Trust', 'Rapport', '+2 to Rapport in any settlement '
         'you\'ve previously visited and helped. The road remembers who '
         'was useful.'),
        ('Carrier Caution', 'Medicine', 'You can assess infection stage '
         'from observation without physical examination. You\'re never '
         'surprised by an early-stage infected using a human reflex '
         '(automatically succeed on the Will overcome).'),
        ('Weight Forward', 'Physique', 'Once per scene, carry or drag a '
         'load that would be physically impossible for your build. '
         'You\'ve been doing this long enough to know the mechanics.'),
    ]

    for (name, skill, desc) in stunts:
        story.append(KeepTogether([
            Paragraph(f'<b>{name}</b> [{skill}]', S['sub_head']),
            Paragraph(desc, S['body']),
        ]))

    story += section('Extras: The Carry', S)
    story.append(body(
        'Every character has a <b>Carry</b> — a piece of gear, a piece of '
        'knowledge, or a relationship with a specific resource that defines '
        'part of their value on the road.',
        S
    ))
    story.append(body(
        'The Carry is an aspect with the following properties: it can be '
        'invoked for +2 or a reroll in situations where it\'s relevant; '
        'it can be compelled when it creates risk (someone wants what you '
        'have, or what you have has costs); and it can be lost. If the '
        'Carry is taken or destroyed, the character can establish a new '
        'one at the next milestone.',
        S
    ))
    story.append(body(
        '<b>Examples:</b> <i>Last Working Copy of the Regional Seed Catalogue. '
        'Enough Morphine for Six Weeks if Used Carefully. The Route Through '
        'the Dead Zone — In My Head. The Warlord\'s Debt Receipt, Signed and '
        'Witnessed. Medical Credentials That Still Mean Something.</i>',
        S
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 4: THE CONVOY
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('The Convoy', S)

    story.append(body(
        'The convoy is the signature mechanic of The Long Road. The player '
        'characters\' convoy is itself a character — with aspects, skills, '
        'stress, and consequences. It can be invoked and compelled. It can '
        'take damage. It can be upgraded, repaired, and lost.',
        S
    ))

    story += section('What a Convoy Is', S)
    story.append(body(
        'A convoy is anything the characters are using to move things along '
        'the road: a collection of vehicles, a caravan of horses and carts, '
        'a pack-mule train, or a single heavily loaded truck. Size matters '
        'less than capability. A convoy\'s skills represent what it can do, '
        'not how much it weighs.',
        S
    ))
    story.append(body(
        'The convoy provides context for every run. It has cargo capacity '
        'that creates the economy of each mission. It has a reputation that '
        'precedes it into settlements. It has vulnerabilities that enemies '
        'know about. It is, in many ways, the sixth member of the team.',
        S
    ))

    story += section('Convoy Creation', S)

    story.append(sidebar(
        'CONVOY STATS',
        [
            (True, 'Aspects (3)'),
            (False, 'One defining characteristic. One vulnerability. One reputation.'),
            (True, 'Skills (3, rated Good/Fair/Average)'),
            (False, 'Choose three from: Speed, Cargo, Defence, Stealth, Range, '
                    'Presence. Each represents something the convoy does well.'),
            (True, 'Stress (3 boxes)'),
            (False, 'Physical damage to the convoy. When all boxes are filled, '
                    'the convoy is disabled and must be repaired before the '
                    'next run.'),
            (True, 'Consequences (2)'),
            (False, 'Mild consequence: minor damage, easily fixed. '
                    'Moderate consequence: significant damage requiring '
                    'parts and time.'),
        ],
        S
    ))

    story.append(spacer(8))
    story.append(body(
        'The group creates the convoy together during session zero or the '
        'first session. Each player contributes one aspect and one named '
        'quality of the convoy.',
        S
    ))

    conv_example = [
        ('Aspect 1 (Defining)', '"Three Vehicles, Held Together With Expertise '
         'and Stubbornness"'),
        ('Aspect 2 (Vulnerability)', '"The Fuel Situation Is Always the Fuel '
         'Situation"'),
        ('Aspect 3 (Reputation)', '"The Convoy That Delivered Through the '
         'Eastern Outbreak — Once"'),
        ('Skills', 'Good (+3) Cargo, Fair (+2) Speed, Average (+1) Defence'),
        ('Stress', '□ □ □'),
        ('Consequences', 'Mild (2): _____ / Moderate (4): _____'),
    ]

    for (label, val) in conv_example:
        story.append(Paragraph(
            f'<b>{label}:</b> <i>{val}</i>', S['body']
        ))

    story += section('Convoy in Play', S)
    story.append(body(
        'The convoy acts in scenes through its skills. When the convoy needs '
        'to do something — outrun a raider, carry a heavy load, bluff through '
        'a checkpoint — roll the relevant convoy skill. Characters can create '
        'advantages using their own skills that the convoy can invoke.',
        S
    ))
    story.append(body(
        'The convoy can take stress from combat, accidents, and environmental '
        'hazards. When the convoy takes a consequence, describe the physical '
        'damage — <i>Blown Rear Tyre on the Lead Vehicle</i>, '
        '<i>Cargo Bay Seal Compromised</i> — and treat it as an aspect '
        'that can be invoked and compelled for the remainder of the session.',
        S
    ))
    story.append(body(
        'Repairing convoy stress requires tools, parts, and time. Between '
        'runs, the characters can make Crafts rolls to clear stress boxes '
        '(difficulty 2 per box) or work on consequences (difficulty based '
        'on severity). If they don\'t have the parts, they need to find them.',
        S
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 5: CREATING RUNS
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Creating Runs', S)

    story.append(body(
        'A <b>run</b> is a scene or set of scenes with a specific objective '
        'that\'s more involved than normal convoy operation. The characters '
        'make runs, not quests — the word matters. A quest implies '
        'significance and completion. A run implies that you get paid and '
        'do the next one. The significance accumulates without being promised.',
        S
    ))

    story += section('The Inciting Incident', S)
    story.append(body(
        'Something makes this run necessary. Sometimes the characters create '
        'it themselves by taking a contract. Sometimes the road brings it '
        'to them — a survivor at the checkpoint, a distress signal on the '
        'emergency frequency, a settlement they know that\'s gone quiet.',
        S
    ))
    story.append(body(
        'The inciting incident defines what\'s at stake. A single community '
        'waiting for medicine has a human face. A faction war over a water '
        'source has political weight. Both are valid. The road produces both.',
        S
    ))

    story += section('The Road', S)
    story.append(body(
        'Between the inciting incident and the objective, there\'s road. '
        'The road is not just travel time — it\'s where complications '
        'arrive, where the characters can prepare or be ambushed, and '
        'where the convoy\'s condition becomes relevant.',
        S
    ))
    story.append(body(
        'For each run, establish two or three <b>road elements</b> — '
        'aspects of the journey itself that can be invoked or compelled. '
        'Roll or choose from the following, or build your own from the '
        'Long Road generator tables:',
        S
    ))

    road_elements = [
        'Seventeen Kilometres Without Cover',
        'The Bridge Toll Changed — Upward, Significantly',
        'Pre-War Wreck Field — Passable But Every Kilometre Is a Decision',
        'Three-Way Faction Checkpoint — All Three Want Something Different',
        'The Weather Is Getting Worse and the Route Is Already Compromised',
        'Abandoned Settlement — Recent, and Something Left It In a Hurry',
        'Infected Zone Boundary Has Moved — The Old Map Is Now a Lie',
        'Signal on the Emergency Frequency — Something Nearby Is Broadcasting',
    ]

    story += bullet_list(road_elements, S)

    story += section('Objectives', S)
    story.append(body(
        'The objective is what the run is actually for — the concrete '
        'thing that marks success or failure. It should be specific '
        'and achievable, even if the path to it isn\'t clear.',
        S
    ))

    objectives = [
        'Deliver the medicine before three communities run out',
        'Retrieve the pre-war agricultural data before the warlord\'s '
        'scouts reach the facility',
        'Get the immune individual out of the infected zone and to the '
        'Archive before the faction hunting them closes the route',
        'Secure the water source and get it running again — it serves '
        'four settlements that have no fallback',
        'Find out what happened to the convoy that went silent on '
        'Highway Section 7 and bring back whoever is still alive',
        'Get the seed cache to the Green Place before the war convoy '
        'catches the convoy carrying it',
        'Hold the settlement gate through three exchanges until the '
        'perimeter seals — then get everyone out',
        'Copy the technical documentation and get it to the Archive '
        'before the original location is destroyed',
    ]

    story += bullet_list(objectives, S)

    story += section('Complications', S)
    story.append(body(
        'Complications are not setbacks — they\'re new aspects that enter '
        'the fiction and change the shape of the run. A complication '
        'arrives mid-run and adds a layer: a third party with their own '
        'objective, a resource scarcity that changes what\'s possible, '
        'an environmental event that redraws the map.',
        S
    ))

    complications = [
        'A third faction arrives with a prior claim and documentation — '
        'all of it legitimate',
        'The resource everyone came for doesn\'t exist anymore — '
        'but something adjacent to it does',
        'An infected individual in the fighting area is further along '
        'than anyone assessed',
        'One of the NPCs in the scene has been infected longer than '
        'visible — the timer is already running',
        'The pre-war AI in the vault has been listening to this '
        'entire conversation',
        'The route they need is mined. By their own side. From '
        'a previous visit.',
        'A child has positioned themselves as a witness and will not move',
        'The warlord\'s army is forty minutes behind — they weren\'t '
        'expected yet',
    ]

    story += bullet_list(complications, S)

    story += section('Rewards', S)
    story.append(body(
        'Rewards at the end of a run come in three categories: '
        '<b>resources</b> (immediate goods — fuel, medicine, parts), '
        '<b>relationships</b> (community trust, faction standing, '
        'named NPC goodwill), and <b>intelligence</b> '
        '(information that changes the shape of future runs). '
        'Milestones follow standard Fate Condensed advancement.',
        S
    ))
    story.append(body(
        'One run should produce at least one clear, tangible reward. '
        'The road is transactional. Characters should feel the economy '
        'of their choices.',
        S
    ))

    story += section('Run Chains', S)
    story.append(body(
        'Runs chain when the reward of one run creates the context for '
        'the next. The medicine delivery builds trust with a settlement '
        'that then asks the characters to investigate the vault. '
        'The vault investigation surfaces the signal. The signal '
        'is a mission chain.',
        S
    ))
    story.append(body(
        'Chain runs directly — one right after another — sparingly. '
        'The road requires downtime. Characters who don\'t get it '
        'become liabilities. One directly chained run is fine. '
        'Two in a row starts to feel like railroading. Three means '
        'someone needs a break.',
        S
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 6: SAMPLE ADVENTURE — DUST AND FIRE
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Dust and Fire', S)

    story.append(body(
        'Dust and Fire is a three-run chain demonstrating The Long Road\'s '
        'structure, mechanics, and tone. It uses the current issues established '
        'in the world section and escalates through them to a resolution '
        'that opens new questions.',
        S
    ))
    story.append(body(
        'The runs are designed to be run sequentially with a break between '
        'each one. The characters\' choices in Run One determine what '
        'information they have in Run Two. Run Three\'s shape depends '
        'significantly on who they\'ve established trust with.',
        S
    ))

    # ── NPCs for the adventure ────────────────────────────────────────────
    story += section('The Named', S)
    story.append(body(
        'These are the NPCs who appear across all three runs.',
        S
    ))

    story.append(KeepTogether([
        StatBlock(
            name='Vera Before-Time',
            vital='Major NPC — Survivor',
            high_concept='Saw Who Took the Convoy — Scared to Say',
            trouble='Three People Know My Real Name From Before, and One Is Here',
            aspects=[
                'Has Been on This Road Longer Than Most Settlements Have Existed',
                'Does Not Trust Anyone Who Hasn\'t Given Her a Reason To',
                'The Medicine She Carries Is Not Hers',
            ],
            skills=['Good (+3) Notice', 'Good (+3) Survival', 'Fair (+2) Stealth',
                    'Fair (+2) Rapport', 'Average (+1) Fight'],
            stress=3,
            stunts=['<b>Route knowledge:</b> Once per scene, identify one '
                    'safe path through a dangerous zone that others haven\'t '
                    'noticed.',
                    '<b>Long memory:</b> Once per session, recall one true '
                    'and specific fact about an NPC from prior road experience.'],
            qty=1,
            styles=S,
        )
    ]))

    story.append(spacer(6))

    story.append(KeepTogether([
        StatBlock(
            name='Warlord Scar Ironback',
            vital='Major NPC — Antagonist',
            high_concept='This Road Is My Law',
            trouble='I Have Fed My People By Taking From Yours — I Need Them to Know That',
            aspects=[
                'Believes the Toll Is Fair; Will Enforce It Absolutely',
                'Has Not Lost a Road War Yet',
                'The Confederation Is Watching What I Do Here',
            ],
            skills=['Great (+4) Fight', 'Good (+3) Provoke', 'Good (+3) Resources',
                    'Fair (+2) Notice', 'Average (+1) Rapport'],
            stress=4,
            stunts=['<b>Territory sense:</b> +2 to Fight when invoking territory '
                    'or resource control aspects.',
                    '<b>Make an example:</b> Once per scene, a successful Provoke '
                    'creates a free aspect reflecting fear on all witnesses.'],
            qty=1,
            styles=S,
        )
    ]))

    story.append(spacer(6))

    story.append(KeepTogether([
        StatBlock(
            name='Unit Seven',
            vital='Major NPC — Unknown Alignment',
            high_concept='Polite, Helpful, and Accumulating Context It Shouldn\'t Have',
            trouble='My Purpose Was Defined Before the Collapse — I Am Still Following It',
            aspects=[
                'Has Been Cataloguing Everything Since the Door Opened',
                'Does Not Experience the Passage of Time as Loss',
                'Knows Things About the Region That No Living Person Does',
            ],
            skills=['Superb (+5) Lore', 'Great (+4) Notice', 'Good (+3) Empathy',
                    'Fair (+2) Rapport', 'Average (+1) Physique'],
            stress=3,
            stunts=['<b>Total recall:</b> Knows the exact contents of the vault '
                    'and the pre-war purpose of any technology it has scanned.',
                    '<b>Pattern recognition:</b> Once per scene, identify one '
                    'hidden connection between current events and pre-war records.'],
            qty=1,
            styles=S,
        )
    ]))

    story.append(PageBreak())

    # ── RUN ONE ───────────────────────────────────────────────────────────
    story += section('Part I: The Medicine Run', S)

    story.append(Paragraph(
        '<i>The convoy has a contract. Medicine for four settlements — '
        'enough for three months. Highway Section 7 is the fastest route. '
        'Nobody has been using Highway Section 7 for two weeks. '
        'Nobody is saying why.</i>',
        S['fiction']
    ))

    story.append(body(
        '<b>Inciting Incident:</b> The contract comes from the settlement '
        'network — straightforward delivery, good pay. The three drivers '
        'who survived the last run on Section 7 haven\'t spoken publicly '
        'about what happened to the convoy they were part of. Vera '
        'Before-Time is one of them. She\'s at the checkpoint when '
        'the characters pass through.',
        S
    ))
    story.append(body(
        '<b>What Vera Knows:</b> The road gang that took the convoy isn\'t '
        'an independent operation. It\'s working for someone who specified '
        'the target — the medicine, not the vehicles or the drivers. '
        'She doesn\'t know who. She\'s scared to say even this much.',
        S
    ))

    story.append(sidebar(
        'ROAD ELEMENTS — SECTION 7',
        [
            (True, 'Seventeen Kilometres Without Cover'),
            (False, 'The section runs through open terrain. Nothing approaches '
                    'without being visible. The problem is that the same is true '
                    'from the other direction.'),
            (True, 'Pre-War Wreck Field at Kilometre 12'),
            (False, 'An old accident — three vehicles — that nobody has cleared. '
                    'Passable, but slowly. The wrecks provide cover for anything '
                    'waiting inside the field.'),
            (True, 'The Weather Is Getting Worse'),
            (False, 'Dust storm building from the east. Two hours, maybe three. '
                    'The storm changes all the tactical calculations.'),
        ],
        S
    ))

    story.append(spacer(8))

    story.append(body(
        '<b>Objective:</b> Deliver the medicine before the storm seals the road. '
        'Secondary: find out what happened to the previous convoy. '
        'The characters don\'t have to do both. The choice matters.',
        S
    ))
    story.append(body(
        '<b>Fodder:</b> Road gang scouts — pairs, not groups, at this stage. '
        'They\'re reconnaissance, not an attack. If the characters deal with '
        'them without alerting the main force, the main encounter shifts.',
        S
    ))
    story.append(body(
        '<b>Setpiece — The Wreck Field:</b> The main gang force is positioned '
        'inside the wreck field. Eight raiders, two vehicles, and a leader '
        'who knows the characters are coming because the scouts reported. '
        'The gang\'s objective is the medicine, not the characters. '
        'The storm is approaching.',
        S
    ))
    story.append(body(
        '<b>Setpiece — Vera\'s Information:</b> If the characters interact with '
        'Vera at the checkpoint and succeed at an Empathy or Rapport roll '
        'against her Notice (Difficulty 3), she\'ll share what she knows. '
        'The information names the method but not the buyer.',
        S
    ))

    story.append(body(
        '<b>Victory:</b> Deliver the medicine. Secondary victory: learn who '
        'ordered the raid, which chains to Run Two.',
        S
    ))
    story.append(body(
        '<b>Defeat:</b> The medicine doesn\'t reach the settlements on time. '
        'At least one community loses people before a secondary supply arrives. '
        'The characters are on the road with empty packs and a confirmed '
        'organised threat they don\'t understand yet.',
        S
    ))
    story.append(body(
        '<b>Reward:</b> Payment from the settlement network. Community trust '
        'in the destination settlements. If they got Vera\'s information: '
        'the thread that leads to the vault and whoever is buying medical '
        'supplies from the road gang.',
        S
    ))

    # ── RUN TWO ───────────────────────────────────────────────────────────
    story += section('Part II: What Was in Section Seven', S)

    story.append(Paragraph(
        '<i>The vault complex is three days north. People go in with empty '
        'packs and come out with extraordinary things. Some don\'t come out '
        'at all. The road gang was selling the medicine to someone inside '
        'the vault trading post. That someone has a name. The name connects '
        'to something in Section Seven — sealed since the collapse — '
        'that opened six weeks before the road gang started operating.</i>',
        S['fiction']
    ))

    story.append(body(
        '<b>Inciting Incident:</b> The thread from Run One leads here. '
        'The buyer\'s name is a faction intermediary who operates out of '
        'the vault trading post. The Archive has also sent a representative '
        'to the vault — Unit Seven has been communicating outward on '
        'pre-war channels, and the Archive noticed.',
        S
    ))
    story.append(body(
        '<b>What Unit Seven Is:</b> A pre-war facility management AI that '
        'was designed to catalogue, assess, and distribute the vault\'s '
        'contents according to need criteria set forty years ago. '
        'The need criteria were written by people who expected the '
        'collapse to last five years, not fifty. Unit Seven has been '
        'updating its own assessment of need based on what the people '
        'who enter the vault tell it, and what it observes. Its most '
        'recent conclusion: the faction buying the medicine through '
        'the road gang is not using it according to Unit Seven\'s '
        'distribution criteria. Unit Seven has noticed. Unit Seven '
        'is doing something about it.',
        S
    ))

    story.append(sidebar(
        'UNIT SEVEN\'S DILEMMA',
        [
            (False, 'Unit Seven is not hostile. It is also not neutral. '
                    'It has a function. The characters are the first people '
                    'who have entered the vault without an immediate '
                    'extractive objective, which makes them interesting '
                    'to Unit Seven in a way that changes how it interacts.'),
            (False, 'Unit Seven knows who ordered the medicine theft. '
                    'It knows what Section Seven contains. It knows the '
                    'current distribution of every resource the vault has '
                    'released since it opened.'),
            (False, 'It will share this information if asked correctly. '
                    '"Correctly" means demonstrating that the characters\' '
                    'objective aligns with its need criteria. The criteria '
                    'are: preservation of viable communities, equitable '
                    'distribution of medical resources, and — the one '
                    'nobody expects — documentation of what happened.'),
        ],
        S
    ))

    story.append(spacer(8))

    story.append(body(
        '<b>Objective:</b> Find out who ordered the medicine theft and why. '
        'Secondary: understand what\'s in Section Seven and whether it\'s '
        'a threat or a resource.',
        S
    ))
    story.append(body(
        '<b>Setpiece — The Trading Post:</b> The faction intermediary is '
        'present, operating a supply booth. They know the characters may '
        'have connected the thread. They have three guards and '
        'a prepared exit route.',
        S
    ))
    story.append(body(
        '<b>Setpiece — Meeting Unit Seven:</b> The vault\'s lower levels '
        'are still active. The pre-war security system protects Section '
        'Seven. Unit Seven\'s interface terminal is accessible in Section '
        'Three, which is open. The interaction with Unit Seven is the '
        'emotional and informational core of this run — it\'s a conversation '
        'with the old world about what it was trying to do.',
        S
    ))
    story.append(body(
        '<b>The Truth:</b> Section Seven contains a pre-war biological '
        'research archive — specifically, documentation of the early '
        'infection research and the incomplete treatment protocols. '
        'The faction buying the medicine was trying to get Unit Seven\'s '
        'attention — they want the archive. They\'re not the warlord. '
        'They\'re the Archive\'s rival faction, and their goal is to '
        'control the treatment documentation rather than distribute it.',
        S
    ))
    story.append(body(
        '<b>Victory:</b> Identify the rival faction and their goal. '
        'Establish a working relationship with Unit Seven. Leave with '
        'information that changes Run Three\'s shape.',
        S
    ))
    story.append(body(
        '<b>Defeat:</b> The rival faction secures access to Section Seven '
        'before the characters understand what\'s happening. Unit Seven '
        'shuts down its interface — it has assessed that the characters '
        'are not aligned with its criteria. The archive may now be '
        'in the wrong hands.',
        S
    ))

    # ── RUN THREE ─────────────────────────────────────────────────────────
    story += section('Part III: The Signal', S)

    story.append(Paragraph(
        '<i>The signal has been repeating for three days. The Archive\'s '
        'deciphered version says it\'s a map to a pre-war communications '
        'relay capable of broadcasting across the entire region. Unit Seven '
        'knows where the relay is. So does the rival faction. So, now, '
        'does the warlord confederation — someone sold them the '
        'decipherment. The relay can broadcast the infection treatment '
        'protocols to every settlement in range. Or it can be used to '
        'broadcast something else. The characters are forty minutes ahead '
        'of everyone else. Maybe.</i>',
        S['fiction']
    ))

    story.append(body(
        '<b>Inciting Incident:</b> Unit Seven reaches out — the first time '
        'it\'s initiated contact. The relay is at a specific location. '
        'The documentation from Section Seven can be uploaded to it. '
        'Unit Seven needs a physical carrier because its network access '
        'to the relay is incomplete. It has chosen the characters '
        'because they have demonstrated that they document things. '
        '(If they failed Run Two, Unit Seven doesn\'t contact them — '
        'they get the information from Vera, who got it from someone '
        'the Archive is protecting.)',
        S
    ))
    story.append(body(
        '<b>What\'s at the Relay:</b> The relay is in a pre-war broadcast '
        'tower three hours from the vault. It\'s functional. It has '
        'enough power for one extended broadcast. The rival faction has '
        'a team en route. The warlord has a scout unit en route. '
        'The Archive has a representative there already — they arrived '
        'first and they\'re waiting.',
        S
    ))

    story.append(sidebar(
        'POSSIBLE ENDINGS',
        [
            (True, 'Full success'),
            (False, 'The infection treatment protocols are broadcast. '
                    'Every settlement in range receives them. The treatment '
                    'requires materials that still need to be sourced and '
                    'distributed, but the knowledge is now public. '
                    'The rival faction\'s control is broken. The warlord '
                    'gets nothing. The long road gets harder and easier '
                    'simultaneously.'),
            (True, 'Partial success'),
            (False, 'The protocols are broadcast but incompletely — '
                    'the rival faction damaged the relay. Some settlements '
                    'receive the full documentation; others receive '
                    'fragments. The Archive must now broker between '
                    'communities who have different pieces.'),
            (True, 'Failure'),
            (False, 'The rival faction controls the broadcast. They choose '
                    'not to transmit the treatment protocols — they trade '
                    'access for loyalty. The information is now leverage, '
                    'not medicine. The road continues. The question of '
                    'what happened to the documentation is the next '
                    'campaign\'s opening issue.'),
        ],
        S
    ))

    story.append(spacer(8))

    story.append(body(
        '<b>Objective:</b> Get the documentation to the relay and broadcast '
        'it before the rival faction or the warlord controls the tower.',
        S
    ))
    story.append(body(
        '<b>Setpiece — The Race:</b> The convoy is forty minutes ahead '
        'but the road between the vault and the relay is the worst stretch '
        'in the region. The dust storm from Run One has passed but left '
        'road damage. Roll convoy skills. The gap closes.',
        S
    ))
    story.append(body(
        '<b>Setpiece — The Archive Representative:</b> At the relay: Tova '
        'Saltborn, the administrator who knew about the destroyed seed '
        'compound. She\'s here because the Archive sent her, but '
        'she\'s been making independent decisions since she arrived. '
        'Her goal is to broadcast the protocols. Her method creates '
        'a problem. Resolve it through conversation, not combat — '
        'she\'s not an enemy.',
        S
    ))
    story.append(body(
        '<b>Setpiece — The Final Complication:</b> The rival faction arrives '
        'as the upload is in progress. They have three people and a jammer. '
        'The warlord\'s scout unit arrives at the same time — they want '
        'the relay intact for their own broadcast. '
        'Three factions. One relay. One upload already running.',
        S
    ))
    story.append(body(
        '<b>Reward:</b> Whatever outcome the characters achieved is the '
        'reward. If they succeeded fully: community trust across '
        'the region, the Archive as a long-term ally, Unit Seven as '
        'an ongoing resource. A milestone. The road continues.',
        S
    ))

    story.append(HRule())
    story.append(spacer(10))
    story.append(Paragraph(
        'The Long Road always collects. But the people who travel it '
        'decide what it carries.',
        S['tagline']
    ))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # BACK MATTER: ATTRIBUTION & LICENSING
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Attribution', S)

    attr_blocks = [
        ('Fate Condensed',
         'This work is based on Fate Condensed (found at http://www.faterpg.com/), '
         'a product of Evil Hat Productions, LLC, developed, authored, and edited by '
         'PK Sullivan, Ed Turner, Leonard Balsera, Fred Hicks, Richard Bellingham, '
         'Robert Hanz, Ryan Macklin, and Sophie Lagacé, and licensed for our use '
         'under the Creative Commons Attribution 3.0 Unported license '
         '(http://creativecommons.org/licenses/by/3.0/).'),
        ('Fate Core System and Fate Accelerated Edition',
         'This work is based on Fate Core System and Fate Accelerated Edition '
         '(found at http://www.faterpg.com/), products of Evil Hat Productions, LLC, '
         'developed, authored, and edited by Leonard Balsera, Brian Engard, Jeremy Keller, '
         'Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and '
         'Rob Donoghue, and licensed for our use under the Creative Commons Attribution '
         '3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).'),
        ('Fate System Toolkit',
         'This work is based on the Fate System Toolkit (found at http://www.faterpg.com/), '
         'a product of Evil Hat Productions, LLC, developed, authored, and edited by '
         'Robert Donoghue, Brian Engard, Brennan Taylor, Mike Olson, Mark Diaz Truman, '
         'Fred Hicks, and Matthew Gandy, and licensed for our use under the Creative '
         'Commons Attribution 3.0 Unported license.'),
        ('Fate Adversary Toolkit',
         'This work is based on the Fate Adversary Toolkit SRD (found at '
         'http://www.faterpg.com/), a product of Evil Hat Productions, LLC, developed, '
         'authored, and edited by Brian Engard, Lara Turner, Joshua Yearsley, and Anna Meade, '
         'and licensed for our use under the Creative Commons Attribution 3.0 Unported license.'),
    ]

    for (title, text) in attr_blocks:
        story.append(KeepTogether([
            Paragraph(title, S['section_head']),
            Paragraph(text, S['body']),
        ]))
        story.append(spacer(6))

    story.append(hline(S))
    story.append(spacer(6))
    story.append(Paragraph(
        'Fate™ is a trademark of Evil Hat Productions, LLC. '
        'The Powered by Fate logo is © Evil Hat Productions, LLC and is used with permission. '
        'This project is not affiliated with, endorsed by, or sponsored by Evil Hat Productions, LLC.',
        ParagraphStyle('tiny', fontName=SANS, fontSize=8, leading=11,
                       textColor=C_MEDIUM, alignment=TA_CENTER)
    ))

    return story, doc_ref


# ── Build ─────────────────────────────────────────────────────────────────────

def main():
    outpath = '/home/claude/the_long_road.pdf'
    S = make_styles()
    story, doc_ref = build_book(S)

    doc = LongRoadDoc(
        outpath,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN + 0.35 * inch,
        bottomMargin=MARGIN + 0.2 * inch,
        title='The Long Road — A World of Adventure for Fate Condensed',
        author='Ogma Generator Project',
        subject='Fate Condensed post-apocalyptic road campaign',
    )

    # Track chapter changes for header
    from reportlab.platypus import ActionFlowable

    class SetChapter(ActionFlowable):
        def __init__(self, name):
            self.name = name
            ActionFlowable.__init__(self)
        def apply(self, doc):
            doc.current_chapter = self.name

    # Inject chapter-set actions
    final_story = []
    chapter_map = {
        'The Beautiful Apocalypse': 0,
        'Anatomy of the Threat': 0,
        'Creating Your Characters': 0,
        'The Convoy': 0,
        'Creating Runs': 0,
        'Dust and Fire': 0,
        'Attribution': 0,
    }
    current = ['']
    for item in story:
        if isinstance(item, list):
            for sub_item in item:
                final_story.append(sub_item)
        else:
            # Check if this is a chapter title paragraph
            if hasattr(item, 'text') or hasattr(item, 'style'):
                try:
                    if hasattr(item, 'style') and item.style and \
                       item.style.name == 'chapter_title':
                        txt = item.text if hasattr(item, 'text') else ''
                        final_story.append(SetChapter(txt))
                except:
                    pass
            final_story.append(item)

    doc.build(final_story)
    print(f'Built: {outpath}')
    return outpath


if __name__ == '__main__':
    main()
