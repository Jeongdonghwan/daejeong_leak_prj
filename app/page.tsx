import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, OPEN_PAGES, PLACES, openCities, cityPath, cityMain, pagePath, pageEncodedPath, inSitemap } from '../lib/data';
import { TOOLS } from '../lib/compose';
import { getPosts, postPath } from '../lib/blog';
import { BRAND, CONTACT, FACTS, BRANCHES, shareMeta } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { Actions, BranchList, Img, IconArrow, JsonLd, SectionHead } from '../components/Common';

const HOME_TITLE = `${BRAND} | 누수탐지·수리·복구공사 원스톱, 수도권 출장`;
const HOME_DESC = '청음·가스·열화상·내시경·관로탐지기로 누수 지점을 찾고, 국가공인 배관기능사가 수리·복구공사까지. 누수 지점을 못 찾으면 출장비 무료, 보험처리용 서류 발급, 24시간 연중무휴.';
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 누수탐지·수리·복구공사`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

const ONESTOP = [
  { t: '누수탐지', d: '계량기·밸브로 배관 계통을 나누고 장비 5종으로 새는 지점을 좁힙니다.', ph: 'd7' },
  { t: '수리', d: '찾은 자리만 작게 열어 국가공인 배관기능사가 배관·부속을 교체합니다.', ph: 'd3' },
  { t: '복구공사', d: '되메움부터 타일·마루·장판 마감까지 같은 팀이 이어서 되돌립니다.', ph: 'd4' },
];
// 히어로 사진 줄 — d1(배경)·원스톱 카드(d7·d3·d4)와 겹치지 않는 세 장
const HERO_SHOTS: [string, string][] = [
  ['d5', '보일러 배관 계통 나누기'],
  ['d6', '분배기에서 방별 배관 확인'],
  ['d2', '계량기함 압력 확인'],
];
const TERMS: [string, string][] = [
  ['못 찾으면', FACTS.noFind],
  ['시공', FACTS.license],
  ['보험', `${FACTS.insurance} — 보상 여부·범위는 가입한 보험의 약관과 보험사 판단에 따릅니다`],
  ['상담', `${CONTACT.hours} · 대표번호 ${CONTACT.phone}`],
  ['현장', '가정집 · 아파트 · 빌라 · 원룸 · 상가 / 천장 · 화장실 · 배관 · 보일러 · 베란다 · 외벽 누수'],
];
const INS: [string, string][] = [
  ['원인 확인', '장비로 누수 지점과 원인을 찾습니다. 못 찾으면 출장비는 받지 않습니다.'],
  ['수리 · 복구공사', '국가공인 배관기능사가 고치고, 깬 자리를 마감까지 되돌립니다.'],
  ['서류 발급', '보험 처리에 필요한 원인·수리 내용 서류를 발급합니다.'],
];
const FAQ = [
  { q: '어느 지역까지 출장하나요?', a: '수도권 전 지역에 방문합니다. 지점은 관악·부천·동작·강서 네 곳이고, 지역마다 담당 지점이 정해져 있습니다.' },
  { q: '누수 지점을 못 찾으면 비용은요?', a: '누수 지점을 찾지 못할 경우 출장비는 받지 않습니다. 찾은 뒤의 수리·복구공사 비용은 범위를 확인하고 작업 전에 먼저 말씀드립니다.' },
  { q: '찾은 뒤 수리는 다른 곳을 불러야 하나요?', a: '아닙니다. 누수탐지 > 수리 > 복구공사까지 한 번에 합니다. 시공은 국가공인 배관기능사가 직접 합니다.' },
  { q: '보험 처리가 되나요?', a: '보상 여부와 범위는 가입한 보험의 약관과 보험사 판단에 따라 다릅니다. 대정누수탐지는 보험 처리에 필요한 원인·수리 내용 서류를 발급합니다.' },
  { q: '밤이나 휴일에도 오나요?', a: '24시간·연중무휴로 상담과 출장을 받습니다. 방문 시간은 통화로 일정을 맞춰 정합니다.' },
];

export default function Home() {
  const cities = openCities();
  const posts = getPosts().slice(0, 6);
  const pool = OPEN_PAGES.filter(inSitemap);
  const carousel = [...cities.map(cityMain).filter(Boolean), ...pool.filter((p) => PLACES[p.place].kind === '시구' && p.service === '누수탐지' && p.mod)].slice(0, 30) as typeof pool;

  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(carousel.map((p) => ({ name: p.kw, path: pageEncodedPath(p) })))]} />

      <section className="hero">
        <Img id="d1" className="hero-bg" lazy={false} alt={`${BRAND} 기사가 마루 바닥에서 청음탐지기로 누수음을 듣는 장면`} />
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="hero-over">{FACTS.area} · {CONTACT.hours}</p>
            <h1><span><i>찾고, 고치고,</i></span><span><i>되돌리는 데까지</i></span></h1>
            <p className="hero-lead">{BRAND}는 누수 지점을 장비로 찾고, 그 자리를 국가공인 배관기능사가 직접 고치고, 깬 바닥과 벽을 복구공사로 되돌립니다. 한 업체가 처음부터 끝까지 맡습니다.</p>
            <ul className="hero-shots">
              {HERO_SHOTS.map(([id, cap]) => <li key={id}><Img id={id} lazy={false} /><span>{cap}</span></li>)}
            </ul>
          </div>
          <aside className="consult" aria-label="전화 상담" data-reveal>
            <p className="consult-t">누수 · 보험 서류 상담</p>
            <p className="consult-s">통화로 네 가지를 들으면 가져갈 장비와 방문 시간이 정해집니다.</p>
            <ul className="consult-list">
              <li><b>주소</b>건물 종류와 층</li>
              <li><b>젖은 자리</b>천장 · 벽 · 바닥 · 화장실</li>
              <li><b>시작</b>처음 젖은 날</li>
              <li><b>계량기</b>수도를 다 잠갔을 때 도는지</li>
            </ul>
            <Actions />
            <p className="consult-note">보상 여부·범위는 가입한 보험의 약관과 보험사 판단에 따릅니다.</p>
          </aside>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title="누수탐지 > 수리 > 복구공사" sub="찾는 업체와 고치는 업체를 따로 부르지 않습니다. 업체가 네이버 플레이스에 올린 현장 사진으로 단계별 작업을 보여 드립니다." />
          <ol className="os-cards reveal-group">
            {ONESTOP.map((x) => <li key={x.t}><div className="os-ph"><Img id={x.ph} /></div><div className="os-body"><h3>{x.t}</h3><p>{x.d}</p></div></li>)}
          </ol>
        </section>
      </div>

      <section className="sec-gray">
        <div className="wrap">
          <SectionHead title="맡기기 전에 알아 둘 조건" />
          <table className="ttable" data-reveal><tbody>{TERMS.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
          <h3 className="flow-h" data-reveal>누수 보험 처리까지</h3>
          <ol className="flow reveal-group">
            {INS.map(([t, d]) => <li key={t}><strong>{t}</strong><p>{d}</p></li>)}
          </ol>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title="보유 장비 5종" sub="한 장비로 안 잡히는 누수는 다른 방식으로 다시 봅니다. 각 장비가 무엇을 보는지 정리했습니다." />
          <div className="toolsheet">
            {TOOLS.map((t, i) => (
              <article key={t.name} className="tool" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <h3>{t.name}</h3>
                <p>{t.d[0]}</p>
                <dl><div><dt>방식</dt><dd>{t.how}</dd></div><div><dt>쓰는 곳</dt><dd>{t.where}</dd></div><div><dt>보는 것</dt><dd>{t.see}</dd></div></dl>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-in">
          <p>수도를 다 잠갔는데 계량기가 돈다면,<br />바닥을 깨기 전에 위치부터 찾습니다.</p>
          <Actions sms={false} dark />
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title="지점 4곳과 담당 지역" sub={`전화는 지점과 상관없이 대표번호 ${CONTACT.phone} 하나로 받고, 지역마다 담당 지점이 방문합니다.`} />
          <BranchList items={BRANCHES} />
        </section>
      </div>

      <section className="sec-gray">
        <div className="wrap">
          <SectionHead title="지역별 누수탐지 안내" sub="지역을 고르면 동네별 누수탐지·누수수리·천장·화장실·배관 누수 안내로 이어집니다." />
          <ul className="citylist">
            {cities.map((c) => {
              const m = cityMain(c);
              return (
                <li key={c} data-reveal>
                  <Link href={cityPath(c)} className="cl-name">{c}<small>{CITIES[c].full}</small></Link>
                  <p>{CITIES[c].traits}</p>
                  {m && <Link href={pagePath(m)} className="btn-text">{m.kw} <IconArrow /></Link>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>
      </div>

      <section className="sec-gray">
        <div className="wrap">
          <SectionHead title="누수 궁금증" sub="상담 때 자주 받는 질문을 한 편에 하나씩 답합니다." />
          {posts.length > 0
            ? <ul className="linklist">{posts.map((p) => <li key={p.slug}><Link href={postPath(p)}>{p.title}<IconArrow /></Link></li>)}</ul>
            : <ul className="linklist">{carousel.slice(0, 6).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>}
          <p className="more-line"><Link href="/blog/" className="btn-text">누수 궁금증 전체 보기 <IconArrow /></Link></p>
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>주소와 증상만 알려 주세요</h2>
          <p>건물 종류, 처음 젖은 날, 계량기가 도는지 들으면<br />가져갈 장비와 방문 시간이 정해집니다.</p>
          <Actions dark />
        </div>
      </section>
    </main>
  );
}
