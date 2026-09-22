// Application logic to populate links and image from config.js
document.addEventListener("DOMContentLoaded", () => {
  if (typeof CONFIG === "undefined") {
    console.warn("CONFIG object not found. Using default HTML values.");
    return;
  }

  // Update Profile Image & Alt
  const profileImg = document.getElementById("profile-img");
  if (profileImg) {
    if (CONFIG.profileImage) {
      profileImg.src = CONFIG.profileImage;
      profileImg.style.display = "block";
    }
    if (CONFIG.profileAlt) {
      profileImg.alt = CONFIG.profileAlt;
    }
  }

  // Helper function to update href for elements matching data-link attribute
  const updateLinks = (linkKey, url) => {
    if (!url) return;
    const elements = document.querySelectorAll(`[data-link="${linkKey}"]`);
    elements.forEach(el => {
      if (el.tagName.toLowerCase() === "a") {
        el.href = url;
      }
    });
  };

  // Update social links
  updateLinks("whatsapp", CONFIG.whatsapp);
  updateLinks("instagram", CONFIG.instagram);
  updateLinks("linkedin", CONFIG.linkedin);
  updateLinks("youtube", CONFIG.youtube);

  // Update Email link & text display
  if (CONFIG.email) {
    const email = CONFIG.email;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    const emailEls = document.querySelectorAll('[data-link="email"]');

    emailEls.forEach(el => {
      if (el.tagName.toLowerCase() === "a") {
        // Keep a plain web fallback as the href itself (works if JS fails to load,
        // and as the final fallback destination on desktop browsers).
        el.href = gmailWebUrl;

        el.addEventListener("click", (event) => {
          const ua = navigator.userAgent || "";
          const isAndroid = /Android/i.test(ua);
          const isIOS = /iPhone|iPad|iPod/i.test(ua);

          // Desktop: just let the normal href (Gmail web compose) fire.
          if (!isAndroid && !isIOS) return;

          event.preventDefault();

          if (isAndroid) {
            // Android intent URL: opens the Gmail app directly if installed,
            // otherwise falls back to the Gmail web compose URL automatically.
            const intentUrl =
              `intent://co?to=${encodeURIComponent(email)}` +
              `#Intent;scheme=googlegmail;package=com.google.android.gm;` +
              `S.browser_fallback_url=${encodeURIComponent(gmailWebUrl)};end`;
            window.location.href = intentUrl;
            return;
          }

          // iOS: try the Gmail app's URL scheme, then fall back to Gmail web
          // if the app isn't installed (iOS gives no error, it just no-ops).
          let leftPage = false;
          const markLeft = () => { leftPage = true; };
          document.addEventListener("visibilitychange", markLeft, { once: true });
          window.addEventListener("pagehide", markLeft, { once: true });

          window.location.href = `googlegmail://co?to=${encodeURIComponent(email)}`;

          setTimeout(() => {
            if (!leftPage) {
              window.location.href = gmailWebUrl;
            }
          }, 600);
        });
      }
      const emailTextSpan = el.querySelector(".email-text");
      if (emailTextSpan) {
        emailTextSpan.textContent = email;
      }
    });
  }
});
