import mongoose from "mongoose"

const connectionDb = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log("Connected with database")
    } catch (error) {
        console.log(error)
    }
}

export default connectionDb