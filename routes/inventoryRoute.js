// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

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

// Process the new classification data
router.post(
  "/add-classification",
  invController.addClassification
);
// Route to process Add-Inventory submission
router.post(
  "/add-inventory",
  invController.addInventory
);

module.exports = router;