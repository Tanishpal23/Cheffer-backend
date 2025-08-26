import jwt from "jsonwebtoken"
import userSchema from "../model/userModel.js"


const jwtTokenSign = async (id) => {
    try {
        const secretKey = process.env.JWTSECRETKEY
        const token = jwt.sign({ id: id._id }, secretKey)
        const decoded = jwt.verify(token, secretKey)
        await userSchema.findByIdAndUpdate({ _id: decoded.id },
            { token: token, loginTime: decoded.iat },
            { new: true })         //in this we update so that, token and logintime should save in db

        return { token, decoded }
    } catch (error) {
        console.log(error)
    }
}

export default jwtTokenSign