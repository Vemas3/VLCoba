// Variabel simulasi
let simulasiBerjalan = false;
let startTime = 0;
let timerInterval = null;

// Elemen DOM
const forceSelect = document.getElementById('forceSelect');
const human = document.getElementById('human');
const table = document.getElementById('table');
const muscleEffect = document.getElementById('muscleEffect');
const finishLine = document.getElementById('finishLine');
const currentForce = document.getElementById('currentForce');
const travelTime = document.getElementById('travelTime');
const muscleForce = document.getElementById('muscleForce');
const status = document.getElementById('status');

// Data kekuatan otot
const forceData = {
    lemah: {
        duration: 8000,
        force: 'Lemah',
        distance: 'calc(100% - 300px)',
        speed: 'Lambat',
        message: '💪 Daya lemah - Meja bergerak lambat! Butuh waktu lebih lama untuk mencapai finish.'
    },
    sedang: {
        duration: 5000,
        force: 'Sedang', 
        distance: 'calc(100% - 250px)',
        speed: 'Sedang',
        message: '💪💪 Daya sedang - Meja bergerak dengan kecepatan normal!'
    },
    kuat: {
        duration: 3000,
        force: 'Kuat',
        distance: 'calc(100% - 200px)',
        speed: 'Cepat',
        message: '💪💪💪 Daya kuat - Meja bergerak sangat cepat! Gaya otot yang kuat efektif menggerakkan benda.'
    }
};

// Fungsi ubah kekuatan
function ubahKekuatan() {
    const selectedForce = forceSelect.value;
    const force = forceData[selectedForce];
    
    // Reset posisi
    resetPosisi();
    
    // Update data display
    currentForce.textContent = force.force;
    muscleForce.textContent = force.speed;
    
    // Reset status
    resetData();
}

// Fungsi reset posisi
function resetPosisi() {
    // Reset posisi manusia
    human.style.left = '100px';
    human.style.transition = 'none';
    human.classList.remove('pushing');
    human.classList.add('ready');
    
    // Reset posisi meja
    table.style.left = '250px';
    table.style.transition = 'none';
    table.classList.remove('moving');
    
    // Reset efek otot
    muscleEffect.classList.remove('active');
}

// Fungsi mulai simulasi
function mulaiSimulasi() {
    if (simulasiBerjalan) return;
    
    simulasiBerjalan = true;
    status.textContent = 'Mendorong...';
    
    const selectedForce = forceSelect.value;
    const force = forceData[selectedForce];
    
    // Hentikan animasi standby
    human.classList.remove('ready');
    
    // Mulai timer
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
    
    // Aktifkan efek visual
    human.classList.add('pushing');
    table.classList.add('moving');
    muscleEffect.classList.add('active');
    
    // Animasikan pergerakan setelah delay kecil
    setTimeout(() => {
        human.style.transition = `left ${force.duration}ms ease-out`;
        human.style.left = force.distance;
        
        table.style.transition = `left ${force.duration}ms ease-out`;
        table.style.left = `calc(${force.distance} + 150px)`;
    }, 500);
    
    // Selesaikan simulasi setelah durasi
    setTimeout(() => {
        selesaikanSimulasi(force);
    }, force.duration + 600);
}

// Fungsi update timer
function updateTimer() {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) / 1000;
    travelTime.textContent = elapsed.toFixed(1) + ' detik';
}

// Fungsi selesaikan simulasi
function selesaikanSimulasi(force) {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    
    // Hentikan animasi
    human.classList.remove('pushing');
    table.classList.remove('moving');
    muscleEffect.classList.remove('active');
    
    status.textContent = 'Selesai';
    
    // Tampilkan hasil final
    const finalTime = (Date.now() - startTime) / 1000;
    travelTime.textContent = finalTime.toFixed(1) + ' detik';
    
    // Berikan feedback berdasarkan kekuatan
    setTimeout(() => {
        alert(force.message);
    }, 500);
}

// Fungsi reset simulasi
function resetSimulasi() {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    
    // Reset semua posisi dan efek
    resetPosisi();
    
    // Reset data
    resetData();
}

// Fungsi reset data
function resetData() {
    travelTime.textContent = '-';
    status.textContent = 'Siap';
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Set animasi standby
    human.classList.add('ready');
    
    // Set kekuatan default
    ubahKekuatan();
    
    // Event listener untuk tombol keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !simulasiBerjalan) {
            mulaiSimulasi();
        } else if (e.key === 'Escape') {
            resetSimulasi();
        }
    });
});