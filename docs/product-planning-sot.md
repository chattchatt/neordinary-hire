# Product Planning SOT — NE(O)RDINARY HIRE

**Status:** Draft for planning sync
**Last refreshed:** 2026-07-01
**Owner:** Product / Operator
**Repository boundary:** public-safe synthesis only. Do not paste raw workbook text, private PDFs, community logs, Drive excerpts, partner/customer names, contact data, or unapproved research evidence into this repo.

## 1. Why this SOT exists

This document is the planning source of truth for turning NE(O)RDINARY HIRE from an implementation repository into a product-managed web service. It connects problem definition, hypotheses, research, competitor learning, MVP scope, and development gates so that implementation work does not outrun product clarity.

Related execution docs:

- [`PRODUCT.md`](../PRODUCT.md) — product definition, phase, users, principles, metrics
- [`REQUIREMENTS.md`](../REQUIREMENTS.md) — functional, non-functional, business requirements
- [`ROADMAP.md`](../ROADMAP.md) — phased delivery plan
- [`DESIGN.md`](../DESIGN.md) — product/design source of truth
- [`docs/company-view-policy.md`](company-view-policy.md) — partner-facing privacy policy
- [`docs/scoring-policy.md`](scoring-policy.md) — score explanation guardrails
- [`docs/data-source-inventory.md`](data-source-inventory.md) — Data Source SOT와 후보 카드 데이터 준비도

## 2. Product principle

**Invariant principle:** convert real community/project/collaboration evidence into trustworthy opportunity, without exposing talent identity before there is a qualified partner need.

This means NE(O)RDINARY HIRE should not be framed as “AI recruiting” or a generic ATS. AI and automation may help curation, summarization, and operations, but the product essence is the trusted transformation of observed participation into partner-safe opportunity.

**Applied direction:**

- Evidence before claims.
- Anonymity before direct fit confirmation.
- Operator accountability before automation.
- Smaller verified loops before broad hiring-market expansion.

## 3. Current planning thesis

Partner companies and institutions struggle to evaluate early/community-based talent because useful evidence is fragmented across projects, community activity, portfolios, and operator memory. NE(O)RDINARY HIRE should first prove that a partner can make a higher-confidence shortlist from anonymized, curated evidence than from a resume-only view.

## 4. Problem definition

### Core problem

Partners want to judge real capability, collaboration style, and opportunity fit, but the evidence exists in scattered community/project contexts and cannot be safely shared as raw identity-linked data.

### One-line problem statement

Community-based talent has meaningful evidence that resumes do not capture, but partners cannot review that evidence quickly and safely without privacy risk or heavy operator mediation.

### Root-cause summary

- Valuable signals are distributed across registration forms, portfolios, community activity, project files, and operator notes.
- Raw evidence often contains identity, private context, or irrelevant noise.
- Partners need enough context to decide next steps, not a larger unfiltered candidate pool.
- Early talent may have strong potential but weak traditional credentials.
- Operators need a repeatable way to curate and broker demand without manually rebuilding every candidate narrative.

## 5. Users and jobs-to-be-done

| User | Functional job | Emotional job | Social/business job | Success signal |
| --- | --- | --- | --- | --- |
| Talent | Register once and let reviewed evidence support future opportunities. | Feel protected from premature exposure or unfair judgment. | Be recognized for real contribution, not only resume polish. | Consent is clear; private details stay hidden; opportunity handoff feels safe. |
| Operator/Admin | Curate evidence into partner-safe profiles and resolve uncertainty. | Feel confident that nothing sensitive leaks. | Turn community trust into repeatable partner value. | Profiles are ready, explainable, and auditable. |
| Partner company/institution | Review anonymized candidates and decide who is worth a next-step inquiry. | Feel that time is not wasted on weak or unverifiable profiles. | Reduce hiring/project discovery risk through trusted curation. | Partner can shortlist/inquire without raw personal data. |

## 6. Product hypotheses to validate

