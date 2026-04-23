// withdraw.js
let withdrawData = [];

async function loadData() {
    try {
        const tbody = document.querySelector('.withdraw-table tbody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 30px;"><div class="loader-spinner" style="margin: 0 auto 10px;"></div><div style="color:#6b7280;">กำลังโหลดข้อมูลจำลองผ่าน JWT Flow...</div></td></tr>`;
        
        withdrawData = await fetchApi('/api/withdraws');
        renderWithdrawTable();
    } catch (err) {
        alert(err.message);
    }
}

function renderWithdrawTable() {
    const tbody = document.querySelector('.withdraw-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    withdrawData.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-white' : 'alt-row bg-gray-light';
        const tdClass = index % 2 === 0 ? 'bold-text withdraw-td-std' : 'bold-text withdraw-td-std withdraw-alt-td';
        
        tr.innerHTML = `
            <td class="${tdClass}">${item.name}</td>
            <td class="${tdClass}">${item.matName}</td>
            <td class="${tdClass}">${item.subType || "-"}</td>
            <td class="${tdClass}">${item.matType}</td>
            <td class="${tdClass}">${item.qty}</td>
            <td class="${tdClass}">${item.date}</td>
            <td class="${tdClass}">${item.note}</td>
        `;
        tbody.appendChild(tr);
    });
}

const MATERIAL_DATA = {
    "กระดาษ": {
        subTypes: ["A0", "A1", "A2", "A3", "A4", "A5", "F4", "นามบัตร (54x90 mm)"],
        types: [
            "กระดาษปอนด์ 70 แกรม (กระดาษปกติ)", "กระดาษปอนด์ 80 แกรม", "กระดาษร้อยปอนด์ (ผิวหยาบ)",
            "กระดาษร้อยปอนด์ (ผิวเรียบ)", "กระดาษอาร์ตมัน 100g", "กระดาษอาร์ตมัน 120g",
            "กระดาษอาร์ตมัน 160g", "อาร์ตด้าน 100g", "อาร์ตด้าน 120g", "อาร์ตด้าน 160g",
            "กระดาษโฟโต้", "สติ๊กเกอร์กระดาษ (ผิวมัน)", "สติ๊กเกอร์กระดาษ (ผิวด้าน)",
            "สติ๊กเกอร์ PVC (ใส)", "สติ๊กเกอร์ PVC (ทึบ)", "กระดาษคราฟท์ (สีน้ำตาล)"
        ],
        stock: "200",
        unit: "รีม"
    },
    "หมึกพิมพ์": {
        subTypes: ["เครื่องอิงค์เจ็ท (Inkjet)", "เครื่องเลเซอร์ (Laser)", "อิงค์แทงค์ (Ink Tank)", "หมึกพิมพ์ใบเสร็จ"],
        types: ["สีดำ (Black - K)", "สีฟ้า (Cyan - C)", "สีแดงอมม่วง (Magenta - M)", "สีเหลือง (Yellow - Y)", "สีขาว (White)", "น้ำเงินอ่อน (Light Cyan)", "แดงอ่อน (Light Magenta)"],
        stock: "50",
        unit: "ขวด"
    },
    "วัสดุเข้าเล่ม": {
        subTypes: ["สันห่วงกระดูกงูพลาสติก", "สันเกลียวพลาสติก", "สันรูดพลาสติก", "สันกระดูกงูเหล็ก (สันขดลวดคู่)", "สันเกลียวเหล็ก"],
        types: [
            "3 mm", "5 mm", "6 mm", "6.4 mm", "7 mm", "8 mm", "9.5 mm", "10 mm", "11 mm", "12 mm",
            "12.7 mm", "14 mm", "14.3 mm", "15 mm", "16 mm", "17 mm", "18 mm", "19 mm", "20 mm",
            "22 mm", "25 mm", "25.4 mm", "28 mm", "30 mm", "32 mm", "38 mm", "45 mm", "50 mm", "51 mm"
        ],
        stock: "100",
        unit: "ชิ้น"
    },
    "วัสดุเคลือบ": {
        subTypes: ["ขนาด A3", "ขนาด A4", "ขนาด F4", "ขนาด บัตรประชาชน/นามบัตร", "ขนาด A5", "ขนาด B4", "ขนาด B5", "ขนาด A6 (4x6 นิ้ว)"],
        types: [
            "แบบใส 75 ไมครอน", "แบบใส 100 ไมครอน", "แบบใส 125 ไมครอน", "แบบใส 150 ไมครอน",
            "แบบใส 250 ไมครอน", "แบบด้าน (Matte)", "แบบมีกาวในตัว"
        ],
        stock: "150",
        unit: "แผ่น"
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
        },
        stock: "50",
        unit: "ชิ้น"
    }
};

