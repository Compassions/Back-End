const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/secrets.js");
const e = require('express');

module.exports = (req, res, next) => {

    try {
        if (!req.headers.authorization) {
            throw new Error ("Missing <authorization> key in header")
        }
        else {
            const token = req.headers.authorization.split(" ")[1];
            if (token) {
                jwt.verify(token, jwtSecret, (err, decodedToken) => {
                    if (err) {
                        res.status(401).json({ message: "Invalid Credential" });
                    } 
                    else {
                        req.decodedJwt = decodedToken;
                        next();
                    }
                })
            } 
            else {
                throw new Error('Invalid authentication data, please check header');
            }
        }
    } 
    catch (err) {
    res.status(401).json({ error: err.message });
    }
};