| Hypothesis | Current status | Validation method | Decision it should unlock |
| --- | --- | --- | --- |
| H1. Anonymous candidate cards with score reasoning reduce partner shortlist time. | Needs validation | Partner walkthrough using 5–10 anonymized sample cards; measure “can decide / cannot decide” and missing-info requests. | Card/detail information hierarchy and scoring copy. |
| H2. Anonymous review plus operator-mediated inquiry lowers talent consent friction. | Needs validation | Talent survey/interview on privacy comfort, allowed evidence, and acceptable next-step exposure. | Consent copy, exposure thresholds, and portfolio link policy. |
| H3. Curated evidence dashboard lowers manual operator intro work. | Needs validation | Operator time study before/after profile curation template; track minutes per candidate and rework count. | Admin workflow priority and evidence quality tooling. |
| H4. Partners prefer fewer high-trust candidates over broad search volume for this use case. | Needs validation | Partner interviews comparing “curated shortlist” vs “search/filter marketplace” expectations. | Whether MVP stays concierge/dashboard-first or expands toward marketplace features. |

## 7. MVP proposition

### MVP promise

A partner can open a protected web dashboard, compare anonymized candidate profiles, understand why each candidate may fit, save a shortlist, and request an operator-mediated next step without seeing forbidden private data.

### MVP surfaces

- Talent intake: `/register`, `/register/quick`
- Operator curation: `/admin`, `/admin/members/[id]`
- Partner review: `/company`, future `/company/[candidate]`
- Controlled inquiry: partner CTA routed to operator workflow

### MVP must include

- Anonymous labels instead of direct identity.
- Role, stack, availability, and work preference when non-identifying.
- Curated project/community evidence summary.
- Evidence confidence or review-needed labels.
- Score explanation in plain language.
- Shortlist/inquiry loop.
- Privacy verification for company-facing output.

### MVP must not include yet

- Full ATS pipeline management.
- Automated final hiring decisions.
- Public candidate profile pages.
- Raw Discord logs, raw Drive excerpts, internal notes, contact info, or private partner/customer material.
- Broad market claims that exceed pilot evidence.

## 8. Competitive framing

| Competitor type | Example | What to learn | Gap / opportunity for NE(O)RDINARY HIRE |
| --- | --- | --- | --- |
| Direct hiring marketplace | Wanted | Concise candidate/job matching, efficient shortlist UX, outcome-linked business model. | Resume/profile-centered matching does not deeply encode community contribution context. |
| Developer hiring platform | Jumpit | Developer-friendly role/stack expression and job context. | Skill/stack filters alone do not explain collaboration evidence or operator trust. |
| Talent search / outbound solution | Remember recruiting solutions | Company-side search demand, outbound workflow, human/AI curation patterns. | Strong search tools still require identity exposure and do not start from community evidence. |

### Differentiation thesis

NE(O)RDINARY HIRE should win narrowly by combining: community-origin evidence + operator curation + anonymous-first partner review + controlled next-step brokerage.

## 9. Market framing for planning

Market sizing should be treated as a planning input, not proof. External market numbers from desk research must be re-verified before investor, partner, or public deck use.

### Practical TAM/SAM/SOM definition

| Layer | Planning definition | Current use |
| --- | --- | --- |
| TAM | Digital recruiting / talent matching / HR tech demand relevant to talent discovery. | Directional category only. |
| SAM | Korean early-career / junior / community-based tech and maker talent discovery for startups, teams, and institutions. | Defines who to interview first. |
| SOM | The number of partners and candidate-review sessions NE(O)RDINARY can realistically operate in an initial pilot year. | Operational target, not revenue promise. |

### Initial SOM operating target

Use operational capacity until pricing and conversion data exist:

- 10–30 qualified partner teams/institutions in the first focused pilot loop.
- 50–600 anonymized candidate reviews exposed to partners.
- 10–60 partner inquiries generated through controlled CTA.
- Zero privacy defects in company-facing views.

## 10. User research plan

### Partner/company research

Goal: learn what evidence is sufficient for a shortlist decision.

Minimum plan:

- 5–8 partner interviews or walkthroughs.
- Show anonymized candidate card/detail prototypes.
- Ask partners to mark: “shortlist,” “needs more evidence,” or “not relevant.”
- Capture missing evidence, confusing labels, trust blockers, and acceptable inquiry flow.

