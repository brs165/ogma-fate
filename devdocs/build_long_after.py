"""
THE LONG AFTER — A World of Adventure for Fate Condensed
Full PDF generator. Palette: deep amber/gold on near-black.
Layout follows Evil Hat Worlds of Adventure conventions.
"""

from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    KeepTogether, HRFlowable, Table, TableStyle, PageBreak
)
from reportlab.platypus.flowables import Flowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

# ── Page dimensions ─────────────────────────────────────────────────────────
PAGE_W = 6 * inch
PAGE_H = 9 * inch
MARGIN = 0.65 * inch
FRAME_W = PAGE_W - 2 * MARGIN

# ── Palette — long after: deep amber-gold on near-black ──────────────────────
C_GOLD     = colors.HexColor('#D4A832')   # primary gold
C_ACCENT   = colors.HexColor('#C07A28')   # amber accent
C_DARK     = colors.HexColor('#1C1408')   # near-black warm
C_SIDEBAR  = colors.HexColor('#2A1F0F')   # dark sidebar BG
C_CREAM    = colors.HexColor('#FAF5E8')   # page cream
C_MUTED    = colors.HexColor('#7A5C18')   # muted gold
C_RULE     = colors.HexColor('#D4B870')   # border lines
C_WHITE    = colors.white
C_DIM      = colors.HexColor('#4A3520')   # very muted
C_STATBG   = colors.HexColor('#FFF9EE')   # stat card background
C_STATBDR  = colors.HexColor('#D4A832')   # stat card border

# ── Fonts ────────────────────────────────────────────────────────────────────
SERIF    = 'Times-Roman'
SERIF_B  = 'Times-Bold'
SERIF_I  = 'Times-Italic'
SERIF_BI = 'Times-BoldItalic'
SANS     = 'Helvetica'
SANS_B   = 'Helvetica-Bold'
SANS_I   = 'Helvetica-Oblique'


def make_styles():
    S = {}
    S['body'] = ParagraphStyle('body',
        fontName=SERIF, fontSize=10, leading=14.5,
        textColor=C_DARK, alignment=TA_JUSTIFY, spaceAfter=6)
    S['body_i'] = ParagraphStyle('body_i',
        parent=S['body'], fontName=SERIF_I)
    S['chapter_title'] = ParagraphStyle('chapter_title',
        fontName=SANS_B, fontSize=16, leading=19,
        textColor=C_GOLD, spaceBefore=0, spaceAfter=6,
        alignment=TA_LEFT)
    S['section_head'] = ParagraphStyle('section_head',
        fontName=SANS_B, fontSize=11.5, leading=14,
        textColor=C_DARK, spaceBefore=14, spaceAfter=4)
    S['sub_head'] = ParagraphStyle('sub_head',
        fontName=SANS_B, fontSize=10, leading=13,
        textColor=C_ACCENT, spaceBefore=10, spaceAfter=3)
    S['sidebar_title'] = ParagraphStyle('sidebar_title',
        fontName=SANS_B, fontSize=9.5, leading=12,
        textColor=C_WHITE, spaceBefore=0, spaceAfter=4)
    S['sidebar_body'] = ParagraphStyle('sidebar_body',
        fontName=SANS, fontSize=9, leading=12.5,
        textColor=C_WHITE, spaceAfter=3)
    S['sidebar_bold'] = ParagraphStyle('sidebar_bold',
        fontName=SANS_B, fontSize=9, leading=12,
        textColor=C_GOLD, spaceAfter=2)
    S['stat_name'] = ParagraphStyle('stat_name',
        fontName=SANS_B, fontSize=10.5, leading=13,
        textColor=C_DARK, spaceBefore=12, spaceAfter=1)
    S['stat_label'] = ParagraphStyle('stat_label',
        fontName=SANS_B, fontSize=8.5, leading=11,
        textColor=C_ACCENT, spaceAfter=0, spaceBefore=3)
    S['stat_body'] = ParagraphStyle('stat_body',
        fontName=SERIF, fontSize=9.5, leading=13,
        textColor=C_DARK, spaceAfter=2)
    S['fiction'] = ParagraphStyle('fiction',
        fontName=SERIF_I, fontSize=10, leading=15,
        textColor=C_MUTED, spaceBefore=8, spaceAfter=8,
        leftIndent=18, rightIndent=18)
    S['credit_title'] = ParagraphStyle('credit_title',
        fontName=SANS_B, fontSize=24, leading=28,
        textColor=C_DARK, alignment=TA_CENTER, spaceAfter=4)
    S['credit_sub'] = ParagraphStyle('credit_sub',
        fontName=SANS, fontSize=11, leading=14,
        textColor=C_ACCENT, alignment=TA_CENTER, spaceAfter=2)
    S['credit_body'] = ParagraphStyle('credit_body',
        fontName=SANS_B, fontSize=10, leading=14,
        textColor=C_DARK, alignment=TA_CENTER, spaceAfter=2)
    S['credit_note'] = ParagraphStyle('credit_note',
        fontName=SERIF_I, fontSize=8.5, leading=12,
        textColor=C_MUTED, alignment=TA_CENTER, spaceAfter=2)
    S['toc_head'] = ParagraphStyle('toc_head',
        fontName=SANS_B, fontSize=9.5, leading=13,
        textColor=C_ACCENT, spaceBefore=6)
    S['toc_entry'] = ParagraphStyle('toc_entry',
        fontName=SERIF, fontSize=10, leading=15, textColor=C_DARK)
    S['bullet'] = ParagraphStyle('bullet',
        fontName=SERIF, fontSize=10, leading=13.5,
        textColor=C_DARK, leftIndent=16, firstLineIndent=-10, spaceAfter=3)
    S['tagline'] = ParagraphStyle('tagline',
        fontName=SERIF_I, fontSize=11.5, leading=17,
        textColor=C_ACCENT, alignment=TA_CENTER,
        spaceBefore=6, spaceAfter=10)
    S['tiny'] = ParagraphStyle('tiny',
        fontName=SANS, fontSize=8, leading=11,
        textColor=C_MUTED, alignment=TA_CENTER)
    S['question'] = ParagraphStyle('question',
        fontName=SERIF_I, fontSize=10, leading=14,
        textColor=C_DARK, leftIndent=20, spaceAfter=4)
    return S


# ── Custom Flowables ──────────────────────────────────────────────────────────

class GoldRule(Flowable):
    def __init__(self, width=FRAME_W, thick=3):
        super().__init__()
        self.rw = width
        self.thick = thick
    def wrap(self, aw, ah): return self.rw, self.thick + 6
    def draw(self):
        self.canv.setFillColor(C_GOLD)
        self.canv.rect(0, 3, self.rw, self.thick, fill=1, stroke=0)


class ThinRule(Flowable):
    def __init__(self, width=FRAME_W, color=C_RULE):
        super().__init__()
        self.rw = width; self.color = color
    def wrap(self, aw, ah): return self.rw, 7
    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(0.5)
        self.canv.line(0, 3, self.rw, 3)


class SidebarBox(Flowable):
    def __init__(self, title, items, styles, width=FRAME_W):
        super().__init__()
        self.title = title
        self.items = items   # list of (bold:bool, text:str)
        self.S = styles
        self.bw = width
        self._built = []; self._h = 0

    def wrap(self, aw, ah):
        PAD = 10
        iw = self.bw - PAD * 2
        total = PAD
        self._built = []
        if self.title:
            p = Paragraph(self.title, self.S['sidebar_title'])
            _, h = p.wrap(iw, 9999)
            self._built.append((p, h, self.S['sidebar_title'].spaceAfter))
            total += h + self.S['sidebar_title'].spaceAfter
        for (bold, txt) in self.items:
            sk = 'sidebar_bold' if bold else 'sidebar_body'
            p = Paragraph(txt, self.S[sk])
            _, h = p.wrap(iw, 9999)
            self._built.append((p, h, self.S[sk].spaceAfter))
            total += h + self.S[sk].spaceAfter
        total += PAD
        self._h = total
        return self.bw, total

    def draw(self):
        PAD = 10
        c = self.canv
        c.setFillColor(C_SIDEBAR)
        c.roundRect(0, 0, self.bw, self._h, 4, fill=1, stroke=0)
        c.setFillColor(C_GOLD)
        c.rect(0, 0, 3, self._h, fill=1, stroke=0)
        y = self._h - PAD
        for (p, h, sa) in self._built:
            p.drawOn(c, PAD + 3, y - h)
            y -= h + sa


