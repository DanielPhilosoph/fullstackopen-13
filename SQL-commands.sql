CREATE TABLE blogs (id INT, author VARCHAR(60), url VARCHAR(256) NOT NULL, title VARCHAR(60) NOT NULL, likes SMALLINT DEFAULT 0, PRIMARY KEY (id));

INSERT INTO blogs VALUES (1, 'daniel', 'url', 'blog 1', 100);
INSERT INTO blogs VALUES(2, 'edan', 'url', 'blog 2', 200)  ;