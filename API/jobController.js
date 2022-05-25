const { func } = require('joi');
const mongoose = require('mongoose');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const JobPost = require('../Services/JobService');
const User = require('../Services/Org.service');
const OrgUser = require("../Services/Org.service");
module.exports = {
    createJobPost: function (req, res, next) {
        var JObdata = {
            title: req.body.title,
            description: req.body.description,
            requiredSkills: req.body.requiredSkills,
            salaryRange: req.body.salaryRange,
            location: req.body.location,
            applicant: req.body.applicant,
            Country: req.body.Country,
            Org_id: req.params.id
        };
        JobPost.create(JObdata, function (err, JObdata) {
            if (err) {
                res.json({
                    error: err
                })
            }
            res.status(200).json({
                message: "user created successfully", JObdata: JObdata

            })
        })
    },
    getAllJobs: function (req, res, next) {
        JobPost.get({}, (err, users) => {
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({ message: "All Users data", users })
        })
    },
    UpdateJob: function (req, res, next) {

        var job = {}
        if (req.body.title) {
            job.title = req.body.title
        }
        if (req.body.description) {
            job.description = req.body.description
        }
        if (req.body.requiredSkills) {
            job.requiredSkills = req.body.requiredSkills
        }
        if (req.body.salaryRange) {
            job.salaryRange = req.body.salaryRange
        }
        if (req.body.location) {
            job.location = req.body.location
        }
        if (req.body.Country) {
            job.Country = req.body.Country
        }

        JobPost.update({ _id: req.params.id }, job, function (err) {

            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({
                message: "job updated sucessfully", job: job
            })
        })
    },

    getAllJobById: function (req, res, next) {
        JobPost.get({ Org_id: req.params.id }, (err, users) => {
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({ message: "All Users data", users })
        })
    },

    show: function (req, res, next) {
        // key to populate
        JobPost.find({}).populate("applicant", 'userName Email ')
            .then(user => {
                res.json(user);
            });
    },

    populate: function (req, res, next) {
        // key to populate
        JobPost.findOne({ _id: req.params.id }).populate("applicant")
            .then(user => {
                res.json(user);
            });
    }
    ,

    aggregate: async function (req, res, next) {

        if (!mongoose.Types.ObjectId.isValid(req.params.job_id)) {
            return res.status(404).json({
                message: "invalid job_id"
            })
        }
        // key to populate

        var pipeline = [
            {
                "$match": {
                    "_id": new ObjectID(req.params.job_id)
                }
            },
            {
                "$lookup": {
                    "from": "organizations",
                    "let": {
                        "orgnationId": "$Org_id"
                    },
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$and": [
                                        {
                                            "$eq": [
                                                "$_id",
                                                "$$orgnationId"
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            "$project": {
                                "userName": 1.0,
                                "Email": 1.0,
                                "Address": 1.0,
                                "_id": 1.0
                            }
                        }
                    ],
                    "as": "<Organization details>"
                }
            }
        ];
        var options = {
            allowDiskUse: false
        };

        try {
            var cursor = await JobPost.aggregate(pipeline, options);
            res.status(200).send(cursor)
        } catch (error) {
            res.status(404).send(error + "something went wrong ")
        }



    },
    ApplyJob: async function (req, res, next) {

        if (!mongoose.Types.ObjectId.isValid(req.params.job_id)) {
            res.json({
                msg: "JOB_Id is not valid"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.json({
                msg: "User_id is not valid"
            })
        }

        const Job = await JobPost.findOne({ _id: req.params.job_id })
        var arr = Job.applicant;
        if (arr.indexOf(req.params.id) >= 0) {
            return res.status(200).send("user has alredy applied for this job")
        }
        var user = {
            applicant: req.params.id
        }

        JobPost.UpdateJOb({ _id: req.params.job_id }, user, function (err) {
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({
                message: "job updated sucessfully", job: user
            })
        })
    },
    DeleteApplicant: async function (req, res, next) {

        if (!mongoose.Types.ObjectId.isValid(req.params.job_id)) {
            res.json({
                msg: "JOB_Id is not valid"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.json({
                msg: "User_id is not valid"
            })
        }

        const Job = await JobPost.findOne({ _id: req.params.job_id })
        var arr = Job.applicant;
        if (arr.indexOf(req.params.id) == -1) {
            return res.status(200).send("user is not exist")
        }

        var user = {
            applicant: req.params.id
        }
        var Applicant = req.params.id
        JobPost.DeleteandUpdateJOb({ _id: req.params.job_id }, Applicant, function (err) {
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({
                message: "job updated sucessfully", job: Applicant
            })
        })
    },

}