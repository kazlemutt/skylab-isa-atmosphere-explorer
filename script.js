/**
 * SkyLab ISA Atmosphere Explorer — Main Application Logic
 *
 * Implements the International Standard Atmosphere (ISA) troposphere model
 * for altitudes 0–11,000 m with metric/imperial unit display toggle.
 */

// ============================================================
// ISA Constants (SI units)
// ============================================================
const ISA = {
    T0: 288.15,       // Sea-level temperature [K]
    p0: 101325,       // Sea-level pressure [Pa]
    L: 0.0065,        // Temperature lapse rate [K/m]
    g0: 9.80665,      // Gravitational acceleration [m/s²]
    R: 287.05287,     // Specific gas constant for dry air [J/(kg·K)]
    gamma: 1.4        // Ratio of specific heats (diatomic gas)
};

// ============================================================
// Conversion Factors (SI → Imperial/Display)
// ============================================================
const CONV = {
    // Altitude
    m_to_ft: 3.280839895,

    // Temperature
    K_to_C: (K) => K - 273.15,
    C_to_F: (C) => (C * 9/5) + 32,
    K_to_F: (K) => (K - 273.15) * 9/5 + 32,

    // Pressure
    Pa_to_hPa: (Pa) => Pa / 100,
    Pa_to_inHg: (Pa) => Pa * 0.0002952998307,

    // Density
    kgm3_to_slugft3: (kgm3) => kgm3 * 0.00194032033,

    // Speed of sound
    ms_to_kt: (ms) => ms * 1.943844492
};

// ============================================================
// Display Precision Configuration
// ============================================================
const PRECISION = {
    altitude_m: 0,
    altitude_ft: 0,
    temp_C: 1,
    temp_F: 1,
    pressure_hPa: 2,
    pressure_inHg: 2,
    density_kgm3: 3,
    density_slugft3: 4,
    sound_ms: 1,
    sound_kt: 1
};

// ============================================================
// Unit Display Labels
// ============================================================
const UNIT_LABELS = {
    metric: {
        altitude: 'm',
        temperature: '°C',
        pressure: 'hPa',
        density: 'kg/m³',
        sound: 'm/s'
    },
    imperial: {
        altitude: 'ft',
        temperature: '°F',
        pressure: 'inHg',
        density: 'slug/ft³',
        sound: 'kt'
    }
};

// ============================================================
// State
// ============================================================
let state = {
    altitude_m: 0,        // Internal altitude always in metres
    useMetric: true,      // Display units
    isaData: null         // Cached ISA calculations
};

// ============================================================
// DOM Elements Cache
// ============================================================
const els = {};

// ============================================================
// ISA Calculation Functions
// ============================================================

/**
 * Calculate ISA properties at given geopotential altitude (metres)
 * @param {number} h - Altitude in metres (0–11000)
 * @returns {Object} Object with T, p, rho, a in SI units
 */
function calculateISA(h) {
    // Clamp to valid range
    const altitude = Math.max(0, Math.min(11000, h));

    // Temperature: T = T0 - L * h
    const T = ISA.T0 - ISA.L * altitude;

    // Pressure: p = p0 * (T / T0) ^ (g0 / (R * L))
    const exponent = ISA.g0 / (ISA.R * ISA.L);
    const p = ISA.p0 * Math.pow(T / ISA.T0, exponent);

    // Density: rho = p / (R * T)
    const rho = p / (ISA.R * T);

    // Speed of sound: a = sqrt(gamma * R * T)
    const a = Math.sqrt(ISA.gamma * ISA.R * T);

    return { T, p, rho, a };
}

/**
 * Generate ISA density profile data points for chart
 * @param {number} steps - Number of points to generate
 * @returns {Array} Array of {h, rho} objects
 */
function generateDensityProfile(steps = 200) {
    const profile = [];
    for (let i = 0; i <= steps; i++) {
        const h = (11000 * i) / steps;
        const { rho } = calculateISA(h);
        profile.push({ h, rho });
    }
    return profile;
}

// ============================================================
// Display Value Functions (SI → Display Units)
// ============================================================

function getDisplayAltitude(altitude_m) {
    if (state.useMetric) {
        return {
            value: Math.round(altitude_m),
            unit: UNIT_LABELS.metric.altitude,
            precision: PRECISION.altitude_m
        };
    }
    return {
        value: Math.round(altitude_m * CONV.m_to_ft),
        unit: UNIT_LABELS.imperial.altitude,
        precision: PRECISION.altitude_ft
    };
}

