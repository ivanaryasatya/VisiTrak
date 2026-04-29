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
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
}