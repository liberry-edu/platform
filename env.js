module.exports = {
    "development" : {
        "mode": process.env.MODE || "pi",
        "content_root": process.env.LIBERRY_ROOT + "/content",
        "code_root": process.env.LIBERRY_ROOT + "/code",
        "sequelize": {
          "username": "root",
          "password": "password",
          "database": "database",
          "host": "localhost",
          "storage": process.env.LIBERRY_ROOT + "/database_central.sqlite",
          "dialect": "sqlite"
        }
    },
    "production" : {
        "content_root": process.env.LIBERRY_ROOT + "/content",
        "code_root": process.env.LIBERRY_ROOT + "/code",
        "sequelize": {
          "username": "root",
          "password": "password",
          "database": "database",
          "host": "localhost",
          "storage": process.env.LIBERRY_ROOT + "/database.sqlite",
          "dialect": "sqlite"
        }
    }
}
