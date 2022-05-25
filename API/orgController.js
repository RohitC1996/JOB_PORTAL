const mongoose = require('mongoose');
const jwt_decode = require('jwt-decode');
const bcrypt = require('bcrypt');
const OrgUser = require('../Services/Org.service');
const JobPost = require("../Services/JobService")
const jwt = require('jsonwebtoken');
const { func } = require('joi');
const { JobPosts } = require('.');
module.exports = {
    SignUpOrg: async function (req, res, next) {
        // console.log("==============",req.body);
        try {
            var user = await OrgUser.find({ Email: req.body.Email })
            if (user.length > 0) {
                throw "Email is alredy exist";
            }
        }
        catch (error) {
            return res.send(error)
        }
        bcrypt.hash(req.body.Password, 10).then(function (hash) {

            var Org = {
                userName: req.body.userName,
                Email: req.body.Email,
                Password: hash,
                Country: req.body.Country

            };
            OrgUser.create(Org, function (err, Org) {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                res.status(200).json({
                    message: "user created successfully", Org: Org
                })
            })
        });
    },

    OrgLogin: async function (req, res, next) {
        const { Email, Password } = req.body
        const user = await OrgUser.findOne({ Email })
        console.log(user);
        if (!user) {
            res.status(401).json({
                message: "Login not successful",
                error: "invalid email ",
            })
        } else {
            let valid = await bcrypt.compare(Password, user.Password)
            console.log(valid);
            if (!valid) {
                res.status(401).json({
                    message: "Login not successful",
                    error: "invalid password not found",
                })
            }
            res.status(200).json({
                message: "Login successful",
                user,
            })
        }

    },

    getOrgProfile: function (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.json({
                msg: "Id is not valid"
            })
        }
        OrgUser.get({ _id: req.params.id }, function (err, organization) {
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(200).json({ message: "organization data", organization })
        })
    },

    deleteOrg: (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "invalid user_id"
            })
        }
        OrgUser.delete({ _id: req.params.id }, function (err, user) {
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(200).json({ message: "Deleted organization  data", user })
        })
    },

    deleteJob: (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.job_id)) {
            return res.status(404).json({
                message: "invalid user_id"
            })
        }
        JobPost.delete({ _id: req.params.job_id }, function (err, job) {
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(200).json({ message: "Deleted job  data", job })
        })
    },

    getAllOrg: function (req, res, next) {
        OrgUser.get({}, (err, organization) => {
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({ message: "All organization data", organization })
        })
    },

    UpdateOrg: function (req, res, next) {
        var user = {}
        if (req.body.userName) {
            user.userName = req.body.userName
        }
        if (req.body.Email) {
            user.Email = req.body.Email
        }
        if (req.body.Country) {
            user.Country = req.body.Country
        }
        if (req.body.Address) {
            user.Address = req.body.Address
        }
        if (req.body.Phone_no) {
            user.Phone_no = req.body.Phone_no
        }

        OrgUser.update({ _id: req.params.id }, user, function (err) {
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(201).json({
                message: "Org updated sucessfully", user: user
            })
        })

    },

    Forgetpassword: async function (req, res, next) {
        const { Email } = req.body
        var user = await OrgUser.findOne({ Email })
        if (!user) {
            res.send("user not found on this email")
            return
        }
        const secret = "abc" + user.Password;
        const payload = {
            email: user.Email,
            id: user.id
        }
        const token = jwt.sign(payload, secret, { expiresIn: '15m' })
        const link = `http://localhost:8000/api/org/reset-password/${user.id}/${token}`
        res.send(link)
        next()
    },

    resetPassword: async function (req, res, next) {
        const { id, token } = req.params
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.json({
                msg: "Id is not valid"
            })
        }
        const userdata = await OrgUser.findOne({ _id: id })
        console.log(userdata);
        const secret = "abc" + userdata.Password
        password = req.body.Password
        var user
        bcrypt.hash(password, 10).then(function (hash) {
            console.log(hash);
            user = {
                Password: hash
            }
            try {
                const payload = jwt.verify(token, secret)
                OrgUser.update({ _id: id }, user, function (err) {
                    if (err) {
                        res.status(404).json({ error: err, message: "user not updated" })
                    }
                    res.status(201).json({
                        message: "Org updated sucessfully", user: user
                    })
                })
            }
            catch (error) {
                console.log("invalid token ");
                res.status(404).send(error.message)
            }
        })
    },
    // setpassword: async function (req, res, next) {

    //     const { id, token } = req.params
    //     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //         res.json({
    //             msg: "Id is not valid"
    //         })
    //     }
    //     const userdata = await OrgUser.findOne({ _id: id })
    //     console.log(userdata);
    //     const secret = "abc" + userdata.Password
    //     // res.send(userdata)
    //     password = req.body.Password
    //     var user
    //     bcrypt.hash(password, 10).then(function (hash) {
    //         console.log(hash);
    //         user = {
    //             Password: hash
    //         }
    //         try {
    //             const payload = jwt.verify(token, secret)
    //              OrgUser.update({ _id: id }, user, function (err) {
    //                 if (err) {
    //                     res.status(404).json({ error: err, message: "user not updated" })
    //                 }
    //                 res.status(201).json({
    //                     message: "Org updated sucessfully", user: user
    //                 })
    //             })
    //         }
    //         catch (error) {
    //             console.log("invalid token ");
    //             res.status(404).send(error.message)
    //         }



    //     })

    // },



}