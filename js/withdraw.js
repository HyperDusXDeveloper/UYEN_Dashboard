// withdraw.js
let withdrawData = [];

async function loadData() {
    try {
        const tbody = document.querySelector('.withdraw-table tbody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 30px;"><div class="loader-spinner" style="margin: 0 auto 10px;"></div><div style="color:#6b7280;">กำลังโหลดข้อมูลจำลองผ่าน JWT Flow...</div></td></tr>`;
        
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
            <td class="${tdClass}">${item.matType}</td>
            <td class="${tdClass}">${item.qty}</td>
            <td class="${tdClass}">${item.date}</td>
            <td class="${tdClass}">${item.note}</td>
        `;
        tbody.appendChild(tr);
    });
}

const MATERIAL_DATA = {
    "A5": {
        types: ["ธรรมดา", "สติ๊กเกอร์", "ร้อยปอนด์", "กระดาษมัน", "กระดาษปก"],
        stock: "คลัง",
        unit: "หน่วย"
    },
    "กระดาษ": {
        types: ["A4 ธรรมดา", "A4 80 แกรม", "A4 100 แกรม", "A3 ธรรมดา", "กระดาษการ์ดขาว"],
        stock: "200",
        unit: "รีม"
    },
    "หมึกสีดำ": {
        types: ["EPSON 003", "HP GT53", "CANON GI-71", "BROTHER BTD60", "หมึกเติมทั่วไป"],
        stock: "50",
        unit: "ขวด"
    },
    "เทปใส": {
        types: ["3M สก๊อตช์", "แกนเล็ก 1 นิ้ว", "แกนใหญ่ 3 นิ้ว", "เทปใสกันน้ำ", "เทปใสแรงยึดสูง"],
        stock: "20",
        unit: "ม้วน"
    }
};

let selectedMaterial = "";
let selectedType = "";

function updateSummary() {
    const qty = document.getElementById('withdraw-qty').value;

    const matNameBox = document.getElementById('summary-mat-name');
    const matTypeBox = document.getElementById('summary-mat-type');
    const stockBox = document.getElementById('summary-stock');
    const qtyBox = document.getElementById('summary-qty');

    // Update Material Name
    if (selectedMaterial) {
        // Get data from MATERIAL_DATA
        const data = MATERIAL_DATA[selectedMaterial];
        const stock = data ? data.stock : "คลัง";
        const unit = data ? data.unit : "หน่วย";

        if (matNameBox) matNameBox.innerText = selectedMaterial;
        if (stockBox) {
            stockBox.innerHTML = '<div style="font-size: 32px; font-weight: 700; color: #0f172a; line-height: 1.2;">' + stock + '</div><div class="unit-text" style="font-size: 22px; color: #0ea5e9; font-weight: 500;">' + unit + '</div>';
        }
    } else {
        if (matNameBox) matNameBox.innerText = 'วัสดุ';
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

    // Populate materials
    matList.innerHTML = '';
    Object.keys(MATERIAL_DATA).forEach(mat => {
        const li = document.createElement('li');
        li.textContent = mat;
        li.onclick = () => selectMaterialItem(mat);
        matList.appendChild(li);
    });

    updateTypeList();
}

function updateTypeList() {
    const typeList = document.getElementById('list-withdraw-type');
    typeList.innerHTML = '';

    const types = selectedMaterial ? MATERIAL_DATA[selectedMaterial].types : getAllUniqueTypes();

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
    Object.values(MATERIAL_DATA).forEach(data => {
        all = all.concat(data.types);
    });
    return [...new Set(all)];
}

function selectMaterialItem(mat) {
    selectedMaterial = mat;
    const display = document.getElementById('withdraw-material-display');
    display.textContent = mat;
    display.style.color = '#1f2937';

    // Sync: if current selected type is not for this material, reset type
    if (selectedType && !MATERIAL_DATA[mat].types.includes(selectedType)) {
        selectedType = "";
        const typeDisplay = document.getElementById('withdraw-type-display');
        typeDisplay.textContent = "เลือกประเภท";
        typeDisplay.style.color = '#3b82f6';
    }

    updateTypeList();
    updateSummary();
    toggleWithdrawDropdown('list-withdraw-material');
}

function selectTypeItem(type) {
    selectedType = type;
    const display = document.getElementById('withdraw-type-display');
    display.textContent = type;
    display.style.color = '#1f2937';

    // Sync: if material is not selected, find material for this type
    if (!selectedMaterial) {
        for (const mat in MATERIAL_DATA) {
            if (MATERIAL_DATA[mat].types.includes(type)) {
                selectedMaterial = mat;
                const matDisplay = document.getElementById('withdraw-material-display');
                matDisplay.textContent = mat;
                matDisplay.style.color = '#1f2937';
                updateTypeList();
                break;
            }
        }
    }

    updateSummary();
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

    let isValid = true;

    if (!nameInput.value.trim()) {
        isValid = false;
        flashError(nameInput);
    }
    if (!selectedMaterial) {
        isValid = false;
        flashError(document.getElementById('withdraw-material-display'));
    }
    if (!selectedType) {
        isValid = false;
        flashError(document.getElementById('withdraw-type-display'));
    }
    if (!qtyInput.value.trim()) {
        isValid = false;
        flashError(qtyInput);
    }

    if (!isValid) return;

    document.getElementById('confirm-name').value = nameInput.value || '';
    document.getElementById('confirm-material-name').value = selectedMaterial;
    document.getElementById('confirm-material-type').value = selectedType;
    document.getElementById('confirm-qty').value = qtyInput.value || '';
    document.getElementById('confirm-note').value = document.getElementById('withdraw-note').value || '';

    document.getElementById('modal-confirm-withdraw').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showStatusModal(type) {
    let modalId = '';
    if (type === 'withdraw-success') {
        modalId = 'modal-withdraw-success';
        closeModal('modal-confirm-withdraw');
        addWithdrawRowToTable();
        resetWithdrawForm();
    } else if (type === 'withdraw-error') {
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
    const matType = document.getElementById('confirm-material-type').value || "-";
    const qty = document.getElementById('confirm-qty').value || "0";
    const note = document.getElementById('confirm-note').value || "-";

    const tbody = document.querySelector('.withdraw-table tbody');
    if (!tbody) return;

    const now = new Date();
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const dateStr = `${String(now.getDate()).padStart(2, '0')} ${thaiMonths[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="bold-text withdraw-td-std">${name}</td>
        <td class="bold-text withdraw-td-std">${matName}</td>
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
    selectedType = "";
    document.getElementById('withdraw-material-display').textContent = "เลือกวัสดุ";
    document.getElementById('withdraw-material-display').style.color = '#3b82f6';
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
