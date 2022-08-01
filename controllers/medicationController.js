const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const medications = [
  {
    id: uuid.v4(),
    name: 'OxyContin',
    description: 'test',
    count: 5,
    destinationCount: 15,
  },
  {
    id: uuid.v4(),
    name: 'Baclofen',
    description: 'test',
    count: 0,
    destinationCount: 25,
  },
  {
    id: uuid.v4(),
    name: 'Celexa',
    description: 'test',
    count: 12,
    destinationCount: 12,
  },
];

exports.verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }
  const accessToken = req.headers.authorization.split(' ')[1];
  const { privateKey } = process.env;
  try {
    jwt.verify(accessToken, privateKey);
    next();
  }
  catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
}

exports.getMedications = async (req, res) => {
  return res.json(medications);
}

exports.postMedication = async (req, res) => {
  const newMedication = {...req.body, id: uuid.v4()};
  medications.push(newMedication);
  res.status(201).json(newMedication);
}

exports.getMedication = async (req, res) => {
  const medication = medications.find((medication) => medication.id === req.params.id);
  if (!medication) {
    return res.sendStatus(404);
  }
  return res.json(medication);
}


exports.putMedication = async (req, res) => {
  var medicationIndex = medications.findIndex((medication) => medication.id === req.params.id);
  if (medicationIndex === -1) {
    return res.sendStatus(404);
  }
  medications[medicationIndex] = req.body;
  return res.json(medications[medicationIndex]);
}

exports.patchMedication = async (req, res) => {
  var medicationIndex = medications.findIndex((medication) => medication.id === req.params.id);
  if (medicationIndex === -1) {
    return res.sendStatus(404);
  }
  if (req.body.count !== undefined) {
    medications[medicationIndex].count = req.body.count;
    return res.json(medications[medicationIndex]);
  }
}

exports.deleteMedication = async (req, res) => {
  var medicationIndex = medications.findIndex((medication) => medication.id === req.params.id);
  if (medicationIndex === -1) {
    return res.sendStatus(404);
  }
  medications.splice(medicationIndex, 1);
  return res.sendStatus(200);
}
