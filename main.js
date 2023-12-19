require('./options/config')
const {
    default: WADefault,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    makeCacheableSignalKeyStore, PHONENUMBER_MCC
} = require("@adiwajshing/baileys")
const NodeCache = require("node-cache")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const pino = require('pino')
const chalk = require('chalk')
const pairingCode = true
const useMobile = false
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const {
    Boom
} = require('@hapi/boom')
const fs = require('fs')
const axios = require('axios')
const FileType = require('file-type')
const fetch = require('node-fetch')
const PhoneNumber = require('awesome-phonenumber')
const path = require('path')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./message/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./message/myfunc')

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})
global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
})) : '')

global.db = JSON.parse(fs.readFileSync('./json/database.json'))
global.db.data = {
users: {},
chats: {},
database: {},
game: {},
settings: {},
others: {},
sticker: {},
...(global.db.data || {})
}


function nocache(module, cb = () => {}) {
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        }
        catch (e) {
            reject(e)
        }
    })
}

async function startliaacans() {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(`./session/${sessionName}`)
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const msgRetryCounterCache = new NodeCache()
    const liaacans = WADefault({
        version,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        printQRInTerminal: !pairingCode,
        mobile: useMobile, 
        browser: ['Chrome (Linux)', '', ''],
        auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
	    generateHighQualityLinkPreview: true, // make high preview link
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined,

    })
    
    store.bind(liaacans.ev)
    
    // anticall auto block
liaacans.ws.on('CB:call', async (json) => {
const callerId = json.content[0].attrs['call-creator']
if (json.content[0].tag == 'offer') {
let pa7rick = await liaacans.sendContact(callerId, global.owner)
liaacans.sendMessage(callerId, { text: `Sistem otomatis block!\nJangan menelpon bot!\nSilahkan Hubungi Owner Untuk Dibuka !`}, { quoted : pa7rick })
await sleep(8000)
await liaacans.updateBlockStatus(callerId, "block")
}
})

    liaacans.ev.on('messages.upsert', async chatUpdate => {
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!liaacans.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            m = smsg(liaacans, mek, store)
            require("./command/liaacans")(liaacans, m, chatUpdate)
        }
        catch (err) {
            console.log(err)
        }
    })
    if (pairingCode && !liaacans.authState.creds.registered) {
      if (useMobile) throw new Error('Cannot use pairing code with mobile api')

      let phoneNumber
      if (!!pairingNumber) {
         phoneNumber = pairingNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log("Start with your country's WhatsApp code, Example : 62xxx")
            process.exit(0)
         }
      } else {
         phoneNumber = await question(`Please type your WhatsApp number : `)
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Ask again when entering the wrong number
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log("Start with your country's WhatsApp code, Example : 62xxx")

            phoneNumber = await question(`Please type your WhatsApp number : `)
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
         }
      }

      setTimeout(async () => {
         let code = await liaacans.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log(`Your Pairing Code : `, code)
      }, 3000)
    }
    // Group Update
