# Plan Testów (retrospekcyjny) - Projekt FitaTuLepsze

## 1. Plan Testów

### Cele testów
Sprawdzenie, czy aplikacja FitaTuLepsze działa poprawnie, niezawodnie, bezpiecznie i zgodnie z założeniami biznesowymi. Chcemy zweryfikować, czy:
- Interfejs użytkownika jest bezbłędny i czytelny (zwłaszcza tabele kalorii i postępów makroskładników).
- Poszczególne sekcje poprawnie reagują na dane wprowadzane przez użytkownika.
- Aplikacja odpowiednio komunikuje się z API (pobieranie/usuwanie/dodawanie).
- Zapewnienie stabilności sesji dzięki autoryzacji (logowanie/wylogowanie) przy pomocy Supabase.

### Zakres testów
**Objęte testami:**
- Moduły logowania oraz rejestracji kont (z uwzględnieniem zapisanego stanu sesji).
- Funkcjonalności pobierania, dodawania i zarządzania danymi frontendowymi (m.in. tabela produktów, komponenty postępów i śledzenia statystyk kalorii).
- Odpowiedź endpointów API (prawidłowy format, mockowane błędy po stronie serwera).
- Mechanika renderowania po stronie klienta (obsługa testów jednostkowych w Jest).

**Nie objęte testami:**
- Zaawansowane ataki bezpieczeństwa, ataki DDoS i audyty podatności zewnętrznej.
- Pełne testowanie bazy danych Supabase na masową skalę (stress-testing).

### Strategia testowania
- **Testy E2E (Playwright - Python)**: Kluczowe dla symulacji zachowania prawdziwego użytkownika, z uwzględnieniem pełnego cyklu (np. rejestracja -> dodanie produktu -> weryfikacja statystyki).
- **Testy jednostkowe (Jest)**: Obejmują najważniejsze funkcje czysto JavaScript/TypeScript, które przetwarzają dane logiczne (obliczenia kalorii, zliczanie makroskładników, walidację dat i stringów).
- **Testy z mockowaniem (Playwright)**: Stosowane, aby w szybki sposób zweryfikować czy frontend odpowiednio reaguje na nietypowe zwroty z API (błędy, dziwne zagnieżdżenia), bez konieczności rekonfiguracji całej bazy danych dla każdego testu.
- **Testy API (Playwright Request)**: Używane w celu potwierdzenia, czy endpointy aplikacji gwarantują prawidłowe i integralne dane wyjściowe.

### Środowisko testowe
- Przeglądarka: Chromium, wbudowana w środowisko Playwright.
- System operacyjny: Windows / Linux CI environment.
- Język/Biblioteki: Python 3.10+ (Playwright, pytest, Python API), Node.js (Jest) dla frontendu (Next.js 15).
- Baza danych/Auth: Supabase Local / Remote.

### Harmonogram testów (szacunkowy)
- **Tydzień 1:** Zaprojektowanie przypadków testowych. Zbudowanie frameworka dla testów jednostkowych (Jest).
- **Tydzień 2:** Rozpoczęcie pisania testów frontendu (Playwright) przez cały zespół.
- **Tydzień 3:** Wdrażanie testów API oraz Mockowanych. Przejście z testowania podstawowego na zaawansowaną automatyzację (StorageState).
- **Tydzień 4:** Przegląd raportów, integracja i naprawa niedziałających e2e. Wysłanie gotowych rezultatów do końcowego sprawdzianu.

### Kryteria wejścia / wyjścia
**Kryteria wejścia:**
- Istniejące środowisko deweloperskie, lokalnie uruchamialne repozytorium (skrypt `npm run dev` stabilnie startuje serwer Next.js na docelowym porcie).
- Przypisane konto Supabase ze wstępnie przygotowanym schematem.
- Zapoznanie z zatwierdzonym podziałem testów między `maminikie`, `tamatama` i `hamikyu`.

**Kryteria wyjścia:**
- Cała założona pula zadeklarowanych testów automatycznych (Playwright: Front, Mock, API, Storage) działa przynosząc status PASS. Oczekiwany % wskaźnik wykonanych z sukcesem to minimum 90%.
- Udokumentowane Przypadki Testowe.

