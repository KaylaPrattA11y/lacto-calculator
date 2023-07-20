const deleteFermentButtons = document.querySelectorAll("button[data-delete]");
const saveFermentForm = document.getElementById("saveFermentForm");
const saveFermentButton = document.getElementById("saveFermentButton");
const saveFermentDialog = document.getElementById("saveFermentDialog");
const myFermentsDialog = document.getElementById("myFermentsDialog");
const fermentNameEl = document.getElementById("fermentName");
const dateEndEl = document.getElementById("dateEnd");
const notesEl = document.getElementById("notes");
const myFermentsList = document.getElementById("myFermentsList");
const myFermentsFilter = document.getElementById("myFermentsFilter");
const myFermentsStorage = JSON.parse(localStorage.getItem("saved")) || [];
const formatDecimal = (number) => new Intl.NumberFormat("default", { maximumSignificantDigits: 3 }).format(number);
const addOneDay = date => {
  date.setDate(date.getDate() + 1);
  return date;
}

const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
})
const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
]
function formatTimeAgo(date) {
  let duration = (date - new Date()) / 1000

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name)
    }
    duration /= division.amount
  }
}

const addFerment = (f) => {
  const li = document.createElement("li");
  const ds = new Date(f.dateStart);
  let de;
  let dateHasPassed = false;
  
  if (f.dateEnd !== "") {
    de = new Date(f.dateEnd);
    dateHasPassed = de.getTime() < new Date().getTime();
  }

  li.setAttribute("data-complete", dateHasPassed);
  li.id = f.id;
  li.className = "ferment";
  li.innerHTML = `
    <div class="ferment-header ferment-tagged" style="--color: ${f.color}">
      <div class="ferment-heading">
        <h3>${f.fermentName}</h3>
      </div>
      <div class="ferment-options">
        <button type="button" class="btn-default" aria-controls="saveFermentDialog" aria-haspopup="dialog" data-edit="${f.id}">
          <kay-icon class="carbon:edit" aria-hidden="true"></kay-icon> Edit
        </button>
        <button type="button" class="btn-default" aria-controls="${f.id}" data-share="ferment">
          <kay-icon class="carbon:share" aria-hidden="true"></kay-icon> Share
        </button>
      </div>
    </div>
    <div class="ferment-body">
      <ul class="ferment-details">
        <li>
          <div>Brine:</div>
          <div><span>${f.brine}</span><span class="ferment-unit">%</span></div>
        </li>
        <li>
          <div>Weight:</div>
          <div><span>${f.weight}</span> <span class="ferment-unit">${f.unit}</span></div>
        </li>
        <li>
          <div>Salt:</div>
          <div><span>${f.salt}</span> <span class="ferment-unit">${f.unit}</span></div>
        </li>
      </ul>
      <div class="ferment-relative-time">
        <kay-icon class="carbon:time" aria-hidden="true"></kay-icon> 
        <time datetime="${ds}" class="ferment-started" data-ferment="Started " data-relative="start">${formatTimeAgo(ds)}.</time>
        <time datetime="${de || ""}" class="ferment-done" data-ferment=" ${dateHasPassed ? "Finished" : "Finishes"} " data-relative="end">${formatTimeAgo(de) !== undefined ? formatTimeAgo(de)+"." : ""}</time>
      </div>
      <div class="ferment-date">
        <kay-icon class="carbon:calendar" aria-hidden="true"></kay-icon> 
        <time datetime="${ds}">${formatDate(f.dateStart)}</time>
        <time datetime="${de || ""}">${f.dateEnd === "" ? "" : formatDate(f.dateEnd)}</time>
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
        <p>Are you sure you want to delete this ferment?</p>
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
  myFermentsList.insertAdjacentElement("afterbegin", li);
};

const addFerments = (myFermentsStorage) => {
  if (!myFermentsStorage) return;
  myFermentsStorage.forEach((f) => addFerment(f));
};

const getObjectWithId = (arr, id) => {
  const objWithIdIndex = arr.findIndex(obj => obj.id === id);

  return arr[objWithIdIndex];
}

const removeObjectWithId = (arr, id) => {
  const objWithIdIndex = arr.findIndex(obj => obj.id === id);

  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1);
  }
  return arr;
}

const replaceObjectWithId = (arr, id, newObj) => {
  const objWithIdIndex = arr.findIndex(obj => obj.id === id);
  
  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1, newObj);
  }
  return arr;
}

const formatDate = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })?.format(d);
}

const handleShare = button => {
  button.addEventListener("click", async () => {
    const id = button.getAttribute("aria-controls");
    const { brine, weight, salt, unit, fermentName, dateStart, dateEnd, notes } = getObjectWithId(myFermentsStorage, id);
    const shareData = {
      title: "Brine Calculator | Lacto-fermentation",
      text: `${fermentName ? fermentName+" | " : ""}Started: ${formatDate(dateStart) || ""}, Finishes: ${formatDate(dateEnd) || ""}, Brine: ${formatDecimal(brine)}%, Weight: ${formatDecimal(weight)} ${unit}, Salt: ${formatDecimal(salt)} ${unit}, ${notes ? "Notes: "+notes : ""}`,
      url: "https://kaylapratta11y.github.io/lacto-calculator/",
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log(err);
    }
  });
}

const handleDeletePrompt = button => {
  const isExpanded = button.getAttribute("aria-expanded") === "true";

  button.setAttribute("aria-expanded", !isExpanded);
}

const handleDeleteCancel = button => {
  const deletePrompt = document.getElementById(button.getAttribute("aria-controls"));

  deletePrompt.setAttribute("aria-expanded", "false");
}

const handleDelete = button => {
  const myFermentsStorage = JSON.parse(localStorage.getItem("saved"));
  const id = button.getAttribute("aria-controls");
  
  document.getElementById(id).remove();
  removeObjectWithId(myFermentsStorage, id);
  localStorage.setItem("saved", JSON.stringify(myFermentsStorage));

  //get new .ferment item data
  const totalLength = myFermentsList.childElementCount;
  const inProgressLength = [...myFermentsList.querySelectorAll(".ferment")].filter(f => f.dataset.complete === "false").length;
  const completedLength = [...myFermentsList.querySelectorAll(".ferment")].filter(f => f.dataset.complete === "true").length;

  // update filter button length counter
  myFermentsFilter.querySelectorAll("button").forEach(button => {
    if (button.dataset.value === "0") {
      button.setAttribute("data-length", totalLength);
    }
    if (button.dataset.value === "1") {
      button.setAttribute("data-length", inProgressLength);
    }
    if (button.dataset.value === "2") {
      button.setAttribute("data-length", completedLength);
    }
  });
}

const handleEditDialog = button => {
  const myFermentsStorage = JSON.parse(localStorage.getItem("saved"));
  const id = button.dataset.edit;
  const { brine, weight, salt, unit, color, dateEnd, fermentName, notes } = getObjectWithId(myFermentsStorage, id);
  const todaysdate = addOneDay(new Date()).toISOString().split('T')[0];
  const dateHasPassed = new Date(dateEnd).getTime() < new Date().getTime();

  saveFermentDialog.querySelector("h2").innerText = "Edit this ferment";
  saveFermentForm.setAttribute("data-edit", id);
  saveFermentForm.querySelector("[data-label='brine']").innerText = brine;
  saveFermentForm.querySelector("[data-label='weight']").innerText = weight;
  saveFermentForm.querySelector("[data-label='salt']").innerText = salt;
  saveFermentForm.querySelectorAll("[data-label='unit']").forEach(u => u.innerText = unit);
  dateEndEl.value = dateEnd;
  dateEndEl.setAttribute("min", dateHasPassed ? dateEnd : todaysdate);
  fermentNameEl.value = fermentName;
  notesEl.value = notes;
  document.querySelector(`[name='color'][value='${color}']`).checked = true;
}

document.addEventListener("DOMContentLoaded", () => {

  // check for URL params that open a modal
  let params = new URLSearchParams(location.search);
  if (params.get("showModal")) {
    document.getElementById(params.get("showModal")).showModal();
  }

  // build ferments list
  addFerments(myFermentsStorage);
});

document.addEventListener("click", e => {

  // toggle delete prompt
  if (e.target.matches("button[data-delete='prompt']")) {
    handleDeletePrompt(e.target);
  }

  // cancel delete
  if (e.target.matches("button[data-delete='cancel']")) {
    handleDeleteCancel(e.target);
  }

  // delete ferment
  if (e.target.matches("button[data-delete='yes']")) {
    handleDelete(e.target);
  }

  // edit ferment dialog
  if (e.target.matches("button[data-edit]")) {
    handleEditDialog(e.target);
  }

  // share ferment
  if (e.target.matches("button[data-share='ferment']")) {
    handleShare(e.target);
  }
});

saveFermentForm.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(saveFermentForm);
  let thisFerment = {
    color: formData.get("color") || "transparent",
    dateEnd: formData.get("dateEnd"),
    fermentName: formData.get("fermentName"),
    notes: formData.get("notes"),
  };

  if (saveFermentForm.hasAttribute("data-edit")) {
    const id = saveFermentForm.dataset.edit;
    const { brine, dateStart, salt, unit, weight } = getObjectWithId(myFermentsStorage, id);

    thisFerment.brine = brine;
    thisFerment.dateStart = dateStart;
    thisFerment.id = id;
    thisFerment.salt = salt;
    thisFerment.unit = unit;
    thisFerment.weight = weight;

    localStorage.setItem("saved", JSON.stringify(replaceObjectWithId(myFermentsStorage, id, thisFerment)));

  } else {
    const dateStart = new Date();
    const randomNumber = Math.floor(Math.random() * 9000 + 1000);
    const state = JSON.parse(localStorage.getItem("state"));
    const { brine, salt, unit, weight } = state;

    thisFerment.brine = formatDecimal(brine);
    thisFerment.dateStart = dateStart;
    thisFerment.id = `ferment${randomNumber}${parseInt(brine, 10) + parseInt(weight, 10) + parseInt(salt, 10)}`;
    thisFerment.salt = formatDecimal(salt);
    thisFerment.unit = unit;
    thisFerment.weight = formatDecimal(weight);

    myFermentsStorage.push(thisFerment);
    localStorage.setItem("saved", JSON.stringify(myFermentsStorage));
  }

  let params = new URLSearchParams(location.search);
  params.set('showModal', 'myFermentsDialog');
  window.location.search = params.toString();
  // window.location.reload();
});
