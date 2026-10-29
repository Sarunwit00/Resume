/* ============================================================
   เว็บเรซูเม่ — ศรัณวิชช์ พิบูลย์
   JavaScript ฝั่งผู้ใช้ทั้งหมด ไม่ต้องมีเซิร์ฟเวอร์
     1. สลับภาษาไทย / อังกฤษ
     2. แสดงรูปตัวเองเมื่อมีไฟล์ assets/profile.jpg
     3. กล่องเปิดดู Transcript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- ตัวช่วยจำค่าไว้ในเครื่อง ----------
     localStorage อ่านหรือเขียนไม่ได้ในบางกรณี เช่น หน้าต่างไม่ระบุตัวตน
     หรือเบราว์เซอร์บล็อกข้อมูลเว็บไซต์ จึงต้องครอบ try/catch ทุกครั้ง */
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); }
      catch (err) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); }
      catch (err) { /* จำค่าไม่ได้ก็ไม่เป็นไร หน้าเว็บยังใช้ได้ปกติ */ }
    }
  };

  /* ============================================================
     1. สลับภาษา
     ข้อความทุกจุดเก็บไว้ใน data-th และ data-en ของตัวอิลิเมนต์เอง
     ป้ายสำหรับโปรแกรมอ่านหน้าจอเก็บใน data-th-label และ data-en-label
     คำอธิบายรูปเก็บใน data-th-alt และ data-en-alt
     ============================================================ */
  var LANG_KEY = 'resume-lang';
  var langButtons = document.querySelectorAll('.lang-btn');

  function applyLang(lang) {
    var isEn = lang === 'en';

    document.documentElement.setAttribute('lang', isEn ? 'en' : 'th');

    document.querySelectorAll('[data-th]').forEach(function (el) {
      var next = isEn ? el.getAttribute('data-en') : el.getAttribute('data-th');
      if (next !== null) el.textContent = next;
    });

    document.querySelectorAll('[data-th-label]').forEach(function (el) {
      var next = isEn ? el.getAttribute('data-en-label') : el.getAttribute('data-th-label');
      if (next !== null) el.setAttribute('aria-label', next);
    });

    document.querySelectorAll('[data-th-alt]').forEach(function (el) {
      var next = isEn ? el.getAttribute('data-en-alt') : el.getAttribute('data-th-alt');
      if (next !== null) el.setAttribute('alt', next);
    });

    langButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });

    store.set(LANG_KEY, lang);
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.dataset.lang);
    });
  });

  var savedLang = store.get(LANG_KEY);
  applyLang(savedLang === 'en' ? 'en' : 'th');

  /* ============================================================
     2. รูปตัวเอง
     ช่องรูปแสดงอักษรย่อไว้ก่อน พอวางไฟล์ assets/profile.jpg
     แล้วโหลดสำเร็จ จึงสลับมาแสดงรูปจริง ไม่ต้องแก้โค้ด
     ============================================================ */
  var photo = document.getElementById('profile-photo');
  if (photo) {
    var frame = photo.closest('.photo-frame');
    var showPhoto = function () {
      if (frame && photo.naturalWidth > 0) frame.classList.add('has-photo');
    };
    if (photo.complete) showPhoto();
    photo.addEventListener('load', showPhoto);
  }

  /* ============================================================
     3. กล่องเปิดดู Transcript
     โหลดไฟล์ PDF ตอนกดเปิดครั้งแรก เพื่อไม่ให้หน้าเว็บหนักตอนเข้า
     ============================================================ */
  var dialog = document.getElementById('transcript-dialog');
  var openBtn = document.getElementById('open-transcript');
  var frameEl = document.getElementById('transcript-frame');
  var closeButtons = [
    document.getElementById('close-transcript'),
    document.getElementById('close-transcript-2')
  ];

  function closeDialog() {
    if (dialog && dialog.open) dialog.close();
  }

  if (dialog && openBtn) {
    openBtn.addEventListener('click', function () {
      if (frameEl && frameEl.getAttribute('src') === 'about:blank') {
        frameEl.setAttribute('src', 'assets/transcript.pdf');
      }
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
      } else {
        // เบราว์เซอร์เก่าที่ไม่รู้จัก <dialog> ให้เปิดไฟล์ในแท็บใหม่แทน
        window.open('assets/transcript.pdf', '_blank', 'noopener');
      }
    });

    closeButtons.forEach(function (btn) {
      if (btn) btn.addEventListener('click', closeDialog);
    });

    // คลิกพื้นหลังนอกกล่องเพื่อปิด (กด Esc ใช้ได้เองจาก <dialog>)
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog();
    });
  }
})();
