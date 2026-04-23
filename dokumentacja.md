# AiTSI 2025/26 L - Projekt nr. 1 - Testowanie systemów informatycznych

## ℹ️ Informacje o projekcie

**Skład zespołu:**
- tamatama
- maminikie
- hamikyu (Lider zespołu)

**Tytuł projektu:** FitaTu Lepsze

**Opis projektu:** 
FitaTu Lepsze to aplikacja webowa służąca do asystowania użytkownikowi w śledzeniu dziennego spożycia kalorii, makroskładników oraz postępów w diecie. Główne funkcjonalności obejmują możliwość logowania i rejestracji, dodawania spożytych posiłków do dziennika, katalogowania produktów spożywczych oraz śledzenia postępów za pomocą wykresów (m.in. podsumowania makroskładników czy realizacji tygodniowych celów).

**Link do repozytorium GitHub:** 
W obrębie zespołu lokalnego (do podania pełny link GitHub w końcowym raporcie PDF)

---

## 🗺️ Plan Testów (retrospekcyjny)

**Cele testów:**
Głównym celem testów jest upewnienie się, że aplikacja FitaTu działa poprawnie z perspektywy klienta końcowego. Sprawdzane są w szczególności procesy uwarunkowane poprawnym gromadzeniem danych (dziennik żywieniowy, autoryzacja), niezawodność logiki obliczania kalorii i makroskładników w podsumowaniach oraz odporność aplikacji na nietypowe zachowania użytkowników (walidacje).

**Zakres testów:**
Testami objęte zostały funkcjonalności frontendowe aplikacji oparte o framework Next.js: rejestracja, logowanie, ścieżki i panele w których dokonuje się interakcji (Dziennik, Produkty, Postęp). Przetestowane są też komponenty odpowiedzialne za wysyłanie odpowiednich żądań do bazy (Supabase). Wyłączone z testów zostały same infrastruktury bazodanowe providera zewnętrznego i płatności.

**Strategia testowania:**
- **Testy jednostkowe:** Weryfikowanie logiki pomocniczej np. do przeliczania wartości odżywczych (`nutrition.test.ts`), dat i formatowania w TypeScript (`utils.test.ts`) za pomocą frameworka Jest.
- **Testy automatyczne (End-to-End):** Sprawdzanie całościowych ścieżek od momentu wyrenderowania GUI przez Playwright w środowisku Python do symulacji zdarzeń. Pokrywają najważniejsze procesy "czarnoskrzynkowo" (od logowania po wprowadzanie posiłków).
- **Zaawansowana Automatyzacja:** Wykorzystanie API testing oraz mocków `page.route` do manipulowania zablokowanymi ścieżkami lub symulacji błędów (np. awaria backendu) w celu sprawdzenia komunikatów dla użytkowników. Mechanizm `storageState` w celu optymalizacji i zachowania trwałej sesji.

**Środowisko testowe:**
Testy przeprowadzano z wykorzystaniem:
- Maszyn deweloperskich i środowiska CI (w przypadku podłączenia akcji) z zainstalowanym Node.js oraz Python 3.10+.
- Przeglądarka internetowa do E2E: Chromium (konfiguracja domyślna w Playwright).
- Biblioteki używane do assert'ów: Pytest (Playwright) na E2E oraz Jest do testów jednostkowych.
- Baza danych/API: Testy działają do środowiska lokalnego wspierającego instancję Supabase.

**Harmonogram testów (szacowany):**
- **Tydzień 1-2:** Analiza wymagań, ustalenie przypadku i napisanie testów E2E podstawowych funkcjonalności strony.
- **Tydzień 3-4:** Rozwój testów na kolejne moduły (produkty, postęp) w Playwright i rozszerzenie `playwright/tests`.
- **Tydzień 5-6:** Przygotowanie infrastruktury zaawansowanej (API Requests, mocki), stabilizacja testów (Flakiness). Generowanie wczesnej dokumentacji.
- **Tydzień 7:** Testy regresyjne i końcow raport z rezultatami.

**Kryteria wejścia / wyjścia:**
- **Wejście:** Zaimplementowanie przez programistę struktury pod daną stronę (np. `dziennik/page.tsx`), możliwość jej uruchomienia i ręcznego stwierdzenia dostępu, zdefiniowanie wymagań w `Przebieg Testowy`.
- **Wyjście:** Poprawne przepuszczenie testu ze sprawdzeniem `expect/assert` statusu UI lub obiektywny "FAILED" opisujący defekt wraz z zebraniem logów i screenshotów; przejście zestawu testów w akceptowalnym czasie (< 5 minut). Pokryto najważniejsze ścieżki i krytyczne defekty (brak logowania/awaria dziennika) uniemożliwiające korzystanie z apki zostały przetestowane i zraportowane.