function getDisplayTemperature(T_K) {
    if (state.useMetric) {
        const C = CONV.K_to_C(T_K);
        return {
            value: Number(C.toFixed(PRECISION.temp_C)),
            unit: UNIT_LABELS.metric.temperature,
            precision: PRECISION.temp_C
        };
    }
    const F = CONV.K_to_F(T_K);
    return {
        value: Number(F.toFixed(PRECISION.temp_F)),
        unit: UNIT_LABELS.imperial.temperature,
        precision: PRECISION.temp_F
    };
}

function getDisplayPressure(p_Pa) {
    if (state.useMetric) {
        const hPa = CONV.Pa_to_hPa(p_Pa);
        return {
            value: Number(hPa.toFixed(PRECISION.pressure_hPa)),
            unit: UNIT_LABELS.metric.pressure,
            precision: PRECISION.pressure_hPa
        };
    }
    const inHg = CONV.Pa_to_inHg(p_Pa);
    return {
        value: Number(inHg.toFixed(PRECISION.pressure_inHg)),
        unit: UNIT_LABELS.imperial.pressure,
        precision: PRECISION.pressure_inHg
    };
}

function getDisplayDensity(rho_kgm3) {
    if (state.useMetric) {
        return {
            value: Number(rho_kgm3.toFixed(PRECISION.density_kgm3)),
            unit: UNIT_LABELS.metric.density,
            precision: PRECISION.density_kgm3
        };
    }
    const slugft3 = CONV.kgm3_to_slugft3(rho_kgm3);
    return {
        value: Number(slugft3.toFixed(PRECISION.density_slugft3)),
        unit: UNIT_LABELS.imperial.density,
        precision: PRECISION.density_slugft3
    };
}

function getDisplaySpeedOfSound(a_ms) {
    if (state.useMetric) {
        return {
            value: Number(a_ms.toFixed(PRECISION.sound_ms)),
            unit: UNIT_LABELS.metric.sound,
            precision: PRECISION.sound_ms
        };
    }
    const kt = CONV.ms_to_kt(a_ms);
    return {
        value: Number(kt.toFixed(PRECISION.sound_kt)),
        unit: UNIT_LABELS.imperial.sound,
        precision: PRECISION.sound_kt
    };
}

// ============================================================
// Format Number with Fixed Precision
// ============================================================
function formatValue(value, precision) {
    return value.toFixed(precision);
}

// ============================================================
// UI Update Functions
// ============================================================

function updateAltitudeDisplay() {
    const { value, unit } = getDisplayAltitude(state.altitude_m);
    els.altitudeValue.textContent = formatValue(value, 0);
    els.altitudeUnit.textContent = unit;

    // Update slider aria-valuenow (always in metres for accessibility)
    els.altitudeSlider.setAttribute('aria-valuenow', state.altitude_m);
}

function updateResultsDisplay(data) {
    // Temperature
    const temp = getDisplayTemperature(data.T);
    els.tempValue.textContent = formatValue(temp.value, temp.precision);
    els.tempUnit.textContent = temp.unit;

    // Pressure
    const pressure = getDisplayPressure(data.p);
    els.pressureValue.textContent = formatValue(pressure.value, pressure.precision);
    els.pressureUnit.textContent = pressure.unit;

    // Density
    const density = getDisplayDensity(data.rho);
    els.densityValue.textContent = formatValue(density.value, density.precision);
    els.densityUnit.textContent = density.unit;

    // Speed of Sound
    const sound = getDisplaySpeedOfSound(data.a);
    els.soundValue.textContent = formatValue(sound.value, sound.precision);
    els.soundUnit.textContent = sound.unit;
}

function updateAllDisplays() {
    const data = calculateISA(state.altitude_m);
    state.isaData = data;
    updateAltitudeDisplay();
    updateResultsDisplay(data);
    updateChartMarker();
}

// ============================================================
// Unit Toggle
// ============================================================

