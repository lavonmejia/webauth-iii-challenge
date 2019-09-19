const Users = require('./API/usersAPImodel');
const jwt = require('jsonwebtoken');
const secrets = require('./AUTH/secrets')


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


Users.add({username: 'joe2222', password: 'tim', department: 'art'}).then(user => {
    console.log(generateToken(user));
})