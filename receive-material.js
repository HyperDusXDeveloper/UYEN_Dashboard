// receive-material.js

const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
let currentDate = new Date(2026, 3, 2); // April 2026
let selectedDate = new Date(2026, 3, 2);

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Header shows the selected date similar to mockup
    document.querySelector('.current-month').innerText = `${String(selectedDate.getDate()).padStart(2, '0')} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const calendarDays = document.getElementById('calendar-days');
    let html = `
        <div class="calendar-day-header sunday">Su</div>
        <div class="calendar-day-header">Mo</div>
        <div class="calendar-day-header">Tu</div>
        <div class="calendar-day-header">We</div>
        <div class="calendar-day-header">Th</div>
        <div class="calendar-day-header">Fr</div>
        <div class="calendar-day-header">Sa</div>
    `;

    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div></div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        const isSunday = new Date(year, month, i).getDay() === 0;
        const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

        let classes = 'calendar-day';
        if (isSunday) classes += ' sunday';
        if (isSelected) classes += ' active';

        html += `<div class="${classes}" onclick="selectDate(${year}, ${month}, ${i})">${i}</div>`;
    }

    calendarDays.innerHTML = html;
}

function selectDate(year, month, day) {
    selectedDate = new Date(year, month, day);
    // Optionally, we could adjust currentDate to match selected if we want
    renderCalendar();
}

function flashError(element) {
    const originalBorder = element.style.borderColor;
    element.style.borderColor = '#ef4444';
    setTimeout(() => {
        element.style.borderColor = originalBorder || '';
    }, 2000);
}

function openConfirmModal() {
    const matNameSelect = document.getElementById('receive-material-name');
    const matTypeSelect = document.getElementById('receive-material-type');
    const qtyInput = document.getElementById('receive-qty');
    const noteInput = document.getElementById('receive-note');

    let isValid = true;

    if (matNameSelect.selectedIndex <= 0) {
        isValid = false;
        flashError(matNameSelect);
    }

    if (matTypeSelect.selectedIndex <= 0) {
        isValid = false;
        flashError(matTypeSelect);
    }

    if (!qtyInput.value || parseInt(qtyInput.value) <= 0) {
        isValid = false;
        flashError(qtyInput);
    }

    if (!isValid) return;

    document.getElementById('confirm-name').value = document.getElementById('receive-name').value;
    document.getElementById('confirm-material-name').value = matNameSelect.options[matNameSelect.selectedIndex].text;
    document.getElementById('confirm-material-type').value = matTypeSelect.options[matTypeSelect.selectedIndex].text;
    document.getElementById('confirm-qty').value = qtyInput.value;
    document.getElementById('confirm-note').value = noteInput.value.trim() === '' ? '-' : noteInput.value;

    const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
    document.getElementById('confirm-date').value = formattedDate;

    document.getElementById('modal-confirm-receive').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function submitReceive() {
    closeModal('modal-confirm-receive');
    
    // Add row to table
    addReceiveRowToTable();
    
    // Reset form
    resetReceiveForm();
    
    alert('บันทึกข้อมูลเรียบร้อย!');
}

function addReceiveRowToTable() {
    const name = document.getElementById('confirm-name').value || "-";
    const matName = document.getElementById('confirm-material-name').value || "-";
    const matType = document.getElementById('confirm-material-type').value || "-";
    const qty = document.getElementById('confirm-qty').value || "0";
    const note = document.getElementById('confirm-note').value || "-";
    
    const tbody = document.querySelector('.receive-table tbody');
    if (!tbody) return;

    // Use selectedDate and current time for "Date Received"
    const now = new Date();
    const thaiShortMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    // Format: 13 ก.พ. 2026 21:58
    const dateStr = `${String(selectedDate.getDate()).padStart(2, '0')} ${thaiShortMonths[selectedDate.getMonth()]} ${selectedDate.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${matName}</td>
        <td>${matType}</td>
        <td>${qty}</td>
        <td>${dateStr}</td>
        <td class="dash-red">${note}</td>
    `;

    // Prepend to show latest at top
    tbody.insertBefore(newRow, tbody.firstChild);

    // Update alternating row colors
    Array.from(tbody.rows).forEach((row, index) => {
        if (index % 2 === 1) {
            row.classList.add('alt-row');
        } else {
            row.classList.remove('alt-row');
        }
    });
}

function resetReceiveForm() {
    document.getElementById('receive-material-name').selectedIndex = 0;
    document.getElementById('receive-material-type').selectedIndex = 0;
    document.getElementById('receive-qty').value = '0';
    document.getElementById('receive-note').value = '';
    
    // Reset selection indicators
    document.querySelectorAll('.receive-select').forEach(select => {
        select.classList.remove('has-value');
    });
    
    // Reset calendar to default (optional, keeping current date usually better)
}

document.querySelector('.prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);

    // Auto select a valid day in the new month so the display header changes
    const maxDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const newDay = Math.min(selectedDate.getDate(), maxDays);
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), newDay);

    renderCalendar();
});

document.querySelector('.next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);

    const maxDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const newDay = Math.min(selectedDate.getDate(), maxDays);
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), newDay);

    renderCalendar();
});

window.onload = () => {
    syncReceiverName();
    renderCalendar();

    // Ensure select has placeholder color behavior if needed
    const selectEls = document.querySelectorAll('.receive-select');
    selectEls.forEach(selectEl => {
        selectEl.addEventListener('change', function () {
            this.classList.add('has-value');
        });
    });
};

/**
 * Syncs the name input with the username displayed in the navbar
 */
function syncReceiverName() {
    // Wait for navbar to load
    const checkNavbar = setInterval(() => {
        const navbarUsername = document.querySelector('.username');
        const nameInput = document.getElementById('receive-name');
        
        if (navbarUsername && nameInput) {
            nameInput.value = navbarUsername.innerText.trim();
            clearInterval(checkNavbar);
        }
    }, 100);

    // Timeout after 3 seconds
    setTimeout(() => clearInterval(checkNavbar), 3000);
}
