class Task{

    constructor (title, importance, reward){
        this.title = title,
        this.importance = importance,
        this.reward = reward
    }
}

const newTaskForm = document.querySelector(".new-task-form-div")
const newTaskIcon = document.querySelector("#new-task-icon")
const container = document.querySelector(".container")
const taskList = document.querySelector(".task-list")
const titleInput = document.querySelector("#new-task-title")
const importanceInput = document.querySelector("#new-task-importance")
const rewardInput = document.querySelector("#new-task-reward")
const completedTasksList = document.querySelector(".completed-tasks-list")
const completedTasksBox = document.querySelector(".completed-tasks-box")
const editTaskForm = document.querySelector(".edit-task-form-div")

const editTaskTitleInput = document.querySelector("#edit-task-title")
const editTaskImportanceInput = document.querySelector("#edit-task-importance")
const editTaskRewardInput = document.querySelector("#edit-task-reward")

const tasks = getTasks("tasks")
const completedTasks = getTasks("completed_tasks")

renderTasksFromArray(tasks)  // Render the pending tasks
renderCompletedTasks()
checkIfTasks()              // If not pending tasks then show the no task text

// Open new task form eventlistener
newTaskIcon.addEventListener("click", function() {
    toggleVisibility(newTaskForm);
    editTaskForm.classList.add("hidden")
    editTaskForm.classList.remove("visible")
})

// New task form cross icon eventlistener
document.querySelector("#new-task-form-cross").addEventListener("click", function() {
    toggleVisibility(newTaskForm)
})

// edit task form cross icon eventlistener
document.querySelector("#edit-task-form-cross").addEventListener("click", function() {
    toggleVisibility(editTaskForm)
})

// New task form submit event listener
newTaskForm.addEventListener("submit", function(event) {
    event.preventDefault()
    
    const taskNumber = tasks.length + 1
    const title = capitalizeFirstLetter(titleInput.value)
    const importance = capitalizeFirstLetter(importanceInput.value)
    const reward = capitalizeFirstLetter(rewardInput.value)
    
    if (!title || !importance || !reward) {
        alert("Please do not leave any box empty.")
        return false
    }
    
    addNewTask(taskList, taskNumber, title, importance, reward)
    tasks.push( new Task(title, importance, reward) )
    addDeleteEventListeners()
    addCompletedEventListeners()
    toggleVisibility(newTaskForm)
    checkIfTasks()
    saveTasks("tasks", tasks)
    titleInput.value = ""
    importanceInput.value = ""
    rewardInput.value = ""
    return false
})

// Edit task form submit event listener
editTaskForm.addEventListener("submit", function(event) {
    event.preventDefault()

    let taskNumber = editTaskForm.getAttribute("data-task-number")
    let indexToEdit = parseInt(taskNumber, 10)

    let title = capitalizeFirstLetter(editTaskTitleInput.value)
    let importance = capitalizeFirstLetter(editTaskImportanceInput.value)
    let reward = capitalizeFirstLetter(editTaskRewardInput.value)

    if (!title || !importance || !reward){
        alert("Please do not leave any box empty!")
        return false;
    }

    let taskToEdit = tasks[indexToEdit]
    taskToEdit.title = title
    taskToEdit.importance = importance
    taskToEdit.reward = reward

    editTaskTitleInput.value = ""
    editTaskImportanceInput.value = ""
    editTaskRewardInput.value = ""

    saveTasks("tasks", tasks)
    renderTasksFromArray(tasks)
    toggleVisibility(editTaskForm)

    return true

})

function toggleVisibility(element) {
    element.classList.toggle("hidden");
    element.classList.toggle("visible");
}

// check if there are pending tasks if no, then show the no task text
function checkIfTasks() {
    const existingNoTaskText = document.querySelector(".no-task-text");
    
    if (tasks.length === 0) {
        if (!existingNoTaskText) {
            const noTaskText = document.createElement("h1");
            noTaskText.classList.add("no-task-text"); 
            noTaskText.textContent = "No Tasks For Now.";
            taskList.appendChild(noTaskText);
        }
    } else {
        if (existingNoTaskText) {
            existingNoTaskText.remove(); 
        }
    }
}

