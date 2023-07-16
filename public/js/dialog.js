const isStandalone = () =>  window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://');

document.addEventListener("DOMContentLoaded", () => {
  const dialogButtons = document.querySelectorAll("button[aria-haspopup='dialog']");
  const dialogs = document.querySelectorAll("dialog");

  const hideBodyScrollbar = isOpen => {
    if (isOpen) {
      document.body.style.overflowY = "auto";
      document.body.style.paddingInlineEnd = "0";
    } else {
      document.body.style.overflowY = "hidden";
      document.body.style.paddingInlineEnd = "16px";
    }
  }

  dialogButtons.forEach(button => button.addEventListener("click", e => {
    const dialog = document.getElementById(`${e.target.getAttribute("aria-controls")}`);
    const isOpen = dialog.hasAttribute("open");

    hideBodyScrollbar(isOpen);
    if (isOpen) {
      dialog.close();
      // adjust window history
      if (isStandalone()) {
        window.history.back();
      }
    } else {
      dialog.showModal();

      // disallow end date to be newer than start date
      if (dialog.id === "saveFermentDialog") {
        const todaysdate = new Date().toISOString().split('T')[0];

        dateEnd.setAttribute("min", todaysdate);
      }

      // Check if sharing is enabled
      if (dialog.id === "viewFermentsDialog") {
        if (navigator.canShare)  {
          const shareButtons = document.querySelectorAll("button[data-share]");
          shareButtons.forEach(button => button.removeAttribute("hidden"));
        }
      }

      // Add to history state
      if (isStandalone()) {
        window.history.pushState({ isPopup: true }, 'Dialog');
      }
    }
  }));

  dialogs.forEach(dialog => dialog.addEventListener("cancel", () => {
    const isOpen = dialog.hasAttribute("open");
    
    hideBodyScrollbar(isOpen);
  }));

});

if (isStandalone()) {
  window.addEventListener('popstate', event => {
    // Close dialog when pressing "Back" button while a dialog is open
    if (event.state?.isPopup) {
      document.querySelector("dialog[open]")?.close();
    }
  });
}
