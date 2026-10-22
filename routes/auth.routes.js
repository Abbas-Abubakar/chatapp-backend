import express from 'express'
import { logout, signin, signup } from '../controllers/auth.controller.js'
import protectRoute from '../middleware/protectRoute.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", signin)
router.post("/logout", logout)
router.get("/check", protectRoute, (req, res) => {
  const { _id, fullname, username, profilePic } = req.user
  res.status(200).json({ id: _id, fullname, username, profilePic })
})


export default router