let selectedMaterial = "";
let selectedSubType = "";
let selectedType = "";

function updateSummary() {
    const qty = document.getElementById('withdraw-qty').value;

    const matNameBox = document.getElementById('summary-mat-name');
    const matTypeBox = document.getElementById('summary-mat-type');
    const stockBox = document.getElementById('summary-stock');
    const qtyBox = document.getElementById('summary-qty');

    // Update Material Name + SubType
    if (selectedMaterial) {
        const data = MATERIAL_DATA[selectedMaterial];
        const stock = data ? data.stock : "คลัง";
        const unit = data ? data.unit : "หน่วย";

        const displayName = selectedSubType ? `${selectedMaterial} + ${selectedSubType}` : selectedMaterial;
        if (matNameBox) matNameBox.innerText = displayName;
        
        if (stockBox) {
            stockBox.innerHTML = '<div style="font-size: 32px; font-weight: 700; color: #0f172a; line-height: 1.2;">' + stock + '</div><div class="unit-text" style="font-size: 22px; color: #0ea5e9; font-weight: 500;">' + unit + '</div>';
        }
    } else {
        if (matNameBox) matNameBox.innerText = 'วัสดุ + ชนิดวัสดุ';
        if (stockBox) {
            stockBox.innerHTML = '<div style="font-size: 32px; font-weight: 700; color: #0f172a; line-height: 1.2;">คลัง</div><div class="unit-text" style="font-size: 22px; color: #0ea5e9; font-weight: 500;">หน่วย</div>';
        }
    }

    // Update Material Type
    if (selectedType) {
        if (matTypeBox) matTypeBox.innerText = selectedType;
    } else {
        if (matTypeBox) matTypeBox.innerText = 'ประเภทวัสดุ';
    }

    if (qtyBox) qtyBox.innerText = qty ? qty : '';
}

/**
 * Custom Dropdown Logic
 */
function toggleWithdrawDropdown(listId) {
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

function initWithdrawDropdowns() {
    const matList = document.getElementById('list-withdraw-material');
    matList.innerHTML = '';
    Object.keys(MATERIAL_DATA).forEach(mat => {
        const li = document.createElement('li');
        li.textContent = mat;
        li.onclick = () => selectMaterialItem(mat);
        matList.appendChild(li);
    });

    updateSubTypeList();
    updateTypeList();
}

function updateSubTypeList() {
    const subList = document.getElementById('list-withdraw-subtype');
    if (!subList) return;
    subList.innerHTML = '';

    const subTypes = selectedMaterial ? MATERIAL_DATA[selectedMaterial].subTypes : getAllUniqueSubTypes();
    subTypes.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        li.onclick = () => selectSubTypeItem(s);
        if (s === selectedSubType) li.classList.add('selected');
        subList.appendChild(li);
    });
}

