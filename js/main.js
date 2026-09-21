/**
 * Needle Taper Visualizer - Main Engine V2
 * Renders conical taper geometry against dermal strata cross-section.
 * Qualitative trauma and pigment delivery dynamics without handset percentages.
 */

(function() {
    'use strict';

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
        const data = window.TAPER_DATABASE ? window.TAPER_DATABASE[state.taper] : null;
        if (!data) return;

        const needleGroup = document.getElementById('needle-group');
        const taperPath = document.getElementById('needle-taper');
        const shaftRect = document.getElementById('needle-shaft');
        const impactGlow = document.getElementById('impact-glow');
        const measureLine = document.getElementById('taper-measure');
        const measureText = document.getElementById('taper-measure-text');
        const depthValDisplay = document.getElementById('depth-val');

        const traumaBand = document.getElementById('trauma-band');
        const traumaLevelText = document.getElementById('trauma-level-text');
        const traumaDescText = document.getElementById('trauma-desc-text');

        const inkBand = document.getElementById('ink-band');
        const inkLevelText = document.getElementById('ink-level-text');
        const inkDescText = document.getElementById('ink-desc-text');

        const tendencyText = document.getElementById('tendency-text');
        const svgEpidermis = document.getElementById('svg-label-epidermis');
        const svgDermis = document.getElementById('svg-label-dermis');

        const gaugePx = state.gauge * SCALE;
        const taperPx = data.length_mm * SCALE;
        const depthPx = state.depth * SCALE;

        // Translate needle group to anatomical depth
        if (needleGroup) {
            needleGroup.setAttribute('transform', 'translate(0, ' + depthPx + ')');
        }

        // Conical taper path
        const tipX = CENTER_X;
        const tipY = SURFACE_Y;
        const shaftTopY = tipY - taperPx;
        const xLeft = CENTER_X - (gaugePx / 2);
        const xRight = CENTER_X + (gaugePx / 2);

        if (taperPath) {
            const d = 'M ' + tipX + ' ' + tipY + ' L ' + xLeft + ' ' + shaftTopY + ' L ' + xRight + ' ' + shaftTopY + ' Z';
            taperPath.setAttribute('d', d);
        }

        // Shaft geometry
        if (shaftRect) {
            shaftRect.setAttribute('x', xLeft);
            shaftRect.setAttribute('width', gaugePx);
            shaftRect.setAttribute('y', -1000);
            shaftRect.setAttribute('height', 1000 + shaftTopY);
        }

        // Puncture impact glow (scales with entry cone angle)
        if (impactGlow) {
            const glowR = data.trauma_level === 'high' ? 14 : data.trauma_level === 'medium' ? 10 : 7;
            impactGlow.setAttribute('r', glowR);
            impactGlow.setAttribute('class', 'impact-glow impact-' + data.trauma_level);
        }

        // Dimension measurement
        if (measureLine) {
            const measureX = xRight + 24;
            measureLine.setAttribute('x1', measureX);
            measureLine.setAttribute('x2', measureX);
            measureLine.setAttribute('y1', tipY + depthPx);
            measureLine.setAttribute('y2', shaftTopY + depthPx);
        }

        if (measureText) {
            const measureX = xRight + 34;
            measureText.setAttribute('x', measureX);
            measureText.setAttribute('y', ((tipY + shaftTopY) / 2) + depthPx);
            if (typeof window.t === 'function') {
                measureText.textContent = window.t('svg.taper_measure', { length: data.length_mm.toFixed(1) });
            } else {
                measureText.textContent = 'Taper: ' + data.length_mm.toFixed(1) + ' mm';
            }
        }

        // SVG layer labels
        if (svgEpidermis && typeof window.t === 'function') {
            svgEpidermis.textContent = window.t('svg.epidermis');
        }
        if (svgDermis && typeof window.t === 'function') {
            svgDermis.textContent = window.t('svg.dermis');
        }

        // Depth numerical display
        if (depthValDisplay) {
            depthValDisplay.textContent = state.depth.toFixed(1) + ' mm';
        }

        // Qualitative Trauma Card
        if (traumaBand) {
            traumaBand.className = 'qualitative-meter meter-' + data.trauma_level;
        }
        if (traumaLevelText && typeof window.t === 'function') {
            traumaLevelText.textContent = window.t(data.trauma_level_key);
            traumaLevelText.className = 'analysis-level text-' + data.trauma_level;
        }
        if (traumaDescText && typeof window.t === 'function') {
            traumaDescText.textContent = window.t(data.trauma_desc_key);
        }

        // Qualitative Pigment Delivery Card
        if (inkBand) {
            inkBand.className = 'qualitative-meter meter-ink-' + data.ink_level;
        }
        if (inkLevelText && typeof window.t === 'function') {
            inkLevelText.textContent = window.t(data.ink_level_key);
        }
        if (inkDescText && typeof window.t === 'function') {
            inkDescText.textContent = window.t(data.ink_desc_key);
        }

        // Application Tendencies Card
        if (tendencyText && typeof window.t === 'function') {
            tendencyText.textContent = window.t(data.tendency_key);
        }
    }

    // Expose for language changes and test runners
    window.updateVisuals = updateVisuals;

    document.addEventListener('DOMContentLoaded', function() {
        const taperBtns = document.querySelectorAll('.taper-btn');
        const gaugeSelect = document.getElementById('needle-gauge');
        const depthRange = document.getElementById('penetration-depth');
        const langSelect = document.getElementById('lang-select');

        // Taper buttons listener
        taperBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                taperBtns.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                state.taper = btn.getAttribute('data-taper');
                updateVisuals();
            });
        });

        // Gauge listener (visual-only indicator)
        if (gaugeSelect) {
            gaugeSelect.addEventListener('change', function(e) {
                state.gauge = parseFloat(e.target.value);
                updateVisuals();
            });
        }

        // Depth slider listener (visual-only indicator)
        if (depthRange) {
            depthRange.addEventListener('input', function(e) {
                state.depth = parseFloat(e.target.value);
                updateVisuals();
            });
        }

        // Language selection listener
        if (langSelect) {
            // Sync with current language from i18n
            if (window.currentLang) {
                langSelect.value = window.currentLang;
            }
            langSelect.addEventListener('change', function(e) {
                if (typeof window.setLanguage === 'function') {
                    window.setLanguage(e.target.value);
                }
            });
        }

        // Initial sync and render
        if (typeof window.setLanguage === 'function') {
            window.setLanguage(window.currentLang || 'en');
        } else {
            updateVisuals();
        }
    });
})();
