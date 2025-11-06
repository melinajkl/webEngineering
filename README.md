# Web Engineering – Smarter Essensplaner
Ein Next.js-Projekt zur Verwaltung von Rezepten und einer smarten Einkaufsliste.  
Rezepte können inklusive der zugehörigen Zutaten und Arbeitsschritte erstellt und gelöscht werden.  
Zutaten mit den jeweils benötigten Mengen lassen sich direkt zur Shopping List hinzufügen.  
Auf der Seite Shopping List werden alle Einträge nach Kategorien sortiert angezeigt. Sie können nach All, Active oder Done gefiltert und beim Einkaufen bequem abgehakt oder entfernt werden.
## 🎯 Kontext

**Thema:** Smarter Essensplaner

Webanwendung, mit der Nutzer:innen ihre Mahlzeiten effizient planen können.  
Dazu gehören:

- das Verwalten von Rezepten
- und das automatische Erzeugen einer Einkaufsliste auf Basis der geplanten Portionen.



## ✅ Aktuelle Funktionen

### Rezepteverwaltung (Seite: `Recipes`)

- **Übersicht aller Rezepte**  
  Auf der Seite **Recipes** werden alle vorhandenen Rezepte übersichtlich angezeigt.

- **Rezepte erstellen**  
  Über den Button **Create Recipe** können neue Rezepte angelegt werden – inklusive:
    - Zutaten,
    - Arbeitsschritten,
    - sowie weiteren Attributen (z. B. Kategorien, Beschreibung etc.).

  Innerhalb des Formulars zur Rezeptanlage können zusätzliche, für das Rezept benötigte Zutaten direkt neu angelegt werden.

- **Rezepte löschen**  
  Bestehende Rezepte können aus der Übersicht heraus gelöscht werden.

- **Zutaten zur Shopping List hinzufügen**  
  Mit dem Button **Add** auf jedem Rezept lassen sich einzelne Zutaten – inklusive Menge – zur **Shopping List** hinzufügen.

### Einkaufsliste (Seite: `Shopping List`)

- **Kategorisierte Anzeige**  
  Auf der Seite **Shopping List** sind alle zuvor hinzugefügten Zutaten nach Kategorien sortiert aufgelistet.

- **Interaktives Abhaken & Löschen**  
  Zutaten können:
    - beim Einkaufen abgehakt oder
    - direkt aus der Liste gelöscht werden.

- **Filterung nach Status**  
  Über die Schaltflächen **All**, **Active** und **Done** kann die Shopping List gefiltert werden, z. B. um nur noch offene Positionen zu sehen.


## ✨ Ausblick – Weitere Funktionen

Folgende Funktionen könnten in Zukunft weiterführend implementiert werden:

- **Kalenderseite mit Tagesübersicht**  
  Eine Kalenderansicht bietet eine Übersicht der täglichen Planung (z. B. Frühstück, Mittagessen, Abendessen).

- **Planung von Mahlzeiten über den Kalender**  
  Über die Kalenderseite können Mahlzeiten für bestimmte Tage und Zeiten eingeplant werden.

- **Portionsrechner für Zutatenmengen**  
  Die Menge der Zutaten der geplanten Mahlzeiten kann mittels eines Portionsrechners dynamisch angepasst werden.  
  Die berechneten Mengen werden anschließend auf die Einkaufsliste geschrieben.

- **Rezeptaufruf aus der Tagesplanung**  
  Aus der Tagesplanung heraus kann direkt das zugehörige Rezept geöffnet werden, um es nachzukochen (Zubereitungsschritte, Zutaten etc.).

- **Automatische Einkaufsliste mit Summierung**  
  Auf der Shopping-/Einkaufsliste werden alle benötigten Zutaten aus allen geplanten Mahlzeiten zu einem **Gesamtbedarf** aufsummiert.  
  Zusätzlich wird ein **Verwendungsdatum** angezeigt, damit klar ist, für welchen Tag bzw. Zeitraum die Zutaten gebraucht werden.


## 🚀 Schnellstart

### Voraussetzungen
- Node.js ≥ 20
- pnpm

### Installation & DB
```bash
# Abhängigkeiten
pnpm install

# Datenbankschema anwenden
pnpm db:push

# Seeds einspielen
npx tsx src/server/db/seed.ts