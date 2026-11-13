import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { openCities, cityMain, pagePath, pageEncodedPath, Page } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, Img, JsonLd } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `누수 궁금증 | ${BRAND}`;
const DESC = `아랫집 천장 누수 원인, 계량기로 누수 확인하는 법, 보험 처리 서류, 장비별 탐지 방식처럼 ${BRAND}가 상담 때 자주 받는 질문을 한 편에 하나씩 정리합니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('blog', `${BRAND} 누수 궁금증`, { title: TITLE, description: DESC, url: '/blog/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');

export default function BlogIndex() {
  const posts = getPosts();
  // 글이 없을 때도 목록이 비지 않게 시·구 대표 페이지로 이어 준다
  const hubs = openCities().map(cityMain).filter(Boolean) as Page[];
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '누수 궁금증', path: '/blog/' }]),
        itemListJsonLd(posts.length ? posts.map((p) => ({ name: p.title, path: postEncodedPath(p) })) : hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="phead">
        <div className="wrap phead-grid">
          <div>
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>누수 궁금증</span></nav>
          <h1>누수 궁금증</h1>
          <p className="phead-lead">상담 전화에서 자주 듣는 질문을 한 편에 하나씩 답합니다. 집집마다 공통인 내용만 적고, 현장마다 다른 비용 숫자는 적지 않습니다.</p>
          </div>
          <figure className="phead-ph"><Img id="d2" lazy={false} /></figure>
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <h2 className="area-h">최근 글</h2>
          {posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((p) => (
                <li key={p.slug} data-reveal>
                  <Link href={postPath(p)}><span className="meta">{fmt(p.publishedAt)}</span><h3>{p.title}</h3><p>{p.description}</p></Link>
                </li>
              ))}
            </ol>
          ) : <p className="prose-p">첫 글을 준비하고 있습니다. 그동안 아래 지역별 누수탐지 안내를 참고해 주세요.</p>}
        </section>
        <section className="sec">
          <h2 className="area-h">지역별 누수탐지 안내</h2>
          <ul className="linklist">{hubs.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          <Actions />
        </section>
      </div>
    </main>
  );
}
