let users = require("../mocks/users");

module.exports = {
    listUsers(request, response) {
        const { order } = request.query;

        const sortedUsers = users.sort((a, b) => {
            if (order === "desc") {
                return a.id < b.id ? 1 : -1;
            }

            return a.id > b.id ? 1 : -1;
        });

        response.send(200, sortedUsers);
        // response.writeHead(200, { "Content-Type": "application/json" });
        // response.end(JSON.stringify(sortedUsers)); // tem que passar sempre no formato de string
    },
    getUserById(request, response) {
        const { id } = request.params;

        const user = users.find((user) => user.id === Number(id));

        if (!user) {
            return response.send(400, { error: "User not found" });
            // response.writeHead(400, { "Content-Type": "application/json" });
            // response.end(JSON.stringify({ error: "User not found" }));
        }
        response.send(200, user);
        // response.writeHead(200, { "Content-Type": "application/json" });
        // response.end(JSON.stringify(user));
    },

    createUser(request, response) {
        const { body } = request;
        const lastUserId = users[users.length - 1].id;
        const newUser = {
            id: lastUserId + 1,
            name: body.name,
        };

        users.push(newUser);

        response.send(200, newUser);
    },
    updateUser(request, response) {
        // pegar o id
        // pegar o body
        // procurar o id nos dados
        // alterar os dados
        // responder 200

        let { id } = request.params;
        const { name } = request.body;

        id = Number(id);

        const userExists = users.find((user) => user.id === id);

        if (!userExists) {
            return response.send(400, { error: "User not found" });
        }

        users = users.map((user) => {
            if (user.id === id) {
                return {
                    ...user,
                    name,
                };
            }
            return user;
        });

        response.send(200, { id, name });
    },
    deleteUser(request, response) {
        let { id } = request.params;
        id = Number(id);

        users = users.filter((user) => user.id !== id);

        response.send(200, { deleted: true });
    },
};
