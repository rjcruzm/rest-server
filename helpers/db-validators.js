const {
    Categoria,
    Producto,
    Role,
    Usuario
} = require('../models');

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

const existeCategoriaPorid = async ( id ) => {
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error(`No existe categoria con id ${ id }`);
    }
}

const existeProductoPorid = async ( id ) => {
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) {
        throw new Error(`No existe producto con id ${ id }`);
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida`);
    }

    return true;
}

module.exports = {
    coleccionesPermitidas,
    esRoleValido,
    emailExiste,
    existeusuarioPorid,
    existeCategoriaPorid,
    existeProductoPorid
}