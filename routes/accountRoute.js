// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

// Route to show the login view when "My Account" is clicked
router.get("/", utilities.handleErrors(accountController.buildLogin))
router.get("/login", utilities.handleErrors(accountController.buildLogin))

module.exports = router