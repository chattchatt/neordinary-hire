# Information Architecture and Flows

## Core surfaces

```text
/register
/register/quick
/admin
/admin/members/[id]
/company
/company/[candidate]
/api/*
```

## Talent registration flow

- Entry: talent receives registration link or quick registration prompt.
- Core action: submits profile, role, stack, availability, portfolio, and optional community context.
- Exit: sees success state and knows whether community matching is pending.
- Failure states: duplicate submission, missing required fields, unclear consent, Discord matching uncertainty.

## Admin review flow

- Entry: operator opens admin dashboard.
- Core action: reviews profile completeness, Discord/community activity, and Drive evidence.
- Exit: candidate is marked ready for company-safe review or needs more evidence.
- Failure states: uncertain identity match, weak evidence, private notes not curated, duplicate records.

## Company review flow

- Entry: approved partner opens company dashboard.
- Core action: reviews anonymous candidate cards and details.
- Exit: saves shortlist or sends inquiry.
- Failure states: score is unclear, evidence is too vague, CTA is missing, private data is exposed.
