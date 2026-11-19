import { SITE_URL, SITE_NAME, BRAND, CONTACT, BRANCHES, placeUrl, UPDATED } from './site';
import { existsSync } from 'fs';
import { join } from 'path';

// ListItem 썸네일(필수 — site-launch 체크리스트) — 그 페이지 og 카드: /<slug>/ → /og/<slug>.jpg, /blog/<slug>/ → /og/blog-<slug>.jpg.
// 파일이 실제로 있을 때만 붙인다(없는 이미지 주소는 넣지 않는다)
const withOg = (li: Record<string, unknown>) => {
  if (li.image || typeof li.url !== 'string') return li;
  const m = li.url.slice(SITE_URL.length).match(/^\/(?:(blog)\/)?([^/]+)\/$/);
  if (!m) return li;
  const name = `${m[1] ? 'blog-' : ''}${m[2]}.jpg`;
  return existsSync(join(process.cwd(), 'public', 'og', decodeURIComponent(name))) ? { ...li, image: `${SITE_URL}/og/${name}` } : li;
};


const region = (addr: string): [string, string] => (addr.startsWith('경기') ? ['경기도', addr.split(' ').slice(1, 3).join(' ')] : ['서울특별시', addr.split(' ')[1]]);

// 업체 — 대표 사업장은 관악 지점(소개글 '관악구/부천을 중심으로'), 지점 4곳은 department 로
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Plumber',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/d1.jpg`,
  telephone: CONTACT.phone,
  openingHours: 'Mo-Su 00:00-24:00',
  address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '서울특별시', addressLocality: '관악구', streetAddress: BRANCHES[0].addr.replace(/^서울 관악구 /, '') },
  department: BRANCHES.map((b) => {
    const [r, l] = region(b.addr);
    return {
      '@type': 'Plumber', name: `${BRAND} ${b.name}`, telephone: CONTACT.phone, url: placeUrl(b), openingHours: 'Mo-Su 00:00-24:00',
      address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: r, addressLocality: l, streetAddress: b.addr },
    };
  }),
  sameAs: BRANCHES.map(placeUrl),
  areaServed: ['인천 부평구', '인천 계양구', '인천 남동구', '서울 강서구', '서울 양천구', '서울 구로구', '서울 금천구', '경기 광명시', '경기 시흥시', '서울 관악구', '경기 부천시'],
  knowsAbout: ['누수탐지', '누수수리', '누수공사', '복구공사', '배관 누수', '천장 누수', '화장실 누수', '수도 누수', '난방배관 누수'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? BRAND : it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.type,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  areaServed: { '@type': 'Place', name: o.area },
  dateModified: UPDATED,
  provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀 ItemList — 같은 도메인 절대 URL, path 는 인코딩된 경로
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name,
    ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}),
  })).map(withOg),
});
