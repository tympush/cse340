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
// Route to build management view
router.get("/add-classification/", invController.buildAddClassification);

// Process the new classification data
router.post(
  "/add-classification",
  invController.addClassification
);

module.exports = router;