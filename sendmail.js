const sgMail = require('@sendgrid/mail');
const config = require('./_config');

sgMail.setApiKey(config.SENDGRID_APIKEY);

function send(msg) {
msg["from"] = config.sender_email;

    sgMail.send(msg)
    .then(
        (data)=>{
            console.log("Correo enviado con Exito");
            console.log(data);
        }
    ).catch(
        (err)=>{
            console.log("Fallo");
            console.log(err);
        }
    )

}


module.exports.send = send;