# Data Source Inventory — NE(O)RDINARY HIRE

**상태:** Draft
**마지막 갱신:** 2026-07-01
**목적:** NE(O)RDINARY HIRE에 투입될 수 있는 원천 데이터를 정의하고, 각 데이터가 어떤 제품 신호로 전환될 수 있는지, 어떤 방식으로 노출하거나 보호해야 하는지 정리한다.

이 문서는 제품 기획 SOT(Source of Truth)이다. 원천 데이터의 수집, 연동, 공개 권한을 부여하는 문서가 아니다. 실제 구현과 운영은 반드시 `SECURITY.md`, `docs/company-view-policy.md`, 사용자 동의 요건을 따라야 한다.

## 1. 데이터 소스 원칙

NE(O)RDINARY HIRE는 “데이터가 존재한다”는 이유만으로 데이터를 수집하지 않는다. 데이터는 아래 4가지 후보 카드 신호 중 하나로 전환될 수 있을 때만 수집하거나 연결한다.

1. **Activity** — 이 사람이 꾸준히 참여했는가?
2. **Evidence** — 이 사람이 실제로 무엇을 만들거나 제출했는가?
3. **Collaboration** — 이 사람이 다른 사람과 어떻게 일했는가?
4. **Growth** — 이 사람이 피드백을 반영하거나 책임 범위를 확장하며 성장했는가?

모든 데이터 소스는 제품 데이터로 취급되기 전에 반드시 소유자, 동의 근거, 개인정보 등급, 후보 카드 활용 목적이 정의되어야 한다.

## 2. 소스 분류

| 소스 유형 | 예시 | 주요 가치 | 기본 노출 원칙 |
| --- | --- | --- | --- |
| System-of-record data | UMC Management Solution Board, 등록 DB, 운영진 검토 상태 | 참여, 역할, 기수, 수료, 상태 | 내부/관리자용. 파트너에게는 요약만 노출 |
| Submitted artifact data | Notion 과제, Figma 링크, GitHub repo, 배포 URL, 포트폴리오, 블로그 링크 | 실제 작업 증거 | 동의와 식별 가능성에 따라 공개 링크 또는 큐레이션 요약 |
| Community activity data | Discord 활동, 피어 리뷰, 댓글, 스터디 참여 | 협업성, 신뢰성, 커뮤니티 신호 | 내부/관리자용. 파트너에게는 안전한 요약만 노출 |
| Operator judgment data | 운영진 메모, 검토 상태, evidence confidence, 추천 역할 | 큐레이션, 리스크 통제, 매칭 해석 | 내부/관리자용. 파트너에게는 안전한 label만 노출 |
| Partner interaction data | 기업 shortlist, 문의, 추가 정보 요청, 파트너 피드백 | 수요 신호, 카드 품질, 시장 적합도 | 내부 제품 분석용. 외부에는 aggregate만 노출 |
| Research data | 파트너 인터뷰, 인재 설문, 사용성 테스트 메모 | 문제 검증, 필드 우선순위, 가격/포지셔닝 인사이트 | 비공개 리서치 공간. GitHub에는 익명화된 synthesis만 반영 |

## 3. UMC Management Solution Board 소스 맵

UMC Management Solution Board는 참여, 과제, 역할, 수료 상태를 연결할 수 있기 때문에 초기 고가치 구조화 데이터 소스가 될 수 있다.

