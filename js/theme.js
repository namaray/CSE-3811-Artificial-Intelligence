/*
 * Light / dark theme switch.
 *
 * Loaded synchronously in <head> so a saved choice is applied before the
 * first paint. With nothing saved, no attribute is set and the stylesheet
 * follows the operating system's preference on its own.
 */
(function () {
    'use strict';

    var KEY = 'ai-notes-theme';
    var root = document.documentElement;

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

    function current() {
        var t = root.getAttribute('data-theme');
        if (t) return t;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function label(btn) {
        var dark = current() === 'dark';
        btn.textContent = dark ? '☀ Light' : '☾ Dark';
        btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    function mount() {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        label(btn);

        btn.addEventListener('click', function () {
            var next = current() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem(KEY, next); } catch (e) { /* storage blocked */ }
            label(btn);
        });

        // Keep the label right if the OS theme flips while nothing is saved.
        if (window.matchMedia) {
            var mq = window.matchMedia('(prefers-color-scheme: dark)');
            var sync = function () { if (!root.getAttribute('data-theme')) label(btn); };
            if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
        }

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
})();
