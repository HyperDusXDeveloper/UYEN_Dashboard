// report.js
let dailyPrintsData = [];
let stockData = [];
let monthlySalesData = [];

async function loadData() {
    try {
        const tbody1 = document.querySelector('#view-1 tbody');
        const tbody2 = document.querySelector('#view-2 tbody');
        const tbody3 = document.querySelector('#view-3 tbody');
        
        const loaderHtml = (colspan) => `<tr><td colspan="${colspan}" class="text-center" style="padding: 30px;"><div class="loader-spinner" style="margin: 0 auto 10px;"></div><div style="color:#6b7280;">กำลังโหลดข้อมูลสมมติ...</div></td></tr>`;
        
        if (tbody1) tbody1.innerHTML = loaderHtml(7);
        if (tbody2) tbody2.innerHTML = loaderHtml(4);
        if (tbody3) tbody3.innerHTML = loaderHtml(3);

        const [dp, st, ms] = await Promise.all([
            fetchApi('/api/report-daily-prints'),
            fetchApi('/api/report-stock'),
            fetchApi('/api/report-monthly-sales')
        ]);
        
        dailyPrintsData = dp;
        stockData = st;
        monthlySalesData = ms;

        renderView1();
        renderView2();
        renderView3();
    } catch (err) {
        alert(err.message);
    }
}

function renderView1() {
    const tbody = document.querySelector('#view-1 tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    dailyPrintsData.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td class="report-td-left-padded">${item.customer}</td>
                <td>${item.material}</td>
                <td>${item.type}</td>
                <td>${item.qty}</td>
                <td>${item.printType}</td>
                <td>${item.time}</td>
                <td><span class="text-blue">${item.price}</span> บาท</td>
            </tr>
        `;
    });
}

function renderView2() {
    const tbody = document.querySelector('#view-2 tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    stockData.forEach(item => {
        const stockTdClass = item.lowStock ? 'text-red' : '';
        const trClass = item.lowStock ? 'bg-gray-lighter' : '';
        tbody.innerHTML += `
            <tr class="${trClass}">
                <td>${item.material}</td>
                <td>${item.type}</td>
                <td class="${stockTdClass}">${item.qty.toLocaleString()}</td>
                <td>${item.price}</td>
            </tr>
        `;
    });
}

function renderView3() {
    const tbody = document.querySelector('#view-3 tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    monthlySalesData.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td class="report-td-left-wide-padded">${item.date}</td>
                <td>${item.items}</td>
                <td><span class="text-blue">${item.sales.toLocaleString()}</span> บาท</td>
            </tr>
        `;
    });
    
    showAllMonthlySales();
}

document.addEventListener("DOMContentLoaded", function () {
    loadData();
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

    // Handle Report Downloads
    const downloadFile = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    document.getElementById('btn-print-1')?.addEventListener('click', () => {
        downloadFile('./item/Report1.png', 'Daily_Print_Report.png');
    });

    document.getElementById('btn-print-2')?.addEventListener('click', () => {
        downloadFile('./item/Report3.png', 'Inventory_Report.png');
    });

    document.getElementById('btn-print-3')?.addEventListener('click', () => {
        downloadFile('./item/Report2.png', 'Monthly_Sales_Report.png');
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
