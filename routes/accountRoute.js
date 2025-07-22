// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

// Route to show the login view when "My Account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Registration Route
router.get("/registration", utilities.handleErrors(accountController.buildRegister))
// Enable the Registration Route (uses post method)
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router