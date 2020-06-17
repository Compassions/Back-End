
exports.up = function(knex) {
  return knex.schema
    .createTable("user", tbl => {
        tbl.increments("id")
        tbl.varchar("username", 128).notNullable().unique()
        tbl.varchar("password", 128).notNullable()
        tbl.string("firstName").notNullable()
        tbl.string("lastName").notNullable()
        tbl.string("email").notNullable().unique()
        tbl.binary("profilePhoto")
        tbl.varchar("biography")
        tbl.timestamp("createdDate").defaultTo(knex.fn.now())
    })
    .createTable("follow", tbl => {
        tbl.integer("followersID").notNullable().unsigned().references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE")
        tbl.integer("followeesID").notNullable().unsigned().references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE")
        tbl.primary(["followersID", "followeesID"])

    })
    .createTable("compassion", tbl => {
        tbl.increments("id")
        tbl.integer("userID").notNullable().unsigned().references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE")
        tbl.varchar("title", 50).notNullable()
        tbl.varchar("story", 200).notNullable()
        tbl.binary("photo")
        tbl.boolean("private")
        tbl.datetime("createdDate").defaultTo(knex.fn.now())
    })
    .createTable("like", tbl => {
        tbl.integer("userID").notNullable().unsigned().references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE")
        tbl.integer("compassionID").notNullable().unsigned().references("id").inTable("compassion").onDelete("CASCADE").onUpdate("CASCADE")
        tbl.datetime("createdDate").defaultTo(knex.fn.now())
        tbl.primary(["userID", "compassionID"])
    })
    .createTable("comment", tbl => {
        tbl.varchar("comment").notNullable()
        tbl.integer("CommentUserID").notNullable().unsigned().references("id").inTable("user").onDelete("CASCADE").onUpdate("CASCADE")
        tbl.integer("compassionID").notNullable().unsigned().references("id").inTable("compassion").onDelete("CASCADE").onUpdate("CASCADE")
        tbl.datetime("createdDate").defaultTo(knex.fn.now())
        tbl.primary(["CommentUserID", "compassionID"])
    })
    
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("like")
    .dropTableIfExists("comment")
    .dropTableIfExists("compassion")
    .dropTableIfExists("follow")
    .dropTableIfExists("user")
};
