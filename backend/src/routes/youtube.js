import express from 'express'
import Controller from '../controllers/youtube.js'

const router = express.Router()

/**
 * router youtube
 */
router.post('/channels', Controller.findByChannel)
router.post('/getPlaylist', Controller.getVideosOfPlaylist)

export default router
