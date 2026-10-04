# Planning Session Brief — Week 5 Upgrade

**Date:** 2026-07-01  
**Product:** NE(O)RDINARY HIRE  
**Purpose:** Summarize the Week 5 planning upgrade based on feature specification, policy writing, and MVP prioritization.

## What changed

- Added a Week 5 planning layer to the product SOT: feature specification, policy rules, and MVP priority.
- Created dedicated docs for implementation-facing planning:
  - `docs/feature-spec.md`
  - `docs/service-policy.md`
- Updated core SOT links and requirements so future implementation work starts from feature IDs and privacy policy, not only high-level concept docs.

## 1–4 week corrections folded into Week 5

- Week 1 problem framing is now constrained by feature behavior: HIRE is not a broad job board; it is an anonymous evidence-review workflow.
- Week 2 research must validate concrete feature decisions: what partner evidence is enough, what candidate data can be safely shown, and what counts as a qualified inquiry.
- Week 3 personas now map to permissions: candidate, operator, partner reviewer.
- Week 4 IA/flows now require exception states: missing evidence, invalid access, publish blocking, inquiry context missing, and identity reveal not approved.

## Current MVP priority

1. Privacy exposure verification
2. Company candidate detail
3. Qualified inquiry CTA
4. Admin company-ready publishing rule
5. Candidate registration consent clarity
6. Shortlist save
7. Evidence quality labels and partner walkthrough loop

## Open decisions for next session

- Choose the first partner wedge.
- Choose the first talent wedge.
- Define exact company-ready evidence threshold.
- Decide whether shortlist is local/session-based or account/server-backed for MVP.
- Decide the first artifact for partner validation: live walkthrough, Notion-style report, deck, or GitHub SOT.
