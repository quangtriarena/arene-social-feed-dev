import ResponseHandler from '../helpers/responseHandler.js'
import Joi from 'joi'

const schema = {
  firstName: Joi.string().trim().required().min(1).max(30),
  lastName: Joi.string().trim().required().min(1).max(30),
  email: Joi.string().trim().required().min(1).max(50).email(),
  username: Joi.string().trim().required().min(1).max(50),
  password: Joi.string().required().min(8).max(50),
  gender: Joi.any(),
  birthday: Joi.any(),
  avatar: Joi.any(),
  photos: Joi.any(),
  countryId: Joi.any(),
}

let createSchema = {}
Array.from([
  'firstName',
  'lastName',
  'email',
  'username',
  'password',
  'gender',
  'birthday',
  'avatar',
  'photos',
  'countryId',
]).forEach((key) => (createSchema[key] = schema[key]))
createSchema = Joi.object(createSchema)

let updateSchema = {}
Array.from([
  'firstName',
  'lastName',
  'email',
  'username',
  'gender',
  'birthday',
  'avatar',
  'photos',
  'countryId',
]).forEach((key) => (updateSchema[key] = schema[key]))
updateSchema = Joi.object(updateSchema)

let loginSchema = {}
Array.from(['username', 'password']).forEach((key) => (loginSchema[key] = schema[key]))
loginSchema = Joi.object(loginSchema)

export default {
  create: async (req, res, next) => {
    try {
      await createSchema.validateAsync(req.body)

      next()
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  update: async (req, res, next) => {
    try {
      await updateSchema.validateAsync(req.body)

      next()
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  login: async (req, res, next) => {
    try {
      await loginSchema.validateAsync(req.body)

      next()
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
