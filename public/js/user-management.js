document.addEventListener('DOMContentLoaded', () => {
    const userManagementContainer = document.getElementById('userManagementContainer');

    // Check if the user list container exists
    if (userManagementContainer) {
        userManagementContainer.addEventListener('change', async (event) => {
            const target = event.target;
            
            // Check if the change event was on a select element with the class
            if (target && target.classList.contains('account-type-select')) {
                const row = target.closest('tr');
                const accountId = row.dataset.accountId;
                const newAccountType = target.value;

                // Send the update request to the server
                try {
                    const response = await fetch('/account/update-account-type', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            account_id: accountId,
                            account_type: newAccountType,
                        }),
                    });
                    const result = await response.json();

                    if (response.ok) {
                        // Display a success message
                        const successMessage = `<p class="notice">${result.message}</p>`;
                        userManagementContainer.insertAdjacentHTML('afterbegin', successMessage);
                        setTimeout(() => {
                            const noticeElement = userManagementContainer.querySelector('.notice');
                            if (noticeElement) {
                                noticeElement.remove();
                            }
                        }, 5000); // Remove message after 5 seconds
                    } else {
                        // Display an error message
                        const errorMessage = `<p class="notice error-notice">${result.error}</p>`;
                        userManagementContainer.insertAdjacentHTML('afterbegin', errorMessage);
                    }
                } catch (error) {
                    console.error('Error updating account type:', error);
                    const errorMessage = `<p class="notice error-notice">An unexpected error occurred.</p>`;
                    userManagementContainer.insertAdjacentHTML('afterbegin', errorMessage)
                }
            }
        });
    }
});