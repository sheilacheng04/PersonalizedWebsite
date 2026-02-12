// Dynamic Theme Color Changer
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('themeColorSlider');
    const preview = document.getElementById('themePreview');
    const resetBtn = document.getElementById('resetThemeBtn');
    
    if (!slider || !preview) return;
    
    const DEFAULT_HUE = 200; // Default aqua blue hue
    
    // Load saved hue from localStorage
    const savedHue = localStorage.getItem('themeHue') || DEFAULT_HUE;
    slider.value = savedHue;
    
    // Apply theme color based on hue
    function applyThemeColor(hue) {
        const root = document.documentElement;
        
        // Use exact default values for hue 200 (original aqua blue)
        if (hue == DEFAULT_HUE) {
            root.style.setProperty('--theme-light', '100, 180, 220');
            root.style.setProperty('--theme-medium', '58, 138, 184');
            root.style.setProperty('--theme-dark', '0, 60, 120');
            root.style.setProperty('--theme-very-dark', '5, 18, 45');
            root.style.setProperty('--theme-very-light', '120, 200, 255');
            root.style.setProperty('--theme-hue', hue);
        } else {
            // Convert hue to RGB for different shades
            // Light shade (like 100, 180, 220)
            const light = hslToRgb(hue / 360, 0.6, 0.63);
            // Medium shade (like 58, 138, 184)
            const medium = hslToRgb(hue / 360, 0.52, 0.48);
            // Dark shade (like 0, 60, 120)
            const dark = hslToRgb(hue / 360, 1, 0.24);
            // Very dark shade (like 5, 18, 45)
            const veryDark = hslToRgb(hue / 360, 0.8, 0.10);
            // Very light (like 120, 200, 255)
            const veryLight = hslToRgb(hue / 360, 1, 0.74);
            
            // Set CSS custom properties
            root.style.setProperty('--theme-light', `${light[0]}, ${light[1]}, ${light[2]}`);
            root.style.setProperty('--theme-medium', `${medium[0]}, ${medium[1]}, ${medium[2]}`);
            root.style.setProperty('--theme-dark', `${dark[0]}, ${dark[1]}, ${dark[2]}`);
            root.style.setProperty('--theme-very-dark', `${veryDark[0]}, ${veryDark[1]}, ${veryDark[2]}`);
            root.style.setProperty('--theme-very-light', `${veryLight[0]}, ${veryLight[1]}, ${veryLight[2]}`);
            root.style.setProperty('--theme-hue', hue);
        }
        
        // Update preview circle
        preview.style.background = `linear-gradient(135deg, 
            hsl(${hue}, 60%, 63%), 
            hsl(${hue}, 52%, 48%))`;
    }
    
    // HSL to RGB conversion
    function hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    // Event listener for slider
    slider.addEventListener('input', (e) => {
        const hue = e.target.value;
        applyThemeColor(hue);
        localStorage.setItem('themeHue', hue);
    });
    
    // Event listener for reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            slider.value = DEFAULT_HUE;
            applyThemeColor(DEFAULT_HUE);
            localStorage.setItem('themeHue', DEFAULT_HUE);
        });
    }
    
    // Apply initial color
    applyThemeColor(savedHue);
});
