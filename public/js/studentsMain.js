import StudentService from "./api/StudentService.js";
import CoursesService from "./api/CoursesService.js";
import renderTable from "./table.js";

let addStudent = document.getElementById("addStudentBtn");

let studentService = new StudentService();

let courseService = new CoursesService();

// Configuration for dynamic student form fields
const studentFormConfig = [
  { name: "name", type: "text", label: "Name" },

  { name: "email", type: "email", label: "Email" },

  {
    name: "department",
    type: "select",
    options: ["IT", "CS", "IS"],
    placeholder: "Select Department",
    label: "Department",
  },

  {
    name: "level",
    type: "select",
    options: ["1", "2", "3", "4"],
    placeholder: "Select Level",
    label: "Level",
  },

  {
    name: "gpa",
    type: "number",
    label: "GPA",
    step: "0.01",
    min: "0",
    max: "4",
  },

  {
    name: "courses",
    type: "checkbox",
    options: [],
    label: "Courses (Select 2 Only)",
  },
];

// Fetch students then render table
studentService.getAll().then(async (data) => {
  // Fetch courses to populate course selection
  const courses = await courseService.getAll();

  // Initialize dynamic table with CRUD support
  const table = renderTable({
    data,
    container: document.getElementById("tableContainer"),
    rowsPerPageSelect: document.getElementById("rowsPerPage"),
    searchInput: document.getElementById("searchInput"),
    paginationInfo: document.getElementById("paginationInfo"),
    paginationControls: document.getElementById("paginationControls"),
    service: studentService,
    formConfig: studentFormConfig,
    extraData: { courses },
  });

  // Open add student modal on button click
  addStudent.addEventListener("click", () => {
    table.openAddForm();
  });
});
