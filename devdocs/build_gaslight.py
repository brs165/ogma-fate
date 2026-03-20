"""
THE GASLIGHT CHRONICLES — A World of Adventure for Fate Condensed
Full PDF. Palette: gaslit gold-green on near-black.
Layout: Evil Hat Worlds of Adventure conventions.
"""

from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    KeepTogether, Table, TableStyle, PageBreak
)
from reportlab.platypus.flowables import Flowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

PAGE_W = 6 * inch
PAGE_H = 9 * inch
MARGIN = 0.65 * inch
FRAME_W = PAGE_W - 2 * MARGIN

# Gaslight palette: gold + foggy green on near-black
C_GOLD    = colors.HexColor('#B8952A')   # warm gaslight gold
C_GREEN   = colors.HexColor('#7A9048')   # foggy gaslit green (accent)
C_DARK    = colors.HexColor('#1A1408')   # near-black warm
C_SIDEBAR = colors.HexColor('#1A1A0E')   # sidebar bg — dark green-black
C_MUTED   = colors.HexColor('#6A6828')   # muted gold-green
C_RULE    = colors.HexColor('#9A8840')   # border gold
C_STATBG  = colors.HexColor('#F8F4E8')   # stat card cream
C_STATBDR = colors.HexColor('#B8952A')   # stat card border
C_WHITE   = colors.white
C_DIM     = colors.HexColor('#3A3018')

SERIF   = 'Times-Roman'
SERIF_B = 'Times-Bold'
SERIF_I = 'Times-Italic'
SANS    = 'Helvetica'
SANS_B  = 'Helvetica-Bold'
SANS_I  = 'Helvetica-Oblique'


def make_styles():
    S = {}
    S['body'] = ParagraphStyle('body',
        fontName=SERIF, fontSize=10, leading=14.5,
        textColor=C_DARK, alignment=TA_JUSTIFY, spaceAfter=6)
    S['body_i'] = ParagraphStyle('body_i', parent=S['body'], fontName=SERIF_I)
    S['chapter_title'] = ParagraphStyle('chapter_title',
        fontName=SANS_B, fontSize=16, leading=19,
        textColor=C_GOLD, spaceBefore=0, spaceAfter=6)
    S['section_head'] = ParagraphStyle('section_head',
        fontName=SANS_B, fontSize=11.5, leading=14,
        textColor=C_DARK, spaceBefore=14, spaceAfter=4)
    S['sub_head'] = ParagraphStyle('sub_head',
        fontName=SANS_B, fontSize=10, leading=13,
        textColor=C_GREEN, spaceBefore=10, spaceAfter=3)
    S['sidebar_title'] = ParagraphStyle('sidebar_title',
        fontName=SANS_B, fontSize=9.5, leading=12,
        textColor=C_GOLD, spaceBefore=0, spaceAfter=4)
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
        textColor=C_GREEN, spaceAfter=0, spaceBefore=3)
    S['stat_body'] = ParagraphStyle('stat_body',
        fontName=SERIF, fontSize=9.5, leading=13,
        textColor=C_DARK, spaceAfter=2)
    S['fiction'] = ParagraphStyle('fiction',
        fontName=SERIF_I, fontSize=10, leading=15,
        textColor=C_MUTED, spaceBefore=8, spaceAfter=8,
        leftIndent=18, rightIndent=18)
    S['credit_title'] = ParagraphStyle('credit_title',
        fontName=SANS_B, fontSize=22, leading=26,
        textColor=C_DARK, alignment=TA_CENTER, spaceAfter=4)
    S['credit_sub'] = ParagraphStyle('credit_sub',
        fontName=SANS, fontSize=11, leading=14,
        textColor=C_GREEN, alignment=TA_CENTER, spaceAfter=2)
    S['credit_body'] = ParagraphStyle('credit_body',
        fontName=SANS_B, fontSize=10, leading=14,
        textColor=C_DARK, alignment=TA_CENTER, spaceAfter=2)
    S['credit_note'] = ParagraphStyle('credit_note',
        fontName=SERIF_I, fontSize=8.5, leading=12,
        textColor=C_MUTED, alignment=TA_CENTER, spaceAfter=2)
    S['toc_head'] = ParagraphStyle('toc_head',
        fontName=SANS_B, fontSize=9.5, leading=13,
        textColor=C_GREEN, spaceBefore=6)
    S['toc_entry'] = ParagraphStyle('toc_entry',
        fontName=SERIF, fontSize=10, leading=15, textColor=C_DARK)
    S['bullet'] = ParagraphStyle('bullet',
        fontName=SERIF, fontSize=10, leading=13.5,
        textColor=C_DARK, leftIndent=16, firstLineIndent=-10, spaceAfter=3)
    S['tagline'] = ParagraphStyle('tagline',
        fontName=SERIF_I, fontSize=11.5, leading=17,
        textColor=C_GREEN, alignment=TA_CENTER,
        spaceBefore=6, spaceAfter=10)
    S['tiny'] = ParagraphStyle('tiny',
        fontName=SANS, fontSize=8, leading=11,
        textColor=C_MUTED, alignment=TA_CENTER)
    return S


class GoldRule(Flowable):
    def __init__(self, w=FRAME_W, thick=3):
        super().__init__(); self.rw=w; self.thick=thick
    def wrap(self,aw,ah): return self.rw, self.thick+6
    def draw(self):
        self.canv.setFillColor(C_GOLD)
        self.canv.rect(0, 3, self.rw, self.thick, fill=1, stroke=0)

class ThinRule(Flowable):
    def __init__(self, w=FRAME_W):
        super().__init__(); self.rw=w
    def wrap(self,aw,ah): return self.rw, 7
    def draw(self):
        self.canv.setStrokeColor(C_RULE)
        self.canv.setLineWidth(0.5)
        self.canv.line(0, 3, self.rw, 3)

class SidebarBox(Flowable):
    def __init__(self, title, items, S, w=FRAME_W):
        super().__init__()
        self.title=title; self.items=items; self.S=S; self.bw=w
        self._built=[]; self._h=0
    def wrap(self,aw,ah):
        PAD=10; iw=self.bw-PAD*2; total=PAD; self._built=[]
        if self.title:
            p=Paragraph(self.title, self.S['sidebar_title'])
            _,h=p.wrap(iw,9999)
            self._built.append((p,h,self.S['sidebar_title'].spaceAfter))
            total+=h+self.S['sidebar_title'].spaceAfter
        for (bold,txt) in self.items:
            sk='sidebar_bold' if bold else 'sidebar_body'
            p=Paragraph(txt, self.S[sk])
            _,h=p.wrap(iw,9999)
            self._built.append((p,h,self.S[sk].spaceAfter))
            total+=h+self.S[sk].spaceAfter
        total+=PAD; self._h=total
        return self.bw, total
    def draw(self):
        PAD=10; c=self.canv
        c.setFillColor(C_SIDEBAR)
        c.roundRect(0,0,self.bw,self._h,4,fill=1,stroke=0)
        c.setFillColor(C_GOLD)
        c.rect(0,0,3,self._h,fill=1,stroke=0)
        y=self._h-PAD
        for (p,h,sa) in self._built:
            p.drawOn(c,PAD+3,y-h); y-=h+sa

class StatBlock(Flowable):
    def __init__(self, name, vital, hc, trouble, aspects, skills,
                 stress, stunts, S, w=FRAME_W, qty=1):
        super().__init__()
        self.name=name; self.vital=vital; self.hc=hc; self.trouble=trouble
        self.aspects=aspects; self.skills=skills; self.stress=stress
        self.stunts=stunts; self.S=S; self.bw=w; self.qty=qty
        self._built=[]; self._h=0
    def _lines(self):
        L=[]
        tag=f'  <font name="{SANS}" size="9" color="#7A9048">[{self.vital}]</font>' if self.vital else ''
        L.append(('stat_name', self.name+tag))
        if self.hc:
            L.append(('stat_label','HIGH CONCEPT'))
            L.append(('stat_body',f'<i>{self.hc}</i>'))
        if self.trouble:
            L.append(('stat_label','TROUBLE'))
            L.append(('stat_body',f'<i>{self.trouble}</i>'))
        if self.aspects:
            L.append(('stat_label','ASPECTS'))
            for a in self.aspects: L.append(('stat_body',f'• <i>{a}</i>'))
        if self.skills:
            L.append(('stat_label','SKILLS'))
            L.append(('stat_body','   ·   '.join(self.skills)))
        if self.stress is not None:
            L.append(('stat_label','STRESS'))
            L.append(('stat_body',('□ '*self.stress).strip() or '—'))
        if self.stunts:
            L.append(('stat_label','STUNTS'))
            for st in self.stunts: L.append(('stat_body',st))
        if self.qty>1:
            L.append(('stat_body',f'<i>Typically encountered in groups of {self.qty}.</i>'))
        return L
    def wrap(self,aw,ah):
        PAD=10; iw=self.bw-PAD*2; total=PAD; self._built=[]
        for (sk,txt) in self._lines():
            p=Paragraph(txt,self.S[sk])
            _,h=p.wrap(iw,9999)
            self._built.append((p,h,self.S[sk].spaceAfter))
            total+=h+self.S[sk].spaceAfter
        total+=PAD; self._h=total
        return self.bw, total
    def draw(self):
        PAD=10; c=self.canv
        c.setFillColor(C_STATBG)
        c.setStrokeColor(C_STATBDR)
        c.setLineWidth(0.75)
        c.roundRect(0,0,self.bw,self._h,3,fill=1,stroke=1)
        c.setFillColor(C_GOLD)
        c.rect(0,0,3,self._h,fill=1,stroke=0)
        y=self._h-PAD
        for (p,h,sa) in self._built:
            p.drawOn(c,PAD+3,y-h); y-=h+sa


