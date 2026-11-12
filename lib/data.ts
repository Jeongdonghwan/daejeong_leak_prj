// 데이터 로더 — data/site-pages.json(키워드 페이지), places.json(지역), photos.json(업체 사진). 빌드 전용.
import pagesData from '../data/site-pages.json';
import placesData from '../data/places.json';
import photosData from '../data/photos.json';
import { OPEN_WAVE, MERGE_VARIANTS } from './site';

export interface Page {
  n: number; no: number; kw: string; slug: string; label: string; place: string; city: string;
  service: string; mod: string; unit: string; prio: number; wave: number; alt: string; variantOf?: string;
}
export type Ctx = 'apt' | 'villa' | 'house' | 'biz';
export interface Place { key: string; name: string; city: string; admin: string; kind: string; homes: string; spots: string[]; note: string; ctx: Ctx }
export interface City { key: string; full: string; branch: string[]; traits: string; route: string }
export interface Photo { id: string; desc: string; tags: string[]; w: number; h: number }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
const openSet = new Set(OPEN_PAGES.map((p) => p.slug));
export const isOpen = (slug: string) => openSet.has(slug);

export const PLACES = placesData.places as Record<string, Place>;
export const CITIES = placesData.cities as Record<string, City>;
export const CITY_ORDER = placesData.cityOrder as string[];
export const PHOTOS = photosData.photos as Photo[];
export const photo = (id: string) => PHOTOS.find((x) => x.id === id)!;

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const cityPath = (city: string) => `/area/${city}/`;
export const cityEncodedPath = (city: string) => `/area/${encodeURIComponent(city)}/`;

export const canonicalPath = (p: Page) =>
  MERGE_VARIANTS && p.variantOf && openSet.has(p.variantOf) ? `/${encodeURIComponent(p.variantOf)}/` : pageEncodedPath(p);
export const inSitemap = (p: Page) => canonicalPath(p) === pageEncodedPath(p);

const bySlug = new Map(OPEN_PAGES.map((p) => [p.slug, p]));
export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return bySlug.get(key);
}

export const openCities = () => CITY_ORDER.filter((c) => OPEN_PAGES.some((p) => p.city === c));
export const cityPages = (city: string) => OPEN_PAGES.filter((p) => p.city === city);
// 시·구 대표 페이지 ('부평 누수탐지' 처럼 수식어 없는 누수탐지) — 열려 있을 때만
export const cityMain = (city: string) => OPEN_PAGES.find((p) => p.city === city && PLACES[p.place].kind === '시구' && p.service === '누수탐지' && !p.mod);

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 관련 페이지 — 열린 대표 페이지만. 같은 장소 다른 관점 / 같은 시·구 이웃 장소 / 다른 시·구 같은 키워드 형태
const POOL = OPEN_PAGES.filter(inSitemap);
const byPlace = new Map<string, Page[]>();
for (const x of POOL) { const a = byPlace.get(x.place) || []; a.push(x); byPlace.set(x.place, a); }
export function related(p: Page) {
  const samePlace = rotate((byPlace.get(p.place) || []).filter((x) => x.slug !== p.slug), p.slug, 'sp').slice(0, 5);
  const near = POOL.filter((x) => x.city === p.city && x.place !== p.place);
  const sameCity = rotate(near.filter((x) => x.service === p.service), p.slug, 'rel').concat(rotate(near.filter((x) => x.service !== p.service), p.slug, 'rel2')).slice(0, 5);
  const otherCities = rotate(POOL.filter((x) => x.city !== p.city && PLACES[x.place].kind === '시구' && x.service === p.service && x.mod === p.mod), p.slug, 'oc').slice(0, 4);
  return { samePlace, sameCity, otherCities };
}

// 사진 배정 — 서비스와 맞는 태그를 앞에, 슬러그 해시로 돌린다 (사진에 지역 정보가 없어 지역은 배정 기준이 아님)
const SVC_TAG: Record<string, string> = { 수도누수: '수도', 배관누수: '압력', 아파트누수: '난방', 천장누수: '청음', 화장실누수: '바닥', 누수공사: '공사', 누수수리: '공사' };
export function photosFor(p: Page, n = 3): Photo[] {
  const t = SVC_TAG[p.service];
  const fit = rotate(PHOTOS.filter((x) => t && x.tags.includes(t)), p.slug, 'ph');
  const rest = rotate(PHOTOS.filter((x) => !fit.includes(x)), p.slug, 'ph2');
  return [...fit, ...rest].slice(0, n);
}
