// ===================================================
// UNIVERSAL DRAG + ZOOM SUPPORT (PC + HP)
// ===================================================
function makeDraggableZoomable(obj) {
    if (!obj) return;

    let scale = 1;
    let posX = 0, posY = 0;
    let startX = 0, startY = 0;
    let dragging = false;
    let initialDistance = 0;

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

    document.addEventListener("mouseup", () => dragging = false);

    obj.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            dragging = true;
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
        } else if (e.touches.length === 2) {
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
        } else if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;

            let newScale = scale * (Math.sqrt(dx * dx + dy * dy) / initialDistance);
            if (newScale < 0.3) newScale = 0.3;
            if (newScale > 3) newScale = 3;

            scale = newScale;
            update();
        }
    });

    obj.addEventListener("touchend", () => dragging = false);

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
// SCRIPT ASLI SIMULASI GRAVITASI (TIDAK DIUBAH)
// ===================================================

let simulasiBerjalan = false;
let startTime = 0;
let timerInterval = null;

const fruitSelect = document.getElementById('fruitSelect');
const treeContainer = document.getElementById('treeContainer');
const tree = document.getElementById('tree');
const gravityEffect = document.getElementById('gravityEffect');
const currentFruit = document.getElementById('currentFruit');
const fallTime = document.getElementById('fallTime');
const gravityForce = document.getElementById('gravityForce');
const status = document.getElementById('status');

// Data buah
const fruitData = {
    apel: { name: 'Apel 🍎', color: '#ff4444', fallSpeed: 1.8, message: '🍎 Apel jatuh karena gravitasi!' },
    jeruk: { name: 'Jeruk 🍊', color: '#ff8800', fallSpeed: 1.6, message: '🍊 Jeruk jatuh ke tanah!' },
    mangga: { name: 'Mangga 🥭', color: '#ffcc00', fallSpeed: 2.0, message: '🥭 Mangga jatuh lebih cepat!' },
    semua: { name: 'Semua Buah', color: 'mixed', fallSpeed: 1.7, message: '🌳 Semua buah jatuh bersama!' }
};

// Posisi buah
const fruitPositions = [
    { top: '10%', left: '45%' },
    { top: '15%', left: '60%' },
    { top: '13%', left: '35%' },
    { top: '20%', left: '65%' },
    { top: '20%', left: '25%' },
    { top: '25%', left: '55%' },
    { top: '26%', left: '35%' }
];


// Buat pohon PNG
function buatPohonGambar() {
    const img = document.createElement('img');
    img.src = 'asset/pohon.png';
    img.alt = 'Pohon';
    img.classList.add('tree-image');
    img.style.objectPosition = 'bottom';
    return img;
}



// ===================================================
// ✨ Tambahan: ikon apel PNG di pohon
// ===================================================
function tambahIkonApel(left, top) {
    const img = document.createElement("img");
    img.src = "asset/apel.png";
    img.classList.add("gravity-apel");
    img.style.position = "absolute";
    img.style.width = "35px";
    img.style.left = left;
    img.style.top = top;
    img.style.transform = "translate(-50%, -50%)";
    img.style.zIndex = "20";

    treeContainer.appendChild(img);
    makeDraggableZoomable(img);
}



// ===================================================
// Fungsi Buah
// ===================================================
function buatBuahSVG(jenis, warna) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "28");
    svg.setAttribute("height", "28");
    svg.setAttribute("viewBox", "0 0 40 40");
    svg.classList.add("fruit-image");

    let shape;
    if (jenis === "mangga") {
        shape = document.createElementNS(svgNS, "ellipse");
        shape.setAttribute("cx", "20");
        shape.setAttribute("cy", "20");
        shape.setAttribute("rx", "8");
        shape.setAttribute("ry", "10");
    } else {
        shape = document.createElementNS(svgNS, "circle");
        shape.setAttribute("cx", "20");
        shape.setAttribute("cy", "20");
        shape.setAttribute("r", "9");
    }

    shape.setAttribute("fill", warna);
    svg.appendChild(shape);
    return svg;
}



// ===================================================
// Semua fungsi aslimu di sini — TIDAK diubah
// ===================================================

function resetPosisi() {
    document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
    gravityEffect.classList.remove('active');
    status.textContent = 'Siap';
}

function ubahBuah() {
    const selectedFruit = fruitSelect.value;
    const fruit = fruitData[selectedFruit];

    resetPosisi();
    currentFruit.textContent = fruit.name;
    gravityForce.textContent = 'Menarik ke Bawah';
    buatBuahDiPohon(selectedFruit);
    resetData();
}

function buatBuahDiPohon(jenis) {
    if (jenis === 'semua') {
        const jenisBuah = ['apel', 'jeruk', 'mangga'];
        fruitPositions.forEach((pos, index) => {
            buatBuahElement(fruitData[jenisBuah[index % 3]], pos, index);
        });
    } else {
        fruitPositions.forEach((pos, index) => {
            buatBuahElement(fruitData[jenis], pos, index);
        });
    }
}

function buatBuahElement(fruitData, position) {
    const fruitDiv = document.createElement('div');
    fruitDiv.className = 'fruit';
    fruitDiv.style.position = 'absolute';
    fruitDiv.style.top = position.top;
    fruitDiv.style.left = position.left;
    fruitDiv.style.zIndex = '15';
    fruitDiv.style.transform = 'translate(-50%, -50%)';

    const fruitSVG = buatBuahSVG(fruitSelect.value, fruitData.color);
    fruitDiv.appendChild(fruitSVG);

    treeContainer.appendChild(fruitDiv);
    return fruitDiv;
}

function mulaiSimulasi() {
    if (simulasiBerjalan) return;

    simulasiBerjalan = true;
    status.textContent = 'Buah jatuh...';

    gravityEffect.classList.add('active');

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);

    setTimeout(() => {
        document.querySelectorAll('.fruit').forEach((buah, index) => {
            setTimeout(() => { buah.classList.add('falling'); }, index * 200);
        });
    }, 500);

    setTimeout(() => selesaikanSimulasi(fruitData[fruitSelect.value]), 4000);
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    fallTime.textContent = elapsed.toFixed(1) + ' detik';
}

function selesaikanSimulasi(fruit) {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    status.textContent = 'Selesai';

    const finalTime = (Date.now() - startTime) / 1000;
    fallTime.textContent = finalTime.toFixed(1) + ' detik';

    setTimeout(() => alert(fruit.message), 500);
}

function resetSimulasi() {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    resetPosisi();
    ubahBuah();
    resetData();
}

function resetData() {
    fallTime.textContent = '-';
}



// ===================================================
// INISIALISASI
// ===================================================
document.addEventListener('DOMContentLoaded', function () {

    const treeImg = buatPohonGambar();
    tree.appendChild(treeImg);

    ubahBuah();

    // ICON APEL DI POHON (PNG)
    tambahIkonApel("45%", "18%");
    tambahIkonApel("60%", "22%");
    tambahIkonApel("30%", "26%");
});
