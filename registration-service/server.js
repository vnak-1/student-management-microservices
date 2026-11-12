// Registration microservice: adds a new student to the database.
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

const studentSchema = new mongoose.Schema({
  Student_id: { type: String, required: true, unique: true },
  Student_name: { type: String, required: true },
  student_mobile: { type: String, required: true },
  student_email: { type: String, required: true, unique: true },
  student_password: { type: String, required: true },
}, { collection: 'students', versionKey: false });
const Student = mongoose.model('Student', studentSchema);

const app = express();
app.use(express.json());

// POST /register -> create a student
app.post('/register', async (req, res) => {
  const { Student_id, Student_name, student_mobile, student_email, student_password } = req.body || {};
  if (!Student_id || !Student_name || !student_mobile || !student_email || !student_password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const hashed = await bcrypt.hash(student_password, 10);
    const s = await Student.create({ Student_id, Student_name, student_mobile, student_email, student_password: hashed });
    res.status(201).json({ message: 'Student registered', student: { Student_id: s.Student_id, Student_name: s.Student_name, student_mobile: s.student_mobile, student_email: s.student_email } });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Student_id or email already exists' });
    res.status(500).json({ message: err.message });
  }
});

// GET /students -> list all students (password hidden)
app.get('/students', async (req, res) => {
  const students = await Student.find({}, { student_password: 0, _id: 0 });
  res.json(students);
});

app.get('/health', (req, res) => res.json({ service: 'registration-service', status: 'ok' }));

mongoose.connect(MONGO_URI, { dbName: 'studentdb' })
  .then(() => {
    console.log('registration-service connected to MongoDB');
    app.listen(PORT, () => console.log(`registration-service on port ${PORT}`));
  })
  .catch((err) => { console.error('DB connection failed:', err.message); process.exit(1); });
