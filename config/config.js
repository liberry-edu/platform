const env = require('../env.js')

module.exports = {
    "production": env.production.sequelize,
    "development": env.development.sequelize
}
