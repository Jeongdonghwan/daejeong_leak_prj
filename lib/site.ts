// 사이트 설정 — 연락처·지점·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: 네이버 플레이스 4곳(2018360332 관악 · 2038309215 부천 · 2039634703 동작 · 2069602389 강서) 업체 소개글 (2026-11-12 수집, source/facts.md)
//   문의전화 010-8672-0482 (소개글 표기. 플레이스 0507 안심번호는 쓰지 않음), 24시간 영업·연중무휴.

// TODO(도메인 확정 후): SITE_URL 바꾸기 (data/drip.json·scripts/build_pages.py 도 같이). 배포: bash scripts/deploy.sh <묶음> <URL>
export const SITE_URL = process.env.SITE_URL || 'https://xn--od1brsj67afzfc9b6ur.kr';
export const BRAND = '대정누수탐지';
export const SITE_NAME = `${BRAND} | 누수탐지·수리·복구공사`;

export const CONTACT = {
  phone: '010-8672-0482',
  sms: '010-8672-0482',
  hours: '24시간 · 연중무휴',
};

// 업체 소개글 원문에 있는 것만
export const FACTS = {
  oneStop: '누수탐지 > 수리 > 복구공사',
  license: '국가공인 배관기능사 직접 시공',
  noFind: '누수 지점을 찾지 못하면 출장비 무료',
  insurance: '보험처리를 위한 서류 발급 가능',
  area: '수도권 전 지역 방문',  // 소개글 원문: '관악구/부천을 중심으로 수도권 전 지역 출장 가능' — 출발지처럼 읽혀 중심 지역은 뺌
};

// 지점 4곳 (플레이스 등록 주소). 전화는 모두 대표번호 하나.
export interface Branch { key: string; name: string; addr: string; lot: string; dong: string; place: string }
export const BRANCHES: Branch[] = [
  { key: 'gwanak', name: '관악', addr: '서울 관악구 봉천로31길 9 2층', lot: '봉천동 933-1', dong: '관악구 봉천동', place: '2018360332' },
  { key: 'bucheon', name: '부천', addr: '경기 부천시 오정구 소사로 835 7동 101호', lot: '원종동 70-1', dong: '부천시 오정구 원종동', place: '2038309215' },
  { key: 'dongjak', name: '동작', addr: '서울 동작구 등용로 38 상가동 비1H-73호', lot: '상도동 455', dong: '동작구 상도동', place: '2039634703' },
  { key: 'gangseo', name: '강서', addr: '서울 강서구 강서로 186 3층 3004호', lot: '화곡동 1052-5', dong: '강서구 화곡동', place: '2069602389' },
];
export const branchOf = (key: string) => BRANCHES.find((b) => b.key === key)!;
export const placeUrl = (b: Branch) => `https://m.place.naver.com/place/${b.place}/home`;

// 순차 오픈: 이 묶음 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다 (7일 안 4묶음 — data/drip.json, scripts/drip/)
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 1);
export const UPDATED = '2026-11-16'; // content revision date - bump when page text changes
export const MERGE_VARIANTS = false; // 엑셀 1,000행은 표기 변형이 따로 행으로 없음

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.sms.replace(/[^0-9]/g, '')}`;
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: SITE_NAME, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};

// 서치어드바이저(네이버)·서치콘솔(구글) HTML 태그 소유확인 — content 값만 (도메인 확정 후 받기)
export const NAVER_VERIFY = '4c5f4f9ce4aa9a5c66772470f3dbd2de70f1d654';
export const GOOGLE_VERIFY = '';
