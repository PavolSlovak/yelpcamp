const User = require('../models/user')


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res) => {
    try {
        const { password, username, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) {
                return next(err)
            } else {
                req.flash('success', 'Wellcome to Yelp Camp!')
                res.redirect('/campgrounds')
            }
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.login = (req, res) => {
    req.flash('success', 'Wellcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
    delete req.session.returnTo;
}
module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
}