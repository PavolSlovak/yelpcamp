const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


//https://res.cloudinary.com/dgbx0ouyi/image/upload/w_300/v1651690958/YelpCamp/awru3cogiwap3sn8kbyy.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String,

})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const CampSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews,
            }
        })
    }
})


module.exports = mongoose.model('Campground', CampSchema)

