// dashboard.js - Javascript State Management (React-like data handling)

// 1. Define State
let users = [
    { id: 'USER_01', name: 'Natchanon', status: 'Blacklist', phone: '062-236-0567', email: 'natchanon@bumail.net', password: '1234' },
    { id: 'USER_02', name: 'Jeerapat', status: 'ปกติ', phone: '062-111-2222', email: 'jeerapat@bumail.net', password: '1234' },
    { id: 'USER_03', name: 'Akkarawin', status: 'ปกติ', phone: '062-333-4444', email: 'akkarawin@bumail.net', password: '1234' },
    { id: 'USER_04', name: 'Stefan', status: 'ปกติ', phone: '062-555-6666', email: 'stefan@bumail.net', password: '1234' }
];

let employees = [
    { id: 'USER_01', name: 'Somporn', role: 'Admin', phone: '087-123-4550', email: 'somporn@bumail.net', password: '1234' },
    { id: 'USER_02', name: 'Pornchai', role: 'พนักงาน', phone: '087-222-3333', email: 'pornchai@bumail.net', password: '1234' },
    { id: 'USER_03', name: 'Anutin', role: 'พนักงาน', phone: '087-444-5555', email: 'anutin@bumail.net', password: '1234' },
    { id: 'USER_04', name: 'Prakob', role: 'พนักงาน', phone: '087-666-7777', email: 'prakob@bumail.net', password: '1234' }
];

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
                        <button class="btn-action btn-edit" onclick="openEditModal('user', '${u.id}')">แก้ไขข้อมูล</button>
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
                    <td style="color: #000; font-weight: 500;">${e.phone.replace(/-/g, '')}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="openEditModal('employee', '${e.id}')">แก้ไขข้อมูล</button>
                        <button class="btn-action btn-delete" onclick="openDeleteModal('employee', '${e.id}')">🗑 ลบ</button>
                    </td>
                </tr>
            `;
        });
    }

    // Check if filterUsers exists globally to re-apply search/status filters after render
    if (typeof filterUsers === 'function') {
        filterUsers();
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

    // Fill the inputs
    document.getElementById('edit-modal-title').innerText = person.name;
    document.getElementById('edit-username').value = person.name;
    document.getElementById('edit-phone').value = person.phone || '';
    document.getElementById('edit-email').value = person.email || '';
    document.getElementById('edit-password').value = person.password || '1234';

    // Status Toggles logic section
    const toggleNormal = document.querySelector('.toggle-normal');
    const toggleBlacklist = document.querySelector('.toggle-blacklist');
    const statusGroup = document.getElementById('status-group-container');

    // Role selection
    const roleGroup = document.getElementById('group-role');
    const subtitle = document.getElementById('edit-modal-subtitle');

    if (type === 'user') {
        if (subtitle) subtitle.innerText = 'แก้ไขข้อมูลผู้ใช้งาน';
        if (roleGroup) roleGroup.style.display = 'none';

        if (person.status === 'Blacklist') {
            toggleBlacklist.classList.add('active');
            toggleNormal.classList.remove('active');
        } else {
            toggleNormal.classList.add('active');
            toggleBlacklist.classList.remove('active');
        }
        if (statusGroup) statusGroup.style.display = 'flex'; // Show status toggle
        
        // Let it span both columns for user mode
        const editFooter = document.querySelector('.edit-footer');
        if (editFooter) editFooter.style.gridColumn = '1 / -1';
        
    } else {
        if (subtitle) subtitle.innerText = 'แก้ไขข้อมูลพนักงาน';
        if (roleGroup) {
            roleGroup.style.display = 'flex';
            document.getElementById('edit-role').value = person.role || '';
        }
        if (statusGroup) statusGroup.style.display = 'none'; // Hide status toggle for employees
        
        // Put in the second column alongside the password for employee mode
        const editFooter = document.querySelector('.edit-footer');
        if (editFooter) editFooter.style.gridColumn = 'auto';
    }

    document.getElementById('modal-edit').style.display = 'flex';
}

function saveUserData() {
    if (!currentUserEditId || !currentEditType) return;

    const newName = document.getElementById('edit-username').value;
    const newPhone = document.getElementById('edit-phone').value;
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

    // Close modal
    document.getElementById('modal-edit').style.display = 'none';
}

let currentDeleteId = null;
let currentDeleteType = null;

function openDeleteModal(type, id) {
    currentDeleteId = id;
    currentDeleteType = type;

    let person = type === 'user' ? users.find(u => u.id === id) : employees.find(e => e.id === id);
    if (!person) return;

    document.getElementById('delete-username-text').innerText = person.name;
    document.getElementById('modal-delete').style.display = 'flex';
}

function confirmDelete() {
    if (!currentDeleteId || !currentDeleteType) return;

    if (currentDeleteType === 'user') {
        users = users.filter(u => u.id !== currentDeleteId);
    } else {
        employees = employees.filter(e => e.id !== currentDeleteId);
    }

    renderTables();
    document.getElementById('modal-delete').style.display = 'none';
    currentDeleteId = null;
    currentDeleteType = null;
}

// 4. Initialize Data on Screen
document.addEventListener('DOMContentLoaded', () => {
    renderTables();
});
