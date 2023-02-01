const mongoose = require('mongoose')
const Campground = require("../models/campground")
const { places, descriptors } = require("./seedHelpers")
const placesArr = require('./cities')

mongoose.connect("mongodb://localhost:27017/yelp-camp").then(
    console.log("DB connected ... ")
)

const db = mongoose.connection

const randNum = (array) => array[Math.floor[Math.random()] * array.length]


db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => console.log("Database connected"))


const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const c = new Campground({
            title: `${placesArr[i].city}`,
            place: `${placesArr[i].state}`
        })
        console.log("Adding new campground . . . ")
        c.save()
    }
}

seedDb()