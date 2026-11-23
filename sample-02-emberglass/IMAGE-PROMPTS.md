# Sample 02 · Emberglass — image list and generation prompts

Every visual in Sample 02 is currently drawn in code: a live 3D hero, CSS icon tiles
and gradient cards. This sheet lists each image that could replace or support those
visuals, with a prompt written to match the Emberglass theme.

How to use:
1. Paste the **Style anchor** after every prompt, so all images share one look.
2. Add the **Avoid** list as the negative prompt, or append "Avoid: …" if your tool
   has no negative field.
3. Generate at the sizes given. Export icons as transparent PNG; everything else as
   WebP or JPG at about 80% quality.

---

## Style anchor (append to every prompt)

> Warm sunset palette of burnt orange #FF6418, amber #FF9136 and soft gold #FFC46B over deep
> ember brown #120806. Polished 3D render, soft global illumination, gentle rim light
> from a low sun behind the subject. Materials: clear amber glass, brushed warm-silver
> metal, matte sandstone pebbles, calm reflective water. Restrained glow, only small
> accent highlights. Clean, premium, calm, uncluttered. Shallow depth of field, octane
> or blender cycles look, high detail, no text.

## Avoid (negative prompt)

> text, letters, numbers, logos, watermarks, brand names, padlocks over globes, hooded
> hackers, binary code rain, matrix green, blue or purple tones, neon overload, heavy
> bloom, lens flare streaks, lightning, skulls, cartoon style, clip art, busy
> backgrounds, people's faces, distorted hands

---

## 1. Hero

The live 3D scene stays the main hero. Generate these as the poster image (shown
while the 3D loads, and used for slow devices and social sharing) and as the mobile
version.

### 1a. Hero, desktop: 2560 × 1440 (16:9)
> Wide cinematic landscape at sunset: a calm lake with low sandstone mountains on the
> horizon and soft orange clouds. On the right two-thirds of the frame, a round
> sandstone platform rises from the water. On it stands a clear glass sphere with a
> small warm amber core, circled by seven thin metallic orbit rings at different
> angles; one ring is orange. Around it on smaller round stone pads in the water stand
> six small glossy ivory-and-dark-bronze objects: a laptop, a three-unit server stack,
> an industrial gear, a network hub of linked spheres, a smartphone, and a small cloud
> shape floating higher in the sky. Fine glowing threads arc from each object into the
> glass sphere, with tiny light pulses travelling along them. A faint circular radar
> ripple spreads on the water around the sphere. The left third of the frame is calm
> sky and water, darker, left empty for headline text.

### 1b. Hero, mobile: 1170 × 2532 (9:19.5)
> Same scene as 1a, composed vertically: the top 45% is calm darkened sky left empty
> for text; the glass sphere with seven orbit rings sits in the lower-middle on its
> stone platform, with the six device objects arranged around it on stone pads, and
> the cloud shape floating above. Reflections in calm water at the bottom.

### 1c. Hero loop video (optional): 1920 × 1080, 8–10 s seamless loop
> Same scene as 1a. Slow motion: the seven rings rotate gently, light pulses travel
> along the threads into the sphere, the radar ripple sweeps once around the water,
> and the clouds drift slowly. Camera locked, subtle parallax only. Seamless loop.

---

## 2. Beyond The Obvious: pillar icons (3)

Glossy 3D icon tiles that replace the CSS tiles in the Agentic SOC / Platform / Sensor
bar. **512 × 512, transparent PNG.**

Shared icon prompt (put the subject in the brackets):
> A single glossy 3D app-icon tile: a rounded square of orange-to-amber gradient glass
> with a soft top highlight, tilted slightly toward the viewer, floating on a
> transparent background. Embossed on its face in white frosted glass: [SUBJECT].
> Soft warm drop shadow, studio lighting, minimal, centred.

| # | Pillar | [SUBJECT] |
|---|---|---|
| 2a | Agentic SOC | a friendly abstract assistant: a rounded capsule head with two small light dots, inside a circular scan ring |
| 2b | Platform | three stacked rounded layers, slightly separated |
| 2c | Sensor | a radar dish with three concentric arcs |

---

## 3. Capability cards (4)

