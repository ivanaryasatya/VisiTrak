// --- Keamanan Akses (Route Guard) Sederhana ---
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html'; // Tendang kembali ke halaman login jika belum masuk
}

document.addEventListener("DOMContentLoaded", () => {
    initChart();
    initEnergyChart();
    
    // Jalankan simulasi data sensor real-time
    startRealTimeSimulation();
    
    // Enter key listener untuk chatbot
    document.getElementById("chat-input").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
    
    // Enter key listener untuk Global Chat
    const globalChatInput = document.getElementById("global-chat-input");
    if (globalChatInput) {
        globalChatInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") sendGlobalMessage();
        });
    }

    // --- Pengaturan Profil & Role Berdasarkan Data Login ---
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    const userUid = sessionStorage.getItem('userUid');

    if (userName) {
        document.querySelectorAll('.profile-info h4').forEach(el => el.innerText = userName);
        const nameGroups = document.querySelectorAll('.profile-detail-group:nth-child(2) p, .profile-detail-group:nth-child(1) p');
        if (nameGroups.length > 0) nameGroups[0].innerText = userName;
        
        // Otomatis men-generate Avatar berdasarkan Inisial Akun Google
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`;
        const avatarSmall = document.querySelector('.profile-avatar');
        if(avatarSmall) avatarSmall.src = avatarUrl;
        const avatarLarge = document.querySelector('.profile-avatar-large');
        if(avatarLarge) avatarLarge.src = avatarUrl + '&size=128';
        
        const nameInput = document.querySelector('#view-pengaturan input[type="text"]');
        if(nameInput) nameInput.value = userName;
    }

    if (userEmail) {
        const emailGroups = document.querySelectorAll('.profile-detail-group');
        emailGroups.forEach(group => {
            if (group.querySelector('label') && group.querySelector('label').innerText === 'Email') {
                group.querySelector('p').innerText = userEmail;
            }
        });
    }

    if (userRole) {
        const roleText = userRole === 'admin' ? 'Administrator Super' : 'Operator / User';
        document.querySelectorAll('.profile-info p').forEach(el => el.innerText = roleText);
        
        const roleGroups = document.querySelectorAll('.profile-detail-group');
        roleGroups.forEach(group => {
            if (group.querySelector('label') && group.querySelector('label').innerText.includes('Role')) {
                group.querySelector('p').innerText = roleText;
            }
        });
        
        const roleSelect = document.querySelector('#view-pengaturan select');
        if(roleSelect) roleSelect.value = roleText;

        // Sembunyikan menu sensitif jika diakses oleh user biasa (Bukan admin)
        if (userRole !== 'admin') {
            const adminMenus = [
                document.querySelector('.nav-links li[onclick*="view-ai"]'),
                document.querySelector('.nav-links li[onclick*="view-pengaturan"]')
            ];
            adminMenus.forEach(menu => {
                if(menu) menu.style.display = 'none';
            });
        } else {
            // Render & Tampilkan Panel Administrator khusus untuk Admin
            const adminPanel = document.getElementById('admin-panel');
            if (adminPanel) {
                adminPanel.style.display = 'block';
                loadAdminData();
                // Mulai mendengarkan permintaan login baru secara real-time
                listenForPendingUsers();
                
                // Tampilkan tombol Hapus Semua Chat khusus untuk Admin
                const btnClearChat = document.getElementById('btn-clear-chat');
                if (btnClearChat) btnClearChat.style.display = 'block';
            }
        }
        
        // Inisialisasi Forum Chat Global setelah autentikasi profil
        initGlobalChat();
    }

    // --- Sistem Presence (Online Status) & Force Logout Listener ---
    if (userUid && userUid !== 'local-admin' && db) {
        // Tandai pengguna sebagai Online
        db.collection('users').doc(userUid).update({ isOnline: true }).catch(e => console.warn(e));

        // Dengarkan perintah Force Logout dari Admin
        db.collection('users').doc(userUid).onSnapshot((doc) => {
            if (doc.exists && doc.data().forceLogout === true) {
                db.collection('users').doc(userUid).update({ forceLogout: false, isOnline: false }).then(() => {
                    // Tutup layar dengan overlay agar dashboard tidak bisa diakses lagi
                    const kickOverlay = document.createElement('div');
                    kickOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.95); z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center; padding: 20px;";
                    kickOverlay.innerHTML = `
                        <i class="fas fa-sign-out-alt" style="color: #ef4444; font-size: 5rem; margin-bottom: 20px; animation: fadeIn 0.5s ease-in-out;"></i>
                        <h1 style="font-size: 2.2rem; margin-bottom: 10px;">Sesi Dihentikan</h1>
                        <p style="font-size: 1.1rem; color: #cbd5e1;">Anda telah dikeluarkan (Kick) secara paksa oleh Administrator.</p>
                        <p style="margin-top: 30px; font-size: 0.9rem; color: #94a3b8;"><i class="fas fa-circle-notch fa-spin"></i> Mengalihkan ke halaman login secara otomatis...</p>
                    `;
                    document.body.appendChild(kickOverlay);
                    
                    // Logout dan redirect otomatis tanpa menunggu klik user
                    setTimeout(() => {
                        logoutUserAction();
                    }, 3000);
                });
            }
        });

        // Tandai Offline saat tab browser ditutup
        window.addEventListener('beforeunload', () => {
            db.collection('users').doc(userUid).update({ isOnline: false });
        });
    }
});

// --- Logika Toggle Sidebar (Mobile) ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

// --- Logika Sidebar Navigation ---
function switchSidebarView(evt, viewId) {
    // Sembunyikan semua view konten
    const views = document.getElementsByClassName("sidebar-view");
    for (let i = 0; i < views.length; i++) {
        views[i].classList.remove("active");
    }

    // Hapus class 'active' dari semua menu sidebar
    const navLinks = document.querySelectorAll(".nav-links li");
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("active");
    }

    // Tampilkan view yang dipilih
    document.getElementById(viewId).classList.add("active");
    evt.currentTarget.classList.add("active");

    // Update judul header secara dinamis
    const pageTitle = document.getElementById("page-title");
    if (viewId === 'view-dashboard') pageTitle.innerText = "Monitoring Otomatisasi Mesin";
    else if (viewId === 'view-mesin') pageTitle.innerText = "Manajemen Mesin";
    else if (viewId === 'view-pengaturan-mesin') pageTitle.innerText = "Pengaturan Konfigurasi Mesin";
    else if (viewId === 'view-energi') pageTitle.innerText = "Monitoring Energi Terpusat";
    else if (viewId === 'view-ai') pageTitle.innerText = "Konfigurasi Artificial Intelligence";
    else if (viewId === 'view-laporan') pageTitle.innerText = "Laporan & Analitik";
    else if (viewId === 'view-pemeliharaan') pageTitle.innerText = "Manajemen Pemeliharaan";
    else if (viewId === 'view-alarm') pageTitle.innerText = "Log Alarm & Notifikasi";
    else if (viewId === 'view-chat') {
        pageTitle.innerText = "Forum Komunikasi Global";
        // Langsung scroll ke paling bawah chat (dasar)
        setTimeout(() => {
            const chatContainer = document.getElementById('global-chat-messages');
            if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 50);
    }
    else if (viewId === 'view-pengaturan') pageTitle.innerText = "Pengaturan Sistem";
    else if (viewId === 'view-qc') pageTitle.innerText = "AI CCTV Karyawan";
    else if (viewId === 'view-3d') {
        pageTitle.innerText = "3D Industrial Parts Viewer";
        setTimeout(() => initSTLViewer(), 100);
    }
    
    // Tutup otomatis sidebar di mobile setelah mengklik menu
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
    }
}

// --- Logika Sistem Tab ---
function openTab(evt, tabId) {
    // Sembunyikan semua konten tab
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // Hapus class 'active' dari semua tombol tab
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }

    // Tampilkan tab yang dipilih
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// --- Inisialisasi Grafik (Chart.js) ---
function initChart() {
    const ctx = document.getElementById('monitoringChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
            datasets: [
                {
                    label: 'Output Unit',
                    data: [120, 150, 140, 180, 100, 210, 340],
                    borderColor: '#2563eb', // Primary
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Konsumsi Energi (kWh)',
                    data: [20, 25, 22, 28, 15, 30, 45],
                    borderColor: '#f59e0b', // Warning/Orange
                    backgroundColor: 'transparent',
                    yAxisID: 'y1',
                    tension: 0.3,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Unit' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'kWh' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// --- Inisialisasi Grafik Energi (Chart.js) ---
function initEnergyChart() {
    const canvas = document.getElementById('energyChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
            datasets: [{
                label: 'Konsumsi Energi Harian (kWh)',
                data: [1100, 1400, 1350, 1600, 1500, 800, 600],
                backgroundColor: '#10b981', // Success color
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// --- Logika Panel Kontrol (Mock-up) ---
function toggleMachine(machineId) {
    // Pada implementasi nyata, fungsi ini akan memanggil API ke PLC / Controller
    alert(`Instruksi dikirim ke mesin dengan ID: ${machineId}`);
}

// --- Logika UI Chatbot AI ---
function toggleChat() {
    const body = document.getElementById('chat-body');
    const icon = document.getElementById('chat-toggle-icon');
    
    if (body.classList.contains('active')) {
        body.classList.remove('active');
        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    } else {
        body.classList.add('active');
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.value.trim();
    
    if (messageText === "") return;

    // 1. Tambahkan pesan user ke UI
    addMessageToChat(messageText, 'user-message');
    input.value = '';

    // Tampilkan indikator loading sementara
    const loadingId = 'loading-' + Date.now();
    addMessageToChat('Sedang berpikir...', 'ai-message', loadingId);

    // 2. Konfigurasi Azure OpenAI
    // PENTING: Ganti nilai-nilai di bawah ini dengan kredensial Azure Anda!
    const azureEndpoint = "https://RESOURCE-ANDA.openai.azure.com"; 
    const apiKey = "API_KEY_AZURE_ANDA"; 
    const deploymentName = "NAMA-DEPLOYMENT-ANDA"; // misal: gpt-35-turbo
    const apiVersion = "2024-02-15-preview";
    
    const url = `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Anda adalah VisiTrak AI Assistant, seorang asisten ahli untuk operator pabrik. Anda memberikan analisa Root Cause, rekomendasi maintenance, dan status operasional. Jawab dengan ringkas, profesional, dan dalam bahasa Indonesia." },
                    { role: "user", content: messageText }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // Hapus pesan loading
        const loadingMessage = document.getElementById(loadingId);
        if (loadingMessage) loadingMessage.remove();

        if (response.ok) {
            // Ambil balasan teks dari AI dan tampilkan
            const aiReply = data.choices[0].message.content;
            addMessageToChat(aiReply, 'ai-message');
        } else {
            console.error("Azure API Error:", data);
            addMessageToChat("Maaf, terjadi kesalahan API. Silakan cek console.", 'ai-message');
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        const loadingMessage = document.getElementById(loadingId);
        if (loadingMessage) loadingMessage.remove();
        addMessageToChat("Gagal terhubung ke jaringan Azure.", 'ai-message');
    }
}

