const apiUrl = "https://diatracker.minipandi.net/api"

window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
})