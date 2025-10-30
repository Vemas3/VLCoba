// Variabel simulasi
let simulasiBerjalan = false;

// Elemen DOM
const objectSelect = document.getElementById('objectSelect');
const pakuObject = document.getElementById('pakuObject');
const penghapusObject = document.getElementById('penghapusObject');
const magnet = document.getElementById('magnet');
const magneticField = document.getElementById('magneticField');
const currentObject = document.getElementById('currentObject');
const objectType = document.getElementById('objectType');
const magneticForce = document.getElementById('magneticForce');
const status = document.getElementById('status');

// Fungsi ubah benda
function ubahBenda() {
    const selectedObject = objectSelect.value;
    
    // Reset posisi semua benda
    resetPosisiBenda();
    
    // Tampilkan benda yang dipilih
    if (selectedObject === 'paku') {
        pakuObject.style.display = 'block';
        penghapusObject.style.display = 'none';
        currentObject.textContent = 'Paku';
        objectType.textContent = 'Benda Logam';
        magneticForce.textContent = 'Akan Tertarik';
    } else {
        pakuObject.style.display = 'none';
        penghapusObject.style.display = 'block';
        currentObject.textContent = 'Penghapus';
        objectType.textContent = 'Benda Non-Logam';
        magneticForce.textContent = 'Tidak Tertarik';
    }
    
    // Reset status
    resetData();
}

// Fungsi reset posisi benda
function resetPosisiBenda() {
    pakuObject.style.transform = 'translateX(0) rotate(0deg)';
    pakuObject.style.bottom = '100px';
    pakuObject.classList.remove('attracted');
    
    penghapusObject.style.transform = 'translateX(0) rotate(0deg)';
    penghapusObject.style.bottom = '100px';
    penghapusObject.classList.remove('attracted');
    
    magnet.classList.remove('active');
    magneticField.classList.remove('active');
}

// Fungsi mulai simulasi
function mulaiSimulasi() {
    if (simulasiBerjalan) return;
    
    simulasiBerjalan = true;
    status.textContent = 'Magnet Aktif...';
    
    // Aktifkan efek magnet
    magnet.classList.add('active');
    magneticField.classList.add('active');
    
    const selectedObject = objectSelect.value;
    const currentObjectElement = selectedObject === 'paku' ? pakuObject : penghapusObject;
    
    if (selectedObject === 'paku') {
        // Magnet menarik paku
        magneticForce.textContent = 'Menarik';
        
        setTimeout(() => {
            currentObjectElement.classList.add('attracted');
        }, 500);
        
        // Selesaikan simulasi setelah animasi
        setTimeout(() => {
            selesaikanSimulasi(true);
        }, 2500);
        
    } else {
        // Magnet tidak menarik penghapus
        magneticForce.textContent = 'Tidak Menarik';
        
        // Efek getar untuk menunjukkan tidak tertarik
        setTimeout(() => {
            currentObjectElement.style.animation = 'objectShake 0.5s ease-in-out';
        }, 500);
        
        // Selesaikan simulasi
        setTimeout(() => {
            selesaikanSimulasi(false);
        }, 2000);
    }
}

// Fungsi selesaikan simulasi
function selesaikanSimulasi(tertarik) {
    simulasiBerjalan = false;
    status.textContent = 'Selesai';
    
    // Berikan feedback berdasarkan hasil
    setTimeout(() => {
        if (tertarik) {
            alert('🎉 Magnet berhasil menarik paku! Paku terbuat dari besi yang bersifat magnetis.');
        } else {
            alert('❌ Magnet tidak menarik penghapus! Penghapus terbuat dari karet yang tidak bersifat magnetis.');
        }
    }, 500);
}

// Fungsi reset simulasi
function resetSimulasi() {
    simulasiBerjalan = false;
    
    // Reset semua posisi dan efek
    resetPosisiBenda();
    
    // Reset data
    resetData();
}

// Fungsi reset data
function resetData() {
    magneticForce.textContent = '-';
    status.textContent = 'Siap';
}

// CSS untuk efek getar (ditambahkan via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes objectShake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-5px) rotate(-2deg); }
        75% { transform: translateX(5px) rotate(2deg); }
    }
`;
document.head.appendChild(style);

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    ubahBenda(); // Set benda default
});