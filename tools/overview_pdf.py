"""Builds docs/Stellar-Impulse-Overview.pdf: the game explained without code.

Ship abilities and battle results are pulled from the game itself (tools/export-facts.mjs), so the
document always matches what the physics actually computes.  Usage:  python3 tools/overview_pdf.py
Requires: reportlab, Node.js 22+, and the DejaVu fonts (standard on most Linux systems).
"""
import json
import subprocess
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (CondPageBreak, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle)

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path('/usr/share/fonts/truetype/dejavu')
for name, file in [('Body', 'DejaVuSerif.ttf'), ('BodyItalic', 'DejaVuSerif-Italic.ttf'), ('BodyBold', 'DejaVuSerif-Bold.ttf'),
                   ('Head', 'DejaVuSansCondensed-Bold.ttf'), ('Sans', 'DejaVuSansCondensed.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold', italic='BodyItalic', boldItalic='BodyBold')

INK = colors.HexColor('#16203a')
MUTED = colors.HexColor('#5b6480')
COLD = colors.HexColor('#2a9d94')
WARM = colors.HexColor('#c9831f')
HOT = colors.HexColor('#c0392b')
PALE = colors.HexColor('#f4f1ea')

facts = json.loads(subprocess.check_output(['node', 'tools/export-facts.mjs'], cwd=ROOT))

S = {
    'title': ParagraphStyle('title', fontName='Head', fontSize=44, leading=48, textColor=INK),
    'subtitle': ParagraphStyle('subtitle', fontName='Body', fontSize=16, leading=22, textColor=MUTED),
    'h1': ParagraphStyle('h1', fontName='Head', fontSize=22, leading=26, textColor=INK, spaceBefore=6, spaceAfter=10),
    'h2': ParagraphStyle('h2', fontName='Head', fontSize=14, leading=18, textColor=WARM, spaceBefore=12, spaceAfter=4),
    'body': ParagraphStyle('body', fontName='Body', fontSize=10.5, leading=15.5, textColor=INK, spaceAfter=7, alignment=TA_LEFT),
    'lead': ParagraphStyle('lead', fontName='Body', fontSize=12.5, leading=18, textColor=INK, spaceAfter=10),
    'quote': ParagraphStyle('quote', fontName='BodyItalic', fontSize=11.5, leading=17, textColor=INK, leftIndent=14, borderPadding=(4, 0, 4, 10), spaceAfter=10),
    'bullet': ParagraphStyle('bullet', fontName='Body', fontSize=10.5, leading=15, textColor=INK, leftIndent=14, bulletIndent=2, spaceAfter=3),
    'cell': ParagraphStyle('cell', fontName='Body', fontSize=9.5, leading=13, textColor=INK),
    'cellhead': ParagraphStyle('cellhead', fontName='Head', fontSize=9.5, leading=13, textColor=colors.white),
    'note': ParagraphStyle('note', fontName='Sans', fontSize=9, leading=12, textColor=MUTED),
    'callout': ParagraphStyle('callout', fontName='Body', fontSize=10.5, leading=15.5, textColor=INK),
}

story = []
P = lambda text, style='body': story.append(Paragraph(text, S[style]))
def H1(text):
    story.append(CondPageBreak(2.6 * inch))  # never strand a section title at the bottom of a page
    story.append(Paragraph(text, S['h1']))


def H2(text):
    story.append(CondPageBreak(1.4 * inch))
    story.append(Paragraph(text, S['h2']))


def bullets(items):
    for item in items:
        story.append(Paragraph(item, S['bullet'], bulletText='•'))


def table(rows, widths, head=True, accent=INK):
    data = [[Paragraph(str(c), S['cellhead'] if head and i == 0 else S['cell']) for c in row] for i, row in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    style = [('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), 0.4, colors.HexColor('#d9d4c7')),
             ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5), ('LEFTPADDING', (0, 0), (-1, -1), 6)]
    if head:
        style += [('BACKGROUND', (0, 0), (-1, 0), accent)]
    t.setStyle(TableStyle(style))
    story.append(t)
    story.append(Spacer(1, 10))


def callout(text, color=COLD):
    t = Table([[Paragraph(text, S['callout'])]], colWidths=[6.5 * inch])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), PALE), ('LINEBEFORE', (0, 0), (0, -1), 4, color),
                           ('LEFTPADDING', (0, 0), (-1, -1), 12), ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 9)]))
    story.append(t)
    story.append(Spacer(1, 12))


