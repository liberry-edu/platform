module.exports = {
    "development" : {
        "host": process.env.HOST || "loclhost",
        "port": process.env.PORT || 8080,
        "mode": process.env.MODE || "pi",
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
    },
    "production" : {
        "host": process.env.HOST || "loclhost",
        "port": process.env.PORT || 8080,
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
