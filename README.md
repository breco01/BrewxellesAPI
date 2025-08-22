# Brewxelles API

API voor Brussels-based bieren en brouwerijen. Ondersteunt **CRUD**-operaties voor zowel bieren als brouwerijen, inclusief **zoekfunctionaliteit**, **paginatie**, **sortering**, en **JWT-authenticatie** voor beveiligde routes.

---

## INSTALLATIE & GEBRUIK

Volg onderstaande stappen om het project lokaal te draaien.

### 1. Repository clonen of forken.

Voraleer je het project lokaal kunt draainen moet je het project ofwel
rechtstreeks clonen ofwel eerst forken en dan clonen.

Indien je het
rechtstreeks cloont voer je de volgende commando's uit:

```bash
git clone https://github.com/breco01/BrewxellesAPI
cd BrewxellesAPI
```

Indien je het eerst forkt dan zal de geforkte repository zich onder je eigen
gebruikersnaam bevinden met de naam dat je de repository hebt gegeven. In dit
geval voer je de volgende commando's uit onder de assumptie dat de naam van de
repository nog steeds "BrewxellesAPI" is:

```bash
git clone https://github.com/<jouw-gebruikersnaam>/brewxelles-api.git
cd BrewxellesAPI
```

### 2. Dependencies installeren

```bash
npm install
```

### 3. `.env`-bestand aanmaken

Maak in de root van het project een `.env`-bestand aan met minstens de volgende variabelen:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/brewxelles
JWT_SECRET=eenLangEnSterkGeheim
CORS_ORIGIN=http://localhost:5173 # of laat leeg voor alle origins
```

### 4. Database starten

Zorg dat **MongoDB** lokaal draait of gebruik een externe MongoDB Atlas connectiestring in `MONGO_URI`.

### 5. Applicatie starten

```bash
npm run dev   # development mode met nodemon
npm start     # production mode
```

De API draait nu op: [http://localhost:3000](http://localhost:3000)

---

## DOCUMENTATIE

### Swagger UI

Interactieve API-documentatie is beschikbaar op:

```
http://localhost:3000/docs
```

De Swagger-docs bevatten alle routes, parameters, request bodies, en response schema’s. JWT-auth kan rechtstreeks in de Swagger UI getest worden via de **Authorize**-knop.

### Rootpagina

Op [http://localhost:3000](http://localhost:3000) vind je de statische rootpagina (`public/index.html`).

### Health check

```
GET /api/health → { ok: true }
```

---

## AUTHENTICATIE

Deze API gebruikt **JWT Bearer Tokens** voor beveiligde routes.

### Registreren

```
POST /api/auth/register
{
  "username": "gebruiker",
  "password": "geheim"
}
```

### Inloggen

```
POST /api/auth/login
{
  "username": "gebruiker",
  "password": "geheim"
}
```

Response bevat `token`, te gebruiken in de Authorization-header:

```
Authorization: Bearer <token>
```

---

## API ENDPOINTS

### Brouwerijen (`/api/breweries`)

- **GET** `/api/breweries` → lijst met filters, zoek, paginatie
- **POST** `/api/breweries` → nieuwe brouwerij (JWT vereist)
- **GET** `/api/breweries/:id` → specifieke brouwerij
- **PUT** `/api/breweries/:id` → update (JWT vereist)
- **DELETE** `/api/breweries/:id` → verwijder (JWT vereist)

### Bieren (`/api/beers`)

- **GET** `/api/beers` → lijst met filters, zoek, paginatie
- **POST** `/api/beers` → nieuw bier (JWT vereist)
- **GET** `/api/beers/:id` → specifiek bier
- **PUT** `/api/beers/:id` → update (JWT vereist)
- **DELETE** `/api/beers/:id` → verwijder (JWT vereist)

---

## GEBRUIKTE TECHNOLOGIEËN & BRONNEN

| Technologie / tool     | Beschrijving                  | Bron                                                                                                                        |
| ---------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Node.js**            | JavaScript runtime            | [https://nodejs.org](https://youtu.be/Oe421EPjeBE?si=ACc8pwR7hUpED39u)                                                      |
| **Express**            | Web framework                 | [https://expressjs.com](https://youtu.be/Oe421EPjeBE?si=ACc8pwR7hUpED39u)                                                   |
| **MongoDB**            | NoSQL database                | [https://mongodb.com](https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/)    |
| **Mongoose**           | ODM voor MongoDB              | [https://mongoosejs.com](https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/) |
| **JWT (jsonwebtoken)** | Authenticatie met tokens      | [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)                                    |
| **bcrypt**             | Password hashing              | [https://github.com/kelektiv/node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)                                    |
| **Swagger UI**         | API-documentatie              | [https://swagger.io/tools/swagger-ui/](https://swagger.io/tools/swagger-ui/)                                                |
| **Helmet**             | Security headers              | [https://helmetjs.github.io/](https://helmetjs.github.io/)                                                                  |
| **CORS**               | Cross-Origin Resource Sharing | [https://github.com/expressjs/cors](https://github.com/expressjs/cors)                                                      |
| **express-rate-limit** | Rate limiting middleware      | [https://github.com/nfriedly/express-rate-limit](https://github.com/nfriedly/express-rate-limit)                            |
| **Nodemon**            | Dev-server auto-reload        | [https://nodemon.io](https://nodemon.io)                                                                                    |

---

## BELANGRIJKE INFORMATIE

- **Security:** Rate limiting ingesteld op alle `/api` routes: max. 300 requests per 15 minuten per IP.
- **Validatie:** Mongoose-schema’s valideren invoer, inclusief regex voor MongoDB ObjectId’s.
- **Foutafhandeling:** Gestandaardiseerde JSON error responses met statuscode en bericht.
- **CORS:** Configuratie via `.env` variabele `CORS_ORIGIN`.

---

## LICENTIE

MIT License © 2025 Brent Cornet