# ------------------------------------------------------------------ cover
story.append(Spacer(1, 1.4 * inch))
P('Stellar Impulse', 'title')
story.append(Spacer(1, 6))
heat = Table([['', '', '']], colWidths=[1.1 * inch, 0.8 * inch, 0.5 * inch], rowHeights=[6])
heat.setStyle(TableStyle([('BACKGROUND', (0, 0), (0, 0), COLD), ('BACKGROUND', (1, 0), (1, 0), WARM), ('BACKGROUND', (2, 0), (2, 0), HOT)]))
heat.hAlign = 'LEFT'
story.append(heat)
story.append(Spacer(1, 18))
P('The game, explained without code', 'subtitle')
story.append(Spacer(1, 30))
P('<i>“Build the spaceship you’ve always wanted. Design your engines, weapons, armor, power systems, interiors, and almost anything else you can imagine. '
  'Then take your creation into a massive, to-scale solar system to explore, mine, build, and battle other players in their own spaceships.”</i>', 'lead')
P('From the Vision', 'note')
story.append(Spacer(1, 2.2 * inch))
P(f'Version: first playable foundation (rule set {facts["ruleset"]}, fingerprint {facts["fingerprint"]}). '
  f'Generated {date.today():%B %d, %Y}. Free and open source under the GNU General Public License, version 2.', 'note')
story.append(PageBreak())

# ------------------------------------------------------------------ 1
H1('1. What Stellar Impulse is')
P('Stellar Impulse is a spaceship game where the physics is real and the creativity is yours. You design a ship, '
  'decide how it looks, works and feels, and fly it in a solar system built to scale. Everyone plays by the same '
  'rules of physics, so the only way to get stronger is the way real engineers do it: collect energy and '
  'resources, and make smarter tradeoffs.', 'lead')
P('Three ideas from the Vision shape every decision:')
bullets([
    '<b>Make it yours.</b> Total freedom over your ship’s shape, layout, cockpit, displays, controls, interiors, sounds and interface. '
    'You can build your own targeting screens, warning systems and automation from the data your ship’s sensors provide.',
    '<b>Same rules.</b> Customization never changes what a ship can physically do. Speed, mass, energy, weapon output and sensor '
    'range all follow one shared rule set that is identical for every player.',
    '<b>Almost unlimited creation.</b> Instead of only unlocking a fixed list of recipes, players should eventually be able to invent '
    'their own components, processes and technologies, still bound by the same physics.',
])
callout('<b>The one-sentence version:</b> energy is the currency, physics is the referee, and your imagination decides what to build with them.')

H2('Free and open, for real')
P('Stellar Impulse is 100% free to play. Real money cannot buy ships, weapons, resources, upgrades or any competitive advantage. '
  'The code is open source under the GNU GPLv2, so anyone can read it, improve it, and host their own version.')

# ------------------------------------------------------------------ 2
H1('2. The same rules for everyone')
P('The rules define the world, its physics, its resources, and how technology scales. They are fixed, public, '
  'and the same for everyone:')
bullets([
    '<b>A to-scale solar system</b> with the Sun at its centre.',
    '<b>Real movement:</b> Newton’s laws and orbital mechanics at everyday speeds, with special relativity and time dilation taking over '
    'as ships approach the speed of light. Practical approximations are used where needed for performance and fun.',
    '<b>A fixed Sun.</b> It always produces the same energy; the closer you go, the more of it each solar panel catches.',
    '<b>300× server speed</b>, so collecting energy, processing resources and travelling between worlds happen much faster than in real life.',
    '<b>Resource extraction</b> from planets, asteroids and other bodies.',
    '<b>Defined scaling</b> for engines, weapons, armour, power, storage and every other component, with more flexibility as technology advances.',
])
H2('How the game keeps everyone honest')
P('All rules live in one place and are published as the <b>Rules file</b>. The game turns that file into a short code called a '
  '<b>fingerprint</b>, shown on the main menu. Two games can only fight each other if their fingerprints match. Anyone may '
  'change the code, but a changed rule set simply cannot join a battle with the official one.')
