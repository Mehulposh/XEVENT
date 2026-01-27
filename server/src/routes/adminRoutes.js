const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getDashboardStats,
  getAllEvents,
  getAllUsers,
  deleteEvent,
  deleteUser,
  updateEventApproval,
  getRegistrationStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

// Validation rules
const approvalValidation = [
  body('isApproved').isBoolean().withMessage('isApproved must be a boolean'),
];

// Routes
router.get('/dashboard', getDashboardStats);
router.get('/events', getAllEvents);
router.get('/users', getAllUsers);
router.get('/registrations/stats', getRegistrationStats);

router.delete('/events/:id', deleteEvent);
router.delete('/users/:id', deleteUser);

router.patch('/events/:id/approval', approvalValidation, validate, updateEventApproval);

module.exports = router;