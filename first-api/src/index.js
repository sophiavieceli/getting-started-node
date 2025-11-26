const http = require("http");

const { URL } = require("url");

const bodyParser = require("./helpers/bodyParser");
const routes = require("./routes");

const server = http.createServer((request, response) => {
    // const parsedUrl = url.parse(request.url, true); // depreciado

    /* PARSE DA URL PRA EXTRAIR OS QUERY PARAMS DEPOIS */
    const parsedUrl = new URL(`http://localhost:3000${request.url}`);
    console.log(parsedUrl);
    console.log(
        `Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`
    );
    /* --------------- */

    let { pathname } = parsedUrl;
    let id = null;

    /* SPLIT PRA IDENTIFICAR QUANDO TÁ MANDANDO UM ID */
    const splitEndpoint = pathname.split("/").filter(Boolean); // filter pra remover valores falsy (a string vazia no começo do array do split)
    console.log(splitEndpoint);

    if (splitEndpoint.length > 1) {
        pathname = `/${splitEndpoint[0]}/:id`;
        id = splitEndpoint[1];
    }

    const route = routes.find(
        (routeObj) =>
            routeObj.endpoint === pathname && routeObj.method === request.method
    );
    // console.log(route);

    if (route) {
        /* INJETANDO OS QUERY PARAMS NA PROPRIEDADE QUERY DO REQUEST */
        // searchParams vem no formato de iterable
        request.query = Object.fromEntries(parsedUrl.searchParams);
        // request.query = parsedUrl.query;
        /* -------------------- */

        /* INJETANDO O ID NA PROPRIEDADE PARAMS, QUE É UM OBJETO */
        request.params = { id };
        /* -------------------- */

        /* CRIAÇÃO DO MÉTODO SEND PRA FACILITAR */
        response.send = (statusCode, body) => {
            response.writeHead(statusCode, {
                "Content-Type": "application/json",
            });
            response.end(JSON.stringify(body));
        };
        /* -------------------- */

        if (["POST", "PUT", "PATCH"].includes(request.method)) {
            bodyParser(request, () => route.handler(request, response));
        } else {
            route.handler(request, response);
        }
    } else {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
    }

    // if (request.url === "/users" && request.method === "GET") {
    //     // response.writeHead(200, { "Content-Type": "application/json" });
    //     // response.end(JSON.stringify(users)); // tem que passar sempre no formato de string

    //     UserController.listUsers(request, response);
    // } else {
    //     response.writeHead(404, { "Content-Type": "text/html" });
    //     response.end(`Cannot ${request.method} ${request.url}`);
    // }
});

server.listen(3000, () =>
    console.log("Server started at http://localhost:3000")
);
