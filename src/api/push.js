const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');
const Subscription = require('../models/Subscription');

// POST /api/push/subscribe - registrar suscripción push
router.post('/subscribe', async (req, res) => {
  const { userId, subscription } = req.body;
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'userId inválido' });
  }
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }
  try {
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { userId, ...subscription },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al guardar suscripción' });
  }
});

// DELETE /api/push/unsubscribe - eliminar suscripción push
router.delete('/unsubscribe', async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint requerido' });
  }
  try {
    await Subscription.deleteOne({ endpoint });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar suscripción' });
  }
});

module.exports = router;