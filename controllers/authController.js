const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const users = [
  {
    id: uuid.v4(),
    emailAddress: 'zhekabas@gmail.com',
    password: 'aboba'
  },
  {
    id: uuid.v4(),
    emailAddress: 'test@gmail.com',
    password: '12345'
  },
  {
    id: uuid.v4(),
    emailAddress: 'eugene@gmail.com',
    password: '99999'
  }
];

exports.login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress || !password) {
      return res.sendStatus(400);
    }

    const user = users.find((user) => user.emailAddress === emailAddress);

    if (!user) {
      return res.status(400).json({ field: 'emailAddress', error: 'Email Address is incorrect' });
    }

    if (user.password !== password) {
      return res.status(400).json({ field: 'password', error: 'Password is incorrect' });
    }

    const { privateKey } = process.env;
    const accessToken = jwt.sign({ emailAddress: user.emailAddress }, privateKey, { expiresIn: '1h' });

    return res.json({ accessToken: accessToken, emailAddress: user.emailAddress });
  }
  catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

exports.currentSession = async (req, res) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }
  const accessToken = req.headers.authorization.split(' ')[1];
  const { privateKey } = process.env;
  try {
    const user = jwt.verify(accessToken, privateKey);
    return res.json( { emailAddress: user.emailAddress } );
  }
  catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
}
