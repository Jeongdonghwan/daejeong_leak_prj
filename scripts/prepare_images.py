"""업체 사진(source/raw, 네이버 플레이스 업체 등록 사진) → public/img/d#.webp·.jpg + data/photos.json

  python -I scripts/prepare_images.py

뺀 것: _01 광고 배너 4장('100% 해결' 문구·얼굴), 2038309215_03 자격증(이름 노출), 2038309215_04 안내 카드('100%' 문구),
       2069602389_02~04 (2039634703 과 같은 현장 사진).
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW, OUT = ROOT / 'source' / 'raw', ROOT / 'public' / 'img'
# (id, 원본, 장면 설명 — alt·캡션에 쓴다, 태그)
PHOTOS = [
    ('d1', '2038309215_02.png', '마루 바닥 위에서 청음탐지기로 누수음을 듣는 장면', ['청음', '바닥']),
    ('d2', '2018360332_02.jpg', '수도 계량기함을 열고 압력계를 연결해 누수 여부를 확인하는 장면', ['계량기', '수도']),
    ('d3', '2018360332_03.jpg', '누수 지점 바닥만 부분적으로 열어 배관을 드러낸 장면', ['공사', '바닥']),
    ('d4', '2018360332_04.jpg', '배관 수리 뒤 복구를 위해 정리한 바닥 개방 부위', ['공사', '복구']),
    ('d5', '2039634703_02.jpg', '보일러 아래 배관에 압력계와 호스를 연결해 계통을 나누는 장면', ['보일러', '난방']),
    ('d6', '2039634703_03.jpg', '베란다 난방 분배기에 호스를 연결해 방별 배관을 확인하는 장면', ['분배기', '난방']),
    ('d7', '2039634703_04.jpg', '다용도실 보일러 배관에 압력계를 달아 압력 변화를 보는 장면', ['보일러', '압력']),
]

OUT.mkdir(parents=True, exist_ok=True)
out = []
for pid, src, desc, tags in PHOTOS:
    im = Image.open(RAW / src).convert('RGB')
    im.thumbnail((1400, 1400), Image.LANCZOS)
    im.save(OUT / f'{pid}.webp', 'WEBP', quality=80)
    im.save(OUT / f'{pid}.jpg', 'JPEG', quality=82, optimize=True)  # og 배경용
    out.append(dict(id=pid, desc=desc, tags=tags, w=im.width, h=im.height))
json.dump({'photos': out}, open(ROOT / 'data' / 'photos.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'photos')
