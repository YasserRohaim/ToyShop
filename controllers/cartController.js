const sqlQuery = require('../config/db');

module.exports = {
    getItems: async (req, res) => {
        try {
            const query = 'SELECT * FROM cart_items  LEFT JOIN items ON items.id=cart_items.item_id WHERE user_id=?';
            const items = await sqlQuery(query, [res.locals.user.user_id]);
            res.json({ success: true, items });
        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },
    addItem: async (req, res) => {
        try {
            const query = 'INSERT INTO `cart_items` (user_id, item_id, quantity) VALUES(?,?,COALESCE(?,1)) ON DUPLICATE KEY UPDATE quantity = quantity + COALESCE(?,1)';
            const items = await sqlQuery(query, [res.locals.user.user_id, req.body.item_id, req.body.quantity || null, req.body.quantity || null]);

            res.json({ success: true });
        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },
    deleteItem: async (req, res) => {
        try {
            const query = 'DELETE FROM `cart_items` WHERE  user_id=? and item_id=?';
            const items = await sqlQuery(query, [res.locals.user.user_id, req.body.item_id]);

            res.json({ success: true });
        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },
    updateQuantity: async (req, res) => {
        try {
            if (req.body.quantity < 1) {
                throw new Error`Quantity should be larger than zero`
            }
            const query = 'UPDATE `cart_items` set quantity=? where user_id=? and item_id=?';
            const items = await sqlQuery(query, [req.body.quantity, res.locals.user.user_id, req.body.item_id]);

            res.json({ success: true });
        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },
    placeOrder: async (req, res) => {
        try {
            try {
                const query = 'INSERT INTO `orders` (user_id, price, phone, address) VALUES(?, SELECT SUM(price * cart_items.quantity) FROM cart_items  LEFT JOIN  items on items.id=cart_items.item_id where user_id= ? ,? ,?)';
                const items = await sqlQuery(query, [res.locals.user.user_id, res.locals.user.user_id, req.body.phone, req.body.address]);
                res.json({ success: true });
            }

            catch (err) {
                console.log(err)
                res.status(500).send({ success: false, msg: "please insert your phone and address" });
            }

        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    }
}