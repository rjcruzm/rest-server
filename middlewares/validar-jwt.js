const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay Token en la petición'
        })
    }
    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        // Usuario autenticado
        const usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Usuario no exite en DB'
            });
        }

        // Verificar usuario estado: tru
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido, estado del usuario: false'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
    
}

module.exports = {
    validarJWT
}