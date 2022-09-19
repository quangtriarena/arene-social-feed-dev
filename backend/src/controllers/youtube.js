import ResponseHandler from '../helpers/responseHandler.js'
import YoutubeApi from '../services/youtube_api.js'

export default {
  findByChannel: async (req, res) => {
    try {
      const { url, key } = req.body

      // const url = 'https://www.youtube.com/channel/UCgz44a7jO0uOxXUF1MpAxew'
      // const url = 'https://www.youtube.com/user/vitlonba'
      // const url = 'https://www.youtube.com/c/LoveLifeLyrics'

      let data = null
      let channel = null
      let playlists = null
      let latestVideo = null
      let listComment = []

      channel = await YoutubeApi.getChannel({ url, key })
      console.log('channel :>> ', channel)
      playlists = await YoutubeApi.getPlaylists({ id: channel.id })
      console.log('playlists', playlists)
      latestVideo = await YoutubeApi.getLatestVideos({ channelId: channel.id })
      console.log('latestVideo :>> ', latestVideo)

      for (let i = 0; i < latestVideo.length; i++) {
        let id = latestVideo[i].id

        let listCommentOfLatestVideo = await YoutubeApi.getComments({ videoId: id })
          .then((res) => res)
          .catch((err) => [])

        listComment.push(...listCommentOfLatestVideo)
      }

      latestVideo = latestVideo.map((video) => ({
        ...video,
        comments: listComment.filter((cmt) => cmt.videoId === video.id),
      }))

      data = {
        channel,
        playlists,
        latestVideo,
      }

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  getVideosOfPlaylist: async (req, res) => {
    try {
      const { playlistId, key } = req.body
      // let playlistId = 'PL-ERGT8JXJe-Jr_V6L_GlIfRss7HrT7Er'
      let ids = null
      let videos = null
      let listComment = []

      ids = await YoutubeApi.getVideosOfPlaylist({ playlistId, key })

      videos = await YoutubeApi.getVideos({ ids })

      for (let i = 0; i < videos.length; i++) {
        let data = await YoutubeApi.getComments({ videoId: videos[i].id })

        listComment.push(...data)
      }

      videos = videos.map((video) => ({
        ...video,
        comments: listComment.filter((cmt) => cmt.videoId === video.id),
      }))

      return ResponseHandler.success(res, {
        playlistId,
        videos,
      })
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
