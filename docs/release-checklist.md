# Release Checklist

## Required checks

```bash
npm run lint
npm run build
```

Add targeted contract tests when product behavior changes.

## Company-view privacy check

- [ ] `/company` renders no forbidden fields.
- [ ] Company candidate detail renders no forbidden fields.
- [ ] API payloads consumed by company pages avoid unnecessary private fields.
- [ ] Score explanation is present when score/rank is shown.
- [ ] Inquiry CTA is operator-mediated.

## Documentation check

- [ ] `PRODUCT.md` reflects the current product question or phase.
- [ ] `REQUIREMENTS.md` reflects changed acceptance criteria.
- [ ] `ROADMAP.md` reflects sprint status.
- [ ] `SECURITY.md` remains current for privacy/secret rules.

## Demo readiness

- [ ] Use fake/demo data or approved anonymized data.
- [ ] No confidential source documents are visible.
- [ ] Known risks are written in the PR or release note.
