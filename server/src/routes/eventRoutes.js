const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer,
  getMyEvents,
  updateEventStatus,
  approveEvent,
} = require('../controllers/eventController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const { upload } = require('../utils/fileUpload');
const validate = require('../middleware/validationMiddleware');

// Validation rules
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('eventType')
    .isIn(['online', 'offline'])
    .withMessage('Event type must be either online or offline'),
  body('category')
    .optional()
    .isIn(['conference', 'webinar', 'meetup', 'workshop', 'seminar', 'other'])
    .withMessage('Invalid category'),
];

const statusValidation = [
  body('status')
    .isIn(['Upcoming', 'Ongoing', 'Completed'])
    .withMessage('Invalid status'),
];

// Routes
router.get('/', optionalAuth, getEvents);
router.get('/my-events', protect, authorize('Organizer', 'Admin'), getMyEvents);
router.get('/organizer/:organizerId', getEventsByOrganizer);
router.get('/:id', getEvent);

router.post(
  '/',
  protect,
  authorize('Organizer', 'Admin'),
  upload.single('image'),
  eventValidation,
  validate,
  createEvent
);

router.put(
  '/:id',
  protect,
  authorize('Organizer', 'Admin'),
  upload.single('image'),
  updateEvent
);

router.delete('/:id', protect, authorize('Organizer', 'Admin'), deleteEvent);

router.patch(
  '/:id/status',
  protect,
  authorize('Organizer', 'Admin'),
  statusValidation,
  validate,
  updateEventStatus
);

router.patch('/:id/approve', protect, authorize('Admin'), approveEvent);

module.exports = router;