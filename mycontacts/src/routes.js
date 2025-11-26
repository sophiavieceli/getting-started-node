const { Router } = require("express");

const ContactController = require("./app/controllers/ContactController");

const router = Router();

// se quiser o middleware pra uma rota específica (pra tudo, poderia ficar no index.js):
// router.use((request, response) => {
//     request.appId = "MeuAppID";
//     response.send("Interceptado pelo middleware");
// });

// router.get("/contacts", ContactController.index);
router.get(
    "/contacts",
    // middleware pra só uma rota (se for pra mais de uma, pode colocar as rotas que não se aplicam antes e as que se aplicam depois (ordem de execução)):
    (request, response, next) => {
        request.appId = "MeuAppID";
        // response.send("Interceptado pelo middleware");
        next();
    },
    ContactController.index
);
router.get("/contacts/:id", ContactController.show);
router.delete("/contacts/:id", ContactController.delete);
router.post("/contacts/", ContactController.store);

module.exports = router;
