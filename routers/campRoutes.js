
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Person = require("../models/person")
const flash = require("connect-flash")
const { isLoggedIn } = require("../middleware")
const Joi = require("joi")


const addCampSchema = Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required(),
    descriptor: Joi.string().required(),
})


// define basic router routes
router.get("/", wrapAsync((async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render("./index", { campgrounds })
})))

router.post("/new", isLoggedIn, async (req, res) => {
    try {

        // get cookies and print to console 

        const cookies = req.cookies
        console.log("cookies : ", cookies)
        // validate form submit using joi
        const joiReturn = addCampSchema.validate(req.body)

        console.log("JOI return is ", joiReturn)

        if (e = joiReturn.error) {
            throw e
        }

        const details = req.body
        const campground = new Campground(details)
        campground.author = req.user._id;
        await campground.save()
        console.log("Created camp : ", campground)
        res.render("./show", { campground })
    } catch (e) {
        console.log("\n\ncannot create new campground\n\n")
        throw e
    }
})

router.get("/:id", wrapAsync(async (req, res, next) => {

    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("./show", { campground })
}))

router.delete("/:id"), wrapAsync(async (req, res, next) => {
    console.log("deleting campground . . .")
    const camp = await Campground.findByIdAndDelete(req.params.id)
    const campgrounds = await Campground.find({})
    res.redirect("/campground", campgrounds)
})


router.get("/persons", wrapAsync(async (req, res, next) => {

    const persons = await Person.find({})
    for (let person in persons) {
        console.log(person.name)
    }
    res.render("./allPersons", { persons })
}))



router.get("/:id/person", wrapAsync(async (req, res, next) => {

    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("person", { campground })
}))

router.post("/:id/person/new", wrapAsync(async (req, res, next) => {

    const { id } = req.params
    console.log(id)

    const camper = new Person(req.body)
    await camper.save()

    const campground = await Campground.findById(id).populate("campers")
    campground.campers.push(camper)
    await campground.save()
    res.render("./show", { campground })
}));

router.get("/", (req, res) => {
    res.render("home")
})

module.exports = router;