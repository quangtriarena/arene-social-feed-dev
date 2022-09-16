import express from 'express'
import ResponseHandler from '../helpers/responseHandler.js'
import YoutubeApi from '../services/youtube_api.js'

const router = express.Router()

/**
 * router youtube
 */

router.get('/channels', async (req, res) => {
  try {
    const url = 'https://www.youtube.com/channel/UCl6HKsYfp0EXWZZrKTKBZwA'
    const param = url.split('/')

    let data = null
    let fulldata = {}
    let params = {}

    if (url.includes('/channel/')) {
      params = { channelId: param[param.length - 1] }
    } else if (url.includes('/user/')) {
      params = { user: param[param.length - 1] }
    }

    data = await YoutubeApi.getChannel(params)

    data = {
      ...data,
      channel: data.payload.items,
    }

    delete data.payload

    if (data.success) {
      let playlists = await YoutubeApi.getPlaylist(params)

      data = {
        ...data,
        playlists: playlists.payload.items,
      }
    } else {
      throw new Error('invalid channelId ')
    }

    delete data.success

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

export default router
