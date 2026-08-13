import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audience: {
      type: String,
      enum: ['global', 'class', 'department'],
      default: 'global',
    },
    targetSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      sparse: true,
    },
    targetDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      sparse: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    attachments: [
      {
        url: String,
        name: String,
      },
    ],
    expiryDate: {
      type: Date,
      sparse: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ audience: 1 });
noticeSchema.index({ targetSubject: 1 });

export default mongoose.model('Notice', noticeSchema);
