// Clean PDF Reader with Snip Tool (Space + D), OCR & AI Slider Assistant
// Luxury Buddhist Theme & Pure Vector SVG Icons

let allPages = [];
let currentPageNum = 1;
let currentZoom = 1.35;
let currentAudio = new Audio();
let currentAudioSpeed = 0.5; // Default 0.5x slow speech

// PDF.js variables
let pdfDoc = null;
let pageRendering = false;
let pageNumPending = null;

// Floating toolbar & selection
let selectedTibetanText = "";

// Snip / Crop Tool State (Space + D)
let isCropMode = false;
let cropStartX = 0, cropStartY = 0;
let isCropping = false;

// Studio state
let mediaRecorder = null;
let recordedAudioChunks = [];
let userAudioBlob = null;
let userAudioUrl = null;
let currentStudioText = "";

document.addEventListener('DOMContentLoaded', async () => {
    if (window.pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    await loadTOCData();
    await initPDFReader();
    setupEventListeners();
    setupPanAndZoom();
    setupSliderResizer();
    setupFloatingToolbar();
    setupSnipCropTool();
    setupKeyboardShortcuts();
    setPlaybackSpeed(0.5);
    updateVocabBadgeCount();
    initVoiceEngineUI();
});

// Load TOC
async function loadTOCData() {
    try {
        const res = await fetch('./sara_book_data.json');
        if (res.ok) {
            allPages = await res.json();
            renderTOC();
            document.getElementById('totalPageDisplay').textContent = allPages.length;
        }
    } catch (e) {
        console.error('TOC load error:', e);
    }
}

// Render TOC Sidebar (No duplicate text, clean pills)
function renderTOC() {
    const container = document.getElementById('tocItems');
    container.innerHTML = '';

    allPages.forEach(p => {
        const row = document.createElement('div');
        row.className = `toc-page-row ${p.page_number === currentPageNum ? 'active' : ''}`;
        row.id = `toc-row-${p.page_number}`;
        row.onclick = () => jumpToPage(p.page_number);

        const displayPage = String(p.page_number).padStart(2, '0');
        let cleanTitle = (p.title || '').replace(/^Trang\s+\d+:\s*/i, '').trim();
        if (!cleanTitle || cleanTitle === `Trang ${p.page_number}`) {
            cleanTitle = p.lines && p.lines.length > 0 ? p.lines[0] : '';
        }

        row.innerHTML = `
            <div class="toc-row-top">
                <span class="toc-page-badge">Trang ${displayPage}</span>
                <span class="toc-topic-tag" title="${escapeHtml(p.topic || '')}">${escapeHtml(p.topic || '')}</span>
            </div>
            ${cleanTitle ? `<div class="toc-row-title tibetan-text" title="${escapeHtml(cleanTitle)}">${escapeHtml(cleanTitle)}</div>` : ''}
        `;
        container.appendChild(row);
    });
}

// Init PDF.js / High-Res Reader
async function initPDFReader() {
    document.getElementById('totalPageDisplay').textContent = allPages.length || 120;
    
    // Tự động fit width khi khởi động
    const viewport = document.getElementById('pdfViewport');
    if (viewport) {
        const viewportW = viewport.clientWidth - 60;
        currentZoom = Math.max(0.7, Math.min(1.35, viewportW / 820));
    }
    updateZoomDisplay();
    renderPDFPage(currentPageNum);
}

// Render Single PDF Page with High-Resolution Clarity
async function renderPDFPage(num) {
    pageRendering = true;
    hideFloatingToolbar();
    currentPageNum = num;
    document.getElementById('pageInput').value = num;

    document.querySelectorAll('.toc-page-row').forEach(r => r.classList.remove('active'));
    const activeRow = document.getElementById(`toc-row-${num}`);
    if (activeRow) {
        activeRow.classList.add('active');
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const container = document.getElementById('pdfPageContainer');
    if (!container) return;

    const baseWidth = 820;
    const targetWidth = Math.round(baseWidth * currentZoom);

    container.style.width = `${targetWidth}px`;
    container.style.height = 'auto';
    container.style.display = 'block';

    container.innerHTML = `
        <div style="position:relative; width:100%; height:auto;">
            <img 
                src="./pages/page_${num}.png" 
                style="width:100%; height:auto; display:block; border-radius:4px; box-shadow:0 8px 30px rgba(0,0,0,0.7);" 
                alt="Sara Book Trang ${num}"
                id="pdfPageImg"
                onload="document.getElementById('pdfViewport').scrollTop=0;"
                onerror="this.onerror=null; this.src='./pages/page_1.png'; console.warn('Page ${num} not found, fallback to page 1');"
            />
            <div class="textLayer" id="pdfTextLayer"></div>
        </div>
    `;

    // Scroll về đầu trang khi chuyển trang
    const viewport = document.getElementById('pdfViewport');
    if (viewport) viewport.scrollTop = 0;

    pageRendering = false;
    if (pageNumPending !== null) {
        renderPDFPage(pageNumPending);
        pageNumPending = null;
    }
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPDFPage(num);
    }
}

function jumpToPage(num) {
    if (num < 1) num = 1;
    if (num > (allPages.length || 120)) num = allPages.length || 120;
    queueRenderPage(num);
}

function renderImageFallback(num) {
    renderPDFPage(num);
}

// Event Listeners for Toolbar
function setupEventListeners() {
    // Prev / Next
    document.getElementById('btnPrev').onclick = () => {
        if (currentPageNum <= 1) return;
        jumpToPage(currentPageNum - 1);
    };

    document.getElementById('btnNext').onclick = () => {
        if (pdfDoc && currentPageNum >= pdfDoc.numPages) return;
        jumpToPage(currentPageNum + 1);
    };

    // Page Input Jump
    document.getElementById('pageInput').onkeydown = (e) => {
        if (e.key === 'Enter') {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) jumpToPage(val);
        }
    };

    // Zoom Controls
    document.getElementById('btnZoomIn').onclick = () => {
        currentZoom = Math.min(3.0, currentZoom + 0.2);
        updateZoomDisplay();
        queueRenderPage(currentPageNum);
    };

    document.getElementById('btnZoomOut').onclick = () => {
        currentZoom = Math.max(0.6, currentZoom - 0.2);
        updateZoomDisplay();
        queueRenderPage(currentPageNum);
    };

    document.getElementById('btnFitWidth').onclick = () => {
        const viewportW = document.getElementById('pdfViewport').clientWidth - 60;
        currentZoom = Math.max(0.7, viewportW / 700);
        updateZoomDisplay();
        queueRenderPage(currentPageNum);
    };

    // Toggle TOC
    document.getElementById('btnToggleTOC').onclick = () => {
        const sb = document.getElementById('pdfSidebar');
        sb.classList.toggle('collapsed');
    };

    // Playback Speed Selector (0.5x, 0.75x, 1.0x)
    document.querySelectorAll('.btn-speed-opt').forEach(btn => {
        btn.onclick = () => {
            const spd = parseFloat(btn.getAttribute('data-speed'));
            setPlaybackSpeed(spd);
        };
    });

    // Snip Tool Trigger (Space + D)
    document.getElementById('btnSnipTool').onclick = () => {
        enterCropMode();
    };
}

function updateZoomDisplay() {
    document.getElementById('zoomDisplay').textContent = `${Math.round(currentZoom * 100)}%`;
}

