"""미리 써 둔 블로그 글(date 비움 = 비공개)에 공개일을 배정한다. 오픈일이 정해지면 한 번 돌린다.

  python -I scripts/drip/schedule_posts.py <오픈일 YYYY-MM-DD> [--dry]

- 순서 = content/blog/_data/keywordQueue.json 의 done 순서 (publishedSlug).
- 하루 글 수 = drip_status.py 와 같은 식 (data/drip.json postsPerDay·postDays, 1.5 = 하루 1편·2편 번갈아, 30일 45편).
- 각 글 프런트매터 date·publishedAt 을 채우고, 큐의 publishedAt 도 같이 적는다. 이미 날짜가 있는 글은 건드리지 않는다.
- data/drip.json 의 launch 도 오픈일로 채운다(비어 있을 때만).
빌드는 lib/blog.ts 가 date > 빌드일인 글을 빼므로, 배정만 해 두면 매일 빌드할 때 그날 글이 열린다.
"""
import datetime as dt, json, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / 'content' / 'blog'
QUEUE = BLOG / '_data' / 'keywordQueue.json'
DRIP = ROOT / 'data' / 'drip.json'


def dates(launch, n, per_day=1.5, days=30):
    out, k = [], 0
    while len(out) < n:
        c = math.floor((k + 1) * per_day) - math.floor(k * per_day) if k < days else 1  # 30일 넘치면 하루 1편
        out += [launch + dt.timedelta(k)] * c
        k += 1
    return out[:n]


def demo():
    d = dates(dt.date(2026, 12, 1), 45)
    assert d[0] == dt.date(2026, 12, 1) and d[1] == d[2] == dt.date(2026, 12, 2) and d[3] == dt.date(2026, 12, 3)
    assert d[-1] == dt.date(2026, 12, 30) and len(set(d)) == 30
    print('demo ok')


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    if len(sys.argv) < 2:
        demo(); return
    launch = dt.date.fromisoformat(sys.argv[1])
    dry = '--dry' in sys.argv
    cfg = json.loads(DRIP.read_text(encoding='utf-8'))
    q = json.loads(QUEUE.read_text(encoding='utf-8'))
    todo = [x for x in q['queue'] if x['status'] == 'done' and not x.get('publishedAt')]
    when = dates(launch, len(todo), cfg.get('postsPerDay', 1.5), cfg.get('postDays', 30))
    for x, d in zip(todo, when):
        f = BLOG / f"{x['publishedSlug']}.md"
        raw = f.read_text(encoding='utf-8')
        head, body = raw.split('\n---', 1)
        if re.search(r'^date:\s*\d', head, re.M):
            continue
        head = re.sub(r'^date:.*$', f'date: {d}', head, flags=re.M)
        head = re.sub(r'^publishedAt:.*$', f'publishedAt: {d}', head, flags=re.M)
        x['publishedAt'] = str(d)
        print(d, x['publishedSlug'])
        if not dry:
            f.write_text(head + '\n---' + body, encoding='utf-8')
    if not dry:
        QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=1), encoding='utf-8')
        if not cfg.get('launch'):
            cfg['launch'] = str(launch)
            DRIP.write_text(json.dumps(cfg, ensure_ascii=False), encoding='utf-8')
    print('배정', len(todo), '편', '(dry)' if dry else '')


if __name__ == '__main__':
    main()
