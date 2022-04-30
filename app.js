if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override');
const campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash')
const ExpressErrors = require('./views/utils/ExpressError')

const { campgroundSchema, reviewSchema } = require('./schemas')

const ExpressError = require('./views/utils/ExpressError');
const { readdirSync } = require('fs');

const a = "";
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    /* useCreateIndex: true, */
    useUnifiedTopology: true

});


const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected')
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true })) //I had to tell express to parse the body so I can use "body.params" below
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'thisshouldbethebettersecret',
    resave: false,
    saveUninitalized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
})





app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something Went Wrong'
    res.status(statusCode).render('error', { err })


})


app.listen(3000, () => {
    console.log('Listening to port 3000!')
})