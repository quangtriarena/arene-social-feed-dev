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
 * @param {Object} extraHeaders
 * @returns Object
 */

const randomListKeyApi = () => {
  let index = Math.ceil(Math.random() * LIST_KEY.length)

  return LIST_KEY[index]
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
    const { channelId, forUserName, user, field, part } = params
    const key = randomListKeyApi()
    const _part = part ? part : 'id,snippet,brandingSettings,statistics'
    const _field = field ? field : '*'

    if (channelId) {
      return await apiCaller({
        endpoint: '/channels',
        params: `key=${key}&id=${channelId}&part=${_part}`,
      })
    }

    if (user) {
      return await apiCaller({
        endpoint: '/channels',
        params: `key=${key}&forUsername=${user}&part=${_part}`,
      })
    }
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

const getVideoPlayList = async (params) => {
  try {
  } catch (error) {
    throw new Error('invalid playlistID')
  }
}

const YoutubeApi = {
  getChannel,
  getPlaylist,
}

export default YoutubeApi