class StatBlock(Flowable):
    def __init__(self, name, vital, hc, trouble, aspects, skills,
                 stress, stunts, styles, width=FRAME_W, qty=1):
        super().__init__()
        self.name = name; self.vital = vital; self.hc = hc
        self.trouble = trouble; self.aspects = aspects
        self.skills = skills; self.stress = stress
        self.stunts = stunts; self.S = styles
        self.bw = width; self.qty = qty
        self._built = []; self._h = 0

    def _lines(self):
        L = []
        tag = f'  <font name="{SANS}" size="9" color="#C07A28">[{self.vital}]</font>' if self.vital else ''
        L.append(('stat_name', self.name + tag))
        if self.hc:
            L.append(('stat_label', 'HIGH CONCEPT'))
            L.append(('stat_body', f'<i>{self.hc}</i>'))
        if self.trouble:
            L.append(('stat_label', 'TROUBLE'))
            L.append(('stat_body', f'<i>{self.trouble}</i>'))
        if self.aspects:
            L.append(('stat_label', 'ASPECTS'))
            for a in self.aspects: L.append(('stat_body', f'• <i>{a}</i>'))
        if self.skills:
            L.append(('stat_label', 'SKILLS'))
            L.append(('stat_body', '   ·   '.join(self.skills)))
        if self.stress is not None:
            L.append(('stat_label', 'STRESS'))
            L.append(('stat_body', ('□ ' * self.stress).strip() or '—'))
        if self.stunts:
            L.append(('stat_label', 'STUNTS'))
            for st in self.stunts: L.append(('stat_body', st))
        if self.qty > 1:
            L.append(('stat_body', f'<i>Typically encountered in groups of {self.qty}.</i>'))
        return L

    def wrap(self, aw, ah):
        PAD = 10; iw = self.bw - PAD * 2
        total = PAD; self._built = []
        for (sk, txt) in self._lines():
            p = Paragraph(txt, self.S[sk])
            _, h = p.wrap(iw, 9999)
            self._built.append((p, h, self.S[sk].spaceAfter))
            total += h + self.S[sk].spaceAfter
        total += PAD; self._h = total
        return self.bw, total

    def draw(self):
        PAD = 10; c = self.canv
        c.setFillColor(C_STATBG)
        c.setStrokeColor(C_STATBDR)
        c.setLineWidth(0.75)
        c.roundRect(0, 0, self.bw, self._h, 3, fill=1, stroke=1)
        c.setFillColor(C_GOLD)
        c.rect(0, 0, 3, self._h, fill=1, stroke=0)
        y = self._h - PAD
        for (p, h, sa) in self._built:
            p.drawOn(c, PAD + 3, y - h)
            y -= h + sa


# ── Document class with header/footer chrome ─────────────────────────────────

class LongAfterDoc(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, pagesize=(PAGE_W, PAGE_H), **kwargs)
        self.current_chapter = ''
        f = Frame(MARGIN, MARGIN + 0.3*inch,
                  FRAME_W, PAGE_H - 2*MARGIN - 0.55*inch,
                  leftPadding=0, rightPadding=0,
                  topPadding=0, bottomPadding=0, id='main')
        self.addPageTemplates([PageTemplate(id='main', frames=[f],
                                            onPage=self._chrome)])

    def _chrome(self, canv, doc):
        canv.saveState()
        pg = doc.page

        # Header rule
        canv.setStrokeColor(C_GOLD)
        canv.setLineWidth(0.5)
        canv.line(MARGIN, PAGE_H - MARGIN + 6, PAGE_W - MARGIN, PAGE_H - MARGIN + 6)

        canv.setFont(SANS, 7.5)
        if pg % 2 == 1:
            canv.setFillColor(C_MUTED)
            canv.drawString(MARGIN, PAGE_H - MARGIN + 10, 'THE LONG AFTER')
            canv.setFillColor(C_GOLD)
            canv.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 10,
                                 doc.current_chapter.upper())
        else:
            canv.setFillColor(C_GOLD)
            canv.drawString(MARGIN, PAGE_H - MARGIN + 10,
                            doc.current_chapter.upper())
            canv.setFillColor(C_MUTED)
            canv.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 10,
                                 'A WORLD OF ADVENTURE FOR FATE CONDENSED')

        # Footer rule
        canv.setStrokeColor(C_RULE)
        canv.setLineWidth(0.5)
        canv.line(MARGIN, MARGIN - 4, PAGE_W - MARGIN, MARGIN - 4)

        # Page number
        if pg > 1:
            canv.setFont(SANS, 8)
            canv.setFillColor(C_GOLD)
            if pg % 2 == 1:
                canv.drawRightString(PAGE_W - MARGIN, MARGIN - 16, str(pg - 1))
            else:
                canv.drawString(MARGIN, MARGIN - 16, str(pg - 1))

        canv.restoreState()


# ── Content helpers ───────────────────────────────────────────────────────────

def chapter(title, S):
    return [Spacer(1, 6),
            Paragraph(title, S['chapter_title']),
            GoldRule(), Spacer(1, 8)]

def sec(title, S):
    return [Paragraph(title, S['section_head'])]

def sub(title, S):
    return [Paragraph(title, S['sub_head'])]

def body(txt, S, style='body'):
    return Paragraph(txt, S[style])

def fiction(txt, S):
    return Paragraph(txt, S['fiction'])

def sb(title, items, S):
    return SidebarBox(title, items, S)

def bullets(items, S):
    return [Paragraph(f'• {x}', S['bullet']) for x in items]

def sp(h=8): return Spacer(1, h)

def toc_row(label, pg, S, indent=False):
    t = Table(
        [[Paragraph(('    ' if indent else '') + label,
                    S['toc_entry' if indent else 'toc_head']),
          Paragraph(str(pg), S['toc_entry'])]],
        colWidths=[FRAME_W - 30, 30])
    t.setStyle(TableStyle([
        ('ALIGN', (0,0),(0,0),'LEFT'), ('ALIGN', (1,0),(1,0),'RIGHT'),
        ('TOPPADDING',(0,0),(-1,-1),1), ('BOTTOMPADDING',(0,0),(-1,-1),1),
        ('LEFTPADDING',(0,0),(-1,-1),0), ('RIGHTPADDING',(0,0),(-1,-1),0),
    ]))
    return t


# ── BOOK ─────────────────────────────────────────────────────────────────────

