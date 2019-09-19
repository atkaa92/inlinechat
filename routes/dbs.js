const express = require('express');
const router = express.Router();
const db = require('./../config/database');
const a = require('./chats')

//routes
router.get('/', (req, res) => {
    let sql = "SELECT table_name FROM information_schema.tables WHERE TABLE_SCHEMA='" + db.database + "'";
    db.con.query(sql, function (err, db_names, fields) {
        if (err) throw err;
        res.render('dbs', {
            db_names: db_names
        })
    });
})

router.get('/admin', (req, res) => {
    res.render('admin')
})

router.get('/:table', (req, res) => {
    let sql = "SELECT count(id) as count from " + req.params.table;
    db.con.query(sql, function (err, count, fields) {
        if (!req.query.p) {
            req.query.p = 1
        }
        let limit = res.locals.pagination.perPage
        let offset = (req.query.p - 1) * limit;
        res.locals.pagination.pageCount = Math.ceil(count[0]['count'] / limit)
        let sql = "SELECT * from " + req.params.table + " ORDER BY id" + " LIMIT " + limit + " OFFSET " + offset;
        db.con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            res.render('db', {
                rows: rows
            })
        });
    });
})



module.exports = router;