function handleLogin() {
    const userEl = document.getElementById('login-username');
    const pwdEl  = document.getElementById('login-pwd');
    const errors = [];

    if (!userEl.value.trim())
        errors.push({ input: userEl, label: 'Username', message: 'กรุณากรอก Username' });
    if (!pwdEl.value)
        errors.push({ input: pwdEl,  label: 'Password', message: 'กรุณากรอก Password' });

    if (errors.length > 0) {
        showValidationModal(errors);
        return;
    }
    // ผ่าน → เข้าสู่ระบบ
    window.location.href = 'receive-print.html';
}
