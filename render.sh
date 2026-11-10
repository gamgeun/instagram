#!/usr/bin/env bash
# 사용법: ./render.sh            → scripts 안의 모든 편 렌더
#         ./render.sh GN-01      → 한 편만 렌더
set -e
cd "$(dirname "$0")"
mkdir -p out
ids=${1:-$(npx remotion compositions src/Root.tsx --quiet)}
for id in $ids; do
  npx remotion render src/Root.tsx "$id" "out/$id.mp4" --codec=h264 --crf=18 --log=error
done