### Ryzyka i ich mitygacja
| Ryzyko | Potencjalny skutek | Co zrobimy |
| ------ | ------------------ | ---------- |
| Problemy z dostępnością instancji Supabase Cloud | Brak możliwości przetestowania rzeczywistych endpointów auth / DB. | Tymczasowe przełączenie na Mocki oraz testowanie lokalnej logiki frontendu. Zezwolenie na wybiórcze pominięcie E2E łączących się z backendem.|
| Zmiana klas UI / Selektorów w Next.js przez framework (np. shadcn/ui) | Upadek dużej grupy testów E2E, błędy Playwright przy dobieraniu elementów. | Oparcie Playwright o solidne `getByRole`, `getByTestId` oraz `getByPlaceHolder` gdzie to możliwe. Unikanie bezwzględnych XPathów. |
| Problemy z równoległym uruchamianiem Playwright | Puste bazy lub konflikty kont testowych. | Każdy przypadek zależy od logiki tworzenia własnych unikalnych wartości (np. timestamp w nazwie lub własny mock). |

### Role w zespole
- **maminikie** (Tester) - Automatyzacja, przegląd logiki raportowania testów e2e. Tworzenie testów (Front, API, Mock).
- **tamatama** (Tester) - Wykonywanie testów API i integracja autoryzacji z Playwright `storageState`. Tworzenie testów (Front, API, Mock).
- **hamikyu** (Lider) - Odpowiedzialny za przypadki testowe dla modułów śledzenia i jednostkowe statystyki makroskładników. Tworzenie testów (Front, API, Mock).

---
## 2. Przypadki Testowe

Poniżej przygotowano przynajmniej po 5 Przypadków Testowych dla każdego członka zespołu.

### Autor: maminikie (5 Przypadków)

#### 1. TC-MAM-001: Prawidłowe ładowanie tabeli produktów
- **Warunki wstępne:** Użytkownik jest zalogowany pomyślnie. Aplikacja odpowiada.
- **Dane testowe:** (Brak specyficznego wkładu).
- **Kroki:** 
  1. Otwórz podstronę `/produkty`.
  2. Sprawdź widoczność nagłówka 'Baza Posiłków'.
  3. Upewnij się, że tabela danych została zaideksowana i zwrócona w HTML.
- **Oczekiwany rezultat:** Wszystkie bazowe kolumny tabeli ("Nazwa", "Marka", "Kcal", itp.) są wyraźnie widoczne, a strona podczytuje chociaż jeden wiersz posiłku z serwera po zakończeniu spinnnera.

#### 2. TC-MAM-002: Rejestracja użytkownika - Poprawne wysłanie formularza
- **Warunki wstępne:** System poprawnie się startuje, działający formularz na `/rejestracja`.
- **Dane testowe:** Wygenerowany email: np. `test_mam_register@example.com`, Hasło: `ValidPassword123!`
- **Kroki:** 
  1. Wejdź na `/rejestracja`. 
  2. Wypełnij pola "Email", "Password". 
  3. Kliknij przycisk "Zarejestruj się".
- **Oczekiwany rezultat:** Użytkownik zostaje przekierowany na widok pożądanego dashboardu lub pojawia się odpowiedź potwierdzająca poprawność procesu rejestracji bez czerwonego tekstu błędu.

#### 3. TC-MAM-003: Wyszukiwanie produktu
- **Warunki wstępne:** Istniejące produkty w tabeli `/produkty`.
- **Dane testowe:** Fraza "Banan".
- **Kroki:** 
  1. Wejdź na stronę produktów. 
  2. Wpisz w pole tekstowe szukaj "Banan". 
  3. Uruchom poszukiwanie (wciśnij submit / kliknij szkło).
- **Oczekiwany rezultat:** Tabela się przefiltruje; żaden znajdujący się na liście rekord nie będzie kolidować z frazą "Banan". 

#### 4. TC-MAM-004: Wymuszony Błąd Serwera (Mock) na żądaniu logowania
- **Warunki wstępne:** Użytkownik przebywa na `/login`. Formularz autoryzacji z Playwright używa interceptingu (`page.route()`).
- **Dane testowe:** Błąd: 500, status internal server error mockowany z interceptu.
- **Kroki:** 
  1. Skonfiguruj intercept w Playwright do zwracania `{ error: "Service unavailable" }`. 
  2. Wpisz dowolny email/hasło i kliknij login.