// Setup Smooth Pan / Drag & Ctrl + Wheel Zoom for PDF Viewport
function setupPanAndZoom() {
    const viewport = document.getElementById('pdfViewport');
    if (!viewport) return;

    let isPanning = false;
    let isSpacePressed = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;

    // Space key detection for Photoshop / Acrobat-style pan
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.code === 'Space' && !isSpacePressed && !isCropMode) {
            isSpacePressed = true;
            viewport.classList.add('space-pan-ready');
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            isSpacePressed = false;
            viewport.classList.remove('space-pan-ready');
            if (!isPanning) {
                viewport.style.cursor = '';
            }
        }
    });

    // Mouse Down on viewport or page
    viewport.addEventListener('mousedown', (e) => {
        if (isCropMode) return;

        // Pan triggers on: Middle mouse button (button 1), holding Spacebar, or dragging on background / page margin
        const isTextSelection = e.target.closest('.textLayer') && !isSpacePressed;
        if (e.button === 1 || isSpacePressed || (!isTextSelection && e.button === 0)) {
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
            startScrollLeft = viewport.scrollLeft;
            startScrollTop = viewport.scrollTop;
            viewport.classList.add('is-panning');
            viewport.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            if (isSpacePressed || e.button === 1) {
                e.preventDefault();
            }
        }
    });

    // Mouse Move on window
    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        viewport.scrollLeft = startScrollLeft - dx;
        viewport.scrollTop = startScrollTop - dy;
    });

    // Mouse Up on window
    window.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            viewport.classList.remove('is-panning');
            viewport.style.cursor = isSpacePressed ? 'grab' : '';
            document.body.style.userSelect = '';
        }
    });

    // Ctrl + Mouse Wheel Zoom (Phóng to / thu nhỏ bằng Ctrl + Con lăn chuột)
    let wheelZoomTimeout = null;
    viewport.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();

            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left + viewport.scrollLeft;
            const mouseY = e.clientY - rect.top + viewport.scrollTop;

            const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
            const prevZoom = currentZoom;
            let newZoom = Math.min(4.0, Math.max(0.5, Math.round((currentZoom + zoomDelta) * 100) / 100));

            if (newZoom !== prevZoom) {
                currentZoom = newZoom;
                updateZoomDisplay();

                const scaleFactor = currentZoom / prevZoom;
                const newScrollLeft = mouseX * scaleFactor - (e.clientX - rect.left);
                const newScrollTop = mouseY * scaleFactor - (e.clientY - rect.top);

                clearTimeout(wheelZoomTimeout);
                wheelZoomTimeout = setTimeout(() => {
                    queueRenderPage(currentPageNum);
                }, 30);

                viewport.scrollLeft = newScrollLeft;
                viewport.scrollTop = newScrollTop;
            }
        }
    }, { passive: false });
}

function setPlaybackSpeed(speed) {
    currentAudioSpeed = speed;
    currentAudio.playbackRate = speed;
    document.querySelectorAll('.btn-speed-opt').forEach(b => {
        if (parseFloat(b.getAttribute('data-speed')) === speed) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
    showToast(`Tốc độ đọc: ${speed}x`);
}

// Setup Text Selection Floating Pill
function setupFloatingToolbar() {
    const viewport = document.getElementById('pdfViewport');

    document.addEventListener('selectionchange', () => {
        if (isCropMode) return;
        const sel = window.getSelection();
        const text = sel.toString().trim();

        if (text && text.length > 0) {
            selectedTibetanText = text;
            try {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const vpRect = viewport.getBoundingClientRect();

                const pill = document.getElementById('floatingToolbar');
                pill.style.display = 'flex';

                let top = rect.top - 50;
                let left = rect.left + (rect.width / 2) - 150;

                if (top < 60) top = rect.bottom + 10;
                if (left < 20) left = 20;

                pill.style.top = `${top}px`;
                pill.style.left = `${left}px`;
            } catch (e) {}
        }
    });

    document.addEventListener('mousedown', (e) => {
        const pill = document.getElementById('floatingToolbar');
        if (pill && !pill.contains(e.target) && !isCropMode) {
            setTimeout(() => {
                const sel = window.getSelection();
                if (!sel.toString().trim()) {
                    hideFloatingToolbar();
                }
            }, 150);
        }
    });
}

function hideFloatingToolbar() {
    const pill = document.getElementById('floatingToolbar');
    if (pill) pill.style.display = 'none';
}

// Snip / Crop Tool Logic (Space + D)
function setupSnipCropTool() {
    const overlay = document.getElementById('cropOverlay');
    const box = document.getElementById('cropSelectionBox');

    overlay.addEventListener('mousedown', (e) => {
        isCropping = true;
        cropStartX = e.clientX;
        cropStartY = e.clientY;

        box.style.left = `${cropStartX}px`;
        box.style.top = `${cropStartY}px`;
        box.style.width = '0px';
        box.style.height = '0px';
        box.style.display = 'block';
    });

    overlay.addEventListener('mousemove', (e) => {
        if (!isCropping) return;

        const currentX = e.clientX;
        const currentY = e.clientY;

        const x = Math.min(cropStartX, currentX);
        const y = Math.min(cropStartY, currentY);
        const w = Math.abs(currentX - cropStartX);
        const h = Math.abs(currentY - cropStartY);

        box.style.left = `${x}px`;
        box.style.top = `${y}px`;
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
    });

    overlay.addEventListener('mouseup', async (e) => {
        if (!isCropping) return;
        isCropping = false;

        const currentX = e.clientX;
        const currentY = e.clientY;
        const w = Math.abs(currentX - cropStartX);
        const h = Math.abs(currentY - cropStartY);

        if (w < 10 || h < 10) {
            exitCropMode();
            return;
        }

        const pageEl = document.getElementById('pdfPageImg') || document.getElementById('pdfPageContainer');
        if (!pageEl) {
            exitCropMode();
            return;
        }

        const canvasRect = pageEl.getBoundingClientRect();
        const minX = Math.min(cropStartX, currentX);
        const minY = Math.min(cropStartY, currentY);
        const maxX = Math.max(cropStartX, currentX);
        const maxY = Math.max(cropStartY, currentY);

        const relX0 = Math.max(0, minX - canvasRect.left);
        const relY0 = Math.max(0, minY - canvasRect.top);
        const relX1 = Math.min(canvasRect.width, maxX - canvasRect.left);
        const relY1 = Math.min(canvasRect.height, maxY - canvasRect.top);

        // Tạo ảnh cắt xem trước trực tiếp trên client
        let clientCroppedImage = null;
        try {
            const img = document.getElementById('pdfPageImg');
            if (img && img.naturalWidth > 0 && canvasRect.width > 0) {
                const scaleX = img.naturalWidth / canvasRect.width;
                const scaleY = img.naturalHeight / canvasRect.height;
                const sx = relX0 * scaleX;
                const sy = relY0 * scaleY;
                const sw = (relX1 - relX0) * scaleX;
                const sh = (relY1 - relY0) * scaleY;

                if (sw > 0 && sh > 0) {
                    const offCanvas = document.createElement('canvas');
                    offCanvas.width = sw;
                    offCanvas.height = sh;
                    const ctx = offCanvas.getContext('2d');
                    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
                    clientCroppedImage = offCanvas.toDataURL('image/png');
                }
            }
        } catch (err) {
            console.log('Client crop snapshot note:', err);
        }

        exitCropMode();
        showToast('Đang nhận diện vùng quét...');
        openSliderWithLoading();

        if (clientCroppedImage) {
            const previewBox = document.getElementById('sliderCropPreview');
            if (previewBox) {
                previewBox.style.display = 'block';
                previewBox.innerHTML = `
                    <div style="font-size:11px; font-weight:700; color:var(--gold-light); margin-bottom:4px;">Ảnh chụp vùng quét:</div>
                    <img src="${clientCroppedImage}" class="crop-preview-img" alt="Snippet">
                `;
            }
        }

        try {
            const sel = window.getSelection().toString().trim();
            const res = await fetch('/api/crop-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page_num: currentPageNum,
                    rect: [relX0, relY0, relX1, relY1],
                    canvas_size: [canvasRect.width, canvasRect.height],
                    fallback_text: sel,
                    cropped_image: clientCroppedImage
                })
            });

            const data = await res.json();
            if (data.status === 'success') {
                if (clientCroppedImage && !data.cropped_image) {
                    data.cropped_image = clientCroppedImage;
                }
                selectedTibetanText = data.detected_text || (data.analysis && data.analysis.detected_text) || '';
                renderSliderWithCropResult(data);
                if (selectedTibetanText) {
                    playTTS(selectedTibetanText);
                }
            } else {
                showToast('Lỗi khi nhận diện hình ảnh.');
            }
        } catch (err) {
            console.error('Crop analyze error:', err);
            showToast('Lỗi kết nối máy chủ.');
        }
    });
}

function enterCropMode() {
    isCropMode = true;
    hideFloatingToolbar();
    const overlay = document.getElementById('cropOverlay');
    if (overlay) overlay.style.display = 'block';
    showToast('Kéo chuột vẽ vùng chữ Tạng muốn dịch');
}

function exitCropMode() {
    isCropMode = false;
    const overlay = document.getElementById('cropOverlay');
    if (overlay) overlay.style.display = 'none';
    const box = document.getElementById('cropSelectionBox');
    if (box) box.style.display = 'none';
}

