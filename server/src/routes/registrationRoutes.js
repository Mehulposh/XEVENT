const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventParticipants,
  checkRegistrationStatus,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes
router.get('/my-registrations', protect, getMyRegistrations);
router.post('/events/:eventId', protect, registerForEvent);
router.delete('/events/:eventId', protect, cancelRegistration);
router.get('/events/:eventId/status', protect, checkRegistrationStatus);
router.get(
  '/events/:eventId/participants',
  protect,
  authorize('Organizer', 'Admin'),
  getEventParticipants
);

module.exports = router;