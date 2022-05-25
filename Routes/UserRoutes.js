const express = require('express');
const res = require('express/lib/response');
const userController = require('../API/userController');
const jobController = require("../API/jobController");
const orgController = require('../API/orgController');
const router = express.Router()
const Joi = require('joi');


router.post('/signup', (req, res, next) => {
    console.log(req.body);
    const querySchema = Joi.object({
        firstName: Joi.string().min(3).regex(/^([a-zA-Z])+$/).required(),
        lastName: Joi.string().min(3).required(),
        Email: Joi.string().required(),
        Password: Joi.string().required(),
        Gender: Joi.string().valid("male", "female").required(),
        Country: Joi.string().required()
    })
    let { error, value } = querySchema.validate(req.body);
    if (error) {
        res.status(404).send(error.message);
        return;
    }
    next();
}, userController.SignUp)

router.post('/login', (req, res, next) => {
    const querySchema = Joi.object({
        Email: Joi.string().required(),
        Password: Joi.string().required(),
    })
    let { error, value } = querySchema.validate(req.body);
    if (error) {
        res.status(404).send(error.message);
        return;
    }
    next();
}, userController.UserLogin)

router.get('/jobs', jobController.getAllJobs)
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.patch('/update/user_id=:id', (req, res, next) => {
    const querySchema = Joi.object({
        firstName: Joi.string().min(3).regex(/^([a-zA-Z])+$/),
        lastName: Joi.string().min(3),
        Email: Joi.string().email(),
        Password: Joi.string(),
        Phone_no: Joi.number(),
        Address: Joi.string(),
        Gender: Joi.string().valid("male", "female"),
        Country: Joi.string(),
        education: Joi.array().items({
            tenth: Joi.number(),
            twelth: Joi.number(),
            grad: Joi.number().optional().allow("", null),
            Post_grad: Joi.number().optional().allow("", null),
        }),
        skills: Joi.object().keys({
            technicalSkills: Joi.array(),
            TrainingAndInternshipe: Joi.array()
        })
    })
    let { error, value } = querySchema.validate(req.body);
    if (error) {
        return res.status(404).send(error.message);
    }
    next();
}, userController.updateOneUser)

router.patch('/updateEducation/user_id=:id/obj_id=:id2', (req, res, next) => {
    const querySchema = Joi.object({
        education: Joi.array().items({
            tenth: Joi.number(),
            twelth: Joi.number(),
            grad: Joi.number().optional().allow("", null),
            Post_grad: Joi.number().optional().allow("", null),
        }),
    })
    let { error, value } = querySchema.validate(req.body);
    if (error) {
        return res.status(404).send(error.message);
    }
    next();
}, userController.updateEducation)

router.patch('/updateSkills/user_id=:id', (req, res, next) => {
    const querySchema = Joi.object({
        skills: Joi.object().keys({
            technicalSkills: Joi.array(),
            TrainingAndInternshipe: Joi.array()
        })
    })
    let { error, value } = querySchema.validate(req.body);
    if (error) {
        return res.status(404).send(error.message);
    }
    next();
}, userController.updateSkills)

router.get('/org/allorg', orgController.getAllOrg)
router.get('/org/:id', orgController.getOrgProfile)
router.delete('/:id', userController.deleteUser)
router.post('/apply/user_id=:id/job_id=:job_id', jobController.ApplyJob)
router.delete('/deleteApplicant/user_id=:id/job_id=:job_id', jobController.DeleteApplicant)
router.post('/forget/password', userController.Forgetpassword)
router.post('/reset-password/:id/:token', userController.resetPassword)

module.exports = router


