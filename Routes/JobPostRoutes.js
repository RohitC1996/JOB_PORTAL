const express = require('express');
const JobController = require('../API/jobController');
const router = express.Router();
const Joi = require('joi');
const JobPost = require('../Services/JobService')

router.post('/:id', JobController.createJobPost)
router.get('/org/:id', JobController.getAllJobById)
router.get('/', JobController.show)
router.get('/populate/:id', JobController.populate)
router.get('/aggregate/job_id=:job_id', JobController.aggregate)

module.exports = router    