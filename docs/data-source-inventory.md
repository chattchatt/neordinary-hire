# Data Source Inventory — NE(O)RDINARY HIRE

**Status:** Draft
**Last refreshed:** 2026-07-01
**Purpose:** define which raw sources can feed NE(O)RDINARY HIRE, what product signals they can produce, and how each source should be exposed or protected.

This document is a product-planning SOT. It does not grant permission to ingest, expose, or publish raw data. Implementation must still follow `SECURITY.md`, `docs/company-view-policy.md`, and user consent requirements.

## 1. Data-source principle

NE(O)RDINARY HIRE should not collect data because it is available. It should collect or connect data only when it can be transformed into one of four candidate-card signals:

1. **Activity** — did the person participate consistently?
2. **Evidence** — what did the person actually make or submit?
3. **Collaboration** — how did the person work with others?
4. **Growth** — did the person improve, respond to feedback, or expand responsibility?

Every source must have an owner, consent basis, privacy level, and candidate-card use case before it is treated as product data.

## 2. Source classification

| Source class | Examples | Primary value | Default exposure |
| --- | --- | --- | --- |
| System-of-record data | UMC Management Solution Board, registration DB, admin review state | Participation, role, cohort, completion, status | Internal/admin; summarized only for partners |
| Submitted artifact data | Notion assignments, Figma links, GitHub repos, deployed URLs, portfolio links, blog links | Actual work evidence | Public link or curated summary depending on consent and identifiability |
| Community activity data | Discord activity, peer review, comments, study participation | Collaboration, reliability, community signal | Internal/admin; partner-safe summary only |
| Operator judgment data | Admin notes, review status, evidence confidence, recommended role | Curation, risk control, matching interpretation | Internal/admin; partner-safe labels only |
| Partner interaction data | Company shortlist, inquiry, missing-info request, partner feedback | Demand signal, card quality, market fit | Internal/product analytics; aggregate only externally |
| Research data | Partner interviews, talent surveys, usability walkthrough notes | Problem validation, field priority, pricing/positioning insight | Private research workspace; anonymized synthesis only in GitHub |

## 3. UMC Management Solution Board source map

UMC Management Solution Board can become the first high-value structured source because it can connect participation, assignments, roles, and completion state.

| Board data | Product signal | Candidate-card use | Privacy level | Notes |
| --- | --- | --- | --- | --- |
| Cohort / season / generation | Context | “Participated in X cohort” when non-identifying | Partner-safe if generalized | Avoid exact combinations that identify a person in small cohorts. |
| Part / track / role | Role fit | Recommended role and filters | Partner-safe | Normalize to product roles: FE, BE, Design, Plan/PM, Maker/Ops. |
| Team / project assignment | Collaboration context | Team project participation | Restricted summary | Team name may identify; summarize unless consented. |
| Attendance / participation count | Activity | Reliability indicator | Partner-safe as range/label | Prefer labels like “high participation” over raw attendance logs. |
| Assignment submission status | Activity / reliability | Completion consistency | Partner-safe as rate/label | Avoid exposing missing-work details unless relevant and consented. |
| Assignment links | Evidence | Work samples and artifact summaries | Depends on link | Public links require consent and identifiability review. |
| Submission timestamp / deadline status | Reliability | Timeliness signal | Internal; summarized label only | Use “consistent deadline adherence” rather than raw timestamps. |
| Peer review participation | Collaboration | Collaboration/feedback signal | Partner-safe summary | Raw peer comments stay private unless explicitly approved. |
| Received feedback / review score | Growth / quality | Improvement and quality signal | Internal; summarized label only | Avoid ranking people by private peer comments. |
| Final project / demo / deployment link | Evidence | Strongest work proof | Public or curated summary | Check whether link reveals personal/contact/team private info. |
| Completion / certificate status | Baseline qualification | Program completion signal | Partner-safe | Should not become sole quality proxy. |
| Leadership/organizer role | Collaboration / responsibility | Responsibility signal | Partner-safe if non-identifying | Confirm titles and scope before exposing. |


### Observed UMC Board coverage

Header-level inspection was performed on the shared 7th, 8th, 9th, and 10th UMC Management Solution Board spreadsheets. The boards are structurally similar, but later boards add branch-level tabs and score/event-management tabs. Treat this as schema evidence only, not as permission to ingest row-level personal data.