function updateTypeList() {
    const typeList = document.getElementById('list-withdraw-type');
    typeList.innerHTML = '';

    let types = [];
    if (selectedMaterial) {
        const data = MATERIAL_DATA[selectedMaterial];
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
    Object.values(MATERIAL_DATA).forEach(data => {
        all = all.concat(data.subTypes);
    });
    return [...new Set(all)];
}

function getAllUniqueTypes() {
    let all = [];
    Object.values(MATERIAL_DATA).forEach(data => {
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
    const display = document.getElementById('withdraw-material-display');
    display.textContent = mat;
    display.style.color = '#1f2937';

    // Reset SubType and Type if not compatible
    if (selectedSubType && !MATERIAL_DATA[mat].subTypes.includes(selectedSubType)) {
        selectedSubType = "";
        const subDisplay = document.getElementById('withdraw-subtype-display');
        if (subDisplay) {
            subDisplay.textContent = "เลือกชนิดวัสดุ";
            subDisplay.style.color = '#3b82f6';
        }
    }

    if (selectedType && !MATERIAL_DATA[mat].types.includes(selectedType)) {
        selectedType = "";
        const typeDisplay = document.getElementById('withdraw-type-display');
        typeDisplay.textContent = "เลือกประเภท";
        typeDisplay.style.color = '#3b82f6';
    }

    updateSubTypeList();
    updateTypeList();
    updateSummary();
    clearSingleFieldError(display);
    toggleWithdrawDropdown('list-withdraw-material');
}

function selectSubTypeItem(sub) {
    selectedSubType = sub;
    const display = document.getElementById('withdraw-subtype-display');
    if (display) {
        display.textContent = sub;
        display.style.color = '#1f2937';
    }

    // Find Material if not selected
    if (!selectedMaterial) {
        for (const mat in MATERIAL_DATA) {
            if (MATERIAL_DATA[mat].subTypes.includes(sub)) {
                selectedMaterial = mat;
                const matDisplay = document.getElementById('withdraw-material-display');
                matDisplay.textContent = mat;
                matDisplay.style.color = '#1f2937';
                updateSubTypeList();
                updateTypeList();
                break;
            }
        }
    }

    updateSummary();
    updateTypeList();
    clearSingleFieldError(display);
    toggleWithdrawDropdown('list-withdraw-subtype');
}

function selectTypeItem(type) {
    selectedType = type;
    const display = document.getElementById('withdraw-type-display');
    display.textContent = type;
    display.style.color = '#1f2937';

    // Find Material if not selected
    if (!selectedMaterial) {
        for (const mat in MATERIAL_DATA) {
            if (MATERIAL_DATA[mat].types.includes(type)) {
                selectedMaterial = mat;
                const matDisplay = document.getElementById('withdraw-material-display');
                matDisplay.textContent = mat;
                matDisplay.style.color = '#1f2937';
                updateSubTypeList();
                updateTypeList();
                break;
            }
        }
    }

    updateSummary();
    clearSingleFieldError(display);
    toggleWithdrawDropdown('list-withdraw-type');
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
    element.style.borderColor = '#ef4444'; // Red color
    setTimeout(() => {
        element.style.borderColor = originalBorder;
    }, 2000);
}

function openConfirmModal() {
    const nameInput = document.getElementById('withdrawer-name');
    const qtyInput = document.getElementById('withdraw-qty');

    const errors = [];

    if (!nameInput.value.trim()) {
        errors.push({ input: nameInput, label: 'ชื่อผู้เบิกวัสดุ', message: 'กรุณากรอกชื่อผู้เบิก' });
    }
    if (!selectedMaterial) {
        errors.push({ input: document.getElementById('withdraw-material-display'), label: 'วัสดุ', message: 'กรุณาเลือกวัสดุ' });
    }
    if (!selectedSubType) {
        errors.push({ input: document.getElementById('withdraw-subtype-display'), label: 'ชนิดวัสดุ', message: 'กรุณาเลือกชนิดวัสดุ' });
    }
    if (!selectedType) {
        errors.push({ input: document.getElementById('withdraw-type-display'), label: 'ประเภทวัสดุ', message: 'กรุณาเลือกประเภท' });
    }
    
    const qtyValue = qtyInput.value.trim();
    if (!qtyValue) {
        errors.push({ input: qtyInput, label: 'จำนวนที่ต้องการเบิก', message: 'กรุณากรอกจำนวน' });
    } else {
        const qtyNum = parseInt(qtyValue, 10);
        if (qtyNum < 1) {
            errors.push({ input: qtyInput, label: 'จำนวนที่ต้องการเบิก', message: 'จำนวนต้องไม่น้อยกว่า 1' });
        }
    }

    if (errors.length > 0) {
        showValidationModal(errors);
        return;
    }

    document.getElementById('confirm-name').value = nameInput.value || '';
    document.getElementById('confirm-material-name').value = selectedMaterial;
    document.getElementById('confirm-material-subtype').value = selectedSubType;
    document.getElementById('confirm-material-type').value = selectedType;
    document.getElementById('confirm-qty').value = qtyInput.value || '';
    document.getElementById('confirm-note').value = document.getElementById('withdraw-note').value || '';

    document.getElementById('modal-confirm-withdraw').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showStatusModal(type) {
    if (type === 'withdraw-success') {
        closeModal('modal-confirm-withdraw');
        addWithdrawRowToTable();
        resetWithdrawForm();
        return; // Bypass showing success modal
    }

    let modalId = '';
    if (type === 'withdraw-error') {
        modalId = 'modal-withdraw-error';
    }

    if (modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        setTimeout(() => {
            closeModal(modalId);
        }, 2000);
    }
}

function addWithdrawRowToTable() {
    const name = document.getElementById('confirm-name').value || "-";
    const matName = document.getElementById('confirm-material-name').value || "-";
    const subType = document.getElementById('confirm-material-subtype').value || "-";
    const matType = document.getElementById('confirm-material-type').value || "-";
    const qty = document.getElementById('confirm-qty').value || "0";
    const note = document.getElementById('confirm-note').value || "-";

    const tbody = document.querySelector('.withdraw-table tbody');
    if (!tbody) return;

    const now = new Date();
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const dateStr = `${String(now.getDate()).padStart(2, '0')} ${thaiMonths[now.getMonth()]} ${now.getFullYear()}`;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="bold-text withdraw-td-std">${name}</td>
        <td class="bold-text withdraw-td-std">${matName}</td>
        <td class="bold-text withdraw-td-std">${subType}</td>
        <td class="bold-text withdraw-td-std">${matType}</td>
        <td class="bold-text withdraw-td-std">${qty}</td>
        <td class="bold-text withdraw-td-std">${dateStr}</td>
        <td class="bold-text withdraw-td-std">${note}</td>
    `;

    tbody.prepend(newRow);

    Array.from(tbody.querySelectorAll('tr')).forEach((row, index) => {
        const tds = row.querySelectorAll('td');
        if (index % 2 === 1) {
            row.className = "alt-row bg-gray-light";
            tds.forEach(td => td.className = "bold-text withdraw-td-std withdraw-alt-td");
        } else {
            row.className = "bg-white";
            tds.forEach(td => td.className = "bold-text withdraw-td-std");
        }
    });
}

function resetWithdrawForm() {
    selectedMaterial = "";
    selectedSubType = "";
    selectedType = "";
    document.getElementById('withdraw-material-display').textContent = "เลือกวัสดุ";
    document.getElementById('withdraw-material-display').style.color = '#3b82f6';
    document.getElementById('withdraw-subtype-display').textContent = "เลือกชนิดวัสดุ";
    document.getElementById('withdraw-subtype-display').style.color = '#3b82f6';
    document.getElementById('withdraw-type-display').textContent = "เลือกประเภท";
    document.getElementById('withdraw-type-display').style.color = '#3b82f6';

    document.getElementById('withdraw-qty').value = '';
    document.getElementById('withdraw-note').value = '';
    updateSummary();
    updateTypeList();
}

window.onload = function () {
    syncWithdrawerName();
    initWithdrawDropdowns();
    updateSummary();
    loadData();
};

function syncWithdrawerName() {
    const checkNavbar = setInterval(() => {
        const navbarUsername = document.querySelector('.username');
        const nameInput = document.getElementById('withdrawer-name');

        if (navbarUsername && nameInput) {
            nameInput.value = navbarUsername.innerText.trim();
            clearInterval(checkNavbar);
        }
    }, 100);
    setTimeout(() => clearInterval(checkNavbar), 3000);
}
