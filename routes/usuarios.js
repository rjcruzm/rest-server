const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeusuarioPorid } = require('../helpers/db-validators');

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password tiene que ser de minimo 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un role válido').isIn('ADMIN', 'USER'),
    // El role es enviado como parametro de la funcion esRoleValido
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeusuarioPorid ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeusuarioPorid ),
    validarCampos
],usuariosDelete);

module.exports = router;