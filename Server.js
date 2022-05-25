const express = require('express')
var nodemailer = require('nodemailer');

const Api = require('./Api')
require('dotenv').config()
const app = express()
const port = process.env.PORT
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
//require('./nodemailer');
// const swaggerAutogen = require('swagger-autogen')();


//Database 
require('./Config/dbcon')


app.use(express.json());
app.use('/api', require('./Routes/index') );

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))



app.get('/', (req,res) =>{ 
    res.send('welcome to homepage ') 
})



 

app.listen(port, () =>{
    console.log(`listoning the port ${port}`)
}) 


// app.post('/mail', async function (req,res){ 
   
//     var transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         // port: 587,
//         // secure: true,
//         // requireTLS:true,
//         auth:{
//             user: 'rohit.chauhan@epitometechnologies.com',
//             pass: "Rohit123@#"
//         }
    
//     });
//     var mailOptions= {
//         from:'rohit.chauhan@epitometechnologies.com',
//         to: 'rohit.chauhan@e.com',
//         subject:"testing node mailer",
//         text: " email sent successfully"
//     }

   
//    //try {
//     let info = await  transporter.sendMail(mailOptions)
//     console.log(info);
// //     if(!info)
// //     {
// //         throw ("something went wrong");
// //     }
// //     else{
// //         res.status(200).send(info)
// //     }
       
// //    } catch (error) {
// //        res.status(404).send(error)
// //    } 
 
       
//        res.json({info: info})
    

// })