| Board | Observed tabs | Candidate-card value | Product caution |
| --- | --- | --- | --- |
| 7th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `상/벌점 제출`, `회장단 회의 참석 여부` | Baseline member registry, school/branch counts, score/penalty events, leadership attendance | Contains direct identifiers and event reasons; partner exposure must use summaries only. |
| 8th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `회장단 회의 참석 여부`, branch tabs | Adds branch-level challenger score/selection/penalty summaries | Branch tabs repeat personal identifiers; use only normalized candidate IDs internally. |
| 9th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `회장단 회의 참석 여부`, branch tabs | Adds senior/branch fields and stronger role/part segmentation | Duplicate branch columns and corrected Discord email fields need normalization. |
| 10th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `회장단 회의 참석 여부`, branch tabs, `상벌점`, `점수 정리`, `MT 신청 매칭` | Adds score taxonomy, total score rollup, event matching/status data | Event/MT/payment/contact fields are operational, not hiring evidence by default. |

### Observed field groups

| Field group | Observed headers | Useful signal | Partner-safe projection | Default handling |
| --- | --- | --- | --- | --- |
| Candidate identity | challenger ID/number, school, nickname, name, birth date, phone, gender, student number, major | Internal identity resolution and deduplication | Anonymous candidate ID, broad school/region only if safe | Restricted; never expose direct identifiers by default. |
| Contact/account linkage | Notion email, Discord email/raw/corrected email, Discord role-invite link | Account matching and source linkage | None, unless candidate explicitly provides a public contact route | Restricted; use only for internal matching. |
| Role/track context | part, project part, branch, senior status, operator status, school/central staff title | Role fit, responsibility, cohort context | Normalized role/track and responsibility label | Partner-safe after normalization. |
| School/branch aggregate | branch, school name, part counts, project-member total, total challengers, operators, dues/payment flags, LT attendance flags | Supply sizing and cohort context | Aggregated talent-pool availability by role/branch | Aggregate only; do not expose school operator contacts. |
| Score/activity summary | score, total score, best workbook selection week/count, bonus/penalty score, three-strike/dropout flag | Activity, reliability, growth/quality proxy | Qualitative labels such as `high activity`, `needs review`, `not eligible` | Internal first; partner labels require rubric and appeal path. |
| Score/event reason | bonus/penalty/dropout reason, confirmation status, timestamp, submitter email | Audit trail for operator decisions | None by default | Restricted; reasons may contain sensitive context. |
| Event/MT operations | matching status/reason, payment confirmation/amount/refund, early-leave/additional notes | Operations only | None by default | Exclude from hiring-product scoring unless a separate consented use case exists. |

### Data products we can derive from the boards

1. **Talent pool sizing** — number of candidates by generation, branch, school, and normalized part.
2. **Candidate registry base** — stable internal candidate identity keyed by challenger ID/number plus generation.
3. **Role-fit seed** — normalized role from part/project part, senior status, and operator titles.
4. **Activity/reliability label** — derived from score, best-workbook selection, penalty/dropout flags, and completion/attendance-like markers.
5. **Responsibility label** — derived from school/central operator status and leadership titles.
6. **Risk/exclusion queue** — candidates with dropout/three-strike/penalty signals requiring human review before partner exposure.
7. **Data quality queue** — rows with missing/duplicate/corrected Discord/Notion fields or ambiguous branch/part fields.

### Board-to-product normalization rules

- Use `generation + challenger_id` as the internal stable key; never use name, phone, email, or Discord fields as partner-facing IDs.
- Convert part labels into NE(O)RDINARY HIRE roles before filtering: Plan/PM, Design, Web/FE, Server/BE, Android, iOS, Ops/Leadership.
- Convert scores and event history into qualitative review states before partner exposure: `strong_signal`, `normal_signal`, `needs_operator_review`, `not_partner_ready`.
- Treat bonus/penalty reasons as operator-only evidence; they can trigger review but should not be quoted or exposed.
- Treat MT/payment/attendance-operation fields as non-hiring operational data unless a separate product decision explicitly includes them.
- Require consent and artifact evidence before a Board-derived candidate becomes company-review-ready.

## 4. Derived signal taxonomy

Raw sources should be converted into normalized signals before company exposure.

