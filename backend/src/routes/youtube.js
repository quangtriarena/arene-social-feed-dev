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

    let params = {}

    if (url.includes('/channel/')) {
      params = { id: param[param.length - 1] }
    } else if (url.includes('/user/')) {
      params = { user: param[param.length - 1] }
    }

    data = await YoutubeApi.getChannel(params)

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

router.get('/videos', async (req, res) => {
  try {
    //3GGaIWjefcA,Z4WKFYFqFN8,0LHmevWVvpc,A9WuGqHP4bU
    let ids = '3GGaIWjefcA'

    const data = await YoutubeApi.getVideos({ ids })
    console.log('data', data)

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

export default router
