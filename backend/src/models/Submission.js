import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Compile Error', 'Runtime Error', 'Time Limit Exceeded'], required: true },
  results: { type: Array, default: [] }, // per test-case results
  error: { type: String },             // compiler / runtime error message
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
