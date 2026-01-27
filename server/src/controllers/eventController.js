const Event = require('../models/event');
const User = require('../models/user');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/fileUpload');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      eventType,
      status,
      startDate,
      endDate,
      location,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = {};

    // Search in title, description, and location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category.toLowerCase();
    }

    // Filter by event type
    if (eventType) {
      query.eventType = eventType.toLowerCase();
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Only show approved events for non-admin users
    if (!req.user || req.user.role !== 'Admin') {
      query.isApproved = true;
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const events = await Event.find(query)
      .populate('organizer', 'name email picture')
      .sort(sort)
      .limit(limitNum)
      .skip(skip);

    // Get total count
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

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email picture')
      .populate('participants.user', 'name email picture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Update event status
    event.updateStatus();
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Organizer, Admin)
exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      eventType,
      category,
      maxParticipants,
      tags,
    } = req.body;

    // Create event object
    const eventData = {
      title,
      description,
      date,
      time,
      location,
      eventType: eventType.toLowerCase(),
      category: category?.toLowerCase() || 'other',
      organizer: req.user.id,
      maxParticipants: maxParticipants || null,
      tags: tags || [],
    };

    // Handle image upload if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, 'events');
        eventData.image = result.secure_url;
        eventData.imagePublicId = result.public_id;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message,
        });
      }
    }

    // Create event
    const event = await Event.create(eventData);

    // Add event to user's created events
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdEvents: event._id },
    });

    // Populate organizer info
    await event.populate('organizer', 'name email picture');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer of event, Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Handle image upload if provided
    if (req.file) {
      try {
        // Delete old image if exists
        if (event.imagePublicId) {
          await deleteFromCloudinary(event.imagePublicId);
        }

        // Upload new image
        const result = await uploadToCloudinary(req.file, 'events');
        req.body.image = result.secure_url;
        req.body.imagePublicId = result.public_id;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message,
        });
      }
    }

    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name email picture');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer of event, Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    // Delete image from cloudinary if exists
    if (event.imagePublicId) {
      await deleteFromCloudinary(event.imagePublicId);
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

// @desc    Get events by organizer
// @route   GET /api/events/organizer/:organizerId
// @access  Public
exports.getEventsByOrganizer = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.params.organizerId })
      .populate('organizer', 'name email picture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my events (created by logged in user)
// @route   GET /api/events/my-events
// @access  Private
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .populate('organizer', 'name email picture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event status
// @route   PATCH /api/events/:id/status
// @access  Private (Organizer, Admin)
exports.updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Upcoming', 'Ongoing', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    event.status = status;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event status updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve event (Admin only)
// @route   PATCH /api/events/:id/approve
// @access  Private (Admin)
exports.approveEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.isApproved = true;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event approved successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};