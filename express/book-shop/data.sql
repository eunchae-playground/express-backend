INSERT INTO books (title, book_format, isbn, summary, detail, author, total_pages, table_of_contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

INSERT INTO books (title, book_format, isbn, summary, detail, author, total_pages, table_of_contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2023-12-01");

INSERT INTO books (title, book_format, isbn, summary, detail, author, total_pages, table_of_contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");

INSERT INTO books (title, book_format, isbn, summary, detail, author, total_pages, table_of_contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-12-08");

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `delivery_info_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `book_amount` int(11) NOT NULL,
  `ordered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk__delivery_infoes__orders_idx` (`delivery_info_id`),
  KEY `fk__users__orders_idx` (`user_id`),
  KEY `fk__books__orders_idx` (`book_id`),
  CONSTRAINT `fk__books__orders` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk__delivery_infoes__orders` FOREIGN KEY (`delivery_info_id`) REFERENCES `delivery_infoes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk__users__orders` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci

CREATE TABLE `delivery_infoes` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `address` varchar(400) DEFAULT NULL,
   `receiver` varchar(45) DEFAULT NULL,
   `contact` varchar(45) DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci