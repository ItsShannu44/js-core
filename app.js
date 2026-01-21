// app.js - Complete working version
(function() {
    'use strict';
    
    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
    function initApp() {
        try {
            new MarkdownApp();
        } catch (error) {
            console.error('Failed to start app:', error);
            showError(error);
        }
    }
    
    function showError(error) {
        document.body.innerHTML = `
            <div style="padding: 40px; text-align: center; font-family: Arial;">
                <h2 style="color: #d32f2f;">Application Error</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Reload Application
                </button>
            </div>
        `;
    }
    
    class MarkdownApp {
        constructor() {
            console.log('MarkdownApp starting...');
            this.currentTheme = 'light';
            this.currentDocument = {
                id: this.generateId(),
                title: 'Untitled Document',
                content: '# Welcome to Markdown Editor!\n\nThis is a **pure JavaScript** markdown editor.\n\n## Features:\n- Real-time preview\n- Auto-save\n- Export to files\n- Multiple themes\n\nStart editing on the left!',
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
            console.log('MarkdownApp started successfully!');
        }
        
        createUI() {
            // Clear body and create container
            document.body.innerHTML = '';
            
            const container = document.createElement('div');
            container.className = 'markdown-container';
            
            // Header
            const header = document.createElement('header');
            header.innerHTML = `
                <div class="header-content">
                    <h1><i class="fas fa-markdown"></i> Markdown Editor</h1>
                    <div class="header-controls">
                        <div class="document-title">
                            <input type="text" id="docTitle" placeholder="Document Title" value="${this.currentDocument.title}">
                        </div>
                        <div class="action-buttons">
                            <button id="saveBtn" class="btn-icon" title="Save (Ctrl+S)">
                                <i class="fas fa-save"></i>
                            </button>
                            <button id="exportBtn" class="btn-icon" title="Export">
                                <i class="fas fa-download"></i>
                            </button>
                            <button id="themeBtn" class="btn-icon" title="Toggle Theme">
                                <i class="fas fa-moon"></i>
                            </button>
                            <button id="helpBtn" class="btn-icon" title="Help">
                                <i class="fas fa-question-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Main content
            const main = document.createElement('main');
            main.innerHTML = `
                <div class="editor-panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-edit"></i> Editor</h2>
                        <div class="format-toolbar">
                            <button data-format="# " class="format-btn" title="Heading 1">H1</button>
                            <button data-format="## " class="format-btn" title="Heading 2">H2</button>
                            <button data-format="**" class="format-btn" title="Bold"><b>B</b></button>
                            <button data-format="*" class="format-btn" title="Italic"><i>I</i></button>
                            <button data-format="- " class="format-btn" title="Bullet List">•</button>
                            <button data-format="1. " class="format-btn" title="Numbered List">1.</button>
                            <button data-format="[Link](url)" class="format-btn" title="Link"><i class="fas fa-link"></i></button>
                            <button data-format="\`code\`" class="format-btn" title="Inline Code"><i class="fas fa-code"></i></button>
                            <button data-format="```\n\n```" class="format-btn" title="Code Block"><i class="fas fa-file-code"></i></button>
                        </div>
                    </div>
                    <textarea id="markdownInput" placeholder="Type your markdown here...">${this.currentDocument.content}</textarea>
                </div>
                
                <div class="preview-panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-eye"></i> Preview</h2>
                        <div class="stats">
                            <span id="wordCount">0 words</span>
                            <span id="charCount">0 chars</span>
                        </div>
                    </div>
                    <div id="markdownPreview" class="preview-content"></div>
                </div>
            `;
            
            // Footer
            const footer = document.createElement('footer');
            footer.innerHTML = `
                <div class="footer-content">
                    <div class="status-info">
                        <span id="saveStatus"><i class="fas fa-clock"></i> Not saved yet</span>
                        <span id="lastModified">Last edit: Just now</span>
                    </div>
                    <div class="footer-help">
                        <small>Markdown Guide: # Heading • **Bold** • *Italic* • - List • \`code\` • [Link](url)</small>
                    </div>
                </div>
            `;
            
            // Assemble
            container.appendChild(header);
            container.appendChild(main);
            container.appendChild(footer);
            document.body.appendChild(container);
            
            // Add styles
            this.injectStyles();
            
            // Initial render
            this.renderPreview();
            this.updateStats();
        }
        
        injectStyles() {
            const styles = `
                /* Base Styles */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    background: #f5f5f5;
                    color: #333;
                    line-height: 1.6;
                }
                
                .markdown-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                
                /* Header */
                header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1rem 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .header-content {
                    max-width: 1400px;
                    margin: 0 auto;
                }
                
                .header-content h1 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .header-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .document-title input {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.9);
                    font-size: 1rem;
                    min-width: 300px;
                    outline: none;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 8px;
                }
                
                .btn-icon {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                
                .btn-icon:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                /* Main Content */
                main {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    padding: 20px;
                    flex: 1;
                    overflow: hidden;
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                }
                
                .editor-panel, .preview-panel {
                    display: flex;
                    flex-direction: column;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    overflow: hidden;
                }
                
                .panel-header {
                    padding: 15px 20px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .panel-header h2 {
                    font-size: 1.1rem;
                    color: #495057;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .format-toolbar {
                    display: flex;
                    gap: 5px;
                }
                
                .format-btn {
                    padding: 6px 10px;
                    border: 1px solid #dee2e6;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                
                .format-btn:hover {
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
                    line-height: 1.5;
                    outline: none;
                }
                
                .preview-content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    line-height: 1.7;
                }
                
                .stats {
                    display: flex;
                    gap: 15px;
                    font-size: 0.9rem;
                    color: #6c757d;
                }
                
                /* Preview Styles */
                #markdownPreview h1 {
                    font-size: 2rem;
                    margin: 1.5rem 0 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #e9ecef;
                }
                
                #markdownPreview h2 {
                    font-size: 1.5rem;
                    margin: 1.25rem 0 0.75rem;
                    padding-bottom: 0.3rem;
                    border-bottom: 1px solid #e9ecef;
                }
                
                #markdownPreview h3 {
                    font-size: 1.25rem;
                    margin: 1rem 0 0.5rem;
                }
                
                #markdownPreview p {
                    margin: 1rem 0;
                }
                
                #markdownPreview code {
                    background: #f8f9fa;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-size: 0.9em;
                }
                
                #markdownPreview pre {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 15px;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                
                #markdownPreview pre code {
                    background: none;
                    padding: 0;
                    color: inherit;
                }
                
                #markdownPreview blockquote {
                    border-left: 4px solid #667eea;
                    padding-left: 15px;
                    margin: 1rem 0;
                    color: #6c757d;
                }
                
                #markdownPreview ul, #markdownPreview ol {
                    margin: 1rem 0;
                    padding-left: 2rem;
                }
                
                #markdownPreview li {
                    margin: 0.25rem 0;
                }
                
                #markdownPreview a {
                    color: #667eea;
                    text-decoration: none;
                }
                
                #markdownPreview a:hover {
                    text-decoration: underline;
                }
                
                #markdownPreview hr {
                    border: none;
                    border-top: 1px solid #e9ecef;
                    margin: 2rem 0;
                }
                
                /* Footer */
                footer {
                    background: white;
                    padding: 12px 20px;
                    border-top: 1px solid #e9ecef;
                    font-size: 0.9rem;
                    color: #6c757d;
                }
                
                .footer-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .status-info {
                    display: flex;
                    gap: 20px;
                }
                
                .footer-help small {
                    opacity: 0.8;
                }
                
                /* Responsive */
                @media (max-width: 1024px) {
                    main {
                        grid-template-columns: 1fr;
                        height: auto;
                    }
                    
                    .editor-panel, .preview-panel {
                        min-height: 400px;
                    }
                }
                
                @media (max-width: 768px) {
                    .header-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .document-title input {
                        min-width: auto;
                        width: 100%;
                    }
                    
                    .footer-content {
                        flex-direction: column;
                        gap: 10px;
                        text-align: center;
                    }
                    
                    .status-info {
                        justify-content: center;
                    }
                }
                
                /* Dark Theme */
                body.dark-theme {
                    background: #1a1a1a;
                    color: #e0e0e0;
                }
                
                body.dark-theme .editor-panel,
                body.dark-theme .preview-panel,
                body.dark-theme footer {
                    background: #2d2d2d;
                }
                
                body.dark-theme .panel-header,
                body.dark-theme .header-controls {
                    background: #252525;
                    border-color: #404040;
                }
                
                body.dark-theme #markdownInput {
                    background: #2d2d2d;
                    color: #e0e0e0;
                }
                
                body.dark-theme .format-btn {
                    background: #404040;
                    border-color: #555;
                    color: #e0e0e0;
                }
                
                body.dark-theme .btn-icon {
                    background: rgba(255,255,255,0.1);
                }
            `;
            
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
        
        bindEvents() {
            const input = document.getElementById('markdownInput');
            const titleInput = document.getElementById('docTitle');
            
            // Real-time preview
            input.addEventListener('input', () => {
                this.currentDocument.content = input.value;
                this.currentDocument.lastModified = new Date();
                this.renderPreview();
                this.updateStats();
                this.updateLastModified();
                this.autoSave();
            });
            
            // Document title
            titleInput.addEventListener('input', () => {
                this.currentDocument.title = titleInput.value || 'Untitled Document';
                document.title = `${this.currentDocument.title} - Markdown Editor`;
                this.autoSave();
            });
            
            // Format buttons
            document.querySelectorAll('.format-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const format = btn.dataset.format;
                    this.insertFormatting(format);
                });
            });
            
            // Action buttons
            document.getElementById('saveBtn').addEventListener('click', () => this.saveDocument());
            document.getElementById('exportBtn').addEventListener('click', () => this.exportDocument());
            document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());
            document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.saveDocument();
                }
            });
            
            // Auto-save every 30 seconds
            this.autoSaveInterval = setInterval(() => this.autoSave(), 30000);
        }
        
        insertFormatting(format) {
            const input = document.getElementById('markdownInput');
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const selectedText = input.value.substring(start, end);
            let formattedText;
            
            switch (format) {
                case '# ':
                case '## ':
                case '1. ':
                case '- ':
                    formattedText = format + (selectedText || '');
                    break;
                case '`code`':
                    formattedText = '`' + (selectedText || 'code') + '`';
                    break;
                case '```\n\n```':
                    formattedText = '```\n' + (selectedText || '') + '\n```';
                    break;
                case '[Link](url)':
                    formattedText = `[${selectedText || 'Link'}](url)`;
                    break;
                default:
                    formattedText = format + (selectedText || '') + format;
            }
            
            input.value = input.value.substring(0, start) + formattedText + input.value.substring(end);
            input.focus();
            input.setSelectionRange(start + formattedText.length, start + formattedText.length);
            
            this.currentDocument.content = input.value;
            this.renderPreview();
        }
        
        renderPreview() {
            const preview = document.getElementById('markdownPreview');
            if (preview) {
                preview.innerHTML = this.parseMarkdown(this.currentDocument.content);
            }
        }
        
        parseMarkdown(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
                .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
                .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
                .replace(/^---$/gm, '<hr>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                .replace(/^\s*(\n)?(.+)/gm, function(m) {
                    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img|hr)/.test(m) ? m : '<p>' + m + '</p>';
                });
        }
        
        updateStats() {
            const content = this.currentDocument.content;
            const words = content.trim() ? content.trim().split(/\s+/).length : 0;
            const chars = content.length;
            
            document.getElementById('wordCount').textContent = `${words} words`;
            document.getElementById('charCount').textContent = `${chars} chars`;
        }
        
        updateLastModified() {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById('lastModified').textContent = `Last edit: ${time}`;
        }
        
        autoSave() {
            try {
                localStorage.setItem('markdown_current_doc', JSON.stringify(this.currentDocument));
                document.getElementById('saveStatus').innerHTML = '<i class="fas fa-check-circle"></i> Auto-saved';
                setTimeout(() => {
                    document.getElementById('saveStatus').innerHTML = '<i class="fas fa-clock"></i> All changes saved';
                }, 2000);
                return true;
            } catch (e) {
                document.getElementById('saveStatus').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Save failed';
                return false;
            }
        }
        
        saveDocument() {
            if (this.autoSave()) {
                const btn = document.getElementById('saveBtn');
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                document.getElementById('saveStatus').innerHTML = '<i class="fas fa-check-circle"></i> Saved manually';
                
                setTimeout(() => {
                    btn.innerHTML = original;
                }, 1000);
            }
        }
        
        exportDocument() {
            const content = `# ${this.currentDocument.title}\n\n${this.currentDocument.content}`;
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentDocument.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Visual feedback
            const btn = document.getElementById('exportBtn');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => btn.innerHTML = original, 1000);
        }
        
        toggleTheme() {
            const themeBtn = document.getElementById('themeBtn');
            if (document.body.classList.contains('dark-theme')) {
                document.body.classList.remove('dark-theme');
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('markdown_theme', 'light');
            } else {
                document.body.classList.add('dark-theme');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('markdown_theme', 'dark');
            }
        }
        
        showHelp() {
            alert(`Markdown Editor Help:

Keyboard Shortcuts:
• Ctrl+S: Save document
• Type markdown on left, see preview on right

Formatting:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
- Bullet list
1. Numbered list
\`inline code\`
\`\`\`
code block
\`\`\`
[Link text](url)

Click format buttons above editor for quick formatting!`);
        }
        
        loadFromStorage() {
            try {
                const savedDoc = localStorage.getItem('markdown_current_doc');
                const savedTheme = localStorage.getItem('markdown_theme');
                
                if (savedDoc) {
                    this.currentDocument = JSON.parse(savedDoc);
                }
                
                if (savedTheme === 'dark') {
                    document.body.classList.add('dark-theme');
                    document.getElementById('themeBtn').innerHTML = '<i class="fas fa-sun"></i>';
                }
            } catch (e) {
                console.log('No saved data found');
            }
        }
        
        render() {
            const titleInput = document.getElementById('docTitle');
            const input = document.getElementById('markdownInput');
            
            if (titleInput) titleInput.value = this.currentDocument.title;
            if (input) input.value = this.currentDocument.content;
            
            document.title = `${this.currentDocument.title} - Markdown Editor`;
            this.renderPreview();
            this.updateStats();
            this.updateLastModified();
        }
    }
})();