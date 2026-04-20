// withdraw.js

function updateSummary() {
    const materialSelect = document.getElementById('withdraw-material');
    const qty = document.getElementById('withdraw-qty').value;

    const matBox = document.getElementById('summary-mat-type');
    const stockBox = document.getElementById('summary-stock');
    const qtyBox = document.getElementById('summary-qty');

    if (materialSelect.selectedIndex > 0) {
        const option = materialSelect.options[materialSelect.selectedIndex];
        const matName = option.value;
        const stock = option.dataset.stock;
        const unit = option.dataset.unit;

        matBox.innerHTML = matName;
        stockBox.innerHTML = '<div style="font-size: 32px; font-weight: 700; color: #0f172a; line-height: 1.2;">' + stock + '</div><div class="unit-text" style="font-size: 22px; color: #0ea5e9; font-weight: 500;">' + unit + '</div>';
    } else {
        matBox.innerText = 'วัสดุ';
        stockBox.innerHTML = '<div style="font-size: 32px; font-weight: 700; color: #0f172a; line-height: 1.2;">คลัง</div><div class="unit-text" style="font-size: 22px; color: #0ea5e9; font-weight: 500;">หน่วย</div>';
    }

    qtyBox.innerText = qty ? qty : '';
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
    if (!qtyInput.value.trim()) {
        isValid = false;
        flashError(qtyInput);
    }

    if (!isValid) return;

    const matText = matSelect.options[matSelect.selectedIndex].value;

    document.getElementById('confirm-name').value = nameInput.value || '';
    document.getElementById('confirm-material').value = matText;
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
        // Optionally reset form here
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

// Initialize state
window.onload = function () {
    updateSummary();
};
