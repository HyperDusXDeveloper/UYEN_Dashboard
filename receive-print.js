// receive-print.js

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
    filterJobs(); // Initial filter on load
    checkRemarks();
});
