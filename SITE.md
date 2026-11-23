# 대정누수탐지 SEO 사이트 — 기획·운영

누수탐지 전문(탐지 > 수리 > 복구공사 원스톱) 지역 SEO 사이트. Next.js 14 정적 export.
키워드 원본 `keywords/대정누수탐지_키워드.xlsx`(region_kw_prj 에서 복사, 4,990행) 가운데 **'생성 대상' = O 인 1,000행** 이 페이지 하나씩.
지역(사용자 확정): 인천 부평·계양·남동, 서울 강서·양천·구로·금천, 광명, 시흥 (+ 그 안의 생활권·동 83곳, `scripts/places_src.py`).

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 메인: 히어로(청음탐지 사진 배경 + 현장 사진 3장 줄 + 흰 상담 카드), 원스톱 사진 카드 3장, 맡기기 전 조건표 + 누수 보험 처리 3단계, 장비 5종 카드, 파랑 상담 띠, 지점 4곳 표, 지역 9곳, FAQ, 누수 궁금증, 남색 마무리 — 사진 7장을 위쪽 두 섹션에 한 번씩만 씀 |
| `/area/`, `/area/<시구>/` | 지역 허브 9곳 — 시·구의 열린 키워드 페이지 전부로 가는 크롤 경로, 담당 지점 |
| `/<키워드>/` | 키워드 페이지 1,000 (`lib/compose.ts`: 단어 10종 × 수식어 11종 × 건물 맥락 4종 apt/villa/house/biz) |
| `/blog/`, `/blog/<슬러그>/` | 누수 궁금증 — `content/blog/*.md` 45편 작성 완료, **date 비움 = 비공개**. 큐 `content/blog/_data/keywordQueue.json` (50개, done 45 · pending 5) |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | 열린 묶음만 |

## 오픈 묶음 (`OPEN_WAVE`, post-launch 7일 안 4묶음)
순서 = 엑셀 우선순위 → 순번. `build_pages.py` 가 처음 한 번 `rebatch --plan 25,50,75,100` 으로 자른다. 다시 돌리면 기존 wave 를 이어받는다.

| 묶음 | 날짜 | 페이지 | 누적 | 내용 |
|---|---|---|---|---|
| 1 | D0 (오픈일) | 250 | 250 | 우선순위 1(시·구 누수탐지 9) + 2(시·구 누수탐지+수식어 90) + 3(생활권·동 누수탐지 83) + 4 일부 68 |
| 2 | D2 | 250 | 500 | 우선순위 4 |
| 3 | D4 | 250 | 750 | 우선순위 4 |
| 4 | D6 | 250 | 1,000 | 우선순위 4 나머지 + 5(부평역 35) |

**나머지 키워드(extra)**: 엑셀에서 '생성 대상'을 O 로 바꾸고 `python -I scripts/build_pages.py` → 새 행은 wave 5 로 붙는다 → `data/drip.json` `extra: [{"wave": 5, "date": "YYYY-MM-DD"}]`.

```bash
python -I scripts/places_src.py       # 지역 92곳 → data/places.json
python -I scripts/build_pages.py      # 엑셀(O 행) → data/site-pages.json + keywords/대정누수탐지_페이지.xlsx
python -I scripts/prepare_images.py   # source/raw → public/img/d1~d7 + data/photos.json
python -I scripts/make_og.py          # 페이지별 og (public/og, 없는 것만, --force 전부)
OPEN_WAVE=4 SITE_URL=https://도메인 npx next build
python -I ~/.claude/skills/site-launch/scripts/check_all.py C:/side_Prj/daejeong_leak_prj
bash scripts/deploy.sh <묶음 1~4> <https://도메인>   # git remote(origin) 필요 — 아직 없음
python -I scripts/drip/drip_status.py data/drip.json  # launch null → WAVE=0 POST=0
python -I scripts/drip/schedule_posts.py <오픈일 YYYY-MM-DD>  # 글 45편 date 배정(하루 1·2편 번갈아 30일) + drip.json launch 채움
```
미리보기: `npx serve out -l 18994` 또는 `python -m http.server 18994 -d out` → https://xn--od1brsj67afzfc9b6ur.kr/ (빌드 SITE_URL 기본값도 이 주소)

## 사실 근거 (지어낸 수치 없음) — `source/facts.md`
- 네이버 플레이스 4곳(2026-11-12 수집): 관악 2018360332 · 부천 2038309215 · 동작 2039634703 · 강서 2069602389
- 소개글 원문에서 쓰는 것: 누수탐지 전문업체, 국가공인 배관기능사 직접 시공, 누수 지점을 찾지 못할 경우 출장비 무료, 누수탐지 > 수리 > 복구공사 원스톱, 보험처리를 위한 서류 발급, 장비 5종(청음·가스·열화상·내시경·관로), 24시간·연중무휴, '관악구/부천을 중심으로 수도권 전 지역 출장 가능', 문의전화 010-8672-0482
- 쓰지 않는 것: '100% 해결·완벽 해결·A/S 보장', '믿을 수 있는', 리뷰 수, 0507 안심번호, 가격·경력 숫자
- 보험: '서류 발급'까지만. 보상 여부·범위는 약관과 보험사 판단이라고 적음
- 지점 → 담당 지역: 부평·계양·남동·시흥 → 부천 / 강서·양천·구로 → 강서 / 금천·광명 → 관악 (`places_src.py` CITIES.branch).
- 사진: 플레이스 업체 사진 16장 중 7장. 광고 배너('100% 해결')·자격증(이름)·안내 카드·중복 사진 제외 (`prepare_images.py`)