liaacans.ev.on('groups.update', async pea => {
//console.log(pea)
// Get Profile Picture Group
try {
ppgc = await liaacans.profilePictureUrl(pea[0].id, 'image')
} catch {
ppgc = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}
let wm_fatih = { url : ppgc }
if (pea[0].announce == true) {
liaacans.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
} else if(pea[0].announce == true) {
liaacans.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
} else if (pea[0].restrict == true) {
liaacans.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
} else if (pea[0].restrict == true) {
liaacans.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
} else {
liaacans.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup Subject telah diganti menjadi *${pea[0].subject}*`, `Group Settings Change Message`, wm_fatih, [])
}
})

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

    // Setting
    liaacans.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        }
        else return jid
    }

    liaacans.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = liaacans.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    liaacans.getName = (jid, withoutContact = false) => {
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

    liaacans.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = []
        for (let i of kon) {
            list.push({
                displayName: await liaacans.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await liaacans.getName(i + '@s.whatsapp.net')}\nFN:${await liaacans.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            })
        }
        liaacans.sendMessage(jid, {
            contacts: {
                displayName: `${list.length} Kontak`,
                contacts: list
            },
            ...opts
        }, {
            quoted
        })
    }
    
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

    liaacans.public = true

    liaacans.serializeM = (m) => smsg(liaacans, m, store)

    liaacans.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Please Delete Session and Scan Again`);
                liaacans.logout();
            }
            else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                startliaacans();
            }
            else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                startliaacans();
            }
            else if (reason === DisconnectReason.connectionReplaced) {
                console.log("Connection Replaced, Another New Session Opened, reconnecting...");
                startliaacans();
            }
            else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Scan Again And Run.`);
                liaacans.logout();
            }
            else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                startliaacans();
            }
            else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                startliaacans();
            }
            else if (reason === DisconnectReason.Multidevicemismatch) {
                console.log("Multi device mismatch, please scan again");
                liaacans.logout();
            }
            else liaacans.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
            console.log(`Connected to = ` + JSON.stringify(liaacans.user, null, 2))
        }
    })

    liaacans.ev.on('creds.update', saveCreds)

    liaacans.sendText = (jid, text, quoted = '', options) => liaacans.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })

    liaacans.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
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
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    liaacans.sendTextWithMentions = async (jid, text, quoted, options = {}) => liaacans.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    liaacans.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        const type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './image/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data,
            deleteFile() {
                return filename && fs.promises.unlink(filename)
            }
        }
    }

    liaacans.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ image: img }, { upload: liaacans.waUploadToServer })
var template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
imageMessage: message.imageMessage,
"hydratedContentText": text,
"hydratedFooterText": footer,
"hydratedButtons": but
}
}
}), options)
liaacans.relayMessage(jid, template.message, { messageId: template.key.id })
}

    liaacans.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await liaacans.getFile(path, true)
        let {
            res,
            data: file,
            filename: pathFile
        } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                }
            }
            catch (e) {
                if (e.json) throw e.json
            }
        }
        let opt = {
            filename
        }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '',
            mimetype = type.mime,
            convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime))(
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        delete options.asSticker
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage

        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: {
                url: pathFile
            },
            mimetype
        }
        let m
        try {
            m = await liaacans.sendMessage(jid, message, {
                ...opt,
                ...options
            })
        }
        catch (e) {
            //console.error(e)
            m = null
        }
        finally {
            if (!m) m = await liaacans.sendMessage(jid, {
                ...message,
                [mtype]: file
            }, {
                ...opt,
                ...options
            })
            file = null
            return m
        }
    }
    liaacans.sendMediaAsSticker = async (jid, path, quoted, options = {}) => {
      let {
         ext,
         mime,
         data
      } = await liaacans.getFile(path)
      let media = {}
      let buffer
      media.data = data
      media.mimetype = mime
      if (options && (options.packname || options.author)) {
         buffer = await writeExif(media, options)
      } else {
         buffer = /image/.test(mime) ? await imageToWebp(data) : /video/.test(mime) ? await videoToWebp(data) : ""
      }
      await liaacans.sendMessage(jid, {
         sticker: {
            url: buffer
         },
         ...options
      }, {
         quoted
      })
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
/*liaacans.sendMessage(jid, buttonMessage, { quoted, ...options })*/
liaacans.sendMessage(jid, {text: text}, {
         quoted,
         ...options
/*
tanpa button :
liaacans.sendMessage(jid, {text: text}, {
         quoted,
         ...options*/
   })
}
    liaacans.send1ButMes = (jid, text = '', footer = '', butId = '', dispText = '', quoted, ments) => {
        let but = [{
            buttonId: butId,
            buttonText: {
                displayText: dispText
            },
            type: 1
        }]
        let butMes = {
            text: text,
            buttons: but,
            footer: footer,
            mentions: ments ? ments : []
        }
        liaacans.sendMessage(jid, butMes, {
            quoted: quoted
        })
    }

    liaacans.sendButImage = async (jid, link, but = [], text = '', footer = '', ments = [], quoted) => {
        let dlimage;
        try {
            dlimage = await getBuffer(link)
        }
        catch {
            dlimage = await getBuffer('https://telegra.ph/file/ca0234ea67c9a8b8af9a1.jpg')
        }
        const buttonMessage = {
            image: dlimage,
            caption: text,
            footer: footer,
            buttons: but,
            headerType: 'IMAGE',
            mentions: ments
        }

        liaacans.sendMessage(jid, buttonMessage, quoted)
    }
    liaacans.sendFakeLink = (jid, text, salam, footer_text, pp_bot, myweb, pushname, quoted) => liaacans.sendMessage(jid, {
        text: text,
        contextInfo: {
            "externalAdReply": {
                "title": `Selamat ${salam} ${pushname}`,
                "body": footer_text,
                "previewType": "PHOTO",
                "thumbnailUrl": ``,
                "thumbnail": pp_bot,
                "sourceUrl": myweb
            }
        }
    }, {
        quoted
    })
    
/**
* 
* @param {*} jid 
* @param {*} path 
* @param {*} caption 
* @param {*} quoted 
* @param {*} options 
* @returns 
*/
liaacans.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await liaacans.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

/**
* 
* @param {*} jid 
* @param {*} path 
* @param {*} caption 
* @param {*} quoted 
* @param {*} options 
* @returns 
*/
liaacans.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await liaacans.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
}

/**
* 
* @param {*} jid 
* @param {*} path 
* @param {*} quoted 
* @param {*} mime 
* @param {*} options 
* @returns 
*/
liaacans.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await liaacans.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
}

/**
* 
* @param {*} jid 
* @param {*} text 
* @param {*} quoted 
* @param {*} options 
* @returns 
*/
liaacans.sendTextWithMentions = async (jid, text, quoted, options = {}) => liaacans.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

/**
* 
* @param {*} jid 
* @param {*} path 
* @param {*} quoted 
* @param {*} options 
* @returns 
*/
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

/**
* 
* @param {*} jid 
* @param {*} path 
* @param {*} quoted 
* @param {*} options 
* @returns 
*/
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
	
liaacans.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return liaacans.sendMessage(jid, { poll: { name, values, selectableCount }}) }


/**
* 
* @param {*} message 
* @param {*} filename 
* @param {*} attachExtension 
* @returns 
*/
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
    
/**
* 
* @param {*} jid 
* @param {*} path 
* @param {*} filename
* @param {*} caption
* @param {*} quoted 
* @param {*} options 
* @returns 
*/
liaacans.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await liaacans.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }
}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./message/exif')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'
}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await liaacans.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)
}

/**
* 
* @param {*} jid 
* @param {*} message 
* @param {*} forceForward 
* @param {*} options 
* @returns 
*/
liaacans.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}

diablo.sendList = async (jid , title = '', text = '', buttext = '', footer = '', but = [], options = {}) =>{
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
listMessage :{
title: title,
description: text,
buttonText: buttext,
footerText: footer,
listType: "  SELECT  ",
sections: but,
listType: 1
}
}), options)
diablo.relayMessage(jid, template.message, { messageId: template.key.id })
}

liaacans.send5ButLoc = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
"hydratedContentText": text,
"locationMessage": {
"jpegThumbnail": img },
"hydratedFooterText": footer,
"hydratedButtons": but
}
}
}), options)
liaacans.relayMessage(jid, template.message, { messageId: template.key.id })
}

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

let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await liaacans.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}

liaacans.cMod = (jid, copy, text = '', sender = liaacans.user.id, options = {}) => {
//let copy = message.toJSON()
let mtype = Object.keys(copy.message)[0]
let isEphemeral = mtype === 'ephemeralMessage'
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') msg[mtype] = {
...content,
...options
}
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = sender === liaacans.user.id

return proto.WebMessageInfo.fromObject(copy)
}


/**
* 
* @param {*} path 
* @returns 
*/
liaacans.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
//if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data
}

}

return liaacans
}

startliaacans()


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})

/*
Note : Jgn Hps Thanks For To nya Kalau Dihps, Dan Ketemu Admin Bakalan Admin Enc Dah

(Terima Kasih Kepada)
Thanks Too :
• Allah Swt
• Nabi Muhammad
• Ortua Saya🎉
• Aulia Rahman
• 4k Sanzz
• Nurutomo
• Xinz Team
• NazeDev
• Zeeone Ofc
• Zeroyt7
• Adiwajshing/Baileys
• Dan Pengguna Bot
Jika Mw Menambahin Thanks Too nya Tambah Aja Sndiri!!, Tpi Ingat Jgn Di Hps Juga Thanks Too nya, Kalau Di Hps Admin Enc Dah Ni Sc Botnya

Note : Jgn Hps Thanks For To nya Kalau Dihps, Dan Ketemu Admin Bakalan Admin Enc Dah
*/
