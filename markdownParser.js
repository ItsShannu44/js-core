class MarkdownParser {
    constructor(options = {}) {
        this.options = {
            allowHTML: false,
            breaks: true,
            ...options
        };
        
        this.rules = this.initRules();
    }

    initRules() {
        return [
            { pattern: /^#{6}\s+(.+)$/gm, replace: '<h6>$1</h6>' },
            { pattern: /^#{5}\s+(.+)$/gm, replace: '<h5>$1</h5>' },
            { pattern: /^#{4}\s+(.+)$/gm, replace: '<h4>$1</h4>' },
            { pattern: /^#{3}\s+(.+)$/gm, replace: '<h3>$1</h3>' },
            { pattern: /^#{2}\s+(.+)$/gm, replace: '<h2>$1</h2>' },
            { pattern: /^#{1}\s+(.+)$/gm, replace: '<h1>$1</h1>' },
            { pattern: /(\*\*|__)(.*?)\1/g, replace: '<strong>$2</strong>' },
            { pattern: /(\*|_)(.*?)\1/g, replace: '<em>$2</em>' },
            { pattern: /~~(.*?)~~/g, replace: '<del>$1</del>' },
            { pattern: /`([^`]+)`/g, replace: '<code>$1</code>' },
            { pattern: /^>\s+(.+)$/gm, replace: '<blockquote>$1</blockquote>' },
            { pattern: /^-\s+(.+)$/gm, replace: '<li>$1</li>' },
            { pattern: /^\d+\.\s+(.+)$/gm, replace: '<li>$1</li>' },
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replace: '<a href="$2" target="_blank">$1</a>' },
            { pattern: /!\[([^\]]+)\]\(([^)]+)\)/g, replace: '<img src="$2" alt="$1">' },
            { pattern: /(\n)?```([a-z]*)\n([\s\S]*?)\n```(\n)?/g, replace: '<pre><code class="$2">$3</code></pre>' },
            { pattern: /---/g, replace: '<hr>' }
        ];
    }
    
    parse(text) {
        if (!this.options.allowHTML) {
            text = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
        
        let html = text;
        
        // Apply all rules
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replace);
        });
        
        // Wrap list items
        html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
        html = html.replace(/<ul>[\s\S]*?<\/ul>/g, match => {
            return match.replace(/<\/ul>\s*<ul>/g, '');
        });
        
        // Handle paragraphs
        html = html.replace(/^\s*(\n)?(.+)/gm, (m, br, line) => {
            return /^\s*<(h\d|ul|ol|li|blockquote|pre|img|hr)/.test(line) ? line : '<p>' + line + '</p>';
        });
        
        // Handle line breaks
        if (this.options.breaks) {
            html = html.replace(/\n/g, '<br>');
        }
        
        return html;
    }
    
    highlightSyntax(code, language) {
        const keywords = {
            javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'try', 'catch'],
            python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'try', 'except'],
            html: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'body', 'head', 'script', 'style']
        };
        
        if (keywords[language]) {
            keywords[language].forEach(keyword => {
                const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
                code = code.replace(regex, '<span class="keyword">$1</span>');
            });
        }
        
        // Highlight string
        code = code.replace(/(["'`])(.*?)\1/g, '<span class="string">$1$2$1</span>');
        
        // Highlight numbers
        code = code.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
        
        // Highlight comments
        code = code.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$1</span>');
        
        return code;
    }
}