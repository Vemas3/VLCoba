// Script untuk navigasi materi
const babUrutan = ['pengertian', 'gaya-gesek', 'gaya-magnet', 'gaya-pegas', 'gaya-otot', 'gaya-gravitasi', 'kuis'];
let babSekarang = 0;

function bukaBab(babId) {
    // Sembunyikan semua bab
    document.querySelectorAll('.bab').forEach(bab => {
        bab.classList.remove('active');
    });
    
    // Tampilkan bab yang dipilih
    document.getElementById(babId).classList.add('active');
    
    // Update tombol navigasi aktif
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.nav-btn[onclick="bukaBab('${babId}')"]`).classList.add('active');
    
    // Update index bab sekarang
    babSekarang = babUrutan.indexOf(babId);
    
    // Scroll ke atas
    window.scrollTo(0, 0);
}

function babSebelumnya() {
    if (babSekarang > 0) {
        babSekarang--;
        bukaBab(babUrutan[babSekarang]);
    }
}

function babBerikutnya() {
    if (babSekarang < babUrutan.length - 1) {
        babSekarang++;
        bukaBab(babUrutan[babSekarang]);
    }
}

// Script untuk kuis
let skor = 0;
const jawabanBenar = {
    1: 'B',
    2: 'B', 
    3: 'B',
    4: 'C',
    5: 'B'
};

function jawabKuis(soalNomor, pilihan) {
    const tombol = event.target;
    const semuaTombol = tombol.parentElement.querySelectorAll('.option-btn');
    
    // Reset semua tombol
    semuaTombol.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // Cek jawaban
    if (pilihan === jawabanBenar[soalNomor]) {
        tombol.classList.add('correct');
        skor++;
        document.getElementById('score').textContent = skor;
    } else {
        tombol.classList.add('wrong');
        // Tampilkan jawaban yang benar
        semuaTombol.forEach(btn => {
            if (btn.textContent.includes(jawabanBenar[soalNomor])) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Nonaktifkan tombol setelah menjawab
    semuaTombol.forEach(btn => {
        btn.disabled = true;
    });
}

function resetKuis() {
    skor = 0;
    document.getElementById('score').textContent = skor;
    
    // Reset semua tombol kuis
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    bukaBab('pengertian');
});