P('Players never type in their ship’s statistics. A design is a recipe (a ship class and a few choices), and every '
  'computer recalculates what that recipe can do using the shared physics. A design cannot claim to be stronger than its physics allows.')

# ------------------------------------------------------------------ 3
H1('3. Freedom in layers: easy to start, no ceiling')
P('Stellar Impulse should be fun for someone who knows no physics, and endlessly deep for someone who loves it. The answer is '
  'four layers of design. Every layer produces a real design that runs on the same physics, so nobody is playing a '
  '“simplified” game.', 'lead')
table([
    ['Layer', 'What you do', 'Physics you need'],
    ['1. Pick', 'Choose a ready-made ship class: Scout, Brawler, Sniper or Missile carrier.', 'None'],
    ['2. Tune', 'Move plain-language sliders such as Punch or Endurance, Armoured or Agile.', 'None'],
    ['3. Modify', 'Swap and edit individual components, with every number explained.', 'A little, learned in the game'],
    ['4. Invent', 'Design new engines, processes, recipes and automation from basic physical building blocks.', 'As much as you like'],
], [0.9 * inch, 4.0 * inch, 1.6 * inch])
line = {c['id']: dict(c['summary']) for c in facts['classes']}
P('Results are always explained in game terms, not equations. For example, straight from the game:')
bullets([f'<b>Brawler:</b> {line["brawler"]["Acceleration"]}', f'<b>Brawler:</b> {line["brawler"]["Turning"]}', f'<b>Sniper:</b> {line["sniper"]["Heat"]}'])
P('A shared blueprint library lets beginners fly brilliant designs made by experts, so knowing physics is a way to invent, '
  'never a requirement to compete.')

H2('Path 1 or Path 2?')
P('The Vision leaves open whether players should design their own systems from scratch (Path 1) or combine a massive library '
  'of detailed components (Path 2). The layered approach offers a way to have both:')
bullets([
    'Layers 1 to 3 are <b>Path 2</b>: a large, growing library of components and blueprints to pick, tune and combine.',
    'Layer 4 is <b>Path 1</b>: the tools to invent new components and processes from physical building blocks.',
    'Both sit on one physics engine, so anything invented in Layer 4 can join the library for everyone else.',
])
callout('This is a recommendation, not a decision. The choice between the paths remains with the project owner.', WARM)

H2('No free lunch')
P('Every choice trades one thing for another. In the current version, each slider is backed by real physics:')
table([['Slider', 'You gain', 'You give up']] + [
    [f'{s["left"]} / {s["right"]}', g, c] for s, g, c in zip(facts['sliders'], [
        'Thrust (oxygen burned in the nuclear exhaust)', 'Time before your armour burns through', 'Faster weapon recharge',
        'Faster cooling', 'More total speed change', 'Longer firing before overheating'], [
        'Total speed change, because the exhaust is slower', 'Acceleration, because armour is heavy', 'Mass, and some extra heat',
        'Mass, and large, fragile targets', 'Acceleration, because propellant is heavy', 'Mass, because water is heavy'])
], [1.7 * inch, 2.4 * inch, 2.4 * inch], accent=COLD)

# ------------------------------------------------------------------ 4
H1('4. Ship battles')
P('Space combat in Stellar Impulse is realistic and readable. Battles are decided by distance, heat and timing, not hit points.', 'lead')
H2('Heat is the heart of every fight')
P('Engines, lasers and railguns all turn part of their energy into waste heat. In space there is no air to carry it away: '
  'a ship can only shed heat by glowing it off its radiators. Big radiators cool you quickly, but they are large, fragile '
  'targets. Folding them away protects them, but then you heat up. A tank of water boils to soak up heat in a pinch, and a '
  'ship that gets too hot loses its weapons, then its crew.')