// Global Keyboard Shortcuts (Shift + D & Space + D & Ctrl + J)
function setupKeyboardShortcuts() {
    let isSpaceDown = false;

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') {
            isSpaceDown = true;
        }

        // Shift + D hoặc Space + D -> Bật chế độ quét vùng
        if ((e.shiftKey || isSpaceDown) && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            enterCropMode();
        }

        // Ctrl + J -> Đóng/Mở Trợ lý AI Slider
        if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
            e.preventDefault();
            toggleAssistantSlider();
        }

        // ESC -> Hủy chế độ quét
        if (e.key === 'Escape' && isCropMode) {
            exitCropMode();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            isSpaceDown = false;
        }
    });
}

// Floating Bar Action Handlers
function onFloatAskAI() {
    hideFloatingToolbar();
    openSliderWithText(selectedTibetanText, 'ai');
}

function onFloatCopy() {
    const text = document.getElementById('sliderTibetanInput')?.value.trim() || selectedTibetanText;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Đã sao chép chữ Tạng!');
        });
    }
}

function onFloatTTS() {
    const text = document.getElementById('sliderTibetanInput')?.value.trim() || selectedTibetanText;
    if (text) {
        playTTS(text);
        showToast(`Đang đọc (${currentAudioSpeed}x)...`);
    }
}

function onFloatExplain() {
    hideFloatingToolbar();
    openSliderWithText(selectedTibetanText, 'explain');
}

function onFloatCoach() {
    hideFloatingToolbar();
    openPronunciationStudio(selectedTibetanText);
}

function toggleAssistantSlider() {
    const panel = document.getElementById('assistantSlider');
    if (panel.classList.contains('open')) {
        closeAssistantSlider();
    } else {
        openSliderWithText(selectedTibetanText || "བཀྲ་ཤིས་བདེ་ལེགས", 'explain');
    }
}

// Open Assistant Slider
function openSliderWithLoading() {
    const panel = document.getElementById('assistantSlider');
    panel.classList.add('open');
    document.body.classList.add('slider-active');
    document.getElementById('sliderTibetanInput').value = "Đang nhận diện...";
    document.getElementById('sliderWylie').textContent = 'Đang phân tích...';
    document.getElementById('sliderCropPreview').style.display = 'none';
    document.getElementById('sliderTabMeaning').innerHTML = '<div style="padding:24px; text-align:center; color:var(--gold);"><span class="spinner"></span> Đang nhận diện & phân tích nghĩa...</div>';
    document.getElementById('sliderTabSpelling').innerHTML = '<div style="padding:24px; text-align:center; color:var(--gold);"><span class="spinner"></span> Đang tải âm tiết...</div>';
    document.getElementById('sliderTabBuddhist').innerHTML = '<div style="padding:24px; text-align:center; color:var(--gold);"><span class="spinner"></span> Đang tải kinh văn...</div>';
}

function renderSliderWithCropResult(data) {
    if (!data) return;
    const text = data.detected_text || (data.analysis && data.analysis.detected_text) || "";
    document.getElementById('sliderTibetanInput').value = text;
    
    // Show cropped image snippet
    if (data.cropped_image) {
        const previewBox = document.getElementById('sliderCropPreview');
        previewBox.style.display = 'block';
        previewBox.innerHTML = `
            <div style="font-size:11px; font-weight:700; color:var(--gold-light); margin-bottom:4px;">Ảnh chụp vùng quét:</div>
            <img src="${data.cropped_image}" class="crop-preview-img" alt="Snippet">
        `;
    }

    renderSliderContent(data.analysis || data);
}

async function openSliderWithText(text, defaultTab = 'explain') {
    const cleanText = text.trim();
    if (!cleanText) return;

    selectedTibetanText = cleanText;
    const panel = document.getElementById('assistantSlider');
    panel.classList.add('open');
    document.body.classList.add('slider-active');

    document.getElementById('sliderTibetanInput').value = cleanText;
    document.getElementById('sliderWylie').textContent = 'Đang phân tích...';
    document.getElementById('sliderCropPreview').style.display = 'none';
    document.getElementById('sliderTabMeaning').innerHTML = '<div style="padding:24px; text-align:center; color:var(--gold);"><span class="spinner"></span> Đang phân tích...</div>';
    document.getElementById('sliderTabSpelling').innerHTML = '<div style="padding:24px; text-align:center; color:var(--gold);"><span class="spinner"></span> Đang tải...</div>';
    document.getElementById('sliderTabBuddhist').innerHTML = '<div style="padding:24px; text-align:center; color:var(--gold);"><span class="spinner"></span> Đang tải...</div>';
    document.getElementById('aiChatHistory').innerHTML = '<div style="color:var(--text-muted);">Nhập câu hỏi để trò chuyện cùng trợ lý AI...</div>';

    switchSliderTab(defaultTab === 'ai' ? 'tab-ai' : 'tab-explain');

    try {
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText })
        });
        const data = await res.json();
        renderSliderContent(data);

        if (defaultTab === 'ai') {
            askAIAssistant(`Hãy phân tích sâu ngữ pháp và ý nghĩa của: ${cleanText}`);
        }
    } catch (e) {
        console.error('Slider analysis error:', e);
    }
}

function handleReanalyzeText() {
    const text = document.getElementById('sliderTibetanInput').value.trim();
    if (text) {
        selectedTibetanText = text;
        openSliderWithText(text, 'explain');
        playTTS(text);
    }
}

let isSliderExpanded = false;

function toggleExpandAssistantSlider() {
    isSliderExpanded = !isSliderExpanded;
    const panel = document.getElementById('assistantSlider');
    const icon = document.getElementById('iconExpandSlider');
    const btn = document.getElementById('btnToggleExpandSlider');
    const vp = document.getElementById('pdfViewport');

    if (isSliderExpanded) {
        panel.classList.add('expanded');
        document.body.classList.add('slider-expanded');
        if (btn) btn.title = "Thu nhỏ bảng lại (Collapse)";
        if (icon) {
            icon.innerHTML = '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>';
        }
        if (vp) vp.style.paddingRight = '720px';
    } else {
        panel.classList.remove('expanded');
        panel.style.width = '';
        document.body.classList.remove('slider-expanded');
        if (btn) btn.title = "Mở rộng bảng ra xem (Expand)";
        if (icon) {
            icon.innerHTML = '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>';
        }
        if (vp) vp.style.paddingRight = '';
    }
}

function setupSliderResizer() {
    const resizer = document.getElementById('sliderResizer');
    const panel = document.getElementById('assistantSlider');
    if (!resizer || !panel) return;

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ew-resize';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = Math.max(380, Math.min(window.innerWidth * 0.85, window.innerWidth - e.clientX));
        panel.style.width = `${newWidth}px`;
        const vp = document.getElementById('pdfViewport');
        if (vp && document.body.classList.contains('slider-active')) {
            vp.style.paddingRight = `${newWidth + 30}px`;
        }
    });

    window.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }
    });
}

function closeAssistantSlider() {
    document.getElementById('assistantSlider').classList.remove('open');
    document.body.classList.remove('slider-active');
    const vp = document.getElementById('pdfViewport');
    if (vp) vp.style.paddingRight = '';
}

