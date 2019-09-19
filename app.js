const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const socket = require('socket.io');

const {
    checkEqual,
    formatDate,
    paginate
} = require('./helpers/hbs');
const app = express()


//db connection
const db = require('./config/database');
db.con.connect(function (err) {
    if (err) throw err;
    console.log("MySql connection to` " + db.database);
});

//handlebars middleware
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
    helpers: {
        checkEqual: checkEqual,
        formatDate: formatDate,
        paginate: paginate
    },
    defaultLayout: 'main'
}));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//parse middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//global variables
app.use((req, res,  next) => {
    res.locals.pagination = {
        page: 1,
        pageCount: 10,
        perPage: 20
    },
    next();
})

app.get('/', function (req, res) {
    res.render('index')
});

app.get('/admin', (req, res) => {
    res.render('admin')
})

const port = 3000;
var server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

var io = socket(server);

const chats = require('./routes/chats')(io);
