// Delete microservice: removes a student from the database by Student_id.
const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

const studentSchema = new mongoose.Schema({
  Student_id: String,
  Student_name: String,
  student_mobile: String,
  student_email: String,
  student_password: String,
}, { collection: 'students', versionKey: false });
const Student = mongoose.model('Student', studentSchema);

const app = express();
app.use(express.json());

// DELETE /students/:id -> delete one student
app.delete('/students/:id', async (req, res) => {
  try {
    const s = await Student.findOneAndDelete({ Student_id: req.params.id });
    if (!s) return res.status(404).json({ message: `Student ${req.params.id} not found` });
    res.json({ message: 'Student deleted', student: { Student_id: s.Student_id, Student_name: s.Student_name, student_mobile: s.student_mobile, student_email: s.student_email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/health', (req, res) => res.json({ service: 'delete-service', status: 'ok' }));

mongoose.connect(MONGO_URI, { dbName: 'studentdb' })
  .then(() => {
    console.log('delete-service connected to MongoDB');
    app.listen(PORT, () => console.log(`delete-service on port ${PORT}`));
  })
  .catch((err) => { console.error('DB connection failed:', err.message); process.exit(1); });
