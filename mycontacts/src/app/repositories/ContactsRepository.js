// const { uuid } = require("uuidv4");
// import { uuid } from "uuid";

let uuid;

(async () => {
    const { v4 } = await import("uuid");
    uuid = v4;
})();

let contacts = [
    {
        id: () => uuid(),
        // id: "ee591024-167e-4e78-9471-d36444f668c3",
        name: "Sophia",
        email: "sophia@gmail.com",
        phone: "5100000000",
        category_id: () => uuid(),
    },
    {
        id: () => uuid(),
        name: "Erik",
        email: "erik@gmail.com",
        phone: "5100000001",
        category_id: () => uuid(),
    },
];

class ContactsRepository {
    // padronização nos nomes dos métodos entre os diferentes repositórios (mas pode ter métodos mais personalizados)
    // findAll() {
    //     return contacts;
    // }

    findAll() {
        // map necessário pro uuid funcionar com commonjs
        // return contacts.map((c) => ({
        //     ...c,
        //     id: c.id(),
        //     category_id: c.category_id(),
        // }));

        return new Promise((resolve) =>
            // já deixando tudo assíncrono pra quando migrar pro banco de dados
            // resolve pra disparar sucesso, reject pra erro - conteúdo do return dentro do resolve
            // nunca vai usar o reject nos repositories, porque a função deles é só acessar o data source - quem trata o erro é o controller
            // sem as chaves, é um return implícito - nesse caso funcionaria, mas é um lembrete de que não dá pra acessar valores retornados de funções executoras de promises (sem resolve)
            {
                resolve(
                    contacts.map((c) => ({
                        ...c,
                        id: typeof c.id === "function" ? c.id() : c.id,
                        category_id:
                            typeof c.category_id === "function"
                                ? c.category_id()
                                : c.category_id,
                    }))
                );
            }
        );
    }

    findById(id) {
        // return new Promise((resolve) => {
        //     resolve(
        //         contacts.find(contact => contact.id === id)
        //     );
        // });

        return new Promise((resolve) => {
            const parsedContacts = contacts.map((c) => ({
                ...c,
                id: typeof c.id === "function" ? c.id() : c.id,
                category_id:
                    typeof c.category_id === "function"
                        ? c.category_id()
                        : c.category_id,
            }));

            resolve(parsedContacts.find((c) => c.id === id));
        });
    }

    findByEmail(email) {
        return new Promise((resolve) => {
            resolve(contacts.find((c) => c.email === email));
        });
    }

    delete(id) {
        return new Promise((resolve) => {
            const parsedContacts = contacts.map((c) => ({
                ...c,
                id: typeof c.id === "function" ? c.id() : c.id,
                category_id:
                    typeof c.category_id === "function"
                        ? c.category_id()
                        : c.category_id,
            }));

            contacts = parsedContacts.filter((contact) => contact.id !== id);

            resolve(); // não passa nada porque não tá armazenando o resultado no ContactController
        });
    }

    create({ name, email, phone, category_id }) {
        return new Promise((resolve) => {
            let newContact = {
                id: () => uuid(),
                name,
                email,
                phone,
                category_id,
            };

            newContact = {
                ...newContact,
                id:
                    typeof newContact.id === "function"
                        ? newContact.id()
                        : newContact.id,
                category_id:
                    typeof newContact.category_id === "function"
                        ? newContact.category_id()
                        : newContact.category_id,
            };

            contacts.push(newContact);
            resolve(newContact);
        });
    }

    update(id, { name, email, phone, category_id }) {
        return new Promise((resolve) => {
            const updatedContact = {
                id,
                name,
                email,
                phone,
                category_id,
            };

            contacts = contacts.map((contact) =>
                contact.id === id ? updatedContact : contact
            );

            resolve(updatedContact);
        });

        // return new Promise((resolve) => {
        //     let newContact = {
        //         id: () => uuid(),
        //         name,
        //         email,
        //         phone,
        //         category_id,
        //     };

        //     newContact = {
        //         ...newContact,
        //         id:
        //             typeof newContact.id === "function"
        //                 ? newContact.id()
        //                 : newContact.id,
        //         category_id:
        //             typeof newContact.category_id === "function"
        //                 ? newContact.category_id()
        //                 : newContact.category_id,
        //     };
        // });
    }
}

module.exports = new ContactsRepository();
// export default new ContactsRepository();