Core questions:

1. 어떤 상황에서 외부 커뮤니티 기반 인재를 검토하나요?
2. 이 후보를 다음 단계로 넘기기 위해 반드시 필요한 근거는 무엇인가요?
3. 이름/연락처 없이도 검토 가능한 정보와 불가능한 정보는 무엇인가요?
4. 점수/배지가 있다면 어떤 설명이 있어야 신뢰하나요?
5. 문의 CTA 이후 어떤 응답 속도와 방식이 필요하나요?

### Talent/community research

Goal: learn what evidence candidates are willing to expose anonymously and when identity can be revealed.

Minimum plan:

- 10–20 survey responses and 5–6 interviews.
- Segment by role: developer, designer, planner/PM, maker/operator.
- Test consent language and evidence categories.

Core questions:

1. 어떤 활동/프로젝트 증거가 본인을 잘 설명한다고 느끼나요?
2. 회사가 익명으로 먼저 봐도 괜찮은 정보는 무엇인가요?
3. 공개되면 부담스러운 정보는 무엇인가요?
4. 어떤 조건이 충족되면 이름/연락처 공개에 동의할 수 있나요?
5. 기존 채용 플랫폼에서 본인의 실제 역량이 드러나지 않았던 경험이 있나요?

## 11. 3주차 워크북 기반 기획 산출물

> 이 섹션은 3주차 워크북 원문을 보관하지 않고, NE(O)RDINARY HIRE 기획 의사결정에 필요한 산출물 구조만 제품 SOT로 변환한 것이다. 아래 내용은 실제 설문/인터뷰/운영 데이터로 검증되기 전까지 **초기 가설**이다.

### 11.1 어피니티 다이어그램 설계

**입력 데이터 후보**

- 파트너 인터뷰: “어떤 후보를 왜 보고 싶은가”, “어떤 근거가 있으면 신뢰하는가”, “어디서 검토가 오래 걸리는가”.
- 후보/커뮤니티 설문: “어떤 기회를 원하지만 어떤 노출은 부담스러운가”, “어떤 활동 증거를 공유할 의향이 있는가”.
- 운영자 관찰: UMC/NE(O)RDINARY 운영 과정에서 확인된 프로젝트 참여, 협업 태도, 산출물, 성장 신호.

**POINT 태깅 기준**

| 태그 | HIRE에서 보는 질문 |
| --- | --- |
| Problem | 파트너/후보/운영자가 반복해서 겪는 채용·추천·검토 제약은 무엇인가? |
| Opportunity | 웹서비스가 줄일 수 있는 검토 비용, 신뢰 비용, 개인정보 리스크는 무엇인가? |
| Insight | 이력서에는 없지만 실제 추천 판단에 쓰이는 맥락은 무엇인가? |
| Needs | 각 주체가 다음 단계로 이동하기 위해 반드시 충족되어야 하는 조건은 무엇인가? |
| Theme | 여러 응답에서 반복되는 핵심 주제는 무엇인가? |

**초기 인사이트 가설**

1. 파트너는 “많은 후보 풀”보다 “왜 이 후보를 검토해야 하는지 설명되는 근거”를 더 필요로 한다.
2. 후보는 기회 노출은 원하지만, 이름/연락처/원문 활동 로그가 초기에 공개되는 방식에는 부담을 느낄 가능성이 높다.
3. 운영자는 후보의 실제 맥락을 알고 있지만, 이를 반복 가능한 카드·루브릭·추천 근거로 바꾸는 데 비용이 크다.
4. 따라서 HIRE의 핵심 가치는 단순 채용 게시판이 아니라, **커뮤니티에서 관찰된 활동 evidence를 partner-safe한 shortlist 판단 단위로 변환하는 것**이다.

### 11.2 페르소나 초안

#### Persona A — 파트너 리뷰어

