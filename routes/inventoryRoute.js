// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation") // Import the new validation file

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build vehicle detail view
router.get("/detail/:invId", invController.buildDetailView);
// Route to build management view
router.get("/management/", invController.buildManagement);
// Route to add-classification view
router.get("/add-classification/", invController.buildAddClassification);
// Route to build Add-Inventory view
router.get("/add-inventory", invController.buildAddInventory);
// Route to display inventory in management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Route to build edit inventory view
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventoryView));
// Route to build delete inventory view
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteInventoryView));

// Process the new classification data
router.post(
  "/add-classification",
  invController.addClassification
);
// Route to process Add-Inventory submission
router.post(
  "/add-inventory",
  invValidate.newInventoryRules(), // Add validation rules
  invValidate.checkAddData, // Add checkAddData middleware
  invController.addInventory
);
// Route to process the edit inventory form submission
router.post(
  "/update/",
  invValidate.newInventoryRules(), // validation rules
  invValidate.checkUpdateData, // middleware
  utilities.handleErrors(invController.updateInventory)
);
// Route to process the delete inventory form submission
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;