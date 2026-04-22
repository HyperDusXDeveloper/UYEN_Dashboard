/**
 * MOCK API & JWT AUTHENTICATION FLOW
 * Simulated Database and API endpoints for future JWT connection
 */

// Simulated Local Database (In-Memory)
const MockDatabase = {
    users: [
        { id: 'USER_01', name: 'Natchanon', status: 'Blacklist', phone: '0622360567', email: 'natchanon@bumail.net', password: '12345' },
        { id: 'USER_02', name: 'Jeerapat', status: 'ปกติ', phone: '0621112222', email: 'jeerapat@bumail.net', password: '12345' },
        { id: 'USER_03', name: 'Akkarawin', status: 'ปกติ', phone: '0623334444', email: 'akkarawin@bumail.net', password: '12345' },
        { id: 'USER_04', name: 'Stefan', status: 'ปกติ', phone: '0625556666', email: 'stefan@bumail.net', password: '12345' }
    ],
    employees: [
        { id: 'USER_01', name: 'Somporn', role: 'Admin', phone: '0871234550', email: 'somporn@bumail.net', password: '12345' },
        { id: 'USER_02', name: 'Pornchai', role: 'พนักงาน', phone: '0872223333', email: 'pornchai@bumail.net', password: '12345' },
        { id: 'USER_03', name: 'Anutin', role: 'พนักงาน', phone: '0874445555', email: 'anutin@bumail.net', password: '12345' },
        { id: 'USER_04', name: 'Prakob', role: 'พนักงาน', phone: '0876667777', email: 'prakob@bumail.net', password: '12345' }
    ],
    inventory: [
        { id: 'INV_01', name: 'A4', type: 'ธรรมดา', qty: 22, unit: 'รีม', price: 5, reorder: 10, statusInfo: 'instock' },
        { id: 'INV_02', name: 'หมึก', type: 'ดำ', qty: 3, unit: 'ขวด', price: 3, reorder: 10, statusInfo: 'low' },
        { id: 'INV_03', name: 'A4', type: 'แผ่นปกใส', qty: 0, unit: 'รีม', price: 6, reorder: 15, statusInfo: 'out' },
        { id: 'INV_04', name: 'คลิปหนีบกระดาษ', type: 'อันเล็ก', qty: 300, unit: 'ชิ้น', price: 7, reorder: 50, statusInfo: 'instock' },
        { id: 'INV_05', name: 'เทป', type: 'ชนิดใส', qty: 2, unit: 'ม้วน', price: 10, reorder: 15, statusInfo: 'low' },
        { id: 'INV_06', name: 'ลวดเย็บกระดาษ', type: '35 MM', qty: 70, unit: 'อัน', price: 22, reorder: 10, statusInfo: 'instock' },
        { id: 'INV_07', name: 'กรรไกร', type: 'ใหญ่', qty: 3, unit: 'ด้าม', price: 45, reorder: 3, statusInfo: 'low' }
    ],
    receiveMaterials: [
        // Dummy data for receive materials log
        { id: 'RM_01', name: 'Somyot', matName: 'A4', matType: 'ธรรมดา', qty: 10, date: '12 เม.ย. 2026 10:30', note: '-' },
        { id: 'RM_02', name: 'Somyot', matName: 'หมึก', matType: 'ดำ', qty: 5, date: '12 เม.ย. 2026 14:15', note: 'เติมด่วน' }
    ],
    receivePrints: [
        { 
            id: 'Q_001', theme: 'online', status: 'รอพิมพ์เอกสาร', totalPrice: 23, orderDate: '20 - 03 - 2026', receiveDate: '21 - 03 - 2026 / <span class="text-purple-accent">09 : 00</span>',
            items: [
                { fileName: 'Sad_Project2.PDF', printTypeHtml: '<span class="text-color-green">สี</span>', docSize: 'A4', docType: 'ร้อยปอนด์', qty: 1, price: 23, note: 'ปริ้นงานสี', fileUrl: 'item/receiveprint1.png' }
            ]
        },
        { 
            id: 'Q_002', theme: 'online', status: 'รอพิมพ์เอกสาร', totalPrice: 18, orderDate: '20 - 03 - 2026', receiveDate: '21 - 03 - 2026 / <span class="text-purple-accent">09 : 10</span>',
            items: [
                { fileName: 'Sad_Project2.PDF', printTypeHtml: 'ขาว - ดำ', docSize: 'A4', docType: 'ธรรมดา', qty: 2, price: 9, note: '-', fileUrl: 'item/receiveprint2.png' }
            ]
        },
        { 
            id: 'Q_004', theme: 'walkin', status: 'รอพิมพ์เอกสาร', totalPrice: 85, orderDate: '21 - 04 - 2026', receiveDate: '21 - 04 - 2026 / <span class="text-purple-accent">10 : 30</span>',
            items: [
                { fileName: 'Walkin_Report.PDF', printTypeHtml: '<span class="text-color-green">สี</span>', docSize: 'A4', docType: 'อาตมัน', qty: 2, price: 42, note: '-', fileUrl: 'item/receiveprint3.png' }
            ]
        }
    ],
    withdraws: [
        // Dummy data for withdraw log
        { id: 'WD_01', name: 'Somporn', matName: 'เทป', matType: 'ชนิดใส', qty: 2, date: '13 เม.ย. 2026 11:20', note: 'ใช้งานออฟฟิศ' },
        { id: 'WD_02', name: 'Amporn', matName: 'กระดาษ', matType: 'A4', qty: 5, date: '05 มี.ค. 2026 14:15', note: 'เบิกใช้ในสำนักงาน' }
    ],
    reportDailyPrints: [
        { customer: 'สมชาติ ทองเหม็น', material: 'A4', type: 'ร้อยปอนด์', qty: 1, printType: 'สี', time: '12 : 49', price: 17 },
        { customer: 'สมชาย แซ่ตั้ง', material: 'A5', type: 'สติ๊กเกอร์', qty: 1, printType: 'ขาวดำ', time: '15 : 21', price: 34 },
        { customer: 'User_Genrate(WalkIn)', material: 'A4', type: 'ธรรมดา', qty: 2, printType: 'ขาวดำ', time: '13 : 11', price: 14 }
    ],
    reportStock: [
        { material: 'A4', type: 'สติ๊กเกอร์', qty: 1112, price: 15 },
        { material: 'A4', type: 'ร้อยปอนด์', qty: 25, price: 10, lowStock: true },
        { material: 'A3', type: 'ธรรมดา', qty: 2234, price: 10 }
    ],
    reportMonthlySales: [
        { date: '18 May 2026', items: 154, sales: 170000 },
        { date: '17 May 2026', items: 269, sales: 34000 },
        { date: '16 May 2026', items: 121, sales: 2000 }
    ],
    reports: [
        // Dummy data for reports
        { id: 'RPT_01', date: '2026-04-12', totalWithdraw: 1200, totalReceive: 3500, expenses: 1500 }
    ]
};