## 디자인 (2026-11-13 개편 — 상담형 랜딩)
참고: `C:/side_Prj/web_Agency/public/references/insurance/index.html` (보험 비교 상담 랜딩). 빌린 것: 흰 고정 헤더(로고 | 상담전화 번호 + 파랑 버튼), 사진 위 파랑 덮개 히어로 + 오른쪽 흰 상담 카드, 가운데 정렬 섹션 머리 + 설명, 흰/회색 교대 리듬, 사진 얹은 카드, 표, 화살표로 잇는 단계, 사진 붙은 마무리. 안 빌린 것: 스톡 사진(우리 현장 사진 7장만), 알약 배지, 후기·별점, 인증 배지, 숫자 단계(1·2·3), '지금 바로' 카피.
파랑 #1f52c7(강조 1색) + 흰 + 쿨그레이 #f2f4f8 + 옅은 파랑 #e8effc + 짙은 남색 #0e1d3a. Pretendard 800. 모서리 4px.
- 버튼: 파랑 2칸 슬랩(번호 | 화살표, 남색이 아래서 차오르는 호버), 어두운 바탕에선 흰 슬랩 + 밑줄 텍스트 링크
- 섹션 머리: 가운데 정렬, 위에 짧은 파랑 선이 그려지며 등장 (번호 없음)
- 홈 히어로: d1 사진 + 파랑→남색 덮개(오른쪽은 옅게), 왼쪽 제목·리드·현장 사진 3장(d5·d6·d2, 2026-11-13 사실 dl 대신), 오른쪽 '누수 · 보험 서류 상담' 카드(통화 때 듣는 4가지 + 전화 버튼 + 약관 안내)
- 맡기기 전 조건: 표(th 옅은 파랑) + 계량기 사진, 아래 '누수 보험 처리까지' 3단계(원인 확인 > 수리·복구공사 > 서류 발급) 화살표
- 지점: 위치 개략도(SVG) 삭제 → 표(지점 | 담당 지역 | 플레이스 주소). 지역은 places.json CITIES.branch 에 그 지점이 들어 있는 시·구. 모바일은 행을 세로로 쌓음. 키워드 페이지는 해당 지점 한 줄(compact)
- 키워드 페이지: 파랑→남색 머리 + 오른쪽 흰 요약 카드(맨 위 사진), 머리 바로 아래 사진 3장 줄(photosFor 4장: [0] 카드, [1..3] 줄), 진행 순서는 번호 대신 화살표 카드
- 거리 표현 금지(2026-11-13): '○○ 지점에서 출발/출장·가까운·거리' 대신 '담당 지점·방문'. CITIES.route 는 담당 구역 문장
- 금지 지킴: 이모지·알약 버튼·라벨 칩·숫자 띠·섹션 번호·베이지·마키·장식 도식
- 파비콘: 남색 사각 + 빨강 물방울 + 흰 수평선 (`app/icon.png`, `app/apple-icon.png`, `public/favicon.ico`) — 헤더 로고 마크는 파랑 사각 + 흰 물방울

## 받아야 할 정보 → `lib/site.ts`
- [ ] 도메인 (`SITE_URL`, `data/drip.json` siteUrl, `scripts/build_pages.py` SITE_URL — 지금 `https://xn--od1brsj67afzfc9b6ur.kr`)
- [ ] 오픈일 → `schedule_posts.py <날짜>` (drip.json launch 도 채워짐)
- [ ] 서치어드바이저·서치콘솔 소유확인 코드 (`NAVER_VERIFY`, `GOOGLE_VERIFY` 자리 있음)
- [ ] 사업자등록번호·대표자명 (플레이스에 없음)
- [ ] 자격증 사진 사용 여부(이름 노출이라 지금은 뺌)
- [ ] GitHub 저장소(deploy 브랜치용 remote)

## h1 수식어·레이 구조 적용(2026-11-24)
키워드 페이지 1,000쪽: h1 = 키워드 + 수식어(`.hero-sub`, 수식어 묶음별 3~4벌 해시), 분류 줄 → 설명 → "{키워드} 핵심 요약"(결론 + 정보 칸 4) → 번호 절 6개(한 문단, 4개 h2에 키워드 전체) → 사진 3 → "{키워드} 자주 묻는 질문" → 관련 링크 3묶음. description 45~80자(키워드 — 관련 키워드 2~3개 · 페이지 사실 · 상담 전화). 조합기 `lib/compose.ts` 의 `ray()`·`desc80()`, 점검 `python -I scripts/ray_check.py out --group service,mod`.
측정(빌드 결과): h1 중복 0 · description 55~80자 중복 0 · 키워드 든 h2 평균 7.1 · 절 문단 평균 238자(공백 제외) · 본문 평균 2,292자 · 내부링크 10~15 · 같은 주제(서비스·수식어) 같은 문장 평균 18.5% 최대 28.8% · 같은 동네 평균 33.3% · 조사 의심 0. check_all: SEO·중복·AI 티·화면·답 틀 통과, FAQ·Q&A 는 /qna/ 메뉴가 원래 없어 미달(이번 작업 범위 밖).

