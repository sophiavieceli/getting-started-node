function bodyParser(request, callback) {
    // a mensagem chega em pedaços
    let body = "";

    request.on("data", (chunk) => {
        body += chunk;
    });

    request.on("end", () => {
        body = JSON.parse(body); // converter string pra obj jSON
        request.body = body; // criando propriedade nova
        callback();
    });
}

module.exports = bodyParser;
