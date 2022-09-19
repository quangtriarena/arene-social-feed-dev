import axios from 'axios'

/**
 * youtube url
 */

const YOUTUBE_URL_API = 'https://www.googleapis.com/youtube/v3'

/**
 * list key youtube active
 */

const LIST_KEY = [
  'AIzaSyAwOFWaaBjstb5dRiqjPPAkxd_CMsxuXoU',
  'AIzaSyBnQtl6l66gO8fEgSiv_i2wkX2TQ70fFl8',
  'AIzaSyBGtIZGinF1AhDP7lvbwJTRmYg6qXaKC9U',
  'AIzaSyAwP23ehqSeBEIMWUojALyu6XRejFwZ33c',
  'AIzaSyCSq-3tzIddST0Lm8d6bN9B_q2RoGQHo8E',
  'AIzaSyBrSrrZrSMbe5VZ5P_FOiFMzjztsBCPgCE',
  'AIzaSyBLvpXqX2A2PNfPyjHp_pnZ9ZZLxb7SxTA',
  'AIzaSyAuXyoXjPbAQyvvDkDXCY-_uiLtE9pRZYs',
  'AIzaSyAP0UAfeL-JzMVCehZ0O3vZN5e3RfIXAZI',
  'AIzaSyBlgTLuaM0RmzlLblS-l4-KUI5fMgbG0fs',
  'AIzaSyAOjjtvVvzZ_A8LVRATQUaQpdRHvqKDi5E',
  'AIzaSyDtllFRgjV3bgo9aZh9t-ggvwCArigw8XU',
  'AIzaSyCzghnE87T9n-cXqYVs4rVMkneXHns-fPs',
  'AIzaSyAyQ3LX-KciapqQHdH-anORE8p_qkVeqBU',
  'AIzaSyAVZ9knWeJnuiCywD5F3dFzIADDvC5FelQ',
  'AIzaSyCALRWUlp1dPKI9hUChZ_gCg2L4R6eFbec',
  'AIzaSyA9mBk3p9qk-BokCCQe2aaSZBF_VBV5CTw',
  'AIzaSyA41ucbFZfjXdsxHQIrnd0kaPmmK8eMA3A',
  'AIzaSyAeXKo-WRPpYNpv1xo74dHI8eWXmDI2I1M',
  'AIzaSyCJM7TXiTxNQ8iPmJ_XIWH8XI2MdpbXMAc',
  'AIzaSyAKSqgaKs1lt8k0lOK2EYxKGrVCbSSg4Ns',
  'AIzaSyDnTDzaW-x5jboyN73p54hT88Jj2F7yqJ0',
  'AIzaSyANw5bRgFZBOEuYqWKizTivstO6zil4eJI',
  'AIzaSyAD8kg5NwfqykLVL-5M5r2Mg_eXlQ3Dwy0',
  'AIzaSyB_Xhq7pvA_NsfNSrY1yUVHJUz0nq0Yew0',
  'AIzaSyCXyrk6EIUAjOBYXQluk0RqaYpbZpbzQPM',
  'AIzaSyA18RK4MT9JgAR7X9951hMRtbJnXsIO-Cw',
  'AIzaSyDkMh2Q4E6wx1qMDL-71Ped2D5PjqS1-vs',
  'AIzaSyCMMo6m7Kk3jH9Xel4_TqeEU2k_Bcyqz3s',
]

/**
 *
 * @param {String} endpoint
 * @param {String} method
 * @param {Object} data
 * @returns Object
 */

const randomListKeyApi = () => {
  let index = Math.ceil(Math.random() * LIST_KEY.length)

  return LIST_KEY[index]
}

/**
 *
 * @param {Object} data
 */
const validateParams = (data) => {
  console.log('🚀 ~ file: youtube_api.js ~ line 65 ~ validateParams ~ data', data)
  try {
    let keys = Object.keys(data)
    console.log('keys', keys)
    for (let i = 0, leng = keys.length; i < leng; i++) {
      if (!data[keys[i]]) {
        throw { message: `Bad request. Field ${keys[i]} is required`, field: keys[i] }
      }
    }
  } catch (error) {
    throw error
  }
}

const apiCaller = async ({ endpoint, method = 'GET', data = null, headers = null, params }) => {
  try {
    let axiosConfig = {
      url: `${YOUTUBE_URL_API}${endpoint}?${params}`,
      method: method,
      data: data || null,
      headers: headers || null,
    }

    const res = await axios(axiosConfig)

    return {
      success: true,
      payload: res.data,
    }
  } catch (error) {
    let message = error.message

    if (error.response?.data?.message) {
      message = error.response.data.message
    }

    return {
      success: false,
      message,
    }
  }
}

