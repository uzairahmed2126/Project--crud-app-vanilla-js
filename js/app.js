const mainContainer = document.getElementById("main");
const formData = document.getElementById("form");
const employeeName = document.getElementById("employee-name");
const employeeAge = document.getElementById("employee-age");
const employeePosition = document.getElementById("employee-position");

const undoMessage = document.getElementById("undo-message");
const undoButton = document.getElementById("undo-btn");

let isEditing = false;
let editingRow = null;
let deletedRow = null;
let undoTimeout = null;

function handleSubmit(event) {
  event.preventDefault();

  if (isEditing) {
    const cells = editingRow.querySelectorAll(".edit");
    cells[0].textContent = employeeName.value;
    cells[1].textContent = employeeAge.value;
    cells[2].textContent = employeePosition.value;

    isEditing = false;
    editingRow = null;

    document.getElementById("btn").textContent = "Add Item";
  } else {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td class="edit">${employeeName.value}</td>
      <td class="edit">${employeeAge.value}</td>
      <td class="edit">${employeePosition.value}</td>
      <td>
        <button class="edit-btn">Edit</button>
      </td>
      <td>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    const table = mainContainer.querySelector("table tbody");
    if (!table) {
      mainContainer.innerHTML = `
        <table border="1" cellspacing="0" cellpadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Position</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      `;
    }

    mainContainer.querySelector("table tbody").appendChild(newRow);
  }

  formData.reset();
}

mainContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    const row = event.target.closest("tr");
    const cells = row.querySelectorAll(".edit");

    employeeName.value = cells[0].textContent;
    employeeAge.value = cells[1].textContent;
    employeePosition.value = cells[2].textContent;

    isEditing = true;
    editingRow = row;

    document.getElementById("btn").textContent = "Update";
  } else if (event.target.classList.contains("delete-btn")) {
    const row = event.target.closest("tr");

    deletedRow = row.cloneNode(true);

    row.remove();

    undoMessage.style.visibility = "visible";

    clearTimeout(undoTimeout);

    undoTimeout = setTimeout(() => {
      undoMessage.style.visibility = "hidden";
      deletedRow = null;
    }, 3000);
  }
});

undoButton.addEventListener("click", function () {
  if (deletedRow) {
    const tableBody = mainContainer.querySelector("table tbody");
    if (tableBody) {
      tableBody.appendChild(deletedRow);
    }

    undoMessage.style.visibility = "hidden";

    deletedRow = null;

    clearTimeout(undoTimeout);
  }
});

formData.addEventListener("submit", handleSubmit);