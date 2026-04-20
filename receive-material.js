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
    const matSelect = document.getElementById('receive-material');
    const qtyInput = document.getElementById('receive-qty');
    const noteInput = document.getElementById('receive-note');

    let isValid = true;

    if (matSelect.selectedIndex <= 0) {
        isValid = false;
        flashError(matSelect);
    }

    if (!qtyInput.value || parseInt(qtyInput.value) <= 0) {
        isValid = false;
        flashError(qtyInput);
    }

    if (!isValid) return;

    document.getElementById('confirm-name').value = document.getElementById('receive-name').value;
    document.getElementById('confirm-material').value = matSelect.options[matSelect.selectedIndex].text;
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
    // reset form or add to table logic can be placed here
    alert('บันทึกข้อมูลเรียบร้อย!');
    // reset logic:
    // document.getElementById('receive-material').selectedIndex = 0;
    // document.getElementById('receive-qty').value = 0;
    // document.getElementById('receive-note').value = "";
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
    renderCalendar();

    // Ensure select has placeholder color behavior if needed
    const selectEl = document.querySelector('.receive-select');
    selectEl.addEventListener('change', function () {
        this.classList.add('has-value');
    });
};
