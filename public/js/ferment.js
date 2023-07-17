const deleteFermentButtons = document.querySelectorAll("button[data-delete]");
const saveFermentForm = document.getElementById("saveFermentForm");
const saveFermentButton = document.getElementById("saveFermentButton");
const saveFermentDialog = document.getElementById("saveFermentDialog");
const myFermentsDialog = document.getElementById("myFermentsDialog");
const fermentName = document.getElementById("fermentName");
const dateEnd = document.getElementById("dateEnd");
const notes = document.getElementById("notes");
const myFermentsList = document.getElementById("myFermentsList");
const myFermentsStorage = JSON.parse(localStorage.getItem("saved")) || [];

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

  if (f.dateEnd !== "") {
    de = new Date(f.dateEnd);
  }

  li.id = f.id;
  li.className = "ferment";
  li.innerHTML = `
    <div class="ferment-header${f.color !== "transparent" ? " ferment-tagged" : ""}" style="--color: ${f.color}">
      <div>
        <h3>${f.fermentName}</h3>
        <time datetime="${ds}" class="ferment-started" data-ferment="Started " data-relative="start">${formatTimeAgo(ds)}.</time>
        <time datetime="${de || ""}" class="ferment-done" data-ferment=" Finishes " data-relative="end">${formatTimeAgo(de) !== undefined ? formatTimeAgo(de)+"." : ""}</time>
      </div>
      <div class="ferment-options">
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
      text: `${fermentName ? fermentName+" | " : ""}Started: ${formatDate(dateStart) || ""}, Finishes: ${formatDate(dateEnd) || ""}, Brine: ${brine}%, Weight: ${weight} ${unit}, Salt: ${salt} ${unit}, ${notes ? "Notes: "+notes : ""}`,
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
}

// const handleEdit = button => {
//   const myFermentsStorage = JSON.parse(localStorage.getItem("saved"));
//   const id = button.getAttribute("aria-controls");

//   console.log(getObjectWithId(myFermentsStorage, id));

//   saveFermentDialog.showModal();

//   saveFermentDialog.querySelector("h2").innerText = "Edit this ferment";
//   saveFermentForm.setAttribute("data-edit", button.dataset.edit);
//   saveFermentForm.querySelector("[data-label='brine']").innerText = getObjectWithId(myFermentsStorage, id).brine;
//   saveFermentForm.querySelector("[data-label='weight']").innerText = getObjectWithId(myFermentsStorage, id).weight;
//   saveFermentForm.querySelector("[data-label='salt']").innerText = getObjectWithId(myFermentsStorage, id).salt;
//   saveFermentForm.querySelectorAll("[data-label='unit']").forEach(unit => unit.innerText = getObjectWithId(myFermentsStorage, id).unit);
//   dateEnd.value = getObjectWithId(myFermentsStorage, id).dateEnd;
//   fermentName.value = getObjectWithId(myFermentsStorage, id).fermentName;
//   notes.value = getObjectWithId(myFermentsStorage, id).notes;
//   document.querySelector(`[name='color'][value='${ getObjectWithId(myFermentsStorage, id).color}']`).checked = true;
  
// }

// const editFerment = id => {
//   const fermentName = myFermentsDialog?.querySelector("h2");
//   const dateEnd = myFermentsDialog?.querySelector("h2");
//   const fermentName = myFermentsDialog?.querySelector("h2");
// }

document.addEventListener("DOMContentLoaded", () => {

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

    // edit ferment
    // if (e.target.matches("button[data-edit]")) {
    //   handleEdit(e.target);
    // }

    // share ferment
    if (e.target.matches("button[data-share='ferment']")) {
      handleShare(e.target);
    }

  });
  
  saveFermentForm.addEventListener("submit", e => {
    e.preventDefault();

    const color = document.querySelector("[name='color']:checked");
    let thisFerment = {};

    if (saveFermentForm.hasAttribute("data-edit")) {
      // const id = saveFermentForm.dataset.edit;
      // const fermentEl = document.getElementById(id);

      // thisFerment = {
      //   fermentName: fermentName.value || "",
      //   dateEnd: dateEnd.value || "",
      //   notes: notes.value || "",
      //   color: color ? color.value : "transparent",
      // };

      // getObjectWithId(myFermentsStorage, id).fermentName = thisFerment.fermentName;
      // getObjectWithId(myFermentsStorage, id).dateEnd = thisFerment.dateEnd;
      // getObjectWithId(myFermentsStorage, id).notes = thisFerment.notes;
      // getObjectWithId(myFermentsStorage, id).color = thisFerment.color;

    } else {
      const date = new Date();
      const randomNumber = Math.floor(Math.random() * 9000 + 1000);
      const state = JSON.parse(localStorage.getItem("state"));
      thisFerment = {
        id: `ferment-${randomNumber}-${parseInt(state.brine, 10) + parseInt(state.weight, 10) + parseInt(state.salt, 10)}`,
        brine: parseInt(state.brine, 10),
        weight: parseInt(state.weight, 10),
        salt: state.salt,
        unit: state.unit,
        fermentName: fermentName.value || "",
        dateStart: date,
        dateEnd: dateEnd.value || "",
        notes: notes.value || "",
        color: color ? color.value : "transparent",
      };
    
      myFermentsStorage.push(thisFerment);
      addFerment(thisFerment);
      localStorage.setItem("saved", JSON.stringify(myFermentsStorage));

    }
    
    saveFermentDialog.close();
    if (!myFermentsDialog.hasAttribute("open")) {
      myFermentsDialog.showModal();
    }
    
  });

  addFerments(myFermentsStorage);
});
