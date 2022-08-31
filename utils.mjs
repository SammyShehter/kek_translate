import fs from 'fs'
import { emojiRegex, urlRegex, noHttpRegex } from "./regex.mjs"

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

export function checkIfTextIsLink(text) {
    try {
        const textAfterRegex = text.match(urlRegex) ?? text.match(noHttpRegex)
        if(!textAfterRegex) return false
        if(textAfterRegex.index || text.split(" ")[1]) return false
        return true
    } catch (_) {
        return true
    }
}

export function checkIfTextContainsOnlyEmojis(text) {
    let emojisLength = 0
    for (const match of text.matchAll(emojiRegex)) {
        if (match[0]) emojisLength += match[0].length
    }
    if (text.length === emojisLength) return true
    return false
}