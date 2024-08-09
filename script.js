document.addEventListener('DOMContentLoaded', (event) => {

    const addFieldsBtn = document.getElementById('add-fields');
    const removeFieldsBtn = document.getElementById('remove-fields');
    const calculateBtn = document.getElementById('calculate');
    const instructionsBtn = document.getElementById('instructions');
    const additionalFields = document.getElementById('additional-fields');
    const resultsDiv = document.getElementById('results');
    const daysResult = document.getElementById('days-result');
    const yearsResult = document.getElementById('years-result');
    const modal = document.getElementById('instructions-modal');
    const closeModal = document.getElementsByClassName('close')[0];

    let fieldCount = 0;

    // Function to parse and validate date format
    function parseDate(dateStr) {
        const formats = ['MM/DD/YYYY', 'MM/DD/YY'];
        for (let format of formats) {
            const date = moment(dateStr, format, true);
            if (date.isValid()) {
                return date;
            }
        }
        return null;
    }

    function showError(input, message) {
        clearError(input);
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.style.color = 'red';
        errorSpan.innerText = message;
        input.parentElement.appendChild(errorSpan);
    }

    function clearError(input) {
        const error = input.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    function validateDateInput(inputId) {
        const input = document.getElementById(inputId);
        const datePattern = /^\d{2}\/\d{2}\/\d{2,4}$/;
        
    if (input.value.trim() === '') {
        clearError(input);
        return true;    
    }

    if (!datePattern.test(input.value)) {
        showError(input, "Enter Date in MM/DD/YY or MM/DD/YYYY format");
        return false;
    } else {
        clearError(input);
        return true;
    }
}

    function addDateFields() {
        if (fieldCount >= 10) return;
        fieldCount++;
        const newFields = document.createElement('div');
        newFields.innerHTML = `
            <div class="date-field">
                <label for="end-date-${fieldCount}">Series End Date (MM/DD/YYYY):</label>
                <input type="text" id="end-date-${fieldCount}" onblur="validateDateInput('end-date-${fieldCount}')">
            </div>
            <div class="date-field">
                <label for="start-date-${fieldCount}">Series Start Date (MM/DD/YYYY):</label>
                <input type="text" id="start-date-${fieldCount}" onblur="validateDateInput('start-date-${fieldCount}')">
            </div>
        `;
        additionalFields.appendChild(newFields);
    }

    function removeDateFields() {
        if (fieldCount > 0) {
            additionalFields.removeChild(additionalFields.lastChild);
            fieldCount--;
        }
    }

    function calculateDays() {
        let totalDays = 0;
        let allValid = true;

        function processDates(startId, endId) {
            const startDateValid = validateDateInput(startId);
            const endDateValid = validateDateInput(endId);
            if (!startDateValid || !endDateValid) {
                allValid = false;
                return;
            }

            const startDate = parseDate(document.getElementById(startId).value);
            const endDate = parseDate(document.getElementById(endId).value);
            if (startDate && endDate) {
                totalDays += endDate.diff(startDate, 'days') + 1;
            }
        }

        processDates('start-date', 'end-date');

        for (let i = 1; i <= fieldCount; i++) {
            processDates(`start-date-${i}`, `end-date-${i}`);
        }

        if (allValid) {
            daysResult.textContent = totalDays;
            yearsResult.textContent = (totalDays / 365.25).toFixed(3);
            resultsDiv.style.display = 'block';
        }
    }

     addFieldsBtn.addEventListener('click', addDateFields);
    removeFieldsBtn.addEventListener('click', removeDateFields);
    calculateBtn.addEventListener('click', calculateDays);

    instructionsBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    document.getElementById('start-date').addEventListener('blur', () => validateDateInput('start-date'));
    document.getElementById('end-date').addEventListener('blur', () => validateDateInput('end-date'));
});

