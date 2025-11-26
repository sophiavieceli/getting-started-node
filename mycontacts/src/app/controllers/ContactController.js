const ContactsRepository = require("../repositories/ContactsRepository.js");

class ContactController {
    // convenção pra nomenclatura de métodos nos controllers
    async index(request, response) {
        // listar todos os registros

        const contacts = await ContactsRepository.findAll();
        // com await, mesmo sendo uma função bloqueante, não tira da call stack - porque só pode finalizar a requisição quando tiver os dados

        response.json(contacts); // .json quando retornar um array ou objeto
        // response.send(request.appId);
    }

    async show(request, response) {
        // obter UM registro

        // response.json(request.params);
        const { id } = request.params;
        const contact = await ContactsRepository.findById(id);

        if (!contact) {
            return response.status(404).json({ error: "Contact not found" });
        }

        response.json(contact);
    }

    async store(request, response) {
        // criar novo registro

        const { name, email, phone, category_id } = request.body; // tem request.body porque chamou app.use(express.json()); no index

        if (!name) {
            return response.status(400).json({ error: "Name is required" });
        }

        const contactExists = await ContactsRepository.findByEmail(email);

        if (contactExists) {
            return response
                .status(400)
                .json({ error: "This e-mail is already taken" });
        }

        const contact = await ContactsRepository.create({
            name,
            email,
            phone,
            category_id,
        });

        response.json(contact);
    }

    update() {
        // editar um registro
    }

    async delete(request, response) {
        // deletar um registro

        const { id } = request.params;
        const contact = await ContactsRepository.findById(id);

        if (!contact) {
            return response.status(404).json({ error: "Contact not found" });
        }

        await ContactsRepository.delete(id);
        // 204: No Content - deu certo mas não tem nenhum corpo, mandando só o status
        response.sendStatus(204);
    }
}

// Singleton: design pattern - só pode ter 1 instância dos objetos na aplicação
// exportando assim, sempre usa a mesma instância - sempre que importa o arquivo, importa com a classe que já gerou em memória
module.exports = new ContactController();
