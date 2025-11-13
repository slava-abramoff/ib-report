
const API_URL = "/events";
const path = window.location.pathname;
const id = path.split('/').pop();

const eventNumberTitle = document.getElementById("event-id")
const ID = document.getElementById("id")
const date = document.getElementById("date")
const start = document.getElementById("start")
const detect = document.getElementById("detect")
const end = document.getElementById("end")
const eventDuration = document.getElementById("eventDuration")

const address = document.getElementById("address")
const number = document.getElementById("number")
const phoneNumber = document.getElementById("phoneNumber")
const mail = document.getElementById("mail")
const surname = document.getElementById("surname")

const happened = document.getElementById("happened")
const happenedCause = document.getElementById("happenedCause")
const rootCause = document.getElementById("rootCause")
const affectedComponents = document.getElementById("affectedComponents")
const identifiedVulnerabilities = document.getElementById("identifiedVulnerabilities")
const businessImpact = document.getElementById("businessImpact")

const isEventResolved = document.getElementById("isEventResolved")
const createdAt = document.getElementById("createdAt")

const renderEvent = (event) => {
    eventNumberTitle.innerText = event.number

    ID.innerText = event.id
    date.innerText = event.date
    start.innerText = event.start
    detect.innerText = event.detect
    end.innerText = event.end
    eventDuration.innerText = event.eventDuration || "—"

    address.innerText = event.address
    number.innerText = event.number
    phoneNumber.innerText = event.phoneNumber
    mail.innerText = event.mail
    surname.innerText = event.surname

    happened.innerText = event.happened
    happenedCause.innerText = event.happenedCause
    rootCause.innerText = event.rootCause
    affectedComponents.innerText = event.affectedComponents
    identifiedVulnerabilities.innerText = event.identifiedVulnerabilities
    businessImpact.innerText = event.businessImpact

    isEventResolved.innerText = event.isEventResolved ? "Да" : "Нет"
    createdAt.innerText = event.createdAt || "—"
}

const getEvent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`)
        const result = await response.json()

        if (!result.success || !result.data) {
            console.log('error')
        }

        renderEvent(result.data)
    } catch (error) {
        console.error(error)
    }
}

getEvent(id);