**Ryzyka:**
- *Niestabilność działania widoków na wolnym renderowaniu:* Remedium: użycie domyślnych wbudowanych opóźnień czuwania (auto-waiting) i selektorów `getByRole` frameworka Playwright.
- *Zależności zewnętrze (awaria Supabase):* Remedium: wykorzystanie odpowiedniego oznaczania testów E2E w Pytest lub wykonanie mockowania (`page.route()`), testy jednostkowe mogą działać niezależnie.
- *Dane w testach nachodzą na siebie:* Remedium: każdemu testowi powierzamy tworzenie zunikalizowanych parametrów (np. data.time testu) lub czyszczenie sesji po zakończeniu (lub oparcie o wydzielone statyczne konto testowe tam gdzie to konieczne).

**Role w zespole:**
- **Tester (Automatyzacja E2E):** tamatama
- **Tester (API & Postęp/Raporty):** maminikie
- **Test Manager & QA Architect:** hamikyu

---

## 📕 Przypadki Testowe

*Uwaga: W celu zapewnienia odpowiedniego stopnia szczegółowości sporządzono 15 przypadków testowych rozdzielonych na moduły odpowiedzialności poszczególnych osób (5 przypadków na osobę).*

### Praca - tamatama (Autoryzacja, Logowanie, Nawigacja podstawowa)

1. **TC-AUTH-01: Poprawne zalogowanie istniejącego użytkownika**
   - **Warunki wstępne:** W pełni zbudowana aplikacja z poprawnie wskazanym interfejsem `/login`. Użytkownik znajduje się w bazie Supabase.
   - **Dane testowe:** email: `testuser@fitatu.pl`, hasło: `ValidPassword123`
   - **Kroki:** 
     1. Przejdź na stronę `/login`
     2. Wpisz testowy email w polu E-Mail.
     3. Wpisz hasło w pole Hasło.
     4. Kliknij w przycisk "Zaloguj się"
   - **Oczekiwany rezultat:** Użytkownik loguje się prawidłowo, następuje przekierowanie na stronę `/dziennik` z powitaniem zalogowanego usera.

2. **TC-AUTH-02: Błędne hasło przy logowaniu**
   - **Warunki wstępne:** Użytkownik posiada konto w bazie danych, otwarto stronę `/login`.
   - **Dane testowe:** email: `testuser@fitatu.pl`, hasło: `ZleHaslo111`
   - **Kroki:** Wpisz poprawnego maila i złe hasło oraz kliknij zaloguj.
   - **Oczekiwany rezultat:** Pod formularzem pokazuje się element z wiadomością o "Nieprawidłowym loginie lub haśle", użytkownik nie zostaje przekierowany.

3. **TC-REG-01: Rejestracja - Hasła się nie zgadzają**
   - **Warunki wstępne:** Otwarta zakładka `/rejestracja`.
   - **Dane testowe:** email: `nowy@wp.pl`, hasło: `MojeHaslo1`, powtórz hasło: `MojeHaslo2`
   - **Kroki:** Wprowadzenie danych rejestracji, przy czym 2 pola na hasło różnią się wejściem, zatwierdź i kliknij "Stwórz konto".
   - **Oczekiwany rezultat:** UI reaguje natychmiastowym wyświetleniem walidacji "Hasła nie zgadzają się" i wyłącza puszczenie formularza przez `submit()`.

4. **TC-REG-02: Walidacja nieprawidłowego formatu email**
   - **Warunki wstępne:** Otwarta strona rejestracji lub logowania.
   - **Dane testowe:** Pole email: `to.nie.jest.email`
   - **Kroki:** Spróbuj wprowadzić dane bez `@` i wcisnąć zatwierdzenie.
   - **Oczekiwany rezultat:** Typ inputa (`type="email"`) i komponent formularza blokuje zadanie wskazując na tooltip błędu formatu przeglądarki.

5. **TC-NAV-01: Wymuszenie przekierowania przy braku autoryzacji**
   - **Warunki wstępne:** Użytkownik ma niezalogowaną / wyczyszczoną sesję.
   - **Dane testowe:** n/a
   - **Kroki:** Za pomocą nawigacji celowo uderz w zabezpieczony link `/profil` bez odpowiedniego cookie.
   - **Oczekiwany rezultat:** Router wykrywa brak autoryzacji podczas zew. żądania (middleware) upewniając się, czy user istnieje i dynamicznie przekierowuje spowrotem pod `/login`.

### Praca - maminikie (Dziennik posiłków, Produkty, API)

6. **TC-LOG-01: Puste zapytanie wyszukiwarki do katalogu Produktów**
   - **Warunki wstępne:** Działająca strona `/produkty` zwracająca listę. 
   - **Dane testowe:** String ` ` (spacja / null)
   - **Kroki:** Kliknij lupę wyszukiwania i nie podawaj żadnego ciągu znaku a następnie wciśnij enter w pasku na `/produkty`.
   - **Oczekiwany rezultat:** Backend powinien zaserwować 100 pierwszych podstawowych rekordów defaultowych bazy.

7. **TC-LOG-02: Filtrowanie istniejącego poprawnego produktu**
   - **Warunki wstępne:** Produkt o takiej nazwie widoczny był na domyślnej liście.
   - **Dane testowe:** Input paska wyszukiwania: `Banan`
   - **Kroki:** Wejdź na stronę Produktów i w module `Product catalog` wpisz `Banan`
   - **Oczekiwany rezultat:** Tabela zostaje wyczyszczona z błędnych danych i oczekiwany rekord pojawia się.

