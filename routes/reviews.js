
const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground')
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const { reviewSchema } = require('../schemas')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require('../views/utils/catchAsync');
const ExpressErrors = require('../views/utils/ExpressError')


router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;