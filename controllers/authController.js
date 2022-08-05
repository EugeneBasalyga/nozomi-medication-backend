const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const users = [
  {
    id: 'af54a9ab-41ad-405d-be0e-b3a995fbcf5c',
    emailAddress: 'zhekabas@gmail.com',
    password: 'aboba',
  },
  {
    id: '2e72da47-cf10-4972-9194-53809d9e65a1',
    emailAddress: 'test@gmail.com',
    password: '12345',
  },
  {
    id: '20324532-21a9-41d7-8b09-d663ce356849',
    emailAddress: 'eugene@gmail.com',
    password: '99999',
  }
];

const sessions = [

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
    sessions.push({
      id: uuid.v4(),
      userId: user.id,
      accessToken: accessToken,
    });

    return res.json({ accessToken: accessToken, emailAddress: user.emailAddress });
  }
  catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

exports.register = async (req, res) => {
  try {
    const { emailAddress, password, repeatPassword } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

    if (!emailAddress || !password || !repeatPassword) {
      return res.sendStatus(400);
    }

    if (password !== repeatPassword) {
      return res.status(400).json({ field: 'repeatPassword', error: 'Your password and confirmation password do not match' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ field: 'password', error: 'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters' });
    }

    const existedUser = users.find((user) => user.emailAddress === emailAddress);

    if (existedUser) {
      return res.status(400).json({ field: 'emailAddress', error: 'User with such email address already exists' });
    }

    const user = {
      id: uuid.v4(),
      emailAddress: emailAddress,
      password: password
    };

    const { privateKey } = process.env;
    const accessToken = jwt.sign({ emailAddress: user.emailAddress }, privateKey, { expiresIn: '1h' });
    sessions.push({
      id: uuid.v4(),
      userId: user.id,
      accessToken: accessToken,
    });
    users.push(user);

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
    jwt.verify(accessToken, privateKey);
    const userSession = sessions.find((session) => session.accessToken === accessToken);
    if (!userSession) {
      return res.sendStatus(401);
    }
    const user = users.find((user) => user.id === userSession.userId);
    if (!user) {
      return res.sendStatus(401);
    }
    return res.json( { emailAddress: user.emailAddress } );
  }
  catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
}

exports.users = users;
exports.sessions = sessions;