8. **TC-LOG-03: Wyświetlanie błędu w mockowanej awarii (Brak bazy dla posiłku)**
   - **Warunki wstępne:** Stan API zwraca 500 na posiłki.
   - **Dane testowe:** n/a
   - **Kroki:** Wejdź na `/dziennik` kiedy sieć wyrzuca błędy łączności.
   - **Oczekiwany rezultat:** Front end nie crashuje się po rzucanej strukturze null w tabeli `meals-table`, ale wyświetla grzeczny komponent "Nie mogliśmy załadować Twoich danych żywieniowych".

9. **TC-API-01: Poprawne zliczanie wag we front i API**
   - **Warunki wstępne:** Kosmetyczne wartości kalorii przy odpowiednich gramaturach.
   - **Dane testowe:** Z produktu (100kcal na 100g) wpisać ilość gram: 50.
   - **Kroki:** Otwórz `meal-entry-sheet`, wybierz i daj gramaturę ręcznie na `50g` we wpisie do kalkulatora makrosów. 
   - **Oczekiwany rezultat:** Kcal wyliczone na inputie powinno wskazać dynamiczne przeładowanie na `50kcal`.

10. **TC-API-02: Status wykreowania posiłku - zły typ daty / brak danych**
    - **Warunki wstępne:** Walidacje w formularzu dziennika.
    - **Dane testowe:** Pola puste (brak wybranego referencji produktu na formularzu)
    - **Kroki:** Klinij dodaj "Zaplanuj" nie określając składnika referencyjnego na sheetcie.
    - **Oczekiwany rezultat:** Blokada operacji i notyfikacja wizualna z błędem w celu ochrony struktury.

### Praca - hamikyu (Wykresy, Cel Tygodniowy, Statystyki Postępu)

11. **TC-PROG-01: Wykres Macro Pie po wprowadzeniu posiłku**
    - **Warunki wstępne:** Użytkownik zjadł 1 posiłek warty 20g węglowodanów i 10g białka danego dnia.
    - **Dane testowe:** Skomponowany zasób z API.
    - **Kroki:** Przejdź do `/postep` i zweryfikuj wycinek na ekranie w okręgu.
    - **Oczekiwany rezultat:** SVG w `macro-pie-chart` odpowiednio w legendzie pozycjonuje % i wyświetla niezerowe odchylenia. Węglowodany wizualnie tworzą większą szerokość "tortu" niż Białko.

12. **TC-PROG-02: Przerwanie statusu Streak Tracker (Postęp ciągłości)**
    - **Warunki wstępne:** W aplikacji zapisano, że w ostatnich 2 dniach brakowało pożywienia.
    - **Dane testowe:** Oś dat z pustymi listami.
    - **Kroki:** Zaloguj się po dwóch dniach i popatrz w zakładkę dziennik dla obecnego streaku.
    - **Oczekiwany rezultat:** Wskaźnik `progress-streak-card` resetuje się podając ogień/streak w okolice `0` i podpowiada aby ruszyć do dzieła.

13. **TC-PROG-03: Realizowanie tygodniowego celu**
    - **Warunki wstępne:** Definicja `weekly-calories` ma limit 14 000 kcal tygodniowo, w poniedziałek zjadasz 2000.
    - **Dane testowe:** Limit user: `14000`, obecne posumowanie dni `2000`
    - **Kroki:** Otwórz profil tygodnia, popatrz na postęp pod kartą `progress-weekly-goal-card`.
    - **Oczekiwany rezultat:** Pasek postępu wskazuje matematycznie poprawnie, że zebrano określoną proporcję kalorii.

14. **TC-PROG-04: Wpływ zmiany celu dziennego na progresję (Brak bugów przepełnienia)**
    - **Warunki wstępne:** Twój cel na dany dzień wynosi 1500 kcal, po czym zjadasz duży posiłek 2000 kcal (przejedzenie / potężna owsianka z masłem orzechowym).
    - **Dane testowe:** CeL 1500, Posiłek 2000
    - **Kroki:** Idź na `/dziennik` (widok górnego paska dzisiejszej konsumpcji)
    - **Oczekiwany rezultat:** Komponent progresyjny potrafi zakolorować się jako "przejedzenie" wyświetlając komunikat (np. kolor czerwony paska i dodatni bonus kalorii jako `+500`). Wartość nie wywala `<div>`ów wizualnie przez błąd wielkości `width > 100%`.

15. **TC-UI-01: Responsywne okno wprowadzania posiłku**
    - **Warunki wstępne:** Wykonanie na mobilnej szerokości ekranu (np. `width: 375px`).
    - **Dane testowe:** Klik na "Dodaj posiłek".
    - **Kroki:** Będąc w `/dziennik` kliknij dodaj i otworzy się boczny arkusz (przez `ui/sheet`). 
    - **Oczekiwany rezultat:** Pasek wysuwa się prawidłowo ukrywając elementy poboczne a cała lista wyszukiwania w arkuszu poprawnie podziałkuje kolumny.
