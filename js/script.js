  function createElement(tagName, attributes, textContent = "") {
  const element = document.createElement(tagName);
  for (let attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  element.textContent = textContent;
  return element;
}

const API_URL = "https://67ada5373f5a4e1477de7240.mockapi.io/todo";

  async function fetchAndDisplay(
  element,
  filterText = { status: "", priority: "" }
) {
  try {
    element.innerHTML = "";
    const response = await fetch(API_URL);
    const todo = await response.json();

    todo
      .filter((todo) => {
        if (filterText.status === "" && filterText.priority === "") {
          return true;
        }
        if (filterText.status === "" && filterText.priority === todo.priority) {
          return true;
        }
        if (filterText.status === todo.status && filterText.priority === "") {
          return true;
        }
        return (
          filterText.status === todo.status &&
          filterText.priority === todo.priority
        );
      })
      .forEach((todo) => {
        const todoRow = element.appendChild(
          createElement("tr", {
            class:
              "border-b-2 " +
              (todo.status === "Pending"
                ? "border-red-600 bg-red-50 hover:bg-red-100"
                : todo.status === "Ongoing"
                ? "border-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                : "border-green-600 bg-green-50 hover:bg-green-100"),
          })
        );
        

        todoRow.appendChild(createElement("td", { class: "p-4" }, todo.id));

        todoRow.appendChild(
          createElement("td", { class: "p-4" }, todo.taskname)
        );

        todoRow.appendChild(
          createElement("td", { class: "p-4" }, todo.priority)
        );

        todoRow.appendChild(
          createElement("td", { className: "p-4" }, todo.deadline)
        );

        const statusArea = todoRow.appendChild(
          createElement("td", {
            class: "p-4",
          })
        );
        const statusChangeButton = statusArea.appendChild(
          createElement(
            "button",
            {
              class:
                todo.status === "Pending"
                  ? "text-red-600 hover:text-red-900"
                  : todo.status === "Ongoing"
                  ? "text-yellow-600 hover:text-yellow-900"
                  : "text-green-600 hover:text-green-900",
            },
            todo.status
          )
        );
        statusChangeButton.addEventListener("click", async () => {
          const response = await fetch(API_URL + "/" + todo.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status:
                statusChangeButton.textContent === "Pending"
                  ? "Ongoing"
                  : statusChangeButton.textContent === "Ongoing"
                  ? "Completed"
                  : "Pending",
            }),
          });
          const updatedTodo = await response.json();
          statusChangeButton.textContent = updatedTodo.status;
          statusChangeButton.className =
            updatedTodo.status === "Pending"
              ? "text-red-600 hover:text-red-900 "
              : updatedTodo.status === "Ongoing"
              ? "text-yellow-600 hover:text-yellow-900"
              : "text-green-600 hover:text-green-900";
          todoRow.className =
            "border-b-2 " +
            (updatedTodo.status === "Pending"
              ? "border-red-300 hover:bg-red-100"
              : updatedTodo.status === "Ongoing"
              ? "border-yellow-300 hover:bg-yellow-100"
              : "border-green-300 hover:bg-green-100");
        });
        const actionArea = todoRow.appendChild(
          createElement("td", {
            class: "p-4 ",
          })
        );
        const deleteButton = actionArea.appendChild(
          createElement(
            "button",
            {
              class:
                "text-red-600 hover:text-red-900 focus:outline-none hover:cursor-pointer",
            },
            "Delete"
          )
        );
        deleteButton.addEventListener("click", async () => {
          try {
            const response = await fetch(API_URL + "/" + todo.id, {
              method: "DELETE",
            });
            todoRow.remove();
          } catch (error) {
            alert("Error deleting data");
          }
        });
        const editArea = actionArea.appendChild(
          document.createElement("td", {
            class: "p-4",
          })
        );
        const editButton = editArea.appendChild(
          createElement(
            "button",
            {
              class:
                "text-blue-600 hover:text-blue-800 focus:outline-none hover:cursor-pointer",
            },
            "Edit"
          )
        );
        editButton.addEventListener("click", async () => {
          const editTodoDetails = {
            taskname: todo.taskname,
            priority: todo.priority,
            deadline: todo.deadline,
            status: todo.status,
          };
          const editTodoName = prompt("Edit Task Name", todo.taskname);
          if (editTodoName === null) {
            return;
          }
          const editPriority = prompt("Edit Priority", todo.priority);
          if (editPriority === null) {
            return;
          }
          const editDeadline = prompt("Edit Deadline", todo.deadline);
          if (editDeadline === null) {
            return;
          }
          const editStatus = prompt("Edit Status", todo.status);
          if (editStatus === null) {
            return;
          }
          try {
            const response = await fetch(API_URL + "/" + todo.id, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                taskname: editTodoName,
                priority: editPriority,
                deadline: editDeadline,
                status: editStatus,
              }),
            });
            const updatedTodo = await response.json();
            fetchAndDisplay(document.getElementById("todo"), filterText);
          } catch (error) {
            alert("Error updating data");
          }
        });
      });
  } catch (err) {
    alert("Error fetching data");
    return;
  }
}