function toggleUnits() {
    state.useMetric = !state.useMetric;

    // Update toggle switch
    els.unitToggle.setAttribute('aria-checked', state.useMetric);
    els.unitIndicator.textContent = state.useMetric ? 'Metric' : 'Imperial';

    // Update all display values (recalculate from SI)
    if (state.isaData) {
        updateResultsDisplay(state.isaData);
    }
    updateAltitudeDisplay();
    redrawChart(); // Chart axis labels need update
}

// ============================================================
// SVG Chart Drawing
// ============================================================

let densityProfile = null;
const CHART_MARGIN = { top: 30, right: 20, bottom: 40, left: 60 };
const CHART_WIDTH = 400;
const CHART_HEIGHT = 300;
const PLOT_WIDTH = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
const PLOT_HEIGHT = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

function initChart() {
    densityProfile = generateDensityProfile(200);
    drawChart();
}

function drawChart() {
    const svg = els.densityChart;
    svg.innerHTML = '';

    // Set viewBox
    svg.setAttribute('viewBox', `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`);

    // Create main group with margin transform
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${CHART_MARGIN.left}, ${CHART_MARGIN.top})`);
    svg.appendChild(g);

    // Y-axis scale: density from 0 to max (sea level ~1.225)
    const rhoMax = 1.3;
    const rhoMin = 0;
    const hMax = 11000;
    const hMin = 0;

    // Draw grid lines and Y-axis labels
    const yTicks = [0, 0.3, 0.6, 0.9, 1.2];
    yTicks.forEach(rho => {
        const y = PLOT_HEIGHT - ((rho - rhoMin) / (rhoMax - rhoMin)) * PLOT_HEIGHT;

        // Grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('class', 'chart-grid-line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('x2', PLOT_WIDTH);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('y2', y);
        g.appendChild(gridLine);

        // Y-axis label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'chart-label');
        label.setAttribute('x', -8);
        label.setAttribute('y', y);
        label.setAttribute('text-anchor', 'end');
        label.textContent = state.useMetric ? rho.toFixed(1) : (rho * CONV.kgm3_to_slugft3(1)).toFixed(3);
        g.appendChild(label);
    });

    // Y-axis line
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('class', 'chart-axis');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('y2', PLOT_HEIGHT);
    g.appendChild(yAxis);

    // X-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('class', 'chart-axis');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('x2', PLOT_WIDTH);
    xAxis.setAttribute('y1', PLOT_HEIGHT);
    xAxis.setAttribute('y2', PLOT_HEIGHT);
    g.appendChild(xAxis);

    // X-axis labels
    const xTicks = [0, 2750, 5500, 8250, 11000];
    xTicks.forEach(h => {
        const x = ((h - hMin) / (hMax - hMin)) * PLOT_WIDTH;

        // Tick mark
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('class', 'chart-axis');
        tick.setAttribute('x1', x);
        tick.setAttribute('x2', x);
        tick.setAttribute('y1', PLOT_HEIGHT);
        tick.setAttribute('y2', PLOT_HEIGHT + 6);
        g.appendChild(tick);

        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'chart-label');
        label.setAttribute('x', x);
        label.setAttribute('y', PLOT_HEIGHT + 18);
        label.setAttribute('text-anchor', 'middle');
        const displayAlt = getDisplayAltitude(h);
        label.textContent = displayAlt.value.toLocaleString();
        g.appendChild(label);
    });

    // X-axis title
    const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xTitle.setAttribute('class', 'chart-label');
    xTitle.setAttribute('x', PLOT_WIDTH / 2);
    xTitle.setAttribute('y', PLOT_HEIGHT + 36);
    xTitle.setAttribute('text-anchor', 'middle');
    xTitle.style.fontSize = '11px';
    xTitle.style.fill = 'var(--color-text-secondary)';
    xTitle.textContent = `Altitude (${UNIT_LABELS[state.useMetric ? 'metric' : 'imperial'].altitude})`;
    g.appendChild(xTitle);

    // Y-axis title (rotated)
    const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yTitle.setAttribute('class', 'chart-y-label');
    yTitle.setAttribute('transform', `rotate(-90, ${-CHART_MARGIN.left + 15}, ${CHART_MARGIN.top + PLOT_HEIGHT / 2})`);
    yTitle.setAttribute('x', -CHART_MARGIN.left + 15);
    yTitle.setAttribute('y', CHART_MARGIN.top + PLOT_HEIGHT / 2);
    yTitle.setAttribute('text-anchor', 'middle');
    yTitle.textContent = `Density (${UNIT_LABELS[state.useMetric ? 'metric' : 'imperial'].density})`;
    g.appendChild(yTitle);

    // Draw area under curve
    drawArea(g);

    // Draw density curve
    drawCurve(g);

    // Draw marker (initially at sea level)
    drawMarker(g, 0);
}

function drawArea(g) {
    if (!densityProfile) return;

    const rhoMax = 1.3;
    const rhoMin = 0;
    const hMax = 11000;
    const hMin = 0;

    let pathData = `M 0 ${PLOT_HEIGHT}`;

    densityProfile.forEach(point => {
        const x = ((point.h - hMin) / (hMax - hMin)) * PLOT_WIDTH;
        const y = PLOT_HEIGHT - ((point.rho - rhoMin) / (rhoMax - rhoMin)) * PLOT_HEIGHT;
        pathData += ` L ${x} ${y}`;
    });

    pathData += ` L ${PLOT_WIDTH} ${PLOT_HEIGHT} Z`;

    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('class', 'chart-area');
    area.setAttribute('d', pathData);
    g.appendChild(area);
}

function drawCurve(g) {
    if (!densityProfile) return;

    const rhoMax = 1.3;
    const rhoMin = 0;
    const hMax = 11000;
    const hMin = 0;

    let pathData = '';

    densityProfile.forEach((point, i) => {
        const x = ((point.h - hMin) / (hMax - hMin)) * PLOT_WIDTH;
        const y = PLOT_HEIGHT - ((point.rho - rhoMin) / (rhoMax - rhoMin)) * PLOT_HEIGHT;

        if (i === 0) {
            pathData = `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });

    const curve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    curve.setAttribute('class', 'chart-curve');
    curve.setAttribute('d', pathData);
    g.appendChild(curve);
}

