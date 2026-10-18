(function () {
var root = document.querySelector('.c-search-page--default');
if (!root) return;
var input = root.querySelector('.sr-input');
var list = root.querySelector('.sr-results');
var status = root.querySelector('.sr-status');
var bundle = root.getAttribute('data-bundle') || '/fryguide-demo/search/index/';
var empty = root.getAttribute('data-empty') || 'No results';
var pagefind = null;
var timer = 0;
function esc(s) {
return String(s).replace(/[&<>"]/g, function (c) {
return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
});
}
function load() {
if (!pagefind) pagefind = import(bundle + 'pagefind.js');
return pagefind;
}
function run(q) {
if (!q) {
list.innerHTML = '';
status.textContent = '';
return;
}
load()
.then(function (pf) {
return pf.search(q);
})
.then(function (res) {
return Promise.all(
res.results.slice(0, 20).map(function (r) {
return r.data();
})
);
})
.then(function (items) {
status.textContent = items.length ? '' : empty;
list.innerHTML = items
.map(function (d) {
return '<li><a href="' + esc(d.url) + '">' + esc((d.meta && d.meta.title) || d.url) + '</a><p>' + d.excerpt + '</p></li>';
})
.join('');
})
.catch(function () {
status.textContent = empty;
});
}
var q = new URLSearchParams(location.search).get('q') || '';
input.value = q;
run(q);
input.addEventListener('input', function () {
clearTimeout(timer);
timer = setTimeout(function () {
run(input.value.trim());
}, 200);
});
})();