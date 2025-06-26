const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        navItems.forEach(link => link.classList.remove('active'))
        this.classList.add('active');
        const target = this.getAttribute('data-target');
        showPage(target);
      });
    });

    function showPage(pageId) {
      pages.forEach(page => page.classList.remove('active-page'));
      document.getElementById(pageId).classList.add('active-page');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openChapter(chapterId) {
      const activePage = document.querySelector('.page.active-page');
      if (!activePage) return;
      const content = activePage.querySelector('.epic-content');
      if (!content) return;
      const chapters = content.querySelectorAll('.chapter');
      chapters.forEach(ch => ch.style.display = 'none');
      const targetChapter = document.getElementById(chapterId);
      if (targetChapter) {
        targetChapter.style.display = 'block';
        targetChapter.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function showAllChapters(pageId) {
      const page = document.getElementById(pageId);
      if (!page) return;
      const content = page.querySelector('.epic-content');
      if (!content) return;
      const chapters = content.querySelectorAll('.chapter');
      chapters.forEach(ch => ch.style.display = 'block');
    }

    function toggleChapter(header) {
      const content = header.nextElementSibling;
      if (!content.style.display || content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    }

    async function liveTranslateText(text, targetLang) {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        let translatedText = "";
        data[0].forEach(segment => {
          translatedText += segment[0];
        });
        return translatedText;
      } catch (e) {
        console.error("Translation error:", e);
        return text;
      }
    }

    async function translateEpic(pageId, targetLang) {
      const page = document.getElementById(pageId);
      if (!page) return;
      const paragraphs = page.querySelectorAll('.chapter-content p');
      for (const p of paragraphs) {
        // Save the original text once.
        if (!p.dataset.original) {
          p.dataset.original = p.innerHTML;
        }
        if (targetLang === 'en') {
          p.innerHTML = p.dataset.original;
        } else {
          const original = p.dataset.original;
          const translated = await liveTranslateText(original, targetLang);
          p.innerHTML = translated;
        }
      }
    }

    window.addEventListener('scroll', function() {
      const activePage = document.querySelector('.page.active-page');
      if (!activePage) return;
      const pageId = activePage.id;
      const btn = document.getElementById('scrollTop-' + pageId);
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    });

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Store original paragraph text on load.
    window.addEventListener('DOMContentLoaded', () => {
      const paragraphs = document.querySelectorAll('.chapter-content p');
      paragraphs.forEach(p => {
        if (!p.dataset.original) {
          p.dataset.original = p.innerHTML;
        }
      });
    });