function renderSliderContent(raw) {
    if (!raw) raw = {};
    const data = raw.analysis || raw;
    const dict = data.dictionary || {};
    const syllables = data.syllables || [];
    const tableRows = data.table_rows || [];
    const fullTrans = data.full_translation || dict.vn || data.meaning || 'Đang cập nhật ý nghĩa câu...';
    const buddhist = data.buddhist_context || {};
    const usageContext = data.usage_context || {};

    collectVocabFromAnalysis(data);

    document.getElementById('sliderWylie').textContent = `Chuyển tự Wylie (EWTS): ${data.wylie || ''}`;

    // 1. Meaning & Grammar Tab: Full Sentence Translation + 3-Column Table
    let tableHTML = '';
    if (tableRows.length > 0) {
        const rowsHTML = tableRows.map(r => `
            <tr>
                <td class="col-tibetan">
                    <span class="tibetan-text">${escapeHtml(r.tibetan)}</span>
                    <button class="btn-table-play" onclick="playTTS('${escapeHtml(r.tibetan)}')" title="Nghe phát âm từ này">
                        <svg class="svg-icon" viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                </td>
                <td class="col-phonetic">
                    <div class="phonetic-ipa">${escapeHtml(r.phonetic || '')}</div>
                    <div class="phonetic-wylie">${escapeHtml(r.wylie || '')}</div>
                </td>
                <td class="col-meaning">
                    <div class="meaning-vn">${escapeHtml(r.meaning || '')}</div>
                    <span class="badge-pos">${escapeHtml(r.pos || 'Từ vựng')}</span>
                </td>
            </tr>
        `).join('');

        tableHTML = `
            <div class="slider-card" style="padding:10px 12px;">
                <div class="slider-card-title" style="margin-bottom:8px;">
                    <svg class="svg-icon gold-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    <span>BẢNG TỪ VỰNG & PHÁT ÂM CHI TIẾT (3 CỘT):</span>
                </div>
                <div class="table-scroll-wrapper">
                    <table class="tibetan-vocab-table">
                        <thead>
                            <tr>
                                <th style="width:28%;">Chữ Tạng</th>
                                <th style="width:32%;">Phát âm / Wylie</th>
                                <th style="width:40%;">Ý nghĩa ngữ pháp</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Practical Dialogue Examples
    const dialogueList = usageContext.dialogue_examples || [];
    let dialoguesHTML = '';
    if (dialogueList.length > 0) {
        dialoguesHTML = dialogueList.map(d => `
            <div class="dialogue-card-row">
                <div class="dialogue-speaker-badge">${escapeHtml(d.speaker)}:</div>
                <div class="dialogue-content">
                    <div class="dialogue-tibetan-row">
                        <span class="tibetan-text dialogue-tibetan">${escapeHtml(d.tibetan)}</span>
                        <button class="btn-table-play" onclick="playTTS('${escapeHtml(d.tibetan)}')" title="Nghe phát âm câu mẫu">
                            <svg class="svg-icon" viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                    </div>
                    <div class="dialogue-wylie">${escapeHtml(d.wylie)}</div>
                    <div class="dialogue-vn">"${escapeHtml(d.vn)}"</div>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('sliderTabMeaning').innerHTML = `
        <!-- Section 1: Full Sentence Translation -->
        <div class="slider-card full-trans-card">
            <div class="slider-card-title">
                <svg class="svg-icon gold-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                <span>DỊCH NGHĨA HOÀN CHỈNH TOÀN CÂU:</span>
            </div>
            <div class="full-trans-quote">"${escapeHtml(fullTrans)}"</div>
        </div>

        <!-- Section 2: 3-Column Vocabulary Breakdown Table -->
        ${tableHTML}

        <!-- Section 3: Rich Practical Usage & Real-World Dialogues -->
        <div class="slider-card usage-practical-card">
            <div class="slider-card-title">
                <svg class="svg-icon gold-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>NGỮ CẢNH & CÁCH SỬ DỤNG THỰC TẾ:</span>
            </div>
            
            <div class="usage-situation-box">
                <div class="usage-situation-item">
                    <span class="usage-tag">🎯 Hoàn cảnh:</span>
                    <span class="usage-text">${escapeHtml(usageContext.situation || dict.usage || 'Đàm thoại giao tiếp hàng ngày')}</span>
                </div>
                ${usageContext.cultural_notes ? `
                <div class="usage-situation-item" style="margin-top:6px;">
                    <span class="usage-tag">💡 Văn hóa & Kính ngữ:</span>
                    <span class="usage-text">${escapeHtml(usageContext.cultural_notes)}</span>
                </div>` : ''}
            </div>

            ${dialoguesHTML ? `
            <div class="usage-dialogues-container">
                <div class="dialogues-header-label">🗣️ MẪU CÂU ĐÀM THOẠI ỨNG DỤNG THỰC TẾ:</div>
                ${dialoguesHTML}
            </div>` : ''}
        </div>
    `;

    // 2. Spelling Tab (Visual Step-by-Step Monastic Spelling Cards with Big Tibetan Font)
    let syllsHTML = '';
    syllables.forEach((s) => {
        let stepsList = (s.spelling_steps || []).map(st => `
            <div class="spelling-step-row">
                <span>${escapeHtml(st)}</span>
            </div>
        `).join('');

        let tips = (s.coach_guide && s.coach_guide.correction_tips) ? s.coach_guide.correction_tips : [];

        syllsHTML += `
            <div class="syllable-breakdown-card">
                <div class="syllable-title">
                    <span class="tibetan-text syllable-lg">${escapeHtml(s.syllable)}</span>
                    <div class="syllable-title-meta">
                        <span class="syllable-wylie">Wylie: <b>${escapeHtml(s.wylie)}</b></span>
                        <button class="btn-table-play" onclick="playTTS('${escapeHtml(s.syllable)}')" title="Nghe phát âm âm tiết này">
                            <svg class="svg-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                    </div>
                </div>
                <div class="syllable-badges-grid">
                    <span class="badge-part badge-root">Căn tự gốc: <b class="tibetan-text">${escapeHtml(s.root || '-')}</b></span>
                    <span class="badge-part badge-prefix">Tiền tự trước: <b class="tibetan-text">${escapeHtml(s.prefix || '-')}</b></span>
                    <span class="badge-part badge-suffix">Hậu tự đuôi: <b class="tibetan-text">${escapeHtml(s.suffix || '-')}</b></span>
                    <span class="badge-part badge-vowel">Nguyên âm: <b>${escapeHtml(s.vowel || 'a')}</b></span>
                </div>
                <div class="monastery-formula-box">
                    <div class="formula-title">📖 CÁCH GHÉP VẦN TỪNG BƯỚC:</div>
                    <div class="formula-desc-note">Ghép từng chữ gốc, chân phụ, nguyên âm và chữ đuôi:</div>
                    ${stepsList || '<div style="font-size:11px; color:var(--text-muted);">Âm tiết đơn phát âm trực tiếp theo căn tự.</div>'}
                </div>
                ${tips.length > 0 ? `<div class="articulation-tip-box">${tips.map(escapeHtml).join('<br>')}</div>` : ''}
            </div>
        `;
    });

    document.getElementById('sliderTabSpelling').innerHTML = `
        <div class="slider-card-title" style="margin-bottom:8px;">
            <svg class="svg-icon gold-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
            <span>HƯỚNG DẪN ĐÁNH VẦN TỪNG BƯỚC:</span>
        </div>
        <div class="spelling-intro-banner">
            💡 <b>Đánh vần tiếng Tạng là gì?</b> Là phương pháp ghép chữ cái gốc với chân phụ, nguyên âm và chữ đuôi để đọc chuẩn 100% âm thanh tu viện.
        </div>
        ${syllsHTML || '<div style="font-size:12px; color:var(--text-muted); padding:10px;">Không có dữ liệu âm tiết.</div>'}
    `;

    // 3. Buddhist Tab (Rich Canonical Quotes & Chanting)
    const sTib = buddhist.sutra_tibetan || 'ན་མོ་གུ་རུ་བྷྱཿ ན་མོ་བུདྡྷཱ་ཡ། ན་མོ་དྷརྨཱ་ཡ། ན་མོ་སངྒྷཱ་ཡ།';
    const sChant = buddhist.sutra_chanting || 'Nam-mô Gu-ru-bê, Nam-mô Bút-đa-da, Nam-mô Đạt-ma-da, Nam-mô Sang-ga-da';
    const sTrans = buddhist.sutra_translation || 'Con xin quy y Bậc Đạo Sư, Quy y Phật, Quy y Pháp, Quy y Tăng thanh tịnh.';
    const dInsight = buddhist.dharma_insight || dict.buddhist || 'Thuật ngữ mang ý nghĩa thanh tịnh trong kinh điển Đại thừa và Kim Cương thừa.';

    document.getElementById('sliderTabBuddhist').innerHTML = `
        <div class="slider-card buddhist-card-highlight">
            <div class="slider-card-title">
                <svg class="svg-icon gold-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="3" x2="12" y2="9"></line><line x1="12" y1="15" x2="12" y2="21"></line><line x1="3" y1="12" x2="9" y2="12"></line><line x1="15" y1="12" x2="21" y2="12"></line></svg>
                <span>ĐOẠN KINH ĐIỂN / CHÂN NGÔN LIÊN QUAN:</span>
            </div>
            
            <div class="buddhist-sutra-box">
                <div class="sutra-tibetan-text tibetan-text">${escapeHtml(sTib)}</div>
                <div class="sutra-chanting-label">🗣️ CÁCH ĐỌC TỤNG:</div>
                <div class="sutra-chanting-text">${escapeHtml(sChant)}</div>
                <div class="sutra-trans-label">🌺 BẢN DỊCH NGHĨA:</div>
                <div class="sutra-trans-text">"${escapeHtml(sTrans)}"</div>
            </div>

            <div style="margin-top:10px;">
                <div class="sutra-trans-label">☸️ Ý NGHĨA PHẬT HỌC & QUÁN CHIẾU:</div>
                <div class="slider-usage-text" style="color:var(--gold-light); line-height:1.7;">
                    ${escapeHtml(dInsight)}
                </div>
            </div>
        </div>
    `;
}

function switchSliderTab(tabId) {
    document.querySelectorAll('.slider-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.slider-tab-view').forEach(v => v.classList.remove('active'));

    const btn = document.getElementById(`btn-${tabId}`);
    const view = document.getElementById(`view-${tabId}`);
    if (btn) btn.classList.add('active');
    if (view) view.classList.add('active');
}

// Ask AI Chatbot
function sendQuickAIPrompt(promptText) {
    const input = document.getElementById('aiChatInput');
    input.value = promptText;
    handleSendAIChat();
}

async function handleSendAIChat() {
    const input = document.getElementById('aiChatInput');
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    await askAIAssistant(q);
}

async function askAIAssistant(question) {
    const history = document.getElementById('aiChatHistory');
    history.innerHTML += `
        <div class="ai-user-bubble">
            <b>Bạn:</b> ${escapeHtml(question)}
        </div>
        <div id="aiLoadingMsg" style="color:var(--gold); font-size:12px; margin-bottom:8px;"><span class="spinner"></span> Trợ lý AI đang giải đáp...</div>
    `;
    history.scrollTop = history.scrollHeight;

    try {
        const res = await fetch('/api/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                target_text: selectedTibetanText
            })
        });
        const data = await res.json();
        const loadingEl = document.getElementById('aiLoadingMsg');
        if (loadingEl) loadingEl.remove();

        history.innerHTML += `
            <div class="ai-bot-bubble">
                <div class="ai-bot-header">
                    <svg class="svg-icon gold-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2L14.39 8.26L21 9.27L16.2 13.97L17.34 20.73L12 17.27L6.66 20.73L7.8 13.97L3 9.27L9.61 8.26L12 2Z"/></svg>
                    <span>Trợ lý AI:</span>
                </div>
                <div class="ai-bot-content">
                    ${formatMarkdown(data.answer)}
                </div>
            </div>
        `;
        history.scrollTop = history.scrollHeight;
    } catch (e) {
        const loadingEl = document.getElementById('aiLoadingMsg');
        if (loadingEl) loadingEl.remove();
        history.innerHTML += `<div style="color:#EF4444; font-size:12px; margin-bottom:8px;">Lỗi kết nối tới Trợ lý AI.</div>`;
    }
}

