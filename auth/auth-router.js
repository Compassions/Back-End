const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../user/user-model.js");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets.js");

// User registration
router.post("/register", async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    try {
        const newUser = await User.create(user);
        res.status(201).json(newUser);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// User Login
router.post("/login", (req, res) => {
    let { username, password } = req.body;

    if (req.body) {
        User.findBy({ username })
        .first()
        .then((user) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({ 
                    message: "Login Successfully",
                    userID: user.id,
                    token: token
                });
            }
            else {
                res.status(401).json({ message: "Invalid credentails, please try again. "});
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        });
    }
    else {
      res.status(400).json({ message: "Please enter username and password" });
    }
});

const generateToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const secret = jwtSecret;
    const options = {
        expiresIn: "30m"
    };
    const token = jwt.sign(payload, secret, options);
    return token;
}

module.exports = router;