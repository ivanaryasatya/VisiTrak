// --- Inisialisasi Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyBR4o2yQpnEWglZWaIrF0RMsemwKMe2wtM",
    authDomain: "visitrak-83353.firebaseapp.com",
    databaseURL: "https://visitrak-83353-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "visitrak-83353",
    storageBucket: "visitrak-83353.firebasestorage.app",
    messagingSenderId: "610189188757",
    appId: "1:610189188757:web:665d5f60c04f3bf519c59c",
    measurementId: "G-NM90818W43"
  };

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

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
    else if (viewId === 'view-chat') pageTitle.innerText = "Forum Komunikasi Global";
    else if (viewId === 'view-pengaturan') pageTitle.innerText = "Pengaturan Sistem";
    else if (viewId === 'view-qc') pageTitle.innerText = "Visual Quality Control (AI)";
    
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
            container.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                renderGlobalMessage(doc.id, data, container);
            });
            // Auto-scroll ke bawah saat ada pesan baru
            container.scrollTop = container.scrollHeight;
        });
}

function renderGlobalMessage(msgId, data, container) {
    const currentUserUid = sessionStorage.getItem('userUid');
    const isAdmin = sessionStorage.getItem('userRole') === 'admin';
    const isOwn = data.senderUid === currentUserUid;

    const wrapper = document.createElement('div');
    wrapper.className = `global-chat-wrapper ${isOwn ? 'own' : 'other'}`;

    // Format Waktu
    let timeStr = 'Sedang mengirim...';
    if (data.timestamp) {
        const date = data.timestamp.toDate();
        timeStr = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    }

    // Meta Info (Nama & Waktu)
    const metaHtml = `<div class="global-chat-meta">${isOwn ? 'Anda' : data.senderName} • ${timeStr}</div>`;

    // Tombol Aksi (Hanya Hapus)
    let actionBtns = `<div style="position: relative; display: flex; align-items: center;">`;
    if (isAdmin || isOwn) {
        actionBtns += `<button class="chat-action-btn" onclick="deleteGlobalMessage('${msgId}')" title="Hapus Pesan"><i class="fas fa-trash"></i></button>`;
    }
    actionBtns += `</div>`;

    wrapper.innerHTML = `
        ${metaHtml}
        <div style="display: flex; align-items: flex-start; gap: 5px; flex-direction: ${isOwn ? 'row-reverse' : 'row'};">
            <div class="global-chat-bubble ${isOwn ? 'own' : 'other'}">${data.text}</div>
            ${actionBtns}
        </div>
    `;
    container.appendChild(wrapper);
}

window.sendGlobalMessage = async function() {
    const input = document.getElementById('global-chat-input');
    const text = input.value.trim();
    if (!text || !db) return;
    
    const userUid = sessionStorage.getItem('userUid');
    const userName = sessionStorage.getItem('userName');
    input.value = '';
    
    try {
        await db.collection('global_chats').add({
            text: text,
            senderUid: userUid,
            senderName: userName || 'Anonim',
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