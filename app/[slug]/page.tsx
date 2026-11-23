import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, canonicalPath, cityPath, cityEncodedPath, related } from '../../lib/data';
import { compose, ray } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, IconArrow, JsonLd } from '../../components/Common';

export const dynamicParams = false;

// 순차 오픈: lib/site.ts 의 OPEN_WAVE 이하 페이지만 생성
export function generateStaticParams() {
  return OPEN_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = canonicalPath(p);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    ...shareMeta(p.slug, `${p.kw} - ${BRAND}`, { title: c.title, description: c.description, url }),
  };
}

// 레이 모범 구조(2026-11-24): 분류 줄 → h1(키워드+수식어) → 설명 → 핵심 요약 → 번호 절 6개(한 문단) → 사진 → FAQ → 관련 링크
export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const r = ray(p);
  const c = r.c;
  const P = PLACES[p.place];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const [hp, ...strip] = c.photos.items;
  const relList = [...rel.samePlace, ...rel.sameCity, ...rel.otherCities].map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${p.city} 누수탐지`, path: cityEncodedPath(p.city) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, type: p.service, description: c.description, path, area: P.admin }),
        faqJsonLd(r.faq),
        itemListJsonLd(relList.length ? relList : [{ name: `${p.city} 지역 안내`, path: cityEncodedPath(p.city) }]),
      ]} />

      <section className="khead">
        <div className="wrap khead-grid">
          <div className="khead-text">
            <nav className="crumbs" aria-label="경로">
              <Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span><Link href={cityPath(p.city)}>{p.city}</Link>
            </nav>
            <p className="khead-cat">{r.cat}</p>
            <h1><span>{p.kw}</span>{' '}<span className="hero-sub">{r.h1sub}</span></h1>
            <p className="khead-lead">{r.lead}</p>
            <Actions dark />
          </div>
          <section className="sheet" data-reveal>
            <figure className="sheet-ph"><img src={`/img/${hp.p.id}.webp`} alt={`${p.kw} - ${hp.p.desc}`} width={hp.p.w} height={hp.p.h} /></figure>
            <h2>{p.kw} 핵심 요약</h2>
            <p className="sheet-ans">{r.summary}</p>
            <dl>{r.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </section>
        </div>
      </section>

      <div className="wrap ray">
        <article className="ray-article">
          {r.sections.map((x) => (
            <section key={x.h} data-reveal>
              <h2>{x.h}</h2>
              <p>{x.p}</p>
            </section>
          ))}
        </article>

        <div className="shots ray-shots">
          {strip.map(({ p: x, caption }) => (
            <figure key={x.id} data-reveal>
              <div className="ph"><img src={`/img/${x.id}.webp`} alt={`${p.kw} 참고 - ${x.desc}`} loading="lazy" width={x.w} height={x.h} /></div>
              <figcaption>{caption}</figcaption>
            </figure>
          ))}
        </div>

        <section className="ray-faq" id="faq">
          <h2>{p.kw} 자주 묻는 질문</h2>
          <div className="faq">{r.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="ray-rel">
          <h2>{p.kw} 관련 안내</h2>
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{P.name} 다른 안내</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameCity.length > 0 && <div><h3>{p.city} 다른 동네</h3><ul>{rel.sameCity.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            <div><h3>다른 지역</h3><ul>
              {rel.otherCities.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}
              <li><Link href={cityPath(p.city)}>{p.city} 지역 안내 전체<IconArrow /></Link></li>
            </ul></div>
          </div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions dark sms={false} />
        </div>
      </section>
    </main>
  );
}
