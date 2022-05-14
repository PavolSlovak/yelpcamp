
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
    for (i = 1; i < 300; i++) {

        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '6263a1594569c84600aa9ff2',
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi fugiat minus sunt similique quidem maiores quibusdam delectus, debitis porro natus, aliquam sequi! Ipsum illum suscipit tempora veniam totam debitis necessitatibus.',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },

            images: [
                {
                    url: 'https://res.cloudinary.com/dgbx0ouyi/image/upload/v1651991708/YelpCamp/bmr7z7vozy2spapqdo7f.jpg',
                    filename: 'YelpCamp/bmr7z7vozy2spapqdo7f',
                },
                {
                    url: 'https://res.cloudinary.com/dgbx0ouyi/image/upload/v1651991708/YelpCamp/dnzuqdeue7ahuvjen6hh.jpg',
                    filename: 'YelpCamp/dnzuqdeue7ahuvjen6hh',
                },
                {
                    url: 'https://res.cloudinary.com/dgbx0ouyi/image/upload/v1651991710/YelpCamp/vvt7oh16vg56sv0uhdrf.jpg',
                    filename: 'YelpCamp/vvt7oh16vg56sv0uhdrf',
                }
            ]

        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})