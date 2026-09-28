/* ============================================================================
   nav-back.js — панель «← Назад к NetAcademy» для симуляторов из папки ./sim/
   ============================================================================

   ЗАЧЕМ
   Раньше лендинг открывал симуляторы через Blob и сам вклеивал кнопку
   «Закрыть» в HTML. Теперь симулятор — отдельный файл, и лендинг не может
   ничего в него вклеить. Этот скрипт добавляет панель сам, если подключить
   его ОДИН раз в каждом файле.

   КАК ПОДКЛЮЧИТЬ (1 строка в каждом из 15 файлов)
   ----------------------------------------------------
   1. Открой файл в папке sim/ в любом текстовом редакторе.
   2. Найди закрывающий тег body:  </body>
   3. Перед ним вставь одну строку:

        <script src="nav-back.js"></script>

      Пример концовки файла:

        ...остальной код симулятора...
        <script src="nav-back.js"></script>
        </body>
        </html>

   4. Сохрани. Панель появится сразу при открытии.

   ЧТО ДЕЛАЕТ
   ----------------------------------------------------
   • Панель в стиле лендинга, закреплена сверху, не перекрывает контент
     (автоматически добавляет отступ 48px, чтобы ничего не спряталось).
   • Кнопка «← НАЗАД»:
       - если симулятор открыт с лендинга  → history.back()  (мгновенно)
       - если открыт напрямую / из закладки → переход на ../ (на index.html)
   • Ничего не ломает, если скрипт подключён дважды — защита от дублей.
   • Работает и на file://, и на http://.

   ХОЧУ СВОЙ ВИД
   ----------------------------------------------------
   Меняй цвета прямо здесь: ACCENT, TITLE, HEIGHT, символ ◀.
   ========================================================================== */

(function () {
  'use strict';

  /* ── защита от повторного подключения ── */
  if (window.__NA_NAVBAR__) return;
  window.__NA_NAVBAR__ = true;

  /* ── настройки ── */
  var HEIGHT = 46;
  var ACCENT = '#4fc3f7';
  var DANGER = '#ff5a5a';
  var TITLE  = 'NET_ACADEMY';
  var HOME   = '../';   /* куда возвращаться, если history.back() некуда */

  var root = document.documentElement;

  /* ── отступ сверху, чтобы контент не уехал под панель ── */
  var spacer = document.createElement('div');
  spacer.style.cssText = 'height:' + HEIGHT + 'px;width:100%;';
  if (document.body) document.body.insertBefore(spacer, document.body.firstChild);
  else document.addEventListener('DOMContentLoaded', function () {
    document.body.insertBefore(spacer, document.body.firstChild);
  });

  /* ── панель ── */
  var bar = document.createElement('div');
  bar.setAttribute('data-netacademy-nav', '1');
  bar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'right:0', 'height:' + HEIGHT + 'px',
    'background:rgba(10,15,26,.97)', 'border-bottom:1px solid #1e3a5f',
    'display:flex', 'align-items:center', 'padding:0 16px', 'gap:14px',
    'z-index:2147483647', 'box-shadow:0 2px 20px rgba(0,0,0,.7)',
    'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
    'box-sizing:border-box'
  ].join(';');

  var left = document.createElement('span');
  left.style.cssText = 'font-family:ui-monospace,Consolas,monospace;font-size:11px;color:' + ACCENT + ';letter-spacing:2px;white-space:nowrap;';
  left.textContent = '⬡ ' + TITLE;

  var spacerFlex = document.createElement('span');
  spacerFlex.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;color:#c8d4e8;font-weight:600;';
  spacerFlex.textContent = document.title || '';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '✕  НАЗАД';
  btn.style.cssText = [
    'background:rgba(255,90,90,.12)', 'border:1px solid rgba(255,90,90,.45)',
    'color:' + DANGER, 'padding:7px 18px', 'border-radius:4px', 'cursor:pointer',
    'font-family:inherit;font-weight:700;font-size:12px', 'letter-spacing:1.5px',
    'white-space:nowrap', 'transition:background .2s'
  ].join(';');
  btn.addEventListener('mouseenter', function () { btn.style.background = 'rgba(255,90,90,.3)'; });
  btn.addEventListener('mouseleave', function () { btn.style.background = 'rgba(255,90,90,.12)'; });

  btn.addEventListener('click', function () {
    /* Если нас открыли с этой же папки (../) — возвращаемся по истории. */
    var ref = document.referrer || '';
    var sameOrigin = false;
    try { sameOrigin = ref && new URL(ref, location.href).origin === location.origin; }
    catch (e) { sameOrigin = false; }

    if (sameOrigin && window.history.length > 1) {
      window.history.back();
    } else if (window.opener) {
      try { window.opener.focus(); window.close(); return; } catch (e) {}
      location.href = HOME;
    } else {
      location.href = HOME;
    }
  });

  bar.appendChild(left);
  bar.appendChild(spacerFlex);
  bar.appendChild(btn);
  (document.body || document.documentElement).appendChild(bar);

  /* ── Alt+← как быстрый возврат ── */
  document.addEventListener('keydown', function (e) {
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'з' || e.key === 'Z')) {
      btn.click();
    }
  });
})();