function addMessageToChat(text, className, id = null) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    if (id) messageDiv.id = id;
    
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll ke bawah
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Logika Interaksi & Simulasi Data Mesin Real-time ---
function startRealTimeSimulation() {
    // Update data setiap 1.5 detik
    setInterval(() => {
        // Fluktuasi nilai CNC Alpha (Kondisi Normal)
        updateLiveValue('cnc-temp', 71.5, 73.5, 1);
        updateLiveValue('cnc-vib', 2.0, 2.3, 2);
        updateLiveValue('cnc-rpm', 12000, 12100, 0);

        // Fluktuasi nilai Milling Beta (Kondisi Warning/Panas)
        updateLiveValue('mill-temp', 87.0, 89.5, 1); 
        updateLiveValue('mill-vib', 5.2, 5.8, 2);
        updateLiveValue('mill-rpm', 8350, 8420, 0);
        updateLiveValue('mill-coolant-pres', 1.1, 1.4, 1);
        
        // Fluktuasi indikator Energi Terpusat
        updateLiveValue('current-power', 440, 470, 0);

        // Simulasi hitungan live pada Visual QC
        const qcGoodEl = document.getElementById('qc-good');
        const qcTotalEl = document.getElementById('qc-total');
        if (qcGoodEl && qcTotalEl && Math.random() > 0.6) {
            let good = parseInt(qcGoodEl.innerText.replace(/,/g, ''));
            let total = parseInt(qcTotalEl.innerText.replace(/,/g, ''));
            good += 1; total += 1;
            qcGoodEl.innerText = good.toLocaleString();
            qcTotalEl.innerText = total.toLocaleString();
        }
    }, 1500); 
}