| Board 데이터 | 제품 신호 | 후보 카드 활용 | 개인정보 등급 | 메모 |
| --- | --- | --- | --- | --- |
| 기수 / 시즌 / generation | Context | 식별 위험이 낮을 때 “X기 참여”로 표현 | 일반화 시 partner-safe | 소규모 cohort에서는 정확 조합이 개인을 식별할 수 있으므로 주의 |
| 파트 / 트랙 / 역할 | Role fit | 추천 역할과 필터 | Partner-safe | FE, BE, Design, Plan/PM, Maker/Ops 등 제품 역할로 normalize |
| 팀 / 프로젝트 배정 | Collaboration context | 팀 프로젝트 참여 여부 | Restricted summary | 팀명이 개인을 식별할 수 있으므로 동의 전에는 요약 처리 |
| 출석 / 참여 횟수 | Activity | 신뢰성 지표 | 범위/label로 partner-safe | raw 출석 로그보다 “high participation” 같은 label 선호 |
| 과제 제출 상태 | Activity / reliability | 완료 일관성 | rate/label로 partner-safe | 미제출 상세 내역은 관련성과 동의가 없으면 노출하지 않음 |
| 과제 링크 | Evidence | 작업 샘플과 산출물 요약 | 링크별 상이 | 공개 링크도 동의와 식별 가능성 검토 필요 |
| 제출 시각 / 마감 준수 | Reliability | timeliness 신호 | 내부용. 요약 label만 노출 | raw timestamp 대신 “consistent deadline adherence”로 표현 |
| 피어 리뷰 참여 | Collaboration | 협업/피드백 신호 | 요약 시 partner-safe | raw peer comment는 명시 승인 전까지 비공개 |
| 받은 피드백 / 리뷰 점수 | Growth / quality | 개선 및 품질 신호 | 내부용. 요약 label만 노출 | private comment로 개인을 ranking하지 않음 |
| 최종 프로젝트 / 데모 / 배포 링크 | Evidence | 가장 강한 작업 증거 | 공개 또는 큐레이션 요약 | 링크에 개인 연락처/팀 내부 정보가 드러나는지 확인 필요 |
| 수료 / certificate 상태 | Baseline qualification | 프로그램 완료 신호 | Partner-safe | 단독 품질 proxy가 되어서는 안 됨 |
| 리더십 / 운영진 역할 | Collaboration / responsibility | 책임감 신호 | 비식별화 시 partner-safe | 노출 전 title과 실제 scope 확인 필요 |

### 확인된 UMC Board 범위

공유된 7th, 8th, 9th, 10th UMC Management Solution Board 스프레드시트는 헤더/스키마 수준으로만 확인했다. 각 Board는 구조적으로 유사하지만, 후반 기수로 갈수록 지부별 탭과 점수/이벤트 관리 탭이 추가된다. 이는 스키마 근거일 뿐이며, row-level 개인정보를 수집하거나 노출해도 된다는 의미가 아니다.

| Board | 확인된 탭 | 후보 카드 관점의 가치 | 제품상 주의점 |
| --- | --- | --- | --- |
| 7th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `상/벌점 제출`, `회장단 회의 참석 여부` | 기본 멤버 registry, 학교/지부별 규모, 점수/벌점 이벤트, 리더십 참석 | 직접 식별자와 이벤트 사유가 포함될 수 있으므로 파트너 노출은 요약만 가능 |
| 8th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `회장단 회의 참석 여부`, 지부별 탭 | 지부별 챌린저 점수/선정/벌점 요약 강화 | 지부 탭에도 개인 식별자가 반복되므로 내부 normalized candidate ID만 사용 |
| 9th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `회장단 회의 참석 여부`, 지부별 탭 | senior/branch 필드와 role/part segmentation 강화 | 중복 지부 컬럼과 수정된 Discord email 필드 normalize 필요 |
| 10th UMC Management Solution Board | `지부/학교`, `전체 챌린저`, `회장단 회의 참석 여부`, 지부별 탭, `상벌점`, `점수 정리`, `MT 신청 매칭` | 점수 taxonomy, total score rollup, event matching/status 데이터 추가 | MT/payment/contact 필드는 기본적으로 채용 evidence가 아니라 운영 데이터 |

### 확인된 필드 그룹

| 필드 그룹 | 확인된 헤더 유형 | 유용한 신호 | Partner-safe projection | 기본 처리 |
| --- | --- | --- | --- | --- |
| Candidate identity | challenger ID/number, school, nickname, name, birth date, phone, gender, student number, major | 내부 identity resolution과 deduplication | 익명 candidate ID, 안전한 경우 broad school/region | Restricted. 직접 식별자는 기본 노출 금지 |
| Contact/account linkage | Notion email, Discord email/raw/corrected email, Discord role-invite link | 계정 매칭과 source linkage | 후보자가 명시적으로 공개 연락 경로를 제공한 경우 외에는 없음 | Restricted. 내부 매칭에만 사용 |
| Role/track context | part, project part, branch, senior status, operator status, school/central staff title | 역할 적합도, 책임감, cohort context | normalize된 role/track과 responsibility label | normalize 후 partner-safe |
| School/branch aggregate | branch, school name, part counts, project-member total, total challengers, operators, dues/payment flags, LT attendance flags | 공급 규모와 cohort context | role/branch별 talent-pool availability aggregate | aggregate만 사용. 학교 운영진 연락처 노출 금지 |
| Score/activity summary | score, total score, best workbook selection week/count, bonus/penalty score, three-strike/dropout flag | activity, reliability, growth/quality proxy | `high activity`, `needs review`, `not eligible` 같은 qualitative label | 내부 우선. partner label은 rubric과 이의제기 경로 필요 |
| Score/event reason | bonus/penalty/dropout reason, confirmation status, timestamp, submitter email | 운영 결정의 audit trail | 기본적으로 없음 | Restricted. 사유에는 민감 맥락이 포함될 수 있음 |
| Event/MT operations | matching status/reason, payment confirmation/amount/refund, early-leave/additional notes | 운영 관리 | 기본적으로 없음 | 별도 동의된 use case가 없으면 hiring-product scoring에서 제외 |

