import Repository from '../repositories/customer.js'

export default {
  count: async (req) => {
    try {
      return await Repository.count()
    } catch (error) {
      throw error
    }
  },

  find: async (req) => {
    try {
      return await Repository.find(req.query)
    } catch (error) {
      throw error
    }
  },

  findById: async (req) => {
    try {
      const { id } = req.params

      return await Repository.findById(id)
    } catch (error) {
      throw error
    }
  },

  create: async (req) => {
    try {
      let data = { ...req.body }

      // check entry exist
      let entry = await Repository.findOne({ email: data.email })
        .then((res) => res)
        .catch((err) => {})

      if (entry) {
        // handle data

        /**
         * TEST
         */
        console.log('[TEST MODE] generate email for test')
        data.email = data.email.replace('@', `-${Date.now()}@`)
      }

      return await Repository.create(data)
    } catch (error) {
      throw error
    }
  },

  update: async (req) => {
    try {
      const { id } = req.params
      let data = { ...req.body }

      return await Repository.update(id, data)
    } catch (error) {
      throw error
    }
  },

  delete: async (req) => {
    try {
      const { id } = req.params

      return await Repository.delete(id)
    } catch (error) {
      throw error
    }
  },
}
