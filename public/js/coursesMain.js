import CoursesService from "./api/CoursesService.js";
import InstructorsService from "./api/InstructorsServices.js";
import renderTable from "./table.js";

let addCourse = document.getElementById("addCourseBtn");

let courseService = new CoursesService();

let instructorService = new InstructorsService();

// Configuration for dynamic course form fields
const courseFormConfig = [
  { name: "name", type: "text", label: "Name" },

  {
    name: "department",
    type: "select",
    options: ["IT", "CS", "IS"],
    placeholder: "Select Department",
    label: "Department",
  },

  {
    name: "creditHours",
    type: "number",
    label: "Credit Hours",
    min: "48",
    max: "120",
  },

  {
    name: "instructorId",
    type: "select",
    options: [],
    placeholder: "Select Instructor",
    label: "Instructor",
  },
];

// Fetch courses then render table
courseService.getAll().then(async (data) => {
  // Fetch instructors to use as relational data
  const instructors = await instructorService.getAll();

  // Initialize dynamic table with CRUD features
  const table = renderTable({
    data,
    container: document.getElementById("tableContainer"),
    rowsPerPageSelect: document.getElementById("rowsPerPage"),
    searchInput: document.getElementById("searchInput"),
    paginationInfo: document.getElementById("paginationInfo"),
    paginationControls: document.getElementById("paginationControls"),
    service: courseService,
    formConfig: courseFormConfig,
    extraData: { instructors },
  });

  // Open add course modal on button click
  addCourse.addEventListener("click", () => {
    table.openAddForm();
  });
});
