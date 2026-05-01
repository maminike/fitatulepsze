# Projekt: FitaTuLepsze (AiTSI 2025/26 L - Projekt nr. 1)

## ℹ️ Informacje o projekcie
**FitaTuLepsze** to aplikacja webowa pomagająca w śledzeniu postępów dietetycznych i żywieniowych, pozwalająca użytkownikowi na logowanie posiłków, przydział kalorii i przegląd postępów makroskładników.
Wyróżnia się prostym w użyciu interfejsem stworzonym w oparciu o Next.js, logowaniem Supabase oraz estetycznymi wykresami.

### Skład zespołu
- **maminikie** (Lider)
- **tamatama**
- **hamikyu**

### Podział odpowiedzialności (Testy)
Zgodnie z wymogami projektu, każdy z członków zespołu zaimplementował wymaganą serię testów automatycznych. Szczegóły znajdują się w katalogu `tests/playwright/`:
- `test_maminikie.py` - Testy: 3 Frontend, 3 API, 3 Mocked (autor: maminikie)
- `test_tamatama.py` - Testy: 3 Frontend, 3 API, 3 Mocked (autor: tamatama)
- `test_hamikyu.py` - Testy: 3 Frontend, 3 API, 3 Mocked (autor: hamikyu)
- `test_zespol_auth.py` - 3 Testy grupowe ze stanem autoryzacji (storageState).

Dokumentacja testowa znajduje się w pliku `docs/dokumentacja_testowa.md` i zawiera kompletny, retrospekcyjny Plan Testów oraz Przypadki Testowe.

## 🚀 Uruchomienie projektu

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### 1. Zmienne środowiskowe i baza Supabase
Skopiuj `.env.example` do `.env.local` i uzupełnij klucze, albo skorzystaj z istniejących. 
W Supabase Dashboard → SQL Editor uruchom migrację z pliku `supabase/migrations/20250311000000_initial_schema.sql`.

### 2. Instalacja zależności i uruchomienie serwera
```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Aplikacja jest domyślnie dostępna pod `http://localhost:3000`.

## 🧪 Uruchomienie Testów

### Testy Jednostkowe (Jest)
```bash
npm test
```

### Testy Automatyczne Playwright (Python)
Testy te należy odtworzyć w wirtualnym środowisku Pythona po zainstalowaniu zależności.
```bash
cd tests/playwright
pip install -r requirements.txt
playwright install
pytest
```
Testy zostaną puszczone wraz z raportami dostępnymi po ich wykonaniu z użyciem `pytest`.
