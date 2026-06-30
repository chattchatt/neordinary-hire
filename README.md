# NE(O)RDINARY HIRE

NE(O)RDINARY HIRE is a web service for reviewing verified talent signals from the NE(O)RDINARY community and matching anonymized candidates to partner hiring or project needs.

This repository is the **GitHub execution source of truth** for product requirements, implementation work, issue tracking, release checks, and privacy/security operating rules.

> Public repository rule: do not commit raw personal data, private community logs, customer materials, confidential launch documents, secrets, tokens, or non-public partner evidence.

## Product boundary

NE(O)RDINARY HIRE is:

- a focused talent-review web service built from community participation, project evidence, and operator review;
- a partner-facing way to evaluate anonymized candidate fit before direct contact;
- an operational experiment/service connected to the NE(O)RDINARY community.

NE(O)RDINARY HIRE is not:

- the whole NE(O)RDINARY business or brand;
- a claim that one pilot use case proves the full business model;
- a resume-only marketplace or generic ATS;
- a place to expose raw Discord, Google Drive, contact, or internal operator data to companies.

## Core surfaces

- `/register` and `/register/quick`: talent registration and community matching intake
- `/admin`: internal review, evidence curation, and operator workflow
- `/company`: anonymized company review dashboard
- API routes under `/api`: registration, auth, and community/evidence sync surfaces

## Product operating docs

- [`PRODUCT.md`](PRODUCT.md): product definition, current phase, product principles, metrics
- [`DESIGN.md`](DESIGN.md): product/design source of truth for UX, surfaces, and privacy-first interaction rules
- [`REQUIREMENTS.md`](REQUIREMENTS.md): functional, non-functional, and business requirements
- [`ROADMAP.md`](ROADMAP.md): phased delivery plan and current sprint
- [`OPERATIONS.md`](OPERATIONS.md): recurring product/admin/company operations
- [`SECURITY.md`](SECURITY.md): privacy boundaries, secret handling, company-view policy
- [`docs/product-planning-sot.md`](docs/product-planning-sot.md): planning SOT for problem definition, hypotheses, research plan, and product decisions
- [`docs/ia-and-flows.md`](docs/ia-and-flows.md): information architecture and user flows
- [`docs/company-view-policy.md`](docs/company-view-policy.md): anonymized partner dashboard policy
- [`docs/admin-policy.md`](docs/admin-policy.md): internal operator review policy
- [`docs/scoring-policy.md`](docs/scoring-policy.md): score explanation and guardrails
- [`docs/data-model.md`](docs/data-model.md): product-level entity map aligned with Prisma
- [`docs/data-source-inventory.md`](docs/data-source-inventory.md): source inventory for UMC Board, artifacts, community signals, and candidate-card data readiness
- [`docs/release-checklist.md`](docs/release-checklist.md): release readiness checks

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Verification contract

Before merging product changes:

1. keep `PRODUCT.md` / `REQUIREMENTS.md` / `ROADMAP.md` aligned with the issue or PR;
2. run relevant tests, lint, and build checks;
3. verify the company view does not expose forbidden personal or raw evidence fields;
4. document any unverified risk in the PR.