function drawMarker(g, altitude_m) {
    // Remove existing marker
    const existingMarker = g.querySelector('.chart-marker-group');
    if (existingMarker) {
        existingMarker.remove();
    }

    const rhoMax = 1.3;
    const rhoMin = 0;
    const hMax = 11000;
    const hMin = 0;

    const data = calculateISA(altitude_m);
    const x = ((altitude_m - hMin) / (hMax - hMin)) * PLOT_WIDTH;
    const y = PLOT_HEIGHT - ((data.rho - rhoMin) / (rhoMax - rhoMin)) * PLOT_HEIGHT;

    const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    markerGroup.setAttribute('class', 'chart-marker-group');

    // Vertical line from curve to x-axis
    const markerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    markerLine.setAttribute('class', 'chart-marker-line');
    markerLine.setAttribute('x1', x);
    markerLine.setAttribute('x2', x);
    markerLine.setAttribute('y1', y);
    markerLine.setAttribute('y2', PLOT_HEIGHT);
    markerGroup.appendChild(markerLine);

    // Circle marker on curve
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marker.setAttribute('class', 'chart-marker');
    marker.setAttribute('cx', x);
    marker.setAttribute('cy', y);
    marker.setAttribute('r', 5);
    markerGroup.appendChild(marker);

    // Altitude label above marker
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'chart-label');
    label.setAttribute('x', x);
    label.setAttribute('y', y - 12);
    label.setAttribute('text-anchor', 'middle');
    label.style.fontWeight = '600';
    label.style.fill = 'var(--color-accent)';
    const displayAlt = getDisplayAltitude(altitude_m);
    label.textContent = `${displayAlt.value.toLocaleString()} ${displayAlt.unit}`;
    markerGroup.appendChild(label);

    // Density value label
    const densityLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    densityLabel.setAttribute('class', 'chart-label');
    densityLabel.setAttribute('x', x);
    densityLabel.setAttribute('y', y - 24);
    densityLabel.setAttribute('text-anchor', 'middle');
    densityLabel.style.fontSize = '9px';
    densityLabel.style.fill = 'var(--color-text-secondary)';
    const displayDensity = getDisplayDensity(data.rho);
    densityLabel.textContent = `ρ = ${displayDensity.value} ${displayDensity.unit}`;
    markerGroup.appendChild(densityLabel);

    g.appendChild(markerGroup);
}

function updateChartMarker() {
    if (!densityProfile) return;
    const g = els.densityChart.querySelector('g');
    if (g) {
        drawMarker(g, state.altitude_m);
    }
}

