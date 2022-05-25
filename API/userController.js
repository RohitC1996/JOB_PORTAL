const mongoose = require('mongoose');
const User = require('../Services/User.service')
var nodemailer = require('nodemailer');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const JobPost = require("../Services/JobService")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { array } = require('joi');
module.exports = {

    SignUp: function (req, res, next) {
        bcrypt.hash(req.body.Password, 10).then(function (hash) {
            var user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                Email: req.body.Email,
                Password: hash,
                Country: req.body.Country,
                Gender: req.body.Gender,
            };
            User.create(user, async function (err, user) {
                if (err) {
                    res.json({
                        error: err
                    })
                }else {
                
                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    // port: 587,
                    // secure: true,
                    // requireTLS:true,
                    auth: {
                        user: 'rohit.chauhan@epitometechnologies.com',
                        pass: "Rohit123@#"
                    }

                });
                var mailOptions = {
                    from: 'rohit.chauhan@epitometechnologies.com',
                    to: req.body.Email,
                    subject: "testing node mailer",
                    text: " user create successfully"
                }
                transporter.sendMail(mailOptions, function(err, info) {
                    if(err)
                    {
                        res.status(404).send(err)
                    }else {
                        res.status(200).json({

                            message: "user created successfully  mail has sent to your email", user: user
                        })
                    }
                
                })
    
            }
                
            })
        })
    },

    UserLogin: async function (req, res, next) {
        const { Email, Password } = req.body
        try {
            const user = await User.findOne({ Email })
            if (!user) {
                throw {
                    message: "Login not successful",
                    error: "invalid email ",
                }
            } else {
                let valid = await bcrypt.compare(Password, user.Password)
                if (!valid) {
                    throw {
                        message: "Login not successful",
                        error: "Invalid Password ",
                    }
                }
                res.status(200).json({
                    message: "Login successful",
                    user,
                })
            }
        } catch (error) {
            res.status(404).send(error)
        }
    },

    Forgetpassword: async function (req, res, next) {
        const { Email } = req.body
        var user = await User.findOne({ Email })
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
        const link = `http://localhost:8000/api/user/reset-password/${user.id}/${token}`
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // port: 587,
            // secure: true,
            // requireTLS:true,
            auth: {
                user: 'rohit.chauhan@epitometechnologies.com',
                pass: "Rohit123@#"
            }
     });

        var mailOptions = {
            from: 'rohit.chauhan@epitometechnologies.com',
            to: Email,
            subject: " Reset password link",
            text:  link
        }

        transporter.sendMail(mailOptions, function(err, res, info) {
            if(err)
            {
                console.log( "error===================",err);
         
            }else {
              
                console.log("mail has been sent", info.response );
            }
        
        })
           //res.status(200).send( "reset password link sent to your email address");
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
        const userdata = await User.findOne({ _id: id })
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
                User.update({ _id: id }, user, function (err) {
                    if (err) {
                        res.status(404).json({ error: err, message: "user not updated" })
                    }
                    res.status(200).json({
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

    getAllUsers: function (req, res, next) {
        User.get({}, (err, users) => {
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({ message: "All Users data", users })
        })
    },
    getUserById: (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "invalid user_id"
            })
        }

        User.get({ _id: req.params.id }, function (err, user) {
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(200).json({ message: "User  data", user })
        })
    },
    deleteUser: (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "invalid user_id"
            })
        }
        User.delete({ _id: req.params.id }, function (err, user) {
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(200).json({ message: "Deleted User  data", user })
        })
    },
    updateEducation: async function (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "invalid user_id"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id2)) {
            return res.status(404).json({
                message: "invalid education obj_id"
            })
        }
        if (req.body.education) {
            let edu = req.body.education[0];
            await User.findOneAndUpdate({ _id: req.params.id, "education._id": req.params.id2 },
                { $set: { "education.$": edu } }).then(() => {
                    res.status(200).json({ message: "user education update successfully", edu })
                }).catch((error) => {
                    console.log(error);
                })
        }
    },
    
    updateSkills: async function (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "invalid user_id"
            })
        }
        if (req.body.skills) {

            let skill = req.body.skills;            
            if (skill.technicalSkills && skill.TrainingAndInternshipe) {
                  User.updateOne({ _id: req.params.id },
                    {
                        $set: {
                            "skills": skill
                        }
                    }).then(() => {
                       return res.status(200).send({ message: "user education update successfully" })
                       return
                    }).catch((error) => {
                       return res.send(error);
                    })
            } else if (skill.TrainingAndInternshipe) {
                 User.updateOne({ _id: req.params.id },
                    {
                        $set: {
                            "skills.TrainingAndInternshipe": skill.TrainingAndInternshipe
                        }
                    }).then(() => {
                       return res.status(200).send({ message: "user education update successfully" })
                       
                    }).catch((error) => {
                        return res.send(error);
                    })
            } else {
                 User.updateOne({ _id: req.params.id },
                    {
                        $set: {
                            "skills.technicalSkills": skill.technicalSkills
                        }
                    }).then(() => {
                       return res.status(200).send({ message: "user education update successfully" })
                       
                    }).catch((error) => {
                        return res.send(error);
                        

                    })
                  
                  
            }
            return 
         
            
        }
    },

    updateOneUser: async function (req, res, next) {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: "invalid user_id"
            })
        }
        const user = {}
        if (req.body.firstName) {
            user.firstName = req.body.firstName
        }
        if (req.body.lastName) {
            user.lastName = req.body.lastName
        }
        if (req.body.Country) {
            user.Country = req.body.Country
        }
        if (req.body.Email) {
            user.Email = req.body.Email
        }
        if (req.body.Address) {
            user.Address = req.body.Email
        }
        if (req.body.Phone_no) {
            user.Phone_no = req.body.Phone_no
        }
        if (req.body.Gender) {
            user.Gender = req.body.Gender
        }
        if (req.body.description) {
            user.description = req.body.description
        }
        if (req.body.skills) {

            // let skill = req.body.skills;            
            // if (skill.technicalSkills && skill.TrainingAndInternshipe) {
            //       User.updateOne({ _id: req.params.id },
            //         {
            //             $set: {
            //                 "skills": skill
            //             }
            //         }).then(() => {
            //            return res.status(200).send({ message: "user education update successfully" })
            //            return
            //         }).catch((error) => {
            //            return res.send(error);
            //         })
            // } else if (skill.TrainingAndInternshipe) {
            //      User.updateOne({ _id: req.params.id },
            //         {
            //             $set: {
            //                 "skills.TrainingAndInternshipe": skill.TrainingAndInternshipe
            //             }
            //         }).then(() => {
            //            return res.status(200).send({ message: "user education update successfully" })
                       
            //         }).catch((error) => {
            //             return res.send(error);
            //         })
            // } else {
            //      User.updateOne({ _id: req.params.id },
            //         {
            //             $set: {
            //                 "skills.technicalSkills": skill.technicalSkills
            //             }
            //         }).then(() => {
            //            return res.status(200).send({ message: "user education update successfully" })
                       
            //         }).catch((error) => {
            //             return res.send(error);
                        

            //         })
                  
                  
            // }
         

           var data = {}
            const userdata = await User.findOne({ _id: req.params.id })
            if (req.body.skills.technicalSkills) {
                data.technicalSkills = req.body.skills.technicalSkills
            }
            if (req.body.skills.TrainingAndInternshipe) {
                data.TrainingAndInternshipe = req.body.skills.TrainingAndInternshipe
            }

            if (!req.body.skills.technicalSkills && userdata.skills.technicalSkills) {
                data.technicalSkills = userdata.skills.technicalSkills
            }
            if (!req.body.skills.TrainingAndInternshipe && userdata.skills.TrainingAndInternshipe) {
                data.TrainingAndInternshipe = userdata.skills.TrainingAndInternshipe
            }

            user.skills = data
            
        }


        if (req.body.education) {

             const userdata = await User.findOne({_id:req.params.id})
            var arr = req.body.education;
            const edu = userdata.education;
            // for (let i = 0; i < arr.length; i++) {
            //     if (arr[i].tenth) {
            //         console.log(arr[i])
            //         edu[0] = arr[i];
            //     }
            //     if (arr[i].twelth) {
            //         console.log(arr[i])
            //         edu[1] = arr[i];
            //     }
            //     if (arr[i].grad) {
            //         console.log(arr[i])
            //         edu[2] = arr[i];
            //     }
            //     if (arr[i].Post_grad) {
            //         console.log(arr[i])
            //         edu[2] = arr[i];
            //     }
            // }
           // user.education = edu

          
            /* 
           // In this method we assign index  to store education data to assigned index
          const Education  =  arr.map((x, i) => {
             if (arr[i].tenth) {
                        console.log(arr[i])
                        edu[0] = arr[i];
                    }
             if (arr[i].twelth) {                 
    
                        console.log(arr[i])
                        edu[1] = arr[i];
                    }
            if (arr[i].grad) {
                        console.log(arr[i])
                        edu[2] = arr[i];
                    }
            if (arr[i].Post_grad) {
                        console.log(arr[i])
                        edu[2] = arr[i];
                    }
             }) */


           const Education  =  arr.map((x, i) => {
                var  index = edu.findIndex(e => e.tenth != null);                
                if (index !== -1) {
                    if(arr[i].tenth)
                    edu[index].tenth = arr[i].tenth;
                }else{
                    if(arr[i].tenth){
                        edu.push(arr[i])
                    }
                };
                var index = edu.findIndex(e => e.twelth != null);
                if (index !== -1) {
                    if(arr[i].twelth)
                    edu[index].twelth = arr[i].twelth;
                } else{
                    if(arr[i].twelth){
                        edu.push(arr[i])
                    }
                };
                var index = edu.findIndex(e => e.grad != null);
                if (index !== -1) {
                    if(arr[i].grad)
                    edu[index].grad = arr[i].grad;
                } else{
                    if(arr[i].grad){
                        edu.push(arr[i])
                    }
                };
                var index = edu.findIndex(e => e.Post_grad != null);
                if (index !== -1) {
                    if(arr[i].Post_grad)
                    edu[index].Post_grad = arr[i].Post_grad;
                }else{
                    if(arr[i].Post_grad){
                        edu.push(arr[i])
                    }
                };
            })
            user.education = edu
        }


        await User.updateOneUser({ _id: req.params.id }, user, function (err) {
            // console.log(req.params.id);
            // console.log(user);
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(200).json({
                message: "User updated sucessfully", user: user
            })
        })
    },

}