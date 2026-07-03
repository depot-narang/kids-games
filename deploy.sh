#!/bin/zsh
# 우리들의 게임나라 → Netlify 자동 배포 스크립트
# 사용법: ./deploy.sh  (같은 폴더의 .netlify-token 파일에 개인 토큰이 있어야 함)
set -e
cd "$(dirname "$0")"

TOKEN_FILE=".netlify-token"
SITE_NAME="ornate-florentine-8fa086"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "❌ $TOKEN_FILE 파일이 없어요. Netlify 개인 토큰을 이 파일에 저장해주세요."
  echo "   (app.netlify.com → User settings → Applications → New access token)"
  exit 1
fi
TOKEN=$(cat "$TOKEN_FILE" | tr -d '[:space:]')

echo "📦 압축 중..."
ZIP=".deploy.zip"
rm -f "$ZIP"
zip -qr "$ZIP" . -x ".git/*" -x "$ZIP" -x "$TOKEN_FILE" -x "deploy.sh" -x ".gitignore"

echo "🔎 사이트 찾는 중..."
SITE_ID=$(curl -sf -H "Authorization: Bearer $TOKEN" \
  "https://api.netlify.com/api/v1/sites?name=$SITE_NAME" \
  | python3 -c 'import json,sys; sites=json.load(sys.stdin); print(sites[0]["id"])')

echo "🚀 배포 중..."
RESULT=$(curl -sf -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary "@$ZIP" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys")

rm -f "$ZIP"
echo "$RESULT" | python3 -c 'import json,sys; d=json.load(sys.stdin); url=d.get("ssl_url") or d.get("url") or "https://ornate-florentine-8fa086.netlify.app"; print("✅ 배포 완료! → " + url + " (상태: " + str(d.get("state")) + ")")' \
  || echo "✅ 배포 요청을 보냈어요. 잠시 후 사이트를 확인해보세요."
