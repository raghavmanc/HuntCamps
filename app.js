const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


//MONGOOSE CONNECTION-------------------------------------------------------------------

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'randomKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60*60*24*7,
        maxAge: 1000 * 60*60*24*7
    }
    
}
app.use(session(sessionConfig));

app.get('/', (req,res) => {
    res.render('home');
})

 app.all('*',(req,res,next) => {
     next(new ExpressError('Page Not Found',404))
 })

 app.use((err, req, res, next)=> {
     const {status=500} = err;
     if(!err.message) err.message = "Oh No, Something went";
     res.status(status).render('error',{err});

 })

 



//--------------------------------------------------------------------

app.listen('3000', () => {
    console.log("Listening on port 3000");
})
