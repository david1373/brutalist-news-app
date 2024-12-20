import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['dark', 'darker', 'terminal'],
    default: 'dark'
  },
  contentPreferences: {
    sources: [{
      type: String,
      enum: ['dezeen', 'leibal']
    }],
    categories: [{
      type: String,
      enum: ['residential', 'commercial', 'cultural', 'industrial']
    }],
    tags: [String]
  },
  notifications: {
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      frequency: {
        type: String,
        enum: ['immediate', 'daily', 'weekly'],
        default: 'daily'
      }
    }
  },
  layout: {
    articleDisplay: {
      type: String,
      enum: ['grid', 'list', 'compact'],
      default: 'grid'
    },
    cardsPerRow: {
      type: Number,
      enum: [1, 2, 3],
      default: 2
    }
  }
});

export const UserSettings = mongoose.model('UserSettings', userSettingsSchema);