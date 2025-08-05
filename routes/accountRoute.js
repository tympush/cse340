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
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route to check if the user is an employee or admin
router.get("/", accountController.checkEmployeeOrAdminRedirect, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build account update view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdateView))

// Process the account update request
router.post(
  "/update-account",
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process the password change request
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

// Route to user management view
router.get("/user-management", utilities.checkLogin, accountController.checkAdminRedirect, utilities.handleErrors(accountController.buildUserManagement))

// Process the account type change request
router.post("/update-account-type", utilities.checkLogin, utilities.handleErrors(accountController.updateAccountType));

module.exports = router
