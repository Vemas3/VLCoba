// ======================================================
// 1. VARIABEL GLOBAL
// ======================================================
let draggedObject = null;
let objectCount = 0;


// ======================================================
// 2. FUNGSI: BUAT BUAH EMOJI SAAT DROP
// ======================================================
function createFruitEmoji(type, x, y) {
    const emojiMap = {
        apel: "🍎",
        jeruk: "🍊",
        mangga: "🥭"
    };

    const fruit = document.createElement("div");
    fruit.className = "dropped-object";
    fruit.dataset.type = type;

    fruit.style.position = "absolute";
    fruit.style.left = (x - 30) + "px";
    fruit.style.top = (y - 30) + "px";
    fruit.style.fontSize = "45px";
    fruit.style.userSelect = "none";
    fruit.textContent = emojiMap[type];

    makeDraggable(fruit);
    return fruit;
}



// ======================================================
// 3. INISIALISASI DRAG AND DROP
// ======================================================
function initDragAndDrop() {
    const dragObjects = document.querySelectorAll('.drag-object');
    const simulationArea = document.getElementById('simulationArea');
    
    dragObjects.forEach(obj => {
        obj.addEventListener('dragstart', handleDragStart);
        obj.addEventListener('dragend', handleDragEnd);
    });
    
    simulationArea.addEventListener('dragover', handleDragOver);
    simulationArea.addEventListener('drop', handleDrop);
}



// ======================================================
// 4. EVENT HANDLERS
// ======================================================
function handleDragStart(e) {
    draggedObject = this;
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.type);
    e.dataTransfer.effectAllowed = 'copy';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedObject = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();
    if (!draggedObject) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const type = draggedObject.dataset.type;

    // ==============================
    //   💥 KHUSUS BUAH EMOJI
    // ==============================
    if (type === "apel" || type === "jeruk" || type === "mangga") {

        const fruit = createFruitEmoji(type, x, y);
        document.getElementById('simulationArea').appendChild(fruit);

        objectCount++;
        updateObjectCount();
        return;
    }

    // ==============================
    //   📦 OBJEK NORMAL (GAMBAR)
    // ==============================
    createDroppedObject(
        type,
        draggedObject.dataset.src,
        x, 
        y
    );

    objectCount++;
    updateObjectCount();
}



// ======================================================
// 5. UPDATE JUMLAH OBJEK
// ======================================================
function updateObjectCount() {
    document.getElementById('objectCount').textContent = objectCount;
}



// ======================================================
// 6. MEMBUAT OBJEK NORMAL (GAMBAR PNG/SVG)
// ======================================================
function createDroppedObject(type, src, x, y) {
    const droppedObj = document.createElement('div');
    droppedObj.className = 'dropped-object';
    droppedObj.dataset.type = type;
    
    droppedObj.style.left = (x - 40) + 'px';
    droppedObj.style.top = (y - 40) + 'px';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = type;

    img.onerror = function () {
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            border-radius: 10px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:2rem;
            color:white;
        `;
        fallback.textContent = getFallbackIcon(type);
        droppedObj.appendChild(fallback);
    };

    droppedObj.appendChild(img);

    const label = document.createElement('div');
    label.className = 'object-label';
    label.textContent = getObjectName(type);
    droppedObj.appendChild(label);

    makeDraggable(droppedObj);
    
    document.getElementById('simulationArea').appendChild(droppedObj);
}



// ======================================================
// 7. FUNGSI: MEMBUAT OBJEK BISA DI-DRAG ULANG
// ======================================================
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        element.style.zIndex = '1000';
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.style.top = (element.offsetTop - pos2) + 'px';
        element.style.left = (element.offsetLeft - pos1) + 'px';
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        element.style.zIndex = '10';
    }
}



// ======================================================
// 8. HELPER: IKON FALLBACK + NAMA
// ======================================================
function getFallbackIcon(type) {
    const icons = {
        manusia: '👦',
        mobil: '🚗',
        bola: '🏀',
        magnet: '🧲',
        paku: '📌',
        pegas: '🌀',
        apel: '🍎',
        jeruk: '🍊',
        mangga: '🥭',
        meja: '🪑',
        aspal: '🛣️',
        tanah: '🌱'
    };
    return icons[type] || '📦';
}

function getObjectName(type) {
    const names = {
        manusia: 'Manusia',
        mobil: 'Mobil',
        bola: 'Bola',
        magnet: 'Magnet',
        paku: 'Paku',
        pegas: 'Pegas',
        apel: 'Apel',
        jeruk: 'Jeruk',
        mangga: 'Mangga',
        meja: 'Meja',
        aspal: 'Aspal',
        tanah: 'Tanah'
    };
    return names[type] || 'Objek';
}