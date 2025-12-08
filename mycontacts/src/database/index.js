const { Client } = require("pg");

const client = new Client({
    host: "localhost",
    port: 5432, // porta do host
    user: "root", // definido do docker run
    password: "root", // definido do docker run
    database: "mycontacts", // definido do CREATE DATABASE
});

client.connect();

exports.query = async (query, values) => {
    const { rows } = await client.query(query, values);
    return rows;
};

// client.query("SELECT * FROM contacts").then(console.log); // aqui funciona sem ;
// mesma coisa que then(result => console.log(result));
