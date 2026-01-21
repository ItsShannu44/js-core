// storageManager.js - FIXED VERSION
(function() {
    'use strict';
    
    const STORAGE_KEY = 'markdown_docs_v2';
    const CURRENT_DOC_KEY = 'current_markdown_doc';
    
    class StorageManager {
        constructor() {
            // Initialize if needed
        }
        
        getAllDocuments() {
            try {
                const docs = localStorage.getItem(STORAGE_KEY);
                return docs ? JSON.parse(docs) : [];
            } catch (e) {
                console.error('Error loading documents:', e);
                return [];
            }
        }
        
        saveDocument(doc) {
            try {
                const docs = this.getAllDocuments();
                const existingIndex = docs.findIndex(d => d.id === doc.id);
                
                if (existingIndex >= 0) {
                    docs[existingIndex] = doc;
                } else {
                    docs.push(doc);
                }
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
                localStorage.setItem(CURRENT_DOC_KEY, JSON.stringify(doc));
                return true;
            } catch (e) {
                console.error('Error saving document:', e);
                return false;
            }
        }
        
        deleteDocument(id) {
            try {
                const docs = this.getAllDocuments();
                const filteredDocs = docs.filter(doc => doc.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDocs));
                return true;
            } catch (e) {
                console.error('Error deleting document:', e);
                return false;
            }
        }
        
        getCurrentDocument() {
            try {
                const doc = localStorage.getItem(CURRENT_DOC_KEY);
                return doc ? JSON.parse(doc) : null;
            } catch (e) {
                console.error('Error loading current document:', e);
                return null;
            }
        }
        
        createNewDocument(title = 'Untitled Document') {
            return {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                title: title,
                content: '# New Document\n\nStart writing here...',
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
        }
        
        exportAllAsJSON() {
            const docs = this.getAllDocuments();
            return JSON.stringify(docs, null, 2);
        }
        
        importFromJSON(json) {
            try {
                const docs = JSON.parse(json);
                if (Array.isArray(docs)) {
                    localStorage.setItem(STORAGE_KEY, json);
                    return docs.length;
                }
                return 0;
            } catch (e) {
                console.error('Error importing documents:', e);
                return 0;
            }
        }
        
        clearAll() {
            try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(CURRENT_DOC_KEY);
                return true;
            } catch (e) {
                console.error('Error clearing storage:', e);
                return false;
            }
        }
    }
    
    // Make it globally available
    window.StorageManager = StorageManager;
})();