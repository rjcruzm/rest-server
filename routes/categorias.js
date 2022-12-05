const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearCategoria,
    categoriaGet,
    categoriasGet,
    categoriasPut,
    categoriasDelete
} = require('../controllers/categorias');
const { existeCategoriaPorid } = require('../helpers/db-validators');
const {
    validarJWT,
    validarCampos,
    esAdminRole
} = require('../middlewares');

const router = Router();


// Obtener todas las categorias - Publico
router.get('/', categoriasGet);

// obtener una categoria por ID - Publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorid ),
    validarCampos
], categoriaGet);


// Crear categoria - Privado cualquier usuario con token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


// Actualizar categoria por ID - privado cualquier usuario con token
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorid ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriasPut);


// Borrar categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorid ),
    validarCampos
], categoriasDelete);


module.exports = router;