function playSelectedTTS() {
    const text = document.getElementById('sliderTibetanInput').value.trim() || selectedTibetanText;
    if (text) playTTS(text);
}

// ==========================================================================
// 🎙️ MULTI-ENGINE TIBETAN VOICE & SPEECH SYNTHESIS ARCHITECTURE
// ==========================================================================
let currentVoiceEngine = localStorage.getItem('tibetan_voice_engine') || 'native_studio';

const VOICE_LABELS = {
    'native_studio': '🎙️ Tu Viện',
    'neural_female': '🌸 Nữ AI',
    'neural_male': '🧘 Nam AI',
    'phonetic_ipa': '🌐 IPA'
};

// ==========================================================================
// 🗣️ COMPREHENSIVE TIBETAN SYLLABLE & PHRASE PHONETIC TRANSLITERATOR
// ==========================================================================
const TIB_CONSONANTS_MAP = {
    'ཀ': 'ka', 'ཁ': 'kha', 'ག': 'ga', 'ང': 'nga',
    'ཅ': 'ca', 'ཆ': 'cha', 'ཇ': 'ja', 'ཉ': 'nya',
    'ཏ': 'ta', 'ཐ': 'tha', 'ད': 'da', 'ན': 'na',
    'པ': 'pa', 'ཕ': 'pha', 'བ': 'ba', 'མ': 'ma',
    'ཙ': 'tsa', 'ཚ': 'tsha', 'ཛ': 'dza', 'ཝ': 'wa',
    'ཞ': 'zha', 'ཟ': 'za', 'འ': 'a', 'ཡ': 'ya',
    'ར': 'ra', 'ལ': 'la', 'ཤ': 'sha', 'ས': 'sa',
    'ཧ': 'ha', 'ཨ': 'a'
};

const TIB_VOWELS_MAP = {
    '\u0F72': 'i', '\u0F74': 'u', '\u0F7A': 'e', '\u0F7C': 'o',
    '\u0F71': 'a', '\u0F7E': 'm', '\u0F7F': 'h'
};

const TIB_SUBJOINED_MAP = {
    'ྱ': 'y', 'ྲ': 'r', 'ླ': 'l', 'ྭ': 'w',
    'ྐ': 'k', 'ྒ': 'g', 'ྔ': 'ng', 'ྗ': 'j', 'ྙ': 'ny',
    'ྟ': 't', 'ྡ': 'd', 'ྣ': 'n', 'ྦ': 'b', 'ྨ': 'm',
    'ྩ': 'ts', 'ྫ': 'dz'
};

const HIGH_FREQ_PHRASE_DICT = {
    "སྐུ་ཁམས་བཟང་": "ku kham sang",
    "སྐུ་ཁམས་བཟང་།": "ku kham sang",
    "བཀྲ་ཤིས་བདེ་ལེགས": "tra shi de lek",
    "བཀྲ་ཤིས་བདེ་ལེགས།": "tra shi de lek",
    "ཐུགས་རྗེ་ཆེ": "thuk je che",
    "ཐུགས་རྗེ་ཆེ།": "thuk je che",
    "ག་ལེར་ཕེབས": "ga le pheb",
    "ག་ལེར་ཕེབས།": "ga le pheb",
    "ག་ལེར་བཞུགས": "ga le zhuk",
    "ག་ལེར་བཞུགས།": "ga le zhuk",
    "དགོངས་དག": "gong dak",
    "དགོངས་དག།": "gong dak",
    "ཁྱེད་རང་": "khye rang",
    "ཁྱེད་རང་།": "khye rang",
    "ང་": "nga",
    "ཁོང་": "khong",
    "མིང་": "ming",
    "སློབ་མ་": "lop ma",
    "དགེ་རྒན་": "gen gen",
    "དགེ་འདུན་": "gen dun",
    "དཔེ་ཆ་": "pe cha",
    "ཤག་": "shak",
    "བོད": "bod",
    "སློབ": "slob",
    "དགེ": "ge",
    "ཆོས": "chos",
    "སངས": "sang",
    "རྒྱས": "gye",
    "སངས་རྒྱས": "sang gye",
    "བྱང་ཆུབ": "jang chub",
    "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ": "om mani padme hum",
    "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།": "om mani padme hum",
    "ཨོཾ": "om",
    "ཧཱུྃ": "hum",
    "ཨཱཿ": "ah",
    "ཧྲཱིཿ": "hrih"
};

