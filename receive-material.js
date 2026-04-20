// receive-material.js

const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
let currentDate = new Date(2026, 3, 2); // April 2026
let selectedDate = new Date(2026, 3, 2);

const RECEIVE_MATERIAL_DATA = {
    "A4": ["ธรรมดา", "ธรรมดา 80 แกรม", "ธรรมดา 100 แกรม", "สติ๊กเกอร์", "แผ่นปกใส"],
    "A5": ["ธรรมดา", "สติ๊กเกอร์", "กระดาษอาร์ตมัน", "ร้อยปอนด์", "กระดาษปก"],
    "หมึก": ["ดำ", "น้ำเงิน", "แดง", "เหลือง", "EPSON GI-71"],
    "เทป": ["ชนิดใส", "สก๊อตช์เทป", "เทปผ้า", "เทปกาว 2 หน้า", "เทปใส 3M"],
    "คลิปหนีบกระดาษ": ["อันเล็ก", "อันกลาง", "อันใหญ่", "แบบสี", "แบบเหล็ก"],
    "กรรไกร": ["เล็ก", "กลาง", "ใหญ่", "สำหรับตัดกระดาษ", "สำหรับงานประดิษฐ์"],
    "ลวดเย็บกระดาษ": ["35 MM", "10 MM", "เบอร์ 10", "เบอร์ 3", "แบบหนาพิเศษ"]
};

let selectedMaterial = "";
let selectedType = "";

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
    renderCalendar();
}

/**
 * Custom Dropdown Logic
 */
function toggleReceiveDropdown(listId) {
    // Close other dropdowns
    document.querySelectorAll('.custom-dropdown-list').forEach(el => {
        if (el.id !== listId) {
            el.classList.add('hidden');
            el.closest('.custom-dropdown-container').classList.remove('open');
        }
    });

    const list = document.getElementById(listId);
    const container = list.closest('.custom-dropdown-container');
    const isHidden = list.classList.contains('hidden');

    if (isHidden) {
        list.classList.remove('hidden');
        container.classList.add('open');
    } else {
        list.classList.add('hidden');
        container.classList.remove('open');
    }
}

function initReceiveDropdowns() {
    const matList = document.getElementById('list-receive-material');
    const typeList = document.getElementById('list-receive-type');

    // Populate materials
    matList.innerHTML = '';
    Object.keys(RECEIVE_MATERIAL_DATA).forEach(mat => {
        const li = document.createElement('li');
        li.textContent = mat;
        li.onclick = () => selectMaterialItem(mat);
        matList.appendChild(li);
    });

    // Initial population of types (all available initially or prompt to select mat)
    updateTypeList();
}

function updateTypeList() {
    const typeList = document.getElementById('list-receive-type');
    typeList.innerHTML = '';

    const types = selectedMaterial ? RECEIVE_MATERIAL_DATA[selectedMaterial] : getAllUniqueTypes();
    
    types.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        li.onclick = () => selectTypeItem(t);
        if (t === selectedType) li.classList.add('selected');
        typeList.appendChild(li);
    });
}

function getAllUniqueTypes() {
    let all = [];
    Object.values(RECEIVE_MATERIAL_DATA).forEach(types => {
        all = all.concat(types);
    });
    return [...new Set(all)];
}

function selectMaterialItem(mat) {
    selectedMaterial = mat;
    document.getElementById('receive-material-display').textContent = mat;
    document.getElementById('receive-material-display').style.color = '#1f2937';
    
    // Sync: if current selected type is not for this material, reset type
    if (selectedType && !RECEIVE_MATERIAL_DATA[mat].includes(selectedType)) {
        selectedType = "";
        document.getElementById('receive-type-display').textContent = "เลือกประเภทวัสดุ";
        document.getElementById('receive-type-display').style.color = '#3b82f6';
    }

    updateTypeList();
    toggleReceiveDropdown('list-receive-material');
}

function selectTypeItem(type) {
    selectedType = type;
    document.getElementById('receive-type-display').textContent = type;
    document.getElementById('receive-type-display').style.color = '#1f2937';

    // Sync: if material is not selected, find material for this type
    if (!selectedMaterial) {
        for (const mat in RECEIVE_MATERIAL_DATA) {
            if (RECEIVE_MATERIAL_DATA[mat].includes(type)) {
                selectedMaterial = mat;
                document.getElementById('receive-material-display').textContent = mat;
                document.getElementById('receive-material-display').style.color = '#1f2937';
                updateTypeList();
                break;
            }
        }
    }

    toggleReceiveDropdown('list-receive-type');
}

// Click outside to close
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown-container')) {
        document.querySelectorAll('.custom-dropdown-list').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.custom-dropdown-container').forEach(el => el.classList.remove('open'));
    }
});

function flashError(element) {
    const originalBorder = element.style.borderColor;
    element.style.borderColor = '#ef4444';
    setTimeout(() => {
        element.style.borderColor = originalBorder || '';
    }, 2000);
}

function openConfirmModal() {
    const qtyInput = document.getElementById('receive-qty');
    const noteInput = document.getElementById('receive-note');

    let isValid = true;

    if (!selectedMaterial) {
        isValid = false;
        flashError(document.getElementById('receive-material-display'));
    }

    if (!selectedType) {
        isValid = false;
        flashError(document.getElementById('receive-type-display'));
    }

    if (!qtyInput.value || parseInt(qtyInput.value) <= 0) {
        isValid = false;
        flashError(qtyInput);
    }

    if (!isValid) return;

    document.getElementById('confirm-name').value = document.getElementById('receive-name').value;
    document.getElementById('confirm-material-name').value = selectedMaterial;
    document.getElementById('confirm-material-type').value = selectedType;
    document.getElementById('confirm-qty').value = qtyInput.value;
    document.getElementById('confirm-note').value = noteInput.value.trim() === '' ? '-' : noteInput.value;

    const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
    document.getElementById('confirm-date').value = formattedDate;

    document.getElementById('modal-confirm-receive').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showReceiveStatusModal(type) {
    let modalId = '';
    if (type === 'receive-success') {
        modalId = 'modal-receive-success';
        closeModal('modal-confirm-receive');
        addReceiveRowToTable();
        resetReceiveForm();
    } else if (type === 'receive-error') {
        modalId = 'modal-receive-error';
    }

    if (modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        setTimeout(() => {
            closeModal(modalId);
        }, 2000);
    }
}

function submitReceive() {
    showReceiveStatusModal('receive-success');
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
    selectedMaterial = "";
    selectedType = "";
    document.getElementById('receive-material-display').textContent = "เลือกวัสดุ";
    document.getElementById('receive-material-display').style.color = '#3b82f6';
    document.getElementById('receive-type-display').textContent = "เลือกประเภทวัสดุ";
    document.getElementById('receive-type-display').style.color = '#3b82f6';
    
    document.getElementById('receive-qty').value = '0';
    document.getElementById('receive-note').value = '';
    
    updateTypeList();
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
    initReceiveDropdowns();
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
