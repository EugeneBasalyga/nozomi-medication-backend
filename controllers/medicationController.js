const uuid = require('uuid');

const medications = [
  {
    id: uuid.v4(),
    userId: '2e72da47-cf10-4972-9194-53809d9e65a1',
    name: 'OxyContin',
    description: 'test',
    count: 5,
    destinationCount: 15,
    updatedAt: Date.now(),
  },
  {
    id: uuid.v4(),
    userId: '2e72da47-cf10-4972-9194-53809d9e65a1',
    name: 'Baclofen',
    description: 'test',
    count: 0,
    destinationCount: 25,
    updatedAt: Date.now(),
  },
  {
    id: uuid.v4(),
    userId: 'af54a9ab-41ad-405d-be0e-b3a995fbcf5c',
    name: 'Celexa',
    description: 'test',
    count: 12,
    destinationCount: 12,
    updatedAt: Date.now(),
  },
];

exports.getMedications = async (req, res) => {
  const userMedications = medications.filter((medication) => medication.userId === req.user.id);
  return res.json(userMedications);
}

exports.postMedication = async (req, res) => {
  const newMedication = {...req.body, id: uuid.v4(), userId: req.user.id, updatedAt: Date.now()};
  medications.push(newMedication);
  res.status(201).json(newMedication);
}

exports.getMedication = async (req, res) => {
  const medication = medications.find((medication) => medication.id === req.params.id && medication.userId === req.user.id);
  if (!medication) {
    return res.sendStatus(404);
  }
  return res.json(medication);
}


exports.putMedication = async (req, res) => {
  var medicationIndex = medications.findIndex((medication) => medication.id === req.params.id && medication.userId === req.user.id);
  if (medicationIndex === -1) {
    return res.sendStatus(404);
  }
  medications[medicationIndex] = req.body;
  medications[medicationIndex].updatedAt = Date.now();
  return res.json(medications[medicationIndex]);
}

exports.patchMedication = async (req, res) => {
  var medicationIndex = medications.findIndex((medication) => medication.id === req.params.id && medication.userId === req.user.id);
  if (medicationIndex === -1) {
    return res.sendStatus(404);
  }
  if (req.body.count !== undefined) {
    medications[medicationIndex].count = req.body.count;
    medications[medicationIndex].updatedAt = Date.now();
    return res.json(medications[medicationIndex]);
  }
}

exports.deleteMedication = async (req, res) => {
  var medicationIndex = medications.findIndex((medication) => medication.id === req.params.id && medication.userId === req.user.id);
  if (medicationIndex === -1) {
    return res.sendStatus(404);
  }
  medications.splice(medicationIndex, 1);
  return res.sendStatus(200);
}
