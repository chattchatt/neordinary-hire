# OPERATIONS.md

## Operating cadence

### Weekly product review

- Review open issues by priority and area.
- Confirm current sprint goal still matches partner/talent needs.
- Check whether any docs need updates after implementation.
- Review privacy/security defects first.

### Admin review loop

1. New or updated talent profile enters review.
2. Operator checks registration completeness.
3. Operator checks Discord/community match state.
4. Operator checks Drive/project evidence and confidence.
5. Operator flags uncertainty or prepares anonymized company profile.

### Company review loop

1. Partner enters `/company` through approved access path.
2. Partner reviews anonymized candidates.
3. Partner opens candidate detail and reads score/evidence explanation.
4. Partner saves shortlist or sends inquiry.
5. Operator handles controlled next step.

### Evidence maintenance loop

- Keep raw source material internal.
- Summarize evidence into partner-safe language.
- Mark uncertain matching as uncertain; do not silently promote it to truth.
- Re-run privacy checks before partner demos or releases.

## Definition of ready

A product issue is ready when it has:

- user and surface;
- product question or problem;
- acceptance criteria;
- privacy/security impact;
- verification plan.

## Definition of done

A product issue is done when:

- acceptance criteria are met;
- relevant tests/lint/build/manual checks have evidence;
- company-view privacy boundary is checked when applicable;
- docs or roadmap are updated if product behavior changed;
- remaining risks are explicitly written in the issue or PR.
