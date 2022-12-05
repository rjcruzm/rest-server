const { response } = require('express');
const { Categoria } = require('../models');

// Obtener categorias paginado - populate
const categoriasGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);

    res.json({
        total,
        categorias
    });
}

// Obtener categoria - populate
const categoriaGet =  async(req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById( id )
        .populate('usuario', 'nombre');

    if ( !categoria || !categoria.estado ) {
        return res.status(400).json({
            msg: `La categoria con id ${ id } no existe`
        });
    }

    res.status(200).json(categoria);
}


const crearCategoria = async( req, res = response ) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ nombre } ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    await categoria.save();
    res.status(201).json(categoria);
}

// Actualizar categoria
const categoriasPut = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoriaDB = await Categoria.findOne({ nombre: data.nombre });
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ data.nombre } ya existe`
        });
    }
    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.status(200).json(categoria);
}

// Borrar categoria
const categoriasDelete = async(req, res = response) => {

    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrado logico
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false });


    res.json(categoria);
}

module.exports = {
    categoriaGet,
    categoriasGet,
    crearCategoria,
    categoriasPut,
    categoriasDelete
}