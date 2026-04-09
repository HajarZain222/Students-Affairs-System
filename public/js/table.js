// Reusable dynamic table component with pagination, sorting, search and CRUD support
function renderTable({
  data,
  container,
  rowsPerPageSelect,
  searchInput,
  paginationInfo,
  paginationControls,
  service,
  formConfig,
  extraData = {},
}) {
  // Table state management
  let currentPage = 1;
  let rowsPerPage = parseInt(rowsPerPageSelect.value);
  let sortColumn = null;
  let sortOrder = "asc";

  const formElement = document.getElementById("dynamicForm");
  const modal = document.getElementById("editModal");

  let afterCreateCallback = null;

  // Optional callback after creating a new record
  function setAfterCreate(callback) {
    afterCreateCallback = callback;
  }

  function closeModal() {
    modal.style.display = "none";
    formElement.reset();
    formElement.removeAttribute("data-id");
  }

  // Convert numeric fields to numbers before submit
  function convertNumbers(obj) {
    formConfig.forEach((field) => {
      if (field.type === "number" && obj[field.name] !== undefined) {
        obj[field.name] = Number(obj[field.name]);
      }
    });
  }

  // Handle rows per page change
  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    currentPage = 1;
    displayTable();
  });

  // Handle search input
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    displayTable();
  });

  // Main rendering logic (filtering, sorting, pagination, relations handling)
  function displayTable() {
    if (!data.length) {
      container.innerHTML = "<p>No Data Available</p>"; // show empty state
      return;
    }

    // Apply search filter on normal and relational fields
    let filteredData = data.filter((item) => {
      const keyword = searchInput.value.toLowerCase();

      // normal fields search
      const normalMatch = Object.entries(item).some(([key, val]) => {
        if (key === "courses" || key === "instructorId") return false;
        return String(val).toLowerCase().includes(keyword);
      });

      // instructor name search
      let instructorMatch = false;
      if (item.instructorId && extraData.instructors) {
        const instructor = extraData.instructors.find(
          (i) => i.id == item.instructorId,
        );
        if (instructor) {
          instructorMatch = instructor.name.toLowerCase().includes(keyword);
        }
      }

      // course name search
      let courseMatch = false;
      if (Array.isArray(item.courses) && extraData.courses) {
        courseMatch = item.courses.some((id) => {
          const course = extraData.courses.find((c) => c.id == id);
          return course ? course.name.toLowerCase().includes(keyword) : false;
        });
      }

      return normalMatch || instructorMatch || courseMatch;
    });

    // Apply sorting
    if (sortColumn) {
      filteredData.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    const totalRows = filteredData.length;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredData.slice(start, end);

    const keys = Object.keys(data[0]).filter((k) => k !== "id");

    let tableHTML = "<table border='1' borderColor='#ddd'><thead><tr>";

    // Dynamically generate table headers
    keys.forEach((key) => {
      let displayKey = key;
      if (key === "gpa") displayKey = "GPA";
      else if (key === "instructorId") displayKey = "Instructor";
      tableHTML += `<th class="sortable" data-key="${key}">${displayKey}</th>`;
    });

    tableHTML += "<th>Edit</th><th>Delete</th></tr></thead><tbody>";

    // Render table rows with relational mapping
    pageData.forEach((item) => {
      tableHTML += "<tr>";
      keys.forEach((key) => {
        if (key === "courses" && Array.isArray(item[key])) {
          if (item[key].length === 0) {
            tableHTML += "<td>No Courses</td>";
          } else {
            const courseNames = item[key].map((id) => {
              const course = extraData?.courses?.find((c) => c.id == id);
              return course ? course.name : `ID: ${id}`;
            });
            tableHTML += `<td>${courseNames.join(", ")}</td>`;
          }
        } else if (key === "instructorId") {
          const instructor = extraData?.instructors?.find(
            (i) => i.id == item[key],
          );
          tableHTML += `<td>${instructor ? instructor.name : "Not Assigned"}</td>`;
        } else {
          tableHTML += `<td>${item[key]}</td>`;
        }
      });

      tableHTML += `<td><button class="editBtn" data-id="${item.id}">Edit</button></td>`;
      tableHTML += `<td><button class="deleteBtn" data-id="${item.id}">Delete</button></td>`;
      tableHTML += "</tr>";
    });

    tableHTML += "</tbody></table>";
    container.innerHTML = tableHTML;

    // Update pagination info text
    paginationInfo.textContent = `Showing ${totalRows === 0 ? 0 : start + 1} to ${end > totalRows ? totalRows : end} of ${totalRows} entries`;

    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let paginationHTML = "";

    if (currentPage > 1)
      paginationHTML += `<button id="prevPage">Prev</button>`;
    if (currentPage < totalPages)
      paginationHTML += `<button id="nextPage">Next</button>`;

    paginationControls.innerHTML = paginationHTML;

    // Pagination events
    document.getElementById("prevPage")?.addEventListener("click", () => {
      currentPage--;
      displayTable();
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
      currentPage++;
      displayTable();
    });

    // Sorting event
    container.querySelectorAll(".sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.key;
        if (sortColumn === key)
          sortOrder = sortOrder === "asc" ? "desc" : "asc";
        else {
          sortColumn = key;
          sortOrder = "asc";
        }
        displayTable();
      });
    });

    // Handle delete action
    container.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Are you sure?")) {
          await service.delete(id);
          data = data.filter((item) => item.id != id);
          displayTable();
        }
      });
    });

    // Handle edit action and preload form
    container.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = data.find((e) => e.id == id);
        generateForm(formConfig, item);
        formElement.dataset.id = id;
        modal.style.display = "block";
      });
    });
  }

  // Generate dynamic form based on configuration object
  function generateForm(config, values = {}) {
    formElement.innerHTML = "";

    config.forEach((field) => {
      const wrapper = document.createElement("div");

      const label = document.createElement("label");
      label.textContent = field.label;
      wrapper.appendChild(label);

      // Handle dynamic select options
      if (field.type === "select") {
        const select = document.createElement("select");
        select.name = field.name;
        select.required = true;

        if (field.placeholder) {
          const placeholderOption = document.createElement("option");
          placeholderOption.value = "";
          placeholderOption.textContent = field.placeholder;
          placeholderOption.disabled = true;
          placeholderOption.selected = !values[field.name];
          select.appendChild(placeholderOption);
        }

        let options = field.options;

        if (field.name === "courseIds" && extraData.courses) {
          options = extraData.courses;
        }

        if (field.name === "instructorId" && extraData.instructors) {
          const departmentSelect = formElement.querySelector(
            'select[name="department"]',
          );
          let filteredInstructors = extraData.instructors;

          if (departmentSelect) {
            const selectedDepartment = departmentSelect.value;
            filteredInstructors = extraData.instructors.map((i) => ({
              ...i,
              disabled: false,
            }));

            filteredInstructors.forEach((i) => {
              if (i.department !== selectedDepartment) {
                i.disabled = true;
              }
            });

            departmentSelect.addEventListener("change", () => {
              const currentData = Object.fromEntries(new FormData(formElement));
              generateForm(config, currentData);
            });
          }

          options = filteredInstructors;
        }

        options.forEach((option) => {
          const opt = document.createElement("option");
          if (field.name === "instructorId") {
            opt.value = option.id;
            opt.textContent = option.name;
          } else {
            opt.value = option;
            opt.textContent = option;
          }

          if (values[field.name] == opt.value) opt.selected = true;

          select.appendChild(opt);
        });

        wrapper.appendChild(select);
      }
      // Handle checkbox fields with selection limit logic
      else if (field.type === "checkbox") {
        let options = field.options;

        if (field.name === "courses" && extraData.courses) {
          const departmentSelect = formElement.querySelector(
            'select[name="department"]',
          );
          const selectedDepartment = departmentSelect
            ? departmentSelect.value
            : null;

          if (selectedDepartment) {
            options = extraData.courses.filter(
              (c) => c.department === selectedDepartment,
            );
          } else {
            options = extraData.courses;
          }
        }

        const selectedValues = values[field.name] || [];

        options.forEach((option) => {
          const checkboxLabel = document.createElement("label");
          checkboxLabel.classList.add("checkboxLabel");

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = field.name;
          checkbox.value = option.id || option;

          if (
            selectedValues.includes(option.id) ||
            selectedValues.includes(option)
          )
            checkbox.checked = true;

          checkbox.addEventListener("change", () => {
            const checked = wrapper.querySelectorAll("input:checked");
            if (checked.length > 2) {
              checkbox.checked = false;
              alert("You can select only 2 courses");
            }
          });

          checkboxLabel.appendChild(checkbox);
          checkboxLabel.append(option.name || option);
          wrapper.appendChild(checkboxLabel);
        });

        wrapper.style.maxHeight = "200px";
        wrapper.style.overflowY = "auto";
      } else {
        const input = document.createElement("input");
        input.type = field.type;
        input.name = field.name;
        input.value = values[field.name] || "";
        input.required = true;

        if (field.step) input.step = field.step;
        if (field.min) input.min = field.min;
        if (field.max) input.max = field.max;

        wrapper.appendChild(input);
      }

      formElement.appendChild(wrapper);
    });

    const actionsWrapper = document.createElement("div");
    actionsWrapper.classList.add("form-actions");

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Save";
    submitBtn.classList.add("saveBtn");

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("cancelBtn");
    cancelBtn.addEventListener("click", closeModal);

    actionsWrapper.appendChild(cancelBtn);
    actionsWrapper.appendChild(submitBtn);

    formElement.appendChild(actionsWrapper);
  }

  // Handle form submission for create/update operations
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    const id = formElement.dataset.id;
    const formData = new FormData(formElement);

    const updatedData = {};

    formConfig.forEach((field) => {
      if (field.type === "checkbox") {
        updatedData[field.name] = formData.getAll(field.name);
      } else {
        updatedData[field.name] = formData.get(field.name);
      }
    });

    convertNumbers(updatedData);

    try {
      if (id) {
        await service.update(id, updatedData);
        const index = data.findIndex((item) => item.id == id);
        data[index] = { ...data[index], ...updatedData };
      } else {
        const newItem = await service.create(updatedData);
        data.push(newItem);

        if (afterCreateCallback) {
          await afterCreateCallback(newItem);
        }
      }

      closeModal();
      displayTable();
    } catch (error) {
      console.error(error);
      alert("Operation Failed");
    }
  });

  // Open modal in add mode
  function openAddForm() {
    generateForm(formConfig);
    formElement.removeAttribute("data-id");
    modal.style.display = "block";
  }

  displayTable();
  return { openAddForm, setAfterCreate };
}

export default renderTable;
