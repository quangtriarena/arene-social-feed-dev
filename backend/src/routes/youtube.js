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

router.get('/videos', async (req, res) => {
  try {
    //3GGaIWjefcA,Z4WKFYFqFN8,0LHmevWVvpc,A9WuGqHP4bU
    let ids = '3GGaIWjefcA'
    // let ids = ''

    const data = await YoutubeApi.getVideos({ ids })

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

router.get('/videosOfPlayList', async (req, res) => {
  try {
    console.log('aa')
    let playlistId = 'PL-ERGT8JXJe-Jr_V6L_GlIfRss7HrT7Er'

    const data = await YoutubeApi.getVideosOfPlayList({ playlistId })
    console.log('🚀 ~ file: youtube.js ~ line 72 ~ router.get ~ data', data)

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

router.get('/comments', async (req, res) => {
  try {
    let videoId = '3zyoPRYf4i0'
    let maxResults = 5

    const data = await YoutubeApi.getComments({ videoId, maxResults })

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, data)
  }
})

router.get('/getVideosOfPlayList', async (req, res) => {
  try {
    let channelId = 'UCl6HKsYfp0EXWZZrKTKBZwA'
    let maxResults = '2'

    const data = await YoutubeApi.getLastestVideos({ channelId, maxResults })
    console.log('🚀 ~ file: youtube.js ~ line 99 ~ router.get ~ data', data)

    return ResponseHandler.success(res, data)
  } catch (error) {
    return ResponseHandler.error(res, error)
  }
})

export default router
