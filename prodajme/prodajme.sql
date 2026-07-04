CREATE DATABASE IF NOT EXISTS prodajme
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE prodajme;

DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS purchase;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS city;

CREATE TABLE city (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NAME VARCHAR(50) NOT NULL
);

CREATE TABLE `user` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NAME VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  phone VARCHAR(16) UNIQUE,
  email VARCHAR(100) UNIQUE NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  PASSWORD VARCHAR(255) NOT NULL,
  verificationCode VARCHAR(6),
  enabled BOOLEAN NOT NULL DEFAULT false,
  ROLE VARCHAR(10) NOT NULL COMMENT 'ADMIN ili USER',
  idCity INT NOT NULL
);

CREATE TABLE category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NAME VARCHAR(50) NOT NULL
);

CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  DESCRIPTION TEXT,
  price DECIMAL(10,2) NOT NULL,
  imageUrl VARCHAR(255),
  datePosted DATETIME,
  STATUS VARCHAR(10) NOT NULL COMMENT 'ACTIVE, RESERVED, SOLD',
  idUser INT NOT NULL,
  idCategory INT NOT NULL
);

CREATE TABLE message (
  id INT AUTO_INCREMENT PRIMARY KEY,
  TEXT TEXT NOT NULL,
  dateSent DATETIME,
  idSender INT NOT NULL,
  idReceiver INT NOT NULL,
  idProduct INT NOT NULL
);

CREATE TABLE purchase (
  id INT AUTO_INCREMENT PRIMARY KEY,
  datePurchased DATETIME,
  finalPrice DECIMAL(10,2) NOT NULL,
  idBuyer INT NOT NULL,
  idProduct INT NOT NULL UNIQUE
);

CREATE TABLE review (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT NOT NULL COMMENT '1 do 5',
  COMMENT TEXT,
  dateCreated DATETIME,
  idReviewer INT NOT NULL,
  idReviewed INT NOT NULL,
  idProduct INT NOT NULL,
  CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE favorite (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dateAdded DATETIME,
  idUser INT NOT NULL,
  idProduct INT NOT NULL,
  UNIQUE (idUser, idProduct)
);

ALTER TABLE `user`
ADD CONSTRAINT fk_user_city
FOREIGN KEY (idCity) REFERENCES city(id);

ALTER TABLE product
ADD CONSTRAINT fk_product_user
FOREIGN KEY (idUser) REFERENCES `user`(id);

ALTER TABLE product
ADD CONSTRAINT fk_product_category
FOREIGN KEY (idCategory) REFERENCES category(id);

ALTER TABLE message
ADD CONSTRAINT fk_message_sender
FOREIGN KEY (idSender) REFERENCES `user`(id);

ALTER TABLE message
ADD CONSTRAINT fk_message_receiver
FOREIGN KEY (idReceiver) REFERENCES `user`(id);

ALTER TABLE message
ADD CONSTRAINT fk_message_product
FOREIGN KEY (idProduct) REFERENCES product(id);

ALTER TABLE purchase
ADD CONSTRAINT fk_purchase_buyer
FOREIGN KEY (idBuyer) REFERENCES `user`(id);

ALTER TABLE purchase
ADD CONSTRAINT fk_purchase_product
FOREIGN KEY (idProduct) REFERENCES product(id);

ALTER TABLE review
ADD CONSTRAINT fk_review_reviewer
FOREIGN KEY (idReviewer) REFERENCES `user`(id);

ALTER TABLE review
ADD CONSTRAINT fk_review_reviewed
FOREIGN KEY (idReviewed) REFERENCES `user`(id);

ALTER TABLE review
ADD CONSTRAINT fk_review_product
FOREIGN KEY (idProduct) REFERENCES product(id);

ALTER TABLE favorite
ADD CONSTRAINT fk_favorite_user
FOREIGN KEY (idUser) REFERENCES `user`(id);

ALTER TABLE favorite
ADD CONSTRAINT fk_favorite_product
FOREIGN KEY (idProduct) REFERENCES product(id);

INSERT INTO city (id, NAME) VALUES
(1, 'Beograd'),
(2, 'Novi Sad');

INSERT INTO `user` (id, NAME, surname, phone, email, username, PASSWORD, verificationCode, enabled, ROLE, idCity) VALUES
(1, 'Mihajlo', 'Miki', '+38160111222', 'mihajlo1@example.com', 'mihajlo1', '123', NULL, true, 'ADMIN', 1),
(2, 'Petar', 'Petrovic', '+38160333444', 'pera22@example.com', 'pera22', '123', NULL, true, 'USER', 2);

INSERT INTO category (id, NAME) VALUES
(1, 'Elektronika'),
(2, 'Nekretnine');

INSERT INTO product (id, title, DESCRIPTION, price, imageUrl, datePosted, STATUS, idUser, idCategory) VALUES
(1, 'iPhone 15 Pro', 'Polovan telefon u odlicnom stanju.', 950.00, 'iphone.jpg', '2026-06-10 12:00:00', 'SOLD', 2, 1),
(2, 'Dvosoban stan', 'Stan u centru grada.', 120000.00, 'stan.jpg', '2026-06-15 09:30:00', 'ACTIVE', 1, 2);

INSERT INTO message (id, TEXT, dateSent, idSender, idReceiver, idProduct) VALUES
(1, 'Koja je zadnja cena za iPhone?', '2026-06-18 10:15:00', 1, 2, 1);

INSERT INTO purchase (id, datePurchased, finalPrice, idBuyer, idProduct) VALUES
(1, '2026-06-20 14:30:00', 900.00, 1, 1);

INSERT INTO review (id, rating, COMMENT, dateCreated, idReviewer, idReviewed, idProduct) VALUES
(1, 5, 'Odlican kupac, sve po dogovoru.', '2026-06-21 16:00:00', 2, 1, 1);

INSERT INTO favorite (id, dateAdded, idUser, idProduct) VALUES
(1, '2026-06-22 18:30:00', 1, 2);

