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
    filterJobs(); // Re-filter when theme changes
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
