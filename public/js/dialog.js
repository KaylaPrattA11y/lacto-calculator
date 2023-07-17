const isStandalone = () =>  window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://');

document.addEventListener("DOMContentLoaded", () => {
  const dialogButtons = document.querySelectorAll("button[aria-haspopup='dialog']");
  const dialogs = document.querySelectorAll("dialog");

  const handleCloseAndCancel = dialog => {
    const isOpen = dialog.hasAttribute("open");
    
    hideBodyScrollbar(isOpen);
    hideDeletePrompts();
    if (dialog.id === "myFermentsDialog") {
      window.location.reload();
    }
    // saveFermentDialog.querySelector("h2").innerText = "Save this ferment";
    // saveFermentForm.toggleAttribute("data-edit", false);
  }

  const hideBodyScrollbar = isOpen => {
    if (isOpen) {
      document.body.style.overflowY = "auto";
      document.body.style.paddingInlineEnd = "0";
    } else {
      document.body.style.overflowY = "hidden";
      document.body.style.paddingInlineEnd = "16px";
    }
  }

  const hideDeletePrompts = () => {
    const deletePromptButtons = document.querySelectorAll("button[data-delete='prompt']");

    deletePromptButtons.forEach(button => button.setAttribute("aria-expanded", "false"));
  }

  dialogButtons.forEach(button => button.addEventListener("click", e => {
    const dialog = document.getElementById(`${e.target.getAttribute("aria-controls")}`);
    const isOpen = dialog.hasAttribute("open");
    const showModal = new CustomEvent("showModal");
    const addOneDay = date => {
      date.setDate(date.getDate() + 1);
      return date;
    }

    hideBodyScrollbar(isOpen);
    if (isOpen) {
      dialog.close();
      // adjust window history
      if (isStandalone()) {
        window.history.back();
      }
    } else {
      dialog.dispatchEvent(showModal);
      dialog.showModal();

      // disallow end date to be newer than start date
      if (dialog.id === "saveFermentDialog") {
        const date = new Date();
        const todaysdate = addOneDay(date).toISOString().split('T')[0];

        dateEnd.setAttribute("min", todaysdate);
      }

      // Add to history state
      if (isStandalone()) {
        window.history.pushState({ isPopup: true }, 'Dialog');
      }
    }
  }));

  dialogs.forEach(dialog => dialog.addEventListener("cancel", () => handleCloseAndCancel(dialog)));
  dialogs.forEach(dialog => dialog.addEventListener("close", () => handleCloseAndCancel(dialog)));

});

if (isStandalone()) {
  window.addEventListener('popstate', event => {
    // Close dialog when pressing "Back" button while a dialog is open
    if (event.state?.isPopup) {
      document.querySelector("dialog[open]")?.close();
    }
  });
}