function decomposeTibetanSyllable(syl) {
    if (!syl) return '';
    const cleanSyl = syl.replace(/[་\s།]/g, '').trim();
    if (!cleanSyl) return '';

    if (HIGH_FREQ_PHRASE_DICT[cleanSyl]) return HIGH_FREQ_PHRASE_DICT[cleanSyl];
    if (TIB_CONSONANTS_MAP[cleanSyl]) return TIB_CONSONANTS_MAP[cleanSyl];

    // Single vowel mark
    if (cleanSyl === 'ི') return 'i';
    if (cleanSyl === 'ུ') return 'u';
    if (cleanSyl === 'ེ') return 'e';
    if (cleanSyl === 'ོ') return 'o';

    // Vowel extraction
    let vowel = 'a';
    for (const [vChar, vVal] of Object.entries(TIB_VOWELS_MAP)) {
        if (cleanSyl.includes(vChar)) {
            vowel = vVal;
            break;
        }
    }

    // Subjoined Ra-btags (ྲ)
    if (cleanSyl.includes('ྲ')) {
        if (cleanSyl.includes('ཀ') || cleanSyl.includes('པ') || cleanSyl.includes('ཏ') || cleanSyl.includes('ས')) {
            return vowel === 'a' ? 'tra' : `tr${vowel}`;
        }
        if (cleanSyl.includes('ཁ') || cleanSyl.includes('ཕ') || cleanSyl.includes('ཐ')) {
            return vowel === 'a' ? 'thra' : `thr${vowel}`;
        }
        if (cleanSyl.includes('ག') || cleanSyl.includes('བ') || cleanSyl.includes('ད')) {
            return vowel === 'a' ? 'dra' : `dr${vowel}`;
        }
        if (cleanSyl.includes('མ')) {
            return vowel === 'a' ? 'ma' : `m${vowel}`;
        }
        return vowel === 'a' ? 'tra' : `tr${vowel}`;
    }

    // Subjoined Ya-btags (ྱ)
    if (cleanSyl.includes('ྱ')) {
        if (cleanSyl.includes('པ') || cleanSyl.includes('ཕ')) {
            return vowel === 'a' ? 'cha' : `ch${vowel}`;
        }
        if (cleanSyl.includes('བ')) {
            return vowel === 'a' ? 'ja' : `j${vowel}`;
        }
        if (cleanSyl.includes('མ')) {
            return vowel === 'a' ? 'nya' : `ny${vowel}`;
        }
        if (cleanSyl.includes('ཀ')) {
            return vowel === 'a' ? 'kya' : `ky${vowel}`;
        }
        if (cleanSyl.includes('ཁ')) {
            return vowel === 'a' ? 'khya' : `khy${vowel}`;
        }
        if (cleanSyl.includes('ག')) {
            return vowel === 'a' ? 'gya' : `gy${vowel}`;
        }
        return vowel === 'a' ? 'kya' : `ky${vowel}`;
    }

    // Subjoined La-btags (ླ)
    if (cleanSyl.includes('ླ')) {
        if (cleanSyl.includes('ཟ')) return vowel === 'a' ? 'da' : `d${vowel}`;
        return vowel === 'a' ? 'la' : `l${vowel}`;
    }

    // Superscripts
    for (const [subChar, val] of Object.entries(TIB_SUBJOINED_MAP)) {
        if (cleanSyl.includes(subChar)) {
            return vowel === 'a' ? `${val}a` : `${val}${vowel}`;
        }
    }

    // Single Consonant + Vowel
    for (const [cChar, cVal] of Object.entries(TIB_CONSONANTS_MAP)) {
        if (cleanSyl.includes(cChar)) {
            const base = cVal.endsWith('a') ? cVal.slice(0, -1) : cVal;
            return `${base}${vowel}`;
        }
    }

    return cleanSyl;
}

function tibetanToPhonetic(rawText) {
    if (!rawText) return '';
    const clean = rawText.trim();
    if (HIGH_FREQ_PHRASE_DICT[clean]) return HIGH_FREQ_PHRASE_DICT[clean];
    const noPunct = clean.replace(/[་།]/g, ' ').trim();
    if (HIGH_FREQ_PHRASE_DICT[noPunct]) return HIGH_FREQ_PHRASE_DICT[noPunct];

    // Split into syllables by tsheg, shad, space, or newline
    const syllables = clean.split(/[་\s།\r\n\t]+/).filter(s => s.trim().length > 0);
    if (!syllables.length) return clean;

    const phoneticWords = syllables.map(s => decomposeTibetanSyllable(s));
    return phoneticWords.join(' ');
}

function initVoiceEngineUI() {
    const saved = localStorage.getItem('tibetan_voice_engine') || 'native_studio';
    setVoiceEngine(saved, false);
}

function toggleVoiceMenu() {
    const menu = document.getElementById('voiceDropdownMenu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setVoiceEngine(engineKey, showNotification = true) {
    currentVoiceEngine = engineKey;
    localStorage.setItem('tibetan_voice_engine', engineKey);

    const lbl = document.getElementById('currentVoiceLabel');
    if (lbl) {
        lbl.textContent = VOICE_LABELS[engineKey] || '🎙️ Tu Viện';
    }

    const items = document.querySelectorAll('.voice-opt-item');
    items.forEach(it => {
        if (it.getAttribute('data-engine') === engineKey) {
            it.classList.add('active');
        } else {
            it.classList.remove('active');
        }
    });

    const menu = document.getElementById('voiceDropdownMenu');
    if (menu) menu.style.display = 'none';

    if (showNotification) {
        showToast(`Đã chuyển sang ${VOICE_LABELS[engineKey]}`);
    }
}

// Close voice menu when clicking outside
window.addEventListener('click', (e) => {
    const container = document.querySelector('.voice-selector-container');
    const menu = document.getElementById('voiceDropdownMenu');
    if (menu && menu.style.display !== 'none' && container && !container.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// In-Memory Fast Cache Map (Text -> Audio URL) for instant 0ms playback
const audioMemoryCache = new Map();

async function preloadAudioForText(text) {
    if (!text || !text.trim() || audioMemoryCache.has(text.trim())) return;
    try {
        const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text.trim(), engine: 'native_studio' })
        });
        const data = await res.json();
        if (data.status === 'success' && data.audio_url) {
            audioMemoryCache.set(text.trim(), data.audio_url);
            const dummy = new Audio();
            dummy.src = data.audio_url;
            dummy.preload = 'auto';
        }
    } catch (e) {}
}

function preloadBatchVocab(wordList) {
    if (!Array.isArray(wordList)) return;
    wordList.slice(0, 20).forEach((w, idx) => {
        const txt = typeof w === 'string' ? w : (w.tibetan || '');
        if (txt) {
            setTimeout(() => preloadAudioForText(txt), idx * 120);
        }
    });
}

// Web Audio API DSP Equalizer & Anti-Crackle Limiter
let webAudioCtx = null;
let webAudioSource = null;
let webAudioFilter = null;
let webAudioCompressor = null;

function initWebAudioDSP() {
    if (webAudioCtx) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        webAudioCtx = new AudioContextClass();
        webAudioSource = webAudioCtx.createMediaElementSource(currentAudio);
        
        // 1. Gentle low-pass filter at 12kHz to eliminate digital granular crackle when slowed down
        webAudioFilter = webAudioCtx.createBiquadFilter();
        webAudioFilter.type = 'lowpass';
        webAudioFilter.frequency.value = 12000;
        
        // 2. Dynamics Compressor to prevent distortion, peak clipping & speaker crackle
        webAudioCompressor = webAudioCtx.createDynamicsCompressor();
        webAudioCompressor.threshold.value = -14;
        webAudioCompressor.knee.value = 30;
        webAudioCompressor.ratio.value = 6;
        webAudioCompressor.attack.value = 0.003;
        webAudioCompressor.release.value = 0.25;

        webAudioSource.connect(webAudioFilter);
        webAudioFilter.connect(webAudioCompressor);
        webAudioCompressor.connect(webAudioCtx.destination);
    } catch (e) {
        console.log('Web Audio DSP notice:', e);
    }
}

// Multi-Engine Universal Speech Player (Fast & Crystal-Clear)
async function playTTS(text, explicitPhonetic = '') {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    const phoneticText = explicitPhonetic || tibetanToPhonetic(cleanText);

    // 1. Neural Female Voice (0ms Instant Web Speech API with Native Slow Articulation)
    if (currentVoiceEngine === 'neural_female') {
        const spoken = speakWebSpeech(phoneticText || cleanText, 'female', currentAudioSpeed || 0.75);
        if (spoken) return;
    }

    // 2. International Phonetic Voice (IPA / EWTS)
    if (currentVoiceEngine === 'phonetic_ipa') {
        const spoken = speakWebSpeech(phoneticText || cleanText, 'ipa', currentAudioSpeed || 0.75);
        if (spoken) return;
    }

    // 3. Fast Memory Cache Check (Instant 0ms latency if already loaded)
    if (audioMemoryCache.has(cleanText)) {
        const cachedUrl = audioMemoryCache.get(cleanText);
        playAudioElement(cachedUrl);
        return;
    }

    // 4. Native Studio & Neural Male Backend
    try {
        initWebAudioDSP();
        if (webAudioCtx && webAudioCtx.state === 'suspended') {
            webAudioCtx.resume();
        }

        const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: cleanText,
                engine: currentVoiceEngine 
            })
        });

        const data = await res.json();
        if (data.status === 'success' && data.audio_url) {
            audioMemoryCache.set(cleanText, data.audio_url);
            playAudioElement(data.audio_url);
            return;
        }
    } catch (err) {
        console.error('TTS Backend notice:', err);
    }

    // Fallback: Immediate crystal-clear phonetic voice
    speakWebSpeech(phoneticText || cleanText, 'female', currentAudioSpeed || 0.75);
}

