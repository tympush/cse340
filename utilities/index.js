const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  /*console.log(data.rows)*/
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML 
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      /*grid += '<hr />'*/
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML 
* ************************************ */
Util.buildDetailView = function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  let detail = '<div class="vehicle-detail">';
  detail += `<div class="vehicle-image-container">`
  detail += `<p>This vehicle has passed inspection by an ASE-certified technician.</p>`;
  detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`;
  detail += `</div>`;
  detail += `<div class="vehicle-info-container">`;
  detail += `<div class="price-tag">`
  detail += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  detail += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
  detail += `</div>`;
  detail += `<div class="description-tag">`
  detail += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  detail += `<p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`;
  detail += `</div>`;
  detail += `</div>`;
  detail += '</div>';
  return detail;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util