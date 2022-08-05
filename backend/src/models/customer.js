import { DataTypes } from 'sequelize'
import { Joi } from 'sequelize-joi'
import PostgresSequelize from '../connector/postgres/index.js'

import CountryModel from './country.js'

const Model = PostgresSequelize.define('customers', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    schema: Joi.string().trim().required().min(1).max(30),
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    schema: Joi.string().trim().required().min(1).max(30),
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    schema: Joi.string().trim().required().email(),
  },
  phone: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
  },
  plan: {
    type: DataTypes.ENUM(['BASIC', 'VIP']),
    defaultValue: 'BASIC',
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'https://picsum.photos/300/300',
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`
    },
    set(value) {
      throw new Error('Do not try to set the `fullName` value!')
    },
  },
  age: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.birthday
        ? Math.ceil(
            new Date(Date.now() - new Date(this.birthday).getTime()).getTime() / 31536000000,
          )
        : null
    },
    set(value) {
      throw new Error('Do not try to set the `age` value!')
    },
  },
})

Model.prototype.toJSON = function () {
  var values = Object.assign({}, this.get())

  return values
}

Model.belongsTo(CountryModel)

Model.sync()
// Model.sync({ force: true })

export default Model
