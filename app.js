/*
 
We run app on server driven by nodejs - runtime environment
 -- think of it as an environment to run code in - similar to 
 terminal or browser runtime / engine (V8 for chrome)
*/
// require express to get express function we can call
const express = require('express')
// mongoose to write application code to connect to mongodb within js file
const mongoose = require('mongoose')
// call express function to get app object filled w/ various methods / properties
const app = express()

const cookieParser = require("cookie-parser")

const GeneralError = require("./utils/ExpressError")

const ejsMate = require("ejs-mate")

const wrapAsync = require("./utils/catchAsync")

const Campground = require("./models/campground")
const User = require("./models/user")

const path = require("path")
const { request } = require('http')
const bodyParser = require('body-parser')
const methodOverride = require('method-override');

const Joi = require('joi')
const Person = require("./models/person")

const campgroundRoutes = require("./routers/campRoutes")
const userRoutes = require("./routers/usersRoutes")

const session = require("express-session")
const { Cookie } = require('express-session')

const flash = require("connect-flash")

const bcrypt = require("bcrypt")

const LocalStrategy = require("passport-local")
const passport = require('passport')

// const campRoutes = require("./routers/campRoutes")

mongoose.connect("mongodb://localhost:27017/yelp-camp").then(
    console.log("DB connected ... ")
)

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => console.log("Database connected"))

app.engine("ejs", ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// middleware to be run for every incoming req (works on req object)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// use various route middleware
app.use("/campgrounds", campgroundRoutes);
app.use("/", userRoutes);

// use and configure session

const sessionOptions = { secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }
app.use(session(sessionOptions));
app.use(flash())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// configure passport
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Add middleware to get all flash objects of specific type and 
// assign to res.locals (so frontend has access)

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.get("/", wrapAsync(async (req, res, next) => {
    const { id } = req.params
    console.log("ID IS: ", id)
    const campground = await Campground.findById(id)

    res.render("./show", { campground })
}))

app.use((err, req, res, next) => {
    console.log("\n\n ERROR ERROR ERROR \n\n ", err, "\n\n")

    const status = err.status

    if (status >= 100 && status < 600)
        res.status(status);
    else
        res.status(500);
    res.send(err)
})

app.listen(3100, () => {
    console.log("listening at port 3100 !")
})