Large hero icons for the four hover cards. **1024 × 1024, transparent PNG.** Use the
shared icon prompt from section 2, or this richer object version:

> A small premium 3D object floating on a transparent background, made of clear amber
> glass and brushed warm-silver metal, soft warm rim light, gentle shadow below:
> [SUBJECT]. Minimal, centred, no text.

| # | Card | [SUBJECT] |
|---|---|---|
| 3a | Comprehensive Infrastructure Protection | a glass shield hovering over a tiny cluster of a laptop, a server stack and a cloud |
| 3b | Security for Sensitive Data | a glass document folder sealed by a metal clasp, with a soft amber core inside |
| 3c | Multi-OS Patch Management | a metal shield with a glass patch piece fitting into a gap, small spark where it seals |
| 3d | Integrated Compliance | a metal seal medallion with a checkmark in glass, resting on three stacked document sheets |

---

## 4. Industry cards (7) + centre card

These replace the icon-on-gradient cards. Each one is a miniature diorama in the hero's
world, so all seven read as one set. **1600 × 1200 (4:3)**, leave the bottom 25%
calm for the label and "Learn More" pill.

Shared industry prompt (put the subject in the brackets):
> Miniature diorama on a round sandstone platform standing in calm sunset water, warm
> orange sky with soft clouds behind. On the platform: [SUBJECT]. A thin glowing
> amber thread rises from the scene and arcs out of frame toward the right, as if
> connected to a distant sensor. Tilt-shift miniature look, soft golden rim light,
> glossy ivory and bronze materials, no people's faces, no text or signage. Bottom
> quarter of the frame is calm water.

| # | Industry | [SUBJECT] |
|---|---|---|
| 4a | BFSI | a classical bank building with columns, a small vault door ajar, and stacked glass coins |
| 4b | Education | a small campus hall with a clock tower, an open book and a graduation cap resting on the steps |
| 4c | Government | a domed civic building with a wide staircase and two flagpoles without flags |
| 4d | Healthcare | a modern hospital wing with a rooftop helipad and a glass heart-pulse sculpture in front |
| 4e | Manufacturing | a compact factory with a robotic arm, a conveyor belt and two chimneys with soft steam |
| 4f | IT/ITES | a glass office tower beside a small data-centre block with rows of tiny server racks |
| 4g | Retail | a shopfront with an awning, shopping bags and a small delivery van |
| 4h | Centre card background (2000 × 2000) | (no objects) wide calm sunset water with a single faint radar ripple, very dark and minimal, for the "Built For Your Industry" text |

---

## 5. One Platform. One Operator. Every Endpoint.: service icons (8)

Optional upgrade from line icons. **512 × 512, transparent PNG.** Use the shared icon
prompt from section 2.

| # | Service | [SUBJECT] |
|---|---|---|
| 5a | 24×7 Threat Detection and Response | a radar sweep inside a clock face |
| 5b | Exposure Management | an eye inside a scanning frame |
| 5c | Patch and Remediation Oversight | a wrench crossing a small shield |
| 5d | Data-risk and Privileged-access Context | a key resting on a document |
| 5e | Proactive Threat Hunting | a crosshair over a magnifying glass |
| 5f | Security Posture Improvement | a gauge dial with the needle rising |
| 5g | Ongoing Security Governance | a balance scale |
| 5h | Digital Forensics and Incident Response | a fingerprint under a magnifying glass |

---

## 6. Modular by Design: module icons (11)

Keep these as line icons for now; they're small. If you want them as 3D, use the
shared icon prompt from section 2 at 256 × 256 with these subjects: EPP (shield), EDR (eye in
a scan frame), XDR (linked nodes), MDR (two figures in silhouette with a headset),
DLP (locked file), IAM (key), Patch Management (bandage on shield), Advanced Endpoint
Management (laptop with a cog), Agentic SOC (assistant capsule), Log Retention
(stacked database discs), File Security Monitoring (file with a magnifier).

---

## 7. Security That Answers To You: feature visual (choose one)

Replaces the CSS orb. **1200 × 1500 (4:5)**, placed in the right-hand column. Add the style anchor.
Add to Avoid: `glowing orbs held in hands, crystal balls`.

