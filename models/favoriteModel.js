const db = require("../db/config");

const favoriteModel = {};

favoriteModel.findAll = () => {
  return db.query(`SELECT * FROM userdata ORDER BY id ASC`);
};

favoriteModel.findFavByUserId = item => {
  return db.query(`SELECT *, books_items.item_id AS id
  FROM (books_items
  INNER JOIN favorites ON books_items.item_id = favorites.books_items_ref_item_id)
  WHERE
  favorites.user_ref_id = $1
  `, [item.user_id]);
};



favoriteModel.create = item => {
  return db.one(
    ` 
      INSERT INTO books_items (item_id, title, image_url, price, authors_name, description, publisher)
      SELECT * FROM (SELECT $2, $3, $4, $5, $6, $7, $8) AS tmp 
      WHERE NOT EXISTS (
          SELECT item_id FROM books_items WHERE item_id = $2
      );
   
      INSERT INTO favorites (books_items_ref_item_id, user_ref_id)
      SELECT * FROM (SELECT $2, $1) AS tmp 
      WHERE NOT EXISTS (
          SELECT * FROM favorites WHERE books_items_ref_item_id = $2 AND user_ref_id = $1
      );
      
      SELECT * FROM books_items WHERE item_id = $2;
    `,
    [
      item.user_id,
      item.item_id,
      item.title,
      item.image_url,
      item.price,
      item.authors_name,
      item.description,
      item.publisher
    ]
  );
};

favoriteModel.destroy = data => {
  return db.none(
    `
      DELETE FROM favorites
      WHERE books_items_ref_item_id = $1 AND user_ref_id = $2;
      DELETE FROM books_items
        WHERE item_id NOT IN (SELECT favorites.books_items_ref_item_id 
                        FROM favorites);
    `,
    [data.item_id, data.userId]
  );
};

module.exports = favoriteModel;
