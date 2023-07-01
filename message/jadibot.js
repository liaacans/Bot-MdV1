const { default: makeWaSocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, generateWAMessage, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) }
const log = (pino = require("pino"));
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const yargs = require('yargs/yargs')
const chalk = require('chalk')
const qrcode = require('qrcode')
const FileType = require('file-type')
const path = require('path')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('../message/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('../message/myfunc')
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

if (global.conns instanceof Array) console.log()
else global.conns = []

const jadibot = async (liaacans, m, from) => {
const { sendImage, sendMessage } = liaacans;
const { reply, sender } = m;
const { state } = useSingleFileAuthState(`./session/jadibot/${from}.json`)

const connectToWhatsApp = () => {
const liaacans = makeWaSocket({ logger: pino ({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ["Bot Numpang - By RahmXBot", "Safari", "3.0"]})

store.bind(liaacans.ev)

liaacans.ev.on('group-participants.update', async (anu) => {
console.log(anu)
try {
let metadata = await liaacans.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
// Get Profile Picture User
try {
ppuser = await liaacans.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}

// Get Profile Picture Group
try {
ppgroup = await liaacans.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}

if (anu.action == 'add') {
let kafloc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {locationMessage: {name: `${global.fake}`,jpegThumbnail: global.thumb}}}
welcome = `𝙷𝚊𝚕𝚘 𝙺𝚊𝚔 @${num.split("@")[0]}
Silahkan Intro Terlebih Dahulu Ya!
┌─❖        *「 ᴋᴀʀᴛᴜ ɪɴᴛʀᴏ 」*
║➸ ɴᴀᴍᴀ       :
║➸ ᴜᴍᴜʀ       :
║➸ ᴋᴇʟᴀꜱ       :
║➸ ᴀꜱᴀʟ        :
║➸ ɢᴇɴᴅᴇʀ      :
║➸ ᴀɢᴀᴍᴀ       :
║➸ ʜᴏʙʙʏ       :
║➸ ꜱᴛᴀᴛᴜꜱ      :
╚══════════════════╝`
liaacans.sendMessage(anu.id, { text: welcome }, {quoted:kafloc})
} else if (anu.action == 'remove') {
let kafloc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {locationMessage: {name: `${global.fake}`,jpegThumbnail: global.thumb}}}
let pushname = m.pushname
left = `┌─❖「 𝙶𝙾𝙾𝙳 𝙱𝚈𝙴 @${num.split("@")[0]}  」
│✑ 𝙱𝙴𝙱𝙰𝙽 𝙶𝚁𝙾𝚄𝙿 𝙺𝙴𝙻𝚄𝙰𝚁
│✑ 𝙹𝙰𝙽𝙶𝙰𝙽 𝙻𝚄𝙿𝙰 𝙱𝙰𝚆𝙰 𝙶𝙾𝚁𝙴𝙽𝙶𝙰𝙽 𝚈𝙰 𝙺𝙰𝙺! 
   └───────────────┈ ⳹`
liaacans.sendMessage(anu.id, { text: left }, {quoted:kafloc})
}
}
} catch (err) {
console.log(err)
}
})

liaacans.ev.on('messages.upsert', async chatUpdate => {
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
m.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (!liaacans.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
m = smsg(liaacans, mek, store)
require('../command/liaacans')(liaacans, m, chatUpdate, store)
} catch (err) {
console.log(err)}})

liaacans.ev.on("connection.update", async up => {
const { lastDisconnect, connection } = up;
if (connection == "connecting") return
if (connection){
if (connection != "connecting") console.log("Connecting to jadibot..")
}
console.log(up)
if (up.qr) await sendImage(from, await qrcode.toDataURL(up.qr,{scale : 8}), 'Scan QR ini untuk jadi bot sementara\n\n1. Klik titik tiga di pojok kanan atas\n2. Ketuk WhatsApp Web\n3. Scan QR ini \nQR Expired dalam 30 detik', m)
console.log(connection)
if (connection == "open") {
liaacans.id = liaacans.decodeJid(liaacans.user.id)
liaacans.time = Date.now()
global.conns.push(liaacans)
user = `${liaacans.decodeJid(liaacans.user.id)}`
txt = `*Terdeteksi User Jadibot*\n\n _× User : @${user.split("@")[0]}_`
sendMessage(`62858213693245@s.whatsapp.net`,{text: txt, mentions : [user]})
}
if (connection === 'close') {
lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectToWhatsApp() : ''
}
})

liaacans.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

liaacans.ev.on('contacts.update', update => {
for (let contact of update) {
let id = liaacans.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

liaacans.getName = (jid, withoutContact  = false) => {
id = liaacans.decodeJid(jid)
withoutContact = liaacans.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = liaacans.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === liaacans.decodeJid(liaacans.user.id) ?
liaacans.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

liaacans.public = true

liaacans.setStatus = (status) => {
liaacans.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status
}

liaacans.serializeM = (m) => smsg(liaacans, m, store)

liaacans.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}

await liaacans.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

liaacans.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
        
await liaacans.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

liaacans.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

liaacans.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
        
return buffer
} 

liaacans.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

liaacans.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

liaacans.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
liaacans.sendMessage(jid, {text: text}, {
         quoted,
         ...options
   })
}

liaacans.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await liaacans.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

liaacans.sendText = (jid, text, quoted = '', options) => liaacans.sendMessage(jid, { text: text, ...options }, { quoted })

liaacans.sendButMessage = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
liaacans.sendMessage(jid, buttonMessage, { quoted, ...options })
}



}
connectToWhatsApp()
}

module.exports = { jadibot, m }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})