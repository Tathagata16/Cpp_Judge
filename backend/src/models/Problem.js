import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }, // hidden test cases not shown to user
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }],
  testCases: [testCaseSchema],
  starterCode: { type: String, default: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}' },
  order: { type: Number, default: 0 }, // for ordering on problems list
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);
