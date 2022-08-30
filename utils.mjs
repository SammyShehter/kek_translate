import fs from 'fs'

global['banFile'] = "./banList.json"
global['errorFile'] = "./error.log"
global['logFile'] = "./app.log"
global['banList'] = {}

export function logWithDate(logString = 'no message') {
    return `${new Date().toLocaleString()} - ${logString}\n`
}

export function readBanList() {
    banList = JSON.parse(fs.readFileSync(banFile, "utf8"))
}

export function sendToBan (value, key) {
    banList[key] = value
    fs.writeFileSync(
        banFile,
        JSON.stringify(banList, null, 4),
        "utf8",
        panic
    )
}

export function writeLog(filename, logString) {
    fs.appendFileSync(filename, logWithDate(logString), panic)
}

export function writeError(filename, logString) {
    fs.appendFileSync(filename, logWithDate(logString), panic)
}

function panic(err) {
    if (err) throw err
}