- **Oczekiwany rezultat:** Interfejs nie ulega awarii, zostaje wyświetlony wbudowany toast / Alert komunikujący o tym, że usługa jest tymczasowo zablokowana i login.

#### 5. TC-MAM-005: Wylogowywanie i powrót do widoku domyślnego
- **Warunki wstępne:** Użytkownik jest zalogowany i ma przed oczyma moduł głównego menu postępu.
- **Dane testowe:** (Brak).
- **Kroki:** 
  1. Otwórz menu konta i wybierz przycisk "Wyloguj". 
  2. Spróbuj bez pośrednictwa zalogowania przejść z powrotem na `/postep`.
- **Oczekiwany rezultat:** Widok postępu jest niedostępny i wyświetlany lub nawigowany wprost do `/login`.

---

### Autor: tamatama (5 Przypadków)

#### 1. TC-TAM-001: Sortowanie produktów 
- **Warunki wstępne:** Na panelu `/produkty` w widoku znajduje się więcej niż 2 różniące się kalorycznie elementy.
- **Dane testowe:** Tabela bez wybranego wcześniej filtra sortowania.
- **Kroki:** 
  1. Wejdź na `/produkty`. 
  2. Kliknij w nagłówek "Kalorie" lub rozwiń odpowiedni przycisk.
- **Oczekiwany rezultat:** Zawartość układa się od razu od najniższej kaloryki. Po ponownym naciśnięciu - od najwyższej.

#### 2. TC-TAM-002: Walidacja błędu hasła (Zbyt krótkie logowanie)
- **Warunki wstępne:** Rozpoczęty formularz na `/login`.
- **Dane testowe:** Prawidłowy użytkownik, hasło krótsze niż 6 znaków (np. `abcde`).
- **Kroki:** 
  1. Wpisz maila w oknie loginu. 
  2. Wpisz hasło "abcde". 
  3. Spróbuj się zalogować.
- **Oczekiwany rezultat:** Formularz odbija request jeszcze przez backendem / UI z opcją błędu (zbyt krótkie hasło) obok samego pola input.

#### 3. TC-TAM-003: Sprawdzanie odpowiedz API (Endpoint Dziennika / Wykresu)
- **Warunki wstępne:** Wywoływany surowy request HTTP.
- **Dane testowe:** Wyciągniecie statystyk / kalorii. Request GET.
- **Kroki:** 
  1. Wykonanie requestu przez Playwright API requestcontext `get("/api/..." | endpoint)` podając nagłówki. 
  2. Odczyt zwracanej struktury.
- **Oczekiwany rezultat:** Zwrócony dokument JSON gwarantuje odpowiedni typ HTTP = 200, dane są odkodowane lub ułożone w logicznej strukturze JSONowej, która odpowiada kluczom. 

#### 4. TC-TAM-004: Dodawanie własnego produktu do bazy 
- **Warunki wstępne:** Istnieje użytkownik mający dostęp do modułu produktów.
- **Dane testowe:** Nowy produkt: "TestDietetycznyWorek", Kcal: "115", węglowodany: 20
- **Kroki:** 
  1. Naciśnij "Dodaj Produkt".
  2. Uzupełnij formatkę swoimi wartościami (bez błędów).
  3. Kliknij w przycisk zapisu. 
  4. Odśwież i wyszukaj "TestDietetycznyWorek".
- **Oczekiwany rezultat:** Nowy rekord, z danymi adekwatnymi do wypełnionego przed momentem formularza, znajduje się w głównym układzie tabelarycznym.

#### 5. TC-TAM-005: Mockowanie pustej sieci przy ładowaniu postępów (0 kcal)
- **Warunki wstępne:** Załadowana pusta baza lub mockowane zero w endpoint/zapytaniu frontendowym.
- **Dane testowe:** Payload Mocka: `{ currentCalories: 0, target: 2000 }` dla testu frontowego.
- **Kroki:** 
  1. Wstrzyknięcie Playwright route intercept z odpowiednim zerowaniem i przepuszczenie widoku Postępu Kalorycznego.
