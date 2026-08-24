const Event = require('../models/event');
const User = require('../models/user');
const Registration = require('../models/registration');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: 'registered' });
    
    // Get events by status
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'Ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'Completed' });
    
    // Get users by role
    const admins = await User.countDocuments({ role: 'Admin' });
    const organizers = await User.countDocuments({ role: 'Organizer' });
    const participants = await User.countDocuments({ role: 'Participant' });
    
    // Get pending approval events
    const pendingApproval = await Event.countDocuments({ isApproved: false });
    
    // Get events by category
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    
    // Get events by type
    const eventsByType = await Event.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);
    
    // Get recent events
    const recentEvents = await Event.find()
      .sort('-createdAt')
      .limit(5)
      .populate('organizer', 'name email');
    
    // Get recent registrations
    const recentRegistrations = await Registration.find({ status: 'registered' })
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .populate('event', 'title date');
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalEvents,
          totalUsers,
          totalRegistrations,
          pendingApproval,
        },
        eventStats: {
          byStatus: {
            upcoming: upcomingEvents,
            ongoing: ongoingEvents,
            completed: completedEvents,
          },
          byCategory: eventsByCategory,
          byType: eventsByType,
        },
        userStats: {
          admins,
          organizers,
          participants,
        },
        recent: {
          events: recentEvents,
          registrations: recentRegistrations,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events for admin management
// @route   GET /api/admin/events
// @access  Private (Admin)
exports.getAllEvents = async (req, res, next) => {
  try {
    const { status, isApproved, page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find(query)
      .populate('organizer', 'name email picture')
      .sort('-createdAt')
      .limit(limitNum)
      .skip(skip);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (role) {
      query.role = role;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limitNum)
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any event (Admin only)
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Remove event from organizer's created events
    await User.findByIdAndUpdate(event.organizer, {
      $pull: { createdEvents: event._id },
    });

    // Remove event from all participants' registered events
    for (const participant of event.participants) {
      await User.findByIdAndUpdate(participant.user, {
        $pull: { registeredEvents: { event: event._id } },
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    // Delete all events created by this user
    await Event.deleteMany({ organizer: user._id });

    // Remove user from all registered events
    for (const registration of user.registeredEvents) {
      await Event.findByIdAndUpdate(registration.event, {
        $pull: { participants: { user: user._id } },
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending organizer requests
// @route   GET /api/admin/organizer-requests
// @access  Private (Admin)
exports.getOrganizerRequests = async (req, res, next) => {
  try {
    const users = await User.find({
      organizerRequestStatus: 'pending',
    }).select('-password');

    // Cypress expects response.body to be an array.
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a user's organizer request
// @route   PUT /api/admin/users/:id/approve-organizer
// @access  Private (Admin)
exports.approveOrganizerRequest = async (req, res, next) => {
  try {
    const { approve, isApproved } = req.body;

    const shouldApprove =
      approve !== undefined
        ? !!approve
        : isApproved !== false;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (shouldApprove) {
      user.role = 'Organizer';
      user.organizerRequestStatus = 'approved';
    } else {
      user.organizerRequestStatus = 'rejected';
    }

    await user.save();

    res.status(200).json({
      success: true,

      message: shouldApprove
        ? 'User approved as Organizer'
        : 'User rejected as Organizer',

      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject event
// @route   PATCH /api/admin/events/:id/approval
// @access  Private (Admin)
exports.updateEventApproval = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Event ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registration statistics
// @route   GET /api/admin/registrations/stats
// @access  Private (Admin)
exports.getRegistrationStats = async (req, res, next) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const activeRegistrations = await Registration.countDocuments({ status: 'registered' });
    const cancelledRegistrations = await Registration.countDocuments({ status: 'cancelled' });

    // Get registrations over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationsOverTime = await Registration.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRegistrations,
        activeRegistrations,
        cancelledRegistrations,
        registrationsOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
};