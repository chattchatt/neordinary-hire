# Product Planning SOT — NE(O)RDINARY HIRE

**Status:** Draft for planning sync
**Last refreshed:** 2026-07-01
**Owner:** Product / Operator
**Repository boundary:** public-safe synthesis only. Do not paste raw workbook text, private PDFs, community logs, Drive excerpts, partner/customer names, contact data, or unapproved research evidence into this repo.

## 1. Why this SOT exists

This document is the planning source of truth for turning NE(O)RDINARY HIRE from an implementation repository into a product-managed web service. It connects problem definition, hypotheses, research, competitor learning, MVP scope, and development gates so that implementation work does not outrun product clarity.

Related execution docs:

- [`PRODUCT.md`](../PRODUCT.md) — product definition, phase, users, principles, metrics
- [`REQUIREMENTS.md`](../REQUIREMENTS.md) — functional, non-functional, business requirements
- [`ROADMAP.md`](../ROADMAP.md) — phased delivery plan
- [`DESIGN.md`](../DESIGN.md) — product/design source of truth
- [`docs/company-view-policy.md`](company-view-policy.md) — partner-facing privacy policy
- [`docs/scoring-policy.md`](scoring-policy.md) — score explanation guardrails
- [`docs/data-source-inventory.md`](data-source-inventory.md) — Data Source SOT와 후보 카드 데이터 준비도

## 2. Product principle

**Invariant principle:** convert real community/project/collaboration evidence into trustworthy opportunity, without exposing talent identity before there is a qualified partner need.

This means NE(O)RDINARY HIRE should not be framed as “AI recruiting” or a generic ATS. AI and automation may help curation, summarization, and operations, but the product essence is the trusted transformation of observed participation into partner-safe opportunity.

**Applied direction:**

- Evidence before claims.
- Anonymity before direct fit confirmation.
- Operator accountability before automation.
- Smaller verified loops before broad hiring-market expansion.

## 3. Current planning thesis

Partner companies and institutions struggle to evaluate early/community-based talent because useful evidence is fragmented across projects, community activity, portfolios, and operator memory. NE(O)RDINARY HIRE should first prove that a partner can make a higher-confidence shortlist from anonymized, curated evidence than from a resume-only view.

## 4. Problem definition

### Core problem

Partners want to judge real capability, collaboration style, and opportunity fit, but the evidence exists in scattered community/project contexts and cannot be safely shared as raw identity-linked data.

### One-line problem statement

Community-based talent has meaningful evidence that resumes do not capture, but partners cannot review that evidence quickly and safely without privacy risk or heavy operator mediation.

### Root-cause summary

- Valuable signals are distributed across registration forms, portfolios, community activity, project files, and operator notes.
- Raw evidence often contains identity, private context, or irrelevant noise.
- Partners need enough context to decide next steps, not a larger unfiltered candidate pool.
- Early talent may have strong potential but weak traditional credentials.
- Operators need a repeatable way to curate and broker demand without manually rebuilding every candidate narrative.

## 5. Users and jobs-to-be-done

| User | Functional job | Emotional job | Social/business job | Success signal |
| --- | --- | --- | --- | --- |
| Talent | Register once and let reviewed evidence support future opportunities. | Feel protected from premature exposure or unfair judgment. | Be recognized for real contribution, not only resume polish. | Consent is clear; private details stay hidden; opportunity handoff feels safe. |
| Operator/Admin | Curate evidence into partner-safe profiles and resolve uncertainty. | Feel confident that nothing sensitive leaks. | Turn community trust into repeatable partner value. | Profiles are ready, explainable, and auditable. |
| Partner company/institution | Review anonymized candidates and decide who is worth a next-step inquiry. | Feel that time is not wasted on weak or unverifiable profiles. | Reduce hiring/project discovery risk through trusted curation. | Partner can shortlist/inquire without raw personal data. |

## 6. Product hypotheses to validate