### Board에서 산출할 수 있는 데이터 제품

1. **Talent pool sizing** — generation, branch, school, normalized part별 후보 규모.
2. **Candidate registry base** — generation + challenger ID/number 기반의 stable internal candidate identity.
3. **Role-fit seed** — part/project part, senior status, operator title 기반의 초기 역할 적합도.
4. **Activity/reliability label** — score, best-workbook selection, penalty/dropout flag, completion/attendance-like marker 기반의 활동/신뢰성 label.
5. **Responsibility label** — school/central operator status와 leadership title 기반의 책임감 신호.
6. **Risk/exclusion queue** — dropout/three-strike/penalty 신호가 있어 파트너 노출 전 사람 검토가 필요한 후보 queue.
7. **Data quality queue** — 누락/중복/수정된 Discord/Notion 필드, 애매한 branch/part 필드를 정리하기 위한 queue.

### Board-to-product 정규화 원칙

- 내부 stable key는 `generation + challenger_id`를 사용한다. 이름, 전화번호, 이메일, Discord 필드는 partner-facing ID로 사용하지 않는다.
- part label은 NE(O)RDINARY HIRE 역할로 변환한 뒤 필터링한다: Plan/PM, Design, Web/FE, Server/BE, Android, iOS, Ops/Leadership.
- 점수와 이벤트 이력은 파트너 노출 전 qualitative review state로 변환한다: `strong_signal`, `normal_signal`, `needs_operator_review`, `not_partner_ready`.
- bonus/penalty reason은 operator-only evidence로 취급한다. review trigger로는 쓸 수 있지만 인용하거나 노출하지 않는다.
- MT/payment/attendance-operation 필드는 별도 제품 결정이 없으면 채용 판단 데이터로 쓰지 않는다.
- Board-derived candidate가 company-review-ready가 되려면 동의와 artifact evidence가 필요하다.

## 4. 파생 신호 분류

원천 데이터는 기업 노출 전에 normalize된 signal로 변환되어야 한다.

| 신호 | 파생 기준 | 후보 카드 표현 | 리스크 |
| --- | --- | --- | --- |
| Participation consistency | 출석, 제출, 활동 횟수 | “프로그램 활동 전반에서 높은 일관성” | 결석에 사적 사유가 있었을 수 있으므로 불공정해질 수 있음 |
| Delivery reliability | 마감 준수, 최종 프로젝트 완료 | “핵심 산출물을 기한 내 제출” | 처벌적 세부 정보 노출 방지 |
| Role fit | track, 과제, 프로젝트 역할, tech stack | “Frontend / Product Planning fit” | 역할 normalize 필요 |
| Evidence strength | 산출물 품질, 배포 URL, repo/Figma/Notion 완성도 | “강한 프로젝트 evidence 보유” | 품질 rubric이 설명 가능해야 함 |
| Collaboration signal | 피어 리뷰, 팀 참여, 리더십 역할 | “피드백/협업 참여가 활발함” | raw comment는 민감 정보 |
| Growth signal | revision history, feedback reflection, assignment progression | “피드백 이후 구조 개선” | 비교 기준을 신중히 설정하고 과장 금지 |
| Availability fit | registration, updated availability | “part-time/project/full-time 검토 가능” | 빠르게 낡는 정보 |
| Partner demand signal | shortlist, inquiry, missing-info request | “파트너 관심 발생” | 한 파트너의 관심을 다른 파트너에게 노출하지 않음 |

## 5. 후보 카드 데이터 그룹

### MVP card에 필요한 데이터

- 익명 candidate ID
- role/track normalization
- 현재성 있는 availability/work preference
- 가장 강한 evidence summary 2~4개
- evidence confidence label
- collaboration/activity summary
- fit score 또는 fit level과 rationale
- controlled inquiry CTA

### 유용하지만 gated 처리해야 하는 데이터

