// ===============================
//   VARIABEL SIMULASI
// ===============================
let simulasiBerjalan = false;

const objectSelect = document.getElementById('objectSelect');
const pakuObject = document.getElementById('pakuObject');
const penghapusObject = document.getElementById('penghapusObject');
const magnet = document.getElementById('magnet');
const magneticField = document.getElementById('magneticField');
const currentObject = document.getElementById('currentObject');
const objectType = document.getElementById('objectType');
const magneticForce = document.getElementById('magneticForce');
const status = document.getElementById('status');

// posisi awal
const POSISI_MAGNET_AWAL = { left: 100, top: 300 };
const POSISI_PAKU_AWAL = { left: 420, top: 300 };
const POSISI_PENGHAPUS_AWAL = { left: 420, top: 300 };


// ===============================
//     UBAH BENDA
// ===============================
function ubahBenda() {
    const obj = objectSelect.value;

    resetPosisiBenda();

    if (obj === "paku") {
        pakuObject.style.display = "block";
        penghapusObject.style.display = "none";
        currentObject.textContent = "Paku";
        objectType.textContent = "Logam";
        magneticForce.textContent = "Akan Tertarik";
    } else {
        pakuObject.style.display = "none";
        penghapusObject.style.display = "block";
        currentObject.textContent = "Penghapus";
        objectType.textContent = "Non-Logam";
        magneticForce.textContent = "Tidak Tertarik";
    }

    resetData();
}


// ===============================
//     RESET POSISI
// ===============================
function resetPosisiBenda() {

    // Magnet
    magnet.style.left = POSISI_MAGNET_AWAL.left + "px";
    magnet.style.top = POSISI_MAGNET_AWAL.top + "px";
    magnet.classList.remove("active");

    // Paku
    pakuObject.style.left = POSISI_PAKU_AWAL.left + "px";
    pakuObject.style.top = POSISI_PAKU_AWAL.top + "px";
    pakuObject.style.transform = "none";
    pakuObject.classList.remove("attracted", "attached");

    // Penghapus
    penghapusObject.style.left = POSISI_PENGHAPUS_AWAL.left + "px";
    penghapusObject.style.top = POSISI_PENGHAPUS_AWAL.top + "px";
    penghapusObject.style.transform = "none";
    penghapusObject.classList.remove("attracted", "attached");

    magneticField.classList.remove("active");
}


// ===============================
//     SIMULASI MULAI
// ===============================
function mulaiSimulasi() {

    if (simulasiBerjalan) return;
    simulasiBerjalan = true;
    status.textContent = "Magnet Aktif...";

    const obj = objectSelect.value;

    if (obj === "paku") {
        tarikPakuKeKiri();
    } else {
        penghapusTidakTertarik();
    }
}


// ===============================
//      TARIKAN SUPER KE KIRI
// ===============================
function tarikPakuKeKiri() {

    magneticForce.textContent = "Menarik";
    magnet.classList.add("active");
    magneticField.classList.add("active");

    // Gunakan koordinat LEFT dan BOTTOM sesuai CSS kamu
    const magnetX = magnet.offsetLeft;
    const magnetBottom = parseFloat(getComputedStyle(magnet).bottom);

    const pakuWidth = pakuObject.offsetWidth;
    const magnetWidth = magnet.offsetWidth;

    // ================================
    //  POSISI AKHIR — SELALU KE KIRI
    // ================================
    const finalX = magnetX - pakuWidth + 10;   // Paku bergeser ke kiri magnet
    const finalBottom = magnetBottom + 20;     // sejajarkan vertikal

    // ANIMASI SUPER CEPAT
    pakuObject.style.transition =
        "left 0.22s cubic-bezier(0.8, 0, 1, 1), bottom 0.22s ease-out";

    setTimeout(() => {
        pakuObject.style.left = finalX + "px";
        pakuObject.style.bottom = finalBottom + "px";
    }, 20);

    setTimeout(() => {
        pakuObject.classList.add("attached");
        selesaikanSimulasi(true);
    }, 260);
}


// ===============================
//     PENGHAPUS TIDAK TERTARIK
// ===============================
function penghapusTidakTertarik() {
    magneticForce.textContent = "Tidak Menarik";
    magnet.classList.add("active");
    magneticField.classList.add("active");

    setTimeout(() => {
        penghapusObject.style.animation = "objectShake 0.4s ease-in-out 3";
    }, 200);

    setTimeout(() => {
        magneticField.classList.remove("active");
        magnet.classList.remove("active");
        selesaikanSimulasi(false);
    }, 1600);
}


// ===============================
//     SELESAIKAN
// ===============================
function selesaikanSimulasi(flag) {
    simulasiBerjalan = false;
    status.textContent = "Selesai";

    setTimeout(() => {
        if (flag) {
            alert("🎉 Paku tertarik kuat ke magnet!");
        } else {
            alert("❌ Penghapus tidak tertarik magnet.");
        }
    }, 300);
}


// ===============================
//     RESET DATA
// ===============================
function resetData() {
    magneticForce.textContent = "-";
    status.textContent = "Siap";
}


// ===============================
//     CSS ANIMASI GETAR
// ===============================
const style = document.createElement('style');
style.textContent = `
@keyframes objectShake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);


// ===============================
//     INIT APP
// ===============================
document.addEventListener("DOMContentLoaded", ubahBenda);