function updateLiveValue(elementId, min, max, decimals) {
    const el = document.getElementById(elementId);
    if (el) {
        const randomVal = (Math.random() * (max - min) + min).toFixed(decimals);
        el.innerText = randomVal;
    }
}

function updateMachineParam(inputId) {
    const inputEl = document.getElementById(inputId);
    const displayEl = document.getElementById(inputId + '-val');
    if (inputEl && displayEl) {
        displayEl.innerText = inputEl.value;
    }
}

function autoTune(machineName) {
    alert(`AI Auto-Tuning diaktifkan untuk ${machineName}. \n\nAlgoritma mengkalkulasi feed-rate dan parameter termal terbaik untuk efisiensi maksimal.`);
}

function calibrateMachine(machineName) {
    alert(`Sistem sedang mengeksekusi sekuens kalibrasi pada ${machineName}...`);
}

// --- Logika Pengaturan AI ---
function toggleAIEngine() {
    const btn = document.getElementById('ai-engine-btn');
    if (btn.innerText === "AKTIF") {
        btn.innerText = "NON-AKTIF";
        btn.classList.replace('btn-start', 'btn-stop');
        alert("Peringatan: Machine Learning untuk deteksi anomali dinonaktifkan.");
    } else {
        btn.innerText = "AKTIF";
        btn.classList.replace('btn-stop', 'btn-start');
    }
}

function testAIConnection() {
    alert("Menguji koneksi ke server Microsoft Azure... \n\nKoneksi Berhasil! Latensi API: 45ms.");
}

// --- Logika Tambahan ---
function downloadReport(format) {
    alert(`Sedang mengenerate laporan dalam format ${format}...\nFile akan otomatis terunduh dalam beberapa detik.`);
}

function applyOptimization(btnElement) {
    btnElement.innerHTML = "<i class='fas fa-check-double'></i> Diterapkan";
    btnElement.classList.replace("btn-start", "btn-auto");
    alert("Rekomendasi AI berhasil diterapkan ke seluruh mesin secara real-time. Efisiensi diproyeksikan meningkat 7% dalam shift ini.");
}

function analyzeRootCause(issueType) {
    if(issueType === 'Milling Beta Overheat') {
        alert("🔍 AI Root Cause Analysis:\n\nProbabilitas 85%: Overheat disebabkan oleh penurunan tekanan pompa coolant utama (turun 15%) 5 menit sebelum kejadian, yang berkorelasi dengan peningkatan getaran pada poros spindle.\n\nRekomendasi: Purge sistem coolant dan periksa filter.");
    } else {
        alert("🔍 AI Root Cause Analysis:\n\nProbabilitas 92%: Terjadi fluktuasi pasokan listrik dari gardu eksternal. Sistem UPS berhasil menahan beban sementara sebelum genset mengambil alih.\n\nRekomendasi: Lakukan sinkronisasi ulang fase pada panel LVMDP.");
    }
}

// --- Logika Profil Pengguna (Modal) ---
function openUserProfile() {
    document.getElementById('user-profile-modal').classList.add('active');
}

function closeUserProfile() {
    document.getElementById('user-profile-modal').classList.remove('active');
}

// --- Logika Halaman Pengaturan Mesin ---
function loadMachineSettings() {
    const selector = document.getElementById('machine-selector').value;
    
    // Simulasi data konfigurasi yang berbeda untuk tiap mesin
    const data = {
        'cnc-alpha': { rpm: 15000, coolant: 1.5, temp: 85, vib: 5.0, ip: '192.168.1.101', polling: 1500 },
        'mill-beta': { rpm: 10000, coolant: 2.0, temp: 90, vib: 6.5, ip: '192.168.1.102', polling: 1000 },
        'conv-a': { rpm: 1500, coolant: 0, temp: 60, vib: 2.5, ip: '192.168.1.105', polling: 2000 }
    };

    const config = data[selector];
    if(config) {
        document.getElementById('set-max-rpm').value = config.rpm;
        document.getElementById('set-coolant').value = config.coolant;
        document.getElementById('set-max-temp').value = config.temp;
        document.getElementById('set-max-vib').value = config.vib;
        document.getElementById('set-ip').value = config.ip;
        document.getElementById('set-polling').value = config.polling;
    }
}

function saveMachineSettings() {
    const machineName = document.getElementById('machine-selector').options[document.getElementById('machine-selector').selectedIndex].text;
    alert(`Berhasil!\n\nPengaturan untuk ${machineName} telah disimpan dan disinkronisasi ke Controller PLC secara real-time.`);
}