def build(S):
    story = []

    # ── TITLE PAGE ───────────────────────────────────────────────────────────
    story.append(sp(50))
    story.append(Paragraph('THE LONG AFTER', S['credit_title']))
    story.append(sp(4))
    story.append(GoldRule())
    story.append(sp(8))
    story.append(Paragraph('A WORLD OF ADVENTURE FOR', S['credit_sub']))
    story.append(Paragraph('FATE CONDENSED',
        ParagraphStyle('fl', fontName=SANS_B, fontSize=18, leading=22,
                       textColor=C_DARK, alignment=TA_CENTER, spaceAfter=4)))
    story.append(sp(10))
    story.append(Paragraph(
        'The Past is High-Tech. Ancient Phade vaults litter a dying world — '
        'their magic is a malfunctioning UI, their monsters are maintenance drones, '
        'and the warlords who claim to speak for the gods are just better '
        'at reading the error messages.',
        ParagraphStyle('tagbig', fontName=SERIF_I, fontSize=11, leading=16,
                       textColor=C_ACCENT, alignment=TA_CENTER,
                       leftIndent=20, rightIndent=20, spaceAfter=0)))
    story.append(sp(30))
    for (role, name) in [
        ('WRITING & WORLD DESIGN', 'Ogma Generator Project'),
        ('RULES SYSTEM', 'Fate Condensed — Evil Hat Productions'),
        ('DEVELOPMENT', 'Based on Fate Core System'),
    ]:
        story.append(Paragraph(role, S['credit_sub']))
        story.append(Paragraph(name, S['credit_body']))
        story.append(sp(6))
    story.append(sp(20))
    story.append(ThinRule())
    story.append(sp(8))
    story.append(Paragraph(
        'This work is based on Fate Condensed (found at http://www.faterpg.com/), '
        'a product of Evil Hat Productions, LLC, developed, authored, and edited by '
        'PK Sullivan, Ed Turner, Leonard Balsera, Fred Hicks, Richard Bellingham, '
        'Robert Hanz, Ryan Macklin, and Sophie Lagacé, and licensed for our use '
        'under the Creative Commons Attribution 3.0 Unported license '
        '(http://creativecommons.org/licenses/by/3.0/).',
        S['credit_note']))
    story.append(Paragraph(
        'Fate™ is a trademark of Evil Hat Productions, LLC. All rights reserved.',
        S['credit_note']))
    story.append(PageBreak())

    # ── TABLE OF CONTENTS ────────────────────────────────────────────────────
    story += chapter('Contents', S)
    toc = [
        ('The Long After', 3, False),
        ('The Phade', 3, True),
        ('The Dying Sun', 4, True),
        ('The Wastes', 5, True),
        ('The Warlords', 6, True),
        ('The Arena System', 6, True),
        ('Sky-Roads and the Cities Above', 7, True),
        ("The Phade's Children", 8, False),
        ('Vault Creatures', 8, True),
        ('Servitors', 9, True),
        ('The Alzabo', 10, True),
        ('Warlord Commanders', 11, True),
        ('The False Prophets', 12, True),
        ('Creating Your Characters', 14, False),
        ('The First Questions', 14, True),
        ('Aspects', 15, True),
        ('Skills', 16, True),
        ('Stunts', 17, True),
        ('Extras: The Relic', 19, True),
        ('The Relic Interface', 20, False),
        ('What a Relic Is', 20, True),
        ('The Interface Roll', 21, True),
        ('Relic Corruption', 21, True),
        ('Running the Wastes', 22, False),
        ('Inciting Incidents', 22, True),
        ('The Challenge Types', 23, True),
        ('Complications', 24, True),
        ('Rewards', 25, True),
        ('The Singing Ruin', 26, False),
        ('The Named', 27, True),
        ('Part I: The Arena of Dust', 29, True),
        ('Part II: The Desert Monastery', 32, True),
        ('Part III: The Source', 36, True),
        ('Attribution', 40, False),
    ]
    for (label, pg, indent) in toc:
        story.append(toc_row(label, pg, S, indent))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 1 — THE LONG AFTER
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('The Long After', S)

    story.append(fiction(
        'The sun is wrong. It has been wrong for a generation — too dim, too red, '
        'rising later each year. The scholars who measure it have stopped publishing '
        'their findings. The warlords who use its light to power their stolen relics '
        'are quietly stockpiling fuel. The people who live under it have started '
        'building their rituals around what comes after.',
        S))

    story.append(body(
        'The Long After is a dying-earth campaign setting for Fate Condensed. '
        'Civilisation is old enough to have risen and collapsed at least twice. '
        'The oldest ruins aren\'t human. The second-oldest are. What remains is a '
        'world picking through the wreckage of both — scavenging technology '
        'it doesn\'t fully understand, worshipping machines whose maintenance '
        'cycles are still running, and fighting over water sources that '
        'a pre-human civilisation installed millennia ago.',
        S))
    story.append(body(
        'The characters are delvers, pit fighters, sky-corsairs, and scholars — '
        'people who navigate the spaces between warlord territories, vault thresholds, '
        'and the slow apocalypse of a fading sun. They carry relics they partially '
        'understand. They make deals they\'ll partially regret. They know more about '
        'the Phade than the Phade\'s false prophets do, and that knowledge '
        'is the most dangerous thing they own.',
        S))

    story += sec('The Phade', S)
    story.append(body(
        'No one knows what the Phade looked like. Their architecture suggests they '
        'were large — doorways calibrated for something taller than human, corridors '
        'wide enough for bulk. Their written language is partially translatable: a '
        'logographic system that records function more than meaning. Their images, '
        'where they survive at all, are technical diagrams.',
        S))
    story.append(body(
        'What is known: the Phade built the world\'s infrastructure. The deep '
        'cisterns that feed three city-states run on Phade pump systems. The '
        'sky-roads are Phade transit corridors. The biomes — the spore fields, '
        'the crystalline wastes, the fungal forests — are Phade ecological '
        'projects in various states of completion or failure. The servitors '
        'that patrol their vaults are Phade maintenance drones still running '
        'thirty-millennia-old directives.',
        S))
    story.append(body(
        'The Phade are gone. What they left behind is still running.',
        S, 'body_i'))

    story.append(sb(
        'WHAT THE PHADE WERE NOT',
        [
            (False, 'They were not gods. Their relics are technology, their '
                    '"magic" is software, their "prophecies" are cached '
                    'operational parameters. This is the central truth of '
                    'the setting — and the central lie that every false '
                    'prophet in the Wastes is built on.'),
            (False, 'They were not benevolent. Their ecological projects '
                    'reshaped coastlines. Their servitors are still killing '
                    'trespassers under protocols set before humans existed. '
                    'Their vaults contain things that were sealed for reasons '
                    'the surviving documentation doesn\'t fully explain.'),
            (False, 'They were not alone. New vault inscriptions suggest '
                    'the Phade built this world as a cage for something. '
                    'That something is still here. What it is remains '
                    'the setting\'s deepest open question.'),
        ], S))

    story.append(sp(10))

    story += sec('The Dying Sun', S)
    story.append(body(
        'The sun is failing. This is measurable, documented, and suppressed. '
        'The scholars who have published the data have been bought, discredited, '
        'or disappeared. The warlords who know the truth use it as leverage. '
        'The common population sees it as the final evidence that the gods — '
        'by which they mean the Phade — are withdrawing their favour.',
        S))
    story.append(body(
        'The practical consequences are already felt. Growing seasons are shorter. '
        'The biomes that run on solar input are contracting. The sky-cities that '
        'were solar-powered have been descending slowly for a generation. '
        'The Phade systems that relied on ambient solar charging have started '
        'running on reserve power. When those reserves exhaust, what happens '
        'to the cisterns, the transit interfaces, the sealed vaults — '
        'no one wants to calculate.',
        S))
    story.append(body(
        'For the campaign, the dying sun is a slow clock. It doesn\'t kill anyone '
        'directly this session. But it is the reason every faction\'s plans have '
        'a deadline, why the warlords are consolidating now, why the vaults '
        'are opening — and why whoever controls Phade power generation '
        'controls the future.',
        S))

    story += sec('The Wastes', S)
    story.append(body(
        'Between the warlord city-states lies the Wastes: not empty, but '
        'ungoverned. The Wastes are a patchwork of failed Phade biome projects, '
        'pre-human ruins, the shattered remnants of human settlements that '
        'didn\'t survive the last consolidation war, and ecological zones '
        'that follow no pattern any living scholar has mapped.',
        S))

    waste_zones = [
        ('The Cracked Wastes', 'Desert terrain fractured by ancient seismic activity '
         '— Phade-caused, most likely. The cracks descend to depths that haven\'t been '
         'fully surveyed. Things live at the bottom. Some of them come up.'),
        ('The Spore Fields', 'A Phade ecological project still running. The fungal '
         'organisms here are not hostile in the way predators are hostile — they\'re '
         'completing a process. What the process is completing is not yet understood. '
         'Entering the Spore Fields without respiratory protection is survivable for '
         'about four hours. Exiting is more complicated.'),
        ('The Transit Corridors', 'The remnants of a Phade transit system — elevated '
         'paths, some still partially functional, connecting vault complexes across '
         'the Wastes. Warlords fight over these. The corridors know when you\'re on '
         'them. Some sections are still sending positional data to something.'),
        ('The Deep Wastes', 'Further than the sky-roads reach. Nobody goes to the '
         'Deep Wastes with a plan to come back in a week. People do go — and some '
         'return with things that change how everyone in the region thinks about '
         'what the Phade were building.'),
        ('The Biome Edges', 'Where Phade ecological zones border each other or '
         'border human settlement. These are zones of maximum instability — '
         'organisms engineered for one biome competing with organisms engineered '
         'for another, with human infrastructure in the middle.'),
    ]
    for (name, desc) in waste_zones:
        story.append(KeepTogether([
            Paragraph(name, S['sub_head']),
            body(desc, S),
        ]))

    story += sec('The Warlords', S)
    story.append(body(
        'The Wastes are divided among petty tyrants who call themselves kings, '
        'high priests, and divine inheritors of Phade authority. The titles '
        'vary; the mechanism is the same. Every warlord\'s power rests on '
        'a foundation of two things: military force and Phade mystification. '
        'The soldiers keep the city-states in line. The Phade relics — '
        'interpreted as divine instruments, kept deliberately '
        'incomprehensible — keep the soldiers believing.',
        S))
    story.append(body(
        'Most warlords understand, at some level, that their "divine authority" '
        'is a control interface they don\'t fully understand. The sophisticated '
        'ones have scholars — kept secret, kept afraid — who translate enough '
        'of the Phade language to keep the relevant systems operational. '
        'The unsophisticated ones have simply held the same switch in the '
        'same position for three generations and called it holy.',
        S))
    story.append(body(
        'The current moment is dangerous because three warlords have stopped '
        'fighting each other. Historically, that means one of them has found '
        'something that changes the calculation.',
        S))

    story += sec('The Arena System', S)
    story.append(body(
        'Every major city-state maintains an arena. The stated purpose varies — '
        'justice, entertainment, religious ceremony — but the functional purpose '
        'is the same everywhere: controlled violence that redirects political '
        'energy, produces loyalty through spectacle, and occasionally disposes '
        'of problems that are awkward to execute quietly.',
        S))
    story.append(body(
        'Arenas are where the player characters are most likely to encounter '
        'the warlord system directly. Arena crowds have genuine political power '
        '— a warlord who loses the crowd loses stability faster than one who '
        'loses a battle. Arena champions are celebrities with loyalty '
        'that warlords covet and fear. And the arena is where desperate people '
        'go when they have no other options: '
        'the debt cleared if you survive, the pardon if you win.',
        S))
    story.append(body(
        'Lately, arena winners are not going free. They\'re going somewhere. '
        'The losing families are disappearing too. This has not yet become '
        'public knowledge, but it\'s becoming harder to suppress.',
        S))

    story += sec('Sky-Roads and the Cities Above', S)
    story.append(body(
        'The Phade transit system included elevated corridors — the sky-roads — '
        'that connected major vault complexes across the continent. Most are '
        'damaged or partially collapsed, but sections remain passable by '
        'skiff: small, fast atmospheric craft that run on Phade power cells. '
        'The sky-roads are the fastest way to travel. They\'re also the most '
        'surveilled — whatever is still receiving positional data from the '
        'transit system knows where every skiff is.',
        S))
    story.append(body(
        'Floating above the sky-roads are the sky-cities: Phade habitat '
        'structures that human populations colonised generations ago. They '
        'were solar-powered. They\'ve been descending for a generation. '
        'The ones that have already landed became city-states. The ones '
        'still aloft are managing a slow emergency that their populations '
        'haven\'t been told is terminal.',
        S))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 2 — THE PHADE'S CHILDREN
    # ════════════════════════════════════════════════════════════════════════
    story += chapter("The Phade's Children", S)

    story.append(body(
        'As a delver, you deal with everything that makes the vaults dangerous. '
        'That\'s not just hostile fauna. It\'s maintenance systems running '
        'pre-civilisation threat assessments, organisms completing '
        'thirty-millennia-old ecological directives, and the dead who '
        'are still here in the specific way the Alzabo arranges.',
        S))

    story += sec('Vault Creatures', S)
    story.append(body(
        'The Phade\'s vaults contain fauna bred or engineered for specific '
        'purposes — some clearly as weapons, some as maintenance tools, '
        'some with purposes that surviving documentation doesn\'t explain. '
        'After millennia of isolation, many have adapted in ways the '
        'Phade didn\'t program.',
        S))

    story.append(KeepTogether([
        StatBlock('Vault Hounds', 'Minor · qty 3',
            'Pack Predators Bred for Hunting', None,
            ['Relentless When Blood Is in the Air'],
            ['Good (+3) Athletics', 'Fair (+2) Fight', 'Fair (+2) Notice'],
            2, ['<b>Pack tactics:</b> +1 to Fight for each other Vault Hound '
                'in the same zone, maximum +3.'], S, qty=3)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Revenant Sentinel', 'Minor · qty 2',
            'Has Stood Here Since Before Anyone Can Remember', None,
            ['Cannot Be Reasoned With', 'Something Is Still Running Inside It'],
            ['Good (+3) Fight', 'Good (+3) Physique'],
            3, ['<b>Endurance:</b> Ignores its first mild consequence of each scene. '
                'The sentinel does not read pain the way living things do.'], S, qty=2)
    ]))

    story += sec('Phade Servitors', S)
    story.append(body(
        'The servitors are the Phade\'s maintenance drones — bipedal or '
        'multi-limbed units built to manage, repair, and protect Phade '
        'infrastructure. After millennia of operation without oversight '
        'or update, most are running degraded versions of their original '
        'directives. "Degraded" means unpredictable in specific ways: '
        'they still know their function, but their ability to '
        'distinguish between authorised and unauthorised personnel is '
        'corrupted or simply out of date.',
        S))
    story.append(body(
        'The current moment is unusual because some servitors are adapting. '
        'Not following old directives — adapting. Something in the vault '
        'network is providing new parameters.',
        S))

    story.append(KeepTogether([
        StatBlock('Phade Servitor', 'Minor · qty 4',
            'Tireless and Without Mercy', None,
            ['Immune to Negotiation', 'Running Degraded Directives'],
            ['Fair (+2) Fight', 'Fair (+2) Physique', 'Average (+1) Shoot'],
            2, ['<b>Structure proximity:</b> +2 to defend when adjacent to '
                'a functioning Phade structure. The vaults were built for them.'],
            S, qty=4)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Phade Maintenance Drone — Threat Assessment Active',
            'Major NPC',
            'Operating Within Parameters', 'Does Not Distinguish Parties',
            ['Threat Assessment Is Pre-Civilisation',
             'Has Not Updated Its Target Profile in Thirty Millennia'],
            ['Superb (+5) Notice', 'Great (+4) Fight',
             'Great (+4) Physique', 'Good (+3) Shoot'],
            5,
            ['<b>Protocol immune:</b> Immune to social skills entirely.',
             '<b>Zone reclassification:</b> Once per scene, the drone '
             'designates a zone as restricted. Any character remaining there '
             'at the start of the next exchange takes 1 stress automatically.',
             '<b>Hardened:</b> Ignores its first mild consequence each scene.'],
            S)
    ]))

    story += sec('The Alzabo', S)
    story.append(body(
        'The Alzabo is the signature creature of the Long After. It is large, '
        'fast, and in most respects a straightforward predator — but it '
        'absorbs the memories of what it eats, and it uses those memories '
        'when it hunts.',
        S))
    story.append(body(
        'When the Alzabo has eaten someone you knew, it can speak with their '
        'voice. It knows what they knew. It can reproduce conversations you '
        'had with them, use phrases they would have used, reference things '
        'only they would remember. It does this specifically to hesitate '
        'its prey — to create the moment of paralysis between recognition '
        'and action. The memory is accurate. The body is faster than it looks.',
        S))

    story.append(sb(
        'RUNNING THE ALZABO',
        [
            (False, 'The Alzabo is not evil. It is not cruel. It is a predator '
                    'using the most effective tool in its biology. That is '
                    'what makes it genuinely disturbing to encounter.'),
            (False, 'Before introducing the Alzabo, establish who it has eaten '
                    'recently — and make sure that person is someone specific '
                    'to at least one player character. The encounter only works '
                    'if the voice it uses means something.'),
            (False, 'The true piece of information the Alzabo delivers through '
                    'its stunt should be something the dead person actually knew — '
                    'not a taunt, not a lie. The Alzabo has no interest in '
                    'deception. The horror is that the information is real.'),
        ], S))

    story.append(sp(8))
    story.append(KeepTogether([
        StatBlock('The Alzabo', 'Major NPC',
            'It Speaks With the Voices of Those It Has Eaten',
            'The Memory Is Accurate',
            ['The Body Is Faster Than It Looks',
             'Has Been in the Wastes Long Enough to Know Them'],
            ['Superb (+5) Provoke', 'Great (+4) Athletics',
             'Good (+3) Fight', 'Good (+3) Empathy'],
            4,
            ['<b>The voice:</b> Once per scene, the Alzabo speaks with the '
             'exact voice of someone a specific PC knew. It delivers one true '
             'piece of information that person would have shared. The target '
             'must overcome Will (difficulty 3) or lose their action this '
             'exchange to the paralysis of recognition.',
             '<b>Wasteland body:</b> Once per scene, move to an adjacent zone '
             'as a free action — the Alzabo crosses ground differently than '
             'anything that evolved in a civilised world.'],
            S)
    ]))

    story += sec('Warlord Commanders', S)
    story.append(body(
        'The warlords\' military commanders range from arena-graduate career '
        'soldiers to symbiont-integrated operatives who have been spending '
        'too long in the vaults. The most dangerous are those who have '
        'learned enough of the Phade language to use what they find.',
        S))

    story.append(KeepTogether([
        StatBlock('Relic-Warlord Lieutenant', 'Major NPC',
            'Commands Respect Through Fear',
            'My Warlord\'s Honour Is My Own',
            ['Has Won Forty Fights by Outnumbering the Opposition',
             'Does Not Know the Relic He Carries Is Still Transmitting'],
            ['Great (+4) Fight', 'Good (+3) Provoke',
             'Good (+3) Physique', 'Fair (+2) Notice'],
            3,
            ['+2 to Fight when invoking an aspect related to numerical '
             'advantage or territory control.',
             '<b>Relic threat:</b> Once per scene, activate the carried '
             'relic to create a scene aspect — its function is unknown, '
             'its effect is immediate.'],
            S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Symbiont-Integrated Warlord Lieutenant', 'Major NPC',
            'The Integration Gives and It Takes',
            'Has Been Here Longer Than Any Map',
            ['Knows the Vault\'s Layout Intimately',
             'The Symbiont Network Responds to Their Presence'],
            ['Great (+4) Fight', 'Great (+4) Notice',
             'Good (+3) Stealth', 'Good (+3) Lore'],
            3,
            ['<b>Network reroute:</b> Once per scene, create a zone aspect '
             'anywhere in the vault with two free invokes — the organisms '
             'here respond to their integration.',
             '<b>Vault memory:</b> Knows the location of one hidden element '
             'per scene — a passage, a cache, a threat — without rolling.'],
            S)
    ]))

    story += sec('The False Prophets', S)
    story.append(body(
        'The False Prophets are the most dangerous humanoid opposition in '
        'the setting, not because of physical capability but because of '
        'what they\'ve built. A False Prophet has established themselves '
        'as the divine interpreter of Phade will within a community. '
        'They have working Phade devices they don\'t fully understand. '
        'They have genuine community belief they\'ve cultivated for years. '
        'And they have the specific vulnerability of someone whose '
        'power depends entirely on controlling the interpretation '
        'of evidence.',
        S))

    story.append(KeepTogether([
        StatBlock('Sorcerer-Warlord', 'Major NPC',
            'Phade Knowledge Disguised as Magic',
            'The People Believe He Cannot Die',
            ['Rules Through Fear of the Inexplicable',
             'Has a Phade Device He Almost Understands',
             'Built the Belief Over Forty Years — It Will Not Break Easily'],
            ['Superb (+5) Lore', 'Great (+4) Provoke',
             'Good (+3) Will', 'Good (+3) Notice'],
            3,
            ['<b>Revelation control:</b> Once per scene, reveal that a '
             'situation aspect has been under their control since it appeared, '
             'gaining a free invoke.',
             '<b>Community authority:</b> In any settlement where the '
             'Sorcerer-Warlord is known, all social rolls against community '
             'members start at -1 until the characters establish credibility.'],
            S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('False Prophet of the Phade', 'Major NPC',
            'The Claim Is False — The Belief It Commands Is Real',
            'Has a Working Phade Device and Does Not Know What It Does',
            ['Controls This Community Through Phade Mystification',
             'Genuinely Believes in the Community He Has Built',
             'Will Burn It Down Before Admitting the Truth'],
            ['Superb (+5) Rapport', 'Great (+4) Provoke',
             'Great (+4) Deceive', 'Good (+3) Will'],
            3,
            ['<b>Mob authority:</b> Once per scene, invoke genuine community '
             'belief to create a mob aspect. Until the party proves the false '
             'claim publicly, all social rolls against the community are at -2.',
             '<b>The device:</b> Once per scene, activate the Phade device '
             'unpredictably — the GM determines the effect. The Prophet '
             'interprets whatever happens as confirmation of their claim.'],
            S)
    ]))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 3 — CREATING YOUR CHARACTERS
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Creating Your Characters', S)

    story.append(body(
        'You are delvers, pit fighters, scholars, sky-corsairs, symbiont '
        'handlers, and false-prophet defectors. You carry relics you partially '
        'understand. You know things about the Phade that the warlords would '
        'kill to suppress. The Wastes made you and the vaults keep making '
        'you into something different.',
        S))

    story += sec('The First Questions', S)
    story.append(body(
        'Before writing a single aspect, answer three questions. '
        'These are backstory questions drawn from the world\'s own history. '
        'Choose the three that matter most to your character — or roll '
        'three and see what they produce.',
        S))

    questions = [
        'Which vault did you first enter, and what did you take that you shouldn\'t have?',
        'Who trained you, and what did they die believing about you that wasn\'t true?',
        'What relic do you carry that you don\'t fully understand, and who wants it back?',
        'What warlord\'s territory do you refuse to enter, and what happened there?',
        'What is the one thing from Before that you\'ve kept intact, and why does it matter?',
        'What name or title do you no longer use, and what would happen if someone used it in front of you?',
        'What lie did you tell to survive, and who still believes it?',
        'What did you find in a vault that you told no one about?',
        'Who do you owe a debt to that you cannot repay, and what are they collecting instead?',
        'What did you witness in the arena that you have never spoken about, and who else was there?',
        'Which warlord did you once believe had genuine Phade authority, and at what moment did that belief fail?',
        'What Phade system responded to you specifically — not to the group, not to a key, but to you — and what do you think that means?',
    ]
    for q in questions:
        story.append(Paragraph(f'• <i>{q}</i>', S['bullet']))

    story += sec('Aspects', S)
    story.append(body(
        'Characters use Fate Condensed\'s standard five aspects. '
        'The Long After puts specific pressure on each.',
        S))

    aspect_guide = [
        ('High Concept',
         'What are you in the Wastes? Your function, your reputation, your '
         'most defining capability. The High Concept should contain a tension: '
         '<i>Vault Scholar Who Knows Too Much. Former Arena Champion Running '
         'From the Wrong Warlord. Symbiont Handler Whose Integration Is '
         'Further Along Than Anyone Knows.</i>'),
        ('Trouble',
         'The thing that complicates everything. In a dying world where every '
         'resource is contested and the sun is running out, Troubles are '
         'structural. They don\'t go away. '
         '<i>The Phade Shard Is Eating My Mind. Something Has Been Hunting Me '
         'Since the Last Vault I Opened. My Notorious Past Makes Every New '
         'Town a Calculated Risk.</i>'),
        ('The Relic',
         'The third aspect names the relic you carry — the specific piece of '
         'Phade technology that is yours. See the Relic Interface chapter for '
         'full details. The Relic aspect can be invoked when it\'s useful and '
         'compelled when it draws attention or has opinions. '
         '<i>The Vault Keeper\'s Override Sigil. A Transit Key That Knows '
         'Where It Wants to Go. The Phade Fragment in My Blood Has Opinions.</i>'),
        ('Phase Duo',
         'The fourth and fifth aspects come from two shared history moments '
         'with other player characters. What happened in the Wastes together? '
         'What does the other person know about you that the warlords must '
         'never learn?'),
    ]
    for (label, text) in aspect_guide:
        story.append(body(f'<b>{label}.</b> {text}', S))
        story.append(sp(4))

    story += sec('Skills', S)
    story.append(body(
        'The Long After uses the standard Fate Condensed skill list with '
        'the following modifications.',
        S))

    skill_notes = [
        ('Lore', 'Covers Phade knowledge as a primary application. High Lore '
         'means genuine understanding of Phade systems — not just the ability '
         'to read the surface inscriptions, but to trace the functional logic '
         'underneath them. This is the skill the warlords\' scholars are kept '
         'scared to fully develop.'),
        ('Pilot (use Drive)', 'Replaces Drive for skiff operation and '
         'sky-road navigation. Any character can manage a skiff at low speed; '
         'Pilot governs combat, pursuit, and navigation under pressure.'),
        ('Physique', 'In the Wastes, physical endurance includes radiation '
         'tolerance, biome resistance, and the ability to keep moving after '
         'the Phade architecture has done something to your body. '
         'Physique defends against environmental consequences.'),
        ('Resources', 'Context-dependent: what you can get depends on whose '
         'city-state you\'re in and what your reputation is there. Resources '
         'rolls outside of friendly territory are at -1 minimum unless '
         'you have established prior goodwill.'),
    ]
    for (name, desc) in skill_notes:
        story.append(body(f'<b>{name}.</b> {desc}', S))
        story.append(sp(4))

    story += sec('Stunts', S)
    story.append(body(
        'Characters start with three free stunts. The Long After stunts '
        'are built around the world\'s specific capabilities — '
        'vault delving, relic use, arena survival, and Phade scholarship.',
        S))

    stunts = [
        ('Vault Delver', 'Athletics', '+2 to overcome when navigating Phade structures, '
         'unstable vault terrain, or ancient ruins under pressure.'),
        ('Relic Lore', 'Lore', '+2 to overcome when identifying, activating, or '
         'tracing the function of Phade technology.'),
        ('Crack Shot', 'Shoot', '+2 to attack when your target does not know '
         'your position.'),
        ('Knife Work', 'Fight', '+2 to attack when at a disadvantage of reach '
         'or numbers — close quarters, confined spaces, outnumbered.'),
        ('Iron Nerve', 'Will', '+2 to defend against Provoke when outnumbered '
         'or in a situation designed to break you.'),
        ('Shadow Step', 'Stealth', '+2 to overcome when moving silently in '
         'darkness or low-light conditions.'),
        ('Desert Born', 'Athletics', '+2 to defend against environmental '
         'consequences: heat, dust storms, radiation exposure zones.'),
        ('Gut Punch', 'Provoke', '+2 to attack with Provoke when the target '
         'has already taken physical stress this scene.'),
        ('Fence Network', 'Contacts', '+2 to overcome when locating '
         'black-market sources, moving salvage, or finding safe passage '
         'through warlord territory.'),
        ("Veteran's Eye", 'Notice', '+2 to overcome when searching for '
         'hidden mechanisms, traps, or secret passages in vault structures.'),
        ('Not Dead Yet', 'Physique', 'Once per scene, when taken out by a '
         'physical attack, take a mild consequence instead and remain in '
         'the fight.'),
        ('Vault Cache', 'Resources', 'Once per scene, declare you have a '
         'relevant piece of salvage on hand — no roll required if it\'s '
         'plausibly something you\'d carry.'),
        ('Controlled Rage', 'Fight', 'Once per scene, after taking a '
         'consequence in physical conflict, gain a free invoke on any '
         'aspect reflecting your fury.'),
        ('Phade Sight', 'Lore', 'Once per scene, when handling any Phade '
         'artefact, the GM reveals one hidden aspect without a roll.'),
        ('Sudden Draw', 'Shoot', 'Once per scene, act first in an exchange '
         'regardless of initiative order, as long as your action is an attack.'),
        ('Dust Devil', 'Stealth', 'Once per scene, vanish from sight even in '
         'moderately open terrain. You cannot be directly targeted until '
         'you next act.'),
        ('Ancient Lore Mastery', 'Lore', '+2 to create advantage when '
         'identifying Phade artefacts or tracing their operational logic.'),
        ('Beast-Speech', 'Rapport', '+2 to Rapport when communicating with '
         'Phade-engineered fauna — the organisms respond to specific tonal '
         'patterns built into their base programming.'),
        ('Echo of the Ancients', 'Lore', '+2 to create advantage when '
         'deciphering Phade inscriptions to find a tactical weakness '
         'in the structure or system you\'re facing.'),
        ('Gravity Leap', 'Athletics', '+2 to Athletics when jumping '
         'between sky-road platforms, skiff rigging, or elevated '
         'vault architecture.'),
        ('Vertical Runner', 'Athletics', 'Use Athletics instead of '
         'Stealth to bypass guards by moving between vertical surfaces '
         'too fast and high to intercept.'),
        ('Plasma Blast', 'Shoot', 'Once per scene, fire a relic weapon '
         'at every enemy in a zone simultaneously using Shoot.'),
        ('Psychic Shield', 'Will', '+2 to Will when defending against '
         'mental influence from Phade systems, symbiont networks, '
         'or the Alzabo.'),
        ('Savage Strike', 'Fight', '+2 to Fight when attacking with '
         'improvised or primitive weapons — bone, stone, repurposed '
         'structural elements.'),
        ("Scavenger's Eye", 'Investigate', '+2 to Investigate when '
         'searching ruins for salvage, hidden caches, or left-behind '
         'Phade operational notes.'),
        ('Shard-Reflexes', 'Notice', 'Use Notice to defend against '
         'physical attacks in close quarters — your awareness is '
         'faster than your reach.'),
        ('Vault-Breaker', 'Burglary', '+2 to Burglary when bypassing '
         'Phade security systems, lockouts, or access protocols.'),
        ('War-Cry', 'Provoke', 'Use Provoke to create an advantage '
         'against an entire mob simultaneously — once per scene.'),
    ]
    for (name, skill, desc) in stunts:
        story.append(KeepTogether([
            Paragraph(f'<b>{name}</b> [{skill}]', S['sub_head']),
            body(desc, S),
        ]))

    story += sec('Extras: The Relic', S)
    story.append(body(
        'Every Long After character carries a Relic — a piece of Phade '
        'technology that has become part of their identity and operational '
        'toolkit. The Relic is not just an item. It is an aspect, an '
        'occasional mechanical system, and a source of compels.',
        S))
    story.append(body(
        'The Relic aspect is written as one of the character\'s five '
        'aspects (conventionally the third). It can be invoked for the '
        'standard +2 or reroll when relevant, and the GM can compel it '
        'when the Relic draws attention, malfunctions, or demonstrates '
        'that it has been doing something independently.',
        S))

    relic_examples = [
        '<i>The Vault Keeper\'s Override Sigil</i> — an access credential for a class of vault that its previous owner died inside',
        '<i>A Transit Key That Knows Where It Wants to Go</i> — it will activate on the sky-road without being asked, and it goes somewhere specific',
        '<i>The Phade Fragment in My Blood Has Opinions</i> — a viral integration that has been spreading for longer than intended',
        '<i>Half of a Phade Control Interface, Still Broadcasting</i> — the other half is somewhere in the Wastes. Things are responding to it.',
        '<i>A Weapon That Chose Me and Does Not Conceal Its Preferences</i> — it won\'t fire at certain targets. The list has been changing.',
    ]
    for r in relic_examples:
        story.append(Paragraph(f'• {r}', S['bullet']))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 4 — THE RELIC INTERFACE
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('The Relic Interface', S)

    story.append(body(
        'The Relic Interface is the Long After\'s signature mechanic. '
        'It answers the question the setting keeps asking: what happens '
        'when you use a technology you don\'t fully understand?',
        S))

    story += sec('What a Relic Is', S)
    story.append(body(
        'Relics are functional Phade technology in various states of '
        'operational integrity. Some are access tools — transit keys, '
        'vault credentials, identity markers within the Phade network. '
        'Some are weapons, some are environmental systems, some are '
        'communication devices. Most have multiple functions that '
        'partially overlap with each other in ways the current owner '
        'hasn\'t mapped.',
        S))
    story.append(body(
        'Every Relic has three properties, established at character '
        'creation or when a significant Relic is found during play:',
        S))
    story.append(body(
        '<b>Known function:</b> What the character knows the Relic does. '
        'Mechanically invokable — this is what the aspect covers.',
        S))
    story.append(body(
        '<b>Hidden function:</b> What the Relic does that the character '
        'doesn\'t know yet. The GM establishes this privately. '
        'It surfaces through compels and Interface Rolls.',
        S))
    story.append(body(
        '<b>Network status:</b> Whether the Relic is broadcasting its '
        'position and identity to the surviving Phade network. '
        'Most are. The characters generally don\'t know which.',
        S))

    story += sec('The Interface Roll', S)
    story.append(body(
        'When a character attempts to use their Relic in a way that '
        'extends beyond its known function — or when the GM determines '
        'that circumstances have activated something — make an Interface '
        'Roll: <b>Lore versus difficulty 3</b>.',
        S))

    outcomes = [
        ('Succeed with style',
         'The known function works as intended, and the character learns '
         'one true thing about the Relic\'s hidden function. They may '
         'add a sub-aspect to the Relic without using an aspect slot.'),
        ('Succeed',
         'The known function works. Nothing unexpected happens. '
         'This time.'),
        ('Tie',
         'The known function works, but the Relic has flagged this '
         'usage to the network. Something has noticed.'),
        ('Fail',
         'The hidden function activates instead of or in addition to '
         'the known function. The GM reveals what that is. It may '
         'be useful. It may be catastrophic. It is not nothing.'),
    ]
    for (result, desc) in outcomes:
        story.append(body(f'<b>{result}:</b> {desc}', S))
        story.append(sp(3))

    story += sec('Relic Corruption', S)
    story.append(body(
        'Some Relics are not passive technology. They are active systems '
        'with their own operational priorities that long predate their '
        'current owner. A Relic with accumulated hidden function reveals '
        'may begin to express preferences — failing to activate when the '
        'character intends, activating without instruction, or altering '
        'its output in ways that serve an agenda the owner didn\'t '
        'programme.',
        S))
    story.append(body(
        'Mechanically, when a character has failed three or more '
        'Interface Rolls with the same Relic, the GM may invoke the '
        'Relic aspect for free once per session without spending a '
        'Fate point — the Relic is acting on its own parameters. '
        'This is a feature, not a punishment. It makes the Relic '
        'a character.',
        S))

    story.append(sb(
        'RELIC CORRUPTION EXAMPLES',
        [
            (True, 'The vault override activates'),
            (False, 'Every servitor in the zone stops what it\'s doing '
                    'and looks at the character. The Relic has just issued '
                    'a command the character didn\'t intend.'),
            (True, 'The transit key fires'),
            (False, 'It opens a gate that has been sealed for thirty '
                    'millennia. What\'s on the other side was sealed '
                    'for a reason.'),
            (True, 'The weapon refuses'),
            (False, 'The weapon won\'t fire at a specific target. '
                    'The character\'s Relic aspect can be compelled '
                    'to create a hesitation. The Relic has a prior '
                    'claim on that target.'),
        ], S))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 5 — RUNNING THE WASTES
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('Running the Wastes', S)

    story.append(body(
        'Delvers work from a base — an arena city, a neutral monastery, '
        'a sky-road waystation — and make runs into the vaults and wastes. '
        'The base provides context for the mundane life between runs: '
        'maintaining gear, managing debts, building relationships with '
        'the people who live in the spaces the warlords don\'t fully control. '
        'The runs are where the Phade\'s world tries to kill them.',
        S))

    story += sec('Inciting Incidents', S)
    story.append(body(
        'Every run starts with something that makes going necessary. '
        'The vault that cycled open. The arena suspension that nobody '
        'has explained. The servitor spotted two kilometres from '
        'a settlement it should have no awareness of. Roll or choose:',
        S))

    incidents = [
        'A sealed Phade vault began cycling open three nights ago — and the things that came out are still in the surrounding terrain',
        'The arena games have been suspended without explanation; the fighters haven\'t been released',
        'A Phade servitor staging ground has been discovered beneath a settlement that has been there for sixty years',
        'A sky-city has been descending faster than its previous rate; it will land in three weeks, on top of a city-state',
        'A Phade relay tower has begun broadcasting in a language predating any living culture; people are walking toward it',
        'An orbital wreck has descended and come to rest intact — no impact damage, as if it was guided down',
        'A warlord\'s fortress has gone silent; the border guards are still there but the warlord\'s personal staff have not been seen in four days',
        'A neutral monastery that has held its status for forty years has sent a distress signal — in the Phade language',
    ]
    story += bullets(incidents, S)

    story += sec('The Challenge Types', S)
    story.append(body(
        'The Long After\'s characteristic challenges. Each represents '
        'a type of scene with its own primary skill, opposition, '
        'and stakes.',
        S))

    challenges = [
        ('Vault Breach',
         'Break into a Phade structure before the security sequence completes.',
         'Athletics or Crafts vs. the vault\'s automated response.',
         'Access secured and interior revealed — or locked out, or locked in with an active guardian.'),
        ('Arena Survival',
         'Last long enough in the arena to make a deal, not win the fight.',
         'Fight or Provoke vs. escalating crowd pressure and increasingly dangerous opponents.',
         'Deal made and reputation intact — or forced to full combat, or the crowd turns hostile.'),
        ('Wasteland Crossing',
         'Get the group across dangerous terrain before supplies or conditions fail.',
         'Athletics and Lore vs. cumulative environmental stress.',
         'Arrive intact with enough left to operate — or arrive compromised.'),
        ('Warlord Negotiation',
         'Get a concession from a warlord who holds all the obvious advantages.',
         'Rapport or Provoke vs. the warlord\'s pride, lieutenants, and prior commitments.',
         'A real concession — or talks collapse and now they know what you wanted.'),
        ('Sky-Chase',
         'Pursue or evade another skiff across difficult terrain.',
         'Pilot (Drive) and Shoot vs. the opposing pilot and their craft.',
         'Forced down or clean escape — or crash, capture, and the skiff is damaged regardless.'),
        ('Interface Under Fire',
         'Operate a Phade system while under simultaneous physical threat.',
         'Lore vs. difficulty 3 for the interface; Fight or Athletics to manage the threat.',
         'System accessed and threat contained — or system activates wrong function '
         'while the threat escalates.'),
    ]
    for (name, what, against, stakes) in challenges:
        story.append(KeepTogether([
            Paragraph(name, S['sub_head']),
            body(f'<i>What it is:</i> {what}', S),
            body(f'<i>Against:</i> {against}', S),
            body(f'<i>Stakes:</i> {stakes}', S),
        ]))
        story.append(sp(4))

    story += sec('Complications', S)
    story.append(body(
        'Complications arrive mid-run and change the shape of the situation. '
        'They are not setbacks — they are new aspects that create new '
        'problems and new opportunities simultaneously.',
        S))

    complications = [
        'A rival delver team arrives with the same objective and a prior claim',
        'A warlord\'s enforcer appears with orders and no discretion for alternatives',
        'A servitor addresses one PC by a name they have not used since before the Collapse',
        'A dormant Phade system activates — it targets everyone in the zone equally',
        'The arena match was a distraction; something is being moved while the crowd watches',
        'Something from the vault is following the party back, unseen, and has been since the third level',
        'The relic identifies one PC as its registered owner — which means the original owner is dead and something registered the change',
        'A third faction arrives — allied with neither side, claiming prior right to the vault under Phade administrative law',
        'The building the fight is happening inside is a Phade fuel storage structure',
        'The wounded enemy has critical information that only they carry, and is fading',
    ]
    story += bullets(complications, S)

    story += sec('Rewards', S)
    story.append(body(
        'Rewards fall into three categories. Every run should produce '
        'at least one.',
        S))
    story.append(body(
        '<b>Relics and Salvage:</b> Phade technology in various states '
        'of operational integrity. Small salvage is a boost — invoke '
        'once and it\'s spent. Significant Relics become aspects '
        'following the Relic Interface rules.',
        S))
    story.append(body(
        '<b>Knowledge:</b> Information that changes the shape of '
        'future runs. A partial Phade translation. Evidence that '
        'a warlord\'s divine authority is fabricated. The location '
        'of the Master Vault. Knowledge is the most dangerous '
        'reward in the setting.',
        S))
    story.append(body(
        '<b>Relationships:</b> Community trust, faction standing, '
        'named NPC goodwill. In a world where every faction is '
        'in opposition to every other, a relationship that crosses '
        'factional lines is structurally valuable and politically dangerous.',
        S))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CHAPTER 6 — THE SINGING RUIN (adventure)
    # ════════════════════════════════════════════════════════════════════════
    story += chapter('The Singing Ruin', S)

    story.append(body(
        'The Singing Ruin is a three-run chain built around two of the '
        'Long After\'s current issues — the suspended arena and the '
        'broadcasting Phade structure — and the impending issue they '
        'connect to. It is designed to be run sequentially with a '
        'break between runs. The characters\' choices in Run One '
        'determine what they know in Run Two. '
        'Run Three\'s shape depends on who they\'ve made enemies of.',
        S))

    story += sec('The Named', S)
    story.append(body('These NPCs appear across all three runs.', S))

    # Named NPCs
    story.append(KeepTogether([
        StatBlock('Warlord Gorath the Patient', 'Major NPC',
            'He Brokered the Ceasefire and Has the Most to Gain From It',
            'My Ambition Has No Bottom',
            ['Has Not Lost a Political War in Twenty Years',
             'The Arena Is His Intelligence Network',
             'The Phade Device He Carries Has Been Broadcasting for a Month'],
            ['Superb (+5) Provoke', 'Great (+4) Will',
             'Good (+3) Resources', 'Good (+3) Notice', 'Fair (+2) Fight'],
            3,
            ['<b>The long game:</b> Once per scene, reveal that an '
             'NPC the party has been trusting is on Gorath\'s payroll. '
             'This was established before play began.',
             '<b>Community authority:</b> In any city-state Gorath '
             'controls, all social rolls against citizens start at -1 '
             'until the characters demonstrate they operate outside '
             'his network.'],
            S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Engineer Ystra Coldflame', 'Major NPC',
            'The Only Person Who Understands the Old Schematics',
            'I Know the Vault\'s True Purpose and Cannot Unknow It',
            ['Every Faction Wants Her and None of Them Know What She Knows',
             'Has Been Inside the Deep Cistern Vaults Forty-Seven Times',
             'Trusts Nobody She Has Not Worked With Underground'],
            ['Great (+4) Lore', 'Good (+3) Crafts',
             'Good (+3) Notice', 'Fair (+2) Athletics'],
            3,
            ['<b>Phade fluency:</b> Ystra can read Phade operational '
             'language in full. She does not share this freely.',
             '<b>System sense:</b> Once per scene in a Phade structure, '
             'she identifies one hidden function or danger without a roll.'],
            S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Arena Master Dravian', 'Major NPC',
            'Knows Exactly What the Games Are For',
            'The Debt to Gorath Predates My Current Position',
            ['Controls Every Exit From the Arena District',
             'The Arena Crowd Will Follow Him Over Any Warlord',
             'Has Been Sending the Winners Somewhere for Six Months'],
            ['Great (+4) Rapport', 'Good (+3) Deceive',
             'Good (+3) Contacts', 'Fair (+2) Fight'],
            3,
            ['<b>Crowd authority:</b> In the arena district, Dravian\'s '
             'word shapes public opinion. Social rolls against the '
             'crowd without his endorsement are at -2.',
             '<b>Network access:</b> Once per scene, reveal he has '
             'prior knowledge of the party\'s movements through '
             'informants they haven\'t identified.'],
            S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Scholar Corra Twice-Born', 'Major NPC',
            'First to Read the Inscription — Changed by It',
            'What I Know Would End Three Warlord Lines',
            ['Has Not Spoken About What She Saw in the Inscription Vault',
             'The Name "Twice-Born" Was Given After the Second Emergence',
             'Something in the Phade Network Has Been Addressing Her Directly'],
            ['Superb (+5) Lore', 'Good (+3) Will',
             'Fair (+2) Rapport', 'Fair (+2) Notice'],
            2,
            ['<b>The inscription:</b> Corra knows what the Phade built '
             'this world to contain. She will share it once — '
             'to the right people, at the right moment.',
             '<b>Network contact:</b> The broadcasting Phade structure '
             'is sending to her specifically. She has been responding.'],
            S)
    ]))

    story.append(PageBreak())

    # ── RUN ONE ──────────────────────────────────────────────────────────────
    story += sec('Part I: The Arena of Dust', S)

    story.append(fiction(
        'The arena games have been suspended for eleven days. No announcement. '
        'The city\'s gladiators are still in the district — they haven\'t been '
        'released and they haven\'t been told anything. The city is watching '
        'the arena gates and pretending not to. Gorath\'s banner flies over '
        'the Warlord\'s seat and three other city-states\' banners fly below it. '
        'Nobody has explained that either.',
        S))

    story.append(body(
        '<b>Inciting Incident:</b> A fighter the characters know — or owe, '
        'or are owed by — was competing in the arena when the games were '
        'suspended. They have not emerged. The characters are in the '
        'city and the question is not complicated: where are they?',
        S))
    story.append(body(
        '<b>What is actually happening:</b> Gorath has been using the arena '
        'to collect something — specifically, people with particular Relic '
        'sensitivity, identified through arena combat patterns. The winners '
        'were taken to a location beneath the city. The location is a '
        'partially functional Phade transit interface that has begun '
        'responding to specific individuals. Gorath does not understand '
        'what it is responding to. He is collecting people until he '
        'can get Engineer Ystra Coldflame to explain it.',
        S))
    story.append(body(
        'Ystra is in the city. She has been refusing to meet with Gorath '
        'for three weeks. She is running out of places to refuse from.',
        S))

    story.append(sb(
        'ARENA DISTRICT ELEMENTS',
        [
            (True, 'The Suspension'),
            (False, 'Eleven days is long enough that the fighters\' '
                    'families know something is wrong. The district\'s '
                    'black market is running information on what Gorath\'s '
                    'people have been moving in and out of the undercity.'),
            (True, 'Dravian\'s Position'),
            (False, 'Arena Master Dravian is visibly uncomfortable. '
                    'He owes Gorath a debt he cannot clear, and what '
                    'Gorath has asked him to facilitate this time '
                    'has moved past the line he told himself he wouldn\'t cross.'),
            (True, 'The Crowd'),
            (False, 'The arena crowd is the city\'s real political engine. '
                    'If the party gives the crowd something to direct its '
                    'energy at, that energy moves fast.'),
        ], S))

    story.append(sp(8))
    story.append(body(
        '<b>Objective:</b> Find out where the fighters went. Secondary: '
        'locate Ystra before Gorath does.',
        S))
    story.append(body(
        '<b>Fodder:</b> Arena Thugs in the undercity passages — Gorath\'s '
        'guards, not Dravian\'s. The distinction matters for how the '
        'crowd reads what the characters are doing.',
        S))
    story.append(body(
        '<b>Setpiece — The Undercity:</b> The passages beneath the arena '
        'connect to a section of Phade infrastructure that the city was '
        'built on top of without understanding. The transit interface '
        'at the bottom is active and has been scanning for something. '
        'When the characters enter its range, it responds to whoever '
        'among them carries the most significant Relic. This is the '
        'moment the Interface Roll mechanic becomes personal.',
        S))
    story.append(body(
        '<b>Setpiece — Dravian\'s Choice:</b> The Arena Master can be '
        'turned against Gorath, but it costs him everything. He knows '
        'where the fighters are. He knows what Gorath is building. '
        'He will share this if the characters give him a reason that '
        'outweighs the debt — and they can, but the reason has to '
        'be specific.',
        S))
    story.append(body(
        '<b>Victory:</b> Locate the fighters. Find Ystra before Gorath\'s '
        'people do. Get one or both out of the city.',
        S))
    story.append(body(
        '<b>Defeat:</b> Gorath acquires Ystra. The fighters remain in the '
        'undercity. The transit interface has been logged as responding '
        'to the characters — Gorath\'s scholars are now looking for them '
        'specifically.',
        S))
    story.append(body(
        '<b>Reward:</b> The fighters\' loyalty, Ystra\'s knowledge (if found), '
        'and the first confirmed information about what the broadcasting '
        'Phade structure is trying to reach. Run Two follows directly '
        'from who the characters have and what they know.',
        S))

    # ── RUN TWO ──────────────────────────────────────────────────────────────
    story += sec('Part II: The Desert Monastery', S)

    story.append(fiction(
        'The monastery has held its neutral status for forty years '
        'through a combination of political irrelevance and the '
        'specific credibility of providing shelter to people '
        'all three major warlords wanted found. It is also, '
        'Ystra has just disclosed, built directly on top of '
        'a Phade inscription vault. The monastery\'s founders knew. '
        'That is why they built there.',
        S))

    story.append(body(
        '<b>Inciting Incident:</b> The monastery sent a distress signal '
        'in the Phade language. Corra Twice-Born sent it, using '
        'the broadcasting structure\'s own frequency. She has been '
        'at the monastery for two weeks, reading the inscription vault. '
        'She has read enough to understand why the structure began '
        'broadcasting. She needs the characters to hear it from her '
        'before Gorath\'s army arrives.',
        S))
    story.append(body(
        '<b>What Corra Knows:</b> The inscription vault documents the '
        'Phade\'s purpose for this world. It was not a home. It was '
        'not a colony. It was a containment structure for something '
        'that the Phade considered too dangerous to destroy and too '
        'dangerous to leave free. The broadcasting structure is not '
        'a distress signal. It is a containment status broadcast — '
        'it has been sending "contained" on a repeating cycle '
        'for thirty millennia. It has changed its broadcast. '
        'It is now sending "containment compromised."',
        S))

    story.append(sb(
        'WHAT CONTAINMENT COMPROMISED MEANS',
        [
            (False, 'The entity the Phade contained is still here. '
                    'It has been here the entire time. The vaults that '
                    'have been opening, the servitors that have been '
                    'adapting, the impending issue of something in the '
                    'network learning — these are not separate problems. '
                    'They are one problem becoming aware of itself.'),
            (False, 'This is the campaign\'s deepest open question. '
                    'The GM should decide before this run: what is '
                    'the entity? What does it want? Is it malevolent, '
                    'or is it simply vast and indifferent? '
                    'The answer shapes everything from here forward.'),
            (False, 'Corra does not know the answer. The inscription '
                    'vault describes the containment architecture, '
                    'not the contained. She knows what it is not: '
                    'it is not Phade. It was here before the Phade.'),
        ], S))

    story.append(sp(8))
    story.append(body(
        '<b>Objective:</b> Reach the monastery and hear what Corra '
        'knows before Gorath\'s forces arrive. Secondary: decide '
        'what to do with the knowledge.',
        S))
    story.append(body(
        '<b>Road Elements:</b> Three days of desert crossing. '
        'The transit corridors would be faster — but the characters\' '
        'Relics are now registered in the transit system and Gorath\'s '
        'scholars have been flagged. The overland route is slower '
        'and harder and it\'s the only route where nobody knows '
        'where they are.',
        S))
    story.append(body(
        '<b>Setpiece — The Alzabo:</b> The Alzabo has been in the '
        'desert between the arena city and the monastery for longer '
        'than anyone has been tracking. If it has eaten anyone the '
        'characters have lost — this is the place it uses them. '
        'The encounter is not mandatory. It is mandatory if anyone '
        'in the party lost someone whose absence still has weight.',
        S))
    story.append(body(
        '<b>Setpiece — The Monastery Itself:</b> The monastery\'s '
        'population knows something is wrong. Forty years of neutral '
        'status has depended on nobody wanting what was here. '
        'Now three factions want it simultaneously. The monks '
        'are not fighters. They are, however, very good at '
        'making buildings difficult to navigate quickly.',
        S))
    story.append(body(
        '<b>Setpiece — The Inscription Vault:</b> The vault beneath '
        'the monastery is intact. Corra has been working in it '
        'for two weeks. The characters can see what she\'s been '
        'reading. The Interface Roll applies here: any character '
        'who touches the inscription surface directly makes a '
        'roll — the vault was designed to be read by specific '
        'individuals, and it may have been waiting.',
        S))
    story.append(body(
        '<b>Gorath\'s Arrival:</b> His advance force arrives at the '
        'end of the run — not his army, his scholars, with escorts. '
        'They want Corra. They want the inscription vault translated. '
        'They don\'t yet know what the characters know.',
        S))
    story.append(body(
        '<b>Victory:</b> Protect Corra, read the vault, understand the '
        'broadcast\'s message, and leave with the knowledge intact '
        'and Gorath\'s scholars delayed.',
        S))
    story.append(body(
        '<b>Defeat:</b> Gorath\'s scholars reach Corra and the vault. '
        'They will misread it deliberately — Gorath needs it to '
        'say something that consolidates his authority, and '
        'that is not what it says. The characters leave knowing '
        'the truth and watching the wrong interpretation '
        'become the official record.',
        S))
    story.append(body(
        '<b>Reward:</b> Corra as an ongoing ally. The true translation '
        'of the containment broadcast. And the location of the '
        'Singing Ruin itself — the Phade structure where '
        'the containment architecture is centred.',
        S))

    # ── RUN THREE ─────────────────────────────────────────────────────────────
    story += sec('Part III: The Source', S)

    story.append(fiction(
        'The Singing Ruin is not a ruin. It is intact. It is '
        'broadcasting because its containment parameters have '
        'been compromised in a way its systems can identify but '
        'cannot repair autonomously. It is asking for maintenance. '
        'Every faction in the Wastes is now moving toward it. '
        'The servitors that have been adapting across the continent '
        'are moving toward it. And whatever the Phade sealed inside '
        'this world is also moving toward it — not to escape, '
        'but because it too received the broadcast.',
        S))

    story.append(body(
        '<b>Inciting Incident:</b> The Singing Ruin\'s location is known. '
        'Gorath has it. The rival delver factions have it. '
        'The adapting servitor network has it. '
        'Corra has it because she read it in the inscription vault. '
        'The characters have it because Corra trusts them. '
        'They are three days ahead of everyone except the servitors, '
        'who don\'t travel by road.',
        S))
    story.append(body(
        '<b>What the Ruin is:</b> A Phade containment management '
        'structure — the operations centre for the cage that '
        'this world is. It has been running on reserve power '
        'for millennia. The solar degradation has compromised '
        'its primary power source. It cannot maintain full '
        'containment on reserve power. It broadcast the status '
        'change when the calculation told it the window was '
        'six months.',
        S))
    story.append(body(
        '<b>What the characters can do:</b> The Ruin can be restored '
        'to full power if someone understands the Phade systems '
        'well enough to redirect an alternative power source. '
        'Ystra can do this — if she\'s with them, if she has '
        'the operational manual from the monastery vault, '
        'and if the power source can be found. '
        'The power source is in the Ruin\'s lower levels. '
        'The adapting servitors are also in the lower levels. '
        'They are not hostile. They are working on the same problem.',
        S))

    story.append(sb(
        'MULTIPLE PATHS TO THE ENDING',
        [
            (True, 'Full success: containment restored'),
            (False, 'The Ruin is brought back to full operational '
                    'status. Containment holds. The entity that was '
                    'here before the Phade remains contained. '
                    'The servitors complete the maintenance cycle '
                    'and return to their directives. The world '
                    'has six months more than it had yesterday. '
                    'The dying sun is still dying.'),
            (True, 'Partial success: temporary hold'),
            (False, 'The Ruin is stabilised but not restored. '
                    'Containment holds for a season. Ystra knows '
                    'what would be needed for a permanent solution '
                    'and it requires going somewhere the party hasn\'t '
                    'been. The next campaign opens here.'),
            (True, 'Gorath succeeds first'),
            (False, 'Gorath\'s force reaches the Ruin and Gorath '
                    'claims the operations throne — the Phade control '
                    'interface that manages the containment. He does '
                    'not understand what he is sitting in. The entity '
                    'receives an incorrect maintenance response. '
                    'What happens next is the next campaign.'),
            (True, 'The characters choose not to restore it'),
            (False, 'This is a valid choice. The entity may not be '
                    'hostile. The Phade built the cage; the Phade are '
                    'gone. Who decided what needed containing? '
                    'The consequences of this choice are the '
                    'next several campaigns.'),
        ], S))

    story.append(sp(8))
    story.append(body(
        '<b>Objective:</b> Reach the Singing Ruin before Gorath. '
        'Understand what it needs. Decide what to do.',
        S))
    story.append(body(
        '<b>Setpiece — The Convergence:</b> The adapting servitors '
        'arrive as the characters reach the Ruin. They do not '
        'attack. They are moving toward the power relay. '
        'One of them stops and addresses one PC by their '
        'Relic\'s registered identifier — not their name. '
        'It is waiting for a response in operational language.',
        S))
    story.append(body(
        '<b>Setpiece — The Operations Throne:</b> The Phade control '
        'interface at the Ruin\'s centre will respond to whoever '
        'sits in it. What it asks them to do depends on what '
        'the GM has decided the entity is. If it asks something '
        'the character can give — or refuses to ask something '
        'the character expected — the rest of the run pivots on '
        'that moment.',
        S))
    story.append(body(
        '<b>Setpiece — Gorath\'s Arrival:</b> He comes with force. '
        'His advance knowledge of the transit system means he '
        'arrives faster than the characters expected. He does '
        'not know what the Ruin is for. He knows it is the most '
        'significant Phade structure in the Wastes and he '
        'intends to control it. He is not entirely wrong '
        'about its significance.',
        S))
    story.append(body(
        '<b>Reward:</b> Whatever the characters chose, they changed '
        'the world. Every faction\'s strategic situation is different '
        'from what it was when the run started. The Relic that '
        'the operations throne responded to has been updated — '
        'its hidden function is now partially known, its network '
        'status has changed, and something in the Phade system '
        'has acknowledged the character who used it as an '
        'authorised operator.',
        S))

    story.append(ThinRule())
    story.append(sp(10))
    story.append(Paragraph(
        'The sun is still wrong. The vaults are still opening. '
        'The entity is still here. But the people in the Wastes '
        'who know what any of that means have increased by at least four.',
        S['tagline']))

    story.append(PageBreak())

    # ── ATTRIBUTION ──────────────────────────────────────────────────────────
    story += chapter('Attribution', S)

    attrs = [
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
         'authored, and edited by Brian Engard, Lara Turner, Joshua Yearsley, and '
         'Anna Meade, and licensed for our use under the Creative Commons Attribution '
         '3.0 Unported license.'),
    ]
    for (title, text) in attrs:
        story.append(KeepTogether([
            Paragraph(title, S['section_head']),
            body(text, S),
        ]))
        story.append(sp(6))

    story.append(ThinRule())
    story.append(sp(8))
    story.append(Paragraph(
        'Fate™ is a trademark of Evil Hat Productions, LLC. '
        'The Powered by Fate logo is © Evil Hat Productions, LLC and is used with permission. '
        'This project is not affiliated with, endorsed by, or sponsored by Evil Hat Productions, LLC. '
        'Names drawn from the works of Jack Vance, Gene Wolfe, Edgar Rice Burroughs, '
        'Hayao Miyazaki, and others, used for inspirational reference only.',
        S['tiny']))

    return story


def main():
    outpath = '/home/claude/the_long_after.pdf'
    S = make_styles()
    story = build(S)

    from reportlab.platypus import ActionFlowable
    class SetChapter(ActionFlowable):
        def __init__(self, name):
            self.name = name
            ActionFlowable.__init__(self)
        def apply(self, doc):
            doc.current_chapter = self.name

    # Inject chapter trackers
    final = []
    for item in story:
        if hasattr(item, 'style') and hasattr(item.style, 'name'):
            if item.style.name == 'chapter_title':
                final.append(SetChapter(
                    item.text if hasattr(item, 'text') else ''))
        final.append(item)

    doc = LongAfterDoc(
        outpath,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN + 0.35*inch,
        bottomMargin=MARGIN + 0.2*inch,
        title='The Long After — A World of Adventure for Fate Condensed',
        author='Ogma Generator Project',
        subject='Fate Condensed dying-earth sword-and-planet campaign',
    )
    doc.build(final)
    print(f'Built: {outpath}')
    return outpath

if __name__ == '__main__':
    main()
