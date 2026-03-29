# pw_sample_project
Playwright Sample Project Testing UI &amp; API using POM &amp; Fixtures

## Asuführung aller Tests
- 'npx playwright test'

## Dieses Projekt stellt eine kleine Demo der Playwright Test Solution dar, die über folgeden 3 Testfiles verfügt:
 - "api.spec.ts" -> bildet mittels der Seite "https://restful-booker.herokuapp.com/" einen Workflow von API-Requests ab
 - "auth.setup.ts" -> dient als ein Setup, wodurch die Authentifizierung der Benutzer ("Normal"- Benutzer und "Admin"-Benutzer) gespeichert/konfiguriert wird
 - "basic-testcases.spec.ts"-> besteht aus 3 elementaren UI-Tests, die die Funktionalitäten der Seite "https://www.saucedemo.com/" unten anderem durch Snapshots abtesten

 ## Die richtige Funktionalität der Tests und der ganzen Test Solution ist auch durch den folgenden Files gewährleistet:
 - /page-objects/*Files -> Die Files bilden die grundlegenden Elemente der Seiten (im Sinne des "Page-Object-Models")
 - /controllers/BookingController.ts -> In diesem File befinden sich vor allem die Methoden, die zwecks API-Tests verwendet werden, was die Testslesbarkeit & Wartung verbessert
 - /controllers/AccountManager.ts -> Der Code stellt eine Basis für Accountauswahl dar, was weiter im "myFixture" File verwendet wird
 - /myFixture.ts -> Der File erweitert die PlaywrightTestBasis um weitere Funktionen/FUnktionalitäten oder sog. Fixtures,
 die Fixtures gliedern sich in "Test-Scoped" (geltend für die ganze TestSolution) und "Worker-Scoped" (derer "Gültigkeit" nur auf ein Worker begrenzt ist).
  -- Die Worker-Scoped Fixtures beschäftigen sich mit Benuzuerauthentifizierung, und können zur automatischen Ordnung eines Benutzers einem Worker verwendet werden,
 aktuell werden aber die Benutzer/Authentifizierungen nur durch den File "auth.setup.ts" behandelt.
  -- Die Test-Scoped Fixtures sind aktiv durch im Testfile "basic-testcases.spec.ts" verwendet - es handelt sich um die Darstellung der Seitenobjekte (durch LoginPage & InventoryPage) und um eine modifizierte Playwright Funktion "toHaveScreenshot", derer Modifikation als "checkVisually" bezeichnet wurde - dadurch werden die Snapshots entweder der ganzen Seite oder des Elementenbereiches aufgenommen und überprüft.
  - auth.teardown.ts -> Nach der Testausführung werden die Authentifizierungstates gelöscht.
  - playwright.config.ts -> Der File beinhaltet die grundlegende Konfigurationseinstellungen des Projektes
  - playwright.yml -> Die Tests können auch durch den "GitHub Actions" Workflow ausgeführt werden, nach der Testausfürhung werden die konfigurierte Reports erstellt.


