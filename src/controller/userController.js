import logger from "../logger/logger.js";
import {createUser, userLogin} from "../services/userServices.js"

export const registerUser = async (req, res, next) => {
    try {
        const user = await createUser(req.body)

        return res.status(200).send({status: true, message: 'New user registered successfully', data: user})
    }
    catch(err){
        logger.info(err.message)
        next(err)
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const login = await userLogin(req.body);

        req.session.user = login.user;

        res.header('Authorization', 'Bearer ' + login.token)

        return res.status(200).send({status: true, msg: "Login successfull", token: login.token, user: login.user})
       
    } catch (err) {
        logger.info(err.message);
        next(err);
    }
}