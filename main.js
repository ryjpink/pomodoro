if (Notification.permission != "granted") {
    Notification.requestPermission()
}

const startButton = document.getElementById("start-button")
const stopButton = document.getElementById("stop-button")
const timerDuration = document.getElementById("timer-duration")
const countDown = document.getElementById("countdown")
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
    const totalTimeMs = timerDuration.value*1000
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