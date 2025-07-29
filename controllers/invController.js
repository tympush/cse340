const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
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
 * Build vehicle detail view
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
* Build Management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management Tools",
    nav,
    errors: null,
    classificationList,
  })
}

/* ****************************************
* Build Add-Classification view
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

  // Custom parsing for price and miles: remove commas before parseFloat
  const cleanedInvPrice = inv_price ? inv_price.replace(/,/g, '') : '';
  const parsedInvPrice = parseFloat(cleanedInvPrice);

  const cleanedInvMiles = inv_miles ? inv_miles.replace(/,/g, '') : '';
  const parsedInvMiles = parseFloat(cleanedInvMiles);


  // --- Call the model to add to the database ---
  try {
    const invResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
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

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ****************************************
* Process New Inventory Edit
* *************************************** */
invCont.editInventory = async function (req, res, next) {
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

  const cleanedInvPrice = inv_price ? inv_price.replace(/,/g, '') : '';
  const parsedInvPrice = parseFloat(cleanedInvPrice);

  const cleanedInvMiles = inv_miles ? inv_miles.replace(/,/g, '') : '';
  const parsedInvMiles = parseFloat(cleanedInvMiles);


  try {
    const invResult = await invModel.editInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      parsedInvPrice,
      parsedInvMiles,
      inv_color,
      classification_id
    )

    if (invResult) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully edited in inventory.`)
      res.status(201).redirect("/inv/management")
    } else {
      req.flash("notice", "Sorry, editting the vehicle failed.")
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit Vehicle",
        nav,
        classificationList,
        errors: null,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Process update inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body

  // Custom parsing for price and miles: remove commas before parseFloat
  const cleanedInvPrice = inv_price ? inv_price.replace(/,/g, '') : '';
  const parsedInvPrice = parseFloat(cleanedInvPrice);

  const cleanedInvMiles = inv_miles ? inv_miles.replace(/,/g, '') : '';
  const parsedInvMiles = parseFloat(cleanedInvMiles);

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    parsedInvPrice,
    parsedInvMiles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
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
  }
}

module.exports = invCont