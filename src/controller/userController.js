import logger from "../logger/logger.js";
import {createUser, userLogin, userUpdate, getinspectionManager, getUserByRole } from "../services/userServices.js"

/*
* @author Prafful Bansal
* @description User registration 
* @route POST user/register
*/
export const registerUser = async (req, res, next) => {
    try {
        const creatorRole = req.decodedToken.role
        const creatorId = req.decodedToken.userId;

        const user = await createUser(req.body, creatorRole, creatorId)

        return res.status(200).send({status: true, message: 'New user registered successfully', data: user})
    }
    catch(err){
        logger.info(err.message)
        next(err)
    }
}

/*
* @author Prafful Bansal
* @description User login 
* @route POST user/login
*/
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

/*
* @author Prafful Bansal
* @description Update inspectionManager 
* @route PUT user/updateUser
*/
export const updateUserHandler = async (req, res, next) => {
    try{
        const requestBody = req.body

        const update = await userUpdate(requestBody)
        res.status(200).send({status: true, message: 'User updated successfully', data: update})
    } catch(err) {
        logger.info(err.message);
        next(err);
    }
}

/*
* @author Prafful Bansal
* @description get inspectionManager by login role
* @route GET /user/inspectionManager
*/
export const getInspectionManagerHandler = async (req, res, next) => {
    try {
        const payload = req.decodedToken

        const insManager = await getinspectionManager(payload)

        res.status(200).send({status: true, message: 'Inspection Manager are: ', data: insManager})
    } catch (err) {
        logger.info(err.message);
        next(err);
    }
}

/*
* @author Prafful Bansal
* @description get users by role
* @route GET /user/get
*/
export const getUserByRoleHandler = async (req, res, next) => {
    try {
        const role = req.query.role;
        
        const users = await getUserByRole(role);
        return res.status(200).send({status: 'true', numbers : users.length, data : users});
        
    } catch (err) {
        logger.info(err.message);
        next(err);
    }
}

/*
* @author Prafful Bansal
* @description User logout 
* @route GET  /user/logout
*/
export const logoutUser =  async (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            throw new Error(err.message);
        }
    });
   return res.clearCookie("connect.sid").end("logout success");
}