// Save the tasks to the local storage
function saveTasks(key, array){
    localStorage.setItem(key, JSON.stringify(array))
    console.log(array)
}

// get the tasks from the local storage and return empty array if it does not exist in storage
function getTasks(key){
    taskString = localStorage.getItem(key)
    if (taskString === null) {
        console.log("Returning empty array")
        return []
    }
    else  {
        console.log("Returning saved tasks")
        let savedTasks = JSON.parse(taskString)
        return savedTasks
    }
}

// add new task card in the given div
function addNewTask(div, taskNumber, title, importance, reward) {
    const task = `
                <div class="task-box">
                    <div class="task-card">
                        <div class="number"><p class="task-number">${taskNumber}</p></div>
                        <div class="content-box title">
                            <p class="label task-title-label">Title</p>
                            <p class="task-title">${title}</p>
                        </div>
                        <div class="content-box importance">
                            <p class="label importance">Importance</p>
                            <p class="task-text">${importance}</p>
                        </div>
                        <div class="content-box reward">
                            <p class="label reward">Reward</p>
                            <p class="task-text">${reward}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <i title="Mark complete" data-task-number = "${taskNumber-1}" class="fa-solid fa-check completed-action" style="color: #4dff00;"></i>
                        <i title="Edit this task" data-task-number="${taskNumber-1}" class="fa-solid fa-pen edit-task-action" style="color: #d6d912;"></i>
                        <i title="Double click to Remove task" data-task-number = "${taskNumber-1}" class="fa-regular fa-square-minus delete-action" style="color: #ff3300;"></i>                
                    </div>
                </div>
                        `
                        div.innerHTML += task
    }

// Add the pending task to the completed task box with changed data
function addCompletedTask(div, title, taskNumber, importance, reward){
    const task = `
    <div class="task-box">
        <div class="task-card completed-task">
            <div class="number"><p class="task-number"><i class="fa-solid fa-check " style="color: #0FFF50;"></i></p></div>
            <div class="content-box title">
                <p class="label task-title-label">Title</p>
                <p class="task-title">${title}</p>
            </div>
            <div class="content-box importance">
                <p class="label importance">Importance</p>
                <p class="task-text">${importance}</p>
            </div>
            <div class="content-box reward">
                <p class="label reward">Reward</p>
                <p class="task-text">${reward}</p>
            </div>
        </div>
        <div class="actions">
            <i title="Mark uncomplete" data-task-number = "${taskNumber-1}" class="fa-solid fa-xmark uncomplete-action" style="color: #9e9e9e;"></i>
            <i title="Double click to Remove task" data-task-number = "${taskNumber-1}" class="fa-regular fa-square-minus completed-delete-action" style="color: #ff3300;"></i>                
        </div>
    </div>
    `
    div.innerHTML += task

}

// Render the tasks in the tasks div from given array
function renderTasksFromArray(array){
    taskList.innerHTML = ""
    for (let i = 0; i < array.length; i++){
        addNewTask(taskList, i+1, array[i].title, array[i].importance, array[i].reward)
    }
    addDeleteEventListeners()
    addCompletedEventListeners()
    addEditTaskEventListeners()
}

function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// add the delete task event listeners to the delete buttons of the pending tasks
function addDeleteEventListeners() {
    const deleteIcons = document.querySelectorAll(".delete-action");
    
    for (let icon of deleteIcons){
        icon.addEventListener("dblclick", function(event) {
    
            const taskNumber = icon.getAttribute('data-task-number'); 
    
            const indexToDelete = parseInt(taskNumber, 10);
            console.log(`Attempting to delete task at index: ${indexToDelete}`);
    
            if (!isNaN(indexToDelete) && indexToDelete >= 0 && indexToDelete < tasks.length) {
                tasks.splice(indexToDelete, 1); 
                saveTasks("tasks", tasks)
                renderTasksFromArray(tasks);
                checkIfTasks()
            } else {
                console.warn('Invalid data-task-number for deletion:', taskNumber);
            }
        });
    }
}

