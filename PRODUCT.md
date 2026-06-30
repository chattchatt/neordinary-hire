# PRODUCT.md — NE(O)RDINARY HIRE Source of Truth

## One-line definition

NE(O)RDINARY HIRE is a web service that helps partner companies and institutions review anonymized, evidence-backed talent profiles from the NE(O)RDINARY community.

## Product question

Can community activity, project evidence, and operator review produce a more trustworthy early shortlist than resumes alone, while protecting talent privacy until there is a qualified partner need?


## Planning source of truth

Use [`docs/product-planning-sot.md`](docs/product-planning-sot.md) as the current planning SOT before widening implementation scope. It tracks the problem definition, hypotheses, research plan, competitor framing, and product decisions that must be synchronized before deeper development.

## Current product phase

**Phase:** Partner Review MVP stabilization

The product should first prove that a partner can understand candidate fit from an anonymized dashboard, request the right next step, and trust that the evidence was curated responsibly.

## Users

| User | Job to be done | Success signal |
| --- | --- | --- |
| Talent | Register once and allow reviewed community/project evidence to support future opportunities. | Registration is clear, consent is explicit, and private details are protected. |
| Operator/Admin | Curate candidate evidence, resolve matching uncertainty, and maintain safe data boundaries. | Candidate profiles are reviewable, explainable, and ready for partner view. |
| Partner company/institution | Review anonymized candidates and identify who is worth asking about. | Partner can shortlist or inquire without needing raw personal data. |

## Product principles

1. **Evidence over claims** — profiles should be supported by community activity, project artifacts, or operator review, not only self-written resumes.
2. **Anonymity before fit** — company-facing pages must hide direct identity/contact data until a controlled next step is approved.
3. **Explainable matching** — scores and badges should show why a candidate is relevant, not just rank people opaquely.
4. **Operator accountability** — uncertain Discord/Drive matches must stay reviewable and should not become automatic truth.
5. **Small product loops** — each sprint should ship a measurable improvement to registration, admin review, company review, or partner inquiry.

## In scope now

- Talent registration and quick registration
- Discord identity/activity matching structure
- Google Drive evidence linking and summaries
- Admin review dashboard and talent detail
- Company dashboard with anonymized talent cards
- Company candidate detail, shortlist, inquiry CTA, and scoring explanation

## Out of scope for now

- Full ATS workflows
- Automated final hiring decisions
- Public candidate profiles
- Raw Discord log or raw Drive document exposure to partners
- Broad claims that any single pilot proves the full business model

## Primary metrics

| Metric | Why it matters |
| --- | --- |
| Registration completion rate | Measures whether talent intake is understandable. |
| Evidence coverage per candidate | Measures whether profiles are more than resumes. |
| Admin review completion rate | Measures whether operators can safely curate profiles. |
| Partner shortlist rate | Measures whether anonymized profiles are actionable. |
| Partner inquiry conversion | Measures whether the review dashboard creates real demand. |
| Privacy defect count | Must stay at zero for company-facing exposure. |

## Current sprint goal

**Company Review MVP:** partners can inspect anonymized candidate details, save a shortlist, understand score reasoning, and send an inquiry without seeing forbidden private data.
