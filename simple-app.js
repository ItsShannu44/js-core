// simple-app.js - Minimal working version
(function() {
    'use strict';
    
    document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial;">
            <h1>Markdown Editor Test</h1>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 80vh;">
                <div>
                    <h3>Editor</h3>
                    <textarea id="editor" style="width: 100%; height: 300px; padding: 10px;">
# Hello World
This is **bold** and this is *italic*.
- List item 1
- List item 2
                    </textarea>
                </div>
                <div>
                    <h3>Preview</h3>
                    <div id="preview" style="border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: auto;"></div>
                </div>
            </div>
            <button onclick="updatePreview()">Update Preview</button>
        </div>
    `;
    
    function updatePreview() {
        const text = document.getElementById('editor').value;
        const preview = document.getElementById('preview');
        
        // Simple markdown parser
        let html = text
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
            .replace(/\n/g, '<br>');
            
        preview.innerHTML = html;
    }
    
    // Initial preview
    updatePreview();
})();