class GaslightDoc(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, pagesize=(PAGE_W,PAGE_H), **kwargs)
        self.current_chapter=''
        f=Frame(MARGIN, MARGIN+0.3*inch, FRAME_W,
                PAGE_H-2*MARGIN-0.55*inch,
                leftPadding=0,rightPadding=0,
                topPadding=0,bottomPadding=0,id='main')
        self.addPageTemplates([PageTemplate(id='main',frames=[f],
                                            onPage=self._chrome)])
    def _chrome(self,canv,doc):
        canv.saveState()
        pg=doc.page
        canv.setStrokeColor(C_GOLD)
        canv.setLineWidth(0.5)
        canv.line(MARGIN,PAGE_H-MARGIN+6,PAGE_W-MARGIN,PAGE_H-MARGIN+6)
        canv.setFont(SANS,7.5)
        if pg%2==1:
            canv.setFillColor(C_MUTED)
            canv.drawString(MARGIN,PAGE_H-MARGIN+10,'THE GASLIGHT CHRONICLES')
            canv.setFillColor(C_GOLD)
            canv.drawRightString(PAGE_W-MARGIN,PAGE_H-MARGIN+10,
                                 doc.current_chapter.upper())
        else:
            canv.setFillColor(C_GOLD)
            canv.drawString(MARGIN,PAGE_H-MARGIN+10,
                            doc.current_chapter.upper())
            canv.setFillColor(C_MUTED)
            canv.drawRightString(PAGE_W-MARGIN,PAGE_H-MARGIN+10,
                                 'A WORLD OF ADVENTURE FOR FATE CONDENSED')
        canv.setStrokeColor(C_RULE)
        canv.setLineWidth(0.5)
        canv.line(MARGIN,MARGIN-4,PAGE_W-MARGIN,MARGIN-4)
        if pg>1:
            canv.setFont(SANS,8)
            canv.setFillColor(C_GOLD)
            if pg%2==1:
                canv.drawRightString(PAGE_W-MARGIN,MARGIN-16,str(pg-1))
            else:
                canv.drawString(MARGIN,MARGIN-16,str(pg-1))
        canv.restoreState()


