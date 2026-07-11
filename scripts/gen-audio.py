#!/usr/bin/env python3
# 앱의 모든 고정 발음을 macOS 'say'(유나 목소리)로 미리 녹음해 sound/ 에 저장하고
# js/audio-manifest.js 목록을 만든다. 브라우저 TTS가 안 되는 기기에서도 무조건 소리가 나게!
# 사용법: python3 scripts/gen-audio.py
import subprocess, os, json, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, 'sound')
os.makedirs(OUT, exist_ok=True)

texts = set()

# ---- 자모 소리 (hangul-data.js와 동일) ----
texts |= set('그 끄 느 드 뜨 르 므 브 쁘 스 쓰 즈 쯔 츠 크 트 프 흐'.split())
texts.add('이응')
texts |= set('아 야 어 여 오 요 우 유 으 이 애 얘 에 예 와 왜 외 워 웨 위 의'.split())

# ---- 가나다 ----
texts |= set('가 나 다 라 마 바 사 아 자 차 카 타 파 하'.split())

# ---- 글자 만들기 단어 + 음절 ----
build_words = ['오이','아이','여우','오리','우유','나비','아기','나무','바다','다리','머리','포도','소','개','눈','곰','문','별']
for w in build_words:
    texts.add(w)
    texts |= set(w)

# ---- 단어 쓰기 (hangul.js CATEGORIES) ----
words = '''사과 포도 딸기 수박 바나나 참외 감 귤 복숭아 체리 키위 멜론
토끼 곰 오리 사자 여우 고양이 강아지 나비 호랑이 코끼리 원숭이 기린 펭귄 돼지
엄마 아빠 누나 형 동생 아기 할머니 할아버지 이모 삼촌
하늘 바다 나무 꽃 별 해 달 비 구름 산 강 눈 무지개 바람
자동차 버스 기차 배 비행기 자전거 택시 트럭 헬기 로켓 오토바이 소방차
밥 국 빵 김밥 라면 피자 우유 사탕 과자 계란 김치 치즈 아이스크림
눈 코 입 귀 손 발 팔 다리 이 머리 배 무릎
빨강 노랑 파랑 초록 보라 분홍 검정 하양 주황 갈색
책 연필 가방 의자 크레용 색종이 풀 가위 지우개 공책 선생님
모자 신발 양말 바지 치마 장갑 티셔츠 외투 목도리 안경
문 창문 침대 식탁 거울 시계 이불 베개 소파 냉장고 전등
개미 벌 나비 거미 잠자리 메뚜기 매미 무당벌레 달팽이
물고기 고래 문어 게 새우 조개 상어 거북 불가사리 돌고래'''.split()
texts |= set(words)

# ---- 문장 (hangul.js SENTENCES) ----
NAMES = ['조이', '채아']
def josa(name, t):
    has = (ord(name[-1]) - 0xAC00) % 28 != 0
    return {'가': '이' if has else '가', '는': '은' if has else '는', '를': '을' if has else '를', '야': '아' if has else '야'}[t]

sentences = [
    '나비가 날아요','사과가 맛있어요','해가 반짝여요','꽃이 활짝 폈어요','{name}{가} 활짝 웃어요','{name}{는} 최고야',
    '오리가 헤엄쳐요','강아지가 뛰어요','새가 노래해요','물고기가 헤엄쳐요','토끼가 깡충 뛰어요','별이 반짝반짝',
    '바람이 살랑살랑','눈이 펑펑 와요',
    '안녕하세요','고맙습니다','사랑해요','미안해요','잘 자요','반가워요','잘 먹겠습니다','안녕히 계세요',
    '아침에 일어나요','이를 닦아요','밥을 먹어요','유치원에 가요','친구와 놀아요','손을 씻어요','{name}{는} 책을 읽어요','잠을 자요',
    '봄에 꽃이 펴요','여름에 수영해요','가을에 낙엽이 져요','겨울에 눈이 와요','비가 내려요','무지개가 떴어요','바다가 파래요',
    '흥부가 제비를 도와줘요','놀부는 심술쟁이','콩쥐가 예뻐요','토끼와 거북이가 달려요','신데렐라가 춤을 춰요','백설공주가 잠들어요',
    '해님 달님 이야기','인어공주가 노래해요','아기 돼지 삼형제','빨간 모자가 걸어가요','피노키오 코가 길어져요',
]
for s in sentences:
    if '{name}' in s:
        for n in NAMES:
            t = s.replace('{name}', n)
            t = re.sub(r'\{(가|는|를|야)\}', lambda m: josa(n, m.group(1)), t)
            texts.add(t)
    else:
        texts.add(s)

# ---- 이름 / 그림자 이름 / 안내 문구 ----
texts |= set(NAMES)
texts |= set(['토끼','고양이','강아지','새','오리','거북이','물고기','벌','나비'])
texts |= set(['안녕! 나는 여우야','가 나 다 라','안녕! 오늘도 재미있게 놀자'])

def fname(t):
    return '-'.join(format(ord(c), 'x') for c in t) + '.m4a'

# 목소리 세트: 폴더이름 → say 목소리 지정자
VOICES = {
    'yuna': 'Yuna',
    'male': 'Reed (한국어(한국))',
}

manifest = []
new = 0
for folder, voice in VOICES.items():
    vdir = os.path.join(OUT, folder)
    os.makedirs(vdir, exist_ok=True)
    for t in sorted(texts):
        f = fname(t)
        path = os.path.join(vdir, f)
        if folder == 'yuna':
            manifest.append(f)
        if not os.path.exists(path):
            subprocess.run(['say', '-v', voice, '--file-format=m4af', '-o', path, t], check=True)
            new += 1

with open(os.path.join(BASE, 'js', 'audio-manifest.js'), 'w') as fp:
    fp.write('// 자동 생성: scripts/gen-audio.py — 미리 녹음된 발음 파일 목록 (수정하지 마세요)\n')
    fp.write('const AudioVoices = ' + json.dumps(list(VOICES.keys())) + ';\n')
    fp.write('const AudioManifest = new Set(' + json.dumps(manifest, ensure_ascii=False) + ');\n')

print(f'텍스트 {len(manifest)}개 × 목소리 {len(VOICES)}종 (새로 생성 {new}개)')
