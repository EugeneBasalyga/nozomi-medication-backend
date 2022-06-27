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
    let token, user = null;
    if (emailAddress && password) {
      user = users.find((user) => {
        return user.emailAddress === emailAddress;
      });
      if (user) {
        if (user.password === password) {
          const { privateKey } = process.env;
          token = jwt.sign({ emailAddress: user.emailAddress }, privateKey, { expiresIn: '1h' });
          return res.json({ token: token, emailAddress: user.emailAddress });
        } else {
          return res.status(401).json({ field: 'password', error: 'Password is incorrect' });
        }
      } else {
        return res.status(401).json({ field: 'emailAddress', error: 'Email Address is incorrect' });
      }
    } else {
      return res.sendStatus(401);
    }
  }
  catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}