// withdraw.js

function updateSummary() {
    const materialSelect = document.getElementById('withdraw-material');
    const typeSelect = document.getElementById('withdraw-type');
    const qty = document.getElementById('withdraw-qty').value;

    const matNameBox = document.getElementById('summary-mat-name');
    const matTypeBox = document.getElementById('summary-mat-type');
    const stockBox = document.getElementById('summary-stock');
    const qtyBox = document.getElementById('summary-qty');

    // Update Material Name
    if (materialSelect.selectedIndex > 0) {
        const option = materialSelect.options[materialSelect.selectedIndex];
        const matName = option.value;
        const stock = option.dataset.stock;
        const unit = option.dataset.unit;

        if (matNameBox) matNameBox.innerText = matName;
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
    if (typeSelect.selectedIndex > 0) {
        if (matTypeBox) matTypeBox.innerText = typeSelect.value;
    } else {
        if (matTypeBox) matTypeBox.innerText = 'ประเภทวัสดุ';
    }

    if (qtyBox) qtyBox.innerText = qty ? qty : '';
}

function flashError(element) {
    const originalBorder = element.style.borderColor;
    element.style.borderColor = '#ef4444'; // Red color
    setTimeout(() => {
        element.style.borderColor = originalBorder;
    }, 2000);
}

function openConfirmModal() {
    const nameInput = document.getElementById('withdrawer-name');
    const matSelect = document.getElementById('withdraw-material');
    const typeSelect = document.getElementById('withdraw-type');
    const qtyInput = document.getElementById('withdraw-qty');

    let isValid = true;

    if (!nameInput.value.trim()) {
        isValid = false;
        flashError(nameInput);
    }
    if (matSelect.selectedIndex <= 0) {
        isValid = false;
        flashError(matSelect);
    }
    if (typeSelect.selectedIndex <= 0) {
        isValid = false;
        flashError(typeSelect);
    }
    if (!qtyInput.value.trim()) {
        isValid = false;
        flashError(qtyInput);
    }

    if (!isValid) return;

    const matText = matSelect.options[matSelect.selectedIndex].value;
    const typeText = typeSelect.options[typeSelect.selectedIndex].value;
    const combinedText = `${matText} ( ${typeText} )`;

    document.getElementById('confirm-name').value = nameInput.value || '';
    document.getElementById('confirm-material').value = combinedText;
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
        
        // Add row to table
        addWithdrawRowToTable();
        
        // Reset form
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
    const combinedMaterial = document.getElementById('confirm-material').value || "-";
    const qty = document.getElementById('confirm-qty').value || "0";
    const note = document.getElementById('confirm-note').value || "-";

    // Split material and type: "A5 ( สติ๊กเกอร์ )" -> "A5" and "สติ๊กเกอร์"
    let matName = combinedMaterial;
    let matType = "-";
    if (combinedMaterial.includes('(')) {
        const parts = combinedMaterial.split('(');
        matName = parts[0].trim();
        matType = parts[1].replace(')', '').trim();
    }

    const tbody = document.querySelector('.withdraw-table tbody');
    if (!tbody) {
        console.error("Table body not found!");
        return;
    }

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

    // Prepend to show latest at top
    tbody.prepend(newRow);

    // Update alternating row colors for all rows in the table
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.forEach((row, index) => {
        const tds = row.querySelectorAll('td');
        if (index % 2 === 1) {
            // Odd index (2nd, 4th row etc.) -> Alt style
            row.className = "alt-row bg-gray-light";
            tds.forEach(td => {
                td.className = "bold-text withdraw-td-std withdraw-alt-td";
            });
        } else {
            // Even index (1st, 3rd row etc.) -> Normal white style
            row.className = "bg-white";
            tds.forEach(td => {
                td.className = "bold-text withdraw-td-std";
            });
        }
    });
}

function resetWithdrawForm() {
    document.getElementById('withdraw-material').selectedIndex = 0;
    document.getElementById('withdraw-type').selectedIndex = 0;
    document.getElementById('withdraw-qty').value = '';
    document.getElementById('withdraw-note').value = '';
    updateSummary();
}

// Initialize state
window.onload = function () {
    syncWithdrawerName();
    updateSummary();
};

/**
 * Syncs the name input with the username displayed in the navbar
 */
function syncWithdrawerName() {
    // Wait a bit for navbar to load if needed
    const checkNavbar = setInterval(() => {
        const navbarUsername = document.querySelector('.username');
        const nameInput = document.getElementById('withdrawer-name');
        
        if (navbarUsername && nameInput) {
            nameInput.value = navbarUsername.innerText.trim();
            clearInterval(checkNavbar);
        }
    }, 100);

    // Timeout after 3 seconds to avoid infinite loop
    setTimeout(() => clearInterval(checkNavbar), 3000);
}
