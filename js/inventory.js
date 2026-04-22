// inventory.js

let currentRowToDelete = null;
let currentRowToEdit = null;
let inventoryData = [];

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
        
        let statusHtml = '';
        let qtyClass = '';
        if (item.statusInfo === 'instock') {
            statusHtml = '<span class="status-instock text-blue fw-600">มีสินค้า</span>';
        } else if (item.statusInfo === 'low') {
            statusHtml = '<span class="status-low text-orange fw-600">สินค้าใกล้หมด</span>';
            qtyClass = 'text-red fw-700';
        } else {
            statusHtml = '<span class="status-out text-red fw-600">หมด</span>';
            qtyClass = 'text-red fw-700';
        }

        const typeHtml = item.type ? item.type : '';
        
        tr.innerHTML = `
            <td class="table-td-left-30 item-name item-name-bold">${item.name}</td>
            <td class="item-type item-type-muted">${typeHtml}</td>
            <td class="qty-remaining ${qtyClass}">${item.qty}</td>
            <td class="item-unit">${item.unit}</td>
            <td class="item-price">${item.price}</td>
            <td class="reorder-point fw-700 text-dark-main">${item.reorder}</td>
            <td>${statusHtml}</td>
            <td>
                <button class="custom-btn-edit" onclick="openSettingsModal(this)">แก้ไข</button>
                <button class="custom-btn-delete" onclick="openDeleteMaterialModal(this)">ลบสินค้า</button>
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
    const type = currentRowToEdit.querySelector('.item-type') ? currentRowToEdit.querySelector('.item-type').innerText.trim() : '';
    const qty = currentRowToEdit.querySelector('.qty-remaining') ? currentRowToEdit.querySelector('.qty-remaining').innerText.trim() : '';
    const unit = currentRowToEdit.querySelector('.item-unit') ? currentRowToEdit.querySelector('.item-unit').innerText.trim() : '';
    const price = currentRowToEdit.querySelector('.item-price') ? currentRowToEdit.querySelector('.item-price').innerText.trim() : '';
    const reorder = currentRowToEdit.querySelector('.reorder-point') ? currentRowToEdit.querySelector('.reorder-point').innerText.trim() : '';

    const editNameField = document.getElementById('edit-material-name');
    if (editNameField) editNameField.value = name;
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
    document.getElementById(modalId).classList.add('hidden');
}

let currentMaterialActionType = null;

function initiateSaveMaterial(type) {
    currentMaterialActionType = type;
    if (type === 'add') {
        document.getElementById('modal-add-material').classList.add('hidden');
    } else {
        document.getElementById('modal-settings').classList.add('hidden');
    }
    document.getElementById('modal-confirm-save-material').classList.remove('hidden');
}

function executeSaveMaterial() {
    document.getElementById('modal-confirm-save-material').classList.add('hidden');
    if (currentMaterialActionType === 'add') {
        saveNewMaterial();
    } else {
        saveMaterialData();
    }
}

function abortSaveMaterial() {
    document.getElementById('modal-confirm-save-material').classList.add('hidden');
    if (currentMaterialActionType === 'add') {
        document.getElementById('modal-add-material').classList.remove('hidden');
    } else {
        document.getElementById('modal-settings').classList.remove('hidden');
    }
}

function initiateCancelMaterial(type) {
    currentMaterialActionType = type;
    if (type === 'add') {
        document.getElementById('modal-add-material').classList.add('hidden');
    } else {
        document.getElementById('modal-settings').classList.add('hidden');
    }
    document.getElementById('modal-confirm-cancel-material').classList.remove('hidden');
}

function executeCancelMaterial() {
    document.getElementById('modal-confirm-cancel-material').classList.add('hidden');

    document.getElementById('modal-success-cancel-material').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('modal-success-cancel-material').classList.add('hidden');
    }, 2000);
}

function abortCancelMaterial() {
    document.getElementById('modal-confirm-cancel-material').classList.add('hidden');
    if (currentMaterialActionType === 'add') {
        document.getElementById('modal-add-material').classList.remove('hidden');
    } else {
        document.getElementById('modal-settings').classList.remove('hidden');
    }
}

function openDeleteMaterialModal(btn) {
    currentRowToDelete = btn.closest('tr');

    const name = currentRowToDelete.querySelector('.item-name') ? currentRowToDelete.querySelector('.item-name').innerText.trim() : '';
    const type = currentRowToDelete.querySelector('.item-type') ? currentRowToDelete.querySelector('.item-type').innerText.trim() : '';
    const qty = currentRowToDelete.querySelector('.qty-remaining') ? currentRowToDelete.querySelector('.qty-remaining').innerText.trim() : '';
    const unit = currentRowToDelete.querySelector('.item-unit') ? currentRowToDelete.querySelector('.item-unit').innerText.trim() : '';
    const price = currentRowToDelete.querySelector('.item-price') ? currentRowToDelete.querySelector('.item-price').innerText.trim() : '';
    const reorder = currentRowToDelete.querySelector('.reorder-point') ? currentRowToDelete.querySelector('.reorder-point').innerText.trim() : '';

    const combined = type ? `${name} ( ${type} )` : name;

    const combinedField = document.getElementById('delete-material-combined');
    if (combinedField) combinedField.value = combined;

    document.getElementById('delete-material-qty').value = qty;
    document.getElementById('delete-material-unit').value = unit;
    document.getElementById('delete-material-price').value = price;
    document.getElementById('delete-material-reorder').value = reorder;

    document.getElementById('modal-delete-material').classList.remove('hidden');
}

function openAddMaterialModal() {
    document.getElementById('add-material-name').value = '';
    document.getElementById('add-material-type').value = '';
    document.getElementById('add-material-unit').value = '';
    document.getElementById('add-material-price').value = '';
    const reorderField = document.getElementById('add-material-reorder');
    if (reorderField) reorderField.value = '';
    document.getElementById('add-material-qty').value = '0';

    document.getElementById('modal-add-material').classList.remove('hidden');
}

function saveNewMaterial() {
    const name = document.getElementById('add-material-name').value.trim();
    const type = document.getElementById('add-material-type').value.trim();
    const unit = document.getElementById('add-material-unit').value.trim();
    const price = document.getElementById('add-material-price').value.trim();
    const reorder = document.getElementById('add-material-reorder').value.trim() || '0';
    const qty = document.getElementById('add-material-qty').value.trim() || '0';

    if (!name) {
        return;
    }

    const tbody = document.querySelector('.inventory-table tbody');
    if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'custom-table-row';

        const typeHtml = type ? ` <span style="font-weight: 600; color: #4b5563;">( <span class="item-type">${type}</span> )</span>` : '';
        let statusHtml = `<span class="status-out" style="color: #ef4444; font-weight: 600;">หมด</span>`;

        tr.innerHTML = `
                <td class="table-td-left-30 item-name item-name-bold">${name}</td>
                <td class="item-type item-type-muted">${type}</td>
                <td class="qty-remaining">${qty}</td>
                <td class="item-unit">${unit}</td>
                <td class="item-price">${price}</td>
                <td class="reorder-point fw-700 text-dark-main">${reorder}</td>
                <td>${statusHtml}</td>
                <td>
                    <button class="custom-btn-edit" onclick="openSettingsModal(this)">แก้ไข</button>
                    <button class="custom-btn-delete" onclick="openDeleteMaterialModal(this)">ลบสินค้า</button>
                </td>
        `;
        tbody.prepend(tr);

        Array.from(tbody.children).forEach((row, index) => {
            row.style.backgroundColor = (index % 2 === 0) ? '#fff' : '#fafafa';
            row.style.borderBottom = `1px solid ${row.style.backgroundColor}`;
        });

        updateItemCount();
    }

    showStatusModal('success');
    checkStockColors();
}

function saveMaterialData() {
    if (currentRowToEdit) {
        const name = document.getElementById('edit-material-name').value.trim();
        const type = document.getElementById('edit-material-type').value.trim();
        const unit = document.getElementById('edit-material-unit').value.trim();
        const price = document.getElementById('edit-material-price').value.trim();
        const reorder = document.getElementById('edit-material-reorder').value.trim() || '0';
        const qty = document.getElementById('edit-material-qty').value.trim() || '0';

        const nameTd = currentRowToEdit.querySelector('.item-name');
        if (nameTd) nameTd.innerText = name;

        const typeTd = currentRowToEdit.querySelector('.item-type');
        if (typeTd) typeTd.innerText = type;

        const unitTd = currentRowToEdit.querySelector('.item-unit');
        if (unitTd) unitTd.innerText = unit;

        const priceTd = currentRowToEdit.querySelector('.item-price');
        if (priceTd) priceTd.innerText = price;

        const reorderTd = currentRowToEdit.querySelector('.reorder-point');
        if (reorderTd) reorderTd.innerText = reorder;

        const qtyTd = currentRowToEdit.querySelector('.qty-remaining');
        if (qtyTd) qtyTd.innerText = qty;
    }

    showStatusModal('success');
    checkStockColors();
}

function checkStockColors() {
    const rows = document.querySelectorAll('.inventory-table tbody tr');
    rows.forEach(tr => {
        const qtyCell = tr.querySelector('.qty-remaining');
        const reorderCell = tr.querySelector('.reorder-point');
        const statusTd = tr.querySelector('td:nth-child(7)');

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

function confirmDelete() {
    if (currentRowToDelete) {
        currentRowToDelete.remove();
        currentRowToDelete = null;
        showStatusModal('delete-success');
        updateItemCount();
    }
}

function showStatusModal(type) {
    let modalId = '';
    if (type === 'success') {
        modalId = 'modal-success';
        closeModal('modal-settings');
        closeModal('modal-add-material');
    } else if (type === 'error-save') {
        modalId = 'modal-error-save';
    } else if (type === 'error-upload') {
        modalId = 'modal-error-upload';
    } else if (type === 'delete-success') {
        modalId = 'modal-delete-success';
        closeModal('modal-delete-material');
    } else if (type === 'delete-error') {
        modalId = 'modal-delete-error';
    }

    if (modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        setTimeout(() => {
            closeModal(modalId);
        }, 2000);
    }
}

const unitOptionsList = ['เล่ม', 'รีม', 'แผ่น', 'แพ็ค', 'หลอด', 'ขวด', 'เส้น', 'กล่อง', 'ด้าม', 'ตัว', 'ใบ', 'ซอง', 'ชิ้น', 'แท่ง', 'ตลับ', 'อัน', 'ม้วน', 'ก้อน', 'ถุง', 'กระป๋อง', 'ชุด'].sort((a, b) => a.localeCompare(b, 'th'));

function toggleUnitDropdown(listId) {
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
    // Remove non-numeric and non-dot characters
    value = value.replace(/[^0-9.]/g, '');

    // Allow only one dot
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit integer part to 5 digits, decimal part to 2 digits
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

window.onload = function () {
    loadData();
    initUnitDropdowns();
};
