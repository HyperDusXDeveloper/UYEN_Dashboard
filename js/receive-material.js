// receive-material.js

const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
let currentDate = new Date();
let selectedDate = new Date();

const RECEIVE_MATERIAL_DATA = {
    "กระดาษ": {
        subTypes: ["A0", "A1", "A2", "A3", "A4", "A5", "F4", "นามบัตร (54x90 mm)"],
        types: [
            "กระดาษปอนด์ 70 แกรม (กระดาษปกติ)", "กระดาษปอนด์ 80 แกรม", "กระดาษร้อยปอนด์ (ผิวหยาบ)",
            "กระดาษร้อยปอนด์ (ผิวเรียบ)", "กระดาษอาร์ตมัน 100g", "กระดาษอาร์ตมัน 120g",
            "กระดาษอาร์ตมัน 160g", "อาร์ตด้าน 100g", "อาร์ตด้าน 120g", "อาร์ตด้าน 160g",
            "กระดาษโฟโต้", "สติ๊กเกอร์กระดาษ (ผิวมัน)", "สติ๊กเกอร์กระดาษ (ผิวด้าน)",
            "สติ๊กเกอร์ PVC (ใส)", "สติ๊กเกอร์ PVC (ทึบ)", "กระดาษคราฟท์ (สีน้ำตาล)"
        ]
    },
    "หมึกพิมพ์": {
        subTypes: ["เครื่องอิงค์เจ็ท (Inkjet)", "เครื่องเลเซอร์ (Laser)", "อิงค์แทงค์ (Ink Tank)", "หมึกพิมพ์ใบเสร็จ"],
        types: ["สีดำ (Black - K)", "สีฟ้า (Cyan - C)", "สีแดงอมม่วง (Magenta - M)", "สีเหลือง (Yellow - Y)", "สีขาว (White)", "น้ำเงินอ่อน (Light Cyan)", "แดงอ่อน (Light Magenta)"]
    },
    "วัสดุเข้าเล่ม": {
        subTypes: ["สันห่วงกระดูกงูพลาสติก", "สันเกลียวพลาสติก", "สันรูดพลาสติก", "สันกระดูกงูเหล็ก (สันขดลวดคู่)", "สันเกลียวเหล็ก"],
        types: [
            "3 mm", "5 mm", "6 mm", "6.4 mm", "7 mm", "8 mm", "9.5 mm", "10 mm", "11 mm", "12 mm",
            "12.7 mm", "14 mm", "14.3 mm", "15 mm", "16 mm", "17 mm", "18 mm", "19 mm", "20 mm",
            "22 mm", "25 mm", "25.4 mm", "28 mm", "30 mm", "32 mm", "38 mm", "45 mm", "50 mm", "51 mm"
        ]
    },
    "วัสดุเคลือบ": {
        subTypes: ["ขนาด A3", "ขนาด A4", "ขนาด F4", "ขนาด บัตรประชาชน/นามบัตร", "ขนาด A5", "ขนาด B4", "ขนาด B5", "ขนาด A6 (4x6 นิ้ว)"],
        types: [
            "แบบใส 75 ไมครอน", "แบบใส 100 ไมครอน", "แบบใส 125 ไมครอน", "แบบใส 150 ไมครอน",
            "แบบใส 250 ไมครอน", "แบบด้าน (Matte)", "แบบมีกาวในตัว"
        ]
    },
    "อื่น": {
        subTypes: [
            "กรรไกร", "คัตเตอร์", "ใบมีดคัตเตอร์", "แผ่นรองตัด", "เครื่องเจาะรูตุ๊ดตู่",
            "เครื่องเย็บกระดาษ (แม็ก)", "ลวดเย็บกระดาษ", "ที่ถอนลวดเย็บ", "คลิปดำหนีบกระดาษ",
            "ลวดเสียบกระดาษ", "เทปกาวใส", "เทปขุ่น (เทปเขียนทับได้)", "เทปกาวสองหน้า (แบบบาง)",
            "เทปกาวสองหน้า (แบบหนา/โฟม)", "เทปผ้า", "กาวน้ำ", "กาวแท่ง", "กาวสองหน้าแบบลูกกลิ้ง",
            "ซองเอกสารสีน้ำตาล (แบบเรียบ)", "ซองเอกสารสีน้ำตาล (แบบขยายข้าง)", "ซองเอกสารสีขาว",
            "ซองพลาสติกใส", "ซองกันกระแทก (มีบับเบิ้ล)", "แฟ้มซองสอดพลาสติก"
        ],
        typesBySubType: {
            "ลวดเย็บกระดาษ": ["เบอร์ 10", "เบอร์ 3", "เบอร์ 35", "เบอร์ 23/6", "เบอร์ 23/8", "เบอร์ 23/10", "เบอร์ 23/13", "เบอร์ 23/15", "เบอร์ 23/17", "เบอร์ 23/20", "เบอร์ 23/24"],
            "คลิปดำหนีบกระดาษ": ["15 mm (เบอร์ 113)", "19 mm (เบอร์ 112)", "25 mm (เบอร์ 111)", "32 mm (เบอร์ 110)", "41 mm (เบอร์ 109)", "51 mm (เบอร์ 108)"],
            "ซองเอกสารสีน้ำตาล (แบบเรียบ)": ["4.5 x 7 นิ้ว", "7 x 10 นิ้ว", "9 x 12.75 นิ้ว", "9 x 12 นิ้ว", "10 x 13 นิ้ว", "11 x 14 นิ้ว"],
            "ซองเอกสารสีน้ำตาล (แบบขยายข้าง)": ["4.5 x 7 นิ้ว", "7 x 10 นิ้ว", "9 x 12.75 นิ้ว", "9 x 12 นิ้ว", "10 x 13 นิ้ว", "11 x 14 นิ้ว"],
            "ซองเอกสารสีขาว": ["4.5 x 7 นิ้ว", "7 x 10 นิ้ว", "9 x 12.75 นิ้ว", "9 x 12 นิ้ว", "10 x 13 นิ้ว", "11 x 14 นิ้ว"],
            "ซองพลาสติกใส": ["4.5 x 7 นิ้ว", "7 x 10 นิ้ว", "9 x 12.75 นิ้ว", "9 x 12 นิ้ว", "10 x 13 นิ้ว", "11 x 14 นิ้ว"],
            "ซองกันกระแทก (มีบับเบิ้ล)": ["4.5 x 7 นิ้ว", "7 x 10 นิ้ว", "9 x 12.75 นิ้ว", "9 x 12 นิ้ว", "10 x 13 นิ้ว", "11 x 14 นิ้ว"],
            "เทปกาวใส": ["1/2 นิ้ว (12 mm)", "3/4 นิ้ว (18 mm)", "1 นิ้ว (24 mm)", "1.5 นิ้ว (36 mm)", "2 นิ้ว (48 mm)"],
            "เทปขุ่น (เทปเขียนทับได้)": ["1/2 นิ้ว (12 mm)", "3/4 นิ้ว (18 mm)", "1 นิ้ว (24 mm)", "1.5 นิ้ว (36 mm)", "2 นิ้ว (48 mm)"],
            "เทปกาวสองหน้า (แบบบาง)": ["1/2 นิ้ว (12 mm)", "3/4 นิ้ว (18 mm)", "1 นิ้ว (24 mm)", "1.5 นิ้ว (36 mm)", "2 นิ้ว (48 mm)"],
            "เทปกาวสองหน้า (แบบหนา/โฟม)": ["1/2 นิ้ว (12 mm)", "3/4 นิ้ว (18 mm)", "1 นิ้ว (24 mm)", "1.5 นิ้ว (36 mm)", "2 นิ้ว (48 mm)"],
            "เทปผ้า": ["1/2 นิ้ว (12 mm)", "3/4 นิ้ว (18 mm)", "1 นิ้ว (24 mm)", "1.5 นิ้ว (36 mm)", "2 นิ้ว (48 mm)"],
            "ใบมีดคัตเตอร์": ["ขนาด 9 mm มุม 30 องศา", "ขนาด 9 mm มุม 45 องศา", "ขนาด 18 mm มุม 30 องศา", "ขนาด 18 mm มุม 45 องศา"],
            "default": ["เล็ก", "กลาง", "ใหญ่"]
        }
    }
};

