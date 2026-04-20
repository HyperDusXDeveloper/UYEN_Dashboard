# CHANGELOG — UYEN Dashboard (pond edition)

เปรียบเทียบกับโฟลเดอร์ต้นฉบับ: `UYEN_Dashboard-main`  
วันที่แก้ไข: 2026-04-20  
อ้างอิงจาก: `UYEN_Dashboard-main-fame`

> **หมายเหตุโครงสร้าง:** โฟลเดอร์นี้ใช้ `./css/` สำหรับไฟล์ CSS และ JS เป็น inline ทั้งหมดใน HTML  
> ต่างจาก -fame ที่แยก `dashboard.js` เป็นไฟล์อิสระ

---

## [NEW] `utils.js` — ไฟล์ใหม่: รวมโค้ดที่ซ้ำกันทุกหน้าไว้ที่เดียว

**ปัญหาเดิม:** ฟังก์ชัน validation และ utilities ถูก copy ไว้ในทุกไฟล์ HTML โดยไม่มีการแชร์

**วิธีแก้:** สร้าง `utils.js` เป็น single source of truth — ทุกหน้าโหลดไฟล์เดียวนี้

```html
<script src="utils.js"></script>
```

| ฟังก์ชันใน utils.js | ใช้ใน |
|---|---|
| `showValidationError(input, message)` | ทุกหน้า — แสดง Toast notification แทน alert() |
| `isValidEmail(email)` | signup.html, dashboard.html |
| `togglePassword(inputId, el)` | index.html, signup.html |
| `validateUsername(input)` | index.html, signup.html, dashboard.html |
| `validatePassword(input)` | index.html, signup.html, dashboard.html |
| `validateEmail(input)` | signup.html, dashboard.html |
| `formatPhoneNumber(input)` | signup.html, dashboard.html |

---

## `index.html` — แก้ไข 3 รายการ

### [เพิ่ม] โหลด `utils.js`
```html
<script src="utils.js"></script>
```

### [เพิ่ม] ฟังก์ชัน `handleLogin()`
- เดิม: ปุ่ม LOGIN กดแล้ว `window.location.href='receive-print.html'` ทันที แม้ไม่กรอกข้อมูล
- ใหม่: ตรวจสอบก่อน Username และ Password ไม่ว่างเปล่า ถ้าว่างแสดง toast แจ้งเตือน

### [แก้ไข] Validation Functions พร้อม Toast
- เดิม: `validateUsername`, `validatePassword`, `togglePassword` ลบตัวอักษรเงียบ ๆ ไม่มีข้อความแจ้ง
- ใหม่: ทุกฟังก์ชันแสดง toast แดงเมื่อกรอกข้อมูลผิดประเภท และ input กระตุก (shake animation)

---

## `signup.html` — แก้ไข 6 รายการ

### [เพิ่ม] โหลด `utils.js`

### [เพิ่ม] ฟังก์ชัน `handleSignup()`
- เดิม: ปุ่ม SIGN UP NOW ไม่มี `onclick` ไม่มี logic ใด ๆ
- ใหม่: ตรวจสอบครบ 6 field ตามลำดับ:

| ลำดับ | Field | เงื่อนไข |
|---|---|---|
| 1 | Username | ต้องกรอกอย่างน้อย 1 ตัวอักษร |
| 2 | Email | ต้องกรอก และต้องผ่าน `isValidEmail()` |
| 3 | Password | ต้องมีอย่างน้อย 5 ตัวอักษร |
| 4 | Confirm Password | ต้องตรงกับ Password |
| 5 | Phone | ถ้ากรอกมา ต้องมีตัวเลขครบ 10 หลักพอดี |
| 6 | Role | ต้องเลือกตำแหน่งงาน |

### [แก้ไข] Email input — เพิ่ม `id="signup-email"`
- เดิม: ไม่มี id ทำให้ `handleSignup()` ไม่สามารถอ้างอิง element ได้

### [แก้ไข] `<select>` Role — ลบ `required`, เพิ่ม `id="signup-role"`
- เดิม: `<select required>` ทำให้เบราว์เซอร์แสดง native validation popup
- ใหม่: `<select id="signup-role">` ให้ `handleSignup()` จัดการแทนด้วย toast

### [แก้ไข] ปุ่ม SIGN UP NOW — เพิ่ม `onclick="handleSignup()"`
- เดิม: ไม่มี onclick

### [แก้ไข] Validation Functions พร้อม Toast
- เดิม: `formatPhoneNumber` ลบตัวอักษรเงียบ ๆ ไม่มีข้อความแจ้ง
- ใหม่: ทุกฟังก์ชันแสดง toast และ input กระตุกเมื่อกรอกข้อมูลผิด

---

## `dashboard.html` — แก้ไข 4 รายการ

### [เพิ่ม] โหลด `utils.js` (ก่อน inline script)

### [แก้ไข] Input Email — ลบ Browser Native Validation ออก
- เดิม: มี `required`, `pattern="..."`, `title="..."` ทำให้เบราว์เซอร์แสดง popup ของตัวเอง
- ใหม่: ลบทั้งหมดออก ให้ `validateEmail()` + toast จัดการแทน

### [แก้ไข] ฟังก์ชัน `confirmSaveUserData()` — เพิ่ม Validation ก่อนเปิด Confirm Modal
- เดิม: กดบันทึกแล้วข้ามไปเปิด Confirm Modal ทันที ไม่มีการตรวจสอบ
- ใหม่: ตรวจสอบครบ 4 field:

| ลำดับ | Field | เงื่อนไข |
|---|---|---|
| 1 | Username | ต้องกรอกอย่างน้อย 1 ตัวอักษร |
| 2 | Password | ต้องมี 5–100 ตัวอักษร |
| 3 | Phone | ถ้ากรอก ต้องครบ 10 หลัก |
| 4 | Email | ถ้ากรอก ต้องผ่าน `isValidEmail()` |

### [แก้ไข] ลบ 4 ฟังก์ชันซ้ำออกจาก inline script
- ลบ: `formatPhoneNumber`, `validatePassword`, `validateEmail`, `validateUsername`
- เหตุผล: ย้ายไปอยู่ใน `utils.js` แล้ว เรียกใช้ได้เลยเมื่อโหลด utils.js

---

## `css/styles.css` — แก้ไข 1 รายการ

### [เพิ่ม] CSS class `.input-error` และ animation `@keyframes inputShake`
```css
@keyframes inputShake {
    0%   { transform: translateX(0); }
    20%  { transform: translateX(-5px); }
    40%  { transform: translateX(5px); }
    60%  { transform: translateX(-4px); }
    80%  { transform: translateX(4px); }
    100% { transform: translateX(0); }
}

.input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
    background-color: #fff5f5 !important;
    animation: inputShake 0.35s ease;
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
}
```

## `css/dashboard.css` — แก้ไข 1 รายการ

### [เพิ่ม] CSS class `.input-error` และ animation `@keyframes inputShake`
- เหมือนกับที่เพิ่มใน `css/styles.css` แต่ใช้กับหน้า Dashboard ที่โหลด `css/dashboard.css`

---

## สรุปไฟล์ที่ไม่มีการเปลี่ยนแปลง

| ไฟล์ |
|---|
| `inventory.html` |
| `receive-material.html` |
| `receive-print.html` |
| `withdraw.html` |
| `report.html` |
| `README.md` |
