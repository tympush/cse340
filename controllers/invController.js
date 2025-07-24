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

module.exports = invCont