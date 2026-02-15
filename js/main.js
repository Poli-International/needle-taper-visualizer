document.addEventListener('DOMContentLoaded', function() {
    const taperBtns = document.querySelectorAll('.taper-btn');
    const gaugeSelect = document.getElementById('needle-gauge');
    const depthRange = document.getElementById('penetration-depth');
    const depthValDisplay = document.getElementById('depth-val');
    
    const taperPath = document.getElementById('needle-taper');
    const shaftRect = document.getElementById('needle-shaft');
    const needleGroup = document.getElementById('needle-group');
    const impactGlow = document.getElementById('impact-glow');
    
    const measureLine = document.getElementById('taper-measure');
    const measureText = document.getElementById('taper-measure-text');
    
    const traumaFill = document.getElementById('trauma-fill');
    const inkFill = document.getElementById('ink-fill');
    const traumaText = document.getElementById('trauma-text');
    const inkText = document.getElementById('ink-text');
    const bestUseText = document.getElementById('best-use-text');

    let state = {
        taper: 'short',
        gauge: 0.35,
        depth: 1.5
    };

    const CANVAS_WIDTH = 800;
    const CENTER_X = 400;
    const SURFACE_Y = 300;
    const SCALE = 60; // Pixels per mm

    function updateVisuals() {
        const data = TAPER_DATABASE[state.taper];
        const gaugePx = state.gauge * SCALE;
        const taperPx = data.length_mm * SCALE;
        const depthPx = state.depth * SCALE;

        // Update Needle Position (Anatomical Depth)
        const targetY = SURFACE_Y + depthPx;
        needleGroup.setAttribute('transform', `translate(0, ${depthPx})`);
        
        // Impact glow size
        const glowRadius = (1 - (data.trauma / 100)) * 5 + 5;
        impactGlow.setAttribute('r', (data.trauma / 20) + 10);
        impactGlow.setAttribute('opacity', data.trauma / 200);

        // Update Path - Conical Taper
        // Triangle starting from point (X,Y) up to shaft
        const tipX = CENTER_X;
        const tipY = SURFACE_Y; // The actual point
        
        const shaftTopY = tipY - taperPx;
        const xLeft = CENTER_X - (gaugePx / 2);
        const xRight = CENTER_X + (gaugePx / 2);

        // Path: Move to tip, line to top left, line to top right, close
        const d = `M ${tipX} ${tipY} L ${xLeft} ${shaftTopY} L ${xRight} ${shaftTopY} Z`;
        taperPath.setAttribute('d', d);

        // Update Shaft
        shaftRect.setAttribute('x', xLeft);
        shaftRect.setAttribute('width', gaugePx);
        shaftRect.setAttribute('y', -1000); // Start far up
        shaftRect.setAttribute('height', 1000 + shaftTopY);

        // Update Measurement
        measureLine.setAttribute('x1', xRight + 20);
        measureLine.setAttribute('x2', xRight + 20);
        measureLine.setAttribute('y1', tipY + depthPx);
        measureLine.setAttribute('y2', shaftTopY + depthPx);
        
        measureText.setAttribute('x', xRight + 30);
        measureText.setAttribute('y', (tipY + shaftTopY) / 2 + depthPx);
        measureText.textContent = `Taper: ${data.length_mm}mm`;

        // Update Analysis
        traumaFill.style.width = `${data.trauma}%`;
        inkFill.style.width = `${data.saturation}%`;
        
        traumaText.textContent = data.trauma > 70 ? "High Trauma" : data.trauma > 40 ? "Medium Trauma" : "Low Trauma";
        inkText.textContent = data.saturation > 80 ? "Heavy Saturation" : "Controlled Delivery";
        bestUseText.textContent = data.best_use;

        depthValDisplay.textContent = state.depth + "mm";
    }

    // Listeners
    taperBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            taperBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.taper = btn.dataset.taper;
            updateVisuals();
        });
    });

    gaugeSelect.addEventListener('change', (e) => {
        state.gauge = parseFloat(e.target.value);
        updateVisuals();
    });

    depthRange.addEventListener('input', (e) => {
        state.depth = parseFloat(e.target.value);
        updateVisuals();
    });

    // Init
    updateVisuals();
});
