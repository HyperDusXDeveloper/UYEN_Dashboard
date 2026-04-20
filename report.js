// report.js

document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#report-date-1", {
        dateFormat: "d M Y",
        locale: "th",
        defaultDate: "18 May 2026"
    });
    flatpickr("#report-date-3", {
        plugins: [
            new monthSelectPlugin({
                shorthand: true,
                dateFormat: "M / Y",
                altFormat: "F Y",
                theme: "light"
            })
        ],
        locale: "th",
        defaultDate: "May / 2026",
        onChange: function (selectedDates) {
            if (selectedDates.length > 0) {
                filterMonthlySales(selectedDates[0]);
            } else {
                showAllMonthlySales();
            }
        },
        onReady: function (selectedDates) {
            if (selectedDates.length > 0) filterMonthlySales(selectedDates[0]);
        }
    });
});

function clearMonthlyFilter() {
    const fp = document.querySelector("#report-date-3")._flatpickr;
    if (fp) fp.clear();
}

function resetReportDate1() {
    const dateInput = document.getElementById("report-date-1");
    if (dateInput && dateInput._flatpickr) {
        dateInput._flatpickr.clear();
    }
}

function showAllMonthlySales() {
    const tbody = document.querySelector('#view-3 .report-table tbody');
    const rows = tbody.querySelectorAll('tr');

    let totalItems = 0;
    let totalSales = 0;
    let visibleRows = 0;

    rows.forEach((row) => {
        row.classList.remove('hidden');
        visibleRows++;

        const itemsStr = row.cells[1].textContent.trim();
        const salesStr = row.cells[2].textContent.trim().replace(/,/g, '').replace('บาท', '').trim();

        totalItems += parseInt(itemsStr) || 0;
        totalSales += parseInt(salesStr) || 0;

        row.style.backgroundColor = (visibleRows % 2 === 1) ? '#fafafa' : '';
    });

    const summaryEls = document.querySelectorAll('#view-3 .report-summary-value');
    if (summaryEls.length >= 2) {
        summaryEls[0].textContent = totalItems.toLocaleString();
        summaryEls[1].textContent = totalSales.toLocaleString();
    }
}

function filterLowStock() {
    const isChecked = document.getElementById('low-stock-checkbox').checked;
    const tbody = document.querySelector('#view-2 .report-table tbody');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');

    let visibleRows = 0;

    rows.forEach((row) => {
        const stockCell = row.cells[2];
        if (stockCell) {
            const stockText = stockCell.textContent.trim().replace(/,/g, '');
            const stockValue = parseFloat(stockText);

            if (!isChecked || stockValue <= 25) {
                row.classList.remove('hidden');
                visibleRows++;
                row.style.backgroundColor = (visibleRows % 2 === 0) ? '#fafafa' : '';
            } else {
                row.classList.add('hidden');
            }
        }
    });
}

function filterMonthlySales(dateObj) {
    const tbody = document.querySelector('#view-3 .report-table tbody');
    const rows = tbody.querySelectorAll('tr');

    const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const targetMonthStr = enMonths[dateObj.getMonth()];
    const targetYearStr = dateObj.getFullYear().toString();

    let totalItems = 0;
    let totalSales = 0;
    let visibleRows = 0;

    rows.forEach((row) => {
        const dateCell = row.cells[0];
        if (dateCell) {
            const cellText = dateCell.textContent.trim();
            if (cellText.includes(targetMonthStr) && cellText.includes(targetYearStr)) {
                row.classList.remove('hidden');
                visibleRows++;

                const itemsStr = row.cells[1].textContent.trim();
                const salesStr = row.cells[2].textContent.trim().replace(/,/g, '').replace('บาท', '').trim();

                totalItems += parseInt(itemsStr) || 0;
                totalSales += parseInt(salesStr) || 0;

                row.style.backgroundColor = (visibleRows % 2 === 1) ? '#fafafa' : '';
            } else {
                row.classList.add('hidden');
            }
        }
    });

    const summaryEls = document.querySelectorAll('#view-3 .report-summary-value');
    if (summaryEls.length >= 2) {
        summaryEls[0].textContent = totalItems.toLocaleString();
        summaryEls[1].textContent = totalSales.toLocaleString();
    }
}

function switchTab(tabId) {
    // Hide all views
    document.querySelectorAll('.report-view').forEach(view => {
        view.classList.remove('active');
    });
    // Untoggle all tabs
    document.querySelectorAll('.report-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected view
    document.getElementById('view-' + tabId).classList.add('active');
    // Toggle selected tab
    document.getElementById('tab-btn-' + tabId).classList.add('active');
}
