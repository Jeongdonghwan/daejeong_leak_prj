import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, PLACES, openCities, cityPages, cityPath, cityEncodedPath, pagePath, pageEncodedPath, inSitemap } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, BranchList, IconArrow, Img, JsonLd } from '../../components/Common';
import { BRAND, BRANCHES, FACTS, shareMeta } from '../../lib/site';

const TITLE = `지역별 누수탐지 안내 | ${BRAND}`;
const DESC = '인천 부평·계양·남동, 서울 강서·양천·구로·금천, 광명, 시흥 지역별 누수탐지·누수수리·누수공사·천장·화장실·배관·수도·아파트 누수 안내. 지역마다 담당 지점이 방문합니다.';
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/area/' },
  ...shareMeta('area', '지역별 누수탐지 안내', { title: TITLE, description: DESC, url: '/area/' }),
};

// 시·구 허브 목록 — 각 시·구의 키워드 페이지 전체는 /area/<시구>/ 에 있다
export default function AreaIndex() {
  const cities = openCities();
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }]),
        itemListJsonLd(cities.map((c) => ({ name: `${c} 누수탐지 지역 안내`, path: cityEncodedPath(c) }))),
      ]} />
      <section className="phead">
        <div className="wrap phead-grid">
          <div>
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>지역</span></nav>
          <h1>지역별 누수탐지 안내</h1>
          <p className="phead-lead">{FACTS.area}합니다. 아래 아홉 곳은 동네별 안내 페이지가 있는 지역입니다.</p>
          <Actions dark />
          </div>
          <figure className="phead-ph"><Img id="d6" lazy={false} /></figure>
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <h2 className="area-h">담당 지역과 지점</h2>
          <BranchList items={BRANCHES} />
        </section>
        {cities.map((city) => {
          const pages = cityPages(city).filter(inSitemap);
          const keys = Array.from(new Set(pages.map((p) => p.place)));
          return (
            <section key={city} className="sec area-sec">
              <h2 className="area-h"><Link href={cityPath(city)}>{city} 누수탐지 <IconArrow /></Link></h2>
              <p className="area-sub">{CITIES[city].full} · {CITIES[city].traits}</p>
              <ul className="chiplist">{keys.map((k) => <li key={k}><Link href={`${cityPath(city)}#${encodeURIComponent(k)}`}>{PLACES[k].name}</Link></li>)}</ul>
              <ul className="linklist">{pages.filter((p) => PLACES[p.place].kind === '시구').slice(0, 6).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
