if (Notification.permission != "granted") {
    Notification.requestPermission()
}

const startButton = document.getElementById("start-button")
const stopButton = document.getElementById("stop-button")
const timerDuration = document.getElementById("timer-duration")
const countDown = document.getElementById("countdown")
const taskList = document.getElementById("task-list")
const addTaskButton = document.getElementById("add-task")
const taskContent = document.getElementById("task-content")
const tasks = []

let taskIdCounter = 0
let timeoutId = null

const wakeUp = () => {
    if (Notification.permission == "granted") {
        const notification = new Notification("Wake up")
    } else {
        alert("Wake up")
    }
    startButton.hidden = false
    stopButton.hidden = true
}

const startTimer = () => {
    const totalTimeMs = timerDuration.value * 1000
    const endTime = Date.now() + totalTimeMs
    const updateCountdown = () => {
        const timeRemainingMs = endTime - Date.now()

        const timeRemainingSeconds = Math.max(0, Math.ceil(timeRemainingMs / 1000))
        let seconds = timeRemainingSeconds % 60
        let minutes = Math.floor(timeRemainingSeconds / 60)
        countDown.innerText = `${minutes}:${String(seconds).padStart(2, '0')}`

        if (timeRemainingMs > 0) {
            const timeUntilNextUpdate = timeRemainingMs % 1000
            timeoutId = setTimeout(updateCountdown, timeUntilNextUpdate)
        } else {
            wakeUp()
        }
    }

    updateCountdown()

    startButton.hidden = true
    stopButton.hidden = false
}

const stopTimer = () => {
    if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
    }
    countDown.innerText = '0:00'
    startButton.hidden = false
    stopButton.hidden = true

}

startButton.addEventListener("click", startTimer)
stopButton.addEventListener("click", stopTimer)
timerDuration.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        if (startButton.hidden) {
            stopTimer()
        } else {
            startTimer()
        }
    }
})

const addTask = (newTask) => {
    const newLine = document.createElement("li")
    newLine.classList.add("task")
    taskList.appendChild(newLine)
    const task = document.createElement("div")
    task.contentEditable = true
    task.addEventListener("blur", () => updateTask(newTask.id, task.innerText))
    task.innerText = newTask.text
    const checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    const spacer = document.createElement("div")
    newLine.appendChild(task)
    spacer.classList.add("spacer")
    newLine.appendChild(spacer)
    newLine.appendChild(checkBox)
    taskContent.value = ""
}

const createTask = () => {
    const text = taskContent.value
    if (text !== "") {
        const newTask = { 'id': taskIdCounter, 'text': text }
        taskIdCounter += 1
        tasks.push(newTask)
        saveTasks()
        addTask(newTask)
    }
}

const saveTasks = () => {
    console.log("saving")
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

const updateTask = (taskId, newText) => {
    for (const item of tasks) {
        if (item.id === taskId) {
            item.text = newText
            break
        }
    }

    saveTasks()
}

addTaskButton.addEventListener("click", createTask)
taskContent.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        createTask()
    }
})


const loadedTasks = localStorage.getItem("tasks")
if (loadedTasks !== null) {
    tasks.push(...JSON.parse(loadedTasks))
    for (const task of tasks) {
        addTask(task)
    }
}