// Render the completed tasks in the completed tasks div [completedTasks array hardcoded]
function renderCompletedTasks(){
    completedTasksList.innerHTML = ""
    completedTasksBox.classList.remove("visible")
    completedTasksBox.classList.add("hidden")
    if ( completedTasks.length != 0 ){
        completedTasksBox.classList.add("visible")
        for (let i = 0; i < completedTasks.length; i++){
            let task = completedTasks[i]
            addCompletedTask(completedTasksList, task.title, i+1, task.importance, task.reward)
        }
        addMarkUncompleteEventListeners()
        addCompletedDeleteActionEventListeners()
    } 
}

// Add the functionality on the mark complete buttons of the pending tasks
function addCompletedEventListeners() {
    const completedIcons = document.querySelectorAll(".completed-action")

    for (let icon of completedIcons){
        icon.addEventListener("click", function(event) {
            const taskNumber = icon.getAttribute('data-task-number')

            const indexToComplete = parseInt(taskNumber, 10);
            console.log(`Attempting to complete task at index : ${indexToComplete}`);

            if (!isNaN(indexToComplete) && indexToComplete >= 0 && indexToComplete < tasks.length) {
                completedTasks.push(tasks[indexToComplete])
                tasks.splice(indexToComplete, 1);
                saveTasks("tasks", tasks)
                saveTasks("completed_tasks", completedTasks)
                renderCompletedTasks()
                renderTasksFromArray(tasks)
                checkIfTasks()
            }
        });
    }
}

// Add the functionality to mark the completed task uncomplete and add again to pending tasks
function addMarkUncompleteEventListeners() {
    const markUncompleteIcons = document.querySelectorAll(".uncomplete-action")

    for (let icon of markUncompleteIcons){
        icon.addEventListener("click", function(event) {
            taskNumber = icon.getAttribute('data-task-number')
            console.log("task number : ", taskNumber)

            const indexOfTask = parseInt(taskNumber, 10);
            console.log(`Attempting to insert task at index : ${indexOfTask}`);

            if(!isNaN(indexOfTask)){
                tasks.push(completedTasks[indexOfTask])
                completedTasks.splice(indexOfTask, 1)
                console.log(tasks)
                saveTasks("tasks", tasks)
                saveTasks("completed_tasks", completedTasks)
                renderTasksFromArray(tasks)
                renderCompletedTasks()
            }
        })
    }
}

// add the functionality to delete the tasks from the completed tasks list
function addCompletedDeleteActionEventListeners() {
    const completedDeleteIcons = document.querySelectorAll(".completed-delete-action")

    for (let icon of completedDeleteIcons){
        icon.addEventListener("dblclick", function() {
            taskNumber = icon.getAttribute('data-task-number')
            console.log("task number : ", taskNumber)

            const indexToDelete = parseInt(taskNumber, 10)

            if (!isNaN(indexToDelete)){
                completedTasks.splice(indexToDelete, 1)
                saveTasks("completed_tasks", completedTasks)
                renderCompletedTasks()
            }
        })
    }
}

// add the functionality to edit the task from the pending tasks
function addEditTaskEventListeners() {
    const editTasksIcons = document.querySelectorAll(".edit-task-action")

    for (let icon of editTasksIcons){
        icon.addEventListener("click", function() {
            taskNumber = icon.getAttribute('data-task-number')
            console.log("task number : ", taskNumber)

            const indexToEdit = parseInt(taskNumber, 10)

            if (!isNaN(indexToEdit) && indexToEdit >= 0 && indexToEdit < tasks.length){
                newTaskForm.classList.add("hidden")
                newTaskForm.classList.remove("visible")
                let task = tasks[indexToEdit]
                editTaskTitleInput.value = task.title
                editTaskImportanceInput.value = task.importance
                editTaskRewardInput.value = task.reward
                editTaskForm.setAttribute("data-task-number", `${indexToEdit}`)
                toggleVisibility(editTaskForm)
            }
        })
    }
}

