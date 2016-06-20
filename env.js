module.exports = {
    "development" : {
        "mode": process.env.MODE || "pi",
        "content_root": process.env.LIBERRY_ROOT + "/content",
        "code_root": process.env.LIBERRY_ROOT + "/code",
        "sequelize": {
          "username": "root",
          "password": "password",
          "database": "liberry",
          "host": "localhost",
          "storage": process.env.LIBERRY_ROOT + "/database.sqlite",
          "dialect": process.env.MODE == "central" ? "mysql" : "sqlite"
        }
    },
    "production" : {
        "mode": process.env.MODE || "pi",
        "content_root": process.env.LIBERRY_ROOT + "/content",
        "code_root": process.env.LIBERRY_ROOT + "/code",
        "sequelize": {
          "username": "root",
          "password": "password",
          "database": "liberry",
          "host": "localhost",
          "storage": process.env.LIBERRY_ROOT + "/database.sqlite",
          "dialect": process.env.MODE == "central" ? "mysql" : "sqlite"
        }
    }
}
