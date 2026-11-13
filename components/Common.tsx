// 공통 UI — 이모지 없이 선 아이콘, 각진 2칸 전화 버튼, 지점 표.
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
        <span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30"><rect width="32" height="32" rx="4" fill="#1f52c7" /><path d="M16 6c-4 5.5-6.5 9-6.5 12.3a6.5 6.5 0 0 0 13 0C22.5 15 20 11.5 16 6z" fill="#fff" /><path d="M9 25h14" stroke="#fff" strokeWidth="2" /></svg></span>
        <span className="logo-text"><b>대정</b>누수탐지</span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/area/" className="hide-m">지역</Link>
        <Link href="/blog/" className="hide-m">누수 궁금증</Link>
        <a href={tel} className="nav-tel hide-m">상담전화 <strong>{CONTACT.phone}</strong></a>
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span className="show-m">{CONTACT.phone}</span><span className="hide-m">전화 상담</span></a>
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

// 지점 표 — 지점명 · 담당 지역(places.json CITIES.branch) · 플레이스 등록 주소
// compact: 키워드 페이지용 한 줄 — 표 머리·안내 문장 없이 (페이지 간 같은 문장 줄이기)
export const BranchList = ({ items, compact = false }: { items: Branch[]; compact?: boolean }) => (
  <div className="btable-wrap" data-reveal>
    <table className={compact ? 'btable compact' : 'btable'}>
      {!compact && <thead><tr><th scope="col">지점</th><th scope="col">담당 지역</th><th scope="col">주소</th></tr></thead>}
      <tbody>
        {items.map((b) => {
          const near = CITY_ORDER.filter((c) => CITIES[c].branch.includes(b.key));
          return (
            <tr key={b.key}>
              <th scope="row">{b.name} 지점</th>
              <td data-h="담당 지역">{near.length > 0 ? near.map((c, i) => <span key={c}>{i > 0 && ' · '}{isOpenCity(c) ? <Link href={cityPath(c)}>{c}</Link> : c}</span>) : '수도권 출장'}</td>
              <td data-h="주소">{b.addr} <small>({b.lot})</small> <a href={placeUrl(b)} target="_blank" rel="noopener noreferrer" className="br-place">네이버 플레이스</a></td>
            </tr>
          );
        })}
      </tbody>
    </table>
    {!compact && <p className="btable-note">전화는 지점과 상관없이 대표번호 <a href={tel}>{CONTACT.phone}</a> 하나로 받습니다.</p>}
  </div>
);