- **예시 프로필**: 초기 스타트업 대표, 팀 리드, 프로젝트 오너, 채용 담당자.
- **유저 스토리**: 빠르게 함께 일할 수 있는 주니어/메이커 후보를 찾고 싶지만, 이력서만으로는 실제 산출물·협업 태도·성장 속도를 판단하기 어렵다. 지인 추천은 신뢰도가 높지만 후보 풀이 좁고, 공개 채용 플랫폼은 검토 비용이 크다.
- **페인 포인트**
  - 이력서와 포트폴리오만으로 실제 협업 가능성을 판단하기 어렵다.
  - 후보 탐색과 1차 검토에 시간이 많이 든다.
  - 커뮤니티 추천은 신뢰할 수 있지만 구조화되어 있지 않다.
- **니즈**
  - 후보를 짧은 시간 안에 비교할 수 있는 표준화된 카드가 필요하다.
  - 추천 근거가 “좋은 사람”이 아니라 산출물·역할·협업 evidence로 설명되어야 한다.
  - 개인정보를 과도하게 열람하지 않고도 1차 관심 여부를 판단하고 싶다.

#### Persona B — 커뮤니티 기반 후보

- **예시 프로필**: UMC/NE(O)RDINARY 활동 경험이 있는 주니어 개발자, 디자이너, 기획자, 메이커.
- **유저 스토리**: 프로젝트와 커뮤니티 활동으로 실전 경험을 쌓았지만, 기존 이력서에는 기여도와 협업 맥락이 충분히 드러나지 않는다. 좋은 기회에 연결되고 싶지만 개인정보와 미완성된 성장 과정이 무분별하게 노출되는 것은 부담스럽다.
- **페인 포인트**
  - 커뮤니티 활동의 실제 가치가 이력서 한 줄로 축소된다.
  - 어떤 활동 evidence를 어떻게 보여줘야 할지 어렵다.
  - 초기에 이름/연락처/원문 로그가 노출되는 것에 대한 심리적 부담이 있다.
- **니즈**
  - 활동 기반 장점을 안전하게 설명해주는 프로필 구조가 필요하다.
  - 관심 있는 파트너에게만 단계적으로 신원을 공개하고 싶다.
  - 단순 합격/불합격이 아니라 어떤 강점으로 보였는지 피드백을 받고 싶다.

#### Persona C — NE(O)RDINARY 운영자

- **예시 프로필**: 커뮤니티 운영진, 프로그램 매니저, 파트너십 담당자.
- **유저 스토리**: 좋은 후보와 파트너를 연결하고 싶지만, 후보별 맥락을 매번 수동 설명해야 하고 개인정보·동의·추천 기준을 관리해야 한다. 반복 가능한 데이터 구조가 없으면 추천 품질이 사람 의존적으로 변한다.
- **페인 포인트**
  - 후보 추천 근거가 운영자 머릿속과 분산 문서에 머문다.
  - 파트너 문의마다 후보 설명을 새로 작성해야 한다.
  - 동의/노출/연락 단계가 명확하지 않으면 개인정보 리스크가 커진다.
- **니즈**
  - 후보 evidence를 표준 필드로 정리할 수 있어야 한다.
  - 파트너 문의와 후보 공개 동의 흐름이 기록되어야 한다.
  - 추천 품질을 사후에 개선할 수 있는 지표가 필요하다.

### 11.3 사용자 여정 지도 초안

#### 메인 여정: 파트너 리뷰어

| 단계 | 사용자 행동 | 감정/페인 포인트 | 제품 대응 |
| --- | --- | --- | --- |
| 1. 니즈 발생 | 프로젝트/채용/협업 후보가 필요해진다. | 빠르게 찾고 싶지만 검증 비용이 걱정된다. | 파트너용 가치 제안과 검토 가능한 후보 범위를 명확히 제시한다. |
| 2. 대시보드 접근 | 보호된 링크 또는 계정으로 후보 리스트를 본다. | “이 데이터가 믿을 만한가?”를 판단한다. | 후보 카드에 role, output, evidence, fit signal, 익명화 기준을 함께 표시한다. |
| 3. 후보 비교 | 여러 익명 후보 카드를 비교한다. | 정보가 너무 적으면 판단 불가, 너무 많으면 검토 피로가 생긴다. | 비교 가능한 핵심 필드와 shortlist/save 기능을 제공한다. |
| 4. 관심 표시 | 더 알고 싶은 후보를 저장하거나 문의한다. | 바로 연락 가능한지, 어떤 절차가 필요한지 궁금하다. | qualified inquiry 양식과 운영자 중개 상태를 제공한다. |
| 5. 신원 공개/연결 | 운영자와 후보 동의 후 다음 단계로 이동한다. | 개인정보·일정·후속 커뮤니케이션 관리가 필요하다. | 신원 공개 threshold, 동의 로그, 다음 액션 상태를 기록한다. |
| 6. 회고/반복 | 후보 품질과 매칭 결과를 평가한다. | 좋은 후보 기준을 다음 탐색에 반영하고 싶다. | 문의율, 전환율, feedback reason을 다음 카드/rubric 개선에 반영한다. |

