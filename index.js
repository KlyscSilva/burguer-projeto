const express = require("express");
const app = express();
const port = 3010;
app.use(express.json());
const uuid = require("uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("src"));

// Variavel para armazenar em array novo pedidos, metodo utilizado apenas para fins de estudos.
const orders = [];

// Middleware
const checkOrders = (req, res, next) => {
  const { id } = req.params;

  const index = orders.findIndex((orders) => orders.id === id);

  if (index < 0) {
    return res.status(404).json({ mensagem: "Pedido não localizado" });
  }

  req.userIndex = index;
  req.userId = id;

  next();
};

// Tela pra realizar pedido
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

// Rota que vai nos fornecer todos os pedidos realizados
app.get("/orders", (req, res) => {
  return res.json(orders);
});

// Criando a rota para cadastro dos pedidos
app.post("/order", (req, res) => {
  const { pedido, cliente, valor, status } = req.body;
  const order = { id: uuid.v4(), pedido, cliente, valor, status };

  orders.push(order);
  order.valor = `R$${valor}`;
  order.status = "Em preparação";
  return res.status(200).send("Pedido cadastrado com sucesso!");
});

// Criando rota para editar os pedidos
app.put("/order/:id",checkOrders, (req, res) => {
  const index = req.userIndex;
  const id = req.userId;
  const { pedido, cliente, valor, status } = req.body;

  const updateOrders = { id, pedido, cliente, valor, status };

  orders[index] = updateOrders;

  return res
    .json(updateOrders)
    .send("Pedido atualizado com sucesso!")
    .status(200);
});

// Rota que deleta um pedido
app.delete("/order/:id", checkOrders, (req, res) => {
  const index = req.userIndex;

  orders.splice(index, 1);

  return res.status(240).send("Pedido excluido com sucesso");
});

// Verificando status de um pedido
app.patch("/orders/:id", (req, res) => {
  const { id } = req.params; // obter o ID da solicitação
  const order = orders.find((order) => order.id === id); // buscar o pedido correspondente com base no ID

  if (!order) {
    // se o pedido não for encontrado, retornar um erro 404
    return res.status(404).json({ message: "Pedido não encontrado" });
  }

  order.status = "Pronto"; // atualizar o status do pedido para "Pronto"

  return res.json(order); // retornar o pedido atualizado como resposta
});












app.listen(port, () => {
  console.log(`✅ Servidor funcionando na porta ${port}✅`);
});
