document.addEventListener("DOMContentLoaded", () => {
    initChart();
    
    // Enter key listener untuk chatbot
    document.getElementById("chat-input").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});

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

function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.value.trim();
    
    if (messageText === "") return;

    // 1. Tambahkan pesan user ke UI
    addMessageToChat(messageText, 'user-message');
    input.value = '';

    // 2. Simulasi delay dan balasan dari "AI" (karena API Azure belum dipasang)
    setTimeout(() => {
        const dummyResponse = "Terima kasih atas pertanyaannya. Saat ini saya masih dalam mode simulasi UI. Modul integrasi ke Microsoft Azure AI akan dipasang di tahap berikutnya.";
        addMessageToChat(dummyResponse, 'ai-message');
    }, 1000);
}

function addMessageToChat(text, className) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll ke bawah
    chatMessages.scrollTop = chatMessages.scrollHeight;
}