#### 보조 여정: 후보

| 단계 | 사용자 행동 | 감정/페인 포인트 | 제품 대응 |
| --- | --- | --- | --- |
| 1. opt-in | HIRE 후보 등록/추천 참여에 동의한다. | 어디까지 공개되는지 불안하다. | 공개 범위, 익명화, 신원 공개 조건을 명확히 안내한다. |
| 2. evidence 정리 | 프로젝트/역할/성과/협업 신호를 제출한다. | 무엇을 써야 할지 어렵다. | quick register와 evidence prompt를 제공한다. |
| 3. 익명 검토 | 파트너가 익명 카드로 1차 검토한다. | 공정하게 보일지 궁금하다. | 카드 구성과 평가 기준을 후보에게도 설명 가능하게 유지한다. |
| 4. 관심 수신 | 파트너 문의가 발생한다. | 기회는 반갑지만 공개 결정이 필요하다. | 운영자 중개와 후보 동의 후 신원 공개를 원칙으로 한다. |
| 5. 후속 진행 | 인터뷰/미팅/프로젝트 논의로 이동한다. | 결과와 피드백을 알고 싶다. | 진행 상태와 가능하면 요약 피드백을 기록한다. |

### 11.4 포지셔닝 맵 초안

**추천 축**

- **X축: 공개 직접 탐색 ↔ 익명·중개형 검토**
  - HIRE의 개인정보 보호와 운영자 중개 원칙을 드러낸다.
- **Y축: 이력서 중심 주장 ↔ 검증된 활동 evidence 중심**
  - 커뮤니티 기반 산출물, 역할, 협업 신호를 차별화 기준으로 삼는다.

**상대적 위치 가설**

| 유형 | 위치 가설 | 이유 |
| --- | --- | --- |
| 일반 채용 플랫폼 | 공개 직접 탐색 + 이력서/공고 중심 | 후보 신원과 이력서 기반 검색·지원 흐름이 중심이다. |
| 비즈니스 네트워크/아웃바운드 | 공개 직접 탐색 + 관계/프로필 중심 | 직접 연락과 개인 프로필 기반 탐색이 중심이다. |
| 지인 추천/내부 추천 | 중개형 + 신뢰 기반 | 신뢰도는 높지만 구조화된 evidence와 반복 가능한 비교가 약하다. |
| NE(O)RDINARY HIRE | 익명·중개형 검토 + 활동 evidence 중심 | 커뮤니티에서 관찰된 evidence를 privacy-safe한 후보 카드로 바꾸는 포지션을 지향한다. |

### 11.5 린 캔버스 초안

