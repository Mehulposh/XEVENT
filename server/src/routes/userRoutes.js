const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getUsers,
  getUser,
  updateProfile,
  requestOrganizerRole,
  updateUserRole,
  deleteUser,
  getUserStats,
  getUserActivity,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

// Validation rules
const profileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('picture').optional().isURL().withMessage('Picture must be a valid URL'),
];

const roleValidation = [
  body('role')
    .isIn(['Admin', 'Organizer', 'Participant'])
    .withMessage('Invalid role'),
];

// Routes
router.get('/', protect, authorize('Admin'), getUsers);
router.get('/stats/overview', protect, authorize('Admin'), getUserStats);
router.get('/activity', protect, getUserActivity);
router.get('/:id', protect, getUser);

router.put('/profile', protect, profileValidation, validate, updateProfile);
router.put('/request-organizer', protect, requestOrganizerRole);
router.put(
  '/:id/role',
  protect,
  authorize('Admin'),
  roleValidation,
  validate,
  updateUserRole
);

router.delete('/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;