function resetMachineSettings() {
    if(confirm("Peringatan!\n\nApakah Anda yakin ingin mengembalikan pengaturan mesin ini ke parameter Default Pabrik (Factory Reset)?")) {
        loadMachineSettings(); // Muat ulang data default
        alert("Pengaturan dikembalikan ke default.");
    }
}

// --- Logika Keluar (Logout) ---
function logout() {
    if (confirm("Apakah Anda yakin ingin keluar dari VisiTrak?")) {
        // Tandai Offline terlebih dahulu sebelum proses hapus sesi
        const userUid = sessionStorage.getItem('userUid');
        if (userUid && userUid !== 'local-admin' && db) {
            db.collection('users').doc(userUid).update({ isOnline: false });
        }
        logoutUserAction();
    }
}

function logoutUserAction() {
    if (auth) {
        auth.signOut().then(() => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }).catch(() => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        });
    } else {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

// --- Logika Panel Administrator (Firebase) ---
async function loadAdminData() {
    if (!db) return;
    try {
        // Ambil pengaturan auto-approve global
        const settingsDoc = await db.collection('settings').doc('global').get();
        const btnToggle = document.getElementById('btn-toggle-auto-approve');
        if (settingsDoc.exists && settingsDoc.data().auto_approve) {
            btnToggle.classList.replace('btn-stop', 'btn-start');
            btnToggle.innerText = 'AKTIF';
        } else {
            if (!settingsDoc.exists) {
                await db.collection('settings').doc('global').set({ auto_approve: false });
            }
        }

        // Gunakan onSnapshot agar tabel merespons perubahan secara real-time
        if (!window.usersListenerUnsubscribe) {
            window.usersListenerUnsubscribe = db.collection('users').onSnapshot(usersSnapshot => {
                const tbody = document.querySelector('#users-table tbody');
                if(tbody) tbody.innerHTML = '';
                
                usersSnapshot.forEach(doc => {
                    const data = doc.data();
                    const tr = document.createElement('tr');
                    
                    const approvedBadge = data.approved 
                        ? `<span class="badge badge-success">Disetujui</span>` 
                        : `<span class="badge badge-warning">Menunggu</span>`;
                        
                    const onlineBadge = data.isOnline
                        ? `<br><span class="badge badge-success" style="background:#d1fae5; color:#10b981; margin-top:5px; display:inline-block;"><i class="fas fa-circle" style="font-size:8px;"></i> Online</span>`
                        : `<br><span class="badge badge-light" style="background:#f1f5f9; color:#94a3b8; margin-top:5px; display:inline-block;"><i class="fas fa-circle" style="font-size:8px;"></i> Offline</span>`;
                        
                    const actionBtn = data.approved
                        ? `<button class="btn btn-warning" style="padding: 5px 10px; font-size: 0.8rem;" onclick="updateUserStatus('${doc.id}', false)">Cabut Akses</button>`
                        : `<button class="btn btn-start" style="padding: 5px 10px; font-size: 0.8rem;" onclick="updateUserStatus('${doc.id}', true)">Setujui</button>`;
                        
                    const adminBtn = data.role === 'admin'
                        ? ``
                        : `<button class="btn btn-auto" style="padding: 5px 10px; font-size: 0.8rem; margin-left: 5px;" onclick="updateUserRole('${doc.id}', 'admin')">Jadikan Admin</button>`;

                    const kickBtn = (data.isOnline && data.role !== 'admin')
                        ? `<button class="btn btn-emergency" style="padding: 5px 10px; font-size: 0.8rem; margin-left: 5px; width:auto; margin-top:0;" onclick="kickUser('${doc.id}')"><i class="fas fa-sign-out-alt"></i> Kick</button>`
                        : ``;

                    tr.innerHTML = `
                        <td>${data.name || 'N/A'} ${onlineBadge}</td>
                        <td>${data.email || 'N/A'}</td>
                        <td><span class="badge ${data.role === 'admin' ? 'badge-primary' : 'badge-light'}" style="${data.role === 'admin' ? 'background:#e0e7ff; color:#3730a3;' : 'background:#f1f5f9; color:#64748b;'}">${data.role || 'user'}</span></td>
                        <td>${approvedBadge}</td>
                        <td>
                            ${data.role !== 'admin' ? actionBtn : '<i>Akses Penuh</i>'}
                            ${data.role !== 'admin' ? adminBtn : ''}
                            ${kickBtn}
                        </td>
                    `;
                    if(tbody) tbody.appendChild(tr);
                });
            });
        }
    } catch (e) {
        console.error("Gagal memuat data admin dari Firebase:", e);
    }
}

window.toggleAutoApprove = async function() {
    if (!db) return;
    const btnToggle = document.getElementById('btn-toggle-auto-approve');
    const isActive = btnToggle.innerText === 'AKTIF';
    
    try {
        await db.collection('settings').doc('global').set({ auto_approve: !isActive }, { merge: true });
        if (!isActive) {
            btnToggle.classList.replace('btn-stop', 'btn-start');
            btnToggle.innerText = 'AKTIF';
        } else {
            btnToggle.classList.replace('btn-start', 'btn-stop');
            btnToggle.innerText = 'TIDAK AKTIF';
        }
        alert(`Auto-approve berhasil diubah menjadi: ${!isActive ? 'AKTIF' : 'TIDAK AKTIF'}`);
    } catch (e) {
        alert("Gagal mengubah pengaturan! Pastikan Anda memiliki hak akses.");
    }
};

window.updateUserStatus = async function(userId, isApproved) {
    if (!db) return;
    if (confirm(`Yakin ingin ${isApproved ? 'menyetujui' : 'mencabut akses'} pengguna ini?`)) {
        try {
            await db.collection('users').doc(userId).update({ approved: isApproved });
            loadAdminData(); // Refresh UI Table
        } catch (e) {
            alert("Gagal memperbarui status pengguna.");
        }
    }
};

window.kickUser = async function(userId) {
    if (!db) return;
    if (confirm("Yakin ingin mengeluarkan (kick) pengguna ini secara paksa? Sesi mereka akan segera diakhiri.")) {
        try {
            await db.collection('users').doc(userId).update({ forceLogout: true });
        } catch (e) {
            alert("Gagal mengeluarkan pengguna. Pastikan Anda memiliki hak akses.");
        }
    }
};

// --- Logika Forum Chat Global ---
let globalChatUnsubscribe = null;
function initGlobalChat() {
    if (!db) return;
    const container = document.getElementById('global-chat-messages');
    
    globalChatUnsubscribe = db.collection('global_chats')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            // Hitung jarak dari bawah sebelum update
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 100;
            const distanceFromBottom = container.scrollHeight - container.scrollTop;

            container.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                renderGlobalMessage(doc.id, data, container);
            });
            
            // Auto-scroll ke bawah HANYA jika sebelumnya sudah di bawah (atau baru load pertama)
            // Jika user sedang scroll ke atas membaca chat lama, pertahankan posisi scrollnya
            if (isNearBottom || container.scrollTop === 0) {
                container.scrollTop = container.scrollHeight;
            } else {
                container.scrollTop = container.scrollHeight - distanceFromBottom;
            }
        });
}