| 항목 | 초안 |
| --- | --- |
| 문제 | 1) 커뮤니티 활동 evidence가 채용/협업 검토 단위로 구조화되지 않는다. 2) 파트너는 후보 검토 시간이 길고 신뢰 가능한 근거가 부족하다. 3) 후보는 기회 노출과 개인정보 보호 사이에서 부담을 느낀다. |
| 고객 세그먼트 | 1차: 검증된 주니어/메이커 후보가 필요한 파트너 회사·팀·기관. 2차: NE(O)RDINARY/UMC 기반 후보. 내부 사용자: 운영자/admin. |
| 고유 가치 제안 | “커뮤니티에서 검증된 활동 evidence를, 익명 보호와 운영자 중개를 통해 partner-safe shortlist로 전환한다.” |
| 해결 방안 | 1) 익명 후보 카드. 2) evidence/rubric 기반 비교. 3) qualified inquiry와 동의 기반 신원 공개 흐름. |
| 채널 | NE(O)RDINARY/UMC 네트워크, 파트너 BD, 해커톤·프로그램 후속 연결, warm intro, 운영자 추천. |
| 수익원 | 검증 필요: 파트너 파일럿 패키지, 월 구독형 후보 열람/문의, 성공 수수료, 프로젝트 매칭 수수료. |
| 비용 구조 | 후보 evidence 정리 운영비, 파트너 리서치/BD, 개인정보·보안 관리, 웹서비스 인프라, 운영자 검수 시간. |
| 핵심 지표 | 후보 opt-in rate, evidence completeness, partner card-to-shortlist rate, qualified inquiry rate, time-to-qualified-inquiry, identity reveal consent rate, privacy defect 0건. |
| 경쟁 우위 | NE(O)RDINARY/UMC 커뮤니티 맥락, 운영자의 신뢰, 프로젝트/협업 evidence, 개인정보 보호형 중개 흐름, 반복 가능한 추천 rubric. |

### 11.6 3주차 기준 추가 검증 과제

- 실제 리서치 응답을 기반으로 affinity group을 최소 4개 이상 확정한다.
- 메인 페르소나를 `파트너 리뷰어`로 둘지 `후보`로 둘지 결정한다. 현재 MVP 수익/검토 흐름 기준으로는 파트너 리뷰어를 메인으로 두는 것이 자연스럽다.
- 포지셔닝 맵의 축 언어를 외부 설명용으로 더 직관화한다. 예: `개인정보 공개도` × `검증 근거의 구조화 수준`.
- 린 캔버스의 수익원은 아직 검증 전이므로, 개발 전 파트너 3~5곳과 지불 의향/파일럿 조건을 확인한다.

## 12. 4주차 워크북 기반 IA·Flow·Wireframe 산출물

> 이 섹션은 4주차 워크북 원문을 보관하지 않고, NE(O)RDINARY HIRE 웹서비스 구현 전 필요한 UX 구조 산출물로 변환한 것이다. HIRE는 앱이 아니라 웹서비스이므로, 초기 검증과 파트너 공유에 유리한 **반응형 웹**을 기준으로 한다.

### 12.1 기술 스택 방향

| 항목 | 선택 | 이유 |
| --- | --- | --- |
| 서비스 형태 | 반응형 웹 | 파트너가 데스크톱에서 후보를 비교·검토할 가능성이 높고, 링크 기반 접근/공유가 MVP 검증에 적합하다. |
| 프론트엔드 | Next.js / React 기반 웹 | 현재 저장소 구조와 맞고, protected dashboard·admin·candidate page를 빠르게 확장할 수 있다. |
| 백엔드/데이터 | 초기에는 기존 DB/API 구조 유지, 필요 시 server action/API route 확장 | 후보 등록, admin 검수, partner view가 이미 제품 흐름의 핵심이므로 과도한 앱/네이티브 확장은 보류한다. |
| 앱/PWA 여부 | MVP 이후 검토 | 반복 방문·푸시·모바일 홈 진입이 핵심이 되기 전까지는 웹 링크 기반 검증이 우선이다. |

### 12.2 정보 구조도(IA) 초안

