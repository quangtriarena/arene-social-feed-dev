import { DataTypes } from 'sequelize'
import { Joi } from 'sequelize-joi'
import PostgresSequelize from '../connector/postgres/index.js'

const Model = PostgresSequelize.define('countries', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    schema: Joi.string().trim().required().min(1).max(50),
  },
})

Model.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())

  return values
}

Model.sync()
// Model.sync({ force: true })

export default Model