window.onload = () => {
  const filterObject = {
    status: "",
    priority: "",
  };
  const nav = document.body.appendChild(
    createElement("nav", {
      class: "flex justify-around items-center shadow-lg bg-white h-30 ",
    })
  );

  nav.appendChild(
    createElement(
      "h1",
      {
        class: "font-bold text-5xl font-serif",
      },
      "ToDo List"
    )
  );

  const inputDiv = nav.appendChild(
    createElement("div", {
      class:
        "md:flex md:flex-row md:flex-nowrap md:justify-center gap-3 grid grid-rows-2 grid-cols-2 sm:grid sm:grid-rows-2 sm:grid-cols-2",
    })
  );

  const todoName = inputDiv.appendChild(
    createElement("input", {
      type: "text",
      name: "todoName",
      id: "todoName",
      class:
        "border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-200",
      placeholder: "Task ??",
    })
  );

  const prioritySelect = inputDiv.appendChild(
    createElement("select", {
      name: "priority",
      id: "priority",
      class:
        "border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-200",
    })
  );
  prioritySelect.appendChild(
    createElement(
      "option",
      {
        value: "",
        disabled: true,
        selected: true,
      },
      "Choose Priority"
    )
  );
  prioritySelect.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer",
        value: "High",
      },
      "High"
    )
  );
  prioritySelect.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer ",
        value: "Medium",
      },
      "Medium"
    )
  );
  prioritySelect.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer ",
        value: "Low",
      },
      "Low"
    )
  );

  const deadLine = inputDiv.appendChild(
    createElement("input", {
      type: "date",
      name: "deadLine",
      id: "deadLine",
      min: new Date().toISOString().split("T")[0],
      class:
        "border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-200",
    })
  );

  const addButton = inputDiv.appendChild(
    createElement("input", {
      type: "button",
      value: "Add +",
      class:
        "hover:cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-800",
    })
  );
  addButton.addEventListener("click", async function addTodo() {
    if (
      deadLine.value === "" ||
      todoName.value === "" ||
      prioritySelect.value === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    const newTodoDetails = {
      taskname: todoName.value,
      priority: prioritySelect.value,
      deadline: deadLine.value,
      status: "Pending",
    };

    console.log(JSON.stringify(newTodoDetails));
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoDetails),
      });
      const data = await response.json();
      fetchAndDisplay(document.getElementById("todo"), filterObject);
    } catch (error) {
      console.warn(error);
    } finally {
      todoName.value = "";
      prioritySelect.value = "";
      deadLine.value = "";
    }
  });
  const filterDiv = document.body.appendChild(
    createElement("div", {
      class:
        "flex flex-row md:flex-row justify-center items-center gap-4 h-30 md:h-30",
    })
  );
  const statusSelectFilter = filterDiv.appendChild(
    createElement("select", {
      name: "statusFilter",
      id: "statusFilter",
      class:
        "border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-200 md:w-auto",
    })
  );
  statusSelectFilter.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer",
        value: "",
        selected: true,
      },
      "All"
    )
  );
  statusSelectFilter.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer",
        value: "Pending",
      },
      "Pending"
    )
  );
  statusSelectFilter.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer",
        value: "Ongoing",
      },
      "Ongoing"
    )
  );
  statusSelectFilter.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer",
        value: "Completed",
      },
      "Completed"
    )
  );
  statusSelectFilter.addEventListener("change", () => {
    filterObject.status = statusSelectFilter.value;
    fetchAndDisplay(document.getElementById("todo"), filterObject);
  });
  const prioritySelectFilter = filterDiv.appendChild(
    createElement("select", {
      name: "priorityFilter",
      id: "priorityFilter",
      class:
        "border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-200",
    })
  );
  prioritySelectFilter.appendChild(
    createElement(
      "option",
      {
        value: "",
        selected: true,
      },
      "All"
    )
  );
  prioritySelectFilter.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer",
        value: "High",
      },
      "High"
    )
  );
  prioritySelectFilter.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer ",
        value: "Medium",
      },
      "Medium"
    )
  );
  prioritySelectFilter.appendChild(
    createElement(
      "option",
      {
        class: "hover:cursor-pointer ",
        value: "Low",
      },
      "Low"
    )
  );
  prioritySelectFilter.addEventListener("change", () => {
    filterObject.priority = prioritySelectFilter.value;
    fetchAndDisplay(document.getElementById("todo"), filterObject);
  });

  const tableContainer = document.body.appendChild(
    createElement("div", {
      class: "container mx-auto p-8 ",
    })
  );
  const tableWrapper = tableContainer.appendChild(
    createElement("div", {
      class: "overflow-x-auto ",
    })
  );
  const table = tableWrapper.appendChild(
    createElement("table", {
      class: "text-left shadow-lg w-full overflow-x-auto",
    })
  );

  const thead = table.appendChild(
    createElement("thead", {
      class: "bg-gray-200",
    })
  );

  const theadRow = thead.appendChild(createElement("tr"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Id"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "TodoName"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Priority"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Deadline"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Status"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Actions"));

  const tbody = table.appendChild(createElement("tbody", { id: "todo" }));
  fetchAndDisplay(tbody, filterObject);
};