```text
NE(O)RDINARY HIRE
├─ Public / Entry
│  ├─ /                : 서비스 소개, 핵심 가치, 파트너/후보 CTA
│  ├─ /register        : 후보 상세 등록
│  └─ /register/quick  : 후보 빠른 등록
├─ Candidate Submission
│  ├─ 기본 정보 입력
│  ├─ 역할/스택/관심 영역 입력
│  ├─ 프로젝트·활동 evidence 입력
│  ├─ 공개 범위·동의 확인
│  └─ 제출 완료/수정 안내
├─ Admin
│  ├─ /admin           : 후보 리스트, 상태, 검수 큐
│  ├─ /admin/members/[id]
│  │  ├─ 후보 원본 정보 확인
│  │  ├─ evidence 정리/검수
│  │  ├─ 익명 카드 노출 여부 설정
│  │  └─ partner inquiry 상태 관리
│  └─ rubric/settings  : 역할별 evidence 기준, 공개 정책, 태그 관리(후속)
├─ Partner
│  ├─ /company         : 익명 후보 카드 리스트, 필터, shortlist
│  ├─ /company/[candidate]
│  │  ├─ 익명 후보 상세
│  │  ├─ evidence 요약
│  │  ├─ fit signal / 운영자 코멘트
│  │  └─ 문의/shortlist CTA
│  └─ inquiry/status   : 문의 상태, 운영자 중개 안내(후속)
└─ Trust / Policy
   ├─ privacy          : 개인정보 처리/익명화 원칙
   ├─ consent          : 후보 동의 범위
   └─ partner-guide    : 파트너 열람/문의 가이드
```

**IA 원칙**

- 파트너에게는 `익명 후보 비교 → 관심 표시 → 운영자 중개` 흐름만 먼저 보이게 한다.
- 후보에게는 `등록 → 공개 범위 이해 → evidence 제출 → 동의`가 명확해야 한다.
- 운영자에게는 `원본 데이터 검수 → 익명 카드 생성 → 문의 상태 관리`가 끊기지 않아야 한다.
- 신원/연락처/원문 활동 로그는 partner IA의 기본 노출 대상이 아니다.

### 12.3 서비스 플로우 차트 초안

#### 후보 등록 플로우

```text
Start
→ 후보가 /register 또는 /register/quick 진입
→ 기본 정보 입력
→ 프로젝트/활동 evidence 입력
→ 공개 범위 및 개인정보 동의 확인
→ 제출
→ [필수값 충족?]
   ├─ No: 누락 필드 안내 → 입력 보완
   └─ Yes: pending review 상태 저장
→ 운영자 검수 큐에 노출
→ End
```

#### 운영자 검수 플로우

```text
Start
→ 운영자가 /admin에서 pending 후보 확인
→ 원본 정보/evidence 검토
→ [partner-safe 카드로 만들 수 있는가?]
   ├─ No: 보완 요청 또는 비공개 유지
   └─ Yes: 익명 카드 필드 정리
→ 역할/태그/fit signal 부여
→ company dashboard 노출 승인
→ End
```

#### 파트너 검토 플로우

```text
Start
→ 파트너가 /company 접근
→ 익명 후보 카드 리스트 확인
→ 필터/정렬로 후보 비교
→ 후보 상세 확인
→ [관심 후보인가?]
   ├─ No: 리스트로 돌아가 비교 지속
   └─ Yes: shortlist 저장 또는 문의 제출
→ 운영자에게 qualified inquiry 생성
→ [후보 신원 공개 조건 충족?]
   ├─ No: 운영자 확인/추가 정보 요청
   └─ Yes: 후보 동의 확인 후 다음 단계 연결
→ End
```

### 12.4 핵심 와이어프레임 범위

초기 와이어프레임은 하이파이 디자인보다 **미드 피델리티 구조 검증**을 우선한다. 화면 문구는 더미 텍스트가 아니라 실제 후보 검토 상황에 가까운 문구를 사용한다.

| 화면 | 목적 | 주요 구성 요소 | 해결하는 페인 포인트 |
| --- | --- | --- | --- |
| Landing / Home | HIRE의 가치와 참여 경로를 설명 | 문제 정의, partner CTA, candidate CTA, privacy-safe 설명 | 서비스가 채용 플랫폼인지 추천 도구인지 모호한 문제를 줄인다. |
| Candidate Register | 후보 evidence 수집 | 기본 정보, 역할/스택, 프로젝트 evidence, 공개 동의 | 후보가 무엇을 제출해야 하는지 모르는 문제를 줄인다. |
| Admin Candidate Detail | 운영자 검수와 카드화 | 원본 정보, evidence 정리, 익명 카드 미리보기, 공개 상태 | 추천 근거가 운영자 머릿속에만 남는 문제를 줄인다. |
| Company Dashboard | 파트너 후보 비교 | 익명 카드 리스트, 필터, shortlist, 문의 CTA | 파트너가 많은 정보를 빠르게 비교하기 어려운 문제를 줄인다. |
| Company Candidate Detail | 개별 후보 판단 | role, output, evidence, fit signal, 공개 제한 안내, 문의 CTA | 이력서만으로 협업 가능성을 판단하기 어려운 문제를 줄인다. |
| Inquiry Status | 중개 진행 상태 관리 | 문의 내용, 상태, 다음 액션, 후보 동의 여부 | 관심 표시 이후 절차가 불명확한 문제를 줄인다. |

