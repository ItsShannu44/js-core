// exportHandler.js
class ExportHandler {
    constructor() {
        this.formats = {
            markdown: { ext: '.md', mime: 'text/markdown' },
            html: { ext: '.html', mime: 'text/html' },
            pdf: { ext: '.pdf', mime: 'application/pdf' },
            json: { ext: '.json', mime: 'application/json' }
        };
    }
    
    exportAsMarkdown(title, content) {
        return `# ${title}\n\n${content}`;
    }
    
    exportAsHTML(title, content, parser) {
        const parsedContent = parser ? parser.parse(content) : content;
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; }
        code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
        pre { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #6a11cb; padding-left: 15px; color: #666; }
        a { color: #2575fc; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    ${parsedContent}
</body>
</html>`;
    }
    
    exportAsJSON(data) {
        return JSON.stringify(data, null, 2);
    }
    
    downloadFile(filename, content, format = 'markdown') {
        const formatInfo = this.formats[format];
        if (!formatInfo) throw new Error(`Unsupported format: ${format}`);
        
        const blob = new Blob([content], { type: formatInfo.mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename.replace(/\s+/g, '_')}${formatInfo.ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    printDocument(content) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Document</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                ${content}
                <button class="no-print" onclick="window.print()">Print</button>
                <button class="no-print" onclick="window.close()">Close</button>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
    
    copyToClipboard(text) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                const result = document.execCommand('copy');
                document.body.removeChild(textarea);
                return result;
            });
    }
}