# Série « Fondamentaux UI » — plan de production

Chaîne AG Studio (Adel Goucem). Série « Learn UI/UX ». Dialogue avec l'auteur en **français** ; vidéos en anglais (titre) + arabe (sous-titre).
Chiffres en **chiffres arabes standard 1, 2, 3** (pas ١، ٢، ٣) dans les nouveaux textes.

## Format (identique au Short 1, déjà livré : `found-color-type/`)
- Short / TikTok 1080×1920, ~50 s, grille 128 BPM, **sans musique** (effets sonores seulement), -14 LUFS.
- **Accroche obligatoire** (`shared/accroche.md`) : image 0 pleine, ≤ 7 mots + arabe dessous, son à l'image 0, 1er principe avant 3 s.
- Structure : accroche → 5 principes (avant → après sur **une interface fictive** qui s'améliore) → récap avant/après → page bleue de fin.
- Builder : `shared/basics.js` · style : `shared/ags.js` · rendu : `shared/finish.sh <film>` (vérifie l'accroche puis rend, mixe, fait les couvertures).
- Interfaces fictives existantes : `shared/mockups.js` (site + appli), `shared/mockup-style.js` (page couleur/typo). Pour un nouveau thème, créer `shared/mockup-<thème>.js` sur le modèle de `mockup-style.js`.
- Livrables par vidéo, dans `livraisons/A-DATER_<titre>/` + zip : vidéo, `Couverture-TikTok.png` (texte dans la bande 3:4), `Couverture-YouTube-Shorts.png`, `Textes-publication.txt` (titre YouTube, descriptions EN+AR, légende TikTok, hashtags, commentaire à épingler).
- Règles : contenu neutre (jamais les projets de l'auteur), interfaces fictives, pas de numéro d'épisode, aucun chiffre inventé, traduction arabe professionnelle.
- Économie de crédit : un seul contrôle en images avant `finish.sh`, une vérification finale, pas de tours supplémentaires.

## Les Shorts

| # | Dossier | Titre EN / AR | Accroche EN / AR | 5 principes |
|---|---|---|---|---|
| 1 ✅ | `found-color-type` | Color & type basics / أساسيات الألوان والخطوط | Your colors and fonts are fighting. / ألوانك وخطوطك تتصارع. | Fait |
| 2 | `found-spacing-layout` | Spacing & layout basics / أساسيات المسافات والتخطيط | Your design feels cramped. / تصميمك مزدحم. | Échelle d'espacements (8, 16, 24, 32) · plus d'espace entre les groupes qu'à l'intérieur · grille de colonnes · bords alignés · largeur maximale du contenu |
| 3 | `found-dark-a11y` | Dark mode & accessibility basics / أساسيات الوضع الداكن وإمكانية الوصول | Can everyone read this? / هل يستطيع الجميع قراءة هذا؟ | Contraste suffisant · jamais la couleur seule · focus visible · gris très foncé plutôt que noir · couleurs désaturées en mode sombre |
| 4 | `found-depth-shape` | Depth & shape basics / أساسيات العمق والأشكال | Too many borders and shadows. / حدود وظلال كثيرة جدًا. | L'espace plutôt que des lignes · ombres douces · 2 à 3 niveaux d'élévation · arrondi cohérent · arrondi intérieur plus petit |
| 5 | `found-icons-images` | Icons & images basics / أساسيات الأيقونات والصور | Your icons don't match. / أيقوناتك غير متناسقة. | Une famille d'icônes · même épaisseur de trait · texte avec les icônes ambiguës · voile derrière le texte sur photo · formats d'image cohérents |
| 6 | `found-motion` | Motion basics / أساسيات الحركة | This animation is too slow. / هذه الحركة بطيئة جدًا. | Durées courtes (~150–300 ms) · courbes d'accélération · un sens à chaque mouvement · état au toucher · retours de succès et de chargement |

## Vidéo longue (après les 6 Shorts)
« UI design foundations for beginners » / « أساسيات تصميم الواجهات للمبتدئين » — 16:9, réunit les 6 thèmes (modèle : `basics-long/film.js`), miniature 1280×720, textes avec chapitres. Accroche obligatoire.

## Pour lancer une nouvelle session
> Lis `plan-fondamentaux.md` et produis le Short 2 (Spacing & layout basics), en économisant le crédit.
