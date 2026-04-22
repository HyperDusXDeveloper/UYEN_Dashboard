// dashboard.js - Javascript State Management (React-like data handling)

// 1. Define State
let users = [];
let employees = [];

let currentUserEditId = null;
let currentEditType = null; // 'user' or 'employee'

// 2. Render Functions (Update UI from State)
function renderTables() {
    // Render Users Table
    const usersTbody = document.querySelector('#view-users tbody');
    if (usersTbody) {
        usersTbody.innerHTML = '';
        users.forEach(u => {
            const classStat = u.status === 'Blacklist' ? 'status-blacklist' : 'status-normal';
            usersTbody.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td class="${classStat}">${u.status}</td>
            <td>
                <button class="btn-action btn-edit" onclick="openEditModal('user', '${u.id}')">แก้ไข</button>
                <button class="btn-action btn-delete" onclick="openDeleteModal('user', '${u.id}')">🗑 ลบ</button>
            </td>
        </tr>
    `;
        });
    }

    // Render Employees Table
    const empTbody = document.querySelector('#view-employees tbody');
    if (empTbody) {
        empTbody.innerHTML = '';
        employees.forEach(e => {
            empTbody.innerHTML += `
        <tr>
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td>${e.role}</td>
            <td style="color: #000; font-weight: 500;">
                ${e.phone && e.phone.length === 10 ? e.phone.substring(0, 3) + ' - ' + e.phone.substring(3, 6) + ' - ' + e.phone.substring(6, 10) : e.phone}
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="openEditModal('employee', '${e.id}')">แก้ไข</button>
                <button class="btn-action btn-delete" onclick="openDeleteModal('employee', '${e.id}')">🗑 ลบ</button>
            </td>
        </tr>
    `;
        });
    }
}

// 3. Actions (Edit & Save Data)
function openEditModal(type, id) {
    currentUserEditId = id;
    currentEditType = type;

    let person;
    if (type === 'user') {
        person = users.find(u => u.id === id);
    } else {
        person = employees.find(e => e.id === id);
    }

    if (!person) return;

    // Truncate name for header if > 20 chars
    let headerName = person.name;
    if (headerName.length > 20) {
        headerName = headerName.substring(0, 20) + '...';
    }
    document.getElementById('edit-modal-title').innerText = headerName;
    document.getElementById('edit-username').value = person.name;

    let phoneDigits = person.phone || '';
    if (phoneDigits.length === 10) {
        document.getElementById('edit-phone').value = phoneDigits.substring(0, 3) + ' - ' + phoneDigits.substring(3, 6) + ' - ' + phoneDigits.substring(6, 10);
    } else {
        document.getElementById('edit-phone').value = phoneDigits;
    }

    document.getElementById('edit-email').value = person.email || '';
    document.getElementById('edit-password').value = person.password || '12345';

    // Status Toggles logic section
    const toggleNormal = document.querySelector('.toggle-normal');
    const toggleBlacklist = document.querySelector('.toggle-blacklist');
    const statusGroup = document.getElementById('status-group-container');

    // Role selection
    const roleGroup = document.getElementById('group-role');
    const subtitle = document.getElementById('edit-modal-subtitle');

    if (type === 'user') {
        if (subtitle) subtitle.innerText = 'แก้ไขผู้ใช้งาน';
        if (roleGroup) roleGroup.classList.add('hidden');

        if (person.status === 'Blacklist') {
            toggleBlacklist.classList.add('active');
            toggleNormal.classList.remove('active');
        } else {
            toggleNormal.classList.add('active');
            toggleBlacklist.classList.remove('active');
        }
        if (statusGroup) statusGroup.classList.remove('hidden'); // Show status toggle

        // Let it span both columns for user mode
        const editFooter = document.querySelector('.edit-footer');
        if (editFooter) editFooter.style.gridColumn = '1 / -1';

    } else {
        if (subtitle) subtitle.innerText = 'แก้ไขพนักงาน';
        if (roleGroup) roleGroup.classList.remove('hidden');
        document.getElementById('edit-role').value = person.role || '';
        if (statusGroup) statusGroup.classList.add('hidden'); // Hide status toggle for employees

        // Put in the second column alongside the password for employee mode
        const editFooter = document.querySelector('.edit-footer');
        if (editFooter) editFooter.style.gridColumn = 'auto';
    }

    document.getElementById('modal-edit').classList.remove('hidden');
}

function confirmSaveUserData() {
    if (!currentUserEditId || !currentEditType) return;

    const usernameEl  = document.getElementById('edit-username');
    const passwordEl  = document.getElementById('edit-password');
    const phoneEl     = document.getElementById('edit-phone');
    const emailEl     = document.getElementById('edit-email');

    const username = usernameEl.value.trim();
    const password = passwordEl.value;
    const phoneRaw = phoneEl.value.replace(/\D/g, '');
    const email    = emailEl.value.trim();

    const errors = [];

    // 1. Username
    if (username.length < 1)
        errors.push({ input: usernameEl, label: 'Username', message: 'กรุณากรอกอย่างน้อย 1 ตัวอักษร' });

    // 2. Password
    if (password.length < 5)
        errors.push({ input: passwordEl, label: 'Password', message: 'ต้องมีอย่างน้อย 5 ตัวอักษร' });
    else if (password.length > 100)
        errors.push({ input: passwordEl, label: 'Password', message: 'ยาวได้สูงสุด 100 ตัวอักษร' });

    // 3. Phone (ถ้ากรอก ต้องครบ 10 หลัก)
    if (phoneRaw.length > 0 && phoneRaw.length !== 10)
        errors.push({ input: phoneEl,    label: 'Phone',    message: `ต้องมี 10 หลักพอดี (ปัจจุบัน ${phoneRaw.length} หลัก)` });

    // 4. Email (ถ้ากรอก ต้องผ่าน isValidEmail)
    if (email && !isValidEmail(email))
        errors.push({ input: emailEl,    label: 'Email',    message: 'รูปแบบไม่ถูกต้อง (เช่น name@example.com)' });

    if (errors.length > 0) {
        showValidationModal(errors);
        return;
    }

    let displayName = username;
    if (displayName.length > 20) {
        displayName = displayName.substring(0, 20) + '...';
    }
    document.getElementById('confirm-username').innerText = displayName;

    document.getElementById('modal-edit').classList.add('hidden');
    document.getElementById('modal-confirm-save').classList.remove('hidden');
}

function abortSaveUserData() {
    document.getElementById('modal-confirm-save').classList.add('hidden');
    document.getElementById('modal-edit').classList.remove('hidden');
}

function confirmCancelEdit() {
    if (!currentUserEditId || !currentEditType) return;

    let username = document.getElementById('edit-username').value;
    if (username.length > 20) {
        username = username.substring(0, 20) + '...';
    }
    document.getElementById('cancel-confirm-username').innerText = username;

    document.getElementById('modal-edit').classList.add('hidden');
    document.getElementById('modal-cancel-confirm').classList.remove('hidden');
}

function abortCancelEdit() {
    document.getElementById('modal-cancel-confirm').classList.add('hidden');
    document.getElementById('modal-edit').classList.remove('hidden');
}

function executeCancelEdit() {
    document.getElementById('modal-cancel-confirm').classList.add('hidden');

    document.getElementById('modal-cancel-success').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('modal-cancel-success').classList.add('hidden');
    }, 2000);
}

function executeSaveUserData() {
    if (!currentUserEditId || !currentEditType) return;

    const newName = document.getElementById('edit-username').value;
    const newPhone = document.getElementById('edit-phone').value.replace(/\D/g, ''); // strip to digits before saving
    const newEmail = document.getElementById('edit-email').value;
    const newPass = document.getElementById('edit-password').value;

    let newStatus = 'ปกติ';
    if (document.querySelector('.toggle-blacklist') && document.querySelector('.toggle-blacklist').classList.contains('active')) {
        newStatus = 'Blacklist';
    }

    // Update State
    if (currentEditType === 'user') {
        const idx = users.findIndex(u => u.id === currentUserEditId);
        if (idx !== -1) {
            users[idx].name = newName;
            users[idx].phone = newPhone;
            users[idx].email = newEmail;
            users[idx].password = newPass;
            users[idx].status = newStatus;
        }
    } else {
        const idx = employees.findIndex(e => e.id === currentUserEditId);
        if (idx !== -1) {
            employees[idx].name = newName;
            employees[idx].phone = newPhone;
            employees[idx].email = newEmail;
            employees[idx].password = newPass;
            const roleEl = document.getElementById('edit-role');
            if (roleEl && roleEl.value) {
                employees[idx].role = roleEl.value;
            }
        }
    }

    // Re-Render interface from state
    renderTables();

    // Close modals
    document.getElementById('modal-confirm-save').classList.add('hidden');
    document.getElementById('modal-edit').classList.add('hidden');

    // Show success modal
    document.getElementById('modal-success').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('modal-success').classList.add('hidden');
    }, 2000);
}

let currentDeleteId = null;
let currentDeleteType = null;

function openDeleteModal(type, id) {
    currentDeleteId = id;
    currentDeleteType = type;

    let person = type === 'user' ? users.find(u => u.id === id) : employees.find(e => e.id === id);
    if (!person) return;

    document.getElementById('delete-username-text').innerText = person.name;
    document.getElementById('modal-delete').classList.remove('hidden');
}

function confirmDelete() {
    if (!currentDeleteId || !currentDeleteType) return;

    if (currentDeleteType === 'user') {
        users = users.filter(u => u.id !== currentDeleteId);
    } else {
        employees = employees.filter(e => e.id !== currentDeleteId);
    }

    renderTables();
    document.getElementById('modal-delete').classList.add('hidden');

    document.getElementById('modal-delete-success').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('modal-delete-success').classList.add('hidden');
    }, 2000);

    currentDeleteId = null;
    currentDeleteType = null;
}

// 4. Tab & Modal Helpers
function switchTab(tabIndex) {
    const btn1 = document.getElementById('tab1-btn');
    const btn2 = document.getElementById('tab2-btn');
    const view1 = document.getElementById('view-users');
    const view2 = document.getElementById('view-employees');
    const title = document.getElementById('page-title');

    if (tabIndex === 1) {
        btn1.classList.add('active');
        btn2.classList.remove('active');
        view1.classList.remove('hidden');
        view2.classList.add('hidden');
        title.innerText = 'จัดการผู้ใช้งาน';
    } else {
        btn2.classList.add('active');
        btn1.classList.remove('active');
        view2.classList.remove('hidden');
        view1.classList.add('hidden');
        title.innerText = 'จัดการข้อมูลพนักงาน';
    }
}

function openModal(modalId, username = '', role = '') {
    document.getElementById(modalId).classList.remove('hidden');

    if (modalId === 'modal-delete' && username) {
        document.getElementById('delete-username-text').innerText = username;
    }
}

function setToggle(btn) {
    const container = btn.parentElement;
    const buttons = container.querySelectorAll('.toggle-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

let activeSortStatus = '';

function sortByStatus(direction) {
    if (activeSortStatus === direction) {
        activeSortStatus = '';
        document.querySelectorAll('.sort-up, .sort-down').forEach(btn => btn.classList.remove('active'));
        // Restore original order by user ID
        users.sort((a, b) => a.id.localeCompare(b.id));
    } else {
        activeSortStatus = direction;
        document.querySelectorAll('.sort-up, .sort-down').forEach(btn => btn.classList.remove('active'));
        if (direction === 'asc') {
            document.querySelector('.sort-up').classList.add('active');
            users.sort((a, b) => {
                if (a.status === b.status) return a.id.localeCompare(b.id);
                return a.status === 'ปกติ' ? -1 : 1;
            });
        } else if (direction === 'desc') {
            document.querySelector('.sort-down').classList.add('active');
            users.sort((a, b) => {
                if (a.status === b.status) return a.id.localeCompare(b.id);
                return a.status === 'Blacklist' ? -1 : 1;
            });
        }
    }
    renderTables();
}

// 5. Initialize Data from Mock API
async function loadData() {
    try {
        // Show Loaders
        const usersTbody = document.querySelector('#view-users tbody');
        const empTbody = document.querySelector('#view-employees tbody');
        if (usersTbody) usersTbody.innerHTML = createLoadingSpinner(4);
        if (empTbody) empTbody.innerHTML = createLoadingSpinner(5);

        // Fetch concurrently
        const [usersRes, empRes] = await Promise.all([
            fetchApi('/api/users'),
            fetchApi('/api/employees')
        ]);
        
        users = usersRes;
        employees = empRes;

        renderTables();
    } catch (err) {
        alert(err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
