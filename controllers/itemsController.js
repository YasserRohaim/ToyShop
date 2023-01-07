const sqlQuery = require('../config/db');

module.exports = {
    getItems: async (req, res) => {
        try {
            const query = 'SELECT * FROM items';
            const items = await sqlQuery(query);
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            res.json({ items });
        } catch (err) {
            res.status(500).send(err);
        }
    },

    getItemsByBrand: async (req, res) => {
        console.log(req.params.brand)
        try {
            const query = 'SELECT * FROM items WHERE brand=?';
            const items = await sqlQuery(query, [req.params.brand]);
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            res.json(items)

        }
        catch (err) {
            res.status(500).send(err);
        }
    }, 
    search: async (req, res) => {
        try {
            console.log(req.query);
            const query = "SELECT * FROM items WHERE (name LIKE concat(?,'%') OR name LIKE concat('% ',?,'%')) AND price BETWEEN (IFNULL(?,price) AND IFNULL(?,price)) AND brand =  COALESCE(?,brand)";
            const items = await sqlQuery(query, [req.query.name || null, req.query.name || null , req.query.min || null, req.query.max || null, req.query.brand || null]);
            // shuffle items at random
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            res.json({ items });
        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    },
    getItemByID: async (req, res) => {
        try {
            const query = 'SELECT * FROM items where id=?';
            const item = await sqlQuery(query,[req.params.itemId]);
            
            res.json({ success: true, item });
        } catch (err) {
            res.status(500).send(err);
        }
    },
}