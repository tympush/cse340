// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

// Route to show the login view when "My Account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Registration Route
router.get("/registration", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
)
// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router