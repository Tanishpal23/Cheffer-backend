import userModel from "../model/userModel.js"
import { imageUpload } from "../utilis/helperFile.js"
import jwtTokenSign from "../utilis/jwtToken.js"
import bycrypt from "bcrypt"
const saltRound = 10

const signUp = async (req, res) => {
    try {
        const validationU = await userModel.findOne({ email: req.body.email })
        if (validationU !== null) {
            return res.json({
                success: false,
                status: 400,
                message: "Email already exist",
                body: {}
            })
        } else {
            if (req.files && req.files.image.name) {
                const image = req.files.image;
                if (image) req.body.image = imageUpload(image, "userImage");
            }
            const passwordEncrypt = await bycrypt.hash(req.body.password, saltRound)
            console.log(req.body.password,"jkjkjik")
            console.log(passwordEncrypt,"passwordEncrypt")
            const data = await userModel.create({ ...req.body, password: passwordEncrypt, image: req.body.image })
            const tokenData = await jwtTokenSign({ _id: data._id })
            data.token = tokenData.token
            data.loginTime = tokenData.decoded.iat
            res.json({
                success: true,
                status: 200,
                message: "User created succesfully",
                body: data
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            status: 400,
            message: error,
            body: {}
        })
    }
}

const login = async (req, res) => {
    console.log(req.body)
    try {
        const findEmail = await userModel.findOne({ email: req.body.email, isAdmin: 1 })
        if (findEmail == null) {
            res.json({
                success: false,
                status: 400,
                message: "Email is not valid",
                body: {}
            })
        } else {
            const passwordVerify = await bycrypt.compare(req.body.password, findEmail.password)
            if (passwordVerify == false) {
                res.json({
                    success: false,
                    status: 400,
                    message: "Password is not correct",
                    body: {}
                })
            } else {
                const data = await userModel.findOne({ email: req.body.email })
                const tokenUpdate = await jwtTokenSign(data._id)
                data.token = tokenUpdate.token
                data.loginTime = tokenUpdate.decoded.iat
                res.json({
                    success: true,
                    status: 200,
                    message: "Login successfully",
                    body: {
                        ...data.toObject(),
                        image: `${data?.image}`,
                        prevImg: `http://localhost:${process.env.PORT}/images/userImage/${data?.image}`
                    }
                })
            }
        }
    } catch (error) {
        res.json({
            success: false,
            status: 400,
            message: "error",
            body: {}
        })
    }
}



export default { signUp, login}