- 공개 포트폴리오 링크
- GitHub/Figma/Notion/deployed URL
- 구체적인 프로젝트명
- 팀 내 역할 상세
- 프로그램/cohort 상세

### 기본적으로 company view에서 금지되는 데이터

- 이름
- 이메일
- 전화번호
- Discord ID, handle, message ID, raw message, raw channel context
- raw private Drive file ID 또는 excerpt
- raw Board row, 출석 로그, 점수, peer comment, private feedback
- 내부 운영진 메모
- 파트너/고객 confidential material

## 6. 소스별 데이터 준비도 체크리스트

소스를 제품 또는 scoring에 사용하기 전 아래 질문에 답해야 한다.

- [ ] 이 소스의 운영 소유자는 누구인가?
- [ ] 이 use case에 대한 명시적 또는 묵시적 동의가 있는가?
- [ ] 이 소스는 public, private, partner-confidential, internal-only 중 무엇인가?
- [ ] Activity, Evidence, Collaboration, Growth 중 어떤 후보 카드 신호를 지원하는가?
- [ ] partner-safe projection은 무엇인가?
- [ ] 절대 노출하면 안 되는 것은 무엇인가?
- [ ] 데이터는 얼마나 최신이며 언제 만료되는가?
- [ ] human operator가 override 또는 correction할 수 있는가?
- [ ] quality/confidence label이 있는가?

## 7. 우선 연동 순서

1. **Registration DB** — role, stack, availability, portfolio, consent baseline.
2. **UMC Management Solution Board** — 구조화된 참여, 과제, 역할, 수료 상태.
3. **Submitted artifact links** — Notion/Figma/GitHub/deployed URL을 evidence로 사용.
4. **Operator review labels** — evidence confidence, recommended role, privacy approval.
5. **Partner interactions** — shortlist, inquiry, missing-info request.
6. **Community activity summaries** — Discord/peer/community signal은 더 엄격한 privacy review 이후 사용.

## 8. 남은 의사결정

1. pilot에서 어떤 Board 접근 방식을 사용할 것인가: export, API, manual sanitized upload?
2. 어떤 Board 필드가 recruiting/talent-review use에 대한 동의를 이미 확보하고 있는가? 특히 score/event와 branch-level field.
3. Board-derived signal은 exact number, range, qualitative label 중 어떤 방식으로 보여줄 것인가?
4. 후보가 company-review-ready가 되기 위한 최소 artifact evidence는 무엇인가?
5. partner exposure용 public portfolio/project link는 누가 승인할 수 있는가?
6. availability와 Board-derived status는 얼마나 자주 refresh해야 하는가?
7. peer review data는 내부용으로만 쓸 것인가, partner-safe collaboration label로 전환할 것인가?

## 9. 첫 실무 데이터 추출

첫 pilot에서는 10~20명의 sanitized sample table을 만들고 아래 컬럼만 사용한다.

| 컬럼 | 목적 |
| --- | --- |
| source_generation | 7th/8th/9th/10th 같은 Board generation |
| source_challenger_key | generation + challenger ID로 만든 internal key. 파트너에게 노출하지 않음 |
| anonymous_candidate_id | partner-safe candidate reference |
| normalized_role | 카드 역할과 필터 |
| track_or_part | role-fit source |
| participation_label | activity signal |
| assignment_completion_label | reliability signal |
| strongest_artifact_type | evidence category |
| strongest_artifact_summary | partner-safe work proof |
| collaboration_label | team/peer/community signal |
| growth_label | improvement signal |
| evidence_confidence | operator trust label |
| board_review_state | `strong_signal`, `normal_signal`, `needs_operator_review`, `not_partner_ready` |
| consent_status | recruiting/talent-review use가 확인되었는지 여부 |
| exposure_status | `partner_safe`, `needs_review`, `operator_only` |
| next_missing_data | partner view 전 추가로 수집해야 하는 데이터 |

이 sample은 scoring automation 또는 partner-facing import 전에 반드시 사람이 수동 검토해야 한다.

## 10. Google Drive 발견 후보와 활용 원칙

Google Drive 검색은 메타데이터 수준의 후보 발굴로만 수행했다. Drive에 존재하는 파일명, 원문, 개인 식별자, 파일 ID, 링크, row-level 데이터는 이 GitHub 문서에 옮기지 않는다. Drive 자료는 `원천 데이터`가 아니라, 먼저 소유자·동의·민감도·제품 신호를 판정해야 하는 `발견 후보`로 취급한다.

### 발견된 후보 범주

