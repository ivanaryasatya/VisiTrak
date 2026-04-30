// ===================================================================
// VisiTrak Multi-Language System (i18n)
// ===================================================================

const TRANSLATIONS = {
    id: {
        // Sidebar
        'nav.dashboard': 'Dashboard',
        'nav.mesin': 'Mesin',
        'nav.pengaturan_mesin': 'Pengaturan Mesin',
        'nav.energi': 'Energi',
        'nav.ai_settings': 'AI Settings',
        'nav.laporan': 'Laporan',
        'nav.pemeliharaan': 'Pemeliharaan',
        'nav.log_alarm': 'Log Alarm',
        'nav.chat_global': 'Chat Global',
        'nav.pengaturan': 'Pengaturan',
        'nav.ai_cctv': 'AI CCTV Karyawan',
        'nav.3d_viewer': '3D Parts Viewer',

        // Header
        'header.title': 'Monitoring Otomatisasi Mesin',
        'header.ai_status': 'AI Auto Detect: Normal (Tidak ada anomali)',

        // Dashboard Overview
        'dash.overview': 'Overview',
        'dash.live_diag': 'Live Diagnostics',
        'dash.predictive': 'Predictive AI',
        'dash.avg_temp': 'Suhu Rata-rata',
        'dash.output_shift': 'Output Shift Ini',
        'dash.total_downtime': 'Total Downtime',
        'dash.oee': 'Efisiensi OEE',
        'dash.chart_title': 'Grafik Output vs Energi',
        'dash.control_panel': 'Controllable Panel',
        'dash.emergency_stop': 'EMERGENCY STOP ALL',
        'dash.ai_optimizer': 'Rekomendasi AI Optimizer',
        'dash.ai_saran': 'Saran:',
        'dash.ai_saran_text': 'Turunkan kecepatan CNC Alpha sebesar 3% dan naikkan kecepatan Conveyor A sebesar 5% untuk menghemat 7% energi harian tanpa mengurangi total output.',
        'dash.terapkan': 'Terapkan',
        'dash.abaikan': 'Abaikan',
        'dash.log_monitoring': 'Log Data Monitoring Real-time',
        'dash.th_tanggal': 'Tanggal',
        'dash.th_mesin': 'Mesin',
        'dash.th_line': 'Line',
        'dash.th_shift': 'Shift',
        'dash.th_output': 'Output Unit',
        'dash.th_downtime': 'Downtime Menit',
        'dash.th_energi': 'Energi kWh',
        'dash.th_suhu': 'Suhu Mesin',
        'dash.th_status': 'Status',

        // Live Diagnostics
        'diag.title': 'Advanced Sensor Telemetry (CNC Alpha)',
        'diag.tekanan': 'Tekanan Hidrolik (Psi)',
        'diag.vibrasi': 'Vibrasi Spindle (mm/s)',
        'diag.tinggi': 'Tinggi',
        'diag.motor_rpm': 'Motor RPM',
        'diag.pelumas': 'Kualitas Pelumas (%)',

        // Predictive AI
        'pred.title': 'VisiTrak AI: Prediksi Perawatan Mesin',
        'pred.desc': 'Sistem AI VisiTrak mendeteksi adanya pola anomali dan potensi kegagalan komponen dalam waktu dekat berdasarkan data historis dan getaran.',
        'pred.th_komponen': 'Komponen Berisiko',
        'pred.th_mesin': 'Mesin Terkait',
        'pred.th_estimasi': 'Estimasi Kegagalan',
        'pred.th_tindakan': 'Tindakan Sistem (Otomatis) / Rekomendasi',

        // Mesin
        'mesin.title': 'Daftar Mesin Terhubung',
        'mesin.live_telemetry': 'Live Telemetry Active',
        'mesin.suhu_spindle': 'Suhu Spindle',
        'mesin.vibrasi': 'Vibrasi',
        'mesin.kecepatan': 'Kecepatan',
        'mesin.oee_live': 'OEE Live',
        'mesin.override_speed': 'Override Kecepatan:',
        'mesin.tekanan_coolant': 'Tekanan Coolant',
        'mesin.pompa_coolant': 'Pompa Coolant Utama:',

        // Pengaturan Mesin
        'setmesin.title': 'Pengaturan Konfigurasi Mesin',
        'setmesin.desc': 'Kelola parameter, batas alarm, dan konektivitas IoT untuk setiap mesin.',
        'setmesin.pilih': 'Pilih Mesin untuk Dikonfigurasi:',
        'setmesin.param_title': 'Parameter Operasional Dasar',
        'setmesin.max_rpm': 'Max Default RPM:',
        'setmesin.target_coolant': 'Target Tekanan Coolant (Bar):',
        'setmesin.mode_operasi': 'Mode Operasi Default:',
        'setmesin.alarm_title': 'Batas Toleransi & Alarm',
        'setmesin.batas_suhu': 'Batas Suhu Kritis (°C):',
        'setmesin.batas_vibrasi': 'Batas Vibrasi (mm/s):',
        'setmesin.tindakan_kritis': 'Tindakan Jika Kritis:',
        'setmesin.iot_title': 'Konektivitas IoT & Sensor',
        'setmesin.ip_plc': 'IP Address PLC:',
        'setmesin.polling': 'Polling Rate Sensor (ms):',
        'setmesin.reset': 'Reset Default',
        'setmesin.simpan': 'Simpan Pengaturan',

        // Energi
        'energi.title': 'Monitoring Energi Terpusat',
        'energi.konsumsi': 'Konsumsi Saat Ini',
        'energi.biaya': 'Estimasi Biaya Harian',
        'energi.pue': 'Efisiensi Daya (PUE)',
        'energi.trend': 'Trend Konsumsi Energi Mingguan',
        'energi.distribusi': 'Distribusi Beban Fasilitas',

        // AI Settings
        'ai.title': 'Konfigurasi Artificial Intelligence',
        'ai.anomali_title': 'Engine Deteksi Anomali',
        'ai.anomali_desc': 'Model machine learning mendeteksi getaran dan suhu tidak wajar berdasarkan data historis.',
        'ai.status_engine': 'Status Engine',
        'ai.sensitivitas': 'Sensitivitas Prediksi Anomali:',
        'ai.chatbot_title': 'Azure OpenAI Integrasi Chatbot',
        'ai.chatbot_desc': 'Pengaturan koneksi API untuk asisten pintar VisiTrak.',
        'ai.model_llm': 'Model LLM yang Digunakan:',
        'ai.test_conn': 'Test Connection',

        // Laporan
        'laporan.title': 'Laporan Produksi & Efisiensi',
        'laporan.rekap': 'Rekapitulasi OEE Mingguan',
        'laporan.th_tanggal': 'Tanggal',
        'laporan.th_line': 'Line Produksi',
        'laporan.th_output': 'Total Output',
        'laporan.th_target': 'Target Output',
        'laporan.th_defect': 'Defect Rate',
        'laporan.th_oee': 'Nilai OEE',

        // Pemeliharaan
        'maint.title': 'Work Orders (Pemeliharaan)',
        'maint.desc': 'Manajemen tugas perbaikan mesin untuk teknisi.',
        'maint.todo': 'To Do',
        'maint.progress': 'In Progress',
        'maint.done': 'Done',

        // Alarm
        'alarm.title': 'Riwayat Alarm & Notifikasi',
        'alarm.th_waktu': 'Waktu Kejadian',
        'alarm.th_level': 'Level',
        'alarm.th_sumber': 'Sumber',
        'alarm.th_pesan': 'Pesan Alarm',
        'alarm.th_analisis': 'Analisis AI (RCA)',
        'alarm.th_tindakan': 'Tindakan Sistem',

        // Chat
        'chat.title': 'Forum Komunikasi Global',
        'chat.desc': 'Diskusikan status operasional secara real-time dengan seluruh tim.',
        'chat.clear': 'Bersihkan Semua Chat',
        'chat.placeholder': 'Ketik pesan...',

        // Pengaturan
        'settings.title': 'Pengaturan Sistem & Pengguna',
        'settings.profil': 'Profil & Akses',
        'settings.nama': 'Nama Pengguna:',
        'settings.role': 'Role / Peran:',
        'settings.preferensi': 'Preferensi Global',
        'settings.dark_mode': 'Mode Gelap (Dark Mode)',
        'settings.sms_alert': 'Kirim SMS Alert (Kritis)',
        'settings.bahasa': 'Bahasa / Language',
        'settings.admin_panel': 'Panel Administrator - Manajemen Pengguna',
        'settings.auto_approve': 'Auto-Approve Pengguna Baru (Firebase)',
        'settings.auto_approve_desc': 'Jika aktif, pengguna yang login dengan Google otomatis disetujui tanpa perlu izin admin.',
        'settings.th_nama': 'Nama',
        'settings.th_email': 'Email',
        'settings.th_role': 'Role',
        'settings.th_status': 'Status Persetujuan',
        'settings.th_aksi': 'Aksi',

        // CCTV
        'cctv.title': 'AI CCTV Karyawan',
        'cctv.live': 'Live Monitoring Active',
        'cctv.aktifkan': 'Aktifkan Kamera',
        'cctv.matikan': 'Matikan Kamera',
        'cctv.statistik': 'Statistik Deteksi',
        'cctv.bekerja': 'Bekerja:',
        'cctv.istirahat': 'Istirahat:',
        'cctv.main_hp': 'Main Handphone:',
        'cctv.log_title': 'Log Deteksi Pelanggaran',

        // 3D Viewer
        'stl.title': '3D Industrial Parts Viewer',
        'stl.desc': 'Lihat dan inspeksi model 3D komponen mesin pabrik secara interaktif.',
        'stl.katalog': 'Katalog Komponen',
        'stl.placeholder': 'Pilih file STL dari katalog untuk preview 3D',
        'stl.placeholder_hint': 'Gunakan mouse untuk rotate, scroll untuk zoom',
        'stl.info_title': 'Informasi Komponen',
        'stl.nama_file': 'Nama File',
        'stl.mesin': 'Mesin',
        'stl.kategori': 'Kategori Part',
        'stl.triangles': 'Jumlah Triangles',
        'stl.dimensi': 'Dimensi (mm)',
        'stl.ukuran': 'Ukuran File',

        // Chatbot Widget
        'bot.greeting': 'Halo! Saya asisten AI Anda. Saat ini saya berjalan dalam mode UI dasar. Integrasi Azure AI akan segera hadir. Ada yang bisa dibantu terkait status mesin?',
        'bot.placeholder': 'Tanyakan anomali mesin...',

        // Profile Modal
        'profile.title': 'Profil Pengguna',
        'profile.nama': 'Nama Lengkap',
        'profile.role': 'Peran / Role',
        'profile.email': 'Email',
        'profile.dept': 'Departemen',
        'profile.status': 'Status Akun',
        'profile.logout': 'Keluar (Logout)',
    },

    en: {
        'nav.dashboard': 'Dashboard',
        'nav.mesin': 'Machines',
        'nav.pengaturan_mesin': 'Machine Settings',
        'nav.energi': 'Energy',
        'nav.ai_settings': 'AI Settings',
        'nav.laporan': 'Reports',
        'nav.pemeliharaan': 'Maintenance',
        'nav.log_alarm': 'Alarm Log',
        'nav.chat_global': 'Global Chat',
        'nav.pengaturan': 'Settings',
        'nav.ai_cctv': 'AI CCTV Employee',
        'nav.3d_viewer': '3D Parts Viewer',

        'header.title': 'Machine Automation Monitoring',
        'header.ai_status': 'AI Auto Detect: Normal (No anomalies)',

        'dash.overview': 'Overview',
        'dash.live_diag': 'Live Diagnostics',
        'dash.predictive': 'Predictive AI',
        'dash.avg_temp': 'Average Temperature',
        'dash.output_shift': 'Shift Output',
        'dash.total_downtime': 'Total Downtime',
        'dash.oee': 'OEE Efficiency',
        'dash.chart_title': 'Output vs Energy Chart',
        'dash.control_panel': 'Controllable Panel',
        'dash.emergency_stop': 'EMERGENCY STOP ALL',
        'dash.ai_optimizer': 'AI Optimizer Recommendation',
        'dash.ai_saran': 'Suggestion:',
        'dash.ai_saran_text': 'Reduce CNC Alpha speed by 3% and increase Conveyor A speed by 5% to save 7% daily energy without reducing total output.',
        'dash.terapkan': 'Apply',
        'dash.abaikan': 'Dismiss',
        'dash.log_monitoring': 'Real-time Monitoring Data Log',
        'dash.th_tanggal': 'Date',
        'dash.th_mesin': 'Machine',
        'dash.th_line': 'Line',
        'dash.th_shift': 'Shift',
        'dash.th_output': 'Output Units',
        'dash.th_downtime': 'Downtime Min',
        'dash.th_energi': 'Energy kWh',
        'dash.th_suhu': 'Machine Temp',
        'dash.th_status': 'Status',

        'diag.title': 'Advanced Sensor Telemetry (CNC Alpha)',
        'diag.tekanan': 'Hydraulic Pressure (Psi)',
        'diag.vibrasi': 'Spindle Vibration (mm/s)',
        'diag.tinggi': 'High',
        'diag.motor_rpm': 'Motor RPM',
        'diag.pelumas': 'Lubricant Quality (%)',

        'pred.title': 'VisiTrak AI: Machine Maintenance Prediction',
        'pred.desc': 'VisiTrak AI system detects anomaly patterns and potential component failure in the near future based on historical data and vibration.',
        'pred.th_komponen': 'At-Risk Component',
        'pred.th_mesin': 'Related Machine',
        'pred.th_estimasi': 'Failure Estimate',
        'pred.th_tindakan': 'System Action (Auto) / Recommendation',

        'mesin.title': 'Connected Machine List',
        'mesin.live_telemetry': 'Live Telemetry Active',
        'mesin.suhu_spindle': 'Spindle Temp',
        'mesin.vibrasi': 'Vibration',
        'mesin.kecepatan': 'Speed',
        'mesin.oee_live': 'OEE Live',
        'mesin.override_speed': 'Speed Override:',
        'mesin.tekanan_coolant': 'Coolant Pressure',
        'mesin.pompa_coolant': 'Main Coolant Pump:',

        'setmesin.title': 'Machine Configuration Settings',
        'setmesin.desc': 'Manage parameters, alarm limits, and IoT connectivity for each machine.',
        'setmesin.pilih': 'Select Machine to Configure:',
        'setmesin.param_title': 'Basic Operational Parameters',
        'setmesin.max_rpm': 'Max Default RPM:',
        'setmesin.target_coolant': 'Target Coolant Pressure (Bar):',
        'setmesin.mode_operasi': 'Default Operating Mode:',
        'setmesin.alarm_title': 'Tolerance & Alarm Limits',
        'setmesin.batas_suhu': 'Critical Temperature Limit (°C):',
        'setmesin.batas_vibrasi': 'Vibration Limit (mm/s):',
        'setmesin.tindakan_kritis': 'Action If Critical:',
        'setmesin.iot_title': 'IoT & Sensor Connectivity',
        'setmesin.ip_plc': 'PLC IP Address:',
        'setmesin.polling': 'Sensor Polling Rate (ms):',
        'setmesin.reset': 'Reset Default',
        'setmesin.simpan': 'Save Settings',

        'energi.title': 'Centralized Energy Monitoring',
        'energi.konsumsi': 'Current Consumption',
        'energi.biaya': 'Estimated Daily Cost',
        'energi.pue': 'Power Efficiency (PUE)',
        'energi.trend': 'Weekly Energy Consumption Trend',
        'energi.distribusi': 'Facility Load Distribution',

        'ai.title': 'Artificial Intelligence Configuration',
        'ai.anomali_title': 'Anomaly Detection Engine',
        'ai.anomali_desc': 'Machine learning model detects abnormal vibration and temperature based on historical data.',
        'ai.status_engine': 'Engine Status',
        'ai.sensitivitas': 'Anomaly Prediction Sensitivity:',
        'ai.chatbot_title': 'Azure OpenAI Chatbot Integration',
        'ai.chatbot_desc': 'API connection settings for VisiTrak smart assistant.',
        'ai.model_llm': 'LLM Model Used:',
        'ai.test_conn': 'Test Connection',

        'laporan.title': 'Production & Efficiency Reports',
        'laporan.rekap': 'Weekly OEE Recap',
        'laporan.th_tanggal': 'Date',
        'laporan.th_line': 'Production Line',
        'laporan.th_output': 'Total Output',
        'laporan.th_target': 'Target Output',
        'laporan.th_defect': 'Defect Rate',
        'laporan.th_oee': 'OEE Value',

        'maint.title': 'Work Orders (Maintenance)',
        'maint.desc': 'Machine repair task management for technicians.',
        'maint.todo': 'To Do',
        'maint.progress': 'In Progress',
        'maint.done': 'Done',

        'alarm.title': 'Alarm & Notification History',
        'alarm.th_waktu': 'Event Time',
        'alarm.th_level': 'Level',
        'alarm.th_sumber': 'Source',
        'alarm.th_pesan': 'Alarm Message',
        'alarm.th_analisis': 'AI Analysis (RCA)',
        'alarm.th_tindakan': 'System Action',

        'chat.title': 'Global Communication Forum',
        'chat.desc': 'Discuss operational status in real-time with the entire team.',
        'chat.clear': 'Clear All Chat',
        'chat.placeholder': 'Type a message...',

        'settings.title': 'System & User Settings',
        'settings.profil': 'Profile & Access',
        'settings.nama': 'Username:',
        'settings.role': 'Role:',
        'settings.preferensi': 'Global Preferences',
        'settings.dark_mode': 'Dark Mode',
        'settings.sms_alert': 'Send SMS Alert (Critical)',
        'settings.bahasa': 'Language',
        'settings.admin_panel': 'Administrator Panel - User Management',
        'settings.auto_approve': 'Auto-Approve New Users (Firebase)',
        'settings.auto_approve_desc': 'If active, users who login with Google are automatically approved without admin permission.',
        'settings.th_nama': 'Name',
        'settings.th_email': 'Email',
        'settings.th_role': 'Role',
        'settings.th_status': 'Approval Status',
        'settings.th_aksi': 'Action',

        'cctv.title': 'AI Employee CCTV',
        'cctv.live': 'Live Monitoring Active',
        'cctv.aktifkan': 'Enable Camera',
        'cctv.matikan': 'Disable Camera',
        'cctv.statistik': 'Detection Statistics',
        'cctv.bekerja': 'Working:',
        'cctv.istirahat': 'Resting:',
        'cctv.main_hp': 'Using Phone:',
        'cctv.log_title': 'Violation Detection Log',

        'stl.title': '3D Industrial Parts Viewer',
        'stl.desc': 'View and inspect 3D models of factory machine components interactively.',
        'stl.katalog': 'Component Catalog',
        'stl.placeholder': 'Select an STL file from catalog for 3D preview',
        'stl.placeholder_hint': 'Use mouse to rotate, scroll to zoom',
        'stl.info_title': 'Component Information',
        'stl.nama_file': 'File Name',
        'stl.mesin': 'Machine',
        'stl.kategori': 'Part Category',
        'stl.triangles': 'Triangle Count',
        'stl.dimensi': 'Dimensions (mm)',
        'stl.ukuran': 'File Size',

        'bot.greeting': 'Hello! I am your AI assistant. Currently running in basic UI mode. Azure AI integration coming soon. Need help with machine status?',
        'bot.placeholder': 'Ask about machine anomalies...',

        'profile.title': 'User Profile',
        'profile.nama': 'Full Name',
        'profile.role': 'Role',
        'profile.email': 'Email',
        'profile.dept': 'Department',
        'profile.status': 'Account Status',
        'profile.logout': 'Logout',
    },

    zh: {
        'nav.dashboard': '仪表板',
        'nav.mesin': '机器',
        'nav.pengaturan_mesin': '机器设置',
        'nav.energi': '能源',
        'nav.ai_settings': 'AI 设置',
        'nav.laporan': '报告',
        'nav.pemeliharaan': '维护',
        'nav.log_alarm': '报警日志',
        'nav.chat_global': '全球聊天',
        'nav.pengaturan': '设置',
        'nav.ai_cctv': 'AI 员工监控',
        'nav.3d_viewer': '3D 零件查看器',
        'header.title': '机器自动化监控',
        'header.ai_status': 'AI 自动检测：正常（无异常）',
        'dash.overview': '概述',
        'dash.live_diag': '实时诊断',
        'dash.predictive': '预测 AI',
        'dash.avg_temp': '平均温度',
        'dash.output_shift': '班次产出',
        'dash.total_downtime': '停机总时间',
        'dash.oee': 'OEE 效率',
        'dash.chart_title': '产出 vs 能耗图表',
        'dash.control_panel': '控制面板',
        'dash.emergency_stop': '紧急停止全部',
        'dash.ai_optimizer': 'AI 优化建议',
        'dash.terapkan': '应用',
        'dash.abaikan': '忽略',
        'dash.log_monitoring': '实时监控数据日志',
        'settings.title': '系统和用户设置',
        'settings.preferensi': '全局偏好',
        'settings.dark_mode': '深色模式',
        'settings.bahasa': '语言',
        'chat.title': '全球通讯论坛',
        'chat.placeholder': '输入消息...',
        'cctv.title': 'AI 员工监控摄像头',
        'stl.title': '3D 工业零件查看器',
        'profile.logout': '退出',
    },

    ja: {
        'nav.dashboard': 'ダッシュボード',
        'nav.mesin': '機械',
        'nav.pengaturan_mesin': '機械設定',
        'nav.energi': 'エネルギー',
        'nav.ai_settings': 'AI設定',
        'nav.laporan': 'レポート',
        'nav.pemeliharaan': 'メンテナンス',
        'nav.log_alarm': 'アラームログ',
        'nav.chat_global': 'グローバルチャット',
        'nav.pengaturan': '設定',
        'nav.ai_cctv': 'AI従業員監視',
        'nav.3d_viewer': '3Dパーツビューア',
        'header.title': '機械自動化モニタリング',
        'header.ai_status': 'AI自動検出：正常（異常なし）',
        'dash.overview': '概要',
        'dash.live_diag': 'ライブ診断',
        'dash.predictive': '予測AI',
        'dash.avg_temp': '平均温度',
        'dash.output_shift': 'シフト出力',
        'dash.total_downtime': 'ダウンタイム合計',
        'dash.oee': 'OEE効率',
        'dash.chart_title': '出力 vs エネルギーチャート',
        'dash.control_panel': '制御パネル',
        'dash.emergency_stop': '緊急全停止',
        'dash.terapkan': '適用',
        'dash.abaikan': '無視',
        'settings.title': 'システム・ユーザー設定',
        'settings.preferensi': 'グローバル設定',
        'settings.dark_mode': 'ダークモード',
        'settings.bahasa': '言語',
        'chat.title': 'グローバルフォーラム',
        'chat.placeholder': 'メッセージを入力...',
        'cctv.title': 'AI従業員CCTV',
        'stl.title': '3D工業パーツビューア',
        'profile.logout': 'ログアウト',
    }
};

// Fallback: if key not found in selected lang, fallback to 'id' then 'en'
function t(key) {
    const lang = window.currentLang || 'id';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['id']?.[key] || TRANSLATIONS['en']?.[key] || key;
}

function applyLanguage(lang) {
    window.currentLang = lang;
    localStorage.setItem('visitrak-lang', lang);

    // Apply to all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translated;
        } else {
            // Preserve child elements (like <i> icons)
            const icon = el.querySelector('i.fas, i.far, i.fab');
            if (icon) {
                el.textContent = '';
                el.appendChild(icon);
                el.append(' ' + translated);
            } else {
                el.textContent = translated;
            }
        }
    });
}

// Initialize language on load
(function initLanguage() {
    const saved = localStorage.getItem('visitrak-lang') || 'id';
    window.currentLang = saved;
    // Apply after DOM is ready
    function doInit() {
        applyLanguage(saved);
        // Sync dropdown selector
        const selector = document.getElementById('lang-selector');
        if (selector) selector.value = saved;
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doInit);
    } else {
        setTimeout(doInit, 150);
    }
})();
