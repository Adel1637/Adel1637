# Accroche (hook) — liste de contrôle AG Studio

**Règle (depuis le 11 novembre 2026) : l'accroche s'applique à chaque vidéo, Shorts, TikTok et vidéos longues.**
`shared/finish.sh` refuse de lancer le rendu final tant que `shared/check-hook.sh` ne passe pas.
Pour une vidéo longue, l'accroche = les 3 premières secondes + le titre + la miniature.

Les 1 à 3 premières secondes décident si le spectateur reste ou fait défiler. Sans voix, l'accroche
repose sur trois couches : **l'image**, **le texte**, **le son**. Elle doit marcher sans le titre ni la légende.

## Liste de contrôle (chaque Short, avant le rendu final)

- [ ] **Image 1 pleine** : l'accroche et le sujet sont déjà à l'écran (pas de logo, pas de fondu, pas de titre qui commence à monter).
- [ ] **≤ 7 mots** en anglais, l'arabe juste dessous.
- [ ] **Un problème ou un écran que le spectateur reconnaît** (« you / your », une interface qu'il a déjà vue).
- [ ] **Mouvement + son dans la première demi-seconde** (clic ou pop sur l'image 0).
- [ ] **Premier conseil avant 3 secondes.**
- [ ] **La vidéo tient la promesse** de l'accroche.

Vérification automatique : `shared/check-hook.sh <film> [9x16|16x9]` (voir plus bas).

## Les 3 premières secondes

| Moment | Ce qui se passe |
|---|---|
| 0 – 1 s | Accroche déjà affichée + image du sujet, un clic |
| 1 – 2 s | Tension ou promesse précisée (surligneur, croix rouge, « 5 fixes ») |
| 2 – 3 s | Le contenu commence (« 1 », première correction) |

## Familles d'accroches

| Famille | Exemple |
|---|---|
| Problème reconnu | « This empty screen is a dead end. » |
| Contre-pied | « Stop using "Are you sure?" dialogs. » |
| Erreur courante | « You're mirroring the wrong icons in RTL. » |
| Avant / après | Mauvais écran + croix rouge à l'image 0, puis version corrigée + coche verte |
| Question | « Would you tap this button? » |
| Promesse concrète | « 5 fixes. 30 seconds. » (le format, jamais une statistique inventée) |

## À éviter

- La promesse vague (« 4 Ways to Get Paid… »).
- Une introduction (« Hi, today we'll… ») ou le logo au début.
- Une montée lente avant le sujet.
- Une accroche qui promet plus que la vidéo.

## Mesurer

- **YouTube Studio** → le Short → Statistiques → carte **« Regardées ou balayées »**.
- **TikTok** → statistiques de la vidéo → **courbe de rétention** (une chute avant 2 s = accroche faible).
- Ne changer **qu'une chose à la fois** : même contenu, deux accroches, puis comparer.
