const express = require('express')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const http = require('http');
const app = express()

const userApiRouter = require('./router/api/user')
const studentApiRouter = require('./router/api/student')
const blockApiRouter = require('./router/api/block')
const roomApiRouter = require('./router/api/room')
const attendanceRouter = require('./router/api/dayAttendance')

var fileStoreOptions = {};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'attendance',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 30)
    }
}));

app.use('/api/user/', userApiRouter);
app.use('/api/student/', studentApiRouter);
app.use('/api/block', blockApiRouter);
app.use('/api/room/',roomApiRouter);
app.use('/api/attendance',attendanceRouter);


app.get('/sh/login',(req,res) => {
    try {
        res.render('pages/login.ejs')
    } catch (error) {
        console.error(error)
    }

})

app.get('/sh/home',(req,res) => {
    try {
        if(req.session.isLogged == true) {
            const userName = req.session.data
            console.log(userName)
            res.render('pages/home.ejs',{userName})
        }

    } catch (error) {
        console.error(error)
    }
})

app.get('/sh/logout',(req,res) => {
    try {
        if(req.session.isLogged == true) {
            req.session.destroy((err) => {
                if(err) {
                    console.log(err)
                    return
                }
                res.redirect('http://localhost:4000/sh/login')
            })
        }else{
            res.redirect("http://localhost:4000/sh/login")
        }
    } catch (error) {
        console.error(error)
    }
})


app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

var server = http.createServer(app);
var port = 4000;



server.listen(port, () => {
    console.log('listening on port 4000')
})

module.exports = app