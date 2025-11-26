const express = require("express");

const routes = require("./routes");

const app = express(); // instância do express

// Request -> Middlewares -> Controller -> Response
// Middleware:
// pra manipular as propriedades dos objs request e response (pode ser pra tudo ou pra uma rota específica)
// pra controlar o lifecycle da request, se deve ou não continuar pro controller (como pra autenticação)

// Middleares são executados na sequência em que declara (se parar a execução, não deixa levar pros próximos)
// app.use((request, response) => {
//     request.appId = "MeuAppID";
//     response.send("Interceptado pelo middleware");
// });

app.use(express.json()); // middleware pra ter a propriedade body no obj request, necessário no POST
app.use(routes); // express entende as rotas como middlewares também, por isso o .use

// app.get("/", (request, response) => {
//     response.send("Hello world!");
// });

app.listen(3000, () => console.log("Server started at http://localhost:3000"));
