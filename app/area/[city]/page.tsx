import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CITIES, PLACES, openCities, cityPages, cityEncodedPath, pagePath, pageEncodedPath, inSitemap } from '../../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { Actions, BranchList, IconArrow, JsonLd, SectionHead } from '../../../components/Common';
import { BRAND, branchOf, shareMeta } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return openCities().map((city) => ({ city }));
}
const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
const KIND: Record<string, string> = { 시구: '대표', 생활권: '생활권', 동: '동네' };

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = dec(params.city);
  if (!CITIES[city]) return {};
  const title = `${city} 누수탐지 지역 안내 | ${BRAND}`;
  const description = `${CITIES[city].full} 동네별 누수탐지·누수수리·누수공사·천장·화장실·배관·수도·아파트 누수 안내. ${branchOf(CITIES[city].branch[0]).name} 지점에서 출장, 24시간 연중무휴.`;
  return { title, description, alternates: { canonical: cityEncodedPath(city) }, ...shareMeta(`area-${city}`, `${city} 누수탐지 지역 안내`, { title, description, url: cityEncodedPath(city) }) };
}

// 시·구 허브 — 그 시·구의 열린 키워드 페이지 전부로 가는 크롤 경로
export default function CityHub({ params }: { params: { city: string } }) {
  const city = dec(params.city);
  const C = CITIES[city];
  if (!C) notFound();
  const pages = cityPages(city).filter(inSitemap);
  const keys = Array.from(new Set(pages.map((p) => p.place)));
  const kinds = ['시구', '생활권', '동'].filter((k) => keys.some((x) => PLACES[x].kind === k));
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${city} 누수탐지`, path: cityEncodedPath(city) }]),
        itemListJsonLd(pages.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="phead">
        <div className="wrap">
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span><span>{city}</span></nav>
          <h1>{city} 누수탐지 지역 안내</h1>
          <p className="phead-lead">{C.full}는 {C.traits}입니다. 출장은 {C.route}입니다. 아래에서 동네와 궁금한 내용을 고르세요.</p>
          <Actions dark />
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <SectionHead title={`${city}에서 가까운 지점`} />
          <BranchList items={C.branch.map(branchOf)} />
        </section>
        {kinds.map((k) => (
          <section key={k} className="sec">
            <SectionHead title={`${city} ${KIND[k]} 페이지`} />
            {keys.filter((x) => PLACES[x].kind === k).map((key) => (
              <div key={key} className="area-block" id={key} data-reveal>
                <h3>{PLACES[key].name} <small>· {PLACES[key].homes}</small></h3>
                <ul className="area-list">{pages.filter((p) => p.place === key).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}</ul>
              </div>
            ))}
          </section>
        ))}
        <p className="more-line"><Link href="/area/" className="btn-text">다른 지역 보기 <IconArrow /></Link></p>
      </div>
    </main>
  );
}
