import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, canonicalPath, cityPath, cityEncodedPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, BranchList, IconArrow, JsonLd, SectionHead } from '../../components/Common';

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

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const P = PLACES[p.place];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const relList = [...rel.samePlace, ...rel.sameCity, ...rel.otherCities].map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${p.city} 누수탐지`, path: cityEncodedPath(p.city) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, type: p.service, description: c.description, path, area: P.admin }),
        faqJsonLd(c.faq),
        itemListJsonLd(relList.length ? relList : [{ name: `${p.city} 지역 안내`, path: cityEncodedPath(p.city) }]),
      ]} />

      <section className="khead">
        <div className="wrap khead-grid">
          <div className="khead-text">
            <nav className="crumbs" aria-label="경로">
              <Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span><Link href={cityPath(p.city)}>{p.city}</Link><span>/</span><span>{c.eyebrow}</span>
            </nav>
            <h1>{p.kw}</h1>
            <p className="khead-lead">{c.lead}</p>
            <Actions dark />
          </div>
          <aside className="sheet" aria-label="요약" data-reveal>
            <p className="sheet-ans">{c.answer}</p>
            <dl>{c.summary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </aside>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={c.region.heading} />
          <div className="cols">
            <div className="prose" data-reveal>
              {c.intro.map((t, i) => <p key={i}>{t}</p>)}
              {c.region.paras.map((t, i) => <p key={`r${i}`}>{t}</p>)}
            </div>
            <aside className="memo" data-reveal>
              <h3>{P.name} 주변</h3>
              <ul>{c.region.spots.map((h) => <li key={h}>{h}</li>)}</ul>
              {c.region.nearby.length > 0 && <><h3>함께 다니는 곳</h3><p>{c.region.nearby.join(' · ')}</p></>}
            </aside>
          </div>
        </section>
      </div>

      <section className="sec-gray">
        <div className="wrap">
          <SectionHead title={c.view.heading} />
          <div className="prose" data-reveal>{c.view.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
          {c.view.table && <dl className="terms" data-reveal>{c.view.table.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
          {c.view.list && <>
            <h3 className="h3-sub" data-reveal>{c.view.list.title}</h3>
            <ul className="sq-list reveal-group">{c.view.list.items.map((x) => <li key={x}>{x}</li>)}</ul>
          </>}
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={c.svc.heading} />
          <div className="cols">
            <div className="prose" data-reveal>{c.svc.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
            <aside className="memo" data-reveal>
              <h3>{c.symptoms.heading}</h3>
              <ul className="sq-list">{c.symptoms.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </aside>
          </div>
        </section>
      </div>

      <section className="sec-navy">
        <div className="wrap">
          <SectionHead title={c.tools.heading} sub={c.tools.text} />
          <div className="toolsheet dark">
            {c.tools.items.map((t, i) => (
              <article key={t.name} className="tool" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <h3>{t.name}</h3>
                <p>{t.d}</p>
                <dl>{t.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-in">
          <p>{c.cta}</p>
          <Actions sms={false} dark />
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={c.photos.heading} />
          <div className="shots">
            {c.photos.items.map(({ p: x, caption }, i) => (
              <figure key={x.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="ph"><img src={`/img/${x.id}.webp`} alt={`${p.kw} 참고 - ${x.desc}`} loading="lazy" width={x.w} height={x.h} /></div>
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>

      <section className="sec-gray">
        <div className="wrap">
          <SectionHead title={c.stepsHeading} />
          <ol className="flow reveal-group">
            {c.steps.map((st) => <li key={st.title}><strong>{st.title}</strong><p>{st.text}</p></li>)}
          </ol>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={c.branches.heading} sub={c.branches.text} />
          <BranchList items={c.branches.items.slice(0, 1)} compact />
        </section>
      </div>

      <section className="sec-gray" id="faq">
        <div className="wrap">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={`${p.kw} 관련 안내`} />
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
