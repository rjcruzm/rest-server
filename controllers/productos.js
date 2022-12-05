const { response } = require('express');
const { Producto, Categoria } = require('../models');

// Obtener productos paginado - populate
const productosGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);

    res.json({
        total,
        productos
    });
}

// Obtener producto - populate
const productoGet =  async(req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    if ( !producto || !producto.estado ) {
        return res.status(400).json({
            msg: `El producto con id ${ id } no existe`
        });
    }

    res.status(200).json(producto);
}


const crearProducto = async( req, res = response ) => {
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const productoDB = await Producto.findOne({ nombre: data.nombre });
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ data.nombre } ya existe`
        });
    }

    const producto = new Producto( data );
    await producto.save();
    res.status(201).json(producto);
}

// Actualizar categoria
const productosPut = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if ( data.nombre) {
        data.nombre = data.nombre.toUpperCase();

        const productoDB = await Producto.findOne({ nombre: data.nombre });

        if ( productoDB ) {
            return res.status(400).json({
                msg: `El producto ${ data.nombre } ya existe`
            });
        }
    }

    if ( data.categoria ) {
        try {
            const categoriaDB = await Categoria.findById( data.categoria );
            if ( !categoriaDB ) {
                return res.status(400).json({
                    msg: `La categoria ${ data.categoria } no existe`
                });
            }
        } catch ( error ) {
            return res.status(400).json({
                msg: 'No es un ID válido'
            });
        }
    }

    data.usuario = req.usuario._id;
    
    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.status(200).json(producto);
}

// Borrar categoria
const productosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrado logico
    const producto = await Producto.findByIdAndUpdate( id, { estado: false });


    res.json(producto);
}

module.exports = {
    productoGet,
    productosGet,
    crearProducto,
    productosPut,
    productosDelete
}