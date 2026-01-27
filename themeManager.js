(function() {
    'use strict';
    
    class ThemeManager {
        
        constructor() {
            this.themes = {
                light: {
                    '--bg-primary': '#ffffff',
                    '--bg-secondary': '#f8f9fa',
                    '--text-primary': '#212529',
                    '--text-secondary': '#6c757d',
                    '--accent': '#6a11cb',
                    '--border': '#dee2e6'
                },
                dark: {
                    '--bg-primary': '#1a1a1a',
                    '--bg-secondary': '#2d2d2d',
                    '--text-primary': '#e0e0e0',
                    '--text-secondary': '#a0a0a0',
                    '--accent': '#9d4edd',
                    '--border': '#404040'
                }
            };
            
            this.currentTheme = 'light';
            this.init();
        }
        

        init() {
            this.loadSavedTheme();
            this.applyTheme(this.currentTheme);
        }
        
        applyTheme(themeName) {
            if (this.themes[themeName]) {
                this.currentTheme = themeName;
                this.updateCSSVariables();
                document.body.setAttribute('data-theme', themeName);
                this.saveTheme();
                return true;
            }
            return false;
        }
        

        updateCSSVariables() {
            const theme = this.themes[this.currentTheme];
            let css = ':root {\n';
            
            Object.entries(theme).forEach(([key, value]) => {
                css += `  ${key}: ${value};\n`;
            });
            
            css += '}\n';
            let style = document.getElementById('theme-variables');
            if (!style) {
                style = document.createElement('style');
                style.id = 'theme-variables';
                document.head.appendChild(style);
            }
            style.textContent = css;
        }
        
        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            return this.applyTheme(newTheme);
        }
        
        saveTheme() {
            try {
                localStorage.setItem('markdown_editor_theme', this.currentTheme);
            } catch (e) {
                console.error('Failed to save theme:', e);
            }
        }
        
        loadSavedTheme() {
            try {
                const saved = localStorage.getItem('markdown_editor_theme');
                if (saved && this.themes[saved]) {
                    this.currentTheme = saved;
                }
            } catch (e) {
                console.error('Failed to load theme:', e);
            }
        }
        
        getCurrentTheme() {
            return this.currentTheme;
        }
    }
    window.ThemeManager = ThemeManager;

})();