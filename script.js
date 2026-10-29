/* ============================================================
   เว็บเรซูเม่ — ศรัณวิชช์ พิบูลย์
   JavaScript ฝั่งผู้ใช้ทั้งหมด ไม่ต้องมีเซิร์ฟเวอร์

     1. ข้อมูลกิจกรรมและผลงาน  <- แก้ตรงนี้เวลาจะเพิ่มรายการใหม่
     2. ฟังก์ชันสร้างรายการขึ้นหน้าเว็บ
     3. สลับภาษาไทย / อังกฤษ
     4. แสดงรูปตัวเองเมื่อมีไฟล์ assets/profile.jpg
     5. กล่องเปิดดู Transcript
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
     1. ข้อมูลกิจกรรมและผลงาน

     ==========  วิธีเพิ่มกิจกรรมใหม่  ==========
     เพิ่มก้อนข้อมูลหนึ่งก้อนต่อท้ายใน ACTIVITIES ข้างล่าง อย่าลืมคอมมาคั่น
     ไม่ต้องไปแตะไฟล์ index.html เลย

         {
           when:   { th: 'ม.ค. 2569', en: 'Jan 2026' },
           name:   'ชื่อกิจกรรม',
           role:   { th: 'บทบาทของคุณ', en: 'Your role' },
           detail: { th: 'คำอธิบายภาษาไทย', en: 'English description' },
           links: [
             { href: 'assets/ชื่อไฟล์.webp', newTab: true,
               label: { th: 'ดูเกียรติบัตร', en: 'View certificate' } }
           ]
         }

     กติกาสั้น ๆ
       - ช่องไหนเป็นข้อความสองภาษา เขียนเป็น { th: '...', en: '...' }
       - ช่องไหนเหมือนกันทั้งสองภาษา เช่น ชื่องาน เขียนเป็นข้อความเปล่า ๆ ได้เลย
       - ช่องไหนไม่มีก็ลบทิ้งได้ เว็บจะข้ามให้เอง เช่น ไม่มีลิงก์ก็ไม่ต้องใส่ links
       - ใส่รายการใหม่ไว้บนสุดถ้าอยากให้เรียงจากล่าสุด
       - ไฟล์เกียรติบัตรให้วางไว้ในโฟลเดอร์ assets/ แล้วอ้างชื่อไฟล์ตามนั้น
     ============================================================ */

  var ACTIVITIES = [
    {
      when:   { th: 'ส.ค. 2568', en: 'Aug 2025' },
      name:   'CDG Hackathon 2025 x 3 พระจอม',
      role:   { th: 'ผู้เข้าร่วมแข่งขัน', en: 'Participant' },
      detail: {
        th: 'แฮกกาธอนที่บริษัท CDG จัดร่วมกับสามสถาบันพระจอมเกล้า คือ มจพ. มจธ. และ สจล. วันที่ 8 สิงหาคม 2568 ณ CDG House กรุงเทพฯ',
        en: 'A hackathon run by CDG together with the three King Mongkut institutes, KMUTNB, KMUTT and KMITL, on 8 August 2025 at CDG House, Bangkok.'
      },
      links: [
        {
          href: 'assets/cert-cdg-hackathon-2025.webp',
          newTab: true,
          label: { th: 'ดูเกียรติบัตร', en: 'View certificate' }
        }
      ]
    }
  ];

  /* ==========  วิธีเพิ่มผลงาน  ==========
     รูปแบบเดียวกัน แต่ช่องต่างกันนิดหน่อย เพิ่มต่อท้ายใน PROJECTS ข้างล่าง

         {
           name: { th: 'ชื่อผลงาน', en: 'Project name' },
           desc: { th: 'ทำอะไร แก้ปัญหาอะไร คุณรับหน้าที่ส่วนไหน',
                   en: 'What it does and your role' },
           tech: 'HTML · CSS · JavaScript',
           links: [
             { href: 'https://github.com/ชื่อผู้ใช้/ชื่อโปรเจกต์', newTab: true,
               label: { th: 'ซอร์สโค้ด', en: 'Source code' } },
             { href: 'https://ลิงก์เว็บจริง', newTab: true,
               label: { th: 'ตัวเว็บ', en: 'Live demo' } }
           ]
         }

     ตอนนี้ยังว่างอยู่ เว็บเลยขึ้นช่องเปล่า 3 ช่องให้เห็นหน้าตาไว้ก่อน
     พอเพิ่มผลงานจริงก้อนแรก ช่องเปล่าจะหายไปเองทั้งหมด */

  var PROJECTS = [
    {
      name: {
        th: 'เว็บถอดเสียงภาษาถิ่นเป็นข้อความไทย',
        en: 'Thai dialect speech-to-text web app'
      },
      desc: {
        th: 'เว็บอัดเสียงหรืออัปโหลดไฟล์แล้วถอดออกมาเป็นข้อความไทย ด้วยโมเดล Wav2Vec2 ที่ fine-tune เอง มีหน้าผู้ดูแลไว้ตรวจและส่งออกประโยคที่ผู้ใช้เสนอเข้ามาเป็นชุดข้อมูลสำหรับเทรนรอบถัดไป ทำเองทั้งฝั่งหน้าเว็บและฝั่งเซิร์ฟเวอร์',
        en: 'Records or uploads audio and transcribes it into Thai text using a Wav2Vec2 model I fine-tuned. An admin page reviews user-submitted sentences and exports them as a training dataset. I built both the front-end and the back-end.'
      },
      image: {
        src: 'assets/project-stt.jpg',
        alt: {
          th: 'หน้าจอเว็บถอดเสียง แสดงส่วนอัดเสียง อัปโหลดไฟล์ และกล่องผลลัพธ์',
          en: 'Screenshot of the app showing the record, upload and output panels'
        }
      },
      tech: 'React · Vite · FastAPI · PyTorch · Wav2Vec2 · SQLite',
      links: [
        {
          href: 'https://github.com/Sarunwit00/Project-Webapp-for-model',
          newTab: true,
          label: { th: 'ซอร์สโค้ด', en: 'Source code' }
        }
      ]
    }
  ];

  /* จำนวนช่องเปล่าที่จะขึ้นตอนยังไม่มีผลงาน */
  var EMPTY_SLOT_COUNT = 3;

  var EMPTY_SLOT = {
    name: { th: 'ชื่อผลงาน', en: 'Project title' },
    desc: {
      th: 'อธิบายสั้น ๆ ว่าผลงานนี้ทำอะไร แก้ปัญหาอะไร และคุณรับหน้าที่ส่วนไหน',
      en: 'Briefly describe what it does, the problem it solves, and your role.'
    },
    tech: { th: 'เทคโนโลยีที่ใช้', en: 'Tech used' },
    links: [
      { href: '#projects', label: { th: 'ซอร์สโค้ด', en: 'Source code' } },
      { href: '#projects', label: { th: 'ตัวเว็บ', en: 'Live demo' } }
    ]
  };

  /* ============================================================
     2. ฟังก์ชันสร้างรายการขึ้นหน้าเว็บ
     ============================================================ */

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  /* ใส่ข้อความลงอิลิเมนต์
     ถ้าเป็น { th, en } จะแปะ data-th กับ data-en ไว้ให้ด้วย
     ตัวสลับภาษาในข้อ 3 จะไปอ่านสองช่องนี้เอง */
  function setText(node, value) {
    if (value && typeof value === 'object') {
      node.setAttribute('data-th', value.th);
      node.setAttribute('data-en', value.en);
      node.textContent = value.th;
    } else {
      node.textContent = value;
    }
    return node;
  }

  function makeLink(item) {
    var a = el('a', 'link');
    a.setAttribute('href', item.href || '#');
    if (item.newTab) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    }
    return setText(a, item.label);
  }

  function makeLinkRow(links, className) {
    if (!links || !links.length) return null;
    var row = el('p', className);
    links.forEach(function (link) { row.appendChild(makeLink(link)); });
    return row;
  }

  function renderActivities() {
    var list = document.getElementById('activity-list');
    if (!list) return;
    list.textContent = '';

    ACTIVITIES.forEach(function (item) {
      var li = el('li', 'record');

      if (item.when)   li.appendChild(setText(el('p', 'chip chip-act'), item.when));
      if (item.name)   li.appendChild(setText(el('h3'), item.name));
      if (item.role)   li.appendChild(setText(el('p', 'record-role'), item.role));
      if (item.detail) li.appendChild(setText(el('p', 'record-line'), item.detail));

      var links = makeLinkRow(item.links, 'record-links');
      if (links) li.appendChild(links);

      list.appendChild(li);
    });
  }

  function renderProjects() {
    var list = document.getElementById('project-list');
    if (!list) return;
    list.textContent = '';

    var hasReal = PROJECTS.length > 0;
    var items = [];

    if (hasReal) {
      items = PROJECTS;
    } else {
      for (var i = 0; i < EMPTY_SLOT_COUNT; i++) items.push(EMPTY_SLOT);
    }

    items.forEach(function (item, index) {
      // ช่องที่มีผลงานจริงจะเป็นกรอบทึบ ช่องเปล่าเป็นกรอบประ
      var li = el('li', hasReal ? 'slot is-filled' : 'slot');

      // ภาพหน้าจอของผลงาน ใส่หรือไม่ใส่ก็ได้
      if (item.image && item.image.src) {
        var shot = el('div', 'slot-shot');
        var img = el('img');
        img.setAttribute('src', item.image.src);
        img.setAttribute('loading', 'lazy');
        if (item.image.alt) {
          // ใช้กลไกเดียวกับรูปโปรไฟล์ ตัวสลับภาษาจะอ่าน data-th-alt / data-en-alt เอง
          img.setAttribute('data-th-alt', item.image.alt.th);
          img.setAttribute('data-en-alt', item.image.alt.en);
          img.setAttribute('alt', item.image.alt.th);
        } else {
          img.setAttribute('alt', '');
        }
        shot.appendChild(img);
        li.appendChild(shot);
      }

      var num = el('p', 'slot-num');
      num.setAttribute('aria-hidden', 'true');
      num.textContent = String(index + 1).padStart(2, '0');
      li.appendChild(num);

      if (item.name) li.appendChild(setText(el('h3'), item.name));
      if (item.desc) li.appendChild(setText(el('p', 'slot-desc'), item.desc));
      if (item.tech) li.appendChild(setText(el('p', 'slot-tech'), item.tech));

      var links = makeLinkRow(item.links, 'slot-links');
      if (links) li.appendChild(links);

      list.appendChild(li);
    });
  }

  // ต้องสร้างรายการให้เสร็จก่อน ตัวสลับภาษาข้างล่างจะได้เห็น data-th ครบ
  renderActivities();
  renderProjects();

  /* ============================================================
     3. สลับภาษา
     ข้อความทุกจุดเก็บไว้ใน data-th และ data-en ของตัวอิลิเมนต์เอง
     ป้ายสำหรับโปรแกรมอ่านหน้าจอเก็บใน data-th-label และ data-en-label
     คำอธิบายรูปเก็บใน data-th-alt และ data-en-alt
     ============================================================ */
  var LANG_KEY = 'resume-lang';
  var langButtons = document.querySelectorAll('.lang-btn');

  function applyLang(lang) {
    var isEn = lang === 'en';

    document.documentElement.setAttribute('lang', isEn ? 'en' : 'th');

    document.querySelectorAll('[data-th]').forEach(function (node) {
      var next = isEn ? node.getAttribute('data-en') : node.getAttribute('data-th');
      if (next !== null) node.textContent = next;
    });

    document.querySelectorAll('[data-th-label]').forEach(function (node) {
      var next = isEn ? node.getAttribute('data-en-label') : node.getAttribute('data-th-label');
      if (next !== null) node.setAttribute('aria-label', next);
    });

    document.querySelectorAll('[data-th-alt]').forEach(function (node) {
      var next = isEn ? node.getAttribute('data-en-alt') : node.getAttribute('data-th-alt');
      if (next !== null) node.setAttribute('alt', next);
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
     4. รูปตัวเอง
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
     5. กล่องเปิดดู Transcript
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
