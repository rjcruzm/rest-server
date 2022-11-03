const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario')

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'El Usuario y/o Password son incorrectos'
            });
        }

        // Verificar si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'El Usuario y/o Password son incorrectos - Estado: false'
            });
        }

        // Verificar el password
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( validPassword ) {
            return res.status(400).json({
                msg: 'El Usuario y/o Password son incorrectos - Password no válido'
            });
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });        
    } catch (error) {
        res.status(500).json({
            msg: 'Algo salio mal'
        });
    }
}

module.exports = {
    login
}