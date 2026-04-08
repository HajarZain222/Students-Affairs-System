const roleSelect = document.getElementById("roleSelect");

const cards = document.querySelectorAll(".card");

// Define permissions for each role
const permissions = {
  admin: ["students", "courses", "employees", "instructors"],
  employee: ["employees"],
  instructor: ["students", "courses"],
  student: ["students"],
};

// Update cards availability based on selected role
function updateCards(role) {
  cards.forEach((card) => {

    // Get module name from card dataset
    const module = card.dataset.module;

    // Enable card if role has permission
    if (permissions[role].includes(module)) {
      card.classList.remove("disabled");
    } 
    // Disable card if role has no permission
    else {
      card.classList.add("disabled");
    }
  });
}

// Initialize permissions on page load
updateCards(roleSelect.value);

// Update permissions when role changes
roleSelect.addEventListener("change", () => {
  updateCards(roleSelect.value);
});

// Handle navigation when card clicked
cards.forEach((card) => {
  card.addEventListener("click", () => {

    // Navigate only if card is enabled
    if (!card.classList.contains("disabled")) {
      window.location.href = card.dataset.page;
    }
  });
});

// Test section for API services (commented)
// import CoursesService from "./api/CoursesService.js";
// import EmployeeService from "./api/EmployeeService.js";
// import InstructorsService from "./api/InstructorsServices.js";
// import StudentService from "./api/StudentService.js";

// Create service instances for testing
// let studentService = new StudentService();
// let employeeService = new EmployeeService();
// let instructorsService = new InstructorsService();
// let coursesService = new CoursesService();

// Log fetched data for testing
// studentService.getAll().then(data => console.log("Students:", data));
// employeeService.getAll().then(data => console.log("Employees:", data));
// instructorsService.getAll().then(data => console.log("Instructors:", data));
// coursesService.getAll().then(data => console.log("Courses:", data));

// Command to run json-server for mock API
// npx json-server --watch "data/db.json" --port 3000