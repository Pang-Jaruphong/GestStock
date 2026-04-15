USE gestionstock;

INSERT INTO users (mail, PASSWORD, resetToken, ADMIN, firstCon) VALUES 
('jaruphong.plancherel@eduvaud.ch',NULL,NULL,1,1);

INSERT INTO suppliers (refSupplier, NAME, address, locality, NPA) VALUE 
('SUP-001', 'Office World', 'Route de Berne 45', 'Fribourg', 1700),
('SUP-002', 'BuroPro SA', 'Avenue du Midi 12', 'Lausanne', 1000);

INSERT INTO articles (refArticle, NAME, DESCRIPTION, buyPrice, salePrice, actualStock, minStock, STATUS, supplier_id) VALUE 
('OWFR-001', 'Stylo', '', 2.15, 5.50, 10, 5, 1, 1),
('OWFR-002B', 'Crayon bleu','', 0.15, 2.50, 20, 5, 1, 1),
('OWFR-002R', 'Crayon rouge','', 0.16, 2.50, 18, 5, 1, 1),
('OWFR-002N', 'Crayon Noir','', 0.14, 2.50, 50, 10, 1, 1),
('BPLS-0031', 'Feuille A4', 'Un paquet 100 feuilles', 2.72, 8.00, 12, 10, 1, 2);

INSERT INTO orders (dateOrder, STATUS, user_id) VALUE
("2026-02-01", "livré", 1),
("2026-02-01", "livré", 1),
("2026-02-15", "livré", 1),
("2026-02-23", "livré", 1),
("2026-02-28", "En cours", 1),
("2026-03-01", "En cours", 1);

INSERT INTO stories (commentChange, dateChange, article_id, user_id) VALUE 
("changement le prix de vente à 8.50 CHF", "2026-02-27", 5, 1);

INSERT INTO orders_has_articles (order_id, article_id, quantity) VALUE 
(1,1,15),
(1,2,10),
(1,4,10),
(2,5,3),
(3,5,5),
(4,3,10);