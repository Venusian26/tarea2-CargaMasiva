const router = require('express').Router();

module.exports = (wagner) => {

    const userCtrl = wagner.invoke((User) =>
        require('../controllers/user.controller')(User));

    //post //https://localhost:27017/api/v1/usuarios
    router.post('/', (req, res) =>
        userCtrl.createUser(req, res));

    //get //https://localhost:27017/api/v1/usuarios
    router.get('/', (req, res) =>
        userCtrl.findAll(req, res));




    //post //https://localhost:27017/api/v1/email/password
    router.get('/login/:email/:password', (req, res) =>
        userCtrl.login(req, res));






    //post //https://localhost:27017/api/v1/usuarios/id
    router.delete('/:id', (req, res) =>
        userCtrl.deleteByID(req, res));

    //Carga vcf
    router.get('/cargar', (req, res) =>
    userCtrl.CARGARCSVU(req, res));
  

    //RUTA
    //cracion usuario, Logueo y activacion por correo
     //get //https://localhost:27017/api/v1/usuarios/activar
     router.get('/activar/:id', (req, res) =>
     userCtrl.activarCuenta(req, res));

    return router;
}