const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El role ${ rol } no está registrado en la DB`);
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${ correo } ya está registrado en la DB`);
    }
}

const existeusuarioPorid = async ( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`No existe un usuario con id ${ id }`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeusuarioPorid
}