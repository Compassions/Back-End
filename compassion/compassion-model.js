const db = require("../db/db-config.js");

function findBy(filter) {
    return db("compassion").where(filter).orderBy("id");
};

// function findById(id) {
//     return db("compassion").where({id}).first();
// };

function findById(id) {
    return db("compassion").leftJoin("comment", "compassion.id", "=", "comment.compassionID").select("*").where({id})
};

function create(compassion) {
    return db("compassion").insert(compassion).returning(['id', 'title']);
};

function update(updates, id){
    return db("compassion").where({id}).update(updates);
}

function remove(id) {
    return db("compassion").where({id}).delete();
};

function likes(userID, compassionID) {
    return db("like").where({userID, compassionID}).insert()
}

module.exports = {
    create,
    update,
    remove,
    findBy,
    findById
};