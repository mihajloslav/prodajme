# Backend API Rute

Ovaj dokument sadrzi sve backend API rute definisane u controller sloju.

## Categories

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/categories | Vraca sve kategorije |
| GET | /api/categories/{id} | Vraca kategoriju po ID-u |

## Cities

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/cities | Vraca sve gradove |
| GET | /api/cities/{id} | Vraca grad po ID-u |

## Favorites

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/favorites/user/{userId} | Vraca omiljene proizvode korisnika |
| POST | /api/favorites | Dodaje proizvod u omiljene |
| DELETE | /api/favorites/user/{userId}/product/{productId} | Uklanja proizvod iz omiljenih |

## Messages

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/messages/received/{receiverId} | Vraca primljene poruke korisnika |
| GET | /api/messages/sent/{senderId} | Vraca poslate poruke korisnika |
| POST | /api/messages | Salje poruku |

## Product Images

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/product-images/product/{productId} | Vraca slike proizvoda |
| POST | /api/product-images/product/{productId} | Dodaje URL slike proizvoda |
| POST | /api/product-images/product/{productId}/upload | Upload slike fajla za proizvod |
| DELETE | /api/product-images/{imageId} | Brise sliku proizvoda |

## Products

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/products | Vraca sve proizvode |
| GET | /api/products/{id} | Vraca proizvod po ID-u |
| GET | /api/products/status/{status} | Vraca proizvode po statusu |
| GET | /api/products/search?title={title} | Pretraga proizvoda po naslovu |
| POST | /api/products | Kreira proizvod |
| PUT | /api/products/{id} | Azurira proizvod |
| DELETE | /api/products/{id} | Brise proizvod |

## Purchases

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/purchases | Vraca sve kupovine |
| GET | /api/purchases/{id} | Vraca kupovinu po ID-u |
| POST | /api/purchases | Kreira kupovinu |

## Reviews

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/reviews | Vraca sve recenzije |
| GET | /api/reviews/product/{productId} | Vraca recenzije za proizvod |
| POST | /api/reviews | Kreira recenziju |

## Users

| Method | Ruta | Opis |
|---|---|---|
| GET | /api/users | Vraca sve korisnike |
| GET | /api/users/{id} | Vraca korisnika po ID-u |
| POST | /api/users | Registracija korisnika |
| POST | /api/users/login | Login korisnika |
| POST | /api/users/verify | Verifikacija email adrese |
| POST | /api/users/forgot-password | Slanje koda za reset lozinke |
| POST | /api/users/reset-password | Reset lozinke |
| PUT | /api/users/{id} | Azuriranje korisnika |
| DELETE | /api/users/{id} | Brisanje korisnika |