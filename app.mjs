process.env.NTBA_FIX_319 = true

import TelegramBot from "node-telegram-bot-api"
import config from "config"
import translate from "google-translate-api-x"
import {
    readBanList,
    sendToBan,
    writeError,
    writeLog,
    checkIfTextContainsOnlyEmojis,
    checkIfTextIsLink,
} from "./utils.mjs"

const bot = new TelegramBot(config.get("token"), { polling: true })
const ownerId = 0
const groupMaps = new Map()
groupMaps.set(123, "test1") // groupID, groupName

function init() {
    readBanList()
}

async function botController(msg) {
    try {
        const {
            date,
            text,
            message_id,
            from: { id: userId, first_name, last_name, username, is_bot },
            chat: { id: groupId, title, type },
        } = msg

        const user = `${first_name ?? last_name ?? username}`
        const fullUserName = `${first_name ? first_name : ""} ${
            last_name ? last_name : ""
        } ${username ? "aka " + username : ""}`

        if (
            (userId && banList[`${userId}`]) ||
            (groupId && banList[`${groupId}`])
        ) {
            writeLog(
                logFile,
                `Request from banned user or group: User: ${
                    banList[`${userId}`]
                }${
                    banList[`${groupId}`]
                        ? ", Group: " + banList[`${groupId}`]
                        : ""
                }`
            )
            return
        }
        if (groupId && !groupMaps.get(groupId)) {
            writeError(
                errorFile,
                `Request from Violator!\nViolator: userId: ${userId}, username: ${fullUserName}, date: ${date},${
                    is_bot ? " is a bot," : ""
                } message id: ${message_id}, groupId: ${groupId}${
                    text ? "\nText: " + text + "\n" : "\n"
                }`
            )
            if (userId !== ownerId) sendToBan(fullUserName, userId)
            sendToBan(title, groupId)
            return
        }

        writeLog(
            logFile,
            `Request from ${fullUserName}, userId: ${userId}, date: ${date},${
                is_bot ? " is a bot," : ""
            } message id: ${message_id}, groupId: ${groupId}${
                text ? "\nText: " + text + "\n" : "\n"
            }`
        )
        if (!text) return

        isUrl = checkIfTextIsLink(text)
        if (isUrl) return

        containsOnlyEmojis = checkIfTextContainsOnlyEmojis(text)
        if (containsOnlyEmojis) return

        const res = await translate(text, {
            to: "en",
            requestFunction: "axios",
            autoCorrect: true,
        })
        res.from.language.iso !== "en" &&
            bot.sendMessage(groupId, `${user} wrote: ${res.text}`)
    } catch (error) {
        console.log("\n")
        console.log(error)
        console.log("\n")
        writeError(errorFile, error.message)
    }
}

bot.on("message", botController)
init()
console.log(
    `
▄ •▄ ▄▄▄ .▄ •▄     ▄▄▄▄▄▄▄▄   ▄▄▄·  ▐ ▄ .▄▄ · ▄▄▌   ▄▄▄·▄▄▄▄▄▄▄▄ .
█▌▄▌▪▀▄.▀·█▌▄▌▪    •██  ▀▄ █·▐█ ▀█ •█▌▐█▐█ ▀. ██•  ▐█ ▀█•██  ▀▄.▀·
▐▀▀▄·▐▀▀▪▄▐▀▀▄·     ▐█.▪▐▀▀▄ ▄█▀▀█ ▐█▐▐▌▄▀▀▀█▄██▪  ▄█▀▀█ ▐█.▪▐▀▀▪▄
▐█.█▌▐█▄▄▌▐█.█▌     ▐█▌·▐█•█▌▐█ ▪▐▌██▐█▌▐█▄▪▐█▐█▌▐▌▐█ ▪▐▌▐█▌·▐█▄▄▌
·▀  ▀ ▀▀▀ ·▀  ▀     ▀▀▀ .▀  ▀ ▀  ▀ ▀▀ █▪ ▀▀▀▀ .▀▀▀  ▀  ▀ ▀▀▀  ▀▀▀ 
`
)
