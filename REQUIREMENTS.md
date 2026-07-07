# REQUIREMENTS.md

## Requirement types

- **Functional requirements:** what the product must do.
- **Non-functional requirements:** quality, privacy, performance, reliability, and maintainability expectations.
- **Business requirements:** outcomes that make the product worth operating.

## Functional requirements

### Talent registration

- Users can submit profile, role, stack, availability, work preference, portfolio, and community context.
- Quick registration can collect enough information to start matching review without forcing complex setup.
- Discord/community matching should support pending review, auto-link candidates, and operator correction.

### Admin review

- Admin users can review candidate identity, registration data, Discord activity summary, and Drive evidence.
- Admin users can distinguish high-confidence evidence from evidence that needs review.
- Admin users can prepare candidate records for company view without exposing internal notes or raw private data.

### Company review

- Company users can browse anonymized candidate cards.
- Company users can open candidate detail pages that explain fit, evidence, and score reasoning without exposing forbidden fields.
- Company users can save a shortlist.
- Company users can send an inquiry or request next-step contact through a controlled CTA.

## Non-functional requirements

- Company-facing pages must not expose names, phone numbers, emails, Discord IDs, raw Discord excerpts, internal notes, or raw private Drive excerpts.
- Scoring and labels must be explainable in plain language.
- Evidence matching uncertainty must be visible to operators.
- Secrets and tokens must only live in environment variables or secret managers, never in source control.
- Public repo documentation must avoid confidential source material and private partner/customer details.

## Business requirements

- The product must help NE(O)RDINARY convert community trust and project evidence into partner opportunities.
- The first proof point is partner understanding and inquiry quality, not broad hiring automation.
- The product must remain narrow enough for a small team to operate reliably.

## Current sprint acceptance criteria

1. Company candidate detail is available from `/company`.
2. Company detail view shows anonymized fit, evidence, and score explanation.
3. Shortlist save flow exists or has a clearly scoped placeholder with issue tracking.
4. Inquiry CTA exists and routes to a controlled next step.
5. Automated or manual privacy verification confirms forbidden fields are not rendered in company view.
6. Product docs and issue state are updated after delivery.