const getChannel = async (params) => {
  try {
    const { channelId, customUsername, user, field, part } = params
    const key = randomListKeyApi()
    const _part = part ? part : 'id,snippet,brandingSettings,statistics'
    const _field = field ? field : '*'

    let res = null

    if (channelId) {
      res = await apiCaller({
        endpoint: '/channels',
        params: `key=${key}&id=${channelId}&part=${_part}`,
      })
    }

    if (user) {
      res = await apiCaller({
        endpoint: '/channels',
        params: `key=${key}&forUsername=${user}&part=${_part}`,
      })
    }

    // if (customUsername) {
    //   return await apiCaller({
    //     endpoint: `/c`,
    //     params: `key=${key}&forUsername=${customUsername}&part=${_part}`,
    //   })
    // }

    return res
  } catch (error) {
    throw new Error('Invalid youtube channel url')
  }
}

const getPlaylist = async (params) => {
  try {
    const { part, channelId } = params
    const key = randomListKeyApi()
    const _part = part ? part : 'snippet,status,player,localizations,contentDetails'

    return await apiCaller({
      endpoint: '/playlists',
      params: `key=${key}&channelId=${channelId}&part=${_part}`,
    })
  } catch (error) {
    throw new Error('Invalid youtube playlist url')
  }
}

/**
 * get list videos of playList
 */
const getVideosOfPlayList = async ({ playlistId, part, maxResults, pageToken }) => {
  try {
    const key = randomListKeyApi()

    validateParams({ key, playlistId })

    let _part = part ? part : 'snippet,contentDetails'
    let _maxResults = maxResults ? maxResults : '20'
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''

    const res = await apiCaller({
      endpoint: '/playlistItems',
      params: `key=${key}&playlistId=${playlistId}&part=${_part}&maxResults=${_maxResults}${_pageToken}`,
    })

    if (res.success) {
      let ids = res.payload.items
        .filter((item) => item.snippet.resourceId && item.snippet.resourceId.videoId)
        .map((item) => item.snippet.resourceId.videoId)

      res.payload = ids
    }

    return res
  } catch (error) {
    throw new Error('Invalid youtube getVideosOfPlaylist url')
  }
}

const getVideos = async ({ ids, part, maxResults, pageToken }) => {
  try {
    const key = randomListKeyApi()

    validateParams({ key, ids })

    let _part = part ? part : 'snippet,contentDetails,statistics'
    let _maxResults = maxResults ? maxResults : '20'
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''

    const res = await apiCaller({
      endpoint: '/videos',
      params: `key=${key}&id=${ids}&part=${_part}&maxResults=${_maxResults}${_pageToken}`,
    })

    if (res.success) {
      let videos = res.payload.items.map((item) => ({
        id: item.id,
        snippet: item.snippet,
        contentDetails: item.contentDetails,
        statistics: item.statistics,
      }))
      return (res.payload = videos)
    }

    return res
  } catch (error) {
    throw new Error('Invalid youtube getVideos url')
  }
}

const getComments = async ({ videoId, part, maxResults, pageToken, textFormat }) => {
  try {
    let key = randomListKeyApi()

    validateParams({ key, videoId })

    let _part = part ? part : 'snippet,replies'
    let _maxResults = maxResults ? maxResults : '20'
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''
    let _textFormat = textFormat ? textFormat : 'html'

    const res = await apiCaller({
      endpoint: '/commentThreads',
      params: `key=${key}&videoId=${videoId}&part=${_part}&maxResults=${_maxResults}${_pageToken}&textFormat=${_textFormat}`,
    })

    if (res.success) {
      let comments = res.payload.items.map((item) => ({
        id: item.id,
        snippet: item.snippet,
      }))
      return (res.payload = comments)
    }

    return res
  } catch (error) {
    throw new Error('Invalid youtube getComments url')
  }
}

const getLastestVideos = async ({ channelId, part, maxResults, pageToken }) => {
  try {
    let key = randomListKeyApi()

    validateParams({ key, channelId })

    let _part = part ? part : 'snippet'
    let _maxResults = maxResults ? maxResults : '20'
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''

    let res = await apiCaller({
      endpoint: '/search',
      params: `key=${key}&channelId=${channelId}&part=${_part}&maxResults=${_maxResults}&order=date&type=video${_pageToken}`,
    })

    if (res.success) {
      let videos = res.payload.items.map((item) => ({
        id: item.id.videoId,
        snippet: item.snippet,
        nextPageToken: res.payload.nextPageToken,
        regionCode: res.payload.regionCode,
        pageInfo: res.payload.pageInfo,
      }))

      return (res.payload = videos)
    }

    return res
  } catch (error) {
    throw new Error('Invalid youtube getLastestVideos url')
  }
}

const YoutubeApi = {
  getChannel,
  getPlaylist,

  getLastestVideos,
  getVideosOfPlayList,
  getVideos,
  getComments,
}

export default YoutubeApi
