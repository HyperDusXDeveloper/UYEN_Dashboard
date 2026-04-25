// inventory.js

let currentRowToDelete = null;
let currentRowToEdit = null;
let inventoryData = [];

function injectAddMaterialModal() {
    if(document.getElementById('modal-add-material')) return;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';
    overlay.id = 'modal-add-material';
    overlay.innerHTML = `
        <div class="modal modal-edit-large p-0 border-blue-dark bg-white">
            <div class="modal-header-blue-dark">
                <h2 class="modal-title-center-24">เพิ่มวัสดุ</h2>
            </div>
            <div class="modal-body p-30">
                <form onsubmit="event.preventDefault();" class="modal-input-group-gap-20">
                    <div class="input-group custom-dropdown-container m-0 relative">
                        <label class="fw-800 text-gray-modal">วัสดุ</label>
                        <div class="modal-input-text-blue flex-between pointer" id="add-material-display" onclick="toggleInventoryDropdown('list-add-material')">
                            <span id="text-add-material">ชื่อวัสดุ</span>
                            <svg class="dropdown-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <ul id="list-add-material" class="dropdown-list-standard hidden"></ul>
                    </div>
                    <div class="input-group custom-dropdown-container m-0 relative">
                        <label class="fw-800 text-gray-modal">ชนิดวัสดุ</label>
                        <div class="modal-input-text-blue flex-between pointer" id="add-subtype-display" onclick="toggleInventoryDropdown('list-add-subtype')">
                            <span id="text-add-subtype">ชนิดวัสดุ</span>
                            <svg class="dropdown-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <ul id="list-add-subtype" class="dropdown-list-standard hidden"></ul>
                    </div>
                    <div class="input-group custom-dropdown-container m-0 relative">
                        <label class="fw-800 text-gray-modal">ประเภทวัสดุ</label>
                        <div class="modal-input-text-blue flex-between pointer" id="add-type-display" onclick="toggleInventoryDropdown('list-add-type')">
                            <span id="text-add-type">ประเภทวัสดุ</span>
                            <svg class="dropdown-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <ul id="list-add-type" class="dropdown-list-standard hidden"></ul>
                    </div>
                    <div class="input-group custom-dropdown-container m-0 relative">
                        <label class="fw-800 text-gray-modal">หน่วย</label>
                        <div class="modal-input-text-blue flex-between pointer" id="add-unit-display" onclick="toggleInventoryDropdown('list-add-unit')">
                            <span id="text-add-unit">เลือกหน่วย</span>
                            <svg class="dropdown-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <ul id="list-add-unit" class="dropdown-list-standard hidden"></ul>
                    </div>
                    <div class="input-group m-0"><label class="fw-800 text-gray-modal">ราคา/หน่วย</label><input type="text" id="add-material-price" oninput="validatePrice(this)" class="modal-input-text-blue"></div>
                    <div class="input-group m-0"><label class="fw-800 text-gray-modal">จุดสั่งซื้อ</label><input type="text" id="add-material-reorder" oninput="validateInteger(this)" class="modal-input-text-blue"></div>
                    <div class="input-group m-0 mb-10"><label class="fw-800 text-gray-modal">คลังวัสดุคงเหลือ</label><input type="text" id="add-material-qty" value="0" oninput="validateInteger(this)" class="modal-input-text-blue"></div>
                    <div class="modal-actions-right d-flex flex-middle-end gap-15 mt-5">
                        <button type="button" class="btn-action btn-save-success px-40 h-auto" onclick="initiateSaveMaterial('add')">บันทึก</button>
                        <button type="button" class="btn-action btn-close-danger px-40 h-auto" onclick="initiateCancelMaterial('add')">ยกเลิก</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function injectSettingsModal() {
    if(document.getElementById('modal-settings')) return;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';
    overlay.id = 'modal-settings';
    overlay.innerHTML = `
        <div class="modal modal-edit-large p-0 border-none bg-white">
            <div class="modal-header-blue-dark border-radius-top">
                <h2 id="modal-settings-title" class="title-28 text-white fw-700 m-0">ตั้งค่าวัสดุ</h2>
            </div>
            <div class="modal-body p-30">
                <form onsubmit="event.preventDefault();" class="modal-input-group-gap-20">
                    <div class="input-group m-0">
                        <label class="fw-800 text-gray-modal">วัสดุ</label>
                        <input type="text" id="edit-material-name" maxlength="50" placeholder="ชื่อวัสดุ" readonly class="modal-input-text-blue modal-input-readonly">
                    </div>
                    <div class="input-group m-0">
                        <label class="fw-800 text-gray-modal">ชนิดวัสดุ</label>
                        <input type="text" id="edit-material-subtype" maxlength="50" placeholder="ชนิดวัสดุ" readonly class="modal-input-text-blue modal-input-readonly">
                    </div>
                    <div class="input-group m-0">
                        <label class="fw-800 text-gray-modal">ประเภทวัสดุ</label>
                        <input type="text" id="edit-material-type" maxlength="50" placeholder="ประเภทวัสดุ" readonly class="modal-input-text-blue modal-input-readonly">
                    </div>
                    <div class="input-group custom-dropdown-container m-0 relative">
                        <label class="fw-800 text-gray-modal">หน่วย</label>
                        <input type="text" id="edit-material-unit" readonly placeholder="เลือกหน่วย" class="modal-input-text-blue" onclick="toggleUnitDropdown('list-edit-unit')" />
                        <svg class="dropdown-arrow-icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M5 8l5 5 5-5" stroke="#9ca3af" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        <ul id="list-edit-unit" class="dropdown-list-standard max-h-200 hidden"></ul>
                    </div>
                    <div class="input-group m-0">
                        <label class="fw-800 text-gray-modal">ราคา/หน่วย</label>
                        <input type="text" id="edit-material-price" value="25" oninput="validatePrice(this)" class="modal-input-text-blue">
                    </div>
                    <div class="input-group m-0">
                        <label class="fw-800 text-gray-modal">จุดสั่งซื้อ</label>
                        <input type="text" id="edit-material-reorder" value="50" oninput="validateInteger(this)" class="modal-input-text-blue">
                    </div>
                    <div class="input-group m-0 mb-10">
                        <label class="fw-800 text-gray-modal">คลังวัสดุคงเหลือ</label>
                        <input type="text" id="edit-material-qty" value="5" oninput="validateInteger(this)" class="modal-input-text-blue">
                    </div>
                    <div class="modal-actions-right d-flex flex-middle-end gap-10">
                        <button type="button" id="btn-save-material" class="btn-action btn-save-success px-25 h-auto f-14" onclick="initiateSaveMaterial('edit')">บันทึกข้อมูลวัสดุ</button>
                        <button type="button" class="btn-action btn-close-danger px-30 h-auto f-14" onclick="initiateCancelMaterial('edit')">ยกเลิก</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

const INVENTORY_MATERIAL_DATA = {
    "กระดาษ": {
        subTypes: ["A0", "A1", "A2", "A3", "A4", "A5", "F4", "นามบัตร (54x90 mm)"],
        types: [
            "กระดาษปอนด์ 70 แกรม (กระดาษปกติ)", "กระดาษปอนด์ 80 แกรม", "กระดาษร้อยปอนด์ (ผิวหยาบ)",
            "กระดาษร้อยปอนด์ (ผิวเรียบ)", "กระดาษอาร์ตมัน 100g", "กระดาษอาร์ตมัน 120g",
            "กระดาษอาร์ตมัน 160g", "อาร์ตด้าน 100g", "อาร์ตด้าน 120g", "อาร์ตด้าน 160g",
            "กระดาษโฟโต้", "สติ๊กเกอร์กระดาษ (ผิวมัน)", "สติ๊กเกอร์กระดาษ (ผิวด้าน)",
            "สติ๊กเกอร์ PVC (ใส)", "สติ๊กเกอร์ PVC (ขาวเงา)", "สติ๊กเกอร์ PVC (ขาวด้าน)",
            "กระดาษคราฟท์ (สีน้ำตาล)", "เทรซิ่ง (กระดาษไข)"
        ]
    },
    "หมึกพิมพ์": {
        subTypes: ["เครื่องอิงค์เจ็ท (Inkjet)", "เครื่องเลเซอร์ (Laser)", "อิงค์แทงค์ (Ink Tank)", "หมึกพิมพ์ใบเสร็จ"],
        types: ["สีดำ (Black - K)", "สีฟ้า (Cyan - C)", "สีชมพู (Magenta - M)", "สีเหลือง (Yellow - Y)", "สีฟ้าอ่อน (Light Cyan)", "สีชมพูอ่อน (Light Magenta)"]
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

async function loadData() {
    try {
        const tbody = document.querySelector('.inventory-table tbody');
        if (tbody) tbody.innerHTML = createLoadingSpinner(8);

        inventoryData = await fetchApi('/api/inventory');
        renderInventoryTable();
    } catch (err) {
        alert(err.message);
    }
}

function renderInventoryTable() {
    const tbody = document.querySelector('.inventory-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    inventoryData.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'custom-table-row';
        tr.style.backgroundColor = (index % 2 === 0) ? '#fff' : '#fafafa';
        tr.style.borderBottom = `1px solid ${tr.style.backgroundColor}`;

        const qtyValue = parseInt(item.qty, 10) || 0;
        const reorderValue = parseInt(item.reorder, 10) || 0;

        let statusHtml = '';
        let qtyClass = '';

        if (qtyValue === 0) {
            statusHtml = '<span class="status-out text-red fw-600">หมด</span>';
            qtyClass = 'text-red fw-700';
        } else if (qtyValue <= reorderValue) {
            statusHtml = '<span class="status-low text-orange fw-600">สินค้าใกล้หมด</span>';
            qtyClass = 'text-red fw-700';
        } else {
            statusHtml = '<span class="status-instock text-blue fw-600">มีสินค้า</span>';
        }

        const typeHtml = item.type ? item.type : '';

        tr.innerHTML = `
            <td class="table-td-left-30 item-name item-name-bold">${item.name}</td>
            <td class="item-subtype text-muted" style="font-size: 14px;">${item.subType || '-'}</td>
            <td class="item-type item-type-muted">${typeHtml}</td>
            <td class="qty-remaining ${qtyClass}">${item.qty}</td>
            <td class="item-unit">${item.unit}</td>
            <td class="item-price">${item.price}</td>
            <td class="reorder-point fw-700 text-dark-main">${item.reorder}</td>
            <td>${statusHtml}</td>
            <td class="table-td-actions">
                <div class="action-buttons-wrapper">
                    <button class="custom-btn-edit" onclick="openSettingsModal(this)">แก้ไข</button>
                    <button class="custom-btn-delete" onclick="openDeleteMaterialModal(this)">ลบสินค้า</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateItemCount();
    checkStockColors();
    initializeRowIndices();
}


function updateItemCount() {
    const tbody = document.querySelector('.inventory-table tbody');
    const count = tbody ? Array.from(tbody.querySelectorAll('tr')).filter(row => row.style.display !== 'none').length : 0;
    const countEl = document.getElementById('total-item-count');
    if (countEl) countEl.innerText = count;
}

let currentSort = null; // Tracks current sort state

function initializeRowIndices() {
    const tbody = document.querySelector('.inventory-table tbody');
    if (tbody) {
        Array.from(tbody.querySelectorAll('tr')).forEach((row, index) => {
            if (!row.hasAttribute('data-original-index')) {
                row.setAttribute('data-original-index', window._initialIndexLoaded ? (-1 * Date.now()) : index);
            }
        });
        window._initialIndexLoaded = true;
    }
}

function resetToOriginalOrder() {
    const tbody = document.querySelector('.inventory-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
        const idxA = parseFloat(a.getAttribute('data-original-index')) || 0;
        const idxB = parseFloat(b.getAttribute('data-original-index')) || 0;
        return idxA - idxB;
    });
    rows.forEach((row, i) => {
        row.style.backgroundColor = (i % 2 === 0) ? '#fff' : '#fafafa';
        tbody.appendChild(row);
    });
    resetAllArrows();
    currentSort = null;
}

function resetAllArrows() {
    document.getElementById('arrow-stock-up').style.color = '#bbf7d0';
    document.getElementById('arrow-stock-down').style.color = '#fecaca';
    document.getElementById('arrow-status-up').style.color = '#bae6fd';
    document.getElementById('arrow-status-down').style.color = '#fecaca';
}

function sortByStock(direction) {
    initializeRowIndices();
    const newSort = 'stock-' + direction;
    if (currentSort === newSort) {
        resetToOriginalOrder();
        return;
    }
    currentSort = newSort;

    resetAllArrows();
    if (direction === 'desc') {
        document.getElementById('arrow-stock-up').style.color = '#22c55e';
    } else {
        document.getElementById('arrow-stock-down').style.color = '#ef4444';
    }

    const tbody = document.querySelector('.inventory-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const qtyA = parseInt(a.querySelector('.qty-remaining')?.innerText.trim()) || 0;
        const qtyB = parseInt(b.querySelector('.qty-remaining')?.innerText.trim()) || 0;
        return direction === 'desc' ? qtyB - qtyA : qtyA - qtyB;
    });

    rows.forEach((row, i) => {
        row.style.backgroundColor = (i % 2 === 0) ? '#fff' : '#fafafa';
        tbody.appendChild(row);
    });
}

function sortByStatus(type) {
    initializeRowIndices();
    const newSort = 'status-' + type;
    if (currentSort === newSort) {
        resetToOriginalOrder();
        return;
    }
    currentSort = newSort;

    resetAllArrows();
    if (type === 'instock') {
        document.getElementById('arrow-status-up').style.color = '#38bdf8';
    } else {
        document.getElementById('arrow-status-down').style.color = '#ef4444';
    }

    const tbody = document.querySelector('.inventory-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const statusOrder = (row) => {
        const statusText = row.querySelector('.status-instock, .status-low, .status-out')?.innerText.trim() || '';
        if (statusText === 'มีสินค้า') return 1;
        if (statusText === 'สินค้าใกล้หมด') return 2;
        return 3; // หมด
    };

    rows.sort((a, b) => {
        const orderA = statusOrder(a);
        const orderB = statusOrder(b);
        return type === 'instock' ? orderA - orderB : orderB - orderA;
    });

    rows.forEach((row, i) => {
        row.style.backgroundColor = (i % 2 === 0) ? '#fff' : '#fafafa';
        tbody.appendChild(row);
    });
}

function openSettingsModal(btn) {
    currentRowToEdit = btn.closest('tr');

    const name = currentRowToEdit.querySelector('.item-name') ? currentRowToEdit.querySelector('.item-name').innerText.trim() : '';
    const subType = currentRowToEdit.querySelector('.item-subtype') ? currentRowToEdit.querySelector('.item-subtype').innerText.trim() : '';
    const type = currentRowToEdit.querySelector('.item-type') ? currentRowToEdit.querySelector('.item-type').innerText.trim() : '';
    const qty = currentRowToEdit.querySelector('.qty-remaining') ? currentRowToEdit.querySelector('.qty-remaining').innerText.trim() : '';
    const unit = currentRowToEdit.querySelector('.item-unit') ? currentRowToEdit.querySelector('.item-unit').innerText.trim() : '';
    const price = currentRowToEdit.querySelector('.item-price') ? currentRowToEdit.querySelector('.item-price').innerText.trim() : '';
    const reorder = currentRowToEdit.querySelector('.reorder-point') ? currentRowToEdit.querySelector('.reorder-point').innerText.trim() : '';

    const editNameField = document.getElementById('edit-material-name');
    if (editNameField) editNameField.value = name;
    const editSubField = document.getElementById('edit-material-subtype');
    if (editSubField) editSubField.value = subType;
    const editTypeField = document.getElementById('edit-material-type');
    if (editTypeField) editTypeField.value = type;

    const qtyField = document.getElementById('edit-material-qty');
    if (qtyField) qtyField.value = qty;

    const unitField = document.getElementById('edit-material-unit');
    if (unitField) unitField.value = unit;

    const priceField = document.getElementById('edit-material-price');
    if (priceField) priceField.value = price;

    const reorderField = document.getElementById('edit-material-reorder');
    if (reorderField) reorderField.value = reorder;

    const title = document.getElementById('modal-settings-title');
    if (title) title.innerText = 'ตั้งค่าวัสดุ';
    const saveBtn = document.getElementById('btn-save-material');
    if (saveBtn) saveBtn.innerText = 'บันทึกข้อมูลวัสดุ';

    document.getElementById('modal-settings').classList.remove('hidden');
}

function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    
    el.classList.add('closing');
    
    // Wait for animation to finish (matching CSS duration of 0.25s)
    setTimeout(() => {
        el.classList.add('hidden');
        el.classList.remove('closing');
    }, 250); // 250ms matches the 0.25s animation duration
}

let currentMaterialActionType = null;

function openAddMaterialModal() {
    // Reset fields
    document.getElementById('text-add-material').innerText = 'ชื่อวัสดุ';
    document.getElementById('text-add-subtype').innerText = 'ชนิดวัสดุ';
    document.getElementById('text-add-type').innerText = 'ประเภทวัสดุ';
    document.getElementById('text-add-unit').innerText = 'เลือกหน่วย';
    
    document.getElementById('add-material-price').value = '';
    document.getElementById('add-material-reorder').value = '';
    document.getElementById('add-material-qty').value = '0';

    // Reset dropdown lists
    initInventoryDropdowns();

    document.getElementById('modal-add-material').classList.remove('hidden');
}

function initiateSaveMaterial(type) {
    currentMaterialActionType = type;
    
    let name, subType, typeVal, unit, price, reorder, qty;
    
    if (type === 'add') {
        name = document.getElementById('text-add-material').innerText.trim();
        subType = document.getElementById('text-add-subtype').innerText.trim();
        typeVal = document.getElementById('text-add-type').innerText.trim();
        unit = document.getElementById('text-add-unit').innerText.trim();
        price = document.getElementById('add-material-price').value.trim();
        reorder = document.getElementById('add-material-reorder').value.trim();
        qty = document.getElementById('add-material-qty').value.trim();
    } else {
        name = document.getElementById('edit-material-name').value.trim();
        subType = document.getElementById('edit-material-subtype').value.trim();
        typeVal = document.getElementById('edit-material-type').value.trim();
        unit = document.getElementById('edit-material-unit').value.trim();
        price = document.getElementById('edit-material-price').value.trim();
        reorder = document.getElementById('edit-material-reorder').value.trim();
        qty = document.getElementById('edit-material-qty').value.trim();
    }

    const errors = [];
    if (type === 'add') {
        if (name === 'ชื่อวัสดุ') errors.push({ label: 'วัสดุ', message: 'กรุณาเลือกวัสดุ' });
        if (subType === 'ชนิดวัสดุ') errors.push({ label: 'ชนิดวัสดุ', message: 'กรุณาเลือกชนิดวัสดุ' });
        if (typeVal === 'ประเภทวัสดุ') errors.push({ label: 'ประเภทวัสดุ', message: 'กรุณาเลือกประเภทวัสดุ' });
        if (unit === 'เลือกหน่วย') errors.push({ label: 'หน่วย', message: 'กรุณาเลือกหน่วย' });
    } else {
        if (!name) errors.push({ label: 'วัสดุ', message: 'กรุณาเลือกวัสดุ' });
        if (!subType) errors.push({ label: 'ชนิดวัสดุ', message: 'กรุณาเลือกชนิดวัสดุ' });
        if (!typeVal) errors.push({ label: 'ประเภทวัสดุ', message: 'กรุณาเลือกประเภทวัสดุ' });
        if (!unit) errors.push({ label: 'หน่วย', message: 'กรุณาเลือกหน่วย' });
    }
    
    // 1. ราคา/หน่วย
    if (!price) {
        errors.push({ label: 'ราคา/หน่วย', message: 'กรุณากรอกราคา' });
    } else if (parseFloat(price) < 1) {
        errors.push({ label: 'ราคา/หน่วย', message: 'ราคาต้องไม่น้อยกว่า 1' });
    }

    // 2. จุดสั่งซื้อ
    if (!reorder) {
        errors.push({ label: 'จุดสั่งซื้อ', message: 'กรุณากรอกจุดสั่งซื้อ' });
    } else {
        const reorderNum = parseFloat(reorder);
        if (reorderNum < 1) {
            errors.push({ label: 'จุดสั่งซื้อ', message: 'จุดสั่งซื้อต้องไม่น้อยกว่า 1' });
        } else if (reorder.includes('.')) {
            errors.push({ label: 'จุดสั่งซื้อ', message: 'จุดสั่งซื้อห้ามเป็นทศนิยม' });
        }
    }

    // 3. คลังวัสดุคงเหลือ
    if (!qty) {
        errors.push({ label: 'คลังวัสดุคงเหลือ', message: 'กรุณากรอกจำนวนคงเหลือ' });
    } else {
        const qtyNum = parseFloat(qty);
        if (qtyNum < 1) {
            errors.push({ label: 'คลังวัสดุคงเหลือ', message: 'คลังวัสดุคงเหลือต้องไม่น้อยกว่า 1' });
        } else if (qty.includes('.')) {
            errors.push({ label: 'คลังวัสดุคงเหลือ', message: 'คลังวัสดุคงเหลือห้ามเป็นทศนิยม' });
        }
    }

    if (errors.length > 0) {
        showValidationModal(errors);
        return;
    }

    if (type === 'add') {
        document.getElementById('modal-add-material').classList.add('hidden');
    } else {
        document.getElementById('modal-settings').classList.add('hidden');
    }

    showConfirmModal({
        title: 'ยืนยันการบันทึกข้อมูลวัสดุ',
        headerClass: 'modal-header-confirm modal-header-save bg-green-light',
        bodyHtml: `<h3 class="modal-h3-confirm" style="text-align: center;">คุณต้องการบันทึกข้อมูลวัสดุ ใช่หรือไม่ ?</h3>`,
        confirmText: 'บันทึกวัสดุ',
        confirmBtnClass: 'btn-action btn-save',
        cancelText: 'ยกเลิก',
        cancelBtnClass: 'btn-action btn-cancel',
        onConfirm: () => {
             if (currentMaterialActionType === 'add') saveNewMaterial();
             else saveMaterialData();
        },
        onCancel: () => {
             if (currentMaterialActionType === 'add') document.getElementById('modal-add-material').classList.remove('hidden');
             else document.getElementById('modal-settings').classList.remove('hidden');
        }
    });
}

function initiateCancelMaterial(type) {
    currentMaterialActionType = type;
    if (type === 'add') {
        document.getElementById('modal-add-material').classList.add('hidden');
    } else {
        document.getElementById('modal-settings').classList.add('hidden');
    }

    showConfirmModal({
        title: 'ยืนยันการยกเลิกบันทึกวัสดุ',
        headerClass: 'modal-header-confirm modal-header-cancel bg-red-main',
        bodyHtml: `<h3 class="modal-h3-confirm" style="text-align: center;">คุณต้องการยกเลิกการบันทึกวัสดุ ใช่หรือไม่ ?</h3>`,
        confirmText: 'ยกเลิกบันทึกวัสดุ',
        confirmBtnClass: 'btn-action btn-close',
        cancelText: 'ย้อนกลับ',
        cancelBtnClass: 'btn-action btn-cancel',
        onConfirm: () => {
            if (currentMaterialActionType === 'add') {
                removeModalCompletely('modal-add-material');
            } else {
                removeModalCompletely('modal-settings');
            }
        },
        onCancel: () => {
             if (currentMaterialActionType === 'add') {
                 const el = document.getElementById('modal-add-material');
                 if(el) el.classList.remove('hidden');
             }
             else {
                 const el = document.getElementById('modal-settings');
                 if(el) el.classList.remove('hidden');
             }
        }
    });
}

function openDeleteMaterialModal(btn) {
    currentRowToDelete = btn.closest('tr');

    const name = currentRowToDelete.querySelector('.item-name') ? currentRowToDelete.querySelector('.item-name').innerText.trim() : '';
    const type = currentRowToDelete.querySelector('.item-type') ? currentRowToDelete.querySelector('.item-type').innerText.trim() : '';

    const combined = type ? `${name} ( ${type} )` : name;

    showConfirmModal({
        title: 'ยืนยันการลบ',
        headerClass: 'modal-header-confirm modal-header-cancel',
        bodyClass: 'modal-body-confirm',
        actionsContainerClass: 'modal-actions-confirm',
        bodyHtml: `
            <div class="confirm-content" style="text-align: left;">
                <p class="confirm-text">คุณต้องการลบวัสดุ</p>
                <h3 class="confirm-target" style="word-break: break-all;">${combined}</h3>
                <p class="confirm-subtext">ออกจากคลังวัสดุใช่หรือไม่? เมื่อลบแล้วข้อมูลจะไม่สามารถกู้คืนได้</p>
            </div>
        `,
        confirmText: 'ยืนยันการลบ',
        confirmBtnClass: 'btn-action btn-cancel-confirm-action',
        cancelText: 'ยกเลิก',
        cancelBtnClass: 'btn-action btn-close-danger-action',
        onConfirm: confirmDeleteMaterial,
        onCancel: () => {
            currentRowToDelete = null;
        }
    });
}

function closeDeleteMaterialModal() {
    // left empty for compatibility
}



function saveNewMaterial() {
    const name = document.getElementById('text-add-material').innerText.trim();
    const subType = document.getElementById('text-add-subtype').innerText.trim();
    const type = document.getElementById('text-add-type').innerText.trim();
    const unit = document.getElementById('text-add-unit').innerText.trim();
    
    const price = document.getElementById('add-material-price').value.trim();
    const reorder = document.getElementById('add-material-reorder').value.trim() || '0';
    const qty = document.getElementById('add-material-qty').value.trim() || '0';

    const tbody = document.querySelector('.inventory-table tbody');
    if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'custom-table-row';

        let statusHtml = `<span class="status-out" style="color: #ef4444; font-weight: 600;">หมด</span>`;

        tr.innerHTML = `
                <td class="table-td-left-30 item-name item-name-bold">${name}</td>
                <td class="item-subtype text-muted" style="font-size: 14px;">${subType || '-'}</td>
                <td class="item-type item-type-muted">${type}</td>
                <td class="qty-remaining">${qty}</td>
                <td class="item-unit">${unit}</td>
                <td class="item-price">${price}</td>
                <td class="reorder-point fw-700 text-dark-main">${reorder}</td>
                <td>${statusHtml}</td>
                <td class="table-td-actions">
                    <div class="action-buttons-wrapper">
                        <button class="custom-btn-edit" onclick="openSettingsModal(this)">แก้ไข</button>
                        <button class="custom-btn-delete" onclick="openDeleteMaterialModal(this)">ลบสินค้า</button>
                    </div>
                </td>
        `;
        tbody.prepend(tr);

        Array.from(tbody.children).forEach((row, index) => {
            row.style.backgroundColor = (index % 2 === 0) ? '#fff' : '#fafafa';
            row.style.borderBottom = `1px solid ${row.style.backgroundColor}`;
        });

        updateItemCount();
    }

    showStatusModal('บันทึกข้อมูลวัสดุสำเร็จ', 'ข้อมูลวัสดุได้รับการบันทึกแล้ว', 'success');
    checkStockColors();
}

function toggleInventoryDropdown(listId) {
    // Close other dropdowns first
    document.querySelectorAll('.dropdown-list-standard').forEach(el => {
        if (el.id !== listId) {
            el.classList.add('hidden');
            const container = el.closest('.custom-dropdown-container');
            if (container) container.classList.remove('open');
        }
    });

    const list = document.getElementById(listId);
    if (!list) return;
    
    const isHidden = list.classList.contains('hidden');
    
    if (isHidden) {
        list.classList.remove('hidden');
    } else {
        list.classList.add('hidden');
    }
    
    const container = list.closest('.custom-dropdown-container');
    if (container) {
        container.classList.toggle('open', isHidden);
    }
}

function initInventoryDropdowns() {
    // Populate Materials
    const materialList = document.getElementById('list-add-material');
    if (materialList) {
        materialList.innerHTML = '';
        Object.keys(INVENTORY_MATERIAL_DATA).forEach(mat => {
            const li = document.createElement('li');
            li.textContent = mat;
            li.style.cssText = "padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;";
            li.onmouseover = function () { this.style.backgroundColor = '#f0f9ff'; this.style.color = '#0ea5e9'; };
            li.onmouseout = function () { this.style.backgroundColor = 'white'; this.style.color = '#1e293b'; };
            li.onclick = (e) => { e.stopPropagation(); selectInventoryMaterial(mat); };
            materialList.appendChild(li);
        });
    }

    // Units
    const unitList = document.getElementById('list-add-unit');
    if (unitList) {
        unitList.innerHTML = '';
        unitOptionsList.forEach(unit => {
            const li = document.createElement('li');
            li.textContent = unit;
            li.style.cssText = "padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;";
            li.onmouseover = function () { this.style.backgroundColor = '#f0f9ff'; this.style.color = '#0ea5e9'; };
            li.onmouseout = function () { this.style.backgroundColor = 'white'; this.style.color = '#1e293b'; };
            li.onclick = (e) => {
                e.stopPropagation();
                document.getElementById('text-add-unit').innerText = unit;
                unitList.classList.add('hidden');
                const container = unitList.closest('.custom-dropdown-container');
                if (container) container.classList.remove('open');
            };
            unitList.appendChild(li);
        });
    }
}

function populateTypeList(prefix, types) {
    const typeList = document.getElementById(`list-${prefix}-type`);
    const typeText = document.getElementById(`text-${prefix}-type`);
    if (!typeList) return;

    typeList.innerHTML = '';
    if (!types || types.length === 0) {
        if (typeText) typeText.innerText = 'ประเภทวัสดุ';
        return;
    }

    types.forEach(type => {
        const li = document.createElement('li');
        li.textContent = type;
        li.style.cssText = "padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;";
        li.onmouseover = function () { this.style.backgroundColor = '#f0f9ff'; this.style.color = '#0ea5e9'; };
        li.onmouseout = function () { this.style.backgroundColor = 'white'; this.style.color = '#1e293b'; };
        li.onclick = (e) => {
            e.stopPropagation();
            if (typeText) typeText.innerText = type;
            typeList.classList.add('hidden');
            const containerT = typeList.closest('.custom-dropdown-container');
            if (containerT) containerT.classList.remove('open');
        };
        typeList.appendChild(li);
    });
}

function selectInventoryMaterial(mat) {
    document.getElementById('text-add-material').innerText = mat;
    document.getElementById('list-add-material').classList.add('hidden');
    const container = document.getElementById('list-add-material').closest('.custom-dropdown-container');
    if (container) container.classList.remove('open');
    
    // Clear sub and type display
    document.getElementById('text-add-subtype').innerText = 'ชนิดวัสดุ';
    document.getElementById('text-add-type').innerText = 'ประเภทวัสดุ';
    
    const data = INVENTORY_MATERIAL_DATA[mat];
    if (!data) return;

    // Populate SubTypes
    const subList = document.getElementById('list-add-subtype');
    if (subList) {
        subList.innerHTML = '';
        data.subTypes.forEach(sub => {
            const li = document.createElement('li');
            li.textContent = sub;
            li.style.cssText = "padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;";
            li.onmouseover = function () { this.style.backgroundColor = '#f0f9ff'; this.style.color = '#0ea5e9'; };
            li.onmouseout = function () { this.style.backgroundColor = 'white'; this.style.color = '#1e293b'; };
            li.onclick = (e) => { e.stopPropagation(); selectInventorySubType(sub, mat); };
            subList.appendChild(li);
        });
    }

    // Populate Types if general types exist
    if (data.types) {
        populateTypeList('add', data.types);
    } else {
        populateTypeList('add', []); // Clear if dynamic
    }
}

function selectInventorySubType(sub, mat) {
    document.getElementById('text-add-subtype').innerText = sub;
    document.getElementById('list-add-subtype').classList.add('hidden');
    const container = document.getElementById('list-add-subtype').closest('.custom-dropdown-container');
    if (container) container.classList.remove('open');

    // Populate Types based on SubType if typesBySubType exists
    const data = INVENTORY_MATERIAL_DATA[mat];
    if (data && data.typesBySubType) {
        const types = data.typesBySubType[sub] || data.typesBySubType['default'] || [];
        populateTypeList('add', types);
    }
}

function saveMaterialData() {
    if (currentRowToEdit) {
        const nameTd = currentRowToEdit.querySelector('.item-name');
        const subTypeTd = currentRowToEdit.querySelector('.item-subtype');
        const typeTd = currentRowToEdit.querySelector('.item-type');
        const unitTd = currentRowToEdit.querySelector('.item-unit');
        const priceTd = currentRowToEdit.querySelector('.item-price');
        const reorderTd = currentRowToEdit.querySelector('.reorder-point');
        const qtyTd = currentRowToEdit.querySelector('.qty-remaining');

        const name = document.getElementById('edit-material-name').value.trim();
        const subType = document.getElementById('edit-material-subtype').value.trim();
        const type = document.getElementById('edit-material-type').value.trim();
        const unit = document.getElementById('edit-material-unit').value.trim();
        const price = document.getElementById('edit-material-price').value.trim();
        const reorder = document.getElementById('edit-material-reorder').value.trim() || '0';
        const qty = document.getElementById('edit-material-qty').value.trim() || '0';

        if (nameTd) nameTd.innerText = name;
        if (subTypeTd) subTypeTd.innerText = subType;
        if (typeTd) typeTd.innerText = type;
        if (unitTd) unitTd.innerText = unit;
        if (priceTd) priceTd.innerText = price;
        if (reorderTd) reorderTd.innerText = reorder;
        if (qtyTd) qtyTd.innerText = qty;
    }

    // showStatusModal('success'); // Removed 2s popup
    checkStockColors();
}

function checkStockColors() {
    const rows = document.querySelectorAll('.inventory-table tbody tr');
    rows.forEach(tr => {
        const qtyCell = tr.querySelector('.qty-remaining');
        const reorderCell = tr.querySelector('.reorder-point');
        const statusTd = tr.querySelector('td:nth-child(8)');

        if (qtyCell && reorderCell) {
            const qty = parseInt(qtyCell.innerText.trim(), 10);
            const reorder = parseInt(reorderCell.innerText.trim(), 10);

            if (!isNaN(qty) && !isNaN(reorder)) {
                if (qty === 0) {
                    qtyCell.style.color = '#ef4444';
                    qtyCell.style.fontWeight = '700';
                    if (statusTd) {
                        statusTd.innerHTML = '<span class="status-out" style="color: #ef4444; font-weight: 600;">หมด</span>';
                    }
                } else if (qty <= reorder) {
                    qtyCell.style.color = '#ef4444';
                    qtyCell.style.fontWeight = '700';
                    if (statusTd) {
                        statusTd.innerHTML = '<span class="status-low" style="color: #f59e0b; font-weight: 600;">สินค้าใกล้หมด</span>';
                    }
                } else {
                    qtyCell.style.color = '#111827';
                    qtyCell.style.fontWeight = '500';
                    if (statusTd) {
                        statusTd.innerHTML = '<span class="status-instock" style="color: #3b82f6; font-weight: 600;">มีสินค้า</span>';
                    }
                }
            }
        }
    });
}

function confirmDeleteMaterial() {
    if (currentRowToDelete) {
        currentRowToDelete.remove();
        currentRowToDelete = null;
        updateItemCount();
        showStatusModal('ลบวัสดุสำเร็จ', 'ข้อมูลถูกลบสำเร็จแล้ว', 'success');
    }
}

const unitOptionsList = ['เล่ม', 'รีม', 'แผ่น', 'แพ็ค', 'หลอด', 'ขวด', 'เส้น', 'กล่อง', 'ด้าม', 'ตัว', 'ใบ', 'ซอง', 'ชิ้น', 'แท่ง', 'ตลับ', 'อัน', 'ม้วน', 'ก้อน', 'ถุง', 'กระป๋อง', 'ชุด'].sort((a, b) => a.localeCompare(b, 'th'));

function toggleUnitDropdown(listId) {
    document.querySelectorAll('.dropdown-list-standard').forEach(el => {
        if (el.id !== listId) {
            el.classList.add('hidden');
            const container = el.closest('.custom-dropdown-container');
            if (container) container.classList.remove('open');
        }
    });

    const list = document.getElementById(listId);
    if (!list) return;

    const isHidden = list.classList.contains('hidden');

    if (isHidden) {
        list.classList.remove('hidden');
    } else {
        list.classList.add('hidden');
    }

    const container = list.closest('.custom-dropdown-container');
    if (container) {
        container.classList.toggle('open', isHidden);
    }
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.custom-dropdown-container')) {
        document.querySelectorAll('.dropdown-list-standard').forEach(el => {
            el.classList.add('hidden');
        });
        document.querySelectorAll('.custom-dropdown-container').forEach(el => {
            el.classList.remove('open');
        });
    }
});

function initUnitDropdowns() {
    ['add', 'edit'].forEach(type => {
        const list = document.getElementById('list-' + type + '-unit');
        const input = document.getElementById(type + '-material-unit');
        if (list && input) {
            list.innerHTML = '';
            unitOptionsList.forEach(unit => {
                const li = document.createElement('li');
                li.textContent = unit;
                li.style.cssText = "padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;";
                li.onmouseover = function () { this.style.backgroundColor = '#f0f9ff'; this.style.color = '#0ea5e9'; };
                li.onmouseout = function () { this.style.backgroundColor = 'white'; this.style.color = '#1e293b'; };
                li.onclick = function (e) {
                    e.stopPropagation();
                    input.value = unit;
                    list.classList.add('hidden');
                    const container = list.closest('.custom-dropdown-container');
                    if (container) container.classList.remove('open');
                };
                list.appendChild(li);
            });
        }
    });
}

function validatePrice(input) {
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    const formatParts = value.split('.');
    if (formatParts[0].length > 4) {
        formatParts[0] = formatParts[0].substring(0, 4);
    }
    if (formatParts.length === 2) {
        if (formatParts[1].length > 2) {
            formatParts[1] = formatParts[1].substring(0, 2);
        }
        value = formatParts[0] + '.' + formatParts[1];
    } else {
        value = formatParts[0];
    }

    input.value = value;
}

function validateInteger(input) {
    let value = input.value;
    // Remove anything that is not a digit
    value = value.replace(/[^0-9]/g, '');

    // Limit to 4 digits for consistency with price logic if needed
    if (value.length > 4) {
        value = value.substring(0, 4);
    }

    input.value = value;
}

window.onload = function () {
    loadData();
    initUnitDropdowns();
    initInventoryDropdowns();
};
