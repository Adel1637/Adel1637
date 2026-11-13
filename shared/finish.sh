#!/usr/bin/env bash
# Rendu final d'un film AG Studio. L'accroche est obligatoire : le rendu ne démarre pas si
# shared/check-hook.sh échoue (voir shared/accroche.md).
#   shared/finish.sh <film> [format]
# -> out/<film>/final.mp4 (30 i/s, effets sonores, -14 LUFS) + couvertures si le film a un mode ?cover=
set -euo pipefail
FILM=${1:?usage: shared/finish.sh <film> [format]}
FMT=${2:-$(python3 -I -c "import json,sys; print(json.load(open(sys.argv[1]))['formats'][0])" "$FILM/film.json")}
SKILL=${MOTION_REEL_SKILL:-$(ls -d /root/.claude/plugins/synced/*/*/skills/motion-reel 2>/dev/null | head -1)}
cd "$(dirname "$0")/.."
if ! shared/check-hook.sh "$FILM" "$FMT"; then
  echo "Accroche à revoir : rendu annulé (voir shared/accroche.md)." >&2
  exit 1
fi
node "$SKILL/scripts/render.mjs" --film "$FILM" --format "$FMT" --video-only --fps 30
node "$SKILL/scripts/sfx.mjs" "$FILM"
node "$SKILL/scripts/mix.mjs" "$FILM"
# cover mode lives in film.js or in a shared builder it imports (e.g. shared/basics.js)
if grep -qE "get\('cover'\)|cover:" "$FILM/film.js" || grep -l "get('cover')" $(grep -oE "\.\./shared/[a-z-]+\.js" "$FILM/film.js" | sed "s#^\.\./#./#") 2>/dev/null | grep -q .; then
  if [ "$FMT" = "9x16" ]; then node shared/covers.mjs "$FILM" "out/$FILM/covers"; fi
fi
echo "OK -> out/$FILM/final.mp4"
