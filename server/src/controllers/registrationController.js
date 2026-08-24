const Event = require('../models/event');
const User = require('../models/user');
const Registration = require('../models/registration');
const { sendRegistrationEmail, sendCancellationEmail } = require('../services/emailService');

// @desc    Register for event
// @route   POST /api/registration/events/:eventId
// @access  Private
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is approved
    if (!event.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Event is not approved yet',
      });
    }

    // Check if event is completed
    if (event.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for a completed event',
      });
    }

    // Check if already registered
    const existingRegistration = event.participants.find(
      (p) => p.user.toString() === userId
    );

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Check if event is full
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot register for your own event',
      });
    }

    // Add participant to event
    event.participants.push({
      user: userId,
      registeredAt: new Date(),
    });
    await event.save();

    // Add event to user's registered events
    const user = await User.findById(userId);
    user.registeredEvents.push({
      event: eventId,
      registeredAt: new Date(),
    });
    await user.save();

    // Create registration record
    await Registration.create({
      event: eventId,
      user: userId,
      status: 'registered',
    });

    // Send confirmation email
    try {
      await sendRegistrationEmail(user.email, user.name, event.title, event.date);
    } catch (emailError) {
      console.error('Failed to send registration email:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
        message: 'Registered successfully',
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registration/events/:eventId
// @access  Private
exports.cancelRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if registered
    const participantIndex = event.participants.findIndex(
      (p) => p.user.toString() === userId
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event',
      });
    }

    // Remove participant from event
    event.participants.splice(participantIndex, 1);
    await event.save();

    // Remove event from user's registered events
    const user = await User.findById(userId);
    user.registeredEvents = user.registeredEvents.filter(
      (e) => e.event.toString() !== eventId
    );
    await user.save();

    // Update registration record
    await Registration.findOneAndUpdate(
      { event: eventId, user: userId },
      {
        status: 'cancelled',
        cancelledAt: new Date(),
      }
    );

    // Send cancellation email
    try {
      await sendCancellationEmail(user.email, user.name, event.title);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }

    res.status(200).json({
      message: 'Registration cancelled',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registered events
// @route   GET /api/registration/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'registeredEvents.event',
      populate: {
        path: 'organizer',
        select: 'name email picture',
      },
    });

    const registrations = user.registeredEvents
      .filter((r) => r.event !== null)
      .map((r) => ({
        ...r.event.toObject(),
        registeredAt: r.registeredAt,
      }));

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event participants
// @route   GET /api/registration/events/:eventId/participants
// @access  Private (Organizer, Admin)
exports.getEventParticipants = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate('participants.user', 'name email picture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view participants',
      });
    }

    const participants = event.participants.map((p) => ({
      user: p.user,
      registeredAt: p.registeredAt,
    }));

    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check registration status
// @route   GET /api/registration/events/:eventId/status
// @access  Private
exports.checkRegistrationStatus = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const isRegistered = event.participants.some(
      (p) => p.user.toString() === userId
    );

    res.status(200).json({
      success: true,
      data: {
        isRegistered,
        participantCount: event.participants.length,
        maxParticipants: event.maxParticipants,
        isFull: event.maxParticipants
          ? event.participants.length >= event.maxParticipants
          : false,
      },
    });
  } catch (error) {
    next(error);
  }
};