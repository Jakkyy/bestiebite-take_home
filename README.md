# Cucine in città

Micro-app Next.js standalone che permette di esplorare le cucine disponibili in una città usando le API pubbliche di BestieBite.

L'utente cerca una città tramite autocomplete, seleziona un suggerimento e vede le cucine di quella località in una griglia di card; può tornare alla ricerca per cambiare città.

## Stack tecnico

- **Next.js 16** con App Router + **TypeScript** (strict)
- **TanStack Query** per il data fetching (debounce, caching, cancellazione delle richieste obsolete via `AbortSignal`)
- **Zod** per la validazione a runtime delle risposte API
- **Tailwind CSS** + componenti **shadcn/ui** (Input Group, Command, Card, Skeleton, Spinner)
- **Vitest** per i test unitari
- **cmdk** per la combobox accessibile dell'autocomplete

## Requisiti

- Node.js 20+
- [pnpm](https://pnpm.io/)

## Avvio in locale

```bash
pnpm install
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Script disponibili

| Comando       | Descrizione                                     |
| ------------- | ----------------------------------------------- |
| `pnpm dev`    | Avvia il server di sviluppo                     |
| `pnpm build`  | Build di produzione (deve passare senza errori) |
| `pnpm start`  | Avvia il server di produzione                   |
| `pnpm test`   | Esegue la suite di test (Vitest)                |
| `pnpm lint`   | Esegue ESLint                                   |
| `pnpm format` | Formatta il codice con Prettier                 |

## Struttura del progetto

```
app/
  layout.tsx        # Layout root + provider
  page.tsx          # Single page (Server Component)
  providers.tsx     # QueryClientProvider (Client Component)
components/
  Header.tsx
  SearchBox.tsx     # Autocomplete città (combobox cmdk + TanStack Query)
  sections/
    CityCuisineContainer.tsx  # Switch tra vista ricerca e vista cucine
    SearchView.tsx            # Stato idle / ricerca
    CuisinesView.tsx          # Griglia cucine
  ui/               # Componenti shadcn/ui
hooks/
  useDebounce.ts
  useCitySelection.ts
lib/
  api.ts            # fetch verso le API pubbliche BestieBite
  schemas.ts        # schemi Zod + tipi inferiti
  query-keys.ts     # chiavi di cache TanStack Query
  schemas.test.ts   # test di validazione degli schemi
  api.test.ts       # test delle funzioni di fetch (fetch mockato)
```

Ho scelto una **layered architecture** (organizzazione a livello root per tipo: `components/`, `hooks/`, `lib/`) data la dimensione dello scope: con pochi file è la soluzione più immediata da leggere e navigare. Se lo scope crescesse passerei a un'organizzazione **feature/module-based**, raggruppando insieme i file di una stessa funzionalità, per evitare di avere logica correlata sparsa in cartelle diverse del progetto.

## API utilizzate

Tutte pubbliche, senza autenticazione.

1. **Autocomplete città** (debounced, ≥3 caratteri):

    ```
    GET https://api.bestiebite.com/places/v2/autocomplete?term=mila&lang=it&limit=4
    ```

2. **Cucine per location** (dopo la selezione della città):

    ```
    GET https://api.bestiebite.com/places/labels/by-location-and-type?lat=45.46&lng=9.17&type=cuisine
    ```

## Stati gestiti dalla UI

- **Idle** — campo vuoto, nessun risultato
- **Searching** — skeleton durante debounce/fetch
- **Suggestions** — lista dei suggerimenti autocomplete
- **No results** — nessuna città trovata per il termine
- **Loading cuisines** — caricamento delle cucine dopo la selezione
- **Cuisines shown** — griglia delle cucine
- **Empty cuisines** — città senza cucine censite
- **Error** — messaggio di errore con bottone "Riprova" (su entrambe le chiamate)

## Scelte architetturali

- **Server vs Client Component**: `app/page.tsx` resta un Server Component leggero; l'interattività (ricerca, selezione, fetch) è isolata nei Client Component (`SearchBox`, le `sections/`). La `CuisinesView` è caricata con `next/dynamic` per ridurre il bundle iniziale della vista di ricerca.
- **Data fetching**: gestito interamente lato client con TanStack Query, che fornisce caching, deduplica e cancellazione delle richieste obsolete tramite `AbortSignal`.
- **Validazione**: ogni risposta API passa per uno schema Zod prima di entrare nella UI, così i tipi a runtime corrispondono a quelli statici.
- **Normalizzazione input**: il termine di ricerca viene normalizzato (lowercase, rimozione simboli, spazi compressi) prima di costruire la `queryKey`, in modo che ricerche equivalenti condividano la stessa cache.

## Test

```bash
pnpm test
```

Coprono:

- **`lib/schemas.test.ts`** — accettazione/rifiuto degli schemi Zod: campi opzionali, vincoli numerici (`.int()`), passthrough delle chiavi extra, campi obbligatori mancanti, unicode.
- **`lib/api.test.ts`** — funzioni di fetch con `fetch` mockato: parsing in caso di successo, encoding del termine, inoltro dell'`AbortSignal`, gestione errori HTTP e payload non validi.

## Configurazione immagini

Le immagini delle cucine (`image_emoji`) sono PNG pubbliche servite da Firebase Storage e caricate con `next/image`; il dominio `firebasestorage.googleapis.com` è configurato nei `remotePatterns` di `next.config`.
