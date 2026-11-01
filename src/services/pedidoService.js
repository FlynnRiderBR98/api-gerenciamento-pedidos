let pedidos = [];
let nextId = 1;

// Valores aceitos (documentados no README)
const tiposValidos = ["entrega", "retirada"];
const prioridadesValidas = ["baixa", "normal", "alta"];
const estadosValidos = ["recebido", "em_preparacao", "enviado", "entregue", "cancelado"];

// Transições permitidas: status atual -> próximos status possíveis
const transicoes = {
  recebido: ["em_preparacao", "cancelado"],
  em_preparacao: ["enviado", "cancelado"],
  enviado: ["entregue"],
  entregue: [],
  cancelado: []
};

// Cria um erro "esperado" já com o código HTTP que o controller deve devolver
function criarErro(mensagem, status) {
  const error = new Error(mensagem);
  error.status = status;
  return error;
}

const pedidoService = {
  cadastrar(data) {
    const { cliente, tipo, valor, prioridade } = data || {};

    // Cliente: texto obrigatório, não vazio (nem só espaços)
    if (typeof cliente !== 'string' || cliente.trim() === '') {
      throw criarErro("O campo 'cliente' é obrigatório e não pode ser vazio.", 400);
    }

    // Valor: número finito e maior que zero
    if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
      throw criarErro("O campo 'valor' deve ser numérico e maior que zero.", 400);
    }

    // Tipo e prioridade: precisam ser valores reconhecidos
    if (!tiposValidos.includes(tipo)) {
      throw criarErro(`O campo 'tipo' é inválido. Valores aceitos: ${tiposValidos.join(', ')}.`, 400);
    }

    if (!prioridadesValidas.includes(prioridade)) {
      throw criarErro(`O campo 'prioridade' é inválido. Valores aceitos: ${prioridadesValidas.join(', ')}.`, 400);
    }

    const novoPedido = {
      id: nextId++,
      cliente: cliente.trim(),
      tipo,
      valor,
      prioridade,
      status: "recebido"
    };

    pedidos.push(novoPedido);
    return novoPedido;
  },

  listar() {
    return pedidos;
  },

  buscarPorId(id) {
    const pedido = pedidos.find(p => p.id === Number(id));
    if (!pedido) {
      throw criarErro("Pedido não encontrado.", 404);
    }
    return pedido;
  },

  atualizarStatus(id, novoStatus) {
    // 1º: o pedido existe? (se não, 404)
    const pedido = this.buscarPorId(id);

    // 2º: o status enviado é válido? (se não, 400)
    if (!novoStatus || !estadosValidos.includes(novoStatus)) {
      throw criarErro(`Status inválido. Estados permitidos: ${estadosValidos.join(', ')}`, 400);
    }

    // 3º: a transição é permitida? (se não, 400)
    if (!transicoes[pedido.status].includes(novoStatus)) {
      const permitidos = transicoes[pedido.status];
      const dica = permitidos.length > 0
        ? `Transições permitidas: ${permitidos.join(', ')}.`
        : 'Este status é final e não pode mais ser alterado.';
      throw criarErro(`Não é possível mudar de '${pedido.status}' para '${novoStatus}'. ${dica}`, 400);
    }

    pedido.status = novoStatus;
    return pedido;
  },

  // Usado apenas nos testes, para zerar os dados em memória
  resetar() {
    pedidos = [];
    nextId = 1;
  }
};

module.exports = pedidoService;