let selectedMaterial = "";
let selectedSubType = "";
let selectedType = "";

let receiveData = [];

async function loadData() {
    try {
        const tbody = document.querySelector('.receive-table tbody');
        if (tbody) tbody.innerHTML = createLoadingSpinner(7);
        
        receiveData = await fetchApi('/api/receive-materials');
        renderReceiveTable();
    } catch (err) {
        alert(err.message);
    }
}

function renderReceiveTable() {
    const tbody = document.querySelector('.receive-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    receiveData.forEach((item, index) => {
        const tr = document.createElement('tr');
        if (index % 2 === 1) tr.classList.add('alt-row');
        
        const dateObj = new Date(item.date);
        const formattedDate = !isNaN(dateObj.getTime()) 
            ? `${String(dateObj.getDate()).padStart(2, '0')} ${["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][dateObj.getMonth()]} ${dateObj.getFullYear()}`
            : item.date;
        
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.matName}</td>
            <td>${item.subType || "-"}</td>
            <td>${item.matType}</td>
            <td>${item.qty}</td>
            <td>${formattedDate}</td>
            <td class="dash-red">${item.note}</td>
        `;
        tbody.appendChild(tr);
    });
}


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
    matList.innerHTML = '';
    Object.keys(RECEIVE_MATERIAL_DATA).forEach(mat => {
        const li = document.createElement('li');
        li.textContent = mat;
        li.onclick = () => selectMaterialItem(mat);
        matList.appendChild(li);
    });

    updateSubTypeList();
    updateTypeList();
}

function updateSubTypeList() {
    const subList = document.getElementById('list-receive-subtype');
    if (!subList) return;
    subList.innerHTML = '';

    const subTypes = selectedMaterial ? RECEIVE_MATERIAL_DATA[selectedMaterial].subTypes : getAllUniqueSubTypes();
    subTypes.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        li.onclick = () => selectSubTypeItem(s);
        if (s === selectedSubType) li.classList.add('selected');
        subList.appendChild(li);
    });
}

function updateTypeList() {
    const typeList = document.getElementById('list-receive-type');
    typeList.innerHTML = '';

    let types = [];
    if (selectedMaterial) {
        const data = RECEIVE_MATERIAL_DATA[selectedMaterial];
        if (data.types) {
            types = data.types;
        } else if (data.typesBySubType) {
            types = data.typesBySubType[selectedSubType] || data.typesBySubType['default'] || [];
        }
    } else {
        types = getAllUniqueTypes();
    }
    
    types.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        li.onclick = () => selectTypeItem(t);
        if (t === selectedType) li.classList.add('selected');
        typeList.appendChild(li);
    });
}

function getAllUniqueSubTypes() {
    let all = [];
    Object.values(RECEIVE_MATERIAL_DATA).forEach(data => {
        all = all.concat(data.subTypes);
    });
    return [...new Set(all)];
}

function getAllUniqueTypes() {
    let all = [];
    Object.values(RECEIVE_MATERIAL_DATA).forEach(data => {
        if (data.types) {
            all = all.concat(data.types);
        } else if (data.typesBySubType) {
            Object.values(data.typesBySubType).forEach(tList => {
                all = all.concat(tList);
            });
        }
    });
    return [...new Set(all)];
}

function selectMaterialItem(mat) {
    selectedMaterial = mat;
    document.getElementById('receive-material-display').textContent = mat;
    document.getElementById('receive-material-display').style.color = '#1f2937';
    
    // Reset SubType and Type if not compatible
    if (selectedSubType && !RECEIVE_MATERIAL_DATA[mat].subTypes.includes(selectedSubType)) {
        selectedSubType = "";
        const subDisplay = document.getElementById('receive-subtype-display');
        if (subDisplay) {
            subDisplay.textContent = "เลือกชนิดวัสดุ";
            subDisplay.style.color = '#3b82f6';
        }
    }

    if (selectedType && !RECEIVE_MATERIAL_DATA[mat].types.includes(selectedType)) {
        selectedType = "";
        const typeDisplay = document.getElementById('receive-type-display').textContent = "เลือกประเภทวัสดุ";
        document.getElementById('receive-type-display').style.color = '#3b82f6';
    }

    updateSubTypeList();
    updateTypeList();
    clearSingleFieldError(document.getElementById('receive-material-display'));
    toggleReceiveDropdown('list-receive-material');
}

function selectSubTypeItem(sub) {
    selectedSubType = sub;
    const display = document.getElementById('receive-subtype-display');
    if (display) {
        display.textContent = sub;
        display.style.color = '#1f2937';
    }

    // Find Material if not selected
    if (!selectedMaterial) {
        for (const mat in RECEIVE_MATERIAL_DATA) {
            if (RECEIVE_MATERIAL_DATA[mat].subTypes.includes(sub)) {
                selectedMaterial = mat;
                document.getElementById('receive-material-display').textContent = mat;
                document.getElementById('receive-material-display').style.color = '#1f2937';
                updateSubTypeList();
                updateTypeList();
                break;
            }
        }
    }

    updateTypeList();
    clearSingleFieldError(display);
    toggleReceiveDropdown('list-receive-subtype');
}

function selectTypeItem(type) {
    selectedType = type;
    document.getElementById('receive-type-display').textContent = type;
    document.getElementById('receive-type-display').style.color = '#1f2937';

    // Find Material if not selected
    if (!selectedMaterial) {
        for (const mat in RECEIVE_MATERIAL_DATA) {
            if (RECEIVE_MATERIAL_DATA[mat].types.includes(type)) {
                selectedMaterial = mat;
                document.getElementById('receive-material-display').textContent = mat;
                document.getElementById('receive-material-display').style.color = '#1f2937';
                updateSubTypeList();
                updateTypeList();
                break;
            }
        }
    }

    clearSingleFieldError(document.getElementById('receive-type-display'));
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

    const errors = [];

    if (!selectedMaterial) {
        errors.push({ input: document.getElementById('receive-material-display'), label: 'วัสดุที่รับ', message: 'กรุณาเลือกวัสดุ' });
    }

    if (!selectedSubType) {
        errors.push({ input: document.getElementById('receive-subtype-display'), label: 'ชนิดวัสดุที่รับ', message: 'กรุณาเลือกชนิดวัสดุ' });
    }

    if (!selectedType) {
        errors.push({ input: document.getElementById('receive-type-display'), label: 'ประเภทวัสดุที่รับ', message: 'กรุณาเลือกประเภทวัสดุ' });
    }

    const qtyValue = qtyInput.value.trim();
    if (!qtyValue) {
        errors.push({ input: qtyInput, label: 'จำนวนที่รับ', message: 'กรุณากรอกจำนวน' });
    } else {
        const qtyNum = parseInt(qtyValue, 10);
        if (qtyNum < 1) {
            errors.push({ input: qtyInput, label: 'จำนวนที่รับ', message: 'จำนวนต้องไม่น้อยกว่า 1' });
        }
    }

    if (errors.length > 0) {
        showValidationModal(errors);
        return;
    }

    const nameVal = document.getElementById('receive-name').value;
    const noteText = noteInput.value.trim() === '' ? '-' : noteInput.value;
    const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;

    const bodyHtml = `
        <div class="mb-15">
            <label class="modal-label-standard">ชื่อผู้รับวัสดุ</label>
            <input type="text" class="modal-input-readonly-gray" readonly value="${nameVal}">
        </div>
        <div class="mb-15">
            <label class="modal-label-standard">วัสดุที่รับ</label>
            <input type="text" class="modal-input-readonly-gray" readonly value="${selectedMaterial}">
        </div>
        <div class="mb-15">
            <label class="modal-label-standard">ชนิดวัสดุที่รับ</label>
            <input type="text" class="modal-input-readonly-gray" readonly value="${selectedSubType}">
        </div>
        <div class="mb-15">
            <label class="modal-label-standard">ประเภทวัสดุที่รับ</label>
            <input type="text" class="modal-input-readonly-gray" readonly value="${selectedType}">
        </div>
        <div class="mb-15">
            <label class="modal-label-standard">จำนวนที่รับ</label>
            <input type="text" class="modal-input-readonly-gray" readonly value="${qtyInput.value}">
        </div>
        <div class="mb-15">
            <label class="modal-label-standard">วันที่รับวัสดุ</label>
            <input type="text" class="modal-input-readonly-gray" readonly value="${formattedDate}">
        </div>
        <div class="mb-15">
            <label class="modal-label-standard">หมายเหตุ</label>
            <input type="text" class="modal-input-readonly-gray" readonly value="${noteText}">
        </div>
    `;

    // Save values for table row generation
    window.__pendingReceiveData = {
        name: nameVal,
        matName: selectedMaterial,
        subType: selectedSubType,
        matType: selectedType,
        qty: qtyInput.value,
        date: `${String(selectedDate.getDate()).padStart(2, '0')} ${["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][selectedDate.getMonth()]} ${selectedDate.getFullYear()}`,
        note: noteText
    };

    showConfirmModal({
        title: 'ต้องการ รับวัสดุ ใช่หรือไม่ ?',
        bodyHtml: bodyHtml,
        confirmText: 'ยืนยันการรับวัสดุ',
        cancelText: 'ยกเลิก',
        confirmBtnClass: 'btn-confirm-receive-action',
        cancelBtnClass: 'btn-cancel-receive-action',
        headerClass: 'modal-receive-header',
        bodyClass: 'modal-receive-body text-center',
        actionsContainerClass: 'modal-receive-footer flex-center',
        onConfirm: () => {
            addReceiveRowToTable();
            resetReceiveForm();
            window.showStatusModal('รับวัสดุสำเร็จ', 'ข้อมูลได้รับการบันทึกแล้ว', 'success');
        }
    });
}

function addReceiveRowToTable() {
    const data = window.__pendingReceiveData || {};
    const name = data.name || "-";
    const matName = data.matName || "-";
    const subType = data.subType || "-";
    const matType = data.matType || "-";
    const qty = data.qty || "0";
    const note = data.note || "-";
    
    const tbody = document.querySelector('.receive-table tbody');
    if (!tbody) return;

    // Use selectedDate and a RANDOM time between 08:00 and 17:00
    const thaiShortMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    

    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${matName}</td>
        <td>${subType}</td>
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
    selectedSubType = "";
    selectedType = "";
    document.getElementById('receive-material-display').textContent = "เลือกวัสดุ";
    document.getElementById('receive-material-display').style.color = '#3b82f6';
    document.getElementById('receive-subtype-display').textContent = "เลือกชนิดวัสดุ";
    document.getElementById('receive-subtype-display').style.color = '#3b82f6';
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
    loadData();
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
