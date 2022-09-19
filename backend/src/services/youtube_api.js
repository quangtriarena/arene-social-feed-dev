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
  let index = Math.floor(Math.random() * LIST_KEY.length)
  let key = LIST_KEY[index]
  console.log('key', key)

  return key
}

const apiCaller = async (endpoint, method = 'GET', data = null, headers = null) => {
  try {
    let axiosConfig = {
      url: `${YOUTUBE_URL_API}${endpoint}`,
      method: method,
      data: data || null,
      headers: headers || null,
    }

    console.log(axiosConfig.url)

    const res = await axios(axiosConfig)

    return res.data
  } catch (error) {
    let message = error.message

    console.log(error.response?.data)

    if (error.response?.data?.error?.message) {
      message = error.response.data.error.message
    }

    throw new Error(message)
  }
}

const getChannel = async ({ url, key, part, fields }) => {
  try {
    let urlParser = url.split('/')[url.split('/').length - 1]
    let res = null
    let endpoint = null

    let _key = key || randomListKeyApi()
    let _part = part || 'snippet,brandingSettings,statistics,id'
    let _fields = fields || '*'

    if (url.includes('/channel/')) {
      endpoint = `/channels?key=${_key}&id=${urlParser}&part=${_part}`
    }

    if (url.includes('/user/')) {
      endpoint = `/channels?key=${_key}&forUsername=${urlParser}&part=${_part}&_fields=${_fields}`
    }

    if (url.includes('/c/')) {
      res = await apiCaller(`/search?part=id&maxResults=1&q=${urlParser}&type=channel&key=${_key}`)

      if (!res.items.length) {
        throw new Error('Invalid Youtube URL')
      }

      endpoint = `/channels?key=${_key}&id=${res.items[0].id.channelId}&part=${_part}`
    }

    res = await apiCaller(endpoint)

    if (!res.items.length) {
      throw new Error('Invalid Youtube URL')
    }

    return res.items[0]
  } catch (error) {
    throw error
  }
}

const getPlaylists = async ({ part, key, id }) => {
  try {
    let res = null
    let endpoint = null

    let _key = key || randomListKeyApi()
    let _part = part || 'snippet,status,player,localizations,contentDetails'

    endpoint = `/playlists?key=${_key}&part=${_part}&channelId=${id}`

    res = await apiCaller(endpoint)

    return res.items
  } catch (error) {
    throw error
  }
}

/**
 * get list id videos of playList
 */
const getVideosOfPlaylist = async ({ key, playlistId, part, maxResults, pageToken }) => {
  try {
    let _key = key || randomListKeyApi()
    let _part = part ? part : 'snippet,contentDetails'
    let _maxResults = maxResults ? maxResults : 20
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''

    const res = await apiCaller(
      `/playlistItems?key=${_key}&playlistId=${playlistId}&part=${_part}&maxResults=${_maxResults}${_pageToken}`,
    )

    return res.items
      .filter((item) => item.snippet.resourceId && item.snippet.resourceId.videoId)
      .map((item) => item.snippet.resourceId.videoId)
  } catch (error) {
    throw error
  }
}

const getVideos = async ({ key, ids, part, maxResults, pageToken }) => {
  try {
    let _key = key || randomListKeyApi()

    let _part = part ? part : 'snippet,contentDetails,statistics'
    let _maxResults = maxResults ? maxResults : '20'
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''
    let _ids = ''

    //handle convert ids arr to string
    ids.forEach((id, index) => {
      index !== ids.length - 1 ? (_ids += id + ',') : (_ids += id)
    })

    const res = await apiCaller(
      `/videos?key=${_key}&id=${_ids}&part=${_part}&maxResults=${_maxResults}${_pageToken}`,
    )

    return res.items.map((item) => ({
      id: item.id,
      ...item.snippet,
      ...item.contentDetails,
      ...item.statistics,
    }))
  } catch (error) {
    throw error
  }
}

const getComments = async ({ key, videoId, part, maxResults, pageToken, textFormat }) => {
  try {
    let _key = key || randomListKeyApi()
    let _part = part ? part : 'snippet,replies '
    let _maxResults = maxResults ? maxResults : 5
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''
    let _textFormat = textFormat ? textFormat : 'html'

    const res = await apiCaller(
      `/commentThreads?key=${_key}&videoId=${videoId}&part=${_part}&maxResults=${_maxResults}${_pageToken}&textFormat=${_textFormat}`,
    )

    console.log(res)

    return res.items.map((item) => ({
      id: item.id,
      ...item.snippet.topLevelComment.snippet,
    }))
  } catch (error) {
    throw error
  }
}

const getLatestVideos = async ({ key, channelId, part, maxResults, pageToken }) => {
  try {
    let _key = key || randomListKeyApi()
    let _part = part ? part : 'snippet'
    let _maxResults = maxResults ? maxResults : 5
    let _pageToken = pageToken ? `&pageToken=${pageToken}` : ''

    let res = await apiCaller(
      `/search?key=${_key}&channelId=${channelId}&part=${_part}&maxResults=${_maxResults}&order=date&type=video${_pageToken}`,
    )

    return res.items.map((item) => ({
      id: item.id.videoId,
      ...item.snippet,
    }))
  } catch (error) {
    throw error
  }
}

const YoutubeApi = {
  getChannel,
  getPlaylists,
  getLatestVideos,
  getVideosOfPlaylist,
  getVideos,
  getComments,
}

export default YoutubeApi
