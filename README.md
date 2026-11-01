# API de Gerenciamento de Pedidos

Projeto prático avaliativo da disciplina **Tópicos Avançados em Sistemas de Informação II**.
API REST para gerenciar pedidos de uma pequena loja, com armazenamento **em memória**.

- **Aluno:** Marcelo Felix da Silva
- **RGM:** [41964179]

## Tecnologias

- Node.js e Express (JavaScript)
- Jest e Supertest (testes automatizados)
- Postman (testes manuais)
- Git e GitHub

## Como instalar e executar

Pré-requisito: Node.js instalado.

```bash
npm install
npm start
```

A API sobe em `http://localhost:3000` (a porta pode ser alterada pela variável de ambiente `PORT`).

## Como rodar os testes automatizados

```bash
npm test
```

## Rotas

| Método | Rota                  | Sucesso | Erros                                              |
|--------|-----------------------|---------|----------------------------------------------------|
| POST   | `/pedidos`            | 201     | 400 dados inválidos                                |
| GET    | `/pedidos`            | 200     | —                                                  |
| GET    | `/pedidos/:id`        | 200     | 404 pedido inexistente                             |
| PATCH  | `/pedidos/:id/status` | 200     | 400 status ou transição inválidos; 404 inexistente |

Rotas que não existem retornam 404 em JSON. Erros inesperados retornam **500** com mensagem genérica (nunca como se fossem erro de validação).

### Exemplo: criar pedido

```http
POST /pedidos
Content-Type: application/json

{
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal"
}
```

Resposta `201 Created`:

```json
{
  "id": 1,
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal",
  "status": "recebido"
}
```

### Exemplo: erro de validação

Resposta `400 Bad Request`:

```json
{ "erro": "O campo 'cliente' é obrigatório e não pode ser vazio." }
```

### Exemplo: atualizar status

```http
PATCH /pedidos/1/status
Content-Type: application/json

{ "status": "em_preparacao" }
```

## Regras de validação

| Campo        | Regra                                                                          |
|--------------|--------------------------------------------------------------------------------|
| `cliente`    | texto obrigatório; vazio ou só espaços é rejeitado; espaços das pontas são removidos |
| `valor`      | número (tipo JSON number) maior que zero; texto como `"350"` é rejeitado       |
| `tipo`       | `entrega` ou `retirada` (em minúsculas)                                        |
| `prioridade` | `baixa`, `normal` ou `alta` (em minúsculas)                                    |
| `id` na URL  | qualquer id que não exista (inclusive não numérico, como `abc`) retorna 404    |

### Status e transições permitidas

Todo pedido é criado com status `recebido`.

| Status atual    | Pode mudar para              |
|-----------------|------------------------------|
| `recebido`      | `em_preparacao`, `cancelado` |
| `em_preparacao` | `enviado`, `cancelado`       |
| `enviado`       | `entregue`                   |
| `entregue`      | — (status final)             |
| `cancelado`     | — (status final)             |

Decisões adotadas:

- Transição não permitida (por exemplo `recebido` → `entregue`) retorna **400** com mensagem explicando as opções.
- Se o ID não existe e o status é inválido ao mesmo tempo, vale o **404** (o pedido é procurado primeiro).

## Arquitetura

Arquitetura em camadas, em que cada arquivo tem uma responsabilidade:

```
src/
├── index.js                      # sobe o servidor (app.listen)
├── app.js                        # configura o Express, as rotas e o tratamento de erros
├── routes/pedidoRoutes.js        # liga método + URL ao controller
├── controllers/pedidoController.js  # camada HTTP: lê a requisição e devolve resposta + status
└── services/pedidoService.js     # regras de negócio, validações e dados em memória
tests/pedidos.test.js             # testes Jest + Supertest
evidencias/                       # prints do Postman
```

Fluxo: **routes → controller → service**. O service lança erros com o código HTTP adequado (400 ou 404). O controller converte em resposta JSON; erros sem código viram 500.

Padrão: arquitetura em camadas (Routes → Controller → Service), com separação entre `app.js` (aplicação) e `index.js` (execução), o que permite testar a API sem subir o servidor.

## Testes

- **Automatizados:** `tests/pedidos.test.js` cobre os quatro endpoints, validações (400), inexistentes (404), transições de status e erro inesperado (500).
- **Manuais:** prints do Postman na pasta `evidencias/` (01 a 05).

## Uso de IA

> **[SEU NOME], edite esta seção para refletir exatamente o que você fez. Ela precisa ser verdadeira.**

- **Utilizei IA?** Sim ([EXEMPLO: Claude, da Anthropic]).
- **Para quais tarefas?** [EXEMPLO: revisar o código, sugerir validações de tipo/prioridade, escrever os testes Jest e completar o README.]
- **Sugestão aceita:** [EXEMPLO: separar `app.js` de `index.js` para conseguir testar com Supertest. Aceitei porque sem isso os testes subiriam o servidor.]
- **Sugestão modificada:** [EXEMPLO: descreva algo que você alterou, como os valores aceitos de `tipo` ou as regras de transição, e por quê.]
- **Sugestão rejeitada (se houver):** [EXEMPLO: descreva algo que você não usou e a justificativa.]
- **Como validei:** rodei `npm test`, repeti os testes no Postman e li o código de cada camada para entender o que ela faz.
