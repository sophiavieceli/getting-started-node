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
app.use((error, request, response, next) => {
    console.log("##### Error Handler");
    console.log(error);
    response.sendStatus(500);
});
// se um middleware recebe esses 4 argumentos, é um error handler
// assim não aparece o stack trace e o tipo de erro pro usuário, só o código 500
// stack trace continua aparecendo no console do servidor
// problema de usar try/catch é que tem que repetir muito código
// Error Handler (middleware especial do express) - se tiver um erro não tratado (fora de try/catch) em um controller, ele captura e passa pro Error Handler
// precisa vir depois do middleware das rotas
// a partir do express 5, não faz diferença o método ser async (pro try/catch não) - não precisa instalar express-async-errors

// app.get("/", (request, response) => {
//     response.send("Hello world!");
// });

app.listen(3000, () => console.log("Server started at http://localhost:3000"));
