"""키워드 엑셀 → data/site-pages.json (사이트 라우트의 단일 출처) + keywords/대정누수탐지_페이지.xlsx

  python -I scripts/build_pages.py

원본: keywords/대정누수탐지_키워드.xlsx (region_kw_prj 에서 복사, 키워드 시트 4,990행)
  '생성 대상' 열이 O 인 행만 페이지가 된다 (지금 1,000행). 나머지 행은 나중에 O 로 바꾸고 다시 돌리면 붙는다.

오픈 묶음(wave)
  처음 빌드: O 행을 우선순위 → 순번 순으로 세워 rebatch --plan 25,50,75,100 (7일 안 4묶음, 각 25%).
  다시 빌드: data/site-pages.json 에 이미 있는 페이지의 wave 는 그대로 이어받는다.
  새로 O 가 된 행(extra)은 '지금 가장 큰 wave + 1' 한 묶음으로 붙는다 → data/drip.json extra 에 날짜를 넣어 연다.
"""
import json, sys
from collections import Counter
from pathlib import Path
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE / 'drip'))
from places_src import places  # noqa: E402
from rebatch import rebatch  # noqa: E402

ROOT = HERE.parent
SRC = ROOT / 'keywords' / '대정누수탐지_키워드.xlsx'
OUT_XLSX = ROOT / 'keywords' / '대정누수탐지_페이지.xlsx'
SP = ROOT / 'data' / 'site-pages.json'
SITE_URL = 'http://127.0.0.1:18994'  # 도메인 확정 전 (lib/site.ts·data/drip.json 과 함께 바꿀 것)
WORDS = {'누수탐지', '누수', '누수수리', '누수공사', '누수탐지업체', '화장실누수', '천장누수', '배관누수', '수도누수', '아파트누수'}

rows = []
for r in list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))[1:]:
    no, kw, prio, target, _req, label, _up, unit, word, mod, alt, slug = r[:12]
    if not kw or target != 'O':
        continue
    assert label in places, f'지역 데이터 없음: {label} ({kw})'
    assert word in WORDS, word
    assert slug == kw.replace(' ', '-'), (slug, kw)
    rows.append(dict(n=no, kw=kw, slug=slug, prio=prio, label=label, unit=unit, word=word, mod=mod or '', alt=alt or ''))

prev = {p['slug']: p['wave'] for p in json.load(open(SP, encoding='utf-8'))['pages']} if SP.exists() else {}
order = sorted(rows, key=lambda r: (r['prio'], r['n']))
pages = []
for i, r in enumerate(order, 1):
    P = places[r['label']]
    pages.append(dict(n=r['n'], no=i, kw=r['kw'], slug=r['slug'], label=r['label'], place=r['label'], city=P['city'],
                      service=r['word'], mod=r['mod'], unit=r['unit'], prio=r['prio'], wave=prev.get(r['slug'], 1), alt=r['alt']))
assert all(v == 1 for v in Counter(p['slug'] for p in pages).values())
if not prev:
    rebatch(pages, plan=[25, 50, 75, 100])
else:
    nxt = max(prev.values()) + 1
    for p in pages:
        if p['slug'] not in prev:
            p['wave'], p['extra'] = nxt, True
json.dump({'pages': pages}, open(SP, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

# ---- 페이지 엑셀 (첫 시트 = 키워드 시트, 요약 시트 없음). 행 순서 = 오픈 순서 ----
wb = Workbook()
ws = wb.active
ws.title = '키워드'
ws.append(['순번', '키워드', '우선순위', '지역', '시·구', '지역단위', '단어', '수식어', 'URL', '오픈 묶음'])
for p in pages:
    ws.append([p['n'], p['kw'], p['prio'], p['label'], p['city'], p['unit'], p['service'], p['mod'], f"{SITE_URL}/{p['slug']}/", p['wave']])
for c in ws[1]:
    c.font = Font(bold=True, color='FFFFFF')
    c.fill = PatternFill('solid', fgColor='14244A')
    c.alignment = Alignment(horizontal='center')
for col, w in zip('ABCDEFGHIJ', [6, 30, 8, 16, 8, 9, 12, 9, 56, 9]):
    ws.column_dimensions[col].width = w
ws.freeze_panes = 'A2'
ws.auto_filter.ref = f'A1:J{len(pages) + 1}'
wb.save(OUT_XLSX)

sys.stdout.reconfigure(encoding='utf-8')
c = Counter(p['wave'] for p in pages)
acc = 0
for w in sorted(c):
    acc += c[w]
    print(f"묶음 {w}: {c[w]} (누적 {acc}) 우선순위 {dict(Counter(p['prio'] for p in pages if p['wave'] == w))}")
print('엑셀:', OUT_XLSX.name, len(pages), '행')