# helpers
def ch(title,S): return [Spacer(1,6),Paragraph(title,S['chapter_title']),GoldRule(),Spacer(1,8)]
def sec(t,S): return [Paragraph(t,S['section_head'])]
def sub(t,S): return [Paragraph(t,S['sub_head'])]
def body(t,S,st='body'): return Paragraph(t,S[st])
def fiction(t,S): return Paragraph(t,S['fiction'])
def sb(title,items,S): return SidebarBox(title,items,S)
def bullets(items,S): return [Paragraph(f'• {x}',S['bullet']) for x in items]
def sp(h=8): return Spacer(1,h)
def toc_row(label,pg,S,indent=False):
    t=Table([[Paragraph(('    ' if indent else '')+label,
                        S['toc_entry' if indent else 'toc_head']),
              Paragraph(str(pg),S['toc_entry'])]],
            colWidths=[FRAME_W-30,30])
    t.setStyle(TableStyle([('ALIGN',(0,0),(0,0),'LEFT'),('ALIGN',(1,0),(1,0),'RIGHT'),
                            ('TOPPADDING',(0,0),(-1,-1),1),('BOTTOMPADDING',(0,0),(-1,-1),1),
                            ('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0)]))
    return t


def build(S):
    story=[]

    # ── TITLE PAGE ───────────────────────────────────────────────────────────
    story.append(sp(50))
    story.append(Paragraph('THE GASLIGHT CHRONICLES',S['credit_title']))
    story.append(sp(4))
    story.append(GoldRule())
    story.append(sp(8))
    story.append(Paragraph('A WORLD OF ADVENTURE FOR',S['credit_sub']))
    story.append(Paragraph('FATE CONDENSED',
        ParagraphStyle('fl',fontName=SANS_B,fontSize=18,leading=22,
                       textColor=C_DARK,alignment=TA_CENTER,spaceAfter=4)))
    story.append(sp(10))
    story.append(Paragraph(
        'Gothic Cosmic Horror. The arrogance of the Enlightenment meets ancient, '
        'incomprehensible dread — in the gaslit streets where industrial progress ends, '
        'the veil is very thin.',
        ParagraphStyle('tagbig',fontName=SERIF_I,fontSize=11,leading=16,
                       textColor=C_GREEN,alignment=TA_CENTER,
                       leftIndent=20,rightIndent=20,spaceAfter=0)))
    story.append(sp(30))
    for (role,name) in [
        ('WRITING & WORLD DESIGN','Ogma Generator Project'),
        ('RULES SYSTEM','Fate Condensed — Evil Hat Productions'),
        ('DEVELOPMENT','Based on Fate Core System'),
    ]:
        story.append(Paragraph(role,S['credit_sub']))
        story.append(Paragraph(name,S['credit_body']))
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
        '(http://creativecommons.org/licenses/by/3.0/).',S['credit_note']))
    story.append(Paragraph(
        'Fate™ is a trademark of Evil Hat Productions, LLC. All rights reserved.',
        S['credit_note']))
    story.append(PageBreak())

    # ── TABLE OF CONTENTS ────────────────────────────────────────────────────
    story+=ch('Contents',S)
    toc=[
        ('The Gaslight City',3,False),
        ('The Enlightenment\'s Bargain',3,True),
        ('The Veil',4,True),
        ('The Occult Societies',5,True),
        ('The Empire and What It Brought Back',7,True),
        ('The City\'s Strata',8,True),
        ('Points of Darkness',9,True),
        ('Creatures of the Veil',11,False),
        ('Minor Threats',11,True),
        ('The Possessed and the Compromised',12,True),
        ('The Lodge\'s Arsenal',13,True),
        ('Entities Beyond Classification',14,True),
        ('Creating Your Characters',16,False),
        ('The First Questions',16,True),
        ('Aspects',17,True),
        ('Skills',18,True),
        ('Stunts',19,True),
        ('Extras: The Affliction',21,True),
        ('The Witness Track',22,False),
        ('What the Witness Track Is',22,True),
        ('Witness Stages',23,True),
        ('Recovery and the Price',24,True),
        ('Running an Investigation',25,False),
        ('The Inciting Incident',25,True),
        ('Challenge Types',26,True),
        ('Complications',27,True),
        ('Rewards',28,True),
        ('The Seven Sites',29,False),
        ('The Named',30,True),
        ('Part I: The Missing Curator',32,True),
        ('Part II: The Calendar of Incidents',35,True),
        ('Part III: Below the City',38,True),
        ('Attribution',41,False),
    ]
    for (label,pg,indent) in toc:
        story.append(toc_row(label,pg,S,indent))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CH 1 — THE GASLIGHT CITY
    # ════════════════════════════════════════════════════════════════════════
    story+=ch('The Gaslight City',S)

    story.append(fiction(
        'The fog comes in from the Thames just before midnight. By two o\'clock it '
        'sits at chest height along the Embankment and moves in ways that fog '
        'does not move. The gas lamps make it luminous. The doctors call it '
        'miasma. The lodges know what it actually is. The rest of the city '
        'does what cities do: it continues.',S))

    story.append(body(
        'The Gaslight Chronicles is a Gothic cosmic horror campaign setting for '
        'Fate Condensed. It is set in a London of the late nineteenth century '
        'that does not quite match the historical record — not because the '
        'supernatural has been inserted into an otherwise accurate city, '
        'but because the supernatural was always here, and the city '
        'has organised itself around not acknowledging it.',S))
    story.append(body(
        'The characters are investigators, occultists, society members, physicians, '
        'journalists, and reformed criminals — people who have seen enough to '
        'know what the lodges are doing behind the philanthropic frontage, '
        'and who have not yet been silenced, committed, or consumed. '
        'They operate at the intersection of two London systems: '
        'the social and institutional machinery of Victorian Britain, '
        'and the occult infrastructure that has been running underneath '
        'it for considerably longer.',S))

    story+=sec('The Enlightenment\'s Bargain',S)
    story.append(body(
        'The Enlightenment made a specific claim: that the world is knowable, '
        'measurable, and rational; that superstition is the enemy of progress; '
        'and that science, applied rigorously, can account for everything. '
        'This claim is wrong in the specific and useful way that the '
        'best lies are wrong — it is accurate enough to have built railways '
        'and steamships and telegraphs, and precisely wrong enough '
        'that the things it cannot account for have been growing in the '
        'space the claim cleared for them.',S))
    story.append(body(
        'The Enlightenment\'s bargain is this: in exchange for a framework that '
        'makes the world legible and productive, you agree to stop seeing '
        'certain things. The things you stop seeing don\'t stop being there. '
        'They stop being visible to the official record.',S))
    story.append(body(
        'For the investigators, this creates the central practical problem '
        'of every case: the evidence is real, the witness is credible, '
        'and the official conclusion will still be natural causes. '
        'The question is not whether the supernatural is happening. '
        'The question is what to do about it in a world that '
        'will not officially acknowledge that it is.',S))

    story.append(sb(
        'THE SETTING\'S THESIS',
        [(False,'The arrogance of the Enlightenment is not a mistake. '
                'The steam engine is real. The telegraph is real. The '
                'scientific method has produced genuine knowledge. '
                'The horror of this setting is not that progress is '
                'false — it\'s that progress has proceeded in exactly '
                'the way it should, and the things that do not respond '
                'to empirical method have simply been reclassified '
                'as someone else\'s department.'),
         (False,'The lodges know. Scotland Yard\'s Special Branch '
                'knows. The Home Office has a file. The file exists '
                'so that the file can be the answer to any question '
                'about whether anyone knows. The file is never opened.'),
         (False,'The investigators know too. That is why they are '
                'dangerous to everyone with a stake in the current '
                'arrangement — and why the adventure hooks in this '
                'setting often arrive as official problems '
                'that officially do not exist.')],S))

    story.append(sp(10))

    story+=sec('The Veil',S)
    story.append(body(
        'The Veil is the investigators\' shorthand for the membrane between '
        'this world and whatever lies adjacent to it. The term is imprecise — '
        'it implies a single boundary between two stable states, which is not '
        'how the various entities, intrusions, and manifestations behave. '
        'Some cross from a specific direction. Some have always been here, '
        'in the walls and under the streets and in the Thames mud, '
        'and what\'s changed is not their location but the city\'s '
        'density bringing more people into proximity with them.',S))
    story.append(body(
        'The Veil is thinner in certain places — cemeteries, the sites of '
        'mass death, locations with long histories of specific kinds of ritual, '
        'and wherever the industrial city has excavated or disturbed ground '
        'that was previously undisturbed for centuries. The Underground '
        'extension works are creating problems at a structural level '
        'that the engineers are reporting as geological anomalies.',S))

    veil_rules = [
        ('The veil tears and heals',
         'Sustained ritual activity, violent death in numbers, and specific '
         'artefact concentrations can thin the veil at a location '
         'to the point of breach. Breaches usually close — but not immediately, '
         'and not before something comes through. '
         'Closing a breach deliberately is the work of a challenge, '
         'not a single roll.'),
        ('Entities are not all the same',
         'Some things beyond the veil are ancient in the way that geology '
         'is ancient — they predate human cognition and have no interest in it. '
         'Some are the dead, various and contradictory. Some are things that '
         'were never human, came here at some point, and have their '
         'own agendas entirely. The lodges have tried to classify them. '
         'The classifications don\'t hold.'),
        ('Contact changes you',
         'Direct exposure to genuine supernatural phenomena — seeing what '
         'should not be, hearing what should not be audible, being '
         'the instrument of something that needed a human body — '
         'costs something. The Witness Track models this. '
         'The cost is not always debilitating. But it is always real.'),
        ('The city is a participant',
         'London\'s density, its history of burial, its specific combination '
         'of old stone and new gas and excavated foundation has created '
         'an urban environment with more occult conductivity than most '
         'countryside. The city is not neutral. It is not hostile. '
         'It is something between ambient and interested.'),
    ]
    for (name,desc) in veil_rules:
        story.append(KeepTogether([Paragraph(name,S['sub_head']),body(desc,S)]))

    story+=sec('The Occult Societies',S)
    story.append(body(
        'Every major occult society in London claims to be the oldest, '
        'the most legitimate, and the most responsible steward of '
        'forbidden knowledge. Some of these claims are partly true. '
        'None are entirely true. The Obsidian Lodge, the most prominent '
        'of the operating societies, convenes once a decade under normal '
        'circumstances. It has convened early.',S))
    story.append(body(
        'The societies share certain characteristics regardless of their stated '
        'purpose. They have a public face — philanthropic, scholarly, or '
        'social — that provides cover for their operational work. They have '
        'a tiered membership structure in which the upper circles know '
        'considerably more than the lower ones, and use that differential '
        'to maintain control. They have an entity or set of entities '
        'with which they maintain a compact — a relationship of mutual '
        'service that has, in most cases, been running long enough '
        'that neither party fully remembers the original terms.',S))
    story.append(body(
        'The societies are also factionated, paranoid, and frequently '
        'working at cross-purposes to each other and to their stated goals. '
        'A lodge that has been communing with an entity for three generations '
        'has developed institutional blind spots about what the entity is '
        'actually getting from the arrangement.',S))

    faction_types = [
        ('The Obsidian Lodge',
         'The oldest and most institutionally entrenched. Parliamentary connections, '
         'Home Office access, and a membership list that spans every profession '
         'of consequence. Their goal is maintenance of the status quo — '
         'specifically the status quo in which they mediate between the city '
         'and the things the city is not supposed to know about. They are '
         'currently split between a containment faction and a liberation '
         'faction, and the split is becoming structural.',
         'Grand Master Cornelius Blackwood: called the early convening '
         'and will not say why to anyone below the Third Circle.',
         'Their Parliamentary patron is three months from a scandal they '
         'know about and cannot prevent.'),
        ('The Correspondence',
         'A newer society, founded on the principle that the public deserves '
         'to know what the lodges know. They are the source of the anonymous '
         'pamphlets spreading through the city. Their membership is smaller, '
         'younger, and considerably less stable than the Lodge\'s. Their '
         'entity relationship is more direct — they communicate rather than '
         'transact — which gives them better information and less protection.',
         'Printer Bartholomew Finch: distributes the pamphlets but does not '
         'know who is writing them.',
         'Their founding document grants authority that was forged; '
         'the forger wants something.'),
        ('The Colonial Compact',
         'Not a society in the domestic sense — a network of individuals '
         'whose shared experience of imperial service has given them '
         'exposure to non-European occult traditions, several of which '
         'proved considerably more robust than the Lodge\'s framework '
         'had anticipated. They operate informally, communicate in code, '
         'and are the only group that treats the entities\' grievances '
         'as potentially legitimate.',
         'A colonial administrator who provides both material and '
         'deniability for operations outside domestic law.',
         'Their most capable operative is pursuing a personal '
         'investigation the leadership has not sanctioned.'),
    ]
    for (name,desc,face,weakness) in faction_types:
        story.append(KeepTogether([
            Paragraph(name,S['section_head']),
            body(desc,S),
            body(f'<b>Face:</b> {face}',S),
            body(f'<b>Weakness:</b> {weakness}',S),
        ]))
        story.append(sp(4))

    story+=sec('The Empire and What It Brought Back',S)
    story.append(body(
        'The British Empire has been conducting extraction operations across '
        'five continents for two hundred years. It has extracted raw materials, '
        'agricultural products, human labour, and antiquities. It has also '
        'extracted, inadvertently and inevitably, things that have their '
        'own opinions about being extracted.',S))
    story.append(body(
        'The museum\'s current archaeological exhibition features artefacts '
        'from three separate digs. Three curators have had breakdowns. '
        'One is missing. The exhibition committee has approved the opening '
        'date. The question of whether objects from different traditions '
        'should be in the same building, and whether their proximity '
        'constitutes a ritual configuration their original owners '
        'would have recognised, has not been part of the committee\'s '
        'deliberations.',S))
    story.append(body(
        'The Empire\'s relationship with the occult is therefore structural: '
        'it has been creating conditions for supernatural incident across '
        'its territories and then routing the consequences back to London '
        'through the same logistics systems that move tea and cotton. '
        'The Colonial Compact exists because some of the people who were '
        'present during those incidents survived them and drew conclusions.',S))

    story+=sec('The City\'s Strata',S)
    story.append(body(
        'The characters operate across multiple layers of Victorian London, '
        'and their ability to move between them — or to be seen as '
        'belonging in them — is one of the setting\'s primary mechanical concerns.',S))

    strata = [
        ('Society and the Clubs',
         'The upper reaches of the social world: gentlemen\'s clubs, '
         'drawing rooms, Parliamentary connections, the professions. '
         'Access requires either birth, reputation, or a very good cover. '
         'Information flows freely here. Accountability flows slowly or not at all. '
         'Most of the Lodge\'s upper membership lives here.'),
        ('The Professions',
         'Physicians, lawyers, journalists, engineers, clergymen. '
         'The people who make the city function. They have access '
         'both upward and downward. They are the social layer '
         'most directly exposed to the things the setting produces — '
         'the bodies, the anomalous cases, the witnesses who '
         'cannot be officially believed — and most directly incentivised '
         'to not report what they see accurately.'),
        ('The Street Level',
         'The working population of London: dockworkers, servants, '
         'market traders, the inhabitants of the rookeries. '
         'They know things. They see things. They are rarely asked '
         'officially and are believed even less often. '
         'The feral street children know every alley and sewer grate '
         'in the city and have absolutely no reason to trust '
         'anyone from the professional class.'),
        ('Below the Street Level',
         'The criminal underworld, the opium establishments, '
         'the underground networks connecting properties '
         'that don\'t appear on official plans. '
         'This is where the investigations often end up — '
         'not because the supernatural lives here, '
         'but because the people who deal with it '
         'quietly live here too.'),
    ]
    for (name,desc) in strata:
        story.append(Paragraph(f'<b>{name}.</b> {desc}',S['body']))
        story.append(sp(4))

    story+=sec('Points of Darkness',S)
    story.append(body('Locations for investigation. Each suggests a situation, not just a place.',S))

    locations = [
        ('The Metropolitan Museum — Sealed Lower Galleries',
         'The new archaeological exhibition opens the day after tomorrow. '
         'The sealed lower galleries, where the curators have been '
         'working late, contain artefacts from three incompatible traditions '
         'now in proximity for the first time. Archaeologist Vivienne Moorcroft '
         'was last seen going down the basement stairs.'),
        ('The Private Sanatorium, Outer London',
         'Its intake records show the same patient name recurring '
         'at ten-year intervals since 1801. The current patient bearing '
         'that name arrived six weeks ago. Alienist Lucian Undertow '
         'has forty case files of identical dreams from across the city '
         'and is being pressured to stop treating them.'),
        ('The Underground Extension Works',
         'The engineers are reporting the new deepest excavation '
         'as geological anomalies. The night workers\' union '
         'has quietly stopped requiring members to work '
         'below the second level. Three workers have '
         'resigned in the same week with no recorded reason.'),
        ('The Colonial Shipping Warehouse, Wapping',
         'Holds uncatalogued material from three expeditions '
         'whose crews all died returning. The current duty manifest '
         'lists contents as \'sundry archaeological samples.\' '
         'The dock foreman controls what gets reported '
         'and controls it carefully.'),
        ('The Gentleman\'s Club, St. James\'s',
         'Whose private rooms have been sealed following a member\'s death. '
         'The member was a Home Office official with access '
         'to the relevant file. The rooms are sealed by the club, '
         'not the police. The police have not been informed '
         'the rooms are sealed.'),
        ('The Cemetery, Highgate',
         'Where graves have been disturbed from below, '
         'according to the groundskeeper\'s private journal '
         'which has not been shared with the authorities. '
         'The disturbances follow a pattern. '
         'The pattern is a calendar.'),
        ('The Photography Studio, Mayfair',
         'Which has been producing images of figures not present '
         'during the sitting. The photographer has sold '
         'three of these images to the Society for '
         'Psychical Research before understanding what they are. '
         'The subjects in the photographs have names '
         'that appear in eighteenth-century burial records.'),
    ]
    for (name,desc) in locations:
        story.append(KeepTogether([
            Paragraph(name,S['sub_head']),
            body(desc,S),
        ]))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CH 2 — CREATURES OF THE VEIL
    # ════════════════════════════════════════════════════════════════════════
    story+=ch('Creatures of the Veil',S)

    story.append(body(
        'The investigators\' opposition ranges from entirely human (and therefore '
        'amenable to conventional approaches) to things that do not share '
        'enough ontological ground for conventional approaches to register. '
        'The most important practical skill is determining which category '
        'you are dealing with before committing to a method.',S))

    story+=sec('Minor Threats',S)

    story.append(KeepTogether([
        StatBlock('Cult Initiates','Minor · qty 4',
            'Believing Every Word They Were Told',None,
            ['Desperate for Meaning, Dangerous in Numbers'],
            ['Fair (+2) Fight','Fair (+2) Will','Average (+1) Stealth'],
            2,[],S,qty=4)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Lodge Enforcer','Minor · qty 2',
            'Keeping the Secrets Buried',None,
            ['Has Done This Before','Knows Where the Evidence Is'],
            ['Good (+3) Fight','Fair (+2) Stealth','Fair (+2) Physique'],
            3,[],S,qty=2)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Dockyard Thugs','Minor · qty 4',
            'Muscle for Hire, No Questions',None,
            ['Have No Idea What They\'re Protecting'],
            ['Fair (+2) Fight','Fair (+2) Physique'],
            2,[],S,qty=4)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Clockwork Sentinel','Minor · qty 2',
            'Wound Tight and Precise',None,
            ['No Discretion Built In'],
            ['Good (+3) Fight','Good (+3) Notice'],
            3,[],S,qty=2)
    ]))

    story+=sec('The Possessed and the Compromised',S)
    story.append(body(
        'The most immediately dangerous opponents are often human — '
        'people who have been used by something that needed access '
        'to the social world. They retain their skills, their '
        'credentials, their social positions. What they have lost '
        'is the use of their own priorities.',S))

    story.append(KeepTogether([
        StatBlock('Possessed Servant','Minor · qty 2',
            'Inhabited and Desperate','Not Quite Dead Yet',
            ['The Host Feels No Pain',
             'What Wears Them Has Had Days to Learn Their Patterns'],
            ['Good (+3) Fight','Good (+3) Physique','Fair (+2) Notice'],
            3,['<b>Host endurance:</b> Once per scene, ignore one mild '
               'consequence — the body sustains the damage but the '
               'inhabitant doesn\'t register it.'],S,qty=2)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Psychically Compromised Investigator','Major NPC',
            'Was One of You Until Recently',
            'The Entity Feeds Her Information',
            ['Believes Every Word She Is Being Told',
             'Has the Investigators\' Full Professional Confidence',
             'Her Case Files Are Extraordinarily Accurate'],
            ['Great (+4) Investigate','Good (+3) Deceive',
             'Good (+3) Empathy','Fair (+2) Will'],
            3,['<b>Entity intelligence:</b> Once per scene, invoke '
               'intelligence the entity has gathered about the party — '
               'creates a free aspect on a target reflecting '
               'their specific vulnerability.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Mesmerist','Major NPC',
            'The Voice Is the Weapon',
            'Society Protects Its Own',
            ['You Didn\'t Notice You Were Obeying',
             'Licensed to Practice, Credentialled, and Invited',
             'Has Operated in Six Drawing Rooms This Month'],
            ['Superb (+5) Provoke','Great (+4) Rapport',
             'Great (+4) Deceive','Good (+3) Will'],
            3,['+2 to create advantage using mental suggestion on targets '
               'who have been socially introduced to them.',
               '<b>Invitation advantage:</b> In any social setting, '
               'treat the Mesmerist\'s Rapport as one step higher — '
               'they were expected here.'],S)
    ]))

    story+=sec("The Lodge's Arsenal",S)
    story.append(body(
        'The lodges\' major operatives and institutional antagonists. '
        'These are human opponents with significant social protection — '
        'exposing them requires navigating the same institutional systems '
        'that protect them.',S))

    story.append(KeepTogether([
        StatBlock('Lodge Master','Major NPC',
            'Custodian of Forbidden Knowledge',
            'Has Done This Before and Won',
            ['Commands Every Institutional Resource the Lodge Controls',
             'The Entity\'s Preferred Point of Contact',
             'Will Sacrifice Any Individual Member Without Hesitation'],
            ['Great (+4) Lore','Good (+3) Provoke',
             'Good (+3) Deceive','Fair (+2) Will'],
            3,['<b>Ritual in motion:</b> Once per scene, invoke a '
               'supernatural entity or ritual already active to create '
               'a situation aspect with a free invoke.',
               '<b>Institutional cover:</b> When the Lodge Master '
               'is accused without physical evidence, '
               'the accusation itself becomes the scandal.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock("Empire's Occult Agent",'Major NPC',
            'Crown Authority and Official Deniability',
            'Has Done Worse in Service of Less',
            ['The Colonial Methods Work Here Too',
             'The File on These Investigators Is Current',
             'Will Not Be Stopped by Any Law They Helped Write'],
            ['Great (+4) Fight','Great (+4) Deceive',
             'Good (+3) Investigate','Fair (+2) Contacts'],
            3,['<b>Crown authority:</b> Once per scene, invoke Crown '
               'authority to compel a local official\'s cooperation — '
               'the official acts; consequences fall on the agent later, '
               'if at all.',
               '<b>Active surveillance:</b> The agent knows the '
               'investigators\' current location within two exchanges '
               'of them arriving anywhere public.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Alienist With Questionable Methods','Major NPC',
            'Licensed to Commit Anyone',
            'The Ends Justify the Means',
            ['The Asylum Is a Fortress',
             'Four Professional Signatures Already in Pocket',
             'Has Committed Three People This Month for the Lodge'],
            ['Superb (+5) Academics','Great (+4) Will',
             'Good (+3) Provoke','Good (+3) Resources'],
            3,['<b>Commitment order:</b> Can have a PC committed '
               'with a successful Academics overcome vs. their Rapport. '
               'Escape requires a full challenge.',
               '<b>Professional standing:</b> Any challenge to their '
               'diagnosis requires matching professional credentials '
               'or a Will overcome at difficulty 4.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('The Collector','Major NPC',
            'Every Specimen Has a Price',
            'The Collection Is Never Complete',
            ['Rooms That Don\'t Exist on the Plans',
             'Has Obtained Things That Should Have Been Destroyed',
             'The House Itself Is Part of the Collection'],
            ['Superb (+5) Resources','Great (+4) Lore',
             'Good (+3) Investigate','Good (+3) Contacts'],
            3,['<b>Prepared house:</b> Once per scene, reveal a '
               'pre-prepared trap or barrier in any room — '
               'situation aspect with two free invokes.',
               '<b>Acquisition network:</b> Knows the provenance '
               'and current location of every significant occult '
               'artefact that has moved through London in twenty years.'],S)
    ]))

    story+=sec('Entities Beyond Classification',S)
    story.append(body(
        'The most dangerous encounters in the Gaslight Chronicles are '
        'not with people who have made bad choices, but with things '
        'that do not operate within human frameworks of choice at all. '
        'These entities require different approaches — understanding '
        'their nature before engagement, not during.',S))

    story.append(sb(
        'THE KEY RULE FOR ENTITIES',
        [(False,'Conventional attacks do not work on the Eldritch '
                'Manifestation unless the character invoking the attack '
                'has an aspect or situation aspect that represents '
                'genuine understanding of its nature. "I have a pistol" '
                'does not qualify. "I have translated the original summoning '
                'text and know what it is trying to reach" does.'),
         (False,'This is not a puzzle to be solved once. Each '
                'manifestation has a specific nature. The investigators\' '
                'session zero characters may not have that knowledge. '
                'Finding it is part of the work of the case.')],S))

    story.append(sp(8))
    story.append(KeepTogether([
        StatBlock('Eldritch Manifestation','Major NPC',
            'Not Entirely Present in This Space',
            'Responds to Belief, Not Physics',
            ['Has Been Here Much Longer Than the Building',
             'The City\'s Collective Belief Maintains It',
             'Does Not Experience Damage the Way Living Things Do'],
            ['Superb (+5) Will','Great (+4) Provoke',
             'Good (+3) Notice'],
            4,['<b>Belief resistance:</b> Conventional attacks require '
               'invoking an aspect representing genuine understanding '
               'of its nature — without this, they cause no stress.',
               '<b>Structural presence:</b> The manifestation can '
               'occupy any zone with a surface — wall, floor, ceiling — '
               'and cannot be forced out of a zone by movement.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('The Thing in the Mirror','Major NPC',
            'Only Visible in Reflections',
            'Knows Your Deepest Shame',
            ['Can Reach Through Any Reflective Surface',
             'Follows Its Target Across All Locations',
             'Has Been Watching for Longer Than the Investigation'],
            ['Superb (+5) Provoke','Great (+4) Stealth',
             'Good (+3) Fight','Good (+3) Deceive'],
            4,['<b>Mirror range:</b> Attacks from any zone containing '
               'a mirror, window, or still water. Covering every '
               'reflective surface in a zone removes this capability.',
               '<b>Personal knowledge:</b> Once per scene, the Thing '
               'states one true fact about a target character\'s '
               'most protected secret — the target must '
               'Will overcome at difficulty 3 or take a mental stress.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('The Hound of the Fog','Major NPC',
            'Size of a Horse, Made of Shadow',
            "Only Appears in Thick Fog",
            ["The Master's Will Made Flesh",
             'Cannot Be Tracked After the Fog Clears',
             'Has Never Failed a Commission'],
            ['Superb (+5) Fight','Great (+4) Athletics',
             'Great (+4) Stealth','Good (+3) Notice'],
            5,['<b>Fog mastery:</b> In fog zones, gains +2 to all '
               'attacks and cannot be targeted by Shoot — '
               'the shooter cannot identify a clear target.',
               '<b>Commission:</b> The Hound has been sent by someone. '
               'Driving it off does not end the commission. '
               'The commission ends when the master is dealt with.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('The Resurrected Thing','Major NPC',
            'Assembled From Multiple Donors',
            'The Stitches Are Visible and Fresh',
            ['Stronger Than Any Living Person',
             'Feels Nothing the Surgeon Didn\'t Build In',
             'Remembers Fragments From Each Donor'],
            ['Superb (+5) Fight','Superb (+5) Physique',
             'Fair (+2) Will'],
            6,['<b>Composite endurance:</b> The first taken-out result '
               'inflicts a severe consequence instead of removal — '
               'only a second taken-out removes it from the scene.',
               '<b>Donor fragments:</b> Once per scene, the Thing '
               'speaks a fragment from one of its donors\' memories — '
               'something true, something specific, something '
               'the investigators should not know it knows.'],S)
    ]))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CH 3 — CREATING YOUR CHARACTERS
    # ════════════════════════════════════════════════════════════════════════
    story+=ch('Creating Your Characters',S)

    story.append(body(
        'You are the people who know what is happening and have not been '
        'stopped from knowing yet. You have professional standing, '
        'social connections, occult knowledge, or some combination '
        'of all three. You have seen things you cannot report '
        'through official channels and have been making decisions '
        'about what to do with that knowledge ever since.',S))

    story+=sec('The First Questions',S)
    story.append(body(
        'Answer three before writing a single aspect. '
        'These are not warm-up questions. They are the questions '
        'that determine what your character is protecting and '
        'what they are afraid of, which in this setting '
        'are usually the same thing.',S))

    questions = [
        'What did you witness that the official record says didn\'t happen, and who told you to forget it?',
        'What case or investigation did you abandon, and why does it still follow you?',
        'What is the nature of your gift or affliction, and who else in your family had it?',
        'What do you know about the Lodge that its members don\'t know you know?',
        'What did you have to become to survive something that should have killed you?',
        'What entity first made contact with you, and what has it asked for that you have still not given?',
        'What would make you go to the press, and what is stopping you right now?',
        'What colonial act committed in the Empire\'s name did you witness that no official record acknowledges?',
        'What did the séance show you about your own future that you have since been attempting to make untrue?',
        'What were you doing the night the gap in your memory begins, and who else was present at the start of it?',
        'What is the one variety of supernatural phenomenon you\'ve never encountered, and why does that matter to you?',
        'What does the Lodge know about you that your allies do not, and what did they give you for telling them?',
    ]
    for q in questions:
        story.append(Paragraph(f'• <i>{q}</i>',S['bullet']))

    story+=sec('Aspects',S)

    aspect_guide = [
        ('High Concept',
         'What you are in the world of investigations and occult society. '
         'It should contain a tension between your official standing and '
         'what you actually know. '
         '<i>Physician to the Poor Who Has Seen What Causes Their Ailments. '
         'Investigative Journalist With a Source Inside the Lodge. '
         'Society Medium Whose Gift Is Genuine and Getting Worse.</i>'),
        ('Trouble',
         'The thing that makes every case more complicated. In this setting '
         'the best Troubles are structural — the Lodge has something on you, '
         'the exposure changes you, the thing that contacted you has not '
         'stopped. '
         '<i>My Research Has Gone Further Than I Can Come Back From. '
         'I Have Seen Through the Veil and It Has Seen Through Me. '
         'The Entity Calls Me by the Name I Have Never Told Anyone.</i>'),
        ('The Affliction',
         'The third aspect names your Affliction — the specific way '
         'contact with the supernatural has marked you. '
         'See the Witness Track chapter for the mechanical details. '
         '<i>The Creature Left Something In My Mind. '
         'Three Months of Memory Are Gone — Selectively Gone. '
         'My Reflection Has Stopped Mirroring Me Exactly.</i>'),
        ('Phase Duo',
         'The fourth and fifth aspects come from two shared '
         'investigations with other player characters. '
         'What happened in the field together, and what does '
         'the other person know about you that is not in any report?'),
    ]
    for (label,text) in aspect_guide:
        story.append(body(f'<b>{label}.</b> {text}',S))
        story.append(sp(4))

    story+=sec('Skills',S)
    story.append(body(
        'Standard Fate Condensed skills with the following notes '
        'for the Gaslight Chronicles context.',S))

    skill_notes = [
        ('Lore','Covers occult knowledge as a primary application. '
         'High Lore means genuine understanding of the entities, '
         'the lodges\' working methods, the relevant ritual traditions, '
         'and the specific taxonomies that the investigators have developed '
         'through fieldwork. It is also the skill used for Exorcism Rites '
         'and Forbidden Rites stunts.'),
        ('Investigate','The primary working skill of the setting. '
         'It governs crime scene analysis, intelligence gathering, '
         'case construction, and the practical work of making '
         'inadmissible evidence admissible through other means.'),
        ('Contacts','Split in this setting between Society Connections '
         '(upper class, clubs, institutions) and Street Knowledge '
         '(underworld, docks, rookeries). A character with high Contacts '
         'and no specification has access to both but advantage in neither.'),
        ('Will','Defends against the full range of supernatural mental '
         'assault — mesmerism, entity contact, the Witness Track, '
         'and the specific horror of being told true things '
         'about yourself by something that should not know them.'),
        ('Resources','Represents social capital as much as financial '
         'capital. What you can access depends on whose world you '
         'can credibly claim membership in.'),
    ]
    for (name,desc) in skill_notes:
        story.append(body(f'<b>{name}.</b> {desc}',S))
        story.append(sp(4))

    story+=sec('Stunts',S)
    story.append(body(
        'Characters start with three free stunts. '
        'The Gaslight Chronicles stunts are built around investigation, '
        'social navigation, occult capability, and the specific '
        'mechanics of engaging the supernatural directly.',S))

    stunts = [
        ('Deductive Mind','Investigate',
         '+2 to create advantages when observing a person or crime scene '
         'with at least one minute of study.'),
        ('Society Connections','Contacts',
         '+2 to overcome when seeking information within the upper classes, '
         'clubs, or government institutions.'),
        ('Street Knowledge','Contacts',
         '+2 to overcome when seeking information from the criminal '
         'underworld, dockworkers, or the lower city.'),
        ('Iron Nerve','Will',
         '+2 to defend against mental stress from witnessing supernatural '
         'events, aberrant phenomena, or profound horror.'),
        ('Occult Library','Lore',
         '+2 to overcome when researching arcane texts, identifying '
         'occult symbols, or recognising ritual patterns from their '
         'physical evidence.'),
        ('Pugilist','Fight',
         '+2 to attack with Fight when your opponent is unarmed '
         'or at a disadvantage of reach.'),
        ('Disguise','Deceive',
         '+2 to overcome when adopting a false identity in a social '
         'class you have personally observed at close quarters.'),
        ('The Listening City','Notice',
         '+2 to overcome when gathering information by eavesdropping '
         'in public spaces, carriages, or club rooms.'),
        ('Steady Hand','Shoot',
         '+2 to attack when you have at least one exchange to aim '
         'and the target is not aware of your position.'),
        ('Medical Training','Crafts',
         '+2 to create advantages or remove complications related '
         'to physical injury, poisoning, or the physical consequences '
         'of supernatural exposure.'),
        ('Psychic Barrier','Will',
         'Once per scene, force a supernatural entity to make a '
         'Will overcome at difficulty 3 to target you mentally — '
         'on a failure, it cannot affect you this scene.'),
        ('On the Case','Investigate',
         'Once per scene, ask the GM one yes/no question about a '
         'crime, scene, or person you have been able to observe '
         'for at least a few minutes.'),
        ('Face in the Crowd','Stealth',
         'Once per scene, become completely unnoticeable in a crowd — '
         'witnesses will not recall your presence, no roll required.'),
        ('Invoking the Compact','Rapport',
         'Once per scene, call upon a formal agreement, debt, or oath '
         'held over an NPC to demand one specific action.'),
        ('Exorcism Rite','Lore',
         'Once per scene, begin a ritual that, if uninterrupted for '
         'one exchange, suppresses or drives off a supernatural entity '
         'present in the zone. The entity may act to interrupt.'),
        ('Read the Room','Empathy',
         'Once per scene, identify the single most useful hidden '
         'motivation of an NPC you are currently speaking with — '
         'the GM must answer honestly.'),
        ('Anatomist','Fight',
         'Use Investigate instead of Fight when targeting a creature\'s '
         'weak point — requires prior knowledge of the creature\'s anatomy.'),
        ('Deduction','Investigate',
         'Use Investigate instead of Empathy to detect a lie.'),
        ('Deductive Leap','Investigate',
         'Once per scene, automatically discover one hidden clue '
         'or concealed fact without a roll — the GM must answer honestly.'),
        ('Forbidden Rites','Lore',
         'Use Lore to attack an entity from beyond the veil '
         'as though it were a physical weapon. '
         'Requires an aspect or situation aspect representing '
         'knowledge of the entity\'s specific nature.'),
        ('Gadgeteer','Crafts',
         'Once per scene, produce a specialised tool for the task at hand — '
         'no roll required if the tool is plausibly portable.'),
        ('Grim Resolve','Physique',
         '+2 to Physique when resisting poison, disease, '
         'or the physical effects of extended supernatural exposure.'),
        ('Iron Will','Will',
         '+2 to Will when defending against mental corruption '
         'from entities, rituals, or psychic assault.'),
        ('Shadow-Stalker','Stealth',
         '+2 to Stealth when operating in thick fog, gas-lamp shadow, '
         'or the specific darkness of Victorian back streets at midnight.'),
        ('Silver-Tongue','Rapport',
         '+2 to Rapport when dealing with the upper classes in '
         'formal or semi-formal social settings.'),
        ("Duelist's Aim",'Shoot',
         '+2 to Shoot when using a service revolver or '
         'steam-assisted weapon at close range.'),
        ('Underworld Contacts','Contacts',
         '+2 to Contacts when searching for illicit information, '
         'forged documents, or movement through the city\'s '
         'unofficial networks.'),
        ('Occult Knowledge','Lore',
         '+2 to Lore when identifying specific eldritch ritual '
         'structures, recognising entity categories, or '
         'cross-referencing incidents against Lodge archives.'),
    ]
    for (name,skill,desc) in stunts:
        story.append(KeepTogether([
            Paragraph(f'<b>{name}</b> [{skill}]',S['sub_head']),
            body(desc,S),
        ]))

    story+=sec('Extras: The Affliction',S)
    story.append(body(
        'Every character who has had direct contact with the '
        'supernatural carries an Affliction — the specific mark '
        'that contact has left. The Affliction is one of the '
        'character\'s five aspects (the third, by convention), '
        'but it operates slightly differently from standard aspects.',S))
    story.append(body(
        'The Affliction can be invoked for the standard +2 '
        'when the specific mark it represents provides an advantage — '
        'the thing that left something in your mind occasionally '
        'provides intelligence; the three months of missing memory '
        'occasionally have information your conscious self cannot access. '
        'It can always be compelled when the mark makes your situation worse.',S))
    story.append(body(
        'The Affliction\'s other function is as the Witness Track\'s '
        'anchor. See the next chapter.',S))

    affliction_examples = [
        '<i>The Creature Left Something In My Mind</i> — it communicates, occasionally helpfully, never reliably',
        '<i>Three Months of Memory Are Gone — Selectively Gone</i> — the gaps contain things other parties want',
        '<i>My Reflection Has Stopped Mirroring Me Exactly</i> — the divergence is growing',
        '<i>Something Writes Through My Hand — Better Instincts Than Mine</i> — the writing is usually correct',
        '<i>The Dreams Show What Happens Before It Does</i> — sometimes minutes early, sometimes years',
        '<i>I Hear the City\'s Dead — Not All of Them Are Quiet</i> — the volume is increasing',
    ]
    for e in affliction_examples:
        story.append(Paragraph(f'• {e}',S['bullet']))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CH 4 — THE WITNESS TRACK
    # ════════════════════════════════════════════════════════════════════════
    story+=ch('The Witness Track',S)

    story.append(body(
        'The Witness Track is the Gaslight Chronicles\' signature mechanic. '
        'It answers the question the setting keeps asking: what does it cost '
        'to know what you know?',S))

    story+=sec('What the Witness Track Is',S)
    story.append(body(
        'Every character has a Witness Track alongside their standard '
        'physical and mental stress tracks. The Witness Track has '
        'three boxes. It fills when characters are directly exposed '
        'to supernatural phenomena — not the general background '
        'of the setting, but specific encounters with entities, '
        'successful ritual operations, and genuine veil-thinning events.',S))
    story.append(body(
        'When the Witness Track fills, it does not take the character '
        'out. It changes them. Each stage of filling produces '
        'a specific mechanical effect that persists until '
        'the track is cleared.',S))

    story+=sec('Witness Stages',S)

    stages = [
        ('First Witness (1 box)',
         'The rational framework has absorbed something it was not built for. '
         'The character gains the situation aspect <i>Rationalising the Irrational</i> '
         'for the remainder of the scene. Social rolls against '
         'characters who have not witnessed what you witnessed '
         'are at -1 — you are not quite calibrated to their frame of reference.'),
        ('Second Witness (2 boxes)',
         'The exposure has left a mark that does not clear with sleep. '
         'The character must add one word to their Affliction aspect '
         '— deepening it. The Affliction can now be compelled '
         'by the GM once per session without a Fate point, '
         'in addition to its normal compel function.'),
        ('Third Witness (3 boxes)',
         'The character has been changed. Not broken — changed. '
         'The Affliction aspect is rewritten to reflect what the '
         'exposure has made them. The change is permanent unless '
         'deliberately addressed through a major milestone. '
         'The character gains one new capability — a sensory or '
         'cognitive access to something the normal human framework '
         'does not provide — and one new vulnerability to match it.'),
    ]
    for (name,desc) in stages:
        story.append(KeepTogether([
            Paragraph(name,S['sub_head']),
            body(desc,S),
        ]))
        story.append(sp(4))

    story+=sec('Recovery and the Price',S)
    story.append(body(
        'Witness stress clears between sessions if the character '
        'has had genuine rest away from occult activity. '
        'The second and third stages require more deliberate action.',S))
    story.append(body(
        '<b>Clearing the second stage</b> requires a scene of deliberate '
        'grounding — the mundane world asserting itself. '
        'A professional engagement, a social obligation, '
        'time with people who do not know what you know. '
        'The GM may compel the Affliction once during this '
        'scene without cost.',S))
    story.append(body(
        '<b>Clearing the third stage</b> requires a significant '
        'in-fiction act of reckoning — confronting what happened, '
        'what it cost, and what you are now. This is a milestone-level '
        'event. What it produces is not a return to the prior state '
        'but a new stable state that incorporates what the exposure made.',S))

    story.append(sb(
        'THE WITNESS TRACK IN PLAY',
        [(True,'When does it fill?'),
         (False,'A successful Exorcism Rite fills one box — '
                'you drove it off, but you were in contact with it. '
                'Failing to resist a supernatural Provoke fills one box. '
                'Direct entity contact of any kind fills one box. '
                'Being the instrument through which something crossed '
                'the veil fills two boxes.'),
         (True,'When does it not fill?'),
         (False,'Background weirdness does not fill the track. '
                'Being in a haunted house is not the same as '
                'having a conversation with what\'s in it. '
                'The investigators are professionals. '
                'The track fills when the professional '
                'framework stops being sufficient.')],S))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CH 5 — RUNNING AN INVESTIGATION
    # ════════════════════════════════════════════════════════════════════════
    story+=ch('Running an Investigation',S)

    story.append(body(
        'Investigations in the Gaslight Chronicles do not proceed like '
        'standard mysteries. The supernatural element means the investigator '
        'is simultaneously building a case in the conventional sense '
        'and acquiring the specific knowledge that makes '
        'the supernatural element tractable. Both are necessary. '
        'Neither is sufficient alone.',S))

    story+=sec('The Inciting Incident',S)
    story.append(body(
        'Every investigation starts with something the official '
        'record is handling incorrectly. The police have the wrong '
        'suspect. The coroner has the wrong cause of death. '
        'The institution is suppressing the anomaly. '
        'The investigators know this and are proceeding anyway.',S))

    incidents = [
        'Fourteen disappearances in six weeks from one neighbourhood — the police have a suspect; the investigators know the police are wrong',
        'Three curators with breakdowns, one missing — the museum exhibition opens in two days',
        'The séance circle has stopped being entertainment; something is responding that has no record of prior death',
        'The anonymous pamphlets contain information only Lodge members at the Fourth Circle or above should know',
        'Cross-referencing seven separate incidents across the city reveals they are steps in a single ritual — seventeen days remain',
        'The same dream is being reported across the city; the dreamers are changing their behaviour toward a common purpose',
        'A faction within the Lodge has decided the containment vault below the city should be opened — they have the access to do it',
        'Photographs taken at three separate sittings show the same figure, not present during any of the sessions',
    ]
    story+=bullets(incidents,S)

    story+=sec('Challenge Types',S)
    story.append(body(
        'The Gaslight Chronicles\' characteristic challenges. '
        'Each is a scene structure with its own primary skill, '
        'opposition, and what success and failure mean differently.',S))

    challenges = [
        ('Criminal Investigation',
         'Build a case against a suspect before evidence is destroyed, '
         'lost, or the suspect escapes into institutional protection.',
         'Investigate and Contacts vs. the suspect\'s resources '
         'and institutional resistance to an embarrassing conclusion.',
         'Case made and confrontation productive — or case incomplete '
         'and the suspect walks into a better-defended position.'),
        ('Occult Ritual (Counter)',
         'Perform the counter-ritual within the available window '
         'while the original working continues.',
         'Lore vs. the ritual\'s momentum and any active opposition. '
         'Each exchange of the original ritual adds +1 to the opposition.',
         'Ritual suppressed or redirected — or interrupted and now something '
         'has been disturbed without being completed.'),
        ('Social Navigation',
         'Obtain access, testimony, or documents from a source '
         'who is socially protected from normal investigative pressure.',
         'Rapport or Deceive vs. the source\'s social position, '
         'Lodge affiliation, and specific vulnerability to exposure.',
         'Information obtained — or relationship burned and the Lodge '
         'now knows which avenue was being explored.'),
        ('Containment',
         'Keep a supernatural entity from spreading its effect '
         'while the Exorcism Rite is prepared and performed.',
         'Will (Psychic Barrier) and Fight or Lore vs. the entity\'s '
         'expanding influence and any mundane threats it is generating.',
         'Entity contained for long enough — or entity not contained '
         'and the Witness Track fills.'),
        ('The Escape from Institutional Authority',
         'The police, the Lodge, or the Home Office has the investigators '
         'in a position where legitimate authority will be used against them.',
         'Deceive and Athletics vs. the authority\'s jurisdictional '
         'reach and the investigators\' own professional standing.',
         'Clear with evidence intact — or committed, arrested, '
         'or discredited, which is sometimes worse than arrested.'),
    ]
    for (name,what,against,stakes) in challenges:
        story.append(KeepTogether([
            Paragraph(name,S['sub_head']),
            body(f'<i>What it is:</i> {what}',S),
            body(f'<i>Against:</i> {against}',S),
            body(f'<i>Stakes:</i> {stakes}',S),
        ]))
        story.append(sp(4))

    story+=sec('Complications',S)
    story.append(body(
        'Complications arrive mid-investigation and reframe '
        'the evidence or the situation. They are not setbacks — '
        'they are the case becoming more of what it is.',S))

    complications = [
        'The ritual was completed one step early — effects begin immediately',
        'Someone on the investigation is compromised and has been reporting the party\'s movements',
        'The evidence points to a member of the group\'s own social circle',
        'Something previously contained in the location is no longer contained',
        'The creature is not hostile — it appears to be waiting for something',
        'The Lodge member being questioned is the Lodge\'s informant on the party',
        'The body was moved — this is not where it happened',
        'An anonymous letter arrives mid-scene addressed to one of the investigators',
        'The supernatural entity is cooperating with someone in the room',
        'The document that proves everything is also the document that destroys an innocent reputation',
        'A second death has occurred using the same method — while the party was at the first location',
        'The entity has a legitimate grievance against someone present and has selected one investigator as the appropriate authority to hear it',
    ]
    story+=bullets(complications,S)

    story+=sec('Rewards',S)
    story.append(body(
        'Three categories. Every investigation should produce at least one.',S))
    story.append(body(
        '<b>Evidence:</b> Documents, testimony, physical evidence. '
        'In this setting, evidence that cannot be officially filed '
        'is still evidence — it gives the investigators leverage, '
        'confirms theories, and occasionally becomes publishable '
        'when the right ally reaches the right position.',S))
    story.append(body(
        '<b>Knowledge:</b> Understanding of the entity, the ritual, '
        'the Lodge\'s actual objective. In combat terms, '
        'knowledge is what makes the Eldritch Manifestation '
        'attackable. In case terms, it is what turns '
        'a series of anomalies into a theory.',S))
    story.append(body(
        '<b>Relationships:</b> The grounded life that makes '
        'the work sustainable. The reformed inspector, the '
        'sympathetic journalist, the street child who knows '
        'where the tunnels go. The relationships are '
        'what the investigators have instead of official standing, '
        'and they are worth maintaining.',S))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════════════
    # CH 6 — THE SEVEN SITES (adventure)
    # ════════════════════════════════════════════════════════════════════════
    story+=ch('The Seven Sites',S)

    story.append(body(
        'The Seven Sites is a three-investigation chain built around '
        'two of the Gaslight Chronicles\' current issues — the missing '
        'curator and the spreading anonymous pamphlets — and the '
        'impending issue they connect to: a ritual with a calendar '
        'that is seventeen days from completion.',S))
    story.append(body(
        'The chain is designed to be run sequentially, with the '
        'break between investigations allowing the investigators '
        'to pursue their own threads. What they discover in '
        'Investigation One determines what they know going into '
        'Investigation Two. The shape of Investigation Three '
        'depends entirely on which faction they have '
        'made enemies of.',S))

    story+=sec('The Named',S)
    story.append(body('These NPCs appear across all three investigations.',S))

    story.append(KeepTogether([
        StatBlock('Scholar Ambrose Vane','Major NPC — Ally',
            'Made the Connection; Terrified of Being Right',
            'My Published Theories Are Correct — That\'s the Problem',
            ['Has Identified the Pattern No One Else Has Found',
             'Cannot Go to the Authorities with This',
             'The Lodge Has Noticed His Research'],
            ['Great (+4) Lore','Good (+3) Investigate',
             'Good (+3) Academics','Fair (+2) Will'],
            3,['<b>Pattern recognition:</b> Ambrose can identify '
               'the ritual site of a new incident from description alone '
               '— once per investigation.',
               '<b>Published record:</b> His publications, if they reach '
               'the right readers, are the most compelling evidence '
               'the investigators can produce without Lodge access.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Archaeologist Vivienne Moorcroft','Major NPC — In Danger',
            'The Missing Curator — Last Seen on the Basement Stairs',
            'I Know What I Found and I Know What It Means',
            ['Has Been Inside the Exhibition Since Three Days Before Opening',
             'Made Notes the Lodge Cannot Find',
             'Has Not Slept in Sixty Hours and Is Still Thinking'],
            ['Great (+4) Lore','Good (+3) Investigate',
             'Fair (+2) Empathy','Fair (+2) Athletics'],
            2,['<b>Field knowledge:</b> Vivienne knows the provenance '
               'of every artefact in the exhibition and what their '
               'proximity means to anyone who has read the original '
               'excavation reports.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Grand Master Cornelius Blackwood','Major NPC — Antagonist',
            'Called the Meeting; Won\'t Say Why',
            'The Lodge Has Eyes in Every Institution',
            ['Has Held This Position for Twenty-Three Years',
             'Believes the Ritual Must Be Completed for Good Reasons',
             'Will Sacrifice Anyone Below the Third Circle'],
            ['Superb (+5) Lore','Great (+4) Will',
             'Good (+3) Provoke','Good (+3) Contacts'],
            3,['<b>Institutional reach:</b> Once per investigation, '
               'Blackwood triggers an institutional complication '
               'against the party — a report to Scotland Yard, '
               'an eviction from premises, a retraction of '
               'a previously cooperative witness.',
               '<b>Third Circle knowledge:</b> Blackwood knows '
               'the ritual\'s actual purpose. He is not lying '
               'about its necessity. He is wrong about its safety.'],S)
    ]))
    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Lodge Member Dorian the Condemned','Major NPC — True Believer',
            'Already Begun the First Unlocking',
            'I Have Made Compacts I Cannot Undo',
            ['Believes the Entities Should Not Be Contained',
             'Has Access the Inner Circle Doesn\'t Know He Has',
             'Is Three Steps Ahead of Everyone and Knows It'],
            ['Great (+4) Lore','Good (+3) Deceive',
             'Good (+3) Will','Fair (+2) Fight'],
            3,['<b>Containment access:</b> Dorian can open any '
               'lock in the Lodge\'s system without triggering '
               'the internal alert — he installed the alert.',
               '<b>True believer\'s conviction:</b> Once per scene, '
               'Dorian\'s genuine certainty creates a free situation '
               'aspect — the most dangerous arguments are the '
               'ones that are partly right.'],S)
    ]))

    story.append(sp(6))
    story.append(KeepTogether([
        StatBlock('Alienist Lucian Undertow','Major NPC — Being Silenced',
            'Has Forty Case Files of Identical Dreams',
            'My Rational Framework Cannot Accommodate What I Have Witnessed',
            ['Being Pressured to Stop Treating the Dream Patients',
             'The Patients\' Dreams Are Changing Toward a Common Purpose',
             'Will Not Destroy the Files'],
            ['Great (+4) Academics','Good (+3) Empathy',
             'Fair (+2) Will','Fair (+2) Investigate'],
            2,['<b>Dream catalogue:</b> Undertow\'s files contain '
               'the location of the shared dream destination — '
               'which is also the final ritual site.',
               '<b>Professional standing:</b> If the investigators '
               'can reach him before the Lodge\'s alienist '
               'has him committed, his testimony is credible '
               'to a specific inquiry.'],S)
    ]))

    story.append(PageBreak())

    # ── INVESTIGATION ONE ─────────────────────────────────────────────────────
    story+=sec('Part I: The Missing Curator',S)

    story.append(fiction(
        'The Metropolitan Museum\'s new exhibition opens in two days. '
        'The lower galleries have been sealed since yesterday morning '
        'when a junior cataloguer reported the smell from the basement '
        'stairs and was told to take the rest of the day off. '
        'The museum\'s director has been in a meeting that started '
        'four hours ago and has not ended. Vivienne Moorcroft '
        'has not come up from the basement since she went down '
        'at nine o\'clock Tuesday night.',S))

    story.append(body(
        '<b>Inciting Incident:</b> The investigators have a connection '
        'to Vivienne — professional, personal, or institutional — '
        'or they are the people Scholar Ambrose Vane has contacted '
        'because he has been tracking the artefact provenance '
        'from three different excavation reports and cannot '
        'explain his conclusions to anyone who will listen.',S))
    story.append(body(
        '<b>What is happening in the basement:</b> The lower gallery '
        'contains artefacts from three separate excavations whose '
        'original field notes Ambrose has been cross-referencing. '
        'The notes indicate the artefacts were found at sites '
        'equidistant from each other — three of seven points '
        'in a ritual configuration that has been laid out across '
        'the city over the course of the past four months. '
        'The proximity of all three in the gallery has caused '
        'an effect the engineers are attributing to gas pipe '
        'failure. It is not gas pipe failure.',S))
    story.append(body(
        '<b>Vivienne\'s condition:</b> She is in the lower gallery. '
        'She has been there for thirty-six hours. She is conscious, '
        'she has been taking notes, and she has filled three notebooks '
        'with documentation that represents the most comprehensive '
        'field account of active ritual archaeology produced '
        'in the nineteenth century. She does not want to leave '
        'until she has finished. What she is documenting '
        'does not want her to leave at all.',S))

    story.append(sb(
        'THE EXHIBITION\'S PROBLEM',
        [(True,'What the artefacts are doing'),
         (False,'Three ritual objects from three traditions — Egyptian, '
                'Mesopotamian, pre-Roman British — placed within '
                'forty feet of each other for the first time. '
                'Each was inert in its original location. '
                'In proximity, they are completing a circuit '
                'that their original users never intended to complete '
                'in this combination.'),
         (True,'Who knows'),
         (False,'Vivienne knows and has been documenting it. '
                'Ambrose knows from the field notes. '
                'The Lodge knows — Blackwood has a man '
                'on the exhibition committee. The Lodge '
                'is allowing it to proceed because '
                'the circuit is one of the seven sites.'),
         (True,'What to do about it'),
         (False,'Separating the artefacts breaks the circuit '
                'immediately. This requires access to '
                'a sealed area in a building the investigators '
                'have no authority to enter — and doing it '
                'two days before the museum\'s largest '
                'opening of the decade.')],S))

    story.append(sp(8))
    story.append(body(
        '<b>Objective:</b> Reach Vivienne. Get her out. '
        'Secure her notebooks. Secondary: determine the artefacts\' '
        'role in the larger ritual and whether breaking this circuit '
        'advances or delays the Lodge\'s calendar.',S))
    story.append(body(
        '<b>Fodder:</b> Museum security — genuinely just '
        'doing their jobs, genuinely in the way. '
        'The Lodge Enforcer posted in the building '
        'is a different problem.',S))
    story.append(body(
        '<b>Setpiece — The Lower Gallery:</b> The effect in the basement '
        'is not immediately hostile. It is immediately wrong '
        'in the specific way that fills one Witness box on entry '
        'for any investigator without Iron Nerve. '
        'Vivienne is at the far end. She will not leave '
        'until she has finished her sentence. '
        'The thing that does not want her to leave '
        'has been patient for thirty-six hours and is '
        'becoming less patient.',S))
    story.append(body(
        '<b>Setpiece — The Lodge Enforcer:</b> Positioned upstairs, '
        'reporting to Blackwood. Has orders to ensure '
        'the exhibition opens on schedule. '
        'Does not know about Vivienne specifically. '
        'Will know the investigators are here within '
        'one exchange of their entering the building.',S))
    story.append(body(
        '<b>Setpiece — Ambrose\'s Evidence:</b> If the investigators '
        'reach Vivienne and recover her notebooks, '
        'combined with Ambrose\'s field note analysis, '
        'the ritual calendar becomes legible. '
        'Seventeen days. Seven sites. The final site '
        'is not yet identified — but six are now mapped.',S))
    story.append(body(
        '<b>Victory:</b> Vivienne recovered, notebooks secured, '
        'and six of seven ritual sites identified.',S))
    story.append(body(
        '<b>Defeat:</b> Vivienne remains. The Lodge secures her notebooks. '
        'The exhibition opens on schedule. The investigators know '
        'the ritual is happening and do not know where it ends.',S))
    story.append(body(
        '<b>Reward:</b> Vivienne\'s testimony and notebooks. '
        'The ritual calendar and six site locations. '
        'One Witness Track box filled for anyone who '
        'spent more than two exchanges in the lower gallery. '
        'And Ambrose Vane as an ongoing ally who can identify '
        'the seventh site — given enough data.',S))

    # ── INVESTIGATION TWO ─────────────────────────────────────────────────────
    story+=sec('Part II: The Calendar of Incidents',S)

    story.append(fiction(
        'Six sites identified. Thirteen days remaining. '
        'The seventh site is the one the ritual builds toward — '
        'the location where what the Lodge has been preparing '
        'for sixteen days will be used. Alienist Lucian Undertow '
        'has forty case files of patients dreaming the same location. '
        'He is currently under review by the Medical Board, '
        'initiated by a complaint from an anonymous colleague. '
        'The complaint was filed two days ago. '
        'He has not told anyone about the files.',S))

    story.append(body(
        '<b>Inciting Incident:</b> Ambrose has cross-referenced '
        'Vivienne\'s notebooks with his own field notes and '
        'confirmed: six sites are accounted for, including the '
        'museum basement. The seventh is the ritual\'s terminus '
        'and it must be somewhere the Lodge has had access '
        'to for the full seventeen-day period. '
        'The only candidate from the known Lodge '
        'real estate that matches the geometry is the '
        'sanatorium in outer London. '
        'The same sanatorium where Undertow has been treating '
        'the dream patients.',S))
    story.append(body(
        '<b>What Undertow knows:</b> Forty patients across twelve '
        'parishes have reported the same dream: a door, a sound, '
        'a figure. In the most recent sessions, the figure has '
        'been speaking. In the sessions from the last four days, '
        'the figure has been giving directions. The directions '
        'lead to a specific address in the sanatorium\'s '
        'basement. Undertow has not gone to that address. '
        'He has, however, drawn a map.',S))
    story.append(body(
        '<b>What the Medical Board review means:</b> The Lodge '
        'has initiated the review to discredit Undertow before '
        'his files become relevant evidence. The review '
        'will conclude within five days. If Undertow is '
        'found unsound — which the Lodge\'s alienist has '
        'the signatures to achieve — his files '
        'become the property of the sanatorium. '
        'The Lodge owns the sanatorium.',S))

    story.append(sb(
        'THE TWO TIMELINES',
        [(False,'The ritual calendar: thirteen days. The Medical Board '
                'review: five days. The investigators have until '
                'the review concludes to get Undertow\'s testimony '
                'into the right hands. After that, the testimony '
                'exists but is officially from a committed alienist '
                'with a formal unsound finding.'),
         (False,'These timelines are not accidentally aligned. '
                'The Lodge timed the review to compromise '
                'the files before the investigators could '
                'find Undertow. Someone told the Lodge '
                'the investigators were looking for the seventh site.')],S))

    story.append(sp(8))
    story.append(body(
        '<b>Objective:</b> Reach Undertow before the review concludes. '
        'Secure his files. Identify the seventh site. '
        'Secondary: determine which faction within the Lodge '
        'initiated the review — Blackwood\'s containment faction '
        'or Dorian\'s liberation faction — which changes '
        'what the ritual is for.',S))
    story.append(body(
        '<b>The sanatorium\'s specific problem:</b> The Alienist With '
        'Questionable Methods is the facility\'s senior physician. '
        'He is not the one who filed the complaint against Undertow — '
        'but he has four signatures already prepared for '
        'a second commitment order if anyone without '
        'credentials arrives asking questions about a patient.',S))
    story.append(body(
        '<b>Setpiece — The Medical Board:</b> A formal professional '
        'setting in which the investigators\' own credentials '
        'determine what access they have. A physician in '
        'the group can challenge the methodology. A journalist '
        'can threaten publication. Anyone else needs '
        'a social connection inside the Board.',S))
    story.append(body(
        '<b>Setpiece — Undertow\'s Location:</b> He is not at '
        'the sanatorium. He is at his private consulting rooms, '
        'which have been broken into once already this week. '
        'The thing that has been visiting his dream patients '
        'knows where he is. It is currently more interested '
        'in the investigators than in him.',S))
    story.append(body(
        '<b>Setpiece — Dorian\'s Approach:</b> Dorian contacts '
        'one investigator directly. He wants the same thing '
        'they want: the seventh site\'s location. '
        'He does not want to stop the ritual. '
        'He wants to complete it before Blackwood can '
        'use it for the Lodge\'s containment objective. '
        'His argument is not entirely wrong. His solution '
        'is catastrophic in a different way.',S))
    story.append(body(
        '<b>Victory:</b> Undertow\'s files secured, seventh site identified. '
        'The Witness Track fills one box for anyone who spends '
        'an exchange in the dream location during this investigation.',S))
    story.append(body(
        '<b>Defeat:</b> Undertow is committed. Files become Lodge property. '
        'The investigators know the ritual calendar and '
        'do not know where it ends. '
        'With eight days remaining.',S))
    story.append(body(
        '<b>Reward:</b> The seventh site location. '
        'Undertow as a protected ally or a lost resource. '
        'And the question of whether to warn Blackwood '
        'that Dorian has already opened the first lock.',S))

    # ── INVESTIGATION THREE ───────────────────────────────────────────────────
    story+=sec('Part III: Below the City',S)

    story.append(fiction(
        'The seventh site is below the sanatorium. '
        'Below the sanatorium is a vault that does not appear '
        'on any public plan and appears on one private one: '
        'the Lodge\'s founding document, which is a forgery, '
        'but which was forged by someone who knew the vault '
        'was there because they had been in it. '
        'Dorian the Condemned has been in it twice. '
        'He opened the first lock eight days ago. '
        'The second lock requires the specific thing '
        'that the seventeen-day ritual has been building toward. '
        'The ritual completes tonight.',S))

    story.append(body(
        '<b>Inciting Incident:</b> The investigators have the site. '
        'They have three hours before the ritual calendar reaches '
        'its completion. Blackwood\'s faction is moving on the '
        'sanatorium from the east with the objective of '
        'completing the ritual and using its product '
        'for the Lodge\'s containment working. '
        'Dorian is already inside with the objective of '
        'completing the ritual and opening the second lock. '
        'The investigators are the only party whose objective '
        'is to interrupt the ritual entirely.',S))
    story.append(body(
        '<b>What is in the vault:</b> The Lodge has been calling it '
        'the Threshold — a stable point of veil contact, '
        'maintained since the eighteenth century, that '
        'the Lodge has been using to keep a specific entity '
        'in contact with the upper city. The entity has been '
        'the Lodge\'s source of foreknowledge for three generations. '
        'It has also been the Lodge\'s source of the specific '
        'corruption that has made three of its senior members '
        'act in ways the founding compact explicitly prohibited. '
        'Blackwood knows this. He believes the corruption is manageable. '
        'Dorian believes the compact was wrong.',S))
    story.append(body(
        '<b>What the entity is:</b> The GM decides before this '
        'investigation. It is old in the way that the city\'s '
        'foundations are old. It has been in contact with '
        'the Lodge for a hundred and forty years and has '
        'developed, over that time, specific preferences '
        'and specific leverage. It does not experience '
        'the compact as a captivity. It experiences it '
        'as a relationship, and it has opinions about how '
        'the relationship should proceed.',S))

    story.append(sb(
        'THREE POSSIBLE ENDINGS',
        [(True,'The ritual is interrupted'),
         (False,'The Threshold collapses without the ritual\'s '
                'completion. The entity is separated from '
                'its London anchor. The Lodge loses its '
                'foreknowledge source. Dorian loses his '
                'liberation objective. Blackwood loses '
                'his containment working. What was being '
                'contained by the Lodge\'s misaligned compact '
                'is now uncontained — but also no longer '
                'channelled through the Lodge\'s specific corrupting '
                'relationship. The investigators have created '
                'a problem and solved a worse problem.'),
         (True,'Blackwood completes the ritual'),
         (False,'The containment working succeeds. The entity\'s '
                'access to London is formalised in a new compact '
                'with better terms — Blackwood\'s terms. '
                'The Lodge\'s foreknowledge continues. '
                'The corruption continues. The investigators '
                'are now the Lodge\'s most significant loose end.'),
         (True,'Dorian completes the ritual'),
         (False,'The second lock opens. What the vault was maintaining '
                'as a stable contact point becomes something else — '
                'not a breach in the catastrophic sense, '
                'but a permanent thinning at this location. '
                'The entity is not hostile. It is also '
                'not constrained. The next campaign '
                'begins here.')],S))

    story.append(sp(8))
    story.append(body(
        '<b>Objective:</b> Reach the vault before the ritual completes. '
        'Decide which outcome to pursue.',S))
    story.append(body(
        '<b>Setpiece — The Approach:</b> The sanatorium has been '
        'locked down. Blackwood\'s people are on the perimeter. '
        'The street children who know every sewer grate in '
        'the city can get the investigators in from below '
        'if the investigators have built that relationship. '
        'If they haven\'t, this is the constraint the missing '
        'relationship creates.',S))
    story.append(body(
        '<b>Setpiece — Dorian\'s Last Argument:</b> Dorian is '
        'in the vault when the investigators arrive. '
        'He has the ritual\'s final component and one '
        'exchange before he can use it. He will spend '
        'that exchange talking. His argument is: the Lodge\'s '
        'compact has been corrupting its members for '
        'a hundred and forty years, and the investigators '
        'are proposing to let that continue. He is not wrong '
        'about the corruption. He is wrong about the solution '
        'in ways he cannot see because he has been '
        'inside the Lodge for twenty years.',S))
    story.append(body(
        '<b>Setpiece — The Entity Speaks:</b> When the investigators '
        'are in the vault, the entity makes contact. '
        'Not through the Lodge\'s mediated channel — directly. '
        'It speaks to whoever has the most developed Affliction. '
        'It does not threaten. It proposes. '
        'The proposal is specific, personal, and '
        'probably the best offer the character has received '
        'in the setting so far. The GM has decided '
        'what the entity wants. This is where it asks.',S))
    story.append(body(
        '<b>Reward:</b> Whatever the investigators chose, they changed '
        'the city\'s occult infrastructure. Every faction\'s '
        'position is different. The Witness Track fills '
        'for any investigator who received the entity\'s '
        'direct contact. And something in London — '
        'in the specific deep city under the streets — '
        'now knows who these investigators are and '
        'what they decided when they had the choice.',S))

    story.append(ThinRule())
    story.append(sp(10))
    story.append(Paragraph(
        'The gas lamps burn all night. The fog comes in from the Thames. '
        'The veil is thin where it has always been thin, '
        'and thin now in one more place than it was before. '
        'The city continues.',S['tagline']))

    story.append(PageBreak())

    # ── ATTRIBUTION ──────────────────────────────────────────────────────────
    story+=ch('Attribution',S)

    attrs=[
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
    for (title,text) in attrs:
        story.append(KeepTogether([
            Paragraph(title,S['section_head']),
            body(text,S),
        ]))
        story.append(sp(6))

    story.append(ThinRule())
    story.append(sp(8))
    story.append(Paragraph(
        'Fate™ is a trademark of Evil Hat Productions, LLC. '
        'The Powered by Fate logo is © Evil Hat Productions, LLC and is used with permission. '
        'This project is not affiliated with, endorsed by, or sponsored by Evil Hat Productions, LLC.',
        S['tiny']))

    return story


def main():
    outpath='/home/claude/the_gaslight_chronicles.pdf'
    S=make_styles()
    story=build(S)

    from reportlab.platypus import ActionFlowable
    class SetChapter(ActionFlowable):
        def __init__(self,name):
            self.name=name; ActionFlowable.__init__(self)
        def apply(self,doc):
            doc.current_chapter=self.name

    final=[]
    for item in story:
        if hasattr(item,'style') and hasattr(item.style,'name'):
            if item.style.name=='chapter_title':
                final.append(SetChapter(
                    item.text if hasattr(item,'text') else ''))
        final.append(item)

    doc=GaslightDoc(
        outpath,
        leftMargin=MARGIN,rightMargin=MARGIN,
        topMargin=MARGIN+0.35*inch,
        bottomMargin=MARGIN+0.2*inch,
        title='The Gaslight Chronicles — A World of Adventure for Fate Condensed',
        author='Ogma Generator Project',
        subject='Fate Condensed Gothic cosmic horror Victorian campaign',
    )
    doc.build(final)
    print(f'Built: {outpath}')
    return outpath

if __name__=='__main__':
    main()
