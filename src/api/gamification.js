const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');
const Gamification = require('../models/Gamification');

// GET /api/gamification/status?userId=...
router.get('/status', async (req, res) => {
  const { userId } = req.query;
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'userId inválido' });
  }
  const gam = await Gamification.findOne({ userId });
  if (!gam) {
    return res.status(200).json({ streak: 0, points: 0, penalties: 0 });
  }
  return res.status(200).json({
    streak: gam.streak,
    points: gam.points,
    penalties: gam.penalties,
    lastActive: gam.lastActive
  });
});

module.exports = router;