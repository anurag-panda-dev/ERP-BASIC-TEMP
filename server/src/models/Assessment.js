import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    assessmentType: {
      type: String,
      enum: ['internal', 'assignment', 'exam'],
      default: 'internal',
    },
    dueDate: {
      type: Date,
      sparse: true,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
        remarks: {
          type: String,
          default: '',
        },
        _id: false,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublished: {
      type: Boolean,
      default: true,
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
assessmentSchema.index({ subject: 1 });
assessmentSchema.index({ assessmentType: 1 });

export default mongoose.model('Assessment', assessmentSchema);
