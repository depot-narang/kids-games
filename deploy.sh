#!/bin/zsh
# 우리들의 게임나라 → GitHub Pages 자동 배포
# 사용법: ./deploy.sh  (같은 폴더의 .github-token 파일에 GitHub 토큰이 있어야 함)
set -e
cd "$(dirname "$0")"

TOKEN_FILE=".github-token"
URL="https://depot-narang.github.io/kids-games/"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "❌ $TOKEN_FILE 파일이 없어요. GitHub 토큰을 이 파일에 저장해주세요."
  echo "   (github.com/settings/tokens/new → repo 권한)"
  exit 1
fi
TOKEN=$(cat "$TOKEN_FILE" | tr -d '[:space:]')

# 배포할 때마다 캐시 버전을 자동 갱신 (오래 캐시돼도 새 코드가 항상 반영되도록)
STAMP=$(date +%s)
sed -i '' -E "s/\?v=[0-9]+/?v=$STAMP/g" index.html

echo "📦 커밋 중..."
git add -A
git commit -qm "배포: 캐시버전 $STAMP" || true

echo "🚀 GitHub로 푸시 중..."
git -c http.postBuffer=157286400 -c http.version=HTTP/1.1 \
  -c credential.helper='!f() { echo "username=depot-narang"; echo "password='"$TOKEN"'"; }; f' \
  push origin main

echo "⏳ 사이트 반영 대기 중 (보통 30초~2분)..."
for i in {1..30}; do
  if curl -s "$URL" | grep -q "v=$STAMP"; then
    echo "✅ 배포 완료! → $URL"
    exit 0
  fi
  sleep 6
done
echo "✅ 푸시는 끝났어요. 반영이 조금 늦네요 — 1~2분 뒤 $URL 를 새로고침해 보세요."
