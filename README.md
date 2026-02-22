# Schema Ferie (PWA)

PWA installabile (offline-first) per gestire:
- Ferie (X) e ROL separati (anche mezze giornate 0.5)
- Eventi come overlay informativo (Fiere, Inventari, Chiusure aziendali)
- Contatori dinamici Ferie/ROL con regole di conteggio (weekend/festività)

## Requisiti
- Node.js 18+

## Avvio in locale
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy su GitHub Pages
1. Crea un repo GitHub (es. `schema-ferie-pwa`) e push del contenuto.
2. Abilita Pages: **Settings → Pages → Source: GitHub Actions**
3. La workflow `.github/workflows/deploy.yml` pubblica automaticamente su Pages.

> La base path viene impostata in CI usando il nome del repository.
