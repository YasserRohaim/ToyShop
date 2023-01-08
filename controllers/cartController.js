const sqlQuery = require('../config/db');

module.exports = {
    getItems: async (req, res) => {
        try {
            const query = 'SELECT cart_items.id , user_id , item_id , cart_items.quantity as quantity , name, brand , description , price , image FROM cart_items LEFT JOIN items ON items.id=cart_items.item_id WHERE user_id=?';
            const items = await sqlQuery(query, [res.locals.user.user_id]);
            res.json({ success: true, items });
        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },

    addItem: async (req, res) => {
        try {
            const inventory_query = 'SELECT quantity FROM items WHERE id=?';
            const inventory_quantity = await sqlQuery(inventory_query, [req.body.item_id]);


            if (req.body.quantity > inventory_quantity[0].quantity) {
                res.status(500).send({ success: false, msg: "Specified quantity not available in stock" });
            }
            else {
                const add_query = 'INSERT INTO `cart_items` (user_id, item_id, quantity) VALUES(?,?,COALESCE(?,1)) ON DUPLICATE KEY UPDATE quantity = quantity + COALESCE(?,1)';
                const items = await sqlQuery(add_query, [res.locals.user.user_id, req.body.item_id, req.body.quantity || null, req.body.quantity || null]);

                res.json({ success: true });
            }
        }



        catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },
    deleteItem: async (req, res) => {
        try {
            const delete_query = 'DELETE FROM `cart_items` WHERE  user_id=? and item_id=?';
            const items = await sqlQuery(delete_query, [res.locals.user.user_id, req.body.item_id]);

            res.json({ success: true });
        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },
    updateQuantity: async (req, res) => {
        try {
            const inventory_query = 'SELECT quantity FROM items WHERE id=?';
            const inventory_quantity = await sqlQuery(inventory_query, [req.body.item_id]);
            switch (true) {
                case req.body.quantity < 1:
                    res.status(500).send({ success: false, msg: "please enter a valid quantity " });
                    break;
                case req.body.quantity > inventory_quantity[0].quantity:
                    res.status(500).send({ success: false, msg: "Specified quantity not available in stock" });
                    break;
                default:
                    const update_query = 'UPDATE `cart_items` set quantity=? where user_id=? and item_id=?';
                    await sqlQuery(update_query, [req.body.quantity, res.locals.user.user_id, req.body.item_id]);
                    res.json({ success: true });

            }


        } catch (err) {
            console.log(err);
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    },
    placeOrder: async (req, res) => {

        try {
            
            const cur_date = new Date();

            const add_order_query = 'INSERT INTO `orders` (user_id, price, phone, address, date) VALUES(?, (SELECT SUM(price * cart_items.quantity) FROM cart_items  LEFT JOIN  items ON items.id=cart_items.item_id where user_id= ?) ,? ,?,?)';
            await sqlQuery(add_order_query, [res.locals.user.user_id, res.locals.user.user_id, req.body.phone, req.body.address, cur_date]);
            const order_id_query = "SELECT LAST_INSERT_ID() as id";
            const order_id = await sqlQuery(order_id_query);
            console.log(order_id);
            const fetch_item_data_query = 'SELECT items.price, cart_items.quantity, cart_items.item_id FROM cart_items  LEFT JOIN  items ON items.id=cart_items.item_id WHERE user_id=?';
            const fetch_item_data = await sqlQuery(fetch_item_data_query, [res.locals.user.user_id]);
            console.log(fetch_item_data);
            const add_order_items_query = 'INSERT INTO `order_items` (order_id,user_id,price, quantity,item_id) VALUES(?,?, ?,?,?)';
            for (let i = 0; i < fetch_item_data.length; i++) {


                await sqlQuery(add_order_items_query, [order_id[0].id, res.locals.user.user_id, fetch_item_data[i].price, fetch_item_data[i].quantity, fetch_item_data[i].item_id]);

            }

            const fetch_order_item_data_query = 'SELECT item_id, order_items.quantity  FROM order_items WHERE order_id =?'
            const fetch_order_item_data = await sqlQuery(fetch_order_item_data_query, [order_id[0].id]);
            const update_query = 'UPDATE `items` SET quantity=quantity-? WHERE id =?';

            for (let i = 0; i < fetch_order_item_data.length; i++) {
                await sqlQuery(update_query, [fetch_order_item_data[i].quantity, fetch_order_item_data[i].item_id]);
               
            }
            res.json({ success: true });

        }
        catch (err) {
                console.log(err);
                res.status(500).send({ success: false, msg: "Internal Server Error" });
            }
        }

    ,
        clearCart: async (req, res) => {


            try {
                const delete_query = 'DELETE FROM `cart_items` WHERE  user_id=? ';
                const items = await sqlQuery(delete_query, [res.locals.user.user_id]);

                res.json({ success: true });
            } catch (err) {
                console.log(err)
                res.status(500).send({ success: false, msg: "Internal Server Error" });
            }

        }
    }