function redrawChart() {
    drawChart();
}

// ============================================================
// Event Handlers
// ============================================================

function handleSliderInput(event) {
    const newAltitude = parseInt(event.target.value, 10);
    state.altitude_m = newAltitude;
    updateAllDisplays();
}

function handleSliderChange(event) {
    // Same as input for now, but could debounce if needed
    handleSliderInput(event);
}

function handleToggleClick() {
    toggleUnits();
}

function handleToggleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleUnits();
    }
}

function handleKeyboardSlider(event) {
    let newValue = state.altitude_m;
    const step = 50;
    const pageStep = 500;

    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
            event.preventDefault();
            newValue = Math.max(0, state.altitude_m - step);
            break;
        case 'ArrowRight':
        case 'ArrowUp':
            event.preventDefault();
            newValue = Math.min(11000, state.altitude_m + step);
            break;
        case 'PageDown':
            event.preventDefault();
            newValue = Math.max(0, state.altitude_m - pageStep);
            break;
        case 'PageUp':
            event.preventDefault();
            newValue = Math.min(11000, state.altitude_m + pageStep);
            break;
        case 'Home':
            event.preventDefault();
            newValue = 0;
            break;
        case 'End':
            event.preventDefault();
            newValue = 11000;
            break;
        default:
            return;
    }

    state.altitude_m = newValue;
    els.altitudeSlider.value = newValue;
    updateAllDisplays();
}

// ============================================================
// Initialization
// ============================================================

function cacheElements() {
    els.altitudeValue = document.getElementById('altitude-value');
    els.altitudeUnit = document.getElementById('altitude-unit');
    els.altitudeSlider = document.getElementById('altitude-slider');
    els.unitToggle = document.getElementById('unit-toggle');
    els.unitIndicator = document.getElementById('unit-indicator');
    els.densityChart = document.getElementById('density-chart');

    // Result cards
    els.tempValue = document.getElementById('temp-value');
    els.tempUnit = document.getElementById('temp-unit');
    els.pressureValue = document.getElementById('pressure-value');
    els.pressureUnit = document.getElementById('pressure-unit');
    els.densityValue = document.getElementById('density-value');
    els.densityUnit = document.getElementById('density-unit');
    els.soundValue = document.getElementById('sound-value');
    els.soundUnit = document.getElementById('sound-unit');
}

function bindEvents() {
    els.altitudeSlider.addEventListener('input', handleSliderInput);
    els.altitudeSlider.addEventListener('change', handleSliderChange);
    els.altitudeSlider.addEventListener('keydown', handleKeyboardSlider);

    els.unitToggle.addEventListener('click', handleToggleClick);
    els.unitToggle.addEventListener('keydown', handleToggleKeydown);
}

function init() {
    cacheElements();
    bindEvents();
    initChart();
    updateAllDisplays();

    // Verify reference values
    verifyReferenceValues();
}

// ============================================================
// Verification / Self-Test
// ============================================================

function verifyReferenceValues() {
    console.log('=== ISA Reference Value Verification ===');

    // Sea level (0 m)
    const seaLevel = calculateISA(0);
    console.log('At 0 m:');
    console.log(`  T = ${CONV.K_to_C(seaLevel.T).toFixed(1)} °C (expected 15.0)`);
    console.log(`  p = ${CONV.Pa_to_hPa(seaLevel.p).toFixed(2)} hPa (expected 1013.25)`);
    console.log(`  ρ = ${seaLevel.rho.toFixed(3)} kg/m³ (expected 1.225)`);
    console.log(`  a = ${seaLevel.a.toFixed(1)} m/s (expected 340.3)`);

    // 11,000 m
    const tropopause = calculateISA(11000);
    console.log('At 11,000 m:');
    console.log(`  T = ${CONV.K_to_C(tropopause.T).toFixed(1)} °C (expected -56.5)`);
    console.log(`  p = ${CONV.Pa_to_hPa(tropopause.p).toFixed(1)} hPa (expected 226.3)`);
    console.log(`  ρ = ${tropopause.rho.toFixed(3)} kg/m³ (expected 0.364)`);
    console.log(`  a = ${tropopause.a.toFixed(1)} m/s (expected 295.1)`);

    console.log('=== Verification Complete ===');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}