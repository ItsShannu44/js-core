// app.js - Main entry point
(function() {
    'use strict';
    
    class MarkdownApp {
        constructor() {
            this.currentTheme = 'light';
            this.currentDocument = {
                id: this.generateId(),
                title: 'Untitled Document',
                content: '# Welcome!\n\nStart typing Markdown here...',
                lastModified: new Date()
            };
            
            this.init();
        }
        
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        
        init() {
            this.createUI();
            this.bindEvents();
            this.loadFromStorage();
            this.render();
        }
        
        createUI() {
            // Create all DOM elements programmatically
            document.body.innerHTML = '';
            
            // Container
            const container = document.createElement('div');
            container.className = 'markdown-container';
            
            // Header
            const header = document.createElement('header');
            header.innerHTML = `
                <h1><i class="fas fa-markdown"></i> Markdown Editor</h1>
                <div class="controls">
                    <button id="saveBtn" title="Save"><i class="fas fa-save"></i></button>
                    <button id="exportBtn" title="Export"><i class="fas fa-download"></i></button>
                    <button id="themeBtn" title="Toggle Theme"><i class="fas fa-moon"></i></button>
                    <input type="text" id="docTitle" placeholder="Document Title" value="${this.currentDocument.title}">
                </div>
            `;
            
            // Main editor area
            const main = document.createElement('main');
            main.innerHTML = `
                <div class="editor-section">
                    <div class="section-header">
                        <h2><i class="fas fa-edit"></i> Editor</h2>
                        <div class="toolbar">
                            <button data-markup="# " title="Heading"><b>H1</b></button>
                            <button data-markup="## " title="Subheading"><b>H2</b></button>
                            <button data-markup="**" title="Bold"><b>B</b></button>
                            <button data-markup="*" title="Italic"><i>I</i></button>
                            <button data-markup="- " title="List">•</button>
                            <button data-markup="[Link](url)" title="Link"><i class="fas fa-link"></i></button>
                            <button data-markup="```code```" title="Code"><i class="fas fa-code"></i></button>
                        </div>
                    </div>
                    <textarea id="markdownInput" placeholder="Type your Markdown here..."></textarea>
                </div>
                
                <div class="preview-section">
                    <div class="section-header">
                        <h2><i class="fas fa-eye"></i> Preview</h2>
                        <span id="wordCount">0 words</span>
                    </div>
                    <div id="preview"></div>
                </div>
            `;
            
            // Footer
            const footer = document.createElement('footer');
            footer.innerHTML = `
                <div class="status-bar">
                    <span id="lastSaved">Not saved yet</span>
                    <span id="charCount">0 characters</span>
                </div>
                <div class="info">
                    <p>Supports: <strong># Headers</strong> • <strong>**Bold**</strong> • <strong>*Italic*</strong> • <strong>- Lists</strong> • <strong>[Links](url)</strong> • <strong>` + '`code`' + `</strong></p>
                </div>
            `;
            
            // Assemble
            container.appendChild(header);
            container.appendChild(main);
            container.appendChild(footer);
            document.body.appendChild(container);
            
            // Add styles
            this.addStyles();
            
            // Set initial content
            document.getElementById('markdownInput').value = this.currentDocument.content;
        }
        
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                body {
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    transition: background-color 0.3s, color 0.3s;
                }
                
                .markdown-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                
                header {
                    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                    color: white;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                header h1 {
                    margin: 0;
                    font-size: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                
                .controls button {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: background 0.3s;
                }
                
                .controls button:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                #docTitle {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.9);
                    font-size: 1rem;
                    min-width: 200px;
                }
                
                main {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    flex: 1;
                    gap: 20px;
                    padding: 20px;
                    overflow: hidden;
                }
                
                .editor-section, .preview-section {
                    display: flex;
                    flex-direction: column;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }
                
                .section-header {
                    background: #f8f9fa;
                    padding: 15px 20px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .section-header h2 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: #495057;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .toolbar {
                    display: flex;
                    gap: 5px;
                }
                
                .toolbar button {
                    padding: 6px 12px;
                    border: 1px solid #dee2e6;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                
                .toolbar button:hover {
                    background: #e9ecef;
                    border-color: #adb5bd;
                }
                
                #markdownInput {
                    flex: 1;
                    padding: 20px;
                    border: none;
                    resize: none;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                #markdownInput:focus {
                    outline: none;
                }
                
                #preview {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: white;
                    line-height: 1.6;
                }
                
                #preview h1 { border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
                #preview h2 { border-bottom: 1px solid #e9ecef; padding-bottom: 5px; }
                #preview h3 { color: #495057; }
                #preview code {
                    background: #f8f9fa;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-size: 0.9em;
                }
                #preview pre {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 15px;
                    border-radius: 6px;
                    overflow-x: auto;
                }
                #preview blockquote {
                    border-left: 4px solid #6a11cb;
                    padding-left: 15px;
                    color: #495057;
                    font-style: italic;
                }
                #preview ul, #preview ol { padding-left: 25px; }
                #preview a { color: #2575fc; text-decoration: none; }
                #preview a:hover { text-decoration: underline; }
                
                footer {
                    background: #f8f9fa;
                    padding: 10px 20px;
                    border-top: 1px solid #e9ecef;
                    font-size: 0.9rem;
                    color: #6c757d;
                }
                
                .status-bar {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                
                .info p {
                    margin: 0;
                    text-align: center;
                }
                
                .info strong {
                    color: #495057;
                }
                
                /* Dark theme */
                body.dark-theme {
                    background: #1a1a1a;
                    color: #e0e0e0;
                }
                
                body.dark-theme .editor-section,
                body.dark-theme .preview-section {
                    background: #2d2d2d;
                }
                
                body.dark-theme .section-header {
                    background: #252525;
                    border-color: #404040;
                }
                
                body.dark-theme #markdownInput {
                    background: #2d2d2d;
                    color: #e0e0e0;
                }
                
                body.dark-theme #preview {
                    background: #2d2d2d;
                    color: #e0e0e0;
                }
                
                body.dark-theme footer {
                    background: #252525;
                    border-color: #404040;
                }
                
                body.dark-theme .toolbar button {
                    background: #404040;
                    border-color: #555;
                    color: #e0e0e0;
                }
                
                @media (max-width: 768px) {
                    main {
                        grid-template-columns: 1fr;
                    }
                    header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        bindEvents() {
            const input = document.getElementById('markdownInput');
            const titleInput = document.getElementById('docTitle');
            
            // Real-time preview
            input.addEventListener('input', () => {
                this.currentDocument.content = input.value;
                this.currentDocument.lastModified = new Date();
                this.renderPreview();
                this.updateCounters();
                this.autoSave();
            });
            
            // Title change
            titleInput.addEventListener('input', () => {
                this.currentDocument.title = titleInput.value;
                document.title = `${titleInput.value} - Markdown Editor`;
            });
            
            // Toolbar buttons
            document.querySelectorAll('.toolbar button').forEach(btn => {
                btn.addEventListener('click', () => {
                    const markup = btn.dataset.markup;
                    this.insertMarkup(markup);
                });
            });
            
            // Control buttons
            document.getElementById('saveBtn').addEventListener('click', () => this.save());
            document.getElementById('exportBtn').addEventListener('click', () => this.export());
            document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
            
            // Auto-save every 30 seconds
            setInterval(() => this.autoSave(), 30000);
            
            // Initialize
            document.title = `${this.currentDocument.title} - Markdown Editor`;
            this.renderPreview();
            this.updateCounters();
        }
        
        insertMarkup(markup) {
            const input = document.getElementById('markdownInput');
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const selectedText = input.value.substring(start, end);
            let newText;
            
            if (markup.includes(' ') && !selectedText) {
                newText = markup;
            } else if (markup === '[Link](url)') {
                newText = `[${selectedText || 'Link'}](url)`;
            } else if (markup === '```code```') {
                newText = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : '```\n\n```';
            } else {
                newText = markup + (selectedText || '') + markup;
            }
            
            input.value = input.value.substring(0, start) + newText + input.value.substring(end);
            input.focus();
            input.setSelectionRange(start + newText.length, start + newText.length);
            
            this.currentDocument.content = input.value;
            this.renderPreview();
        }
        
        renderPreview() {
            const preview = document.getElementById('preview');
            if (preview) {
                preview.innerHTML = this.parseMarkdown(this.currentDocument.content);
            }
        }
        
        parseMarkdown(text) {
            // Basic Markdown parser
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
                .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                .replace(/^\s*(\n)?(.+)/gm, function(m) {
                    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
                });
        }
        
        updateCounters() {
            const content = this.currentDocument.content;
            const words = content.trim() ? content.trim().split(/\s+/).length : 0;
            const chars = content.length;
            
            document.getElementById('wordCount').textContent = `${words} words`;
            document.getElementById('charCount').textContent = `${chars} characters`;
        }
        
        autoSave() {
            try {
                localStorage.setItem('markdown_editor_doc', JSON.stringify(this.currentDocument));
                localStorage.setItem('markdown_editor_theme', this.currentTheme);
                const time = new Date().toLocaleTimeString();
                document.getElementById('lastSaved').textContent = `Auto-saved at ${time}`;
                return true;
            } catch (e) {
                console.error('Auto-save failed:', e);
                return false;
            }
        }
        
        save() {
            if (this.autoSave()) {
                const time = new Date().toLocaleTimeString();
                document.getElementById('lastSaved').textContent = `Saved at ${time}`;
                
                // Visual feedback
                const btn = document.getElementById('saveBtn');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => btn.innerHTML = originalHTML, 1000);
            }
        }
        
        loadFromStorage() {
            try {
                const savedDoc = localStorage.getItem('markdown_editor_doc');
                const savedTheme = localStorage.getItem('markdown_editor_theme');
                
                if (savedDoc) {
                    this.currentDocument = JSON.parse(savedDoc);
                    document.title = `${this.currentDocument.title} - Markdown Editor`;
                }
                
                if (savedTheme) {
                    this.currentTheme = savedTheme;
                    if (this.currentTheme === 'dark') {
                        document.body.classList.add('dark-theme');
                        document.getElementById('themeBtn').innerHTML = '<i class="fas fa-sun"></i>';
                    }
                }
            } catch (e) {
                console.log('No saved data found or error loading');
            }
        }
        
        toggleTheme() {
            const themeBtn = document.getElementById('themeBtn');
            
            if (this.currentTheme === 'light') {
                this.currentTheme = 'dark';
                document.body.classList.add('dark-theme');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                this.currentTheme = 'light';
                document.body.classList.remove('dark-theme');
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            localStorage.setItem('markdown_editor_theme', this.currentTheme);
        }
        
        export() {
            const content = `# ${this.currentDocument.title}\n\n${this.currentDocument.content}`;
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentDocument.title.replace(/\s+/g, '_')}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Visual feedback
            const btn = document.getElementById('exportBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => btn.innerHTML = originalHTML, 1000);
        }
        
        render() {
            // Update UI with current data
            const titleInput = document.getElementById('docTitle');
            const input = document.getElementById('markdownInput');
            
            if (titleInput) titleInput.value = this.currentDocument.title;
            if (input) input.value = this.currentDocument.content;
            
            this.renderPreview();
            this.updateCounters();
        }
    }
    
    // Initialize app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new MarkdownApp());
    } else {
        new MarkdownApp();
    }
})();