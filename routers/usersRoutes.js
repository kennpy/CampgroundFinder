const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport")
const User = require("../models/user")
const flash = require("connect-flash")
const session = require("express-session")


router.use(session({
    secret: 'very cool secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

router.use(passport.session())

router.use(flash())


router.get("/register", (req, res) => {
    res.render("../views/login")
})

router.post("/register", async (req, res) => {

    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser)
        res.redirect('/campgrounds')
    } catch (e) {

        console.log("inside register route")

        req.flash("error", e)
        console.log("error : ", e.message)
        res.redirect('/register')
    }

})

router.get("/login", (req, res) => {
    res.render("../views/actualLogin")
})

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), (req, res) => {

    console.log("body: ", req.body)
    console.log("session: ", req.session)
    console.log("user", req.user)

    res.redirect("/campgrounds")

})

module.exports = router;