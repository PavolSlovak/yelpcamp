
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp')


const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected')
})


const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (i = 1; i < 50; i++) {

        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '6263a1594569c84600aa9ff2',
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dgbx0ouyi/image/upload/v1651268360/YelpCamp/ke6fgbu5sxeclkoqy9r9.jpg',
                    filename: 'YelpCamp/ke6fgbu5sxeclkoqy9r9',
                },
                {
                    url: 'https://res.cloudinary.com/dgbx0ouyi/image/upload/v1651268399/YelpCamp/tajomy20he6beyo5ijjb.jpg',
                    filename: 'YelpCamp/tajomy20he6beyo5ijjb',
                },
                {
                    url: 'https://res.cloudinary.com/dgbx0ouyi/image/upload/v1651268401/YelpCamp/njvngr3u35tf4yxxvase.jpg',
                    filename: 'YelpCamp/njvngr3u35tf4yxxvase',
                }
            ]

        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})