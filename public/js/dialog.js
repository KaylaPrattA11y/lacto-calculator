const isStandalone = () =>  window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://');
const hideBodyScrollbar = isOpen => {
  if (isStandalone()) return;
  if (isOpen) {
    document.body.style.overflowY = "auto";
    document.body.style.paddingInlineEnd = "0";
  } else {
    document.body.style.overflowY = "hidden";
    document.body.style.paddingInlineEnd = "16px";
  }
}
const handleClose = dialog => {
  const isOpen = dialog.hasAttribute("open");
  
  if (dialog.id === "myFermentsDialog") {
    // if has URL params, clear them
    let params = new URLSearchParams(location.search);
    if (params.get("showModal")) {
      document.getElementById(params.get("showModal")).showModal();
      params.delete("showModal");
      window.location.search = params.toString();
    } else {
      window.location.reload();
    }
  } else {
    hideBodyScrollbar(!isOpen);
    saveFermentDialog.querySelector("h2").innerText = "Save this ferment";
    saveFermentForm.toggleAttribute("data-edit", false);
    document.getElementById("dateEnd").toggleAttribute("readonly", false);
  }
}

document.addEventListener("click", e => {
  if (!e.target.matches("button[aria-haspopup='dialog']")) return;

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
});

document.addEventListener("DOMContentLoaded", () => {
  const dialogs = document.querySelectorAll("dialog");
  dialogs.forEach(dialog => dialog.addEventListener("close", () => handleClose(dialog)));
});

if (isStandalone()) {
  window.addEventListener('popstate', event => {
    // Close dialog when pressing "Back" button while a dialog is open
    if (event.state?.isPopup) {
      document.querySelector("dialog[open]")?.close();
    }
  });
}