| Hypothesis | Current status | Validation method | Decision it should unlock |
| --- | --- | --- | --- |
| H1. Anonymous candidate cards with score reasoning reduce partner shortlist time. | Needs validation | Partner walkthrough using 5–10 anonymized sample cards; measure “can decide / cannot decide” and missing-info requests. | Card/detail information hierarchy and scoring copy. |
| H2. Anonymous review plus operator-mediated inquiry lowers talent consent friction. | Needs validation | Talent survey/interview on privacy comfort, allowed evidence, and acceptable next-step exposure. | Consent copy, exposure thresholds, and portfolio link policy. |
| H3. Curated evidence dashboard lowers manual operator intro work. | Needs validation | Operator time study before/after profile curation template; track minutes per candidate and rework count. | Admin workflow priority and evidence quality tooling. |
| H4. Partners prefer fewer high-trust candidates over broad search volume for this use case. | Needs validation | Partner interviews comparing “curated shortlist” vs “search/filter marketplace” expectations. | Whether MVP stays concierge/dashboard-first or expands toward marketplace features. |

## 7. MVP proposition

### MVP promise

A partner can open a protected web dashboard, compare anonymized candidate profiles, understand why each candidate may fit, save a shortlist, and request an operator-mediated next step without seeing forbidden private data.

### MVP surfaces

- Talent intake: `/register`, `/register/quick`
- Operator curation: `/admin`, `/admin/members/[id]`
- Partner review: `/company`, future `/company/[candidate]`
- Controlled inquiry: partner CTA routed to operator workflow

### MVP must include

- Anonymous labels instead of direct identity.
- Role, stack, availability, and work preference when non-identifying.
- Curated project/community evidence summary.
- Evidence confidence or review-needed labels.
- Score explanation in plain language.
- Shortlist/inquiry loop.
- Privacy verification for company-facing output.

### MVP must not include yet

- Full ATS pipeline management.
- Automated final hiring decisions.
- Public candidate profile pages.
- Raw Discord logs, raw Drive excerpts, internal notes, contact info, or private partner/customer material.
- Broad market claims that exceed pilot evidence.

## 8. Competitive framing

| Competitor type | Example | What to learn | Gap / opportunity for NE(O)RDINARY HIRE |
| --- | --- | --- | --- |
| Direct hiring marketplace | Wanted | Concise candidate/job matching, efficient shortlist UX, outcome-linked business model. | Resume/profile-centered matching does not deeply encode community contribution context. |
| Developer hiring platform | Jumpit | Developer-friendly role/stack expression and job context. | Skill/stack filters alone do not explain collaboration evidence or operator trust. |
| Talent search / outbound solution | Remember recruiting solutions | Company-side search demand, outbound workflow, human/AI curation patterns. | Strong search tools still require identity exposure and do not start from community evidence. |

### Differentiation thesis

NE(O)RDINARY HIRE should win narrowly by combining: community-origin evidence + operator curation + anonymous-first partner review + controlled next-step brokerage.

## 9. Market framing for planning

Market sizing should be treated as a planning input, not proof. External market numbers from desk research must be re-verified before investor, partner, or public deck use.

### Practical TAM/SAM/SOM definition

| Layer | Planning definition | Current use |
| --- | --- | --- |
| TAM | Digital recruiting / talent matching / HR tech demand relevant to talent discovery. | Directional category only. |
| SAM | Korean early-career / junior / community-based tech and maker talent discovery for startups, teams, and institutions. | Defines who to interview first. |
| SOM | The number of partners and candidate-review sessions NE(O)RDINARY can realistically operate in an initial pilot year. | Operational target, not revenue promise. |

### Initial SOM operating target

Use operational capacity until pricing and conversion data exist:

- 10–30 qualified partner teams/institutions in the first focused pilot loop.
- 50–600 anonymized candidate reviews exposed to partners.
- 10–60 partner inquiries generated through controlled CTA.
- Zero privacy defects in company-facing views.

## 10. User research plan

### Partner/company research

Goal: learn what evidence is sufficient for a shortlist decision.

Minimum plan:

- 5–8 partner interviews or walkthroughs.
- Show anonymized candidate card/detail prototypes.
- Ask partners to mark: “shortlist,” “needs more evidence,” or “not relevant.”
- Capture missing evidence, confusing labels, trust blockers, and acceptable inquiry flow.