function renderGlobalMessage(msgId, data, container) {
    const currentUserUid = sessionStorage.getItem('userUid');
    const isAdmin = sessionStorage.getItem('userRole') === 'admin';
    const isOwn = data.senderUid === currentUserUid;

    const wrapper = document.createElement('div');
    wrapper.className = `global-chat-wrapper ${isOwn ? 'own' : 'other'}`;

    // Format Waktu
    let timeStr = 'Mengirim...';
    if (data.timestamp) {
        const date = data.timestamp.toDate();
        timeStr = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    }

    // Generate warna unik berdasarkan nama pengirim (agar konsisten per user)
    const nameColor = isOwn ? '#075e54' : getNameColor(data.senderName || 'Anonim');

    // Tombol Aksi (Hapus Per Pesan) — muncul saat hover
    let deleteBtn = '';
    if (isAdmin || isOwn) {
        deleteBtn = `<button class="chat-action-btn" onclick="deleteGlobalMessage('${msgId}')" title="Hapus Pesan"><i class="fas fa-trash"></i></button>`;
    }

    // Info pengirim: nama + email (hanya untuk pesan orang lain)
    const senderEmail = data.senderEmail || '';
    let senderInfo = '';
    if (!isOwn) {
        senderInfo = `
            <div class="global-chat-sender-name" style="color: ${nameColor};">${data.senderName || 'Anonim'}</div>
            ${senderEmail ? `<div class="global-chat-sender-email">${senderEmail}</div>` : ''}
        `;
    } else {
        senderInfo = `
            <div class="global-chat-sender-name" style="color: ${nameColor};">Anda</div>
        `;
    }

    wrapper.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 4px; flex-direction: ${isOwn ? 'row-reverse' : 'row'}; max-width: 100%;">
            <div class="global-chat-bubble ${isOwn ? 'own' : 'other'}">
                ${senderInfo}
                <div class="global-chat-text">${escapeHtml(data.text)}</div>
                <div class="global-chat-time">${timeStr}</div>
            </div>
            ${deleteBtn}
        </div>
    `;
    container.appendChild(wrapper);
}

// Fungsi untuk generate warna unik berdasarkan string nama
function getNameColor(name) {
    const colors = [
        '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
        '#00bcd4', '#009688', '#4caf50', '#ff9800', '#ff5722',
        '#795548', '#607d8b', '#1976d2', '#c2185b', '#7b1fa2',
        '#0097a7', '#00796b', '#689f38', '#ef6c00', '#d84315'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// Fungsi untuk sanitasi HTML (mencegah XSS di chat)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.sendGlobalMessage = async function() {
    const input = document.getElementById('global-chat-input');
    const text = input.value.trim();
    if (!text || !db) return;
    
    const userUid = sessionStorage.getItem('userUid');
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    input.value = '';
    
    try {
        await db.collection('global_chats').add({
            text: text,
            senderUid: userUid,
            senderName: userName || 'Anonim',
            senderEmail: userEmail || '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch(e) {
        console.error("Gagal mengirim chat:", e);
        alert("Gagal mengirim pesan.");
    }
};

window.deleteGlobalMessage = async function(msgId) {
    if (!db) return;
    if (confirm("Yakin ingin menghapus pesan ini?")) {
        try {
            await db.collection('global_chats').doc(msgId).delete();
        } catch(e) {
            alert("Gagal menghapus pesan. Pastikan Anda memiliki hak akses (Admin/Pemilik).");
        }
    }
};

window.clearAllGlobalChats = async function() {
    if (!db) return;
    if (confirm("PERINGATAN BAHAYA!\n\nYakin ingin menghapus SEMUA riwayat chat global? Tindakan ini tidak dapat dibatalkan.")) {
        try {
            const snapshot = await db.collection('global_chats').get();
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit(); // Eksekusi penghapusan massal
            alert("Semua riwayat chat berhasil dibersihkan.");
        } catch(e) {
            alert("Gagal menghapus chat. Pastikan Anda memiliki hak akses (Admin).");
        }
    }
};

// --- Logika Notifikasi Real-time Admin ---
function listenForPendingUsers() {
    if (!db) return;
    
    // Dengarkan perubahan pada koleksi users di mana approved = false
    db.collection('users').where('approved', '==', false).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const userData = change.doc.data();
            const userId = change.doc.id;
            
            if (change.type === 'added') {
                showAdminNotification(userId, userData.name || 'User Tanpa Nama', userData.email || 'Tanpa Email');
            }
            
            // Jika user dihapus atau disetujui (dari popup maupun tabel), notifikasi akan hilang otomatis
            if (change.type === 'removed' || (change.type === 'modified' && userData.approved === true)) {
                const existingNotif = document.getElementById(`notif-${userId}`);
                if (existingNotif) existingNotif.remove();
            }
        });
    });
}

function showAdminNotification(userId, name, email) {
    const container = document.getElementById('admin-notifications');
    if (!container || document.getElementById(`notif-${userId}`)) return;

    const notif = document.createElement('div');
    notif.className = 'card';
    notif.style = 'border-left: 4px solid var(--warning); box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: fadeIn 0.3s ease-in-out; padding: 15px; width: 320px; position: relative; background: var(--card-bg);';
    notif.id = `notif-${userId}`;

    notif.innerHTML = `
        <button style="position:absolute; top:10px; right:10px; background:none; border:none; cursor:pointer; color: var(--text-light);" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <h4 style="margin-bottom: 5px; color: var(--text-main); font-size: 1rem;"><i class="fas fa-user-plus" style="color: var(--warning);"></i> Permintaan Akses Baru</h4>
        <p style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 15px; line-height: 1.4;">
            <strong>${name}</strong><br>(${email}) ingin masuk.
        </p>
        <div style="display: flex; gap: 10px;">
            <button class="btn btn-start" style="flex: 1; padding: 8px; font-size: 0.85rem;" onclick="handleQuickApprove('${userId}', true)"><i class="fas fa-check"></i> Accept</button>
            <button class="btn btn-emergency" style="flex: 1; padding: 8px; margin: 0; font-size: 0.85rem;" onclick="handleQuickApprove('${userId}', false)"><i class="fas fa-times"></i> Reject</button>
        </div>
    `;
    container.appendChild(notif);
}

window.handleQuickApprove = async function(userId, isApproved) {
    if (!db) return;
    try {
        if (isApproved) {
            await db.collection('users').doc(userId).update({ approved: true });
        } else {
            await db.collection('users').doc(userId).delete(); // Hapus data user jika di-reject
        }
        loadAdminData(); // Refresh data tabel admin jika sedang terbuka
    } catch (e) {
        console.error("Gagal memproses permintaan:", e);
        alert("Gagal memproses permintaan. Pastikan Anda memiliki koneksi dan hak akses.");
    }
};

window.updateUserRole = async function(userId, newRole) {
    if (!db) return;
    if (confirm(`Yakin ingin menjadikan pengguna ini sebagai ${newRole}? Mereka akan mendapatkan akses menu penuh.`)) {
        try {
            await db.collection('users').doc(userId).update({ role: newRole, approved: true });
            loadAdminData();
        } catch (e) {
            alert("Gagal memperbarui role pengguna.");
        }
    }
};

// --- Logika AI CCTV Karyawan (Webcam) ---
let cctvStream = null;

window.toggleCamera = async function() {
    const videoElement = document.getElementById('cctv-video');
    const mockBg = document.getElementById('cctv-mock-bg');
    const toggleBtn = document.getElementById('btn-toggle-camera');
    const boundingBoxes = document.getElementById('cctv-boxes');

    // Jika kamera sedang nyala (stream ada), matikan
    if (cctvStream) {
        // Hentikan semua track
        cctvStream.getTracks().forEach(track => track.stop());
        cctvStream = null;
        videoElement.srcObject = null;
        
        // Sembunyikan video dan boks, tampilkan background bohongan
        videoElement.style.display = 'none';
        boundingBoxes.style.display = 'none';
        mockBg.style.display = 'block';
        
        // Ubah tampilan tombol kembali ke mode aktifkan (biru)
        toggleBtn.style.background = '#2563eb';
        toggleBtn.innerHTML = '<i class="fas fa-video"></i> <span>Aktifkan Kamera</span>';
    } 
    // Jika kamera mati, nyalakan
    else {
        try {
            // Minta akses kamera ke user
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            cctvStream = stream;
            
            // Pasang stream ke elemen video
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            
            // Sembunyikan background bohongan
            mockBg.style.display = 'none';
            
            // Tampilkan bounding boxes seolah-olah AI sedang mendeteksi
            boundingBoxes.style.display = 'block';
            
            // Ubah tampilan tombol menjadi mode matikan (merah)
            toggleBtn.style.background = '#ef4444';
            toggleBtn.innerHTML = '<i class="fas fa-video-slash"></i> <span>Matikan Kamera</span>';

        } catch (err) {
            console.error("Gagal mengakses kamera: ", err);
            alert("Gagal mengakses kamera laptop. Pastikan Anda telah memberikan izin akses kamera pada browser.");
        }
    }
};

// --- Logika Dark Mode / Light Mode ---
window.toggleDarkMode = function() {
    const body = document.body;
    const btn = document.getElementById('btn-dark-mode');
    
    body.classList.toggle('light-mode');
    
    const isDark = !body.classList.contains('light-mode');
    
    if (btn) {
        btn.textContent = isDark ? 'ON' : 'OFF';
        btn.className = isDark ? 'btn btn-start' : 'btn btn-stop';
    }
    
    // Simpan preferensi ke localStorage
    localStorage.setItem('visitrak-theme', isDark ? 'dark' : 'light');
};

// Muat preferensi tema saat halaman dimuat
(function initTheme() {
    const savedTheme = localStorage.getItem('visitrak-theme');
    const btn = document.getElementById('btn-dark-mode');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (btn) {
            btn.textContent = 'OFF';
            btn.className = 'btn btn-stop';
        }
    }
})();

// ===================================================================
// --- 3D STL PARTS VIEWER (Three.js) ---
// ===================================================================

// Katalog file STL — struktur: mesin > kategori part > file
const stlCatalog = {
    'Mesin CNC Alpha': {
        icon: 'fa-industry',
        parts: {
            'Spindle': [
                { file: 'models/mesin-cnc-alpha/spindle/spindle_housing.stl', name: 'Spindle Housing', material: 'Stainless Steel 304', weight: '2.4 kg' }
            ],
            'Bracket': [
                { file: 'models/mesin-cnc-alpha/bracket/mounting_bracket.stl', name: 'Mounting Bracket', material: 'Aluminium 6061', weight: '0.8 kg' }
            ],
            'Gear': [
                { file: 'models/mesin-cnc-alpha/gear/drive_gear.stl', name: 'Drive Gear Z48', material: 'Carbon Steel', weight: '1.2 kg' }
            ]
        }
    },
    'Conveyor Line A': {
        icon: 'fa-conveyor-belt',
        parts: {
            'Roller': [
                { file: 'models/conveyor-line-a/roller/roller_shaft.stl', name: 'Roller Shaft', material: 'Hardened Steel', weight: '3.1 kg' }
            ],
            'Frame': [
                { file: 'models/conveyor-line-a/frame/frame_profile.stl', name: 'T-Slot Frame Profile', material: 'Aluminium Extrusion', weight: '1.6 kg' }
            ],
            'Fastener': [
                { file: 'models/conveyor-line-a/fastener/hex_bolt_m8.stl', name: 'Hex Bolt M8x30', material: 'Zinc Plated Steel', weight: '0.02 kg' }
            ]
        }
    },
    'Cooling System': {
        icon: 'fa-snowflake',
        parts: {
            'Impeller': [
                { file: 'models/cooling-system/impeller/fan_blade.stl', name: 'Fan Blade Impeller', material: 'Nylon PA12', weight: '0.15 kg' }
            ],
            'Housing': [
                { file: 'models/cooling-system/housing/pump_housing.stl', name: 'Pump Housing', material: 'Cast Iron', weight: '4.5 kg' }
            ],
            'Pipe': [
                { file: 'models/cooling-system/pipe/pipe_section.stl', name: 'Pipe Section DN50', material: 'PVC Schedule 40', weight: '0.6 kg' }
            ]
        }
    }
};

let stlScene, stlCamera, stlRenderer, stlControls, stlCurrentMesh, stlAnimId;
let stlViewerInitialized = false;
let stlWireframeOn = false;

function initSTLViewer() {
    buildSTLFileBrowser();
    
    if (stlViewerInitialized) {
        onSTLResize();
        return;
    }
    
    const container = document.getElementById('stl-viewer-container');
    if (!container || container.offsetWidth === 0) return;
    
    // Scene
    stlScene = new THREE.Scene();
    
    // Camera
    stlCamera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 2000);
    stlCamera.position.set(60, 60, 60);
    
    // Renderer
    stlRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    stlRenderer.setSize(container.offsetWidth, container.offsetHeight);
    stlRenderer.setPixelRatio(window.devicePixelRatio);
    stlRenderer.setClearColor(0x0a0f1e);
    container.innerHTML = '';
    container.appendChild(stlRenderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    stlScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 80, 50);
    stlScene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    backLight.position.set(-50, -30, -50);
    stlScene.add(backLight);
    
    // Grid
    const grid = new THREE.GridHelper(200, 20, 0x1e3a5f, 0x0d1b2a);
    stlScene.add(grid);
    
    // Orbit Controls
    stlControls = new THREE.OrbitControls(stlCamera, stlRenderer.domElement);
    stlControls.enableDamping = true;
    stlControls.dampingFactor = 0.08;
    stlControls.autoRotate = false;
    stlControls.autoRotateSpeed = 2;
    
    // Animate
    function animate() {
        stlAnimId = requestAnimationFrame(animate);
        stlControls.update();
        stlRenderer.render(stlScene, stlCamera);
    }
    animate();
    
    // Resize handler
    window.addEventListener('resize', onSTLResize);
    
    stlViewerInitialized = true;
}

function onSTLResize() {
    const container = document.getElementById('stl-viewer-container');
    if (!container || !stlRenderer) return;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0 || h === 0) return;
    stlCamera.aspect = w / h;
    stlCamera.updateProjectionMatrix();
    stlRenderer.setSize(w, h);
}

function buildSTLFileBrowser() {
    const browser = document.getElementById('stl-file-browser');
    if (!browser) return;
    browser.innerHTML = '';
    
    for (const [machineName, machineData] of Object.entries(stlCatalog)) {
        const folderGroup = document.createElement('div');
        folderGroup.className = 'stl-folder-group';
        
        const folderHeader = document.createElement('div');
        folderHeader.className = 'stl-folder-header';
        folderHeader.innerHTML = `<i class="fas fa-chevron-right"></i><i class="fas fa-folder"></i> ${machineName}`;
        
        const folderChildren = document.createElement('div');
        folderChildren.className = 'stl-folder-children';
        
        folderHeader.addEventListener('click', () => {
            folderHeader.classList.toggle('open');
            folderChildren.classList.toggle('open');
            const folderIcon = folderHeader.querySelectorAll('i')[1];
            folderIcon.className = folderChildren.classList.contains('open') ? 'fas fa-folder-open' : 'fas fa-folder';
        });
        
        for (const [partCategory, files] of Object.entries(machineData.parts)) {
            const subGroup = document.createElement('div');
            subGroup.className = 'stl-subfolder-group';
            
            const subHeader = document.createElement('div');
            subHeader.className = 'stl-subfolder-header';
            subHeader.innerHTML = `<i class="fas fa-folder"></i> ${partCategory}`;
            
            const subChildren = document.createElement('div');
            subChildren.className = 'stl-folder-children';
            
            subHeader.addEventListener('click', () => {
                subChildren.classList.toggle('open');
            });
            
            files.forEach(fileData => {
                const fileItem = document.createElement('div');
                fileItem.className = 'stl-file-item';
                fileItem.innerHTML = `<i class="fas fa-cube"></i> ${fileData.name}`;
                fileItem.addEventListener('click', () => {
                    document.querySelectorAll('.stl-file-item').forEach(el => el.classList.remove('active'));
                    fileItem.classList.add('active');
                    loadSTLFile(fileData, machineName, partCategory);
                });
                subChildren.appendChild(fileItem);
            });
            
            subGroup.appendChild(subHeader);
            subGroup.appendChild(subChildren);
            folderChildren.appendChild(subGroup);
        }
        
        folderGroup.appendChild(folderHeader);
        folderGroup.appendChild(folderChildren);
        browser.appendChild(folderGroup);
    }
}

function loadSTLFile(fileData, machineName, partCategory) {
    if (!stlScene) return;
    
    // Remove existing mesh
    if (stlCurrentMesh) {
        stlScene.remove(stlCurrentMesh);
        if (stlCurrentMesh.geometry) stlCurrentMesh.geometry.dispose();
        if (stlCurrentMesh.material) stlCurrentMesh.material.dispose();
    }
    
    // Hide placeholder
    const placeholder = document.getElementById('stl-placeholder');
    if (placeholder) placeholder.style.display = 'none';
    
    const loader = new THREE.STLLoader();
    loader.load(fileData.file, function(geometry) {
        geometry.computeBoundingBox();
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x06b6d4,
            specular: 0x222222,
            shininess: 60,
            flatShading: false,
            wireframe: stlWireframeOn
        });
        
        stlCurrentMesh = new THREE.Mesh(geometry, material);
        
        // Center the model
        const box = geometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        stlCurrentMesh.position.sub(center);
        
        // Scale to fit viewport nicely
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 40 / maxDim;
        stlCurrentMesh.scale.set(scale, scale, scale);
        
        stlScene.add(stlCurrentMesh);
        
        // Reset camera to fit model
        stlCamera.position.set(60, 50, 60);
        stlControls.target.set(0, 0, 0);
        stlControls.update();
        
        // Update info panel
        updateSTLInfo(geometry, fileData, machineName, partCategory);
        
    }, undefined, function(error) {
        console.error('Error loading STL:', error);
        alert('Gagal memuat file STL: ' + fileData.file);
    });
}

function updateSTLInfo(geometry, fileData, machineName, partCategory) {
    const infoPanel = document.getElementById('stl-info-panel');
    if (infoPanel) infoPanel.style.display = 'block';
    
    // File name
    document.getElementById('stl-info-name').textContent = fileData.name;
    document.getElementById('stl-info-machine').textContent = machineName;
    document.getElementById('stl-info-category').textContent = partCategory;
    
    // Triangle count
    const triCount = geometry.attributes.position.count / 3;
    document.getElementById('stl-info-triangles').textContent = triCount.toLocaleString();
    
    // Bounding box dimensions
    const box = geometry.boundingBox;
    const size = new THREE.Vector3();
    box.getSize(size);
    document.getElementById('stl-info-dimensions').textContent = 
        `${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)}`;
    
    // File size (estimate from buffer)
    const fileSize = 84 + (triCount * 50);
    if (fileSize > 1024 * 1024) {
        document.getElementById('stl-info-size').textContent = (fileSize / (1024*1024)).toFixed(2) + ' MB';
    } else {
        document.getElementById('stl-info-size').textContent = (fileSize / 1024).toFixed(1) + ' KB';
    }
    
    // Volume calculation (signed tetrahedron volume method)
    const positions = geometry.attributes.position.array;
    let volume = 0;
    let surfaceArea = 0;
    
    for (let i = 0; i < positions.length; i += 9) {
        const v1x = positions[i], v1y = positions[i+1], v1z = positions[i+2];
        const v2x = positions[i+3], v2y = positions[i+4], v2z = positions[i+5];
        const v3x = positions[i+6], v3y = positions[i+7], v3z = positions[i+8];
        
        // Signed volume of tetrahedron with origin
        volume += (v1x * (v2y * v3z - v3y * v2z) - v2x * (v1y * v3z - v3y * v1z) + v3x * (v1y * v2z - v2y * v1z));
        
        // Triangle area using cross product
        const ax = v2x - v1x, ay = v2y - v1y, az = v2z - v1z;
        const bx = v3x - v1x, by = v3y - v1y, bz = v3z - v1z;
        const cx = ay * bz - az * by;
        const cy = az * bx - ax * bz;
        const cz = ax * by - ay * bx;
        surfaceArea += Math.sqrt(cx*cx + cy*cy + cz*cz) * 0.5;
    }
    
    volume = Math.abs(volume / 6);
    // Convert mm³ to cm³
    document.getElementById('stl-info-volume').textContent = (volume / 1000).toFixed(2);
    // Convert mm² to cm²
    document.getElementById('stl-info-surface').textContent = (surfaceArea / 100).toFixed(2);
}

window.resetSTLCamera = function() {
    if (!stlCamera || !stlControls) return;
    stlCamera.position.set(60, 50, 60);
    stlControls.target.set(0, 0, 0);
    stlControls.update();
};

window.toggleSTLWireframe = function() {
    stlWireframeOn = !stlWireframeOn;
    if (stlCurrentMesh && stlCurrentMesh.material) {
        stlCurrentMesh.material.wireframe = stlWireframeOn;
    }
};

window.toggleSTLAutoRotate = function() {
    if (!stlControls) return;
    stlControls.autoRotate = !stlControls.autoRotate;
};