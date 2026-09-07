# A Matériaux — nouveau site (v2)

Refonte statique du site [amateriaux.fr](https://amateriaux.fr), avec une charte
graphique modernisée d'inspiration Apple : typographie large et serrée, beaucoup
de blanc, sections pleine largeur, cartes arrondies, barre de navigation
translucide, animations discrètes à l'apparition.

Tout le contenu de l'ancien site a été repris — aucune information n'a été
perdue.

---

## Ouvrir le site

Double-cliquez sur **`index.html`**. Le site est 100 % statique (HTML/CSS/JS),
sans build, sans dépendance, sans framework. Il fonctionne directement depuis le
disque comme depuis n'importe quel hébergeur.

Un petit serveur de prévisualisation est fourni si vous avez Node.js installé
(utile pour tester les liens relatifs dans des conditions réelles) :

```bash
node amateriaux-v2/dev-server.js
```

Puis ouvrez <http://localhost:4321>. Ce fichier ne sert qu'au développement : il
n'a pas à être mis en ligne.

---

## Arborescence

```
amateriaux-v2/
├── index.html            Accueil
├── produits.html         Les 3 gammes détaillées
├── realisations.html     Galerie filtrable + visionneuse
├── actualites.html       Les 4 articles du blog
├── contact.html          Formulaire + coordonnées + carte
├── cgv.html              Les 14 articles des CGV, en accordéon
├── assets/
│   ├── css/style.css     Design system complet (tokens, composants)
│   ├── js/main.js        Comportements (aucune dépendance)
│   └── img/favicon.svg   (plus utilisé — supprimable)
├── dev-server.js         Serveur de prévisualisation local (optionnel)
└── README.md
```

Le logo de la société (l'aigle et le « A ») sert d'emblème dans la barre de
navigation et le pied de page, et de favicon / icône d'écran d'accueil. C'est un
JPEG carré sur fond blanc : il est posé sur une pastille blanche arrondie, ce qui
rend ce fond volontaire et fonctionne aussi bien en thème clair qu'en sombre. Le
texte « A Matériaux » est conservé à côté, car le mot inclus dans le logo est
illisible à 34 px.

Deux améliorations possibles, si vous avez le fichier source du logo : une
version **PNG ou SVG à fond transparent** permettrait de supprimer la pastille
blanche, et une version **horizontale** (emblème + texte sur une ligne) éviterait
le doublon du mot « Matériaux ».

---

## Charte graphique

| | |
|---|---|
| Typographie | Police système (SF Pro sur Apple, Segoe UI Variable sur Windows) — chargement instantané, rendu natif |
| Titres | Graisse 700, interlettrage resserré (−0,035 em), tailles fluides en `clamp()` |
| Accent | Terracotta `#d4500f` (clair) / `#ff7a3d` (sombre) — un rappel de la brique et du béton, dans la continuité de l'orange de l'ancien site |
| Neutres | Blanc, gris très clair `#f5f5f7`, graphite `#16161a` |
| Rayons | 10 / 16 / 24 / 32 px, boutons en pilule |
| Thème | Clair, sombre, ou automatique selon le réglage du système — bouton dans la barre de navigation, choix mémorisé |

Toutes les couleurs sont des variables CSS regroupées en haut de
`assets/css/style.css`. Changer d'accent = changer trois lignes.

---

## Ce qui a été repris de l'ancien site

- Baseline « Produits de TP, Bâtiment et Aménagement Extérieur », positionnement
  vente directe usine, situation sur l'axe Metz–Thionville / zone de Malambas
- Les cinq engagements : Étude, Compétences, Solution, Réaction, Satisfaction
- Les trois gammes et l'intégralité de leurs listes de produits
- Le texte de présentation d'Alfred Kolami, gérant (22 ans d'expérience)
- Les 20 photos de réalisations, avec leurs catégories d'origine (travaux
  publics / aménagement extérieur / bâtiment)
- Les 4 actualités (recrutement, Urbest 2016, 2017, 2018), texte intégral
- Les 14 articles des conditions générales de vente, texte intégral
- Coordonnées : 23 rue de Malambas, 57280 Hauconcourt — 09 82 34 30 21 —
  contact@amateriaux.fr — carte Google Maps
