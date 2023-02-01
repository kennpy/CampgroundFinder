const mongoose = require("mongoose")
const { authorize } = require("passport")
const Person = require("./person")
const user = require("./user")
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    city: String,
    state: String,
    descriptor: String,
    campers: [{ type: Schema.Types.ObjectId, ref: "person" }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})

CampgroundSchema.post("findByIdAndDelete", async (deletedCamp) => {
    if (deletedCamp) {
        await Person.deleteMany({
            _id: {
                $in: deletedCamp.campers
            }
        })
    }
    else {
        console.log("Camp could not be deleted \n")
    }
})

module.exports = mongoose.model("campgrounds", CampgroundSchema)