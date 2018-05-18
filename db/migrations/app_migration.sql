-- \connect books_fav_items;

-- DROP TABLE favorites;
-- DROP TABLE users;
-- DROP TABLE books_items;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  password TEXT UNIQUE NOT NULL
);

CREATE TABLE books_items (
  id BIGSERIAL PRIMARY KEY,
  item_id VARCHAR(1024) UNIQUE NOT NULL,
  image_url VARCHAR(1024),
  title VARCHAR(1024),
  authors_name VARCHAR(255),
  publisher VARCHAR(255),
  price BIGINT,
  description TEXT
);

CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  books_items_ref_item_id VARCHAR REFERENCES books_items(item_id),
  user_ref_id INTEGER REFERENCES users(id)
);


