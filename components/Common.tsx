// 공통 UI — 이모지 없이 선 아이콘, 각진 2칸 전화 버튼, 지점 개략도(SVG).
import Link from 'next/link';
import { BRAND, CONTACT, FACTS, BRANCHES, Branch, tel, smsHref, placeUrl } from '../lib/site';
import { photo, CITIES, CITY_ORDER, cityPath, openCities } from '../lib/data';

const OPEN_CITIES = new Set(openCities());
const isOpenCity = (c: string) => OPEN_CITIES.has(c);

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}</>
);

export const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconPin = () => <Svg d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" size={16} />;

// 주 행동: 빨강 2칸 슬랩(번호 | 화살표 칸). 보조: 밑줄 텍스트 링크
export const Actions = ({ sms = true, smsLabel = '젖은 자리 사진 문자로 보내기', dark = false }: { sms?: boolean; smsLabel?: string; dark?: boolean }) => (
  <div className={dark ? 'actions on-dark' : 'actions'}>
    <a className="btn-call" href={tel}><span className="bc-num"><IconPhone />{CONTACT.phone}</span><span className="bc-go" aria-hidden="true"><IconArrow /></span></a>
    {sms && <a className="btn-text" href={smsHref}><IconMsg /><span>{smsLabel}</span></a>}
  </div>
);

export const Img = ({ id, className, lazy = true, alt }: { id: string; className?: string; lazy?: boolean; alt?: string }) => {
  const p = photo(id);
  return <img src={`/img/${id}.webp`} className={className} alt={alt || `${BRAND} 현장 - ${p.desc}`} width={p.w} height={p.h} loading={lazy ? 'lazy' : undefined} />;
};

export const SectionHead = ({ title, sub }: { title: string; sub?: string }) => (
  <header className="sh" data-reveal>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="34" height="34"><rect width="32" height="32" fill="#13254a" /><path d="M16 6c-4 5.5-6.5 9-6.5 12.3a6.5 6.5 0 0 0 13 0C22.5 15 20 11.5 16 6z" fill="#d62b2b" /><path d="M9 25h14" stroke="#fff" strokeWidth="2" /></svg></span>
        <span className="logo-text"><b>{BRAND}</b><small>탐지 · 수리 · 복구공사</small></span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/area/" className="hide-m">지역</Link>
        <Link href="/blog/" className="hide-m">누수 궁금증</Link>
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>누수탐지 · 누수수리 · 누수공사 · 복구공사<br />{FACTS.area} · {CONTACT.hours}</p>
        <p><Link href="/area/">지역 안내</Link> · <Link href="/blog/">누수 궁금증</Link> · <a href="/rss.xml">RSS</a></p>
      </div>
      <ul className="foot-info">
        <li><span>대표번호</span><a href={tel}>{CONTACT.phone}</a></li>
        {BRANCHES.map((b) => <li key={b.key}><span>{b.name} 지점</span>{b.addr}</li>)}
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 지점 주소는 네이버 플레이스 등록 주소입니다. 상담 때 받은 주소·연락처는 출장 안내에만 씁니다.</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
    <a href={smsHref} className="sb-sms"><IconMsg />사진 문자</a>
  </div>
);

// ---- 지점 개략도: 위경도를 단순 투영 (지도 아님, 상대 위치만) ----
const GEO: Record<string, [number, number]> = {
  gwanak: [37.483, 126.93], bucheon: [37.527, 126.80], dongjak: [37.503, 126.948], gangseo: [37.541, 126.84],
  부평구: [37.507, 126.722], 계양구: [37.537, 126.738], 남동구: [37.447, 126.731], 강서구: [37.556, 126.82], 양천구: [37.517, 126.866],
  구로구: [37.495, 126.888], 금천구: [37.457, 126.895], 광명시: [37.469, 126.864], 시흥시: [37.39, 126.79],
};
const [LAT0, LAT1, LNG0, LNG1] = [37.37, 37.58, 126.69, 126.97];
const xy = ([la, ln]: [number, number]): [number, number] => [Math.round(((ln - LNG0) / (LNG1 - LNG0)) * 560 + 20), Math.round(((LAT1 - la) / (LAT1 - LAT0)) * 380 + 20)];

export const BranchMap = ({ focus }: { focus?: string[] }) => (
  <figure className="bmap" data-reveal>
    <svg viewBox="0 0 600 420" role="img" aria-label={`${BRAND} 지점 4곳과 출장 지역 위치 개략도`}>
      <rect x="0" y="0" width="600" height="420" className="bmap-bg" />
      {[100, 200, 300, 400, 500].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="420" className="bmap-grid" />)}
      {[105, 210, 315].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} className="bmap-grid" />)}
      {CITY_ORDER.map((c) => {
        const [x, y] = xy(GEO[c]);
        return CITIES[c].branch.slice(0, 1).map((bk) => { const [bx, by] = xy(GEO[bk]); return <line key={c + bk} x1={x} y1={y} x2={bx} y2={by} className="bmap-link" />; });
      })}
      {CITY_ORDER.map((c) => {
        const [x, y] = xy(GEO[c]);
        const on = !focus || focus.includes(c);
        return <g key={c} className={on ? 'bmap-city on' : 'bmap-city'}><circle cx={x} cy={y} r="6" /><text x={x + 10} y={y + 5}>{c}</text></g>;
      })}
      {BRANCHES.map((b) => {
        const [x, y] = xy(GEO[b.key]);
        return <g key={b.key} className="bmap-br"><rect x={x - 8} y={y - 8} width="16" height="16" /><text x={x + 13} y={y - 9}>{b.name} 지점</text></g>;
      })}
    </svg>
    <figcaption>빨간 사각형 = 지점, 남색 점 = 출장 지역. 실제 축척 지도가 아닌 위치 개략도입니다.</figcaption>
  </figure>
);

// 지점 목록 — 주소 + 그 지점에서 가까운 지역(허브) 링크
export const BranchList = ({ items }: { items: Branch[] }) => (
  <ol className="branches">
    {items.map((b) => {
      const near = CITY_ORDER.filter((c) => CITIES[c].branch[0] === b.key);
      return (
        <li key={b.key} data-reveal>
          <h3>{b.name} 지점</h3>
          <p className="br-addr"><IconPin />{b.addr} <small>({b.lot})</small></p>
          {near.length > 0 && <p className="br-near">가까운 출장 지역 {near.map((c, i) => <span key={c}>{i > 0 && ' · '}{isOpenCity(c) ? <Link href={cityPath(c)}>{c}</Link> : c}</span>)}</p>}
          <p className="br-place"><a href={placeUrl(b)} target="_blank" rel="noopener noreferrer">네이버 플레이스에서 보기</a></p>
        </li>
      );
    })}
  </ol>
);
