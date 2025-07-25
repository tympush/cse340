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
            if (priceInput) {
                priceInput.value = priceInput.value.replace(/,/g, '');
            }
            if (milesInput) {
                milesInput.value = milesInput.value.replace(/,/g, '');
            }
        });
    }
});