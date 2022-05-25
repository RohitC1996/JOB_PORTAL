const express = require('express');
const orgController = require('../API/orgController');
const jobController = require("../API/jobController")
const router = express.Router();
const Joi = require('joi');

router.post('/Signup', (req, res, next) => {
    const querySchema = Joi.object({
        userName: Joi.string().min(3).required(),
        Email: Joi.string().email().required(),
        Password: Joi.string().required(),
        C_password: Joi.string().required().valid(Joi.ref('Password')),
        Country: Joi.string().required()
    })
    let { error, value } = querySchema.validate(req.body);
    if (error) {
        return res.status(404).send(error.message);  
    }
    next();
}, orgController.SignUpOrg)

router.get('/login', (req, res, next) => {
    const querySchema = Joi.object({
        Email: Joi.string().email().required(),
        Password: Joi.string().required(),
    })
    let { error, value } = querySchema.validate(req.body);
    if (error) {
        return res.status(404).send(error.message);
       
    }
    next();
}, orgController.OrgLogin)

router.get('/', orgController.getAllOrg)
router.post('/login', orgController.OrgLogin)
router.get('/:id', orgController.getOrgProfile)
router.post('/:id', orgController.UpdateOrg)
router.delete('/:id', orgController.deleteOrg)
router.delete('/deletejob/job_id=:job_id', orgController.deleteJob)
router.patch('/updateJob/:id', jobController.UpdateJob)
router.post('/forget/password', orgController.Forgetpassword)
router.post('/reset-password/:id/:token', orgController.resetPassword)



module.exports = router    
