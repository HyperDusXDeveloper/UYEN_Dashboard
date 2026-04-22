// receive-print.js
let receivePrintsData = [];

async function loadData() {
    try {
        const jobsList = document.getElementById('jobs-list');
        if (jobsList) jobsList.innerHTML = `<div class="loader-spinner" style="margin: 30px auto; display: block;"></div><div style="text-align:center; margin-bottom: 30px; color:#6b7280;">กำลังโหลดข้อมูลจำลองผ่าน JWT Flow...</div>`;
        
        receivePrintsData = await fetchApi('/api/receive-prints');
        renderJobsList();
        filterJobs();
        checkRemarks();
    } catch (err) {
        alert(err.message);
    }
}

function renderJobsList() {
    const container = document.getElementById('jobs-list');
    if (!container) return;
    
    let html = '';
    
    receivePrintsData.forEach(job => {
        const badgeColorClass = job.status === 'รอพิมพ์เอกสาร' ? 'bg-blue' : (job.status === 'กำลังดำเนินการ' ? 'bg-orange' : 'bg-green');
        const confirmDisabled = job.status === 'ดำเนินการสำเร็จ' ? 'disabled' : '';
        
        let itemsHtml = '';
        job.items.forEach(item => {
            const btnClass = job.status === 'รอพิมพ์เอกสาร' ? 'downloaded' : (job.status === 'กำลังดำเนินการ' ? '' : 'finished');
            itemsHtml += `
                <tr>
                    <td>${item.fileName}</td>
                    <td>${item.printTypeHtml}</td>
                    <td>${item.docSize}</td>
                    <td>${item.docType}</td>
                    <td>${item.qty}</td>
                    <td>${item.price}</td>
                    <td><button class="btn-download ${btnClass}" id="btn-${job.id}" onclick="initiateDownload('${job.id}', '${item.fileUrl}')">⬇ ดาวโหลดไฟล์</button></td>
                    <td class="text-color-red" data-fulltext="${item.note}">
                        <span class="remark-content">${item.note}</span>
                    </td>
                </tr>
            `;
        });

        html += `
            <div class="job-card job-${job.theme}">
                <div class="job-header">
                    <div class="job-header-item">
                        <span class="job-header-label">คิว</span>
                        <span class="job-header-value">${job.id}</span>
                    </div>
                    <div class="job-header-divider"></div>
                    <div class="job-header-item">
                        <span class="job-header-label">สถานะงานพิมพ์</span>
                        <span class="badge-status ${badgeColorClass}" id="status-${job.id}">${job.status}</span>
                    </div>
                    <div class="job-header-divider"></div>
                    <div class="job-header-item">
                        <span class="job-header-label">รวมเงิน</span>
                        <span class="job-header-value">${job.totalPrice} บาท</span>
                    </div>
                    <div class="job-header-divider"></div>
                    <div class="job-header-item">
                        <span class="job-header-label">วันที่สั่งพิมพ์</span>
                        <span class="job-header-value">${job.orderDate}</span>
                    </div>
                    <div class="job-header-divider"></div>
                    <div class="job-header-item">
                        <span class="job-header-label">วันและเวลารับงานพิมพ์</span>
                        <span class="job-header-value">${job.receiveDate}</span>
                    </div>
                    <div class="job-header-right">
                        <button class="btn-confirm-success" id="btn-confirm-${job.id}" onclick="confirmSuccess('${job.id}')" ${confirmDisabled}>ยืนยันพิมพ์งานสำเร็จ</button>
                    </div>
                </div>
                <table class="job-table">
                    <thead>
                        <tr>
                            <th class="w-15">ชื่อไฟล์</th>
                            <th class="w-15">ประเภทงานพิมพ์</th>
                            <th class="w-10">ขนาดเอกสาร</th>
                            <th class="w-15">ประเภทเอกสาร</th>
                            <th class="w-10">จำนวน(ชุด)</th>
                            <th class="w-10">ราคา</th>
                            <th class="w-15">ไฟล์เอกสาร</th>
                            <th class="w-10">หมายเหตุ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function setTheme(theme) {
    document.body.className = '';
    document.body.classList.add('theme-' + theme);
    
    // Toggle Active Class on Buttons
    document.querySelectorAll('.btn-toggle').forEach(btn => {
        btn.classList.toggle('active', btn.classList.contains(theme));
    });

    const jobsView = document.getElementById('main-jobs-view');
    const recordView = document.getElementById('record-print-view');

    if (theme === 'record') {
        if (jobsView) jobsView.classList.add('hidden');
        if (recordView) recordView.classList.remove('hidden');
        renderHistoryTable();
        initHistoryFlatpickr();
    } else {
        if (jobsView) jobsView.classList.remove('hidden');
        if (recordView) recordView.classList.add('hidden');
        filterJobs();
    }
}

let historyData = [
    { paper: 'A4', type: 'กระดาษธรรมดา 70 แกรม', qty: 1, amount: 16, note: '-', date: '21/03/2026' },
    { paper: 'A4', type: 'กระดาษธรรมดา 80 แกรม', qty: 3, amount: 55, note: 'ปรินท์งานสี', date: '21/03/2026' },
    { paper: 'A4', type: 'กระดาษร้อยปอนด์ (ผิวหยาบ)', qty: 4, amount: 67, note: '-', date: '21/03/2026' },
    { paper: 'A4', type: 'กระดาษอาร์ตมัน 100g', qty: 10, amount: 166, note: '-', date: '21/03/2026' },
    { paper: 'A4', type: 'อาร์ตด้าน 120g', qty: 1, amount: 20, note: '-', date: '21/03/2026' },
    { paper: 'A4', type: 'สติกเกอร์กระดาษ (ผิวมัน)', qty: 2, amount: 30, note: '-', date: '21/03/2026' },
    { paper: 'A4', type: 'สติกเกอร์ PVC (ใส)', qty: 1, amount: 16, note: '-', date: '21/03/2026' },
    { paper: 'A4', type: 'กระดาษคราฟท์ (สีน้ำตาล)', qty: 2, amount: 30, note: '-', date: '21/03/2026' }
];

function renderHistoryTable() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    historyData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.paper}</td>
            <td>${row.type}</td>
            <td>${row.qty}</td>
            <td>${row.amount}</td>
            <td class="text-color-red" style="font-size:12px;">${row.note}</td>
            <td>${row.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

function initHistoryFlatpickr() {
    if (!document.getElementById("historyDateFilter")._flatpickr) {
        flatpickr("#historyDateFilter", {
            dateFormat: "d/m/Y",
            locale: "th"
        });
    }
}

function resetHistoryDateFilter() {
    const dateInput = document.getElementById("historyDateFilter");
    if (dateInput && dateInput._flatpickr) {
        dateInput._flatpickr.clear();
    }
}

function showConfirmRecordModal() {
    const paperEl = document.getElementById('rec-paper-type');
    const typeEl = document.getElementById('rec-print-type');
    const qtyEl = document.getElementById('rec-qty');
    const totalEl = document.getElementById('rec-total');
    const noteEl = document.getElementById('rec-note');

    const paper = paperEl.value;
    const type = typeEl.value;
    const qty = parseFloat(qtyEl.value);
    const total = parseFloat(totalEl.value);
    let note = noteEl.value.trim();

    const qtyRaw = qtyEl.value.toLowerCase();
    const totalRaw = totalEl.value.toLowerCase();

    // ─── Validation ───
    const errors = [];
    if (!paper) errors.push({ input: paperEl, label: 'ชนิดกระดาษ', message: 'กรุณาเลือกชนิดกระดาษ' });
    if (!type) errors.push({ input: typeEl, label: 'ประเภทงานพิมพ์', message: 'กรุณาเลือกประเภทงานพิมพ์' });
    
    if (isNaN(qty) || qty < 1 || qty > 1000 || qtyRaw.includes('e')) {
        errors.push({ input: qtyEl, label: 'จำนวนชุด', message: 'กรุณาระบุจำนวนชุดระหว่าง 1 - 1,000 (ห้ามใส่ตัวอักษร e)' });
    }
    
    if (isNaN(total) || total < 1 || total > 99999 || totalRaw.includes('e')) {
        errors.push({ input: totalEl, label: 'ยอดเงินรวม', message: 'กรุณาระบุยอดเงินรวมระหว่าง 1 - 99,999 (ห้ามใส่ตัวอักษร e)' });
    }

    if (errors.length > 0) {
        if (typeof showValidationModal === 'function') {
            showValidationModal(errors);
        } else {
            alert('กรุณาตรวจสอบข้อมูล: ' + errors.map(e => e.message).join('\n'));
        }
        return;
    }

    // Default note if empty
    if (!note) note = '-';

    const overlay = document.createElement('div');
    overlay.id = 'confirm-record-modal-overlay';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.5)',
        'z-index:9999', 'display:flex', 'justify-content:center',
        'align-items:center', 'backdrop-filter:blur(3px)', 'padding:20px'
    ].join(';');

    const modal = document.createElement('div');
    modal.style.cssText = [
        'background:#fff', 'border-radius:18px', 'overflow:hidden',
        'max-width:500px', 'width:100%', 'box-shadow:0 20px 40px rgba(0,0,0,0.1)',
        'font-family:"Prompt",sans-serif', 'opacity:0', 'transform:translateY(-10px)',
        'transition:all 0.3s'
    ].join(';');

    // Header - Bright Green
    const header = document.createElement('div');
    header.style.cssText = 'background:#22c55e;padding:20px;color:white;text-align:center;';
    header.innerHTML = '<h2 style="margin:0;font-size:22px;font-weight:700;">ยืนยันบันทึกงานพิมพ์หน้าร้าน</h2>';

    // Body
    const body = document.createElement('div');
    body.style.cssText = 'padding:25px;display:flex;flex-direction:column;gap:15px;';

    const createInfoRow = (label, value) => `
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:10px;">
            <span style="font-weight:600;color:#64748b;">${label}</span>
            <span style="font-weight:500;color:#1e293b;">${value}</span>
        </div>
    `;

    body.innerHTML = `
        ${createInfoRow('ชนิดวัสดุ', paper)}
        ${createInfoRow('ประเภทวัสดุ', type)}
        ${createInfoRow('จำนวนชุด', qty)}
        ${createInfoRow('ยอดเงินรวม', total + ' บาท')}
        <div style="display:flex;flex-direction:column;gap:5px;">
            <span style="font-weight:600;color:#64748b;">หมายเหตุ</span>
            <div style="background:#f8fafc;padding:12px;border-radius:8px;font-size:14px;color:#1e293b;border:1px solid #e2e8f0;">${note}</div>
        </div>
    `;

    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = 'padding:20px;display:flex;justify-content:center;gap:15px;background:#fcfcfc;border-top:1px solid #f1f5f9;';

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'ยกเลิก';
    cancelBtn.style.cssText = 'padding:10px 30px;border-radius:8px;border:1px solid #d1d5db;background:white;color:#4b5563;cursor:pointer;font-weight:600;';
    cancelBtn.onclick = () => {
        overlay.remove();
    };

    const confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'ยืนยันบันทึกข้อมูล';
    confirmBtn.style.cssText = 'padding:10px 30px;border-radius:8px;border:none;background:#22c55e;color:white;cursor:pointer;font-weight:700;box-shadow:0 4px 10px rgba(34,197,94,0.3);';
    confirmBtn.onclick = () => {
        handleRecordPrint(paper, type, qty, total, note);
        overlay.remove();
    };

    footer.append(confirmBtn, cancelBtn);
    modal.append(header, body, footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    });
}

function handleRecordPrint(paper, type, qty, total, note) {
    const today = new Date();
    const dateStr = today.getDate().toString().padStart(2, '0') + '/' + (today.getMonth() + 1).toString().padStart(2, '0') + '/' + today.getFullYear();
    
    // Add to history
    historyData.unshift({
        paper,
        type,
        qty: parseInt(qty),
        amount: parseFloat(total),
        note: note,
        date: dateStr
    });

    renderHistoryTable();

    // Reset Form
    document.getElementById('record-form').reset();

    // Show Success Modal (Removed as per user request for faster workflow)
}

function resetDateFilter() {
    const dateInput = document.getElementById("dateFilter");
    if (dateInput && dateInput._flatpickr) {
        dateInput._flatpickr.clear();
    }
}

function filterJobs() {
    const statusFilter = document.getElementById('statusFilter') ? document.getElementById('statusFilter').value : 'ทั้งหมด';
    const dateFilter = document.getElementById('dateFilter') ? document.getElementById('dateFilter').value : '';
    const currentTheme = document.body.classList.contains('theme-walkin') ? 'walkin' : 'online';

    const jobCards = document.querySelectorAll('.job-card');

    jobCards.forEach(card => {
        let showCard = true;

        // 0. Theme Match (Strict Separation)
        if (currentTheme === 'online' && card.classList.contains('job-walkin')) {
            showCard = false;
        } else if (currentTheme === 'walkin' && card.classList.contains('job-online')) {
            showCard = false;
        }

        // 1. Status Match
        if (showCard && statusFilter !== 'ทั้งหมด') {
            const statusElement = card.querySelector('.badge-status');
            const statusText = statusElement ? statusElement.textContent.trim() : '';
            if (statusText !== statusFilter) showCard = false;
        }

        // 2. Date Match
        if (showCard && dateFilter) {
            let dateMatch = false;
            const headerItems = card.querySelectorAll('.job-header-item');
            headerItems.forEach(item => {
                const label = item.querySelector('.job-header-label');
                if (label && label.textContent.includes('วันที่สั่งพิมพ์')) {
                    const val = item.querySelector('.job-header-value');
                    if (val) {
                        const cardDateStr = val.textContent.trim(); // format: "15 - 03 - 2026"
                        if (cardDateStr === dateFilter) {
                            dateMatch = true;
                        }
                    }
                }
            });
            if (!dateMatch) showCard = false;
        }

        card.classList.toggle('hidden', !showCard);
    });
    checkRemarks();
}

function initiateDownload(queueId, filePath) {
    // 1. Trigger Download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Update Status Badge
    const statusBadge = document.getElementById('status-' + queueId);
    if (statusBadge) {
        statusBadge.textContent = 'กำลังดำเนินการ';
        statusBadge.classList.remove('bg-blue');
        statusBadge.classList.add('bg-orange');
    }

    // 3. Update Button Style (Green -> Gray)
    const btn = document.getElementById('btn-' + queueId);
    if (btn) {
        btn.classList.remove('downloaded');
    }
}

function confirmSuccess(queueId) {
    // 1. Update Status Badge
    const statusBadge = document.getElementById('status-' + queueId);
    if (statusBadge) {
        statusBadge.textContent = 'ดำเนินการสำเร็จ';
        statusBadge.classList.remove('bg-blue', 'bg-orange');
        statusBadge.classList.add('bg-green');
    }

    // 2. Disable Download Button (Turn Red)
    const downloadBtn = document.getElementById('btn-' + queueId);
    if (downloadBtn) {
        downloadBtn.classList.remove('downloaded');
        downloadBtn.classList.add('finished');
    }

    // 3. Disable Confirm Button
    const confirmBtn = document.getElementById('btn-confirm-' + queueId);
    if (confirmBtn) {
        confirmBtn.disabled = true;
    }
}

function checkRemarks() {
    const remarks = document.querySelectorAll('.remark-content');
    remarks.forEach(span => {
        const td = span.closest('td');
        const fullText = td.getAttribute('data-fulltext');

        // If text overflows, we just keep the CSS tooltip ready
        if (span.scrollWidth > span.clientWidth) {
            td.classList.add('has-overflow');
        } else {
            td.classList.remove('has-overflow');
        }
    });
}

window.addEventListener('resize', checkRemarks);

document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#dateFilter", {
        dateFormat: "d - m - Y",
        locale: "th",
        onChange: function (selectedDates, dateStr, instance) {
            filterJobs();
        }
    });
    loadData();
});
