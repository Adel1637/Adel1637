# AG Studio — règles de production (chaîne d'Adel, série Learn UI/UX)

Dialogue en **français**. Vidéos : titre en anglais + sous-titre arabe (traduction professionnelle, jamais mot à mot).

## Avant de proposer un sujet
- **Toujours faire une recherche en ligne** (WebSearch, mode extended) avant de proposer ou de produire un sujet de tendances, d'actualité ou d'outils, et citer les sources. Ne jamais se fier seulement à ses connaissances.
- Ne rien lancer sans l'accord explicite d'Adel quand il discute un sujet.

## Contenu
- Contenu neutre : jamais ses projets (Safaa, kit RH, Tawzen, modèles Excel). Interfaces fictives et génériques.
- Aucun chiffre inventé (revenus, vues, abonnés, statistiques). Pas de numéro d'épisode ni d'annonce de l'épisode suivant.
- Chiffres arabes standard **1, 2, 3** (pas ١، ٢، ٣). Une phrase arabe ne commence pas par un mot latin ou un chiffre.
- Logos : seulement les fichiers fournis, jamais redessinés (sinon le nom en texte).

## Forme
- Sans musique, effets sonores seulement, -14 LUFS. **Palette sonore AG Studio** (`shared/sfx-ag.mjs`, validée par Adel) : sons modélisés (bois, clavier mécanique, corde, verre, feutre, souffle, bande), une seule gamme (ré pentatonique), signature de 3 notes au début et à la fin. Ne plus utiliser les sons génériques de motion-reel. Accroche obligatoire (`shared/accroche.md`, vérifiée par `shared/finish.sh`).
- Style actuel : **motion cinétique « logiciel sombre »** (gris de logiciel, IBM Plex, ressorts, masques, flou de mouvement), sans orange, pas de beige, pas de violet décoratif, pas de grille à points. Modules : `shared/kinetic.js`, `shared/kinetic-film.js`.
- Téléphones avec de vraies proportions (environ 1:2,1).
- Cohérence avec nos propres leçons : une interface sombre montrée en exemple est en **gris foncé, jamais noir pur** ; éviter le look « généré par IA » (barre latérale + 4 cartes arrondies à ombre + accent violet/bleu).
- Fin : une seule page bleue « Keep it simple. / اجعلها بسيطة. » + « Follow for more UI/UX tutorials / تابعني لمزيد من دروس UI/UX », sans logo.
- Livrables : dossier par publication dans `livraisons/` + zip (vidéo, couvertures TikTok/Shorts ou miniature YouTube 1280×720, `Textes-publication.txt` EN + AR, chapitres ≥ 10 s pour les vidéos longues).
