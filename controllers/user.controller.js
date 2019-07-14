const http = require('http');
const path = require('path');
const status = require('http-status');
const jwt = require('jsonwebtoken');
const _config = require('../_config');
const fs =require('fs');
//importar mail
const sgMail = require('@sendgrid/mail');
const sendmail = require("../sendmail");


let _user;



const createUser = (req, res) => {
    const user = req.body;
    _user.create(user)
        .then((data) => {
            res.status(200);
            
            res.json({ msg: "El usuario fue creado pero aun no esta ACTIVO verifique su mail", data:data});
           
            var idusuario= data["_id"];
                       
           
            const env = {
                to:user["email"],
                subject: " TAREA 3U3 - AE2019",
                text:` Este es un mensaje que se envio `,
                html : "<h1>Hola bienvenido para disfrutar tu cuenta activala!!</h1><br><a style='padding:15px; background:blue; color:white;' href='http://localhost:3000/api/v1/usuarios/activar/"+idusuario+"'>"+"ACTIVA TU CUENTA</a>"
              }  
         sendmail.send(env);
        })
        .catch((err) => {
            res.status(400);
            res.json({ msg: "Error!!!!", data: err });
        });    
}
        
const activarCuenta = (req,res)=>{
    var idUsuario=req.params.id;
    var statusUsuario = {status:true}

    _user.findByIdAndUpdate(idUsuario,statusUsuario,{new:true})
    .then((data)=>{
        res.status(200);
        res.json({
            msg:"Su cuenta ha sido activada con exito"
        });
    }).catch((err)=>{
        res.status(404);
        res.json({
            msg:"No fue posible activar la cuenta"        
        }); 
    })
}

const CARGARCSVU =  (req,res) =>{
    fs.createReadStream("../usuarios.csv")
    .pipe(CARGARCSVU(['name', 'email','password']))
    .on('data', async function(data){
        try {
         var usuario = {
             name:data["name"],
             email:data["email"],
             password:data["password"]
         }

         await guardarUsuario(usuario);
        }
        catch(err) {
        console.log(err);
        }
    }) 
    .on('end',function(){
       res.status(200);
       res.json({
        "msg":"Archivo CSV cargado"
       });
    });  
}

async function guardarUsuario(usuario){
    await _user.create(usuario)
    .then((data) =>{
    }) 
    .catch((err)=>{
    })
}


const findAll = (req, res) => {
    _user.find()
        .then((data) => {
            if (data.length == 0) {
                res.status(status.NO_CONTENT);
                res.json({ msg: "No se encontraron usuarios" });
            } else {
                res.status(status.OK);
                res.json({ msg: "Éxito!!!", data: data });
            }
        })
        .catch((err) => {
            res.status(status.BAD_REQUEST);
            res.json({ msg: "Error!!!" });
        });
}

const deleteByID = (req, res) => {
    const { id } = req.params;
    // const id = req.params.id;

    const params = {
        _id: id
    };

    _user.findByIdAndRemove(params)
        .then((data) => {
            res.status(status.OK);
            res.json({ msg: "Éxito!!!", data: data });
        })
        .catch((err) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: "Error!!! No se encontró", err: err });
        });

}

const login = (req, res) => {
    const { email, password } = req.params;
    let query = { email: email, password: password };
    _user.findOne(query, "-password")
        .then((user) => {
            if (user) {
                const token = jwt.sign({ email: email }, _config.SECRETJWT);
                res.status(status.OK);
                res.json({
                    msg: "Acceso exitoso",
                    data: {
                        user: user,
                        token: token
                    }
                });
            } else {
                res.status(status.NOT_FOUND);
                res.json({ msg: "Error!!! No se encontró" });
            }
        })
        .catch((err) => {
            res.status(status.NOT_FOUND);
            res.json({ msg: "Error!!! No se encontró", err: err });
        });
};




module.exports = (User) => {
    _user = User;
    return ({
        createUser,
        findAll,
        deleteByID,
        login,
        activarCuenta,
        CARGARCSVU
    });
}
