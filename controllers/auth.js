const {response} = require('express')
const bcrypt = require('bcryptjs');

const Usuario = require('../modelo/usuario');
const {generarJWT} = require('../helpers/jwt');
const {googleVerify} = require('../helpers/google-verify');
const usuario = require('../modelo/usuario');
const { JWT } = require('google-auth-library');

const login = async (req, res = response) => {
    const {email, password} = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrada'
            })
        }
        
        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            })
        }
        
        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response) =>{
    const googleToken = req.body.token;
    try {
        const {name, email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            // Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else{
            // Eiste usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en la BD
        await usuario.save();

        // Generar el TOKEN -JWT
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',            
        })
    }
}

module.exports = {
    login,
    googleSignIn
}