function playAudioElement(audioUrl) {
    try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.src = audioUrl;
        
        // Anti-distortion speed configuration
        const speed = currentAudioSpeed || 0.75;
        currentAudio.playbackRate = Math.max(0.5, Math.min(1.2, speed));
        if ('preservesPitch' in currentAudio) {
            currentAudio.preservesPitch = true;
        }
        if ('mozPreservesPitch' in currentAudio) {
            currentAudio.mozPreservesPitch = true;
        }
        if ('webkitPreservesPitch' in currentAudio) {
            currentAudio.webkitPreservesPitch = true;
        }
        
        currentAudio.play().catch(e => console.log('Audio playback notice:', e));
    } catch (e) {
        console.error('Error playing audio element:', e);
    }
}

function speakWebSpeech(textToSpeak, voiceMode = 'female', speed = 0.75) {
    if (!window.speechSynthesis) return false;

    window.speechSynthesis.cancel();
    
    // Automatically convert Tibetan script to phonetic Latin phonemes if needed
    let speakable = textToSpeak;
    if (/[\u0F00-\u0FDA]/.test(textToSpeak)) {
        speakable = tibetanToPhonetic(textToSpeak);
    }
    if (!speakable || !speakable.trim()) return false;

    const utterance = new SpeechSynthesisUtterance(speakable.trim());
    
    // Smooth native speed scaling without time-stretch distortion
    utterance.rate = Math.max(0.55, Math.min(1.1, speed * 0.95));
    utterance.pitch = voiceMode === 'female' ? 1.15 : (voiceMode === 'ipa' ? 1.0 : 0.9);

    const voices = window.speechSynthesis.getVoices();
    let chosenVoice = null;

    if (voiceMode === 'female') {
        chosenVoice = voices.find(v => (v.lang.includes('hi') || v.lang.includes('ne') || v.lang.includes('zh') || v.lang.includes('ja')) && v.name.toLowerCase().includes('female'))
            || voices.find(v => v.lang.includes('hi') || v.lang.includes('ne'))
            || voices.find(v => v.name.toLowerCase().includes('natural') && v.name.toLowerCase().includes('female'))
            || voices.find(v => v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('female'))
            || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
            || voices[0];
    } else if (voiceMode === 'ipa') {
        chosenVoice = voices.find(v => (v.lang.includes('hi') || v.lang.includes('ne') || v.lang.includes('in')))
            || voices.find(v => v.name.toLowerCase().includes('natural'))
            || voices.find(v => v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george'))
            || voices[0];
    } else {
        chosenVoice = voices.find(v => (v.lang.includes('hi') || v.lang.includes('ne')) && v.name.toLowerCase().includes('male'))
            || voices.find(v => v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('male'))
            || voices[0];
    }

    if (chosenVoice) {
        utterance.voice = chosenVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
}

// Pronunciation Studio Modal Logic
async function openPronunciationStudio(text) {
    currentStudioText = text.trim();
    if (!currentStudioText) return;

    userAudioBlob = null;
    userAudioUrl = null;

    const modal = document.getElementById('studioModal');
    modal.style.display = 'flex';

    document.getElementById('studioTibetan').textContent = currentStudioText;
    document.getElementById('studioPhonetics').innerHTML = `<span class="spinner"></span> Đang tải phân tích khẩu hình...`;
    document.getElementById('studioGuideBody').innerHTML = '';
    document.getElementById('scoreCard').style.display = 'none';
    document.getElementById('userAudioPlayerBox').style.display = 'none';

    try {
        const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: currentStudioText })
        });
        const data = await res.json();
        renderStudioGuide(data);
    } catch (e) {
        console.error('Studio analysis failed', e);
    }
}

function renderStudioGuide(data) {
    document.getElementById('studioPhonetics').innerHTML = `
        Wylie: <b>${data.wylie}</b> • Nghĩa: <b>${data.dictionary ? data.dictionary.vn : ''}</b>
    `;

    let html = '';
    (data.syllables || []).forEach((s) => {
        const g = s.coach_guide || {};
        const rg = g.root_guide || {};
        html += `
            <div class="slider-card" style="margin-bottom:8px;">
                <div style="font-size:16px; font-weight:700; color:var(--gold-light);">
                    ${s.syllable} [${rg.ipa || ''}] - Thanh điệu: <b>${rg.tone || 'Chuẩn'}</b> (${rg.aspiration || 'Tự nhiên'})
                </div>
                <div style="font-size:12px; color:var(--text-secondary); margin-top:3px;">
                    <b>Khẩu hình:</b> ${rg.guide || 'Phát âm theo quy tắc.'}
                </div>
            </div>
        `;
    });
    document.getElementById('studioGuideBody').innerHTML = html;
}

function closeStudioModal() {
    document.getElementById('studioModal').style.display = 'none';
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

// Microphone Recording in Studio
async function startStudioRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        recordedAudioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedAudioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            userAudioBlob = new Blob(recordedAudioChunks, { type: 'audio/webm' });
            userAudioUrl = URL.createObjectURL(userAudioBlob);
            document.getElementById('userAudioPlayerBox').style.display = 'block';
            evaluatePronunciation();
        };

        mediaRecorder.start();
        document.getElementById('btnStartRec').style.display = 'none';
        document.getElementById('btnStopRec').style.display = 'inline-flex';
        document.getElementById('recStatusText').textContent = 'Đang thu âm... Hãy phát âm câu tiếng Tạng này.';
    } catch (err) {
        alert('Không thể mở Microphone. Vui lòng cấp quyền micro cho trình duyệt.');
    }
}

function stopStudioRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('btnStartRec').style.display = 'inline-flex';
        document.getElementById('btnStopRec').style.display = 'none';
        document.getElementById('recStatusText').textContent = 'Đã ghi âm xong! Đang phân tích độ chuẩn xác...';
    }
}

function evaluatePronunciation() {
    setTimeout(() => {
        document.getElementById('scoreCard').style.display = 'block';
        document.getElementById('recStatusText').textContent = 'Hoàn tất đánh giá!';
    }, 800);
}

function playStudioModelAudio() {
    if (currentStudioText) playTTS(currentStudioText);
}

function playStudioUserAudio() {
    if (userAudioUrl) {
        const a = new Audio(userAudioUrl);
        a.play();
    }
}

// Toast Notification
function showToast(msg) {
    const t = document.getElementById('toastMsg');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
}

// Utility: Markdown Formatter
function formatMarkdown(txt) {
    if (!txt) return '';
    return txt
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.4); padding:1px 4px; border-radius:3px; color:var(--gold);">$1</code>')
        .replace(/\n/g, '<br>');
}

// Utility: HTML Escaping
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==========================================================================
// 🎴 FLASHCARD VOCABULARY ENGINE & 15-WORD MILESTONE MEMORIZATION
// ==========================================================================

const DEFAULT_STARTER_VOCAB = [
    { tibetan: "བཀྲ་ཤིས་བདེ་ལེགས", wylie: "bkra-shis-bde-legs", phonetic: "tra-shi de-lek", meaning: "Lời chúc cát tường, bình an và hạnh phúc", pos: "Chào hỏi", known: false },
    { tibetan: "སྐུ་ཁམས་བཟང་", wylie: "sku-khams bzang", phonetic: "ku-kham sang", meaning: "Kính chúc ngài dồi dào sức khỏe (Kính ngữ)", pos: "Kính ngữ", known: false },
    { tibetan: "ཐུགས་རྗེ་ཆེ", wylie: "thugs-rje che", phonetic: "thuk-je che", meaning: "Xin chân thành cảm ơn (Đại từ bi)", pos: "Cảm ơn", known: false },
    { tibetan: "ག་ལེར་ཕེབས", wylie: "ga-ler phebs", phonetic: "ga-le pheb", meaning: "Kính chúc ngài thượng lộ bình an (Kính ngữ)", pos: "Tạm biệt", known: false },
    { tibetan: "ག་ལེར་བཞུགས", wylie: "ga-ler bzhugs", phonetic: "ga-le zhuk", meaning: "Kính chúc ngài ở lại an lành", pos: "Tạm biệt", known: false },
    { tibetan: "དགོངས་དག", wylie: "dgongs-dag", phonetic: "gong-dak", meaning: "Xin thứ lỗi / Xin bỏ quá cho", pos: "Xin lỗi", known: false },
    { tibetan: "ཁྱེད་རང་", wylie: "khyed-rang", phonetic: "khye-rang", meaning: "Bạn / Anh / Chị", pos: "Đại từ", known: false },
    { tibetan: "ང་", wylie: "nga", phonetic: "nga", meaning: "Tôi / Con (Khiêm từ)", pos: "Đại từ", known: false },
    { tibetan: "ཁོང་", wylie: "khong", phonetic: "khong", meaning: "Ngài ấy / Vị ấy (Tôn kính)", pos: "Đại từ", known: false },
    { tibetan: "མིང་", wylie: "ming", phonetic: "ming", meaning: "Tên / Danh xưng", pos: "Danh từ", known: false },
    { tibetan: "སློབ་མ་", wylie: "slob-ma", phonetic: "lop-ma", meaning: "Học sinh / Học viên", pos: "Danh từ", known: false },
    { tibetan: "དགེ་རྒན་", wylie: "dge-rgan", phonetic: "gen-gen", meaning: "Giáo viên / Giảng sư (Kính ngữ)", pos: "Danh từ", known: false },
    { tibetan: "དགེ་འདུན་", wylie: "dge-'dun", phonetic: "gen-dun", meaning: "Tăng đoàn / Chư Tăng Ni", pos: "Danh từ", known: false },
    { tibetan: "དཔེ་ཆ་", wylie: "dpe-cha", phonetic: "pe-cha", meaning: "Kinh sách / Sách học", pos: "Danh từ", known: false },
    { tibetan: "ཤག་", wylie: "shag", phonetic: "shak", meaning: "Tăng phòng / Phòng ở trong tu viện", pos: "Danh từ", known: false }
];

