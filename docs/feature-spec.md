# Feature Specification — NE(O)RDINARY HIRE

**Status:** Draft for Week 5 planning sync  
**Last refreshed:** 2026-07-01  
**Scope:** public-safe MVP feature specification. Do not include raw workbook text, private community logs, contact data, or partner/customer names.

## 1. ID convention

Use `HIRE-[AREA]-[SEQ]` for product-facing features and `HIRE-[AREA]-ERR-[SEQ]` for exception cases.

| Area | Meaning |
| --- | --- |
| `REG` | Candidate registration and consent |
| `ADM` | Operator/admin evidence review |
| `CMP` | Partner/company review experience |
| `INQ` | Shortlist, inquiry, and mediated next step |
| `TRU` | Trust, privacy, policy, and audit surfaces |

## 2. MVP feature specification

| Feature ID | Feature name | Description: trigger → logic → result | Exceptions / response | Priority |
| --- | --- | --- | --- | --- |
| HIRE-REG-001 | 후보 상세 등록 | 후보가 `/register`에 진입해 기본 정보, 역할/스택, 프로젝트 evidence, 공개 동의를 입력한다 → 필수값과 동의 상태를 검증한다 → 후보 레코드를 `pending review` 상태로 저장하고 완료 안내를 보여준다. | 필수값 누락: 해당 필드 안내. 동의 미체크: 제출 비활성/안내. 중복 제출: 기존 제출 상태 안내. 저장 실패: 재시도 안내와 운영자 문의 경로 제공. | Must / P0 |
| HIRE-REG-002 | 후보 빠른 등록 | 후보가 `/register/quick`에서 최소 정보를 입력한다 → 최소 검토 가능 정보와 연락 가능한 내부 식별자를 저장한다 → 운영자 보완 검수 큐에 올린다. | 최소 필수값 부족: 제출 불가. 동일 이메일/연락처 추정: 중복 가능성 안내 후 운영자 확인. | Must / P0 |
| HIRE-ADM-001 | 후보 evidence 검수 | 운영자가 `/admin/members/[id]`에서 원본 제출 정보와 evidence를 본다 → partner-safe 요약, 공개 가능 필드, 검수 상태를 정한다 → company view 노출 가능 상태를 만든다. | evidence 부족: 보완 필요 상태. 개인정보 포함 evidence: partner 비노출 및 요약 대체. 매칭 불확실: confidence 낮음 표시. | Must / P0 |
| HIRE-ADM-002 | 익명 후보 카드 생성 | 운영자가 후보를 company-ready로 전환한다 → 이름/연락처/원문 로그를 제외하고 role, stack, output, evidence, fit signal을 구성한다 → `/company` 카드와 상세에 노출한다. | 금지 필드 감지: publish 차단. 필수 카드 정보 부족: draft 유지. | Must / P0 |
| HIRE-CMP-001 | 파트너 후보 리스트 검토 | 파트너가 `/company`에 접근한다 → 보호된 접근 여부를 확인하고 익명 후보 카드를 로드한다 → 후보를 비교하고 shortlist/inquiry 진입점을 확인한다. | 권한 없음/비밀번호 오류: 접근 제한 안내. 후보 없음: 운영자 문의/대기 안내. 로드 실패: 재시도 안내. | Must / P0 |
| HIRE-CMP-002 | 파트너 후보 상세 검토 | 파트너가 후보 카드를 선택한다 → 익명 상세, evidence summary, score rationale, 숨김 정보 안내를 보여준다 → 파트너가 다음 액션을 판단한다. | candidate not ready: 리스트 복귀. evidence low confidence: 명시적 경고/보완 상태 표시. | Must / P0 |
| HIRE-INQ-001 | Shortlist 저장 | 파트너가 관심 후보를 저장한다 → 세션/계정 기반 저장 방식에 따라 상태를 기록한다 → 카드와 상세에 saved 상태를 표시한다. | 저장 실패: 재시도 및 임시 local fallback 안내. 중복 저장: 기존 saved 상태 유지. | Should / P1 |
| HIRE-INQ-002 | Qualified inquiry 제출 | 파트너가 문의 CTA를 누르고 목적/역할/필요 시점을 입력한다 → 운영자 검토용 inquiry를 생성한다 → 후보 신원 공개 전 운영자 중개 상태로 전환한다. | 문의 맥락 부족: 추가 입력 요청. 후보 공개 조건 미충족: 운영자 확인 필요 상태. 제출 실패: 재시도/운영자 연락 안내. | Must / P0 |
| HIRE-TRU-001 | Partner-safe privacy notice | 파트너 화면 진입·상세·문의 단계에서 숨김 정보와 공개 조건을 안내한다 → 신원/연락처/원문 로그가 아직 공개되지 않는 이유를 설명한다 → partner trust와 candidate safety를 동시에 유지한다. | 정책 링크 누락: 배포 차단. 문구가 직접 연락을 유도하면 수정 필요. | Must / P0 |
| HIRE-TRU-002 | Revision and decision log | 기능명세서·정책서·SOT 변경 시 날짜, 결정, 이유, 후속 조치를 기록한다 → 기획/디자인/개발자가 같은 기준으로 변경 범위를 추적한다. | 변경 이유 없음: merge/release 전 보완. | Should / P1 |

## 3. MVP priority by MoSCoW

| Category | Features | Rationale |
| --- | --- | --- |
| Must Have | 후보 등록, 운영자 evidence 검수, 익명 후보 카드, 파트너 리스트/상세, qualified inquiry, privacy notice | 파트너가 안전하게 후보를 검토하고 다음 단계 관심을 남기는 핵심 가치 검증에 직접 필요하다. |
| Should Have | shortlist 저장, revision/decision log, evidence confidence label 고도화 | MVP 사용성·운영 신뢰에 중요하지만, inquiry 검증 자체를 막지는 않는다. |
| Could Have | partner-specific dashboard, shortlist export/report, inquiry status page, role-specific scoring settings | 파일럿 반복 운영 단계에서 가치가 커진다. |
| Won't Have for MVP | full ATS, 자동 합격/불합격 판단, 공개 후보 프로필, direct contact marketplace, native app/PWA | 초기 검증 범위를 과도하게 넓히고 개인정보 리스크를 키운다. |

## 4. Eisenhower view for next sprint

| Quadrant | Work |
| --- | --- |
| Important + urgent: Do | privacy exposure verification, company candidate detail, inquiry CTA, company-ready card publishing rules |
| Important + not urgent: Plan | partner walkthrough script, evidence quality rubric, partner segment decision, talent consent copy refinement |
| Not important + urgent: Delegate/limit | cosmetic copy sweeps not tied to privacy or inquiry conversion, broad internal doc formatting |
| Not important + not urgent: Delete/defer | dark mode, native app shell, public profile SEO, generic job-board features |
