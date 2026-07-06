# Backend API Rute

Ovaj dokument sadrži sve backend API rute definisane u kontrolerima aplikacije, sa primerima JSON tela zahteva za lakše testiranje u alatima poput Postman-a.

> [!NOTE]
> Za sve rute koje **nisu** označene kao javne, potrebno je proslediti zaglavlje `Authorization: Bearer <TOKEN>` koje se dobija nakon uspešnog logovanja.

---

## 1. Users

### POST /api/users
**Opis**: Registracija novog korisnika.
- **Javni pristup**: Da
- **Body (JSON)**:
```json
{
  "name": "Marko",
  "surname": "Marković",
  "phone": "0601234567",
  "email": "marko.markovic@example.com",
  "username": "marko123",
  "password": "sigurnaLozinka123",
  "role": "USER",
  "cityId": 1
}
```

### POST /api/users/login
**Opis**: Prijava korisnika. Vraća JWT token i podatke o korisniku.
- **Javni pristup**: Da
- **Body (JSON)**:
```json
{
  "email": "marko.markovic@example.com",
  "password": "sigurnaLozinka123"
}
```
- **Odgovor (JSON)**:
```json
{
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...",
    "user": {
      "id": 1,
      "email": "marko.markovic@example.com",
      "username": "marko123",
      "role": "USER"
    }
  },
  "status": "OK"
}
```

### POST /api/users/verify
**Opis**: Verifikacija email adrese nakon registracije.
- **Javni pristup**: Da
- **Body (JSON)**:
```json
{
  "email": "marko.markovic@example.com",
  "code": "123456"
}
```

### POST /api/users/forgot-password
**Opis**: Pokretanje procesa za oporavak lozinke (šalje kod na email).
- **Javni pristup**: Da
- **Body (JSON)**:
```json
{
  "email": "marko.markovic@example.com"
}
```

### POST /api/users/reset-password
**Opis**: Promena lozinke uz verifikacioni kod.
- **Javni pristup**: Da
- **Body (JSON)**:
```json
{
  "email": "marko.markovic@example.com",
  "code": "123456",
  "newPassword": "novaLozinka123"
}
```

### GET /api/users
**Opis**: Vraća listu svih korisnika.
- **Javni pristup**: Ne

### GET /api/users/{id}
**Opis**: Vraća profil korisnika na osnovu ID-ja.
- **Javni pristup**: Ne

### PUT /api/users/{id}
**Opis**: Ažuriranje podataka o korisniku.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "name": "Marko",
  "surname": "Marković",
  "phone": "0607654321",
  "email": "marko.novi@example.com",
  "username": "marko123",
  "role": "USER",
  "city": {
    "id": 1
  }
}
```

### DELETE /api/users/{id}
**Opis**: Brisanje korisničkog naloga.
- **Javni pristup**: Ne

---

## 2. Products

### GET /api/products
**Opis**: Vraća sve proizvode.
- **Javni pristup**: Da

### GET /api/products/{id}
**Opis**: Vraća detalje o konkretnom proizvodu.
- **Javni pristup**: Da

### GET /api/products/status/{status}
**Opis**: Filtrira proizvode po statusu (npr. `ACTIVE`, `SOLD`).
- **Javni pristup**: Da
- **Primer**: `/api/products/status/ACTIVE`

### GET /api/products/search?title={title}
**Opis**: Pretraga proizvoda po naslovu.
- **Javni pristup**: Da
- **Primer**: `/api/products/search?title=telefon`

### POST /api/products
**Opis**: Kreiranje novog oglasa za proizvod.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "title": "Samsung Galaxy S23",
  "description": "Kao nov, bez ogrebotina.",
  "price": 650.00,
  "user": {
    "id": 1
  },
  "category": {
    "id": 2
  }
}
```

