# Pipeline AG Studio (reconstruit en novembre 2026)

| Fichier | Rôle |
|---|---|
| `ags.js` | Style AG Studio : fond à points, en-tête série + « AG Studio », titres serrés, arabe en bleu, lignes grises, barre de progression, cadre de sélection, curseur, pastilles, page de fin (9:16 et 16:9) |
| `brand/ag-studio-logo.png` | Logo AG Studio détouré (fichier fourni, non redessiné) |
| `covers.mjs` | Couvertures depuis le mode `?cover=` d'un film : `node shared/covers.mjs <film> <dossier> [format] [type=Fichier.png,…]` |
| `accroche.md` | Liste de contrôle de l'accroche (3 premières secondes) |
| `finish.sh` | Rendu final : vérifie l'accroche, puis rendu 30 i/s, effets sonores, mixage -14 LUFS, couvertures. **Refuse le rendu si l'accroche ne passe pas.** |
| `check-hook.sh` | Vérification automatique de l'accroche : `shared/check-hook.sh <film> [9x16\|16x9]` |

**Règle : l'accroche est obligatoire pour chaque vidéo** (`accroche.md`).

Étapes : découpage (avec l'accroche écrite en premier) → `film.js` → `shared/finish.sh <film>` (accroche vérifiée, puis rendu, sons, mixage, couvertures) → textes → zip.
