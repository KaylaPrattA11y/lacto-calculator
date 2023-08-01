class Ferments {
  constructor() {
    this.list = document.getElementById("myFermentsList");
  }

  init() {
    this.build();
    this.addEventListeners();
  }

  addEventListeners = () => {
    this.list.addEventListener("click", e => this.handleClicks(e));
  }

  build() {
    this.list.innerHTML = "";
    sortByNewest(myFermentsStorage).forEach((f) => this.add(f));
    Filter.update();
    fermentsMenu.updateExportButtonAttrs();
  }

  add(f) {
    let time = f.time || "T12:00:00"; // fallback for older versions of ferment data
    const dateStart = new Date(f.dateStart).toISOString().split("T")[0]; // strip out time for older versions of ferment data
    const li = document.createElement("li");
    const ds = new Date(dateStart+time);
    const startDateHasPassed = new Date().getTime() > ds.getTime();
    let de;
    let endDateHasPassed = null;
    let status;
    
    if (f.dateEnd !== "") {
      de = new Date(f.dateEnd+time);
      endDateHasPassed = new Date().getTime() > de.getTime();
    }
    
    const isPast = startDateHasPassed && endDateHasPassed;
    const isCurrent = startDateHasPassed && !endDateHasPassed;
    const isFuture = !startDateHasPassed && !endDateHasPassed;

    if (isPast) {
      status = "past";
    }
    if (isCurrent) {
      status = "current";
    }
    if (isFuture) {
      status = "upcoming";
    }
  
    li.id = f.id;
    li.className = "ferment";
    li.setAttribute("data-status", status);
    li.innerHTML = this.getFermentTemplate(f, ds, de, startDateHasPassed, endDateHasPassed);
    this.list.appendChild(li);
  }

  getFermentData(id) {
    return getObjectWithId(myFermentsStorage, id);
  }

  deleteFerment(id) {
    document.getElementById(id).classList.add("just-deleted");
    setTimeout(() => {
      document.getElementById(id).remove();
      removeObjectWithId(myFermentsStorage, id);
      localStorage.setItem("saved", JSON.stringify(myFermentsStorage));
      document.dispatchEvent(myFermentsModified);
      Filter.update();
      fermentsMenu.updateExportButtonAttrs();
    }, 500);
  }

  deleteAllFerments() {
    localStorage.setItem("saved", "[]");
    document.dispatchEvent(myFermentsModified);
    this.build();
  }

  /**
   * @param {Object} f Ferment object
   * @param {DateConstructor} ds Start Date
   * @param {DateConstructor} de End Date
   * @param {Boolean} startDateHasPassed 
   * @param {Boolean} endDateHasPassed 
   * @returns Template String
   */
  getFermentTemplate = (f, ds, de, startDateHasPassed, endDateHasPassed) => {
    return `
    <div class="ferment-header ferment-tagged" style="--color: ${f.color}">
      <div class="ferment-heading">
        <h3>${f.fermentName}</h3>
      </div>
      <div class="ferment-options">
        <button type="button" class="btn-default" aria-controls="editFermentDialog" aria-haspopup="dialog" data-edit="${f.id}">
          <kay-icon class="carbon:edit" aria-hidden="true"></kay-icon> Edit
        </button>
        <button type="button" class="btn-default" aria-controls="${f.id}" data-share="ferment" ${navigator.canShare ? "" : "hidden"}>
          <kay-icon class="carbon:share" aria-hidden="true"></kay-icon> Share
        </button>
      </div>
    </div>
    <div class="ferment-body">
      <ul class="ferment-details">
        <li>
          <div>Brine:</div>
          <div><span>${formatDecimal(f.brine)}</span><span class="ferment-unit">%</span></div>
        </li>
        <li>
          <div>Weight:</div>
          <div><span>${formatDecimal(f.weight)}</span> <span class="ferment-unit">${f.unit}</span></div>
        </li>
        <li>
          <div>Salt:</div>
          <div><span>${formatDecimal(f.salt)}</span> <span class="ferment-unit">${f.unit}</span></div>
        </li>
      </ul>
      <div class="ferment-relative-time">
        <kay-icon class="carbon:time" aria-hidden="true"></kay-icon> 
        <div class="ferment-started" data-ferment="${startDateHasPassed ? "Started" : "Starts"} " data-relative="start">${formatTimeAgo(ds)}.</div>
        <div class="ferment-done" data-ferment=" ${endDateHasPassed ? "Finished" : "Finishes"} " data-relative="end">${formatTimeAgo(de) !== undefined ? formatTimeAgo(de)+"." : ""}</div>
      </div>
      <div class="ferment-date">
        <kay-icon class="carbon:calendar" aria-hidden="true"></kay-icon> 
        <time datetime="${ds}">${formatDate(ds)}</time>
        <time datetime="${de || ""}">${f.dateEnd === "" ? "" : formatDate(de)}</time>
      </div>
      <p class="ferment-notes" data-ferment="Notes: ">${f.notes}</p>
      <div class="ferment-notify" ${f.dateEnd === "" ? "hidden" : ""} hidden>
        <input id="${f.id}notify" type="checkbox" role="switch" aria-checked="false" data-notify />
        <label for="${f.id}notify">Notify me when this <time datetime="${de || ""}" class="ferment-done" data-ferment=" Finishes " data-relative="end">${formatTimeAgo(de) !== undefined ? formatTimeAgo(de) : ""}</time><label>
      </div>
      <button 
        id="${f.id}deletePrompt" 
        type="button" 
        class="btn-default" 
        aria-controls="${f.id}deleteOptions" 
        aria-expanded="false" 
        data-delete="prompt">
        <kay-icon class="carbon:trash-can" aria-hidden="true"></kay-icon> Delete
      </button>
      <div id="${f.id}deleteOptions" class="ferment-delete-options">
        <p><kay-icon class="carbon:warning" aria-hidden="true"></kay-icon> Are you sure you want to delete this ferment?</p>
        <button 
          type="button" 
          class="btn-primary" 
          aria-controls="${f.id}" 
          data-delete="yes">Yes</button>
        <button 
          type="button" 
          class="btn-default" 
          aria-controls="${f.id}deletePrompt" 
          data-delete="cancel">Cancel</button>
      </div>
    </div>`;
  }

  handleClicks = e => {
    if (e.target.matches("button[data-delete='prompt']")) {
      const isExpanded = e.target.getAttribute("aria-expanded") === "true";
      e.target.setAttribute("aria-expanded", !isExpanded);
    }
    if (e.target.matches("button[data-delete='cancel']")) {
      const deletePrompt = document.getElementById(e.target.getAttribute("aria-controls"));
      deletePrompt.setAttribute("aria-expanded", "false");
    }
    if (e.target.matches("button[data-delete='yes']")) {
      this.deleteFerment(e.target.getAttribute("aria-controls"));
    }
    if (e.target.matches("button[data-edit")) {
      this.handleEdit(e);
    }
    if (e.target.matches("button[data-share='ferment']")) {
      this.handleShare(e);
    }
  }

  handleShare = async e => {
    const id = e.target.getAttribute("aria-controls");
    const { brine, weight, salt, unit, fermentName, dateStart, dateEnd, notes } = this.getFermentData(id);
    const shareData = {
      title: "Brine Calculator | Lacto-fermentation",
      text: `${fermentName} | Start: ${formatDate(dateStart) || ""} | ${dateEnd !== "" ? "End: " + formatDate(dateEnd) + " | " : ""}Brine: ${formatDecimal(brine)}% | Weight: ${formatDecimal(weight)} ${unit} | Salt: ${formatDecimal(salt)} ${unit}${notes ? " | Notes: "+notes : ""}`,
      url: "https://kaylapratta11y.github.io/lacto-calculator/",
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log(err);
    }
  }

  handleEdit = e => {
    const id = e.target.dataset.edit;
    const editFermentFormEl = document.getElementById("editFermentForm");

    editFermentFormEl.setAttribute("data-edit", id);
  }

  get all() {
    return this.list.querySelectorAll(":scope > li");
  }

  get current() {
    return this.list.querySelectorAll(":scope > [data-status='current']");
  }

  get past() {
    return this.list.querySelectorAll(":scope > [data-status='past']");
  }

  get upcoming() {
    return this.list.querySelectorAll(":scope > [data-status='upcoming']");
  }

}

const MyFerments = new Ferments();

document.addEventListener("DOMContentLoaded", () => {
  MyFerments.init();
});
