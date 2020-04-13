DROP TABLE IF EXISTS books;

CREATE TABLE books(
    
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    image_url VARCHAR(255),
    description TEXT,
);
-- id as the primary key
-- author
-- title
-- isbn
-- image_url
-- description
-- bookshelf