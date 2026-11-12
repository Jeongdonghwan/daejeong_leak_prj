# 대정누수탐지 SEO 사이트 — 기획·운영

누수탐지 전문(탐지 > 수리 > 복구공사 원스톱) 지역 SEO 사이트. Next.js 14 정적 export.
키워드 원본 `keywords/대정누수탐지_키워드.xlsx`(region_kw_prj 에서 복사, 4,990행) 가운데 **'생성 대상' = O 인 1,000행** 이 페이지 하나씩.
지역(사용자 확정): 인천 부평·계양·남동, 서울 강서·양천·구로·금천, 광명, 시흥 (+ 그 안의 생활권·동 83곳, `scripts/places_src.py`).

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 메인: 히어로(청음탐지 사진 + 기록 카드), 원스톱 3칸(남색), 맡기기 전 조건표, 장비 5종 제원표, 현장 기록 모자이크, 빨강 상담 띠, 지점 4곳 개략도 + 목록, 지역 9곳, FAQ, 누수 궁금증, 남색 마무리 |
| `/area/`, `/area/<시구>/` | 지역 허브 9곳 — 시·구의 열린 키워드 페이지 전부로 가는 크롤 경로, 가까운 지점 |
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
미리보기: `npx serve out -l 18994` 또는 `python -m http.server 18994 -d out` → http://127.0.0.1:18994/ (빌드 SITE_URL 기본값도 이 주소)

## 사실 근거 (지어낸 수치 없음) — `source/facts.md`
- 네이버 플레이스 4곳(2026-11-12 수집): 관악 2018360332 · 부천 2038309215 · 동작 2039634703 · 강서 2069602389
- 소개글 원문에서 쓰는 것: 누수탐지 전문업체, 국가공인 배관기능사 직접 시공, 누수 지점을 찾지 못할 경우 출장비 무료, 누수탐지 > 수리 > 복구공사 원스톱, 보험처리를 위한 서류 발급, 장비 5종(청음·가스·열화상·내시경·관로), 24시간·연중무휴, '관악구/부천을 중심으로 수도권 전 지역 출장 가능', 문의전화 010-8672-0482
- 쓰지 않는 것: '100% 해결·완벽 해결·A/S 보장', '믿을 수 있는', 리뷰 수, 0507 안심번호, 가격·경력 숫자
- 보험: '서류 발급'까지만. 보상 여부·범위는 약관과 보험사 판단이라고 적음
- 지점 → 출장 지역(가까운 순): 부평·계양·남동·시흥 → 부천 / 강서·양천·구로 → 강서 / 금천·광명 → 관악 (`places_src.py` CITIES.branch). 개략도는 위경도 단순 투영(실측 지도 아님)
- 사진: 플레이스 업체 사진 16장 중 7장. 광고 배너('100% 해결')·자격증(이름)·안내 카드·중복 사진 제외 (`prepare_images.py`)

## 디자인 (새 템플릿 — woori·스타누수탐지와 다르게)
남색 #13254a + 빨강 #d62b2b(강조 1색) + 흰 + 쿨그레이 #eef1f5 + 짙은 남색 #0b1834. Pretendard 800.
- 버튼: 빨강 2칸 슬랩(번호 | 화살표 칸, 남색이 아래서 차오르는 호버) + 밑줄 텍스트 링크. 모서리 0
- 섹션 머리: 왼쪽 정렬, 위에 짧은 빨강 선이 그려지며 등장 (번호 없음)
- 홈 히어로: 흰 바탕 왼쪽 큰 제목(둘째 줄 빨강) / 오른쪽 청음탐지 사진 + 남색 기록 카드(dl). 모바일은 사진이 먼저
- 원스톱: 남색 띠에 3칸(누수탐지 > 수리 > 복구공사), 위 빨강 선이 채워지며 등장
- 장비 5종: 제원표(방식·쓰는 곳·보는 것 dl). 키워드 페이지는 남색 띠에 서비스에 맞는 3종
- 지점: SVG 위치 개략도(빨강 사각 = 지점, 남색 점 = 출장 지역) + 주소 목록·가까운 지역 링크
- 키워드 페이지: 남색 머리 + 오른쪽 흰 '요약 시트'(답 먼저 + dl), 공정표형 진행 순서(01~05)
- 금지 지킴: 이모지·알약 버튼·라벨 칩·숫자 띠·섹션 번호·베이지·마키
- 파비콘: 남색 사각 + 빨강 물방울 + 흰 수평선 (`app/icon.png`, `app/apple-icon.png`, `public/favicon.ico`)

## 받아야 할 정보 → `lib/site.ts`
- [ ] 도메인 (`SITE_URL`, `data/drip.json` siteUrl, `scripts/build_pages.py` SITE_URL — 지금 `http://127.0.0.1:18994`)
- [ ] 오픈일 → `schedule_posts.py <날짜>` (drip.json launch 도 채워짐)
- [ ] 서치어드바이저·서치콘솔 소유확인 코드 (`NAVER_VERIFY`, `GOOGLE_VERIFY` 자리 있음)
- [ ] 사업자등록번호·대표자명 (플레이스에 없음)
- [ ] 자격증 사진 사용 여부(이름 노출이라 지금은 뺌)
- [ ] GitHub 저장소(deploy 브랜치용 remote)
