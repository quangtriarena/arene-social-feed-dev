import express from 'express'
import ResponseHandler from '../helpers/responseHandler.js'
import YoutubeApi from '../services/youtube_api.js'

const router = express.Router()

/**
 * router youtube
 */

router.get('/channels', async (req, res) => {
  try {
    const url = 'https://www.youtube.com/user/harisego'
    const param = url.split('/')

    let data = null

    if (param.includes('channel')) {
      data = await YoutubeApi.getChannel({ id: param[param.length - 1] })
    }

    if (param.includes('user')) {
      data = await YoutubeApi.getChannel({ user: param[param.length - 1] })
    }

    if (!param.includes('channel') && !param.includes('user')) {
      data = await YoutubeApi.getChannel({ forUserName: param[param.length - 1] })
    }

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

export default router
