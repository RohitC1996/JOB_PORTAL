var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
   // port: 587,
   // secure: true,
   // requireTLS:true,
//requireTLS:true,

    auth:{
        user: 'rohit.chauhan@epitometechnologies.com',
        pass: "Rohit123@#"
    }

});
var mailOptions= {
    from:'rohit.chauhan@epitometechnologies.com',
    to: 'rohit.chauhan@epitometechnologies.com',
    subject:"testing node mailer",
    text: " email sent successfully"
}

transporter.sendMail(mailOptions, function(err, info) {
    if(err)
    {
        console.log(err);
    }else {
        console.log("mail has been sent", info.response );
    }

})