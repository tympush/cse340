const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.newInventoryRules = () => {
  return [
    // inv_make is required and must be at least 3 characters
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."), // on error this message is sent.

    // inv_model is required and must be at least 3 characters
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."), // on error this message is sent.

    // inv_year is required and must be a valid year
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid year."),

    // inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),

    // inv_image is required and must be a valid path
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^\/images\/vehicles\/.+\.(png|jpe?g|gif|webp)$/)
      .withMessage("Image path must start with /images/vehicles/ and have a valid file extension."),

    // inv_thumbnail is required and must be a valid path
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^\/images\/vehicles\/.+-tn\.(png|jpe?g|gif|webp)$/)
      .withMessage("Thumbnail path must start with /images/vehicles/ and have a valid file extension."),

    // inv_price is required and must be a positive whole number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .customSanitizer(value => value.replace(/,/g, '')) // Remove commas before validation
      .isInt({ min: 0 })
      .withMessage("Price must be a positive whole number (e.g., 25,000)."),

    // inv_miles is required and must be a positive whole number
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .customSanitizer(value => value.replace(/,/g, '')) // Remove commas before validation
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive whole number (e.g., 50,000)."),

    // inv_color is required and can only contain letters, spaces, and hyphens
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[a-zA-Z\s\-]+$/)
      .withMessage("Color can contain letters, spaces, and hyphens only."),

    // classification_id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("A classification must be selected."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkAddData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to update inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate