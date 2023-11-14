/*
    Medicos
    ruta: '/api/medico'
*/
const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middleware/validar-campos');

const { validarJWT } = require('../middleware/validar-jwt');

const {getMedicos, crearMedicos, actualizarMedicos, borrarMedicos} = require('../controllers/medicos');

const router = Router()

router.get('/', validarJWT, getMedicos);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos
], crearMedicos);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos
], actualizarMedicos);

router.delete('/:id', borrarMedicos);

module.exports = router;
