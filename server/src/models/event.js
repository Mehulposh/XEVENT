const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide an event time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    eventType: {
      type: String,
      enum: ['online', 'offline'],
      required: [true, 'Please specify event type'],
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        'conference',
        'webinar',
        'meetup',
        'workshop',
        'seminar',
        'other',
        'test'
      ],
      default: 'other',
      lowercase: true,
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    maxParticipants: {
      type: Number,
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizer: 1 });

// Virtual for participant count
eventSchema.virtual('participantCount').get(function () {
  return this.participants.length;
});

// Update event status based on date
eventSchema.methods.updateStatus = function () {
  const now = new Date();
  const eventDate = new Date(this.date);
  const eventDateTime = new Date(eventDate.toDateString() + ' ' + this.time);

  if (eventDateTime > now) {
    this.status = 'Upcoming';
  } else if (eventDateTime <= now && eventDate >= new Date(now.toDateString())) {
    this.status = 'Ongoing';
  } else {
    this.status = 'Completed';
  }
};

module.exports =  mongoose.models.Event || mongoose.model('Event', eventSchema);