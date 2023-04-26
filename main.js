const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://admin:admin@cluster0.8unxxd0.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Doctor schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// Define Patient schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  medicalHistory: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
});

// Define Appointment schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentTime: { type: Date, required: true }
});

// Create models
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.post('/api/doctors', async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    specialization: req.body.specialization,
    email: req.body.email,
    password: req.body.password
  });

  try {
    await doctor.save();
    res.send(doctor);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/api/doctors/:id/patients', async (req, res) => {
  const doctorId = req.params.id;

  try {
    const patients = await Patient.find({ doctorId }).select('-password');
    res.send(patients);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post('/api/patients', async (req, res) => {
  const patient = new Patient({
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    email: req.body.email,
    password: req.body.password,
    medicalHistory: req.body.medicalHistory,
    doctorId: req.body.doctorId
  });

  try {
    await patient.save();
    res.send(patient);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.send(doctors);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/api/doctors/:id', async (req, res) => {
  const doctorId = req.params.id;

try {
const doctor = await Doctor.findById(doctorId).select('-password');
res.send(doctor);
} catch (error) {
console.error(error.message);
res.status(500).send('Server Error');
}
});

app.post('/api/appointments', async (req, res) => {
    const appointment = new Appointment({
    patientId: req.body.patientId,
    doctorId: req.body.doctorId,
    appointmentTime: req.body.appointmentTime
    });
    
    try {
    await appointment.save();
    res.send(appointment);
    } catch (err) {
    res.status(400).send(err.message);
    }
    });

    app.get('/api/patients/:id/appointments', async (req, res) => {
        const patientId = req.params.id;
        
        try {
        const appointments = await Appointment.find({ patientId }).populate('doctorId', 'name specialization');
        res.send(appointments);
        } catch (err) {
        res.status(400).send(err.message);
        }
        });

        app.get('/api/doctors/:id/appointments', async (req, res) => {
            const doctorId = req.params.id;
            
            try {
            const appointments = await Appointment.find({ doctorId }).populate('patientId', 'name age address medicalHistory');
            res.send(appointments);
            } catch (err) {
            res.status(400).send(err.message);
            }
            });

            const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));