/* ****************************************
 * For formatting user inputs with commas on the Add Inventory from
 **************************************** */

// import elements from add inventory form
document.addEventListener('DOMContentLoaded', function() {
    const priceInput = document.getElementById('inv_price');
    const milesInput = document.getElementById('inv_miles');
    const addInvForm = document.getElementById('addInvForm');

    //Function to format a number string with US commas
    function formatNumberWithCommas(numberString) {
        let cleanString = numberString.replace(/[^\d]/g, '');

        let num = parseInt(cleanString, 10);

        if (isNaN(num)) {
            return '';
        }

        // use 'en-US' locale to ensure commas are added correctly
        return num.toLocaleString('en-US');
    }

    // Function to apply formatting when the page loads (for sticky data)
    function applyFormattingToInputs() {
        if (priceInput && priceInput.value) {
            priceInput.value = formatNumberWithCommas(priceInput.value);
        }
        if (milesInput && milesInput.value) {
            milesInput.value = formatNumberWithCommas(milesInput.value);
        }
    }

    if (priceInput) { // check that element exists
        priceInput.addEventListener('input', function() {
            let start = this.selectionStart;
            let end = this.selectionEnd;
            let oldValueLength = this.value.length;

            this.value = formatNumberWithCommas(this.value);

            let newValueLength = this.value.length;
            let newCursorPosition = start + (newValueLength - oldValueLength);
            this.setSelectionRange(newCursorPosition, newCursorPosition);
        });
    }

    if (milesInput) { // check that element exists
        milesInput.addEventListener('input', function() {
            // Store cursor position
            let start = this.selectionStart;
            let end = this.selectionEnd;
            let oldValueLength = this.value.length;

            this.value = formatNumberWithCommas(this.value);

            let newValueLength = this.value.length;
            let newCursorPosition = start + (newValueLength - oldValueLength);
            this.setSelectionRange(newCursorPosition, newCursorPosition);
        });
    }

    if (addInvForm) {
        addInvForm.addEventListener('submit', function(event) {
            // Create hidden input fields for cleaned values
            if (priceInput) {
                const hiddenPriceInput = document.createElement('input');
                hiddenPriceInput.type = 'hidden';
                hiddenPriceInput.name = 'inv_price'; //this will overwrite the visible input's value.
                hiddenPriceInput.value = priceInput.value.replace(/,/g, '');
                addInvForm.appendChild(hiddenPriceInput);
            }
            if (milesInput) {
                const hiddenMilesInput = document.createElement('input');
                hiddenMilesInput.type = 'hidden';
                hiddenMilesInput.name = 'inv_miles'; //this will overwrite the visible input's value.
                hiddenMilesInput.value = milesInput.value.replace(/,/g, '');
                addInvForm.appendChild(hiddenMilesInput);
            }

            //Remove the 'name' attribute from the original inputs so they are not submitted.
            if (priceInput) priceInput.removeAttribute('name');
            if (milesInput) milesInput.removeAttribute('name');
        });
    }

    // Apply formatting to inputs on page load for sticky data
    applyFormattingToInputs();
});