| Drive 후보 범주 | 제품상 가치 | 후보 카드 연결 | 기본 처리 |
| --- | --- | --- | --- |
| NE(O)RDINARY / UMC 회의록 | 파트너 문제, 운영 의사결정, 포지셔닝, 현장 니즈 확인 | Research / Partner demand | 익명화된 synthesis만 SOT에 반영. 원문과 참석자 정보는 비공개 |
| 행사 소개서, 스폰서십, 제안 자료 | 기업/기관이 반응하는 메시지, 시장 포지셔닝, 제안 구조 확인 | Partner demand / Positioning | 공개 가능 여부 확인 전까지 partner-confidential로 취급 |
| 해커톤 신청, 투표, 만족도, 인원 배치, 평가 루브릭 | 실제 참여, 산출물, 평가 기준, 피드백/만족도 신호 | Activity / Evidence / Growth | 동의와 익명화 후에만 후보 신호로 전환. raw 응답은 비공개 |
| 인재풀, 채용 추천, 후보 DB 성격의 Sheet | 가장 직접적인 후보 registry와 채용 관심/추천 신호 | Candidate registry / Availability / Role fit | 최우선 검토 대상이지만 highly restricted. 명시 동의와 접근권한 정리 전까지 내부용 |
| 이력서, 포트폴리오, file response 폴더 | 후보가 직접 제출한 강한 작업 증거 | Submitted artifact / Evidence | 후보별 공개 승인 또는 opt-in 없이는 파트너 노출 금지. 원본 파일은 운영자 검토용 |
| 운영비, 권한, 예산, 업무분담, 행사 운영 문서 | 데이터 거버넌스, 접근권한, 운영 맥락 확인 | Governance / Audit | 후보 scoring에는 사용하지 않음. 권한·보존·책임자 확인에만 사용 |

### Drive-to-product 처리 규칙

1. Drive 파일은 먼저 `category`, `owner`, `sensitivity`, `consent_basis`, `candidate_signal`, `partner_safe_projection`만 inventory화한다.
2. 공개 GitHub, 파트너-facing 카드, PR comment에는 raw Drive 링크, 파일 ID, 원문 excerpt, 개인명, 연락처, 후보별 식별 정보를 넣지 않는다.
3. 회의록과 제안 자료는 문제 정의, 포지셔닝, 파트너 니즈 가설을 강화하는 데 사용하되, 후보 평가 데이터로 직접 사용하지 않는다.
4. Sheet/Form 응답은 sanitized export와 consent map이 준비된 뒤에만 candidate registry 또는 signal source로 연결한다.
5. 이력서/포트폴리오 파일은 Drive에서 자동 수집하지 않고, 후보자가 HIRE 용도로 공개 승인한 링크 또는 요약만 후보 카드 evidence로 사용한다.
6. 운영/예산/권한 문서는 제품 데이터가 아니라 접근 통제와 감사 기준을 정하는 참고 자료로만 사용한다.

### Drive 후보 우선순위

1. **인재풀/채용 추천 Sheet** — 후보 registry, availability, role fit을 확인할 수 있는 1순위 후보. 단, consent-gated.
2. **해커톤 루브릭/Form/만족도/배치 자료** — Activity, Evidence, Growth 신호를 정의하는 데 유용한 2순위 후보.
3. **포트폴리오/File response 폴더** — 강한 evidence 후보이지만 후보별 공개 승인이 필요하다.
4. **회의록/제안 자료** — 문제 정의, 파트너 니즈, 메시지 검증에 사용한다.
5. **운영비/권한/예산 문서** — governance와 access policy 참고로만 사용한다.

### 세션에서 맞춰야 할 기획 포인트

- Drive 안에서 NE(O)RDINARY HIRE의 authoritative source-of-record로 인정할 폴더/Sheet는 무엇인가?
- 기존 신청서/Form에 “인재 추천·채용 검토·기업 소개” 목적의 동의 문구가 포함되어 있는가?
- 기업/기관 제안 자료와 회의록은 내부 리서치에만 쓸 것인가, 공개 PRD/SOT에도 익명화 synthesis로 반영할 수 있는가?
- 후보 포트폴리오는 Drive에 있는 기존 제출물을 읽어오는 방식이 아니라, 후보가 HIRE용으로 opt-in 업로드/연결하는 방식으로 설계할 것인가?
- Drive 데이터의 보존 기간, 접근 권한, 삭제 요청, 후보별 정정 요청은 누가 운영 책임을 지는가?
