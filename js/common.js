/**
 * Common studio tool behaviors: theme management, iframe auto-resizing, embed modal.
 * Poli International - Studio Tools Framework
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // ==========================================
        // THEME LOGIC (Dark/Light Mode)
        // ==========================================
        const themeToggle = document.getElementById('darkModeToggle');
        const body = document.body;

        function setTheme(theme, save) {
            if (save === undefined) save = true;
            if (theme === 'light') {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
                if (themeToggle) {
                    const icon = themeToggle.querySelector('.dark-mode-icon');
                    if (icon) icon.textContent = '☀️';
                }
            } else {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
                if (themeToggle) {
                    const icon = themeToggle.querySelector('.dark-mode-icon');
                    if (icon) icon.textContent = '◐';
                }
            }
            if (save) {
                try {
                    localStorage.setItem('theme', theme);
                } catch(e) {}
            }
        }

        // Init theme from storage or system preference
        let savedTheme = 'dark';
        try {
            savedTheme = localStorage.getItem('theme') || 'dark';
        } catch(e) {}
        setTheme(savedTheme, false);

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const current = body.classList.contains('light-mode') ? 'dark' : 'light';
                setTheme(current, true);
            });
        }

        // Listen for messages from parent wrapper if embedded
        window.addEventListener('message', function(event) {
            if (event.data && event.data.theme) {
                setTheme(event.data.theme, true);
            }
        });

        // ==========================================
        // AUTO-RESIZE PARENT IFRAME
        // ==========================================
        function sendHeight() {
            try {
                const height = document.body.scrollHeight + 30;
                window.parent.postMessage({ height: height }, '*');
            } catch(e) {}
        }

        sendHeight();
        window.addEventListener('resize', sendHeight);
        document.addEventListener('click', function() { setTimeout(sendHeight, 100); });
        document.addEventListener('change', function() { setTimeout(sendHeight, 100); });

        // ==========================================
        // EMBED MODAL LOGIC (Accessible modal with hidden attribute)
        // ==========================================
        const embedBtn = document.getElementById('embedBtn');
        const modal = document.getElementById('embedModal');
        const modalClose = document.getElementById('modalClose');
        const copyBtn = document.getElementById('copyEmbedCode');
        const copyBtnText = document.getElementById('copy-btn-text');
        const textarea = document.getElementById('embedCode');

        if (textarea) {
            textarea.value = '<iframe src="https://poliinternational.com/tools/needle-taper-visualizer/index.html" width="100%" height="800" frameborder="0" style="border-radius:12px;"></iframe>';
        }

        function openModal() {
            if (modal) {
                modal.removeAttribute('hidden');
                document.body.style.overflow = 'hidden';
                if (modalClose) modalClose.focus();
            }
        }

        function closeModal() {
            if (modal) {
                modal.setAttribute('hidden', '');
                document.body.style.overflow = '';
                if (embedBtn) embedBtn.focus();
            }
        }

        if (embedBtn && modal) {
            embedBtn.addEventListener('click', openModal);

            if (modalClose) {
                modalClose.addEventListener('click', closeModal);
            }

            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
                    closeModal();
                }
            });
        }

        if (copyBtn && textarea) {
            copyBtn.addEventListener('click', function() {
                textarea.select();
                try {
                    navigator.clipboard.writeText(textarea.value).then(function() {
                        const originalText = (typeof window.t === 'function') ? window.t('modal.copy_btn') : (copyBtnText ? copyBtnText.textContent : 'Copy Code');
                        const copiedText = (typeof window.t === 'function') ? window.t('modal.copied_btn') : 'Copied!';
                        if (copyBtnText) copyBtnText.textContent = copiedText;
                        setTimeout(function() {
                            if (copyBtnText) copyBtnText.textContent = (typeof window.t === 'function') ? window.t('modal.copy_btn') : originalText;
                        }, 2000);
                    });
                } catch(err) {
                    document.execCommand('copy');
                }
            });
        }
    });
})();
