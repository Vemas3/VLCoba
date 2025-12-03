// ==========================================
// UNIVERSAL DRAG + ZOOM (PC + HP)
// ==========================================
function makeDraggableZoomable(obj) {
    if (!obj) return;

    let scale = 1;
    let posX = 0, posY = 0;
    let startX = 0, startY = 0;
    let dragging = false;
    let initialDistance = 0;

    // DRAG MOUSE (Laptop/PC)
    obj.addEventListener("mousedown", (e) => {
        dragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        update();
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
    });

    // DRAG TOUCH (HP)
    obj.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            dragging = true;
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
        }
        else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialDistance = Math.sqrt(dx * dx + dy * dy);
        }
    });

    obj.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1 && dragging) {
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
            update();
        }
        else if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDistance = Math.sqrt(dx * dx + dy * dy);

            let newScale = scale * (newDistance / initialDistance);
            if (newScale < 0.3) newScale = 0.3;
            if (newScale > 3) newScale = 3;

            scale = newScale;
            update();
        }
    });

    obj.addEventListener("touchend", () => {
        dragging = false;
    });

    // ZOOM SCROLL (PC)
    obj.addEventListener("wheel", (e) => {
        e.preventDefault();
        scale += (e.deltaY < 0 ? 0.1 : -0.1);
        if (scale < 0.3) scale = 0.3;
        if (scale > 3) scale = 3;
        update();
    });

    function update() {
        obj.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        obj.style.transformOrigin = "center";
    }
}



// ===================================================
// KODE ASLI SIMULASI GAYA GESEK (TIDAK DIUBAH)
// ===================================================

// Variabel simulasi
let simulasiBerjalan = false;
let startTime = 0;
let timerInterval = null;

// Elemen DOM
const surfaceSelect = document.getElementById('surfaceSelect');
const aspalSurface = document.getElementById('aspalSurface');
const tanahSurface = document.getElementById('tanahSurface');
const mobil = document.getElementById('mobil');
const finishLine = document.getElementById('finishLine');
const currentSurface = document.getElementById('currentSurface');
const travelTime = document.getElementById('travelTime');
const frictionForce = document.getElementById('frictionForce');
const status = document.getElementById('status');

// Fungsi ubah permukaan
function ubahPermukaan() {
    const selectedSurface = surfaceSelect.value;

    mobil.style.left = '50px';
    mobil.style.transition = 'none';
    mobil.classList.remove('moving');

    if (selectedSurface === 'aspal') {
        aspalSurface.style.display = 'flex';
        tanahSurface.style.display = 'none';
        currentSurface.textContent = 'Aspal';
        frictionForce.textContent = 'Kecil';
    } else {
        aspalSurface.style.display = 'none';
        tanahSurface.style.display = 'flex';
        currentSurface.textContent = 'Tanah';
        frictionForce.textContent = 'Besar';
    }

    resetData();
}

// Mulai simulasi
function mulaiSimulasi() {
    if (simulasiBerjalan) return;

    simulasiBerjalan = true;
    status.textContent = 'Berjalan...';
    mobil.classList.add('moving');

    mobil.style.left = '50px';
    mobil.style.transition = 'none';

    const selectedSurface = surfaceSelect.value;
    let duration;

    if (selectedSurface === 'aspal') {
        duration = 3000;
    } else {
        duration = 12000;
    }

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);

    setTimeout(() => {
        mobil.style.transition = `left ${duration}ms linear`;
        mobil.style.left = 'calc(100% - 150px)';
    }, 100);

    setTimeout(() => {
        selesaikanSimulasi();
    }, duration + 100);
}

// Update timer
function updateTimer() {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) / 1000;
    travelTime.textContent = elapsed.toFixed(1) + ' detik';
}

// Selesaikan simulasi
function selesaikanSimulasi() {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    mobil.classList.remove('moving');
    status.textContent = 'Selesai';

    const selectedSurface = surfaceSelect.value;
    const finalTime = (Date.now() - startTime) / 1000;

    travelTime.textContent = finalTime.toFixed(1) + ' detik';

    setTimeout(() => {
        if (selectedSurface === 'aspal') {
            alert('🎉 Mobil sampai finish dengan cepat! Gaya gesek di aspal kecil.');
        } else {
            alert('🐢 Mobil sampai finish lebih lambat! Gaya gesek di tanah besar.');
        }
    }, 500);
}

// Reset simulasi
function resetSimulasi() {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    mobil.classList.remove('moving');

    mobil.style.left = '50px';
    mobil.style.transition = 'none';

    resetData();
}

// Reset data
function resetData() {
    travelTime.textContent = '-';
    status.textContent = 'Siap';
}



// ==========================================
// INISIALISASI
// ==========================================
document.addEventListener('DOMContentLoaded', function() {

    // Setup awal permukaan
    ubahPermukaan();

    // Aktifkan drag + zoom untuk semua objek visual
    makeDraggableZoomable(mobil);
    makeDraggableZoomable(aspalSurface);
    makeDraggableZoomable(tanahSurface);
    makeDraggableZoomable(finishLine);

});
