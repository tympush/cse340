const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  if (!/^\d+$/.test(classification_id)) {
    return next({ status: 400});
  }
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data && data[0] ? data[0].classification_name : "Unknown";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.invId;
  const vehicle = await invModel.getInventoryById(inv_id);
  if (!vehicle) {
    return next({ status: 404 });
  }
  const detail = utilities.buildDetailView(vehicle);
  let nav = await utilities.getNav();
  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
  res.render("./inventory/detail", {
    title,
    nav,
    detail,
    errors: null,
  });
}

/* ****************************************
*  Build Management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management Tools",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Build Add-Classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
* Process New Classification
* *************************************** */
invCont.addClassification = async function (req, res, next) { 
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  // --- Server-side validation ---
  if (!classification_name || !/^[a-zA-Z0-9]*$/.test(classification_name)) {
    req.flash("notice", "Please provide a valid classification name.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
    return
  }

  try {
    const classificationResult = await invModel.addClassification(classification_name)

    if (classificationResult) {
      req.flash("notice", `The ${classification_name} classification was successfully added.`)
      res.status(201).redirect("/inv/management")
    } else {
      req.flash("notice", "Sorry, adding the classification failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
* Build Add-Inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
  })
}

/* ****************************************
* Process New Inventory Submission
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
  } = req.body

  // --- Server-side validation ---
  let errors = []

  if (!inv_make || inv_make.length < 3) errors.push("Make must be at least 3 characters.")
  if (!inv_model || inv_model.length < 3) errors.push("Model must be at least 3 characters.")
  
  const parsedInvYear = parseInt(inv_year);
  if (isNaN(parsedInvYear) || parsedInvYear < 1900 || parsedInvYear > (new Date().getFullYear() + 1)) errors.push("Valid year is required.")
  
  if (!inv_description) errors.push("Description is required.")
  
  // Basic image path check
  if (!inv_image || !/^\/images\/vehicles\/.+\.(png|jpe?g|gif|webp)$/.test(inv_image)) errors.push("Valid image path is required (e.g., /images/vehicles/image.png).")
  if (!inv_thumbnail || !/^\/images\/vehicles\/.+-tn\.(png|jpe?g|gif|webp)$/.test(inv_thumbnail)) errors.push("Valid thumbnail path is required (e.g., /images/vehicles/image-tn.png).")
  
  // Custom parsing for price and miles: remove commas before parseFloat
  const cleanedInvPrice = inv_price ? inv_price.replace(/,/g, '') : ''; // Remove commas
  const parsedInvPrice = parseFloat(cleanedInvPrice); 

  if (isNaN(parsedInvPrice) || parsedInvPrice < 0 || !Number.isInteger(parsedInvPrice)) { 
      errors.push("Price must be a positive whole number (e.g., 25,000).") // Example with comma for user guidance
  }
  
  const cleanedInvMiles = inv_miles ? inv_miles.replace(/,/g, '') : ''; // Remove commas
  const parsedInvMiles = parseFloat(cleanedInvMiles); 

  if (isNaN(parsedInvMiles) || parsedInvMiles < 0 || !Number.isInteger(parsedInvMiles)) { 
      errors.push("Miles must be a positive whole number (e.g., 50,000).") // Example with comma for user guidance
  }

  if (!inv_color || !/^[a-zA-Z\s\-]+$/.test(inv_color)) errors.push("Color can only contain letters, spaces, and hyphens.")
  if (!classification_id || isNaN(classification_id)) errors.push("A classification must be selected.")


  if (errors.length > 0) {
    let classificationList = await utilities.buildClassificationList(classification_id) // Rebuild with selected value
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: { array: () => errors }, // Mimic express-validator errors object structure
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price, // Send back original input for sticky form
      inv_miles, // Send back original input for sticky form
      inv_color,
      classification_id,
    })
    return
  }

  // --- Call the model to add to the database ---
  try {
    const invResult = await invModel.addInventory(
      inv_make,
      inv_model,
      parsedInvYear, 
      inv_description,
      inv_image,
      inv_thumbnail,
      parsedInvPrice, 
      parsedInvMiles, 
      inv_color,
      classification_id
    )

    if (invResult) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully added to inventory.`)
      res.status(201).redirect("/inv/management") // Redirect to management page on success
    } else {
      req.flash("notice", "Sorry, adding the new vehicle failed.")
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null, // No specific validation errors, but a general failure
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
      })
    }
  } catch (error) {
    next(error) // Pass unexpected errors to Express error handler
  }
}

module.exports = invCont