callout('Every battle asks the same question in a hundred ways: <b>how much heat can I afford right now?</b>', HOT)
H2('The weapons')
table([
    ['Weapon', 'How it works', 'Strength and weakness'],
    ['Laser', 'Light hits instantly. Its reach depends on mirror size, because a bigger mirror keeps the beam tight over a longer distance.',
     'Cannot be dodged, but makes a lot of heat and must burn through armour.'],
    ['Railgun', 'Fires metal slugs at 6 km/s that punch through armour.', 'Devastating up close; at long range the target simply moves out of the way.'],
    ['Missile', 'A guided rocket that chases its target and hits at kilometres per second.', 'One hit can gut a ship, but lasers can shoot missiles down.'],
    ['Point defence', 'Your lasers automatically fire at incoming missiles.', 'Spends energy and heat that could otherwise go into attacking.'],
], [1.0 * inch, 2.9 * inch, 2.6 * inch], accent=HOT)
P('Armour is tracked separately on each side of the ship, so turning a fresh face toward the enemy matters. Once armour is '
  'breached, hits damage what is inside: the crew, the reactor, the engine, the generator, the heat sink and the weapons.')

H2('Every ship has a counter')
P('Nobody designed a rock-paper-scissors table. It emerges from the physics. These are the actual results of the game’s AI '
  'pilots fighting each other with the default designs, starting 400 km apart:')
seen = set()
rows = [['Matchup', 'Winner', 'How it ended']]
for r in facts['results']:
    key = tuple(sorted([r['a'], r['b']]))
    if key in seen:
        continue
    seen.add(key)
    rows.append([f'{r["a"]} vs {r["b"]}', r['winner'], f'after {round(r["minutes"])} min: {r["cause"]}'])
table(rows, [2.2 * inch, 1.4 * inch, 2.9 * inch], accent=INK)
P('Every class wins at least one matchup and loses at least one. Brawlers survive the approach and win up close; snipers '
  'destroy anything they can keep at range; missile carriers overwhelm ships with weak point defence; scouts carry enough '
  'laser to shred missile salvos.', 'body')

# ------------------------------------------------------------------ 5
H1('5. What you can play today')
P('This first version is the <b>Arena</b>: pick a nuclear-age warship, tune it, and fight the AI or a friend. It is built on the '
  'same physics engine the full game will use.', 'lead')
for c in facts['classes']:
    block = [Paragraph(c['name'], S['h2']), Paragraph(c['role'], S['body'])]
    t = Table([[Paragraph(f'<b>{k}</b>', S['cell']), Paragraph(v, S['cell'])] for k, v in c['summary']], colWidths=[1.3 * inch, 5.2 * inch])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), 0.3, colors.HexColor('#e2ddd0')),
                           ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3)]))
    block += [t, Spacer(1, 6)]
    story.append(KeepTogether(block))

H2('Controls in a sentence')
P('You steer relative to your enemy (toward, away, circle, climb, dive, brake) and your ship turns its engine to match. '
  'Lasers and railguns fire while you hold their keys, missiles launch in salvos, and two switches decide your heat strategy: '
  'point defence on or off, and radiators extended or folded away. A help panel in the battle lists every key.')

H2('Playing with a friend')
P('One player hosts and shares a short room code; the other joins with it. If a network blocks that, the two players can '
  'exchange two text codes by chat or email instead, with no server at all. Before the battle starts, both games compare '
  'rule fingerprints and recompute each other’s ship from its design. During the battle, each player’s computer decides what '
  'happens to their own ship, and any reported hit is capped at what the attacker’s weapons could physically deliver.')

H2('Time in battle')
P('The world runs at 300× real time, which is perfect for travel and industry but would make a ten-minute dogfight last two '
  'seconds. The Arena therefore fights in real time. Making this an official rule (ships in combat with each other drop to '
  'real time) is a proposal awaiting the project owner’s decision.')