Core questions:

1. 어떤 상황에서 외부 커뮤니티 기반 인재를 검토하나요?
2. 이 후보를 다음 단계로 넘기기 위해 반드시 필요한 근거는 무엇인가요?
3. 이름/연락처 없이도 검토 가능한 정보와 불가능한 정보는 무엇인가요?
4. 점수/배지가 있다면 어떤 설명이 있어야 신뢰하나요?
5. 문의 CTA 이후 어떤 응답 속도와 방식이 필요하나요?

### Talent/community research

Goal: learn what evidence candidates are willing to expose anonymously and when identity can be revealed.

Minimum plan:

- 10–20 survey responses and 5–6 interviews.
- Segment by role: developer, designer, planner/PM, maker/operator.
- Test consent language and evidence categories.

Core questions:

1. 어떤 활동/프로젝트 증거가 본인을 잘 설명한다고 느끼나요?
2. 회사가 익명으로 먼저 봐도 괜찮은 정보는 무엇인가요?
3. 공개되면 부담스러운 정보는 무엇인가요?
4. 어떤 조건이 충족되면 이름/연락처 공개에 동의할 수 있나요?
5. 기존 채용 플랫폼에서 본인의 실제 역량이 드러나지 않았던 경험이 있나요?

## 11. Product decisions to sync before deeper development

These are the discussion points that should be shared with the product owner before expanding implementation scope.

### P0 — blocks product direction

1. **First partner wedge:** Are we optimizing first for startups, project clients, education/institution partners, or internal NE(O)RDINARY partner leads?
2. **First talent wedge:** Do we start with developers only, or include planner/designer/maker roles from the beginning?
3. **Evidence exposure rule:** Which evidence can be shown as public links, summarized proof, score rationale, or operator-only context?
4. **Qualified inquiry definition:** What counts as a real partner need: shortlist click, inquiry form, meeting request, role match, or signed pilot?
5. **Identity reveal threshold:** At what exact step can name/contact/portfolio identity move from hidden to shared?
6. **Operator mediation level:** Should inquiry be fully manual concierge, email-based routing, CRM-like workflow, or in-product request tracking?

### P1 — shapes business and roadmap

1. **Positioning language:** Should external language say “Hire,” “Talent Review,” “Project Matching,” or “Community Talent Desk” for the first pilot?
2. **Pricing model to test:** success fee, pilot subscription, partner package, or free validation loop?
3. **Research artifact:** Should the first validation artifact be a Notion assignment-style report, a GitHub PR/SOT, a deck, or a live prototype walkthrough?
4. **Partner-specific views:** Do partners need custom role requirements and saved review sessions, or is one shared dashboard enough for MVP?
5. **Evidence quality threshold:** What minimum evidence coverage makes a candidate company-review-ready?

## 12. Planning-to-implementation gates

Before broadening engineering scope beyond Company Review MVP, complete the following gates:

- [ ] P0 partner wedge is selected.
- [ ] P0 talent wedge is selected.
- [ ] Identity reveal threshold is documented in `docs/company-view-policy.md` or a linked consent policy.
- [ ] At least 5 partner walkthroughs are summarized.
- [ ] At least 10 talent/community survey responses or 5 interviews are summarized.
- [ ] Company-facing privacy verification remains zero-defect.
- [ ] Any market-size claim used externally has a dated source and verification note.

## 13. Decision log

| Date | Decision | Why | Follow-up |
| --- | --- | --- | --- |
| 2026-07-01 | Keep GitHub SOT public-safe and sanitized. | The repo is public and must not contain private workbook/PDF/community/customer data. | Store raw research only in approved private workspace. |
| 2026-07-01 | Treat market sizing as operational SOM until pricing/conversion evidence exists. | Early service value is still being validated. | Convert to revenue SOM after partner pilots. |
| 2026-07-01 | Keep MVP partner-review-first, not ATS-first. | Core risk is whether anonymized evidence creates trustworthy next-step demand. | Revisit after partner walkthroughs. |
