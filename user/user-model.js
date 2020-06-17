const db = require("../db/db-config.js");

function find(){
    return db("user")
    .select("id", "username", "profilePhoto", "biography");
}

function findBy(filter) {
    return db("user").where(filter).orderBy("id")
};

function findById(id) {
    return db("user").where({id}).first();
}

async function create(user) {
    try {
        const [id] = await db("user").insert(user, "id");
        return findById(id);
    }
    catch(err) {
        throw err;
    }
};

function update(updates, id){
    return db("user").where({id}).update(updates);
}

function remove(id) {
    return db("user").where({id}).delete();
};


module.exports = {
    find,
    create,
    findBy,
    findById,
    update,
    remove
};