### PUT /api/products/{id}
**Opis**: Ažuriranje detalja oglasa.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "title": "Samsung Galaxy S23 Ultra",
  "description": "Blagi tragovi korišćenja.",
  "price": 600.00,
  "user": {
    "id": 1
  },
  "category": {
    "id": 2
  }
}
```

### DELETE /api/products/{id}
**Opis**: Brisanje oglasa za proizvod.
- **Javni pristup**: Ne

---

## 3. Product Images

### GET /api/product-images/product/{productId}
**Opis**: Vraća listu slika za traženi proizvod.
- **Javni pristup**: Ne

### POST /api/product-images/product/{productId}
**Opis**: Dodaje URL putanju slike proizvodu.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "imageUrl": "/uploads/slika.jpg"
}
```

### POST /api/product-images/product/{productId}/upload
**Opis**: Upload slike za proizvod (šalje se kao Multipart File).
- **Javni pristup**: Ne
- **Body (Form-Data)**:
  - Ključ: `file` (Tip: File)

### DELETE /api/product-images/{imageId}
**Opis**: Brisanje slike po njenom ID-ju.
- **Javni pristup**: Ne

---

## 4. Categories

### GET /api/categories
**Opis**: Vraća sve kategorije proizvoda.
- **Javni pristup**: Da

### GET /api/categories/{id}
**Opis**: Vraća kategoriju po ID-ju.
- **Javni pristup**: Da

---

## 5. Cities

### GET /api/cities
**Opis**: Vraća listu svih gradova.
- **Javni pristup**: Da

### GET /api/cities/{id}
**Opis**: Vraća grad po ID-ju.
- **Javni pristup**: Da

---

## 6. Favorites

### GET /api/favorites/user/{userId}
**Opis**: Vraća sve omiljene oglase za određenog korisnika.
- **Javni pristup**: Ne

### POST /api/favorites
**Opis**: Dodavanje oglasa u listu omiljenih.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "user": {
    "id": 1
  },
  "product": {
    "id": 4
  }
}
```

### DELETE /api/favorites/user/{userId}/product/{productId}
**Opis**: Uklanjanje oglasa iz liste omiljenih.
- **Javni pristup**: Ne

---

## 7. Messages

### GET /api/messages/received/{receiverId}
**Opis**: Vraća sve primljene poruke za korisnika.
- **Javni pristup**: Ne

### GET /api/messages/sent/{senderId}
**Opis**: Vraća sve poslate poruke korisnika.
- **Javni pristup**: Ne

### POST /api/messages
**Opis**: Slanje poruke drugom korisniku povodom oglasa.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "text": "Da li je proizvod i dalje dostupan?",
  "sender": {
    "id": 1
  },
  "receiver": {
    "id": 2
  },
  "product": {
    "id": 4
  }
}
```

---

## 8. Purchases

### GET /api/purchases
**Opis**: Vraća sve obavljene kupovine (istoriju).
- **Javni pristup**: Ne

### GET /api/purchases/{id}
**Opis**: Vraća kupovinu po njenom ID-ju.
- **Javni pristup**: Ne

### POST /api/purchases
**Opis**: Evidentiranje kupovine proizvoda.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "finalPrice": 600.00,
  "buyer": {
    "id": 1
  },
  "product": {
    "id": 4
  }
}
```

---

## 9. Reviews

### GET /api/reviews
**Opis**: Vraća sve recenzije u sistemu.
- **Javni pristup**: Ne

### GET /api/reviews/product/{productId}
**Opis**: Vraća sve recenzije vezane za određeni proizvod.
- **Javni pristup**: Ne

### POST /api/reviews
**Opis**: Ostavljanje recenzije za kupljeni proizvod/prodavca.
- **Javni pristup**: Ne
- **Body (JSON)**:
```json
{
  "rating": 5,
  "comment": "Odlična saradnja, sve preporuke!",
  "reviewer": {
    "id": 1
  },
  "reviewed": {
    "id": 2
  },
  "product": {
    "id": 4
  }
}
```