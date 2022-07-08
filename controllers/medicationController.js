const jwt = require('jsonwebtoken');

const medications = [
  {
    name: 'OxyContin',
    count: 5,
    destinationCount: 15,
  },
  {
    name: 'Baclofen',
    count: 0,
    destinationCount: 25,
  },
  {
    name: 'Celexa',
    count: 12,
    destinationCount: 12,
  },
];

exports.verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const accessToken = authorization.replace('Bearer ','');
    const { privateKey } = process.env;
    try {
      jwt.verify(accessToken, privateKey);
      next();
    }
    catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(401);
  }
}

exports.medications = async (req, res) => {
  return res.json(medications);
}