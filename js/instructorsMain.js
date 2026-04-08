import InstructorsService from "./api/InstructorsServices.js";
import renderTable from "./table.js";

let addInstructor = document.getElementById("addInstructorBtn");

let instructorService = new InstructorsService();

// Configuration for dynamic instructor form fields
const instructorFormConfig = [
  { name: "name", type: "text", label: "Name" },

  {
    name: "department",
    type: "select",
    options: ["IT", "CS", "IS"],
    placeholder: "Select Department",
    label: "Department",
  },

  { name: "email", type: "email", label: "Email" },

  {
    name: "office",
    type: "select",
    options: ["HQ1", "HQ2", "HQ3"],
    placeholder: "Select Office",
    label: "Office",
  },
];

// Fetch instructors then render table
instructorService.getAll().then((data) => {
  // Initialize dynamic table with CRUD support
  const table = renderTable({
    data,
    container: document.getElementById("tableContainer"),
    rowsPerPageSelect: document.getElementById("rowsPerPage"),
    searchInput: document.getElementById("searchInput"),
    paginationInfo: document.getElementById("paginationInfo"),
    paginationControls: document.getElementById("paginationControls"),
    service: instructorService,
    formConfig: instructorFormConfig,
  });

  // Open add instructor modal on button click
  addInstructor.addEventListener("click", () => {
    table.openAddForm();
  });
});
