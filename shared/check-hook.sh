#!/usr/bin/env bash
# Vérifie l'accroche d'un film (voir shared/accroche.md).
#   shared/check-hook.sh <film> [9x16|16x9]
# Rend les images à 0 s, 0,5 s, 1,5 s et 3 s, lit la liste des sons (hits), puis contrôle :
#   1. image 0 pleine (le contenu est déjà là à 0 s, comparé à 1,5 s)
#   2. mouvement dans la première demi-seconde
#   3. un son sur l'image 0
#   4. quelque chose de nouveau entre 1,5 s et 3 s (le contenu avance)
# Les points éditoriaux (≤ 7 mots, problème reconnu, promesse tenue) restent à cocher à la main.
set -euo pipefail
FILM=${1:?usage: shared/check-hook.sh <film> [9x16|16x9]}
FMT=${2:-$(python3 -I -c "import json,sys; print(json.load(open(sys.argv[1]))['formats'][0])" "$FILM/film.json")}
SKILL=${MOTION_REEL_SKILL:-$(ls -d /root/.claude/plugins/synced/*/*/skills/motion-reel 2>/dev/null | head -1)}
OUT=out/$FILM/hook
rm -rf "$OUT" && mkdir -p "$OUT"
node "$SKILL/scripts/render.mjs" --film "$FILM" --format "$FMT" --at 0,0.5,1.5,3 --noblur >/dev/null
node "$SKILL/scripts/render.mjs" --film "$FILM" --format "$FMT" --hits >/dev/null
mv out/$FILM/stills/t0.000_*.png "$OUT/t0.png"; mv out/$FILM/stills/t0.500_*.png "$OUT/t05.png"
mv out/$FILM/stills/t1.500_*.png "$OUT/t15.png"; mv out/$FILM/stills/t3.000_*.png "$OUT/t3.png"
python3 -I - "$OUT" "out/$FILM/hits.json" <<'PY'
import sys, json
import numpy as np
from PIL import Image
out, hits = sys.argv[1], json.load(open(sys.argv[2]))
load = lambda n: np.asarray(Image.open(f"{out}/{n}.png").convert('RGB')).astype(int)
f0, f05, f15, f3 = (load(n) for n in ('t0', 't05', 't15', 't3'))
paper = np.array([0xEE, 0xF1, 0xF6])
def ink(f):  # pixels that are neither paper nor the dot grid
    d = np.abs(f - paper).sum(2)
    return float(((d > 60)).mean())
def changed(a, b): return float((np.abs(a - b).sum(2) > 40).mean())
c0, c15 = ink(f0), ink(f15)
ok = []
r = c0 / c15 if c15 else 0
ok.append((r >= 0.6, f"Image 0 pleine : {r:.0%} du contenu de 1,5 s est déjà là à 0 s (cible ≥ 60 %)"))
m = changed(f0, f05)
ok.append((m >= 0.005, f"Mouvement avant 0,5 s : {m:.1%} des pixels changent (cible ≥ 0,5 %)"))
first = min((h['t'] for h in hits), default=None)
ok.append((first is not None and first <= 0.1, f"Son sur l'image 0 : premier son à {first if first is not None else '—'} s (cible ≤ 0,1 s)"))
n = changed(f15, f3)
ok.append((n >= 0.02, f"Le contenu avance entre 1,5 s et 3 s : {n:.1%} des pixels changent (cible ≥ 2 %)"))
print("Accroche —", out)
for good, msg in ok: print(("  OK   " if good else "  À REVOIR ") + msg)
print("  À cocher à la main : ≤ 7 mots + arabe dessous · problème/écran reconnu · 1er conseil avant 3 s · promesse tenue")
sys.exit(0 if all(g for g, _ in ok) else 1)
PY