### 12.5 4주차 기준 제출/검증 산출물

- **정보 구조도**: 위 IA를 기준으로 Figma/FigJam 또는 Markdown 다이어그램으로 제출 가능하다.
- **플로우 차트**: 최소 `후보 등록`, `운영자 검수`, `파트너 검토/문의` 3개 플로우를 포함한다.
- **와이어프레임**: MVP 검증 기준으로 `Landing`, `Candidate Register`, `Admin Detail`, `Company Dashboard`, `Company Candidate Detail`을 우선 제작한다.
- **검증 포인트**: 개발 착수 전, 파트너가 익명 카드만 보고 shortlist 판단을 할 수 있는지 3~5명에게 테스트한다.

## 13. Product decisions to sync before deeper development

These are the discussion points that should be shared with the product owner before expanding implementation scope.

### P0 — blocks product direction

1. **First partner wedge:** Are we optimizing first for startups, project clients, education/institution partners, or internal NE(O)RDINARY partner leads?
2. **First talent wedge:** Do we start with developers only, or include planner/designer/maker roles from the beginning?
3. **Evidence exposure rule:** Which evidence can be shown as public links, summarized proof, score rationale, or operator-only context?
4. **Qualified inquiry definition:** What counts as a real partner need: shortlist click, inquiry form, meeting request, role match, or signed pilot?
5. **Identity reveal threshold:** At what exact step can name/contact/portfolio identity move from hidden to shared?
6. **Operator mediation level:** Should inquiry be fully manual concierge, email-based routing, CRM-like workflow, or in-product request tracking?

### P1 — shapes business and roadmap

1. **Positioning language:** Should external language say “Hire,” “Talent Review,” “Project Matching,” or “Community Talent Desk” for the first pilot?
2. **Pricing model to test:** success fee, pilot subscription, partner package, or free validation loop?
3. **Research artifact:** Should the first validation artifact be a Notion assignment-style report, a GitHub PR/SOT, a deck, or a live prototype walkthrough?
4. **Partner-specific views:** Do partners need custom role requirements and saved review sessions, or is one shared dashboard enough for MVP?
5. **Evidence quality threshold:** What minimum evidence coverage makes a candidate company-review-ready?

## 14. Planning-to-implementation gates

Before broadening engineering scope beyond Company Review MVP, complete the following gates:

- [ ] P0 partner wedge is selected.
- [ ] P0 talent wedge is selected.
- [ ] Identity reveal threshold is documented in `docs/company-view-policy.md` or a linked consent policy.
- [ ] At least 5 partner walkthroughs are summarized.
- [ ] At least 10 talent/community survey responses or 5 interviews are summarized.
- [ ] Company-facing privacy verification remains zero-defect.
- [ ] Any market-size claim used externally has a dated source and verification note.

## 15. Decision log

| Date | Decision | Why | Follow-up |
| --- | --- | --- | --- |
| 2026-07-01 | Keep GitHub SOT public-safe and sanitized. | The repo is public and must not contain private workbook/PDF/community/customer data. | Store raw research only in approved private workspace. |
| 2026-07-01 | Treat market sizing as operational SOM until pricing/conversion evidence exists. | Early service value is still being validated. | Convert to revenue SOM after partner pilots. |
| 2026-07-01 | Keep MVP partner-review-first, not ATS-first. | Core risk is whether anonymized evidence creates trustworthy next-step demand. | Revisit after partner walkthroughs. |