- **Oczekiwany rezultat:** Użytkownik widzi postęp jako okrągłe 0%, komunikaty przybierają kształt zachęcający do dodania nowego posiłku (zależność na bazie widokowej Next.js / Shadcn dla statystyk 0).

---

### Autor: hamikyu (5 Przypadków)

#### 1. TC-HAM-001: Nawigacja pomiędzy sekcjami głównymi na mobilce
- **Warunki wstępne:** Rozdzielczość Playwright zmieniona na okno telefonu (Mobile viewport) ~ 375x667.
- **Dane testowe:** Widoczność w menu rozwijanym opcji takich jak "Dziennik" lub "Profil".
- **Kroki:** 
  1. Kliknięcie widocznego tzw. Hamburger menu. 
  2. Wybór podsekcji "Profil".
- **Oczekiwany rezultat:** Menu responsywnie się zamknie po klinięciu panelu linku; widok gładko się podmieni na `/profil`.

#### 2. TC-HAM-002: Usuwanie elementu z dziennika
- **Warunki wstępne:** Użytkownik posiada co najmniej jeden wpis dodanego posiłku w wyznaczonym "dzienniku kalorii".
- **Dane testowe:** Rekord dziennika wygenerowany tuż przed właściwą próbą.
- **Kroki:** 
  1. Znalezienie testowego rzędu dziennika zapisanego podczas sesji. 
  2. Kliknięcie odpowiedniej ikony (Trash / Kosz). 
  3. Ewentualne zaakceptowanie powiadomienia Confirm (opcjonalnie). 
  4. Weryfikacja.
- **Oczekiwany rezultat:** Element natychmiast znika wizualnie ze sprawdzanej tabeli (optimistic UI lub regularne przeładowanie / usunięcie DOM). Opcjonalnie wyświetla Toast "Usunięto pomyślnie".

#### 3. TC-HAM-003: Podróż Uwierzytelnionego (StorageState Use)
- **Warunki wstępne:** Posiadanie pliku z tokenem i StorageState wygenerowanego z testów Setup.
- **Dane testowe:** Zaladowana sesja z pliku Auth.
- **Kroki:** 
  1. Test w środowisku upewnia się, że sesja "żyje".
  2. Przepuszczenie wejścia na bezpieczny end point np. Dziennik - pominiecie całkowicie loginu.
- **Oczekiwany rezultat:** Endpoint bezpieczny podaje stronę - użytkownik widzi postępy loginu bez jakiegokolwiek ekranu przeładowania dla samej wtyczki Next.js/Supabase, wchodząc od razu w akcje.

#### 4. TC-HAM-004: Błąd uszkodzonego Payloadu podczas wysyłania dziennika (Mock 400)
- **Warunki wstępne:** Formularz dodania do dziennika na stronie `/dziennik`. Intercept wysyłania postform wyrzucający bad-request HTTP 400.
- **Dane testowe:** Prawidlowo wybrane parametry potrawy przekazane do UI obok mockowanego błędu `400 Bad Request Payload`.
- **Kroki:** 
  1. Uruchom route i dodaj produkt w dzienniku. 
  2. Po wciśnięciu "Zapisz", aplikacja odrzuci formularz korzystając z wymuszonego bledu serwerowego.
- **Oczekiwany rezultat:** Zamiast uszkodzenia aplikacji, komponent wysyła czerwony status/feedback błędu zapisu po stronie interfejsu klienta. Element z pola wejścia formularza nie ulega przy tym bezmyślnemu skasowaniu, tylko pozostaje dla ew. korekty.

#### 5. TC-HAM-005: Prawidłowe wczytywanie avataru w menu z profilu
- **Warunki wstępne:** Sekcja App-Header ładująca plik zdjęcia profilowego w navbarze (lub default z nazwy komponentu AVATAR).
- **Dane testowe:** -
- **Kroki:** 
  1. Logujemy sie / lub posiadamy Storage State. 
  2. Obserwujemy prawy dolny / górny obrys paska nawigacyjnego z Avatar komponentem. 
  3. Czekamy na status image load / div load dla avarat.
- **Oczekiwany rezultat:** Awatar nie wywala 404. Posiada fallback np. pierwszej domyślnej litery użytkownika lub załadowane właściwe zdjęcie profilowe, nie powiększając się absurdalnie (nie zachodząc na obok leżące napisy).