# ------------------------------------------------------------------ 6
H1('6. Where it goes next')
H2('The technology journey')
P('Players begin in a <b>Solar Punk</b> era and progress through <b>Ion</b>, <b>Nuclear</b>, <b>Antimatter</b> and <b>Beyond</b>. '
  'Technology is discovered through experimentation, research, resource gathering and invention, not a fixed tree. Research '
  'improves how close your machines come to physical limits (a better solar cell, a hotter radiator, a lighter reactor), but '
  'nothing ever passes those limits. The Arena’s ships belong to the Nuclear era.')
H2('Roadmap')
table([
    ['Step', 'What it adds'],
    ['Physics kernel (done)', 'Engines, power, heat, armour and weapons computed from one shared rule set.'],
    ['Arena (done)', 'Layer 1 and 2 ship design, AI opponents, two-player online battles.'],
    ['Deeper design', 'Layer 3 component editing, then Layer 4 invention from physical building blocks.'],
    ['The solar system on the kernel', 'The existing sandbox prototype (orbits, mining, solar energy, research) rebuilt on the same physics.'],
    ['A shared world', 'A server that runs the same physics for everyone and keeps the official record of energy and resources.'],
    ['Your own interface', 'A Home-Assistant-style system of sensors, controls, dashboards and automation built by players.'],
    ['Technology by discovery', 'Research as experimentation across the Solar Punk to Beyond eras.'],
], [2.0 * inch, 4.5 * inch], accent=COLD)
H2('Decisions for the project owner')
bullets([
    '<b>Path 1 or Path 2</b> for creation (Section 3 suggests combining them in layers).',
    '<b>Combat time:</b> should fights between ships always drop to real time, while the rest of the world runs at 300×?',
    '<b>Player-versus-player rules</b> in the shared world: safe zones near Earth, protection for offline players, or consent to fight.',
    '<b>Arena time limit:</b> currently 20 minutes, after which the ship that dealt more damage wins.',
])

# ------------------------------------------------------------------ 7
H1('7. A few words, explained')
table([
    ['Word', 'Meaning'],
    ['Delta-v (total speed change)', 'How much a ship can change its velocity before its fuel runs out. The true measure of how far it can go.'],
    ['Exhaust speed', 'How fast an engine throws out propellant. Faster means more speed change from the same fuel, but less push per unit of power.'],
    ['Radiator', 'A panel that glows heat away into space. The only way a spaceship can cool down.'],
    ['Heat sink', 'Something that soaks up heat for a while, such as water that boils away.'],
    ['Point defence', 'Lasers that automatically shoot down incoming missiles.'],
    ['Blueprint', 'A shareable ship design: the choices you made, from which anyone can recompute what the ship can do.'],
    ['Rules fingerprint', 'A short code that identifies the exact rule set. Games only fight if theirs match.'],
], [2.0 * inch, 4.5 * inch])
P('<i>“The goal is not simply to give players a large selection of things to build, but to eventually give them the tools to invent what comes next.”</i> (the Vision)', 'quote')


def decorate(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setFont('Sans', 8.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(inch, 0.6 * inch, 'Stellar Impulse: the game, explained without code')
        canvas.drawRightString(letter[0] - inch, 0.6 * inch, str(doc.page))
        canvas.setStrokeColor(WARM)
        canvas.setLineWidth(0.6)
        canvas.line(inch, letter[1] - 0.6 * inch, letter[0] - inch, letter[1] - 0.6 * inch)
    canvas.restoreState()


out = ROOT / 'docs' / 'Stellar-Impulse-Overview.pdf'
doc = SimpleDocTemplate(str(out), pagesize=letter, leftMargin=inch, rightMargin=inch, topMargin=0.9 * inch, bottomMargin=0.9 * inch,
                        title='Stellar Impulse: the game, explained without code', author='Stellar Impulse contributors',
                        subject='Non-technical overview of the Stellar Impulse game')
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
print(f'wrote {out.relative_to(ROOT)}')
