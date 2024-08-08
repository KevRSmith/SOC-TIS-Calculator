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

    function addDateFields() {
        if (fieldCount >= 10) return;
        fieldCount++;
        const newFields = document.createElement('div');
        newFields.innerHTML = `
            <div class="date-field">
                <label for="end-date-${fieldCount}">Series End Date (MM/DD/YYYY):</label>
                <input type="text" id="end-date-${fieldCount}">
            </div>
            <div class="date-field">
                <label for="start-date-${fieldCount}">Series Start Date (MM/DD/YYYY):</label>
                <input type="text" id="start-date-${fieldCount}">
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

        function processDates(startId, endId) {
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

        daysResult.textContent = totalDays;
        yearsResult.textContent = (totalDays / 365.25).toFixed(3);
        resultsDiv.style.display = 'block';
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
});
