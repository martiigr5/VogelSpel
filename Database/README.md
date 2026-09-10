# Het Vogelspel

Een educatief point-and-click spel voor NT2-leerlingen van 9 tot 12 jaar, met een docentendashboard voor het bijhouden van voortgang.

## Technische stack

- **Frontend:** Angular (latest)
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL 18

## Vereisten

Installeer het volgende voordat je begint:

- [Node.js LTS](https://nodejs.org)
- [PostgreSQL 18](https://www.postgresql.org/download/)
- Angular CLI: `npm install -g @angular/cli`

## Installatie

### 1. Database opzetten

Open een terminal en start PostgreSQL:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -p 5432
```

Maak de database aan en laad het schema:

```sql
CREATE DATABASE vogelspel;
\c vogelspel
\i D:/VogelSpel/Database/schema.sql
\q
```

> **Let op:** Pas de poort aan als je PostgreSQL op een andere poort hebt draaien.

---

### 2. Backend opzetten

```powershell
cd backend
npm install
```

Maak een `.env` bestand aan in de `backend/` map:

```
DB_HOST=localhost
DB_PORT=5000
DB_NAME=vogelspel
DB_USER=postgres
DB_PASSWORD=jouw_postgres_wachtwoord
JWT_SECRET=verzin_een_lang_geheim_woord
PORT=3000
```

Start de backend:

```powershell
npm run dev
```

De backend draait op `http://localhost:3000`. Controleer via `http://localhost:3000/api/health`.

---

### 3. Frontend opzetten

```powershell
cd frontend
npm install
ng serve
```

De frontend draait op `http://localhost:4200`.

---

## Mappenstructuur

```
vogelspel/
├── frontend/          ← Angular applicatie
│   └── src/app/
│       ├── auth/          ← Login, registratie, guards
│       ├── menu/          ← Hoofdmenu leerling
│       ├── game/          ← Levelkeuze
│       │   └── level1/    ← Niveau 1: klankherkenning
│       ├── laden/         ← Spel laden scherm
│       ├── dashboard/     ← Docentendashboard
│       │   ├── sidebar/
│       │   ├── leerlingen/
│       │   ├── klassen/
│       │   ├── instellingen/
│       │   ├── levels/
│       │   └── meldingen/
│       └── shared/
│           └── services/  ← AuthService, GameService, ProgressService
├── backend/           ← Express.js API
│   └── src/
│       ├── routes/        ← auth, game, progress, klassen, leerlingen
│       ├── middleware/    ← JWT authenticatie
│       └── db/            ← PostgreSQL pool
└── database/
    └── schema.sql     ← Databaseschema met seed data
```

---

## Accounts aanmaken

Na het installeren kun je via de registratiepagina (`/register`) accounts aanmaken. Kies bij rol **Docent** voor toegang tot het dashboard.

Of via de terminal:

```powershell
# Docent aanmaken
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"voornaam":"Test","achternaam":"Docent","klas":"","email":"docent@test.nl","password":"test1234","role":"teacher"}'

# Leerling aanmaken
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"voornaam":"Test","achternaam":"Leerling","klas":"A3","email":"leerling@test.nl","password":"test1234","role":"student"}'
```

---

## Functionaliteiten

### Leerling
- Registreren en inloggen
- Hoofdmenu met nieuw spel, spel laden en uitloggen
- Niveau 1: klankherkenning (point-and-click)
- Voortgang automatisch opgeslagen
- Meerdere spellen kunnen opslaan en laden

### Docent
- Inloggen op dashboard
- Overzicht van leerlingvoortgang
- Leerlingen beheren (toevoegen, bewerken, verwijderen)
- Klassen beheren (toevoegen, verwijderen)

---

## Omgevingsvariabelen

| Variabele     | Beschrijving                        |
|---------------|-------------------------------------|
| DB_HOST       | Host van de PostgreSQL database     |
| DB_PORT       | Poort van PostgreSQL (standaard 5432) |
| DB_NAME       | Naam van de database                |
| DB_USER       | PostgreSQL gebruikersnaam           |
| DB_PASSWORD   | PostgreSQL wachtwoord               |
| JWT_SECRET    | Geheime sleutel voor JWT tokens     |
| PORT          | Poort waarop de backend draait      |

---

## Bekende aandachtspunten

-	Het .env bestand staat niet in Git — maak dit handmatig aan
-	Niveau 2, 3 en 4 zijn nog niet gebouwd
-	Placeholders voor afbeeldingen
-	Opties menu in game moet nog ontwikkeld worden
-	Bij het dashboard moeten, klassenoverzicht, leveloverzicht en meldingen volledig implementeren.
-	Het bewerken van accounts is nog niet mogelijk. Wel het verwijderen.
