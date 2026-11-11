# Pipeline AG Studio (reconstruit en novembre 2026)

| Fichier | Rôle |
|---|---|
| `ags.js` | Style AG Studio : fond à points, en-tête série + « AG Studio », titres serrés, arabe en bleu, lignes grises, barre de progression, cadre de sélection, curseur, pastilles, page de fin (9:16 et 16:9) |
| `brand/ag-studio-logo.png` | Logo AG Studio détouré (fichier fourni, non redessiné) |
| `covers.mjs` | Couvertures depuis le mode `?cover=` d'un film : `node shared/covers.mjs <film> <dossier> [format] [type=Fichier.png,…]` |
| `accroche.md` | Liste de contrôle de l'accroche (3 premières secondes) |
| `check-hook.sh` | Vérification automatique de l'accroche : `shared/check-hook.sh <film> [9x16\|16x9]` |

Étapes d'un Short : découpage → `film.js` → **`check-hook.sh`** → rendu (`render.mjs --video-only --fps 30`) → `sfx.mjs` → `mix.mjs` (-14 LUFS) → `covers.mjs` → textes → zip.
