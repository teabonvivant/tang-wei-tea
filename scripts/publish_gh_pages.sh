#!/bin/bash
# 備用部署：在無法推送 GitHub Actions workflow（憑證缺 workflow 權限）時，本機建置後把 dist 推到 gh-pages 分支。
# 用法：scripts/publish_gh_pages.sh <remote> [BASE]   例：scripts/publish_gh_pages.sh preview /tang-wei-tea-preview
set -euo pipefail
REMOTE=${1:?remote}; BASE_PATH=${2:-/tang-wei-tea}
REMOTE_URL=$(git config --get "remote.$REMOTE.url" 2>/dev/null || true)
[ -z "$REMOTE_URL" ] && { echo "找不到 remote $REMOTE 的網址，未推送。" >&2; exit 1; }
SRC_HEAD=$(git rev-parse --short=8 HEAD)
# 防呆（P-02）：比對線上 gh-pages 最後一個 commit 訊息內的源碼 HEAD，不同只提示，不阻擋。
PROBE=$(mktemp -d)
if git -C "$PROBE" init -q && git -C "$PROBE" fetch -q --depth=1 "$REMOTE_URL" gh-pages 2>/dev/null; then
  LIVE_SRC=$(git -C "$PROBE" log -1 --format=%B FETCH_HEAD | sed -n 's/.*src \([0-9a-f]\{7,40\}\).*/\1/p' | head -1)
  if [ -z "$LIVE_SRC" ]; then
    echo "提示：線上 gh-pages 的 commit 訊息沒有記錄源碼版本（舊式部署），無法比對；今次會寫入 src $SRC_HEAD。" >&2
  elif [ "${LIVE_SRC:0:7}" != "${SRC_HEAD:0:7}" ]; then
    AHEAD=$(git rev-list --count "$LIVE_SRC..HEAD" 2>/dev/null || echo "?")
    echo "提示：線上版來自源碼 $LIVE_SRC，現時 HEAD 是 $SRC_HEAD（相差 $AHEAD 個 commit）。繼續部署會以現時 HEAD 取代線上版。" >&2
  else
    echo "線上版已是源碼 $SRC_HEAD；今次是重新發布。" >&2
  fi
else
  echo "提示：讀不到 $REMOTE 的 gh-pages，略過版本比對。" >&2
fi
rm -rf "$PROBE"
[ -n "$(git status --porcelain)" ] && echo "提示：源碼有未提交的改動，發布內容會比 $SRC_HEAD 新。" >&2
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
git -c user.name=zocomputer -c user.email=zocomputer@users.noreply.github.com commit -q -m "deploy $(date -u +%FT%TZ) src $SRC_HEAD"
git push -f "$REMOTE_URL" gh-pages
echo "已推送 gh-pages 到 $REMOTE_URL（建置來源 $TMP）"
