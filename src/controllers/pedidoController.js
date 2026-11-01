const pedidoService = require('../services/pedidoService');

// Erros "esperados" (validação, não encontrado) trazem error.status.
// Qualquer outro erro é inesperado: vira 500 com mensagem genérica.
function responderErro(res, error) {
  if (error.status) {
    return res.status(error.status).json({ erro: error.message });
  }
  console.error(error);
  return res.status(500).json({ erro: "Erro interno no servidor." });
}

const pedidoController = {
  criar(req, res) {
    try {
      const novoPedido = pedidoService.cadastrar(req.body || {});
      return res.status(201).json(novoPedido);
    } catch (error) {
      return responderErro(res, error);
    }
  },

  listar(req, res) {
    try {
      const lista = pedidoService.listar();
      return res.status(200).json(lista);
    } catch (error) {
      return responderErro(res, error);
    }
  },

  buscarPorId(req, res) {
    try {
      const pedido = pedidoService.buscarPorId(req.params.id);
      return res.status(200).json(pedido);
    } catch (error) {
      return responderErro(res, error);
    }
  },

  atualizarStatus(req, res) {
    try {
      const { status } = req.body || {};
      const pedidoAtualizado = pedidoService.atualizarStatus(req.params.id, status);
      return res.status(200).json(pedidoAtualizado);
    } catch (error) {
      return responderErro(res, error);
    }
  }
};

module.exports = pedidoController;
