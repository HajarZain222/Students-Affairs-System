import EmployeeService from "./api/EmployeeService.js";
import InstructorsService from "./api/InstructorsServices.js";
import renderTable from "./table.js";

let addEmployee = document.getElementById("addEmployeeBtn");

let employeeService = new EmployeeService();

let instructorService = new InstructorsService();

// Configuration for dynamic employee form fields
const employeeFormConfig = [
  { name: "name", type: "text", label: "Name" },

  {
    name: "department",
    type: "select",
    options: ["IT", "CS", "IS", "Accountant", "HR"],
    placeholder: "Select Department",
    label: "Department",
  },

  {
    name: "office",
    type: "select",
    options: ["HQ1", "HQ2", "HQ3"],
    placeholder: "Select Office",
    label: "Office",
  },

  {
    name: "position",
    type: "select",
    options: [
      "Manager",
      "HR",
      "Instructor",
      "Supervisor",
      "Accountant",
      "Assistant",
    ],
    placeholder: "Select Position",
    label: "Position",
  },

  { name: "age", type: "number", label: "Age", min: "25", max: "60" },

  { name: "startDate", type: "date", label: "Start Date" },

  { name: "salary", type: "number", label: "Salary" },
];

// Fetch employees then render table
employeeService.getAll().then((data) => {
  // Initialize dynamic table with CRUD support
  const table = renderTable({
    data,
    container: document.getElementById("tableContainer"),
    rowsPerPageSelect: document.getElementById("rowsPerPage"),
    searchInput: document.getElementById("searchInput"),
    paginationInfo: document.getElementById("paginationInfo"),
    paginationControls: document.getElementById("paginationControls"),
    service: employeeService,
    formConfig: employeeFormConfig,
  });

  // Callback executed after creating new employee
  table.setAfterCreate(async (newEmployee) => {
    // If employee is instructor, create instructor record automatically
    if (newEmployee.position === "Instructor") {
      await instructorService.create({
        id: newEmployee.id,
        name: newEmployee.name,
        department: newEmployee.department,
        office: newEmployee.office,
      });
    }
  });

  // Open add employee modal on button click
  addEmployee.addEventListener("click", () => {
    table.openAddForm();
  });
});
