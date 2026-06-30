# DESIGN.md — NE(O)RDINARY HIRE Product Design SOT

**Status:** Draft
**Last refreshed:** 2026-07-01
**Scope:** product/design decisions for the web-service MVP. This file should stay aligned with `PRODUCT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, and `docs/product-planning-sot.md`.

## 1. Design intent

NE(O)RDINARY HIRE should feel like a trusted review desk, not a noisy job board. The product helps partners understand candidate fit through curated evidence while protecting talent identity until there is a qualified next-step need.

## 2. Brand and product posture

- **Trust-first:** every important claim should have evidence or an uncertainty label.
- **Privacy-first:** anonymity is not a cosmetic feature; it is a product contract.
- **Operator-backed:** automation may assist, but partner-facing output should imply responsible curation.
- **Focused:** the MVP should help partners decide “who should we ask about next?” rather than manage a full hiring pipeline.

## 3. Design principles

1. **Explain the why, not only the score.** Scores must be paired with short reasoning and evidence categories.
2. **Hide identity by default.** Names, direct contact, raw handles, raw logs, file IDs, and internal notes do not appear in company-facing UI.
3. **Show enough to decide.** Candidate cards should communicate role, fit, evidence strength, and next action without overwhelming the partner.
4. **Make uncertainty visible.** Weak evidence, pending review, or low-confidence matches should be labeled rather than smoothed over.
5. **Keep operator recovery paths.** Any ambiguous evidence or inquiry should have a clear internal follow-up path.

## 4. Primary personas

| Persona | Needs | UX success |
| --- | --- | --- |
| Talent | Safe consent, low-friction registration, fair representation of real work. | Understands what will be reviewed and what remains private. |
| Operator/Admin | Fast evidence review, privacy control, confidence labeling. | Can prepare company-safe profiles without rebuilding narratives manually. |
| Partner reviewer | Quick fit understanding, shortlist confidence, clear next-step request. | Can decide shortlist/inquiry status without direct identity data. |

## 5. Information architecture

Current surfaces:

```text
/register
/register/quick
/register/quick/success
/admin
/admin/members/[id]
/company
/api/*
```

Target MVP surface expansion:

```text
/company/[candidate]
/company/shortlist or saved shortlist state
/company/inquiry confirmation state
```

## 6. Partner review UX model

### Candidate card should answer

1. What kind of role is this candidate likely suited for?
2. Why is this candidate being shown?
3. What evidence supports the recommendation?
4. How confident is the system/operator in that evidence?
5. What is the safe next action?

### Candidate detail should answer

1. What are the strongest fit signals?
2. What are the caveats or missing evidence?
3. Which work/project/community signals were curated?
4. What information is intentionally hidden for privacy?
5. How can the partner request a next step?

## 7. Visual language

Current implementation uses a dark, premium partner-gate surface and light card-based dashboard. Continue this direction unless user research shows it reduces clarity.

- Background: dark trust/premium entry states; white or near-white review workspace.
- Accent: emerald/teal for trust and approved review; sky/blue for reviewable; amber for evidence-needs-work.
- Cards: rounded, high-contrast, readable on laptop screens during partner walkthroughs.
- Typography: concise headings, plain Korean explanations, avoid HR jargon when possible.

## 8. Component decisions

| Component | Purpose | Required states |
| --- | --- | --- |
| Partner login gate | Protect company dashboard access. | Default, loading, invalid password, network error. |
| Candidate card | Fast shortlist scan. | Priority review, reviewable, evidence-needs-work. |
| Score breakdown | Explain fit without implying final decision. | Full score, partial evidence, low-confidence evidence. |
| Evidence summary | Show curated proof categories. | Project evidence, community signal, public portfolio, unavailable/pending. |
| Shortlist action | Let partner mark next-step interest. | Unsaved, saved, save failed, local/session persistence notice. |
| Inquiry CTA | Controlled next-step request. | Ready, submitted, missing context, routing failed. |

## 9. Privacy copy rules

Use clear copy that explains what is hidden and why.

Preferred examples:

- “이름·연락처·원문 로그는 아직 공개되지 않습니다.”
- “아래 내용은 파트너 검토를 위해 요약된 근거입니다.”
- “직접 연락은 운영자 확인 이후 진행됩니다.”

Avoid:

- “AI가 검증한 인재” unless the verification method is explicitly proven.
- “채용 확정,” “자동 추천,” or wording that implies automated hiring decisions.
- Copy that pressures talent to reveal identity before partner intent is qualified.

## 10. Accessibility and responsive requirements

- Company review must be usable on laptop width first; mobile should remain readable but is not the primary partner-review context.
- Do not rely on color alone for score/fit states; include text labels.
- Error and empty states must explain recovery paths.
- CTA buttons should have descriptive labels in Korean.

## 11. Open design/product questions

These questions must be resolved or consciously deferred before expanding the MVP:

1. Which first partner segment is the dashboard designed around?
2. Which first talent role segment should define card fields and score weights?
3. What exact information moves from hidden to shareable after an inquiry?
4. Should shortlist persist only locally/session-based for MVP, or be account/server-backed?
5. What is the minimum evidence coverage for “company-review-ready”?
6. Should the product language remain “Hire,” or shift toward “Talent Review” for safer early validation?

## 12. Design verification checklist

Before shipping partner-facing UI changes:

- [ ] No forbidden identity/contact/raw evidence fields are rendered.
- [ ] Score or badge has plain-language rationale.
- [ ] Evidence uncertainty is visible when relevant.
- [ ] Empty, loading, and error states are understandable.
- [ ] Inquiry/shortlist action has a controlled next step.
- [ ] Product docs are updated when UI changes alter the workflow.
