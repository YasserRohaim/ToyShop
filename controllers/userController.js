const sqlQuery = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const yup =require('yup');


module.exports = {
    signup: async (req, res) => {
        try{
            let user_schema = yup.object().shape({
                first_name: yup.string().required(),
                last_name: yup.string().required(),
                email: yup.string().email().min(10).max(50),
                username:yup.string().min(3).max(30),
                password: yup.string().min(6).max(100)
              });
              await user_schema.validate(req.body)
        }catch(err){
            res.status(500)
            return res.send({success: false,msg:err.message})
        }
        try {
            const salt_rounds = 10;
            const password_hash = bcrypt.hashSync(req.body.password, salt_rounds)
            const insert_query = 'INSERT INTO `users` (first_name, last_name,  email, username,password) VALUES (?,?,?,?,?) ';
            await sqlQuery(insert_query, [req.body.first_name, req.body.last_name, req.body.email, req.body.username, password_hash]);
            const id_query = 'SELECT id FROM `users` where username=? or email=?'
            const sql_res =await sqlQuery(id_query, [req.body.username,req.body.email]);
            var token = jwt.sign({ user_id: sql_res[0].id }, process.env.JWT_PWD);
            res.cookie('session', token)
            res.json({ success: true, auth_token: token  });
            
        } catch (err) {
            console.log(err)
            res.status(500);
            if(err.errno==1062){
                res.send({ success: false, msg: 'Username or email already exists' })
            }else{
                res.send({ success: false, msg: 'Internal Server Error' })
            }

        }
    },

    signin: async (req, res) => {
        try {
            const query = 'SELECT id,password FROM users WHERE email=? or username=?';
            const sql_res = await sqlQuery(query, [req.body.login_name, req.body.login_name]);
            if (!sql_res.length) {
                res.json({ success: false, msg: 'username or email doesn\'t exist' });
            } else {
                if (bcrypt.compareSync(req.body.password, sql_res[0].password)) {
                    var token = jwt.sign({ user_id: sql_res[0].id }, process.env.JWT_PWD);
                    res.cookie('session', token)
                    res.json({ success: true, auth_token: token });
                } else {
                    res.json({ success: false, msg: 'Incorrect password' })
                }
            }
        }
        catch (err) {
            console.log(err)
            res.status(500);
            res.json({ success: false, msg: 'Internal Server Error' })
        }
    }
    ,

    viewOrders: async (req, res) => {
        try {
            
                const query = 'SELECT * FROM `orders` WHERE orders.user_id=?';
                const orders = await sqlQuery(query, [res.locals.user.user_id]);
                res.json({ success: true, orders });
            

        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    }
    ,

    viewOrderItems: async (req, res) => {
        try {
            
                const query = 'SELECT * FROM `orders_items` WHERE order_id=? AND user_id=?';
                const order_items = await sqlQuery(query, [req.params.order_id, res.locals.user.user_id]);
                res.json({ success: true, order_items });
            

        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    }
    ,
    viewProfile: async (req, res) => {
        try {
            
                const query = 'SELECT first_name, last_name, email, username, phone, address FROM `users` WHERE id=?';
                const user_info = await sqlQuery(query, [res.locals.user.user_id]);
                res.json({ success: true, user_info });
            

        } catch (err) {
            console.log(err)
            res.status(500).send({ success: false, msg: "Internal Server Error" });
        }
    }

    
}