const jwt = require('jsonwebtoken');

const users = [
  {
    emailAddress: 'zhekabas@gmail.com',
    password: 'aboba'
  },
  {
    emailAddress: 'test@gmail.com',
    password: '12345'
  },
  {
    emailAddress: 'eugene@gmail.com',
    password: '99999'
  }
]

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
    const token = jwt.sign({ emailAddress: user.emailAddress }, privateKey, { expiresIn: '1h' });

    return res.json({ token: token, emailAddress: user.emailAddress });
  }
  catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}