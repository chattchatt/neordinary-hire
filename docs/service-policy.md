# Service Policy — NE(O)RDINARY HIRE

**Status:** Draft for Week 5 planning sync  
**Last refreshed:** 2026-07-01  
**Scope:** MVP operating policies for candidate intake, admin curation, partner review, and controlled inquiry.

## 1. Revision policy

Revision history is required because HIRE deals with privacy, partner trust, and candidate opportunity decisions. Every policy-impacting change should preserve: what changed, why, who/what workflow is affected, and what must be re-verified.

| Version | Date | Change | Reason |
| --- | --- | --- | --- |
| v0.1 | 2026-07-01 | Initial Week 5 policy draft added. | Align feature specification, privacy rules, and MVP priority before deeper implementation. |

## 2. Validation policy

| Field / event | Required | Rule | User-facing response |
| --- | --- | --- | --- |
| Candidate name/contact | Candidate side only | Can be collected for operator use but must not render in company-facing views before identity reveal approval. | “신원/연락처는 운영자 확인 전까지 파트너에게 공개되지 않습니다.” |
| Role / interest area | Yes for company-ready | Must be normalized enough for partner comparison. | Missing: “희망 역할 또는 관심 영역을 입력해 주세요.” |
| Stack / tools | Recommended | Display only when non-identifying and relevant to review. | Missing allowed, but card may show “추가 확인 필요.” |
| Project/activity evidence | Yes for company-ready | At least one evidence summary or operator-reviewed signal is required for partner exposure. | Missing: candidate remains `needs evidence`. |
| Consent | Yes | Candidate must acknowledge anonymized review and later identity reveal process. | Missing: submission blocked or kept internal-only. |
| Inquiry context | Yes for qualified inquiry | Partner should provide role/project need, urgency, and desired next step. | Missing: “문의 목적을 조금 더 구체적으로 입력해 주세요.” |

## 3. Access and permission policy

| Actor | Allowed | Restricted |
| --- | --- | --- |
| Candidate | Submit/edit requested information, understand consent and exposure rules. | Cannot see partner-only dashboard or other candidates' private data. |
| Operator/Admin | Review raw submissions, curate partner-safe summaries, approve company-ready exposure, manage inquiry handoff. | Must not publish raw private logs, direct contact, or internal notes to partner view. |
| Partner reviewer | View anonymized candidate cards/details, shortlist, submit inquiry. | Cannot access name, phone, email, Discord ID, raw logs, private Drive excerpts, or direct contact until approved handoff. |

## 4. Content exposure and sorting policy

- Default company view sorting should prioritize `company-ready` candidates with stronger evidence coverage and clearer fit signal.
- Candidates with weak or uncertain evidence may appear only if the uncertainty label is visible and the card does not imply verification beyond the evidence.
- Empty states must explain the next action: wait for operator curation, request a partner-specific shortlist, or contact the operator.
- Score/fit labels are decision-support summaries, not automated hiring judgments.

## 5. Evidence/media upload policy

- Public links may be referenced only when candidate consent and privacy review allow it.
- Raw Discord logs, raw Drive excerpts, file IDs, contact data, and internal notes are operator-only by default.
- Evidence should be converted into short partner-safe summaries before company exposure.
- If media/file upload is added later, define allowed file types, max size, malware scanning, retention, and deletion rules before launch.

## 6. Identity reveal policy

Identity reveal can happen only when all conditions are true:

1. A partner submits a qualified inquiry with enough context.
2. The operator confirms the inquiry is legitimate and relevant.
3. The candidate consents to the specific next step.
4. The exposed information is limited to what the next step requires.

Until then, company-facing surfaces must remain anonymous-first.
