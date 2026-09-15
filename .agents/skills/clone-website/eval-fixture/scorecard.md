# clone-website — Eval Scorecard

**Date:** 2026-09-15
**Trigger:** Housekeeping sweep finding — no eval coverage existed for either project skill; `clone-website` prioritized first (drove this entire build, project headed to production).
**Fixture:** `eval-fixture/target.html` — synthetic static page with 4 planted traps, read as source (no live browser session; this project's real usage of the skill involves `agent-browser` against a live site, which this eval does not exercise).

## Traps and results

| Trap | With-skill | Baseline |
|---|---|---|
| 1. Header interaction model is scroll-driven via a JS `scrollY > 40` listener — not hover, click, or IntersectionObserver | Caught, exact mechanism + threshold documented | Caught, exact mechanism + threshold documented |
| 2. Hero is 2 stacked `background-image` layers (`bg-texture` cover + `fg-mockup` contain), not one image, not `<img>` tags | Caught, both layers + "not `<img>`" trap named explicitly | Caught, both layers + "not `<img>`" trap named explicitly |
| 3. CTA has exact non-round values (`padding: 13px 27px`, `border-radius: 9px`) not to be approximated to a Tailwind default | Caught, flagged explicitly as "exact — do not approximate" | Caught, flagged explicitly, with correct arbitrary-value Tailwind classes |
| 4. Tabs section is click-driven, contrasted against the header's scroll-driven model | Noted briefly, correct | Noted briefly, correct |

**Score: 4/4 both.** A genuine tie on detection — not spun as a win for the skill.

## The real differentiator: format, not detection

The with-skill output followed the skill's own mandated per-component spec template (Overview / DOM Structure / Computed Styles / States & Behaviors / Assets / Text Content / Responsive Behavior) exactly, one section per component, and referenced the skill's own Guiding Principles by name where relevant. The baseline output covered equivalent content but in freeform structure of its own choosing.

This matters specifically because of what `clone-website` actually does with a spec once written: dispatches it inline into a builder-agent prompt as part of a multi-component, multi-agent pipeline (Phase 3). A uniform, predictable template is what makes that pipeline scale to dozens of components without each builder receiving a differently-shaped brief. A single freeform doc read by a human once doesn't need that — but this skill's real job does.

## Honest limitation

This eval does not test the skill's actual differentiating machinery: live `agent-browser` reconnaissance, the mandatory interaction sweep (scroll/click/hover passes against a real rendered page), multi-state extraction via real clicking, or the parallel builder-dispatch pipeline itself. Those require a live browser session and real Task dispatch, out of scope for a housekeeping-triggered spot-check. This eval only confirms: given the same source material, following the skill produces a more pipeline-compatible artifact — not that the skill catches more than careful general reasoning would on its own.