- Le lien vers le catalogue PDF 2016

## Ce qui a été ajouté

- Une page **Actualités** dédiée (les articles n'étaient accessibles que par
  extraits sur l'accueil)
- Un **filtrage par métier** et une **visionneuse clavier** (← → Échap) sur les
  réalisations
- Un **formulaire de devis** structuré (type de projet, objet) avec validation
  côté client
- **Thème sombre**, navigation mobile, données structurées `schema.org`,
  balises Open Graph, `srcset` sur les images, `loading="lazy"`
- Accessibilité : lien d'évitement, `aria-*` sur les composants interactifs,
  focus visibles, respect de `prefers-reduced-motion`, contrastes vérifiés

---

## Points à traiter avant la mise en ligne

Trois choses ne peuvent pas être décidées à ma place :

### 1. Les images pointent encore vers l'ancien site

Toutes les photos **et le logo** sont chargés depuis
`https://amateriaux.fr/wp-content/...`.
C'est pratique pour juger du rendu tout de suite, mais **à corriger avant la
mise en production** : si l'ancien WordPress est débranché, les images
disparaissent. Il faut les télécharger dans `assets/img/` et remplacer les URL.

À savoir : **les 20 photos de réalisations ne font que 480 × 320 px** dans
l'ancien WordPress — les originaux n'ont jamais été conservés. La visionneuse
est donc bridée à 820 px de large pour éviter le flou. Refaire ces photos (ou
retrouver les fichiers d'origine) serait le meilleur gain visuel du site.

### 2. Le formulaire de contact n'envoie pas d'e-mail tout seul

Un site statique n'a pas de serveur. Le formulaire compose donc un e-mail
pré-rempli dans le logiciel de messagerie du visiteur (`mailto:`). Ça fonctionne,
mais ce n'est pas idéal sur mobile ni pour les webmails.

Pour un envoi réel, il faut brancher un service côté serveur — un endpoint chez
votre hébergeur, une fonction serverless, ou un service de formulaire. Le code à
modifier est le module `contactForm` dans `assets/js/main.js` : remplacer la
construction du `mailto:` par un `fetch()` vers votre endpoint.

### 3. Mentions légales et RGPD

- L'ancien site n'avait **pas de page de mentions légales** ; elle est
  obligatoire (SIRET, RCS, TVA, hébergeur, responsable de publication). Je n'ai
  pas ces informations, donc je ne l'ai pas créée.
- La **carte Google Maps** est un iframe tiers qui dépose des cookies. En l'état
  il faudrait soit un bandeau de consentement, soit remplacer la carte par une
  image cliquable renvoyant vers Google Maps (plus simple, et plus rapide).
- L'ancien site n'affichait **aucun horaire d'ouverture** : je n'en ai donc pas
  inventé. C'est une information que les clients cherchent — à ajouter.

### Autres suggestions

- Le **catalogue date de 2016** et le lien pointe vers l'ancien serveur : à
  actualiser et à héberger avec le nouveau site.
- L'ancien WordPress expose `xmlrpc.php` et l'API REST. Une fois le site statique
  en ligne, l'ancienne installation devrait être fermée : plus de surface
  d'attaque, plus de mises à jour à suivre.
- Les logos des grandes marques distribuées manquent : ils crédibilisent
  beaucoup une page « produits ».

---

## Modifier le site

Le contenu est en clair dans les fichiers HTML, sans template ni framework à
apprendre.

- **Changer un texte** → éditer directement le HTML de la page concernée.
- **Ajouter une réalisation** → dupliquer un bloc `<button class="shot">` dans
  `realisations.html` ; `data-cat` vaut `tp`, `ext` ou `bat`, `data-full` pointe
  vers l'image en grand.
- **Ajouter une actualité** → dupliquer un `<article class="post">` dans
  `actualites.html`.
- **Changer les couleurs** → les variables en haut de `assets/css/style.css`.

Seul point d'attention : la barre de navigation et le pied de page sont recopiés
dans chaque page. Si vous en modifiez un, répercutez le changement sur les
6 fichiers HTML.
