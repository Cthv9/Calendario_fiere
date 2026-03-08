# Schema Ferie (PWA)

PWA installabile (offline-first) per gestire:
- Ferie (X), Chiusura aziendale (A) e ROL separati (anche mezze giornate 0.5)
- Eventi come overlay informativo (Fiere, Inventari, Chiusure aziendali)
- Contatori dinamici Ferie/ROL con regole di conteggio (weekend/festività)

## Versione Desktop Windows (Tauri)

Prerequisiti:
- Node.js 18+
- Rust toolchain (stable) con `cargo`
- Microsoft C++ Build Tools (Visual Studio Build Tools)

Comandi:
```bash
npm install
npm run tauri:dev
npm run tauri:build
```

Output build Windows:
- eseguibile/installer in `src-tauri/target/release/bundle/`
