const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./Utils/catchAsync');
const ExpressError = require('./Utils/ExpressError');
const Review = require('./models/review');

//MONGOOSE CONNECTION-------------------------------------------------------------------

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

//SET--------------------------------------------------------------------

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//GET--------------------------------------------------------------------

app.get('/', (req,res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req,res) => {
  const campgrounds = await Campground.find({});
  res.render('campground/index', {campgrounds});
}))

app.get('/makecampground', (req,res) => {
    res.render('campground/new')
})

app.post('/campgrounds', catchAsync(async (req,res) => {  
    if(!req.body.campground){throw new ExpressError("Invalid Campground Information",400);}  
        const camp = new Campground(req.body.campground);
        await camp.save();
        res.redirect('/campgrounds');
  }))

  app.get('/campgrounds/:id/edit',  catchAsync(async (req,res) => {
    const {id} = req.params; 
    const camp = await Campground.findById(id) ;
    res.render('campground/edit',{camp});
 }))

 app.patch('/campgrounds/:id',  catchAsync(async (req,res) => {
    const {id} = req.params; 
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    camp.save();
    res.redirect(`/campgrounds/${id}`);
 }))


 app.get('/campgrounds/:id',  catchAsync(async (req,res) => {
    const {id} = req.params; 
    const camp = await Campground.findById(id).populate('reviews') ;
    res.render('campground/show',{camp});
 }))

 app.delete('/campgrounds/:id',  catchAsync(async (req,res) => {
    const {id} = req.params; 
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

 }))

 app.post("/campgrounds/:id/reviews", catchAsync(async(req,res) => {
     const campground = await Campground.findById(req.params.id);
     const review = new Review(req.body.review);
     campground.reviews.push(review);
     await review.save();
     await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

 }))

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