### 7A. Option A: The Watch (recommended)
> Dusk over a calm lake. On a tall sandstone outcrop rising from the water stands a slender, modern lighthouse made of brushed warm-silver metal and amber glass. Its lantern room holds a small warm amber core, and a single soft beam sweeps low across the water, gently lighting a few small stone islands in the distance, each with a tiny glossy device on it: a laptop, a server stack, a phone. The beam reaches them; nothing is left in the dark. A steady, watchful, reassuring mood: always on duty, there when it matters most. Low camera angle, lighthouse in the upper-middle of the frame, calm reflections below, darker edges.

### 7B. Option B: The Keystone
> A single elegant sandstone arch standing in calm sunset water. At the very top of the arch, the keystone is a block of clear amber glass with a small warm core, the one piece holding every other stone in place. Fine hairline seams show each sandstone block fitted precisely. The arch frames a soft orange horizon. Symbol of one accountable partner holding everything together. Centred composition, quiet and solid, calm reflections, darker edges.

### 7C. Option C: The Path
> A path of flat round sandstone stepping stones crosses calm sunset water from the foreground into the distance. Each stone has a thin warm amber inlay, lit one after another, leading to a low stone pavilion with a soft amber light inside, like a home waiting with the lights on. The stones are evenly spaced and firmly set, nothing missing, nothing loose. Feeling of trust earned step by step, and a partner who is there at the end of every step. Low wide-angle view from just above the water, calm reflections, darker edges.

---

## 8. Globally Recognised Cyberthreat Research

**Do not generate the award or the report cover.** Use K7's real AMTSO award image and
the real K7 Cyber Threat Monitor Report cover. Optional presentation backgrounds:

### 8a. Award plinth: 1200 × 900
> A low round sandstone plinth on dark ember-brown background with a soft amber
> spotlight from above and a faint reflection, empty, ready for an award to be
> composited on top.

### 8b. Report mock-up: 1200 × 900
> A printed A4 report standing upright at a slight angle on a sandstone surface, with
> a blank matte cover (to be replaced with the real cover), soft sunset rim light,
> dark warm background.

### 8c. Stat icons (3): 512 × 512, transparent PNG (shared icon prompt from section 2)
- 30+ Years: an hourglass
- Millions of Devices: a laptop and phone side by side
- 32 Countries: a globe with small orange points

---

## 9. Testimonials

**No generated images.** Use real customer logos or real photographs only, with
permission. Generated faces would misrepresent customers.

---

## 10. K7 for MSSPs banner (1)

Replaces the hero crop behind the MSSP banner. **2400 × 1000 (12:5)**, with the left 45%
dark and empty for text.
> Wide sunset lake landscape seen from slightly above: on the right, several small
> round sandstone islands, each holding a small glass sphere with an amber core and a
> thin orbit ring, all linked by fine glowing amber threads to one larger central
> glass sphere with seven orbit rings — a partner managing many customers' security
> from one place. Calm water reflections, soft clouds, the left side fading into dark
> ember-brown shadow for text.

---

## 11. Site-wide

| # | Image | Size | Prompt / note |
|---|---|---|---|
| 11a | Social share image (Open Graph) | 1200 × 630 | Same scene as 1a, tighter crop on the glass sphere and rings; leave the left half dark for the title to be added in design software |
| 11b | Page backdrop texture | 2560 × 1440 | Extremely blurred version of 1a (or generate: "abstract soft bokeh of warm orange and amber sunset light on deep ember brown, out of focus, no shapes") |
| 11c | Logo, favicon | — | Use the official K7 CyberSecurity brand assets. Do not generate. |

---

## Summary

| Section | Images | Priority |
|---|---|---|
| Hero (desktop, mobile, optional loop) | 2 + 1 video | High |
| Industry cards + centre background | 8 | High |
| Capability cards | 4 | High |
| MSSP banner | 1 | High |
| Accountability visual | 1 | Medium |
| Pillar icons | 3 | Medium |
| Service icons | 8 | Medium |
| Stat icons | 3 | Low |
| Research plinth / report mock-up | 2 | Low |
| Social share, backdrop | 2 | Low |
| Module icons | 11 | Optional |
| Real assets (not generated) | AMTSO award, report cover, logo, testimonials | Required |
