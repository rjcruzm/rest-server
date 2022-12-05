const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearProducto,
    productoGet,
    productosGet,
    productosPut,
    productosDelete
} = require('../controllers/productos');
const {
    existeProductoPorid,
    existeCategoriaPorid
} = require('../helpers/db-validators');
const {
    validarJWT,
    validarCampos,
    esAdminRole
} = require('../middlewares');

const router = Router();


// Obtener todos los productos - Publico
router.get('/', productosGet);

// obtener un producto por ID - Publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorid ),
    validarCampos
], productoGet);


// Crear producto - Privado cualquier usuario con token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorid ),
    validarCampos
], crearProducto);


// Actualizar producto por ID - privado cualquier usuario con token
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorid ),
    validarCampos
], productosPut);


// Borrar producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorid ),
    validarCampos
], productosDelete);


module.exports = router;