| Signal | Derived from | Candidate-card expression | Risk |
| --- | --- | --- | --- |
| Participation consistency | Attendance, submissions, activity count | “High consistency across program activities” | Can become unfair if absences had private reasons. |
| Delivery reliability | deadline status, final project completion | “Submitted core artifacts on time” | Avoid punitive detail. |
| Role fit | track, assignments, project role, tech stack | “Frontend / Product Planning fit” | Needs role normalization. |
| Evidence strength | artifact quality, deployed URL, repo/Figma/Notion completeness | “Strong project evidence available” | Quality rubric must be explainable. |
| Collaboration signal | peer review, team participation, leadership role | “Active feedback/collaboration participation” | Raw comments are sensitive. |
| Growth signal | revision history, feedback reflection, assignment progression | “Improved structure after feedback” | Requires careful comparison and avoid overclaiming. |
| Availability fit | registration, updated availability | “Available for part-time/project/full-time review” | Can become outdated quickly. |
| Partner demand signal | shortlist, inquiry, missing-info request | “Partner interest generated” | Do not expose one partner’s interest to another. |

## 5. Candidate-card data groups

### Required for MVP card

- Anonymous candidate ID
- Role/track normalization
- Availability/work preference if current
- 2–4 strongest evidence summaries
- Evidence confidence label
- Collaboration/activity summary
- Fit score or fit level with rationale
- Controlled inquiry CTA

### Useful but gated

- Public portfolio links
- GitHub/Figma/Notion/deployed URLs
- Specific project names
- Team role details
- Program/cohort details

### Forbidden in company view by default

- Name
- Email
- Phone number
- Discord ID, handle, message ID, raw message, raw channel context
- Raw private Drive file IDs or excerpts
- Raw Board rows, attendance logs, scores, peer comments, private feedback
- Internal operator notes
- Partner/customer confidential material

## 6. Data-readiness checklist per source

Before using a source in product or scoring, answer:

- [ ] Who owns this source operationally?
- [ ] Is there explicit or implied consent for this use?
- [ ] Is the source public, private, partner-confidential, or internal-only?
- [ ] Which candidate-card signal does it support: Activity, Evidence, Collaboration, Growth?
- [ ] What is the partner-safe projection?
- [ ] What must never be exposed?
- [ ] How fresh is the data and when does it expire?
- [ ] Can a human operator override or correct it?
- [ ] Is there a quality/confidence label?

## 7. Priority ingestion order

1. **Registration DB** — role, stack, availability, portfolio, consent baseline.
2. **UMC Management Solution Board** — structured participation, assignments, roles, completion.
3. **Submitted artifact links** — Notion/Figma/GitHub/deployed URLs as evidence.
4. **Operator review labels** — evidence confidence, recommended role, privacy approval.
5. **Partner interactions** — shortlist, inquiry, missing-info requests.
6. **Community activity summaries** — Discord/peer/community signals after stricter privacy review.

## 8. Open decisions

1. Which Board access mode should be used for the pilot: export, API, or manual sanitized upload?
2. Which Board fields already have consent for recruiting/talent-review use, especially score/event and branch-level fields?
3. Should Board-derived signals be shown as exact numbers, ranges, or qualitative labels?
4. What is the minimum artifact evidence for a candidate to become company-review-ready?
5. Who can approve a public portfolio/project link for partner exposure?
6. How often should availability and Board-derived status be refreshed?
7. Should peer review data be used only internally, or can it become partner-safe collaboration labels?

## 9. First practical data pull

For the first pilot, prepare a small sanitized sample table with 10–20 candidates and these columns:

| Column | Purpose |
| --- | --- |
| source_generation | Board generation such as 7th/8th/9th/10th |
| source_challenger_key | Internal key, generated from generation + challenger ID; never shown to partners |
| anonymous_candidate_id | Partner-safe candidate reference |
| normalized_role | Card role and filter |
| track_or_part | Role-fit source |
| participation_label | Activity signal |
| assignment_completion_label | Reliability signal |
| strongest_artifact_type | Evidence category |
| strongest_artifact_summary | Partner-safe work proof |
| collaboration_label | Team/peer/community signal |
| growth_label | Improvement signal |
| evidence_confidence | Operator trust label |
| board_review_state | `strong_signal`, `normal_signal`, `needs_operator_review`, or `not_partner_ready` |
| consent_status | Whether recruiting/talent-review use is confirmed |
| exposure_status | `partner_safe`, `needs_review`, or `operator_only` |
| next_missing_data | What must be collected before partner view |

This sample should be reviewed manually before any scoring automation or partner-facing import.
