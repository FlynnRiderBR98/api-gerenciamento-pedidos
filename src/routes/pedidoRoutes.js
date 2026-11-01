const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/pedidos', pedidoController.criar);
router.get('/pedidos', pedidoController.listar);
router.get('/pedidos/:id', pedidoController.buscarPorId);
router.patch('/pedidos/:id/status', pedidoController.atualizarStatus);

module.exports = router;