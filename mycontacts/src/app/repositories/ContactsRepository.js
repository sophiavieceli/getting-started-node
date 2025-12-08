// let uuid;

// (async () => {
//     const { v4 } = await import("uuid");
//     uuid = v4;
// })();

const db = require("../../database"); // index.js não precisa dizer

// let contacts = [
//     {
//         id: () => uuid(),
//         name: "Sophia",
//         email: "sophia@gmail.com",
//         phone: "5100000000",
//         category_id: () => uuid(),
//     },
//     {
//         id: () => uuid(),
//         name: "Erik",
//         email: "erik@gmail.com",
//         phone: "5100000001",
//         category_id: () => uuid(),
//     },
// ];

class ContactsRepository {
    // padronização nos nomes dos métodos entre os diferentes repositórios (mas pode ter métodos mais personalizados)
    // findAll() {
    //     return contacts;
    // }

    // findAll() {
    // return new Promise((resolve) =>
    //     // já deixando tudo assíncrono pra quando migrar pro banco de dados
    //     // resolve pra disparar sucesso, reject pra erro - conteúdo do return dentro do resolve
    //     // nunca vai usar o reject nos repositories, porque a função deles é só acessar o data source - quem trata o erro é o controller
    //     // sem as chaves, é um return implícito - nesse caso funcionaria, mas é um lembrete de que não dá pra acessar valores retornados de funções executoras de promises (sem resolve)
    //     {
    //         resolve(
    //             contacts.map((c) => ({
    //                 ...c,
    //                 id: typeof c.id === "function" ? c.id() : c.id,
    //                 category_id:
    //                     typeof c.category_id === "function"
    //                         ? c.category_id()
    //                         : c.category_id,
    //             }))
    //         );
    //     }
    // );
    // }

    async findAll(orderBy = "ASC") {
        const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC"; // pro ORDER BY não dá pra usar $1 e array, então precisa disso pra permitir só esses valores
        const rows = await db.query(`
            SELECT contacts.*, categories.name AS category_name
            FROM contacts
            LEFT JOIN categories ON categories.id = contacts.category_id
            ORDER BY contacts.name ${direction}`);
        // só precisa indicar a tabela antes da coluna quando tem a coluna em mais de uma tabela envolvida, como id e name
        // contacts.* pras colunas de categories não sobrescreverem as de contacts com o mesmo nome (e outras colunas que poderiam existir não aparecerem no select)
        return rows;
    }

    // findById(id) {
    //     // return new Promise((resolve) => {
    //     //     resolve(
    //     //         contacts.find(contact => contact.id === id)
    //     //     );
    //     // });

    //     return new Promise((resolve) => {
    //         const parsedContacts = contacts.map((c) => ({
    //             ...c,
    //             id: typeof c.id === "function" ? c.id() : c.id,
    //             category_id:
    //                 typeof c.category_id === "function"
    //                     ? c.category_id()
    //                     : c.category_id,
    //         }));

    //         resolve(parsedContacts.find((c) => c.id === id));
    //     });
    // }

    async findById(id) {
        const [row] = await db.query(
            `
                SELECT contacts.*, categories.name AS category_name
                FROM contacts
                LEFT JOIN categories ON categories.id = contacts.category_id
                WHERE contacts.id = $1`,
            [id]
        );
        return row;
    }

    // findByEmail(email) {
    //     return new Promise((resolve) => {
    //         resolve(contacts.find((c) => c.email === email));
    //     });
    // }

    async findByEmail(email) {
        const [row] = await db.query(
            "SELECT * FROM contacts WHERE email = $1",
            [email]
        );
        return row;
    }

    // create({ name, email, phone, category_id }) {
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

    //     contacts.push(newContact);
    //     resolve(newContact);
    // });
    // }

    async create({ name, email, phone, category_id }) {
        // função async automaticamente retorna uma promise, então não precisa usar return new Promise
        // const row = await db.query(`
        //     INSERT INTO contacts(name, email, phone, category_id)
        //     VALUES('${name}', '${email}', '${phone}', '${category_id}')
        // `);
        const [row] = await db.query(
            `
            INSERT INTO contacts(name, email, phone, category_id)
            VALUES($1, $2, $3, $4)
            RETURNING *
        `,
            [name, email, phone, category_id] // prevenindo SQL Injection - assim, client.query faz o tratamento - fazer isso sempre que tiver variável na query/o valor vier do usuário
        );
        // RETURNING * é pra retornar todas as colunas

        return row;
    }

    // update(id, { name, email, phone, category_id }) {
    //     return new Promise((resolve) => {
    //         const updatedContact = {
    //             id,
    //             name,
    //             email,
    //             phone,
    //             category_id,
    //         };

    //         contacts = contacts.map((contact) =>
    //             contact.id === id ? updatedContact : contact
    //         );

    //         resolve(updatedContact);
    //     });

    //     // return new Promise((resolve) => {
    //     //     let newContact = {
    //     //         id: () => uuid(),
    //     //         name,
    //     //         email,
    //     //         phone,
    //     //         category_id,
    //     //     };

    //     //     newContact = {
    //     //         ...newContact,
    //     //         id:
    //     //             typeof newContact.id === "function"
    //     //                 ? newContact.id()
    //     //                 : newContact.id,
    //     //         category_id:
    //     //             typeof newContact.category_id === "function"
    //     //                 ? newContact.category_id()
    //     //                 : newContact.category_id,
    //     //     };
    //     // });
    // }

    async update(id, { name, email, phone, category_id }) {
        const [row] = await db.query(
            `
            UPDATE contacts
            SET name = $1, email = $2, phone = $3, category_id = $4
            WHERE id = $5
            RETURNING *
        `,
            [name, email, phone, category_id, id]
        );
        return row;
    }

    // delete(id) {
    //     return new Promise((resolve) => {
    //         const parsedContacts = contacts.map((c) => ({
    //             ...c,
    //             id: typeof c.id === "function" ? c.id() : c.id,
    //             category_id:
    //                 typeof c.category_id === "function"
    //                     ? c.category_id()
    //                     : c.category_id,
    //         }));

    //         contacts = parsedContacts.filter((contact) => contact.id !== id);

    //         resolve(); // não passa nada porque não tá armazenando o resultado no ContactController
    //     });
    // }

    async delete(id) {
        const deleteOp = await db.query("DELETE FROM contacts WHERE id = $1", [
            id,
        ]);
        // sem desestruturar row porque delete nunca retorna a linha encontrada
        return deleteOp;
    }
}

module.exports = new ContactsRepository();
// export default new ContactsRepository();
