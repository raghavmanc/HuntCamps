const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");

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

function sample(arr){
   return arr[Math.floor(Math.random()*arr.length)] 
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const rand = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            // image: 'https://source.unsplash.com/collection/483251',
            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of ", 
            image: 'https://source.unsplash.com/collection/483251/1600x900',
        })
        await camp.save();
    }
}

seedDB();