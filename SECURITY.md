# SECURITY.md

## Public repository rule

This repository is public. Do not commit:

- real names, emails, phone numbers, birth dates, or contact details from live users;
- Discord user IDs, handles, raw message contents, channel IDs, or private activity logs from live users;
- raw Google Drive document contents, private file IDs, customer files, or partner materials;
- tokens, API keys, secrets, `.env` values, database URLs, or webhook URLs;
- confidential business documents or private strategy source material.

## Company-view forbidden fields

Company-facing pages must not render:

- `name`
- `email`
- `phone`
- `birthDate`
- `discordUserId`
- `discordUsername`
- `discordDisplayName`
- `discordNickname`
- raw Discord message excerpts
- raw Drive excerpts from private files
- internal admin notes
- secret matching identifiers

Company-facing pages may render curated, anonymized, partner-safe summaries such as:

- candidate alias or anonymous ID;
- role fit and tech stack;
- availability/work preference when safe;
- curated project evidence summary;
- score explanation;
- review/confidence labels.

## Secret handling

- Rotate any token that may have appeared in chat, screenshots, logs, or source files.
- Use deployment secret storage for production values.
- Keep `.env*` out of Git.
- Prefer short-lived, scoped credentials where possible.

## Release privacy checklist

Before release or partner demo:

- [ ] Company pages do not render forbidden fields.
- [ ] API responses used by company pages do not include forbidden fields unnecessarily.
- [ ] Browser devtools/network inspection has no obvious private leakage.
- [ ] Test fixtures use fake data only.
- [ ] New docs do not reference confidential source material.
