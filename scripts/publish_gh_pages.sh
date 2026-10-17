#!/bin/bash
# 備用部署：在無法推送 GitHub Actions workflow（憑證缺 workflow 權限）時，本機建置後把 dist 推到 gh-pages 分支。
# 用法：scripts/publish_gh_pages.sh <remote> [BASE]   例：scripts/publish_gh_pages.sh preview /tang-wei-tea-preview
set -euo pipefail
REMOTE=${1:?remote}; BASE_PATH=${2:-/tang-wei-tea}
REMOTE_URL=$(git config --get "remote.$REMOTE.url" 2>/dev/null || true)
[ -z "$REMOTE_URL" ] && { echo "找不到 remote $REMOTE 的網址，未推送。" >&2; exit 1; }
export BASE=$BASE_PATH
[ "$BASE_PATH" = "/tang-wei-tea-preview" ] && export PUBLIC_PREVIEW=1
npm run build
python3 -I scripts/check_dist.py dist --base "$BASE_PATH"
TMP=$(mktemp -d)
cp -r dist/. "$TMP/"
touch "$TMP/.nojekyll"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name=zocomputer -c user.email=zocomputer@users.noreply.github.com commit -q -m "deploy $(date -u +%FT%TZ)"
git push -f "$REMOTE_URL" gh-pages
echo "已推送 gh-pages 到 $REMOTE_URL（建置來源 $TMP）"
