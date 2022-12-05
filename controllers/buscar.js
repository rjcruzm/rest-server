const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Categoria, Producto, Usuario } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const bucarCategorias = async( termino = '', res = response )=> {
    const esMongoId = ObjectId.isValid(termino);

    if ( esMongoId ) {
        const categoria = await Categoria.findById( termino );
        return res.status(200).json({
            results: categoria ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const query = {
        nombre: regex,
        $and: [{ estado: true }]
    };
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    res.json({
        total,
        results: categorias
    });
}

const bucarProductos = async( termino = '', res = response )=> {
    const esMongoId = ObjectId.isValid(termino);

    if ( esMongoId ) {
        const producto = await (await Producto.findById( termino ))
            .populate('categoria', 'nombre');
        return res.status(200).json({
            results: producto ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const query = {
        nombre: regex,
        $and: [{ estado: true }]
    };
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        results: productos
    });
}

const bucarUsuarios = async( termino = '', res = response )=> {
    const esMongoId = ObjectId.isValid(termino);

    if ( esMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.status(200).json({
            results: usuario ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const query = {
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    };
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        total,
        results: usuarios
    });
}

const buscar = ( req, res = response ) => {
    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        res.status(400).json({
            msg: `La coleccion ${ coleccion } no es válida`
        });
    }

    switch (coleccion) {
        case 'categorias':
            bucarCategorias(termino, res);
        break;
        case 'productos':
            bucarProductos(termino, res);
        break;
        case 'usuarios':
            bucarUsuarios(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Colección permitida, sin busqueda'
            });
    }

}

module.exports = {
    buscar
}