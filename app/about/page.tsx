// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). lib/site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { openCities } from '../../lib/data';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { BranchList, Img, JsonLd } from '../../components/Common';
import { BRAND, BRANCHES, CONTACT, FACTS, UPDATED, shareMeta, tel, smsHref } from '../../lib/site';

const TITLE = `소개 | ${BRAND}`;
const DESC = `${BRAND}는 누수탐지·수리·복구공사를 하는 곳입니다. 하는 일, 담당 지역, 지점 주소와 연락 방법을 사실대로 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <section className="phead">
        <div className="wrap phead-grid">
          <div>
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>소개</span></nav>
          <h1>{BRAND} 소개</h1>
          <p className="phead-lead">{BRAND}는 누수탐지와 누수수리, 복구공사를 하는 업체입니다.</p>
          </div>
          <figure className="phead-ph"><Img id="d1" lazy={false} /></figure>
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <h2 className="area-h">하는 일</h2>
          <p className="prose-p">{FACTS.oneStop.split(' > ').join(', ')}를 이어서 합니다. {FACTS.license}입니다.</p>
          <p className="prose-p">{FACTS.noFind}입니다. {FACTS.insurance}합니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">담당 지역과 지점</h2>
          <p className="prose-p">{FACTS.area}합니다. 동네별 안내가 있는 지역은 {openCities().join(', ')}입니다. 자세한 목록은 <Link href="/area/">지역 안내</Link>에 있습니다.</p>
          <BranchList items={BRANCHES} />
        </section>
        <section className="sec">
          <h2 className="area-h">연락 방법</h2>
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a> 또는 <a href={smsHref}>문자</a>로 받습니다. 영업시간은 {CONTACT.hours}입니다.</p>
          <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
        </section>
      </div>
    </main>
  );
}
