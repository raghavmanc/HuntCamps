const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const Campground = require('../models/campground');

router.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', {campgrounds});
  }))
  
  router.get('/new', (req,res) => {
      res.render('campground/new')
  })
  
  router.post('/', catchAsync(async (req,res) => {  
      if(!req.body.campground){throw new ExpressError("Invalid Campground Information",400);}  
          const camp = new Campground(req.body.campground);
          await camp.save();
          res.redirect('/campgrounds');
    }))
  
    router.get('/:id/edit',  catchAsync(async (req,res) => {
      const {id} = req.params; 
      const camp = await Campground.findById(id) ;
      res.render('campground/edit',{camp});
   }))
  
   router.patch('/:id',  catchAsync(async (req,res) => {
      const {id} = req.params; 
      const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
      camp.save();
      res.redirect(`/campgrounds/${id}`);
   }))
  
  
   router.get('/:id',  catchAsync(async (req,res) => {
      const {id} = req.params; 
      const camp = await Campground.findById(id).populate('reviews') ;
      res.render('campground/show',{camp});
   }))
  
   router.delete('/:id',  catchAsync(async (req,res) => {
      const {id} = req.params; 
      const camp = await Campground.findByIdAndDelete(id);
      res.redirect('/campgrounds');
  
   }))

   module.exports = router;