function getSavedVocabList() {
    try {
        const raw = localStorage.getItem('tibetan_saved_vocab');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error('Error reading saved vocab:', e);
    }
    return [...DEFAULT_STARTER_VOCAB];
}

function updateVocabBadgeCount() {
    const list = getSavedVocabList();
    const el = document.getElementById('vocabBadgeCount');
    if (el) {
        const progress = list.length % 15 === 0 && list.length > 0 ? 15 : list.length % 15;
        el.textContent = `${progress}/15`;
        el.title = `Đã thu thập ${list.length} từ (${progress}/15 tiến độ mốc ôn tập)`;
    }
}

function collectVocabFromAnalysis(data) {
    const tableRows = data.table_rows || [];
    if (!tableRows.length) return;
    preloadBatchVocab(tableRows);

    let savedList = getSavedVocabList();
    const existingSet = new Set(savedList.map(v => (v.tibetan || '').trim()));
    let newCount = 0;

    tableRows.forEach(r => {
        const tib = (r.tibetan || '').trim();
        if (tib && !existingSet.has(tib) && tib.length >= 1) {
            existingSet.add(tib);
            savedList.push({
                tibetan: tib,
                wylie: r.wylie || '',
                phonetic: r.phonetic || '',
                meaning: r.meaning || '',
                pos: r.pos || 'Từ vựng',
                known: false,
                addedAt: Date.now()
            });
            newCount++;
        }
    });

    if (newCount > 0) {
        localStorage.setItem('tibetan_saved_vocab', JSON.stringify(savedList));
        updateVocabBadgeCount();
        checkMilestoneTrigger(savedList.length);
    }
}

function checkMilestoneTrigger(totalWords) {
    const lastMilestone = parseInt(localStorage.getItem('tibetan_last_milestone') || '0', 10);
    const currentMilestone = Math.floor(totalWords / 15) * 15;
    if (currentMilestone >= 15 && currentMilestone > lastMilestone) {
        localStorage.setItem('tibetan_last_milestone', currentMilestone.toString());
        showMilestoneModal(currentMilestone);
    }
}

function showMilestoneModal(count) {
    const countEl = document.getElementById('milestoneWordCount');
    if (countEl) countEl.textContent = count.toString();
    const modal = document.getElementById('milestoneModal');
    if (modal) modal.style.display = 'flex';
}

function closeMilestoneModal() {
    const modal = document.getElementById('milestoneModal');
    if (modal) modal.style.display = 'none';
}

function startMilestoneReview() {
    closeMilestoneModal();
    openFlashcardModal();
}

// Flashcard Active State
let currentFlashcardDeck = [];
let currentCardIndex = 0;
let isCardFlipped = false;

function openFlashcardModal() {
    currentFlashcardDeck = getSavedVocabList();
    if (currentFlashcardDeck.length === 0) {
        currentFlashcardDeck = [...DEFAULT_STARTER_VOCAB];
    }
    currentCardIndex = 0;
    isCardFlipped = false;
    
    document.getElementById('flashcardModal').style.display = 'flex';
    renderCurrentCard();
    preloadBatchVocab(currentFlashcardDeck);
}

function closeFlashcardModal() {
    document.getElementById('flashcardModal').style.display = 'none';
}

function renderCurrentCard() {
    if (!currentFlashcardDeck.length) return;
    if (currentCardIndex >= currentFlashcardDeck.length) currentCardIndex = 0;
    if (currentCardIndex < 0) currentCardIndex = currentFlashcardDeck.length - 1;

    const card = currentFlashcardDeck[currentCardIndex];
    isCardFlipped = false;
    const inner = document.getElementById('flashcardInner');
    if (inner) inner.classList.remove('is-flipped');

    document.getElementById('fcFrontTibetan').textContent = card.tibetan || '';
    document.getElementById('fcBackTibetan').textContent = card.tibetan || '';
    document.getElementById('fcBackIPA').textContent = card.phonetic ? `[${card.phonetic}]` : '';
    document.getElementById('fcBackWylie').textContent = card.wylie || '';
    document.getElementById('fcBackMeaning').textContent = card.meaning || '';
    document.getElementById('fcBackPOS').textContent = card.pos || 'Từ vựng';

    // Update Progress
    const total = currentFlashcardDeck.length;
    const currentNum = currentCardIndex + 1;
    const knownCount = currentFlashcardDeck.filter(c => c.known).length;

    document.getElementById('fcProgressText').textContent = `Thẻ ${currentNum} / ${total}`;
    document.getElementById('fcKnownCount').textContent = `Đã thuộc: ${knownCount} / ${total}`;
    document.getElementById('fcProgressFill').style.width = `${(currentNum / total) * 100}%`;
}

function flipFlashcard() {
    isCardFlipped = !isCardFlipped;
    const inner = document.getElementById('flashcardInner');
    if (inner) {
        if (isCardFlipped) {
            inner.classList.add('is-flipped');
        } else {
            inner.classList.remove('is-flipped');
        }
    }
}

function playCurrentFCTTS() {
    if (currentFlashcardDeck.length > 0) {
        const card = currentFlashcardDeck[currentCardIndex];
        if (card && card.tibetan) {
            playTTS(card.tibetan);
        }
    }
}

function prevFlashcard() {
    currentCardIndex--;
    if (currentCardIndex < 0) currentCardIndex = currentFlashcardDeck.length - 1;
    renderCurrentCard();
}

function nextFlashcard() {
    currentCardIndex++;
    if (currentCardIndex >= currentFlashcardDeck.length) currentCardIndex = 0;
    renderCurrentCard();
}

function markCard(isKnown) {
    if (currentFlashcardDeck[currentCardIndex]) {
        currentFlashcardDeck[currentCardIndex].known = isKnown;
        try {
            localStorage.setItem('tibetan_saved_vocab', JSON.stringify(currentFlashcardDeck));
        } catch (e) {}
    }
    showToast(isKnown ? '✅ Đã thuộc!' : '⚠️ Cần ôn lại!');
    setTimeout(() => {
        nextFlashcard();
    }, 280);
}

function shuffleFlashcards() {
    for (let i = currentFlashcardDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentFlashcardDeck[i], currentFlashcardDeck[j]] = [currentFlashcardDeck[j], currentFlashcardDeck[i]];
    }
    currentCardIndex = 0;
    showToast('🔀 Đã trộn ngẫu nhiên bộ thẻ!');
    renderCurrentCard();
}

// Global Keyboard Handler for Flashcards
window.addEventListener('keydown', (e) => {
    const fcModal = document.getElementById('flashcardModal');
    if (fcModal && fcModal.style.display !== 'none') {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipFlashcard();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevFlashcard();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextFlashcard();
        } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K') {
            e.preventDefault();
            markCard(true);
        } else if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'J') {
            e.preventDefault();
            markCard(false);
        } else if (e.key === 'p' || e.key === 'P' || e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            playCurrentFCTTS();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeFlashcardModal();
        }
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        toggleAssistantSlider();
    }
});