/**
 * 1. Simulates Authentication API
 */
const generateMockToken = () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + btoa("dummy_payload") + ".Signature";

// Return promise bridging to login success
const fakeLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username && password) {
                // In a real API, it would check the db
                const token = generateMockToken();
                localStorage.setItem("authToken", token);
                localStorage.setItem("currentUser", username);
                resolve({ success: true, token: token });
            } else {
                reject(new Error("Missing credentials"));
            }
        }, 800);
    });
};

const fakeLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
};

/**
 * 2. MAIN FETCH API SIMULATION
 * Replace native fetch() calls with this function to mimic latency & JWT auth validation
 */
const fetchApi = (endpoint, options = {}) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const token = localStorage.getItem("authToken");

            // Ignore JWT validation if login endpoint
            if (endpoint !== "/api/login") {
                // 1. Verify Authentication 
                if (!token || !token.startsWith("eyJ")) {
                    console.error("401 Unauthorized: No valid JWT token found");
                    // In real API, we automatically kick to login
                    // window.location.href = "index.html";
                    // But we won't kick here so UI can handle error
                    return reject(new Error("401 Unauthorized: Please login again."));
                }
            }

            // 2. Map endpoints to mock database
            let responseData = [];
            switch (endpoint) {
                case "/api/users":
                    responseData = MockDatabase.users;
                    break;
                case "/api/employees":
                    responseData = MockDatabase.employees;
                    break;
                case "/api/inventory":
                    responseData = MockDatabase.inventory;
                    break;
                case "/api/receive-materials":
                    responseData = MockDatabase.receiveMaterials;
                    break;
                case "/api/receive-prints":
                    responseData = MockDatabase.receivePrints;
                    break;
                case "/api/withdraws":
                    responseData = MockDatabase.withdraws;
                    break;
                case "/api/reports":
                    responseData = MockDatabase.reports;
                    break;
                case "/api/report-daily-prints":
                    responseData = MockDatabase.reportDailyPrints;
                    break;
                case "/api/report-stock":
                    responseData = MockDatabase.reportStock;
                    break;
                case "/api/report-monthly-sales":
                    responseData = MockDatabase.reportMonthlySales;
                    break;
                default:
                    return reject(new Error(`404 Not Found: Endpoint ${endpoint}`));
            }

            // 3. Simulated Methods (GET, POST logic etc)
            // Currently assuming GET. If POST/PUT, we manipulate MockDatabase array.
            const method = (options.method || "GET").toUpperCase();
            
            if (method === "GET") {
                resolve(responseData);
            } else if (method === "POST") {
                // Example of simple append
                const payload = JSON.parse(options.body || "{}");
                payload.id = 'NEW_' + Date.now();
                responseData.unshift(payload); // add to top
                
                resolve({ success: true, data: payload });
            } else if (method === "DELETE") {
                // Simple pass through for mock
                resolve({ success: true });
            }

        }, Math.floor(Math.random() * 500) + 300); // 300ms to 800ms random latency
    });
};

/**
 * 3. Loading Spinner UI Helper
 */
const createLoadingSpinner = (colspan = 1) => {
    return `<tr><td colspan="${colspan}" style="text-align: center; padding: 3rem 0;">
                <div class="loader-spinner" style="margin: 0 auto 10px auto;"></div>
                <p style="color: #64748b; font-weight: 500;">กำลังโหลดข้อมูลจำลองผ่าน JWT Flow...</p>
            </td></tr>`;
};

// Add spinner CSS to head dynamically if it doesn't exist
const injectSpinnerCSS = () => {
    if (!document.getElementById("mock-api-styles")) {
        const style = document.createElement("style");
        style.id = "mock-api-styles";
        style.innerHTML = `
            .loader-spinner {
                border: 4px solid rgba(59, 130, 246, 0.2);
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
};

document.addEventListener("DOMContentLoaded", injectSpinnerCSS);
