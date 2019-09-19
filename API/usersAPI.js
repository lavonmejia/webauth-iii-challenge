const express = require('express');
// const helmet = require('helmet');
// const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../AUTH/secrets')


const db = require('../DATABASE/db-config');
const Users = require('../API/usersAPImodel');
const restricted = require('../AUTH/restricted-middleware');

const api = express();

api.use(express.json());
// api.use(helmet());
// api.use(cors());


api.post('/api/register', (req, res) => {
    console.log(req.body);
    let { username, password, department } = req.body;


    const hash = bcrypt.hashSync(password, 8); // it's 2 ^ 8, not 8 rounds

    Users.add({username: username, password: hash, department: department})
        .then(saved => {
            console.log(saved)
            res.status(201).json(saved);

        })
        .catch(error => {
            res.status(500).json(error);
        });
});

api.post('/api/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                console.log(token)
                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };
    const options = {
        expiresIn: '1d',
    };
    // bring in the secret from the secrets file
    return jwt.sign(payload, secrets.jwtSecret, options);
}


api.get('/api/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json({ users, loggedInUser: req.user.username });
        })
        .catch(err => res.send(err));
});

module.exports = api;


// api.post('/api/login', (req, res) => {
//   let { username, password, department } = req.body;

//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         req.session.user = user;
//         res.status(200).json({ message: `Welcome ${user.username}!` });
//       } else {
//         res.status(401).json({ message: 'You cannot pass!' });
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });



// api.get('/api/users', restricted, (req, res) => {
//   Users.find()
//     .then(users => {
//       res.json(users);
//     })
//     .catch(err => res.send(err));
// });



// api.get('/hash', (req, res) => {
//   const name = req.query.name;

//   // hash the name
//   const hash = bcrypt.hashSync(name, 8); // use bcryptjs to hash the name
//   res.send(`the hash for ${name} is ${hash}`);
// });


// api.get('/logout', (req, res) => {
//   if (req.session) {
//     req.session.destroy(error => {
//       if (error) {
//         res.status(500).json({
//           message:
//             'you can check out anytime you like, but you can never leave',
//         });
//       } else {
//         res.status(200).json({ message: 'bye' });
//       }
//     });
//   } else {
//     res.status(200).json({ message: 'already logged out' });
//   }
// });

module.exports = api; 