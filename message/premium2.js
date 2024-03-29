/*
Note : Jgn Hps Thanks For To nya Kalau Dihps, Dan Ketemu Admin Bakalan Admin Enc Dah

(Terima Kasih Kepada)
Thanks Too :
• Allah Swt
• Nabi Muhammad
• Aulia Rahman
• 4k Sanzz
• Nurutomo
• Xinz Team
• NazeDev
• Zeroyt7
• Adiwajshing/Baileys
• Dan Pengguna Bot
Jika Mw Menambahin Thanks Too nya Tambah Aja Sndiri!!, Tpi Ingat Jgn Di Hps Juga Thanks Too nya, Kalau Di Hps Admin Enc Dah Ni Sc Botnya

Note : Jgn Hps Thanks For To nya Kalau Dihps, Dan Ketemu Admin Bakalan Admin Enc Dah
*/

const fs = require('fs');
const toMs = require('ms');

/**
 * Add premium user.
 * @param {string} userId 
 * @param {string} expired 
 * @param {object} _premi
 */
const addPremiumUser = (userId, expired, _premi) => {
    const obj = { id: userId, expired: Date.now() + toMs(expired) }
    _premi.push(obj)
    fs.writeFileSync('./json/premium2.json', JSON.stringify(_premi))
}

/**
 * Get premium user index position.
 * @param {string} userId
 * @param {object} _dir 
 * @returns {Number}
 */
const getPremiumPosition = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}

/**
 * Get premium user expired.
 * @param {string} userId 
 * @param {object} _dir 
 * @returns {Number}
 */
const getPremiumExpired = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].expired
    }
}

/**
 * Check if is user premium.
 * @param {string} userId 
 * @param {object} _dir 
 * @returns {boolean}
 */
const checkPremiumUser = (userId, _dir) => {
    let status = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            status = true
        }
    })
    return status
}

/**
 * Constantly checking premium.
 * @param {object} _dir 
 */
const expiredCheck = (_dir) => {
    setInterval(() => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired) {
                position = i
            }
        })
        if (position !== null) {
            console.log(`Premium user expired: ${_dir[position].id}`)
            _dir.splice(position, 1)
            fs.writeFileSync('./json/premium2.json', JSON.stringify(_dir))
        }
    }, 1000)
}

/**
 * Get all premium user ID.
 * @param {object} _dir 
 * @returns {string[]}
 */
const getAllPremiumUser = (_dir) => {
    const array = []
    Object.keys(_dir).forEach((i) => {
        array.push(_dir[i].id)
    })
    return array
}
/**
 * Check if is user premium.
 * @param {string} userId 
 * @param {object} _dir 
 * @returns {boolean}
 */
 const checkOwner = (userId, _dir) => {
    let status = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            status = true
        }
    })
    return status
}

module.exports = {
    addPremiumUser,
    getPremiumExpired,
    getPremiumPosition,
    expiredCheck,
    checkPremiumUser,
    getAllPremiumUser,
    checkOwner
}
