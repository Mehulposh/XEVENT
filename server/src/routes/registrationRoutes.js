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
// NOTE: the required API contract is POST/DELETE /api/registration/:eventId
// (not /api/registration/events/:eventId). Keeping the more specific
// '/events/...' routes too, in case anything else still relies on them.
router.post('/:eventId', protect, registerForEvent);
router.delete('/:eventId', protect, cancelRegistration);
router.get('/events/:eventId/status', protect, checkRegistrationStatus);
router.get(
  '/events/:eventId/participants',
  protect,
  authorize('Organizer', 'Admin'),
  getEventParticipants
);

module.exports = router;