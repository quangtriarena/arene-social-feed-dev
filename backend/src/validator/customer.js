import ResponseHandler from '../helpers/responseHandler.js'
import Joi from 'joi'

const schema = Joi.object({
  firstName: Joi.string().trim().required().min(1).max(30),
  lastName: Joi.string().trim().required().min(1).max(30),
  email: Joi.string().trim().required().min(1).max(50).email(),
  phone: Joi.any(),
  gender: Joi.any(),
  birthday: Joi.any(),
  avatar: Joi.any(),
  photos: Joi.any(),
  countryId: Joi.any(),
})

export default {
  create: async (req, res, next) => {
    try {
      await schema.validateAsync(req.body)

      next()
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  update: async (req, res, next) => {
    try {
      await schema.validateAsync(req.body)

      next()
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
