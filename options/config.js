/*
JNGN DIHPS CREATORNYA!
CREATOR : AULIA RAHMAN
JNGN DIHPS CREATORNYA!
DONASI LAH BIAR ADMIN UP LAGI!
DANA : 081528965381
OVO : 085821676621
PULSA : 081528965381
SELAIN NO DIBAWAH INI CLONE YA!
NOMOR WA OWNER : 085821676621
SELAIN NO ITU CLONE YA!
*/

const fs = require('fs')
const chalk = require('chalk')


//━━━━━━━━━━━━━━━[ SETTING ]━━━━━━━━━━━━━━━━━//
global.ultah = '2023-07-09' // 2023-00-00 
global.ramadhan = '2024-03-10' // 2023-00-00
global.hrirya = '2024-04-10' // 2023-00-00
global.thnbru = '2023-01-01' // 2023-00-00
//===============================================//
global.domain = "-" // Isi Domain Lu
global.apikey = '-' // Isi Apikey Plta Lu
global.capikey = '-' // Isi Apikey Pltc Lu
global.thumb = fs.readFileSync('./image/thumbnail.jpg') // JGN DI UBAH!
global.prem = fs.readFileSync('./message/premium2.js'); // jgn di ubah coy
global.jumlah = '1000000000'
global.apilolhuman = 'b2cd31437395ad125a839aec' // PASANG DISINI APIKEY LOLHUMAN, CREATE APIKEY DI WEB : https://api.lolhuman.xyz
global.name = 'Aulia Rahman (Owner)', // GNTI NAMA LU!
global.npacar = 'Kepo Lo', // GANTI NAMA SENDIRI AJA, GSH NMA PCR LO
global.nomorsc = '62858213693245'
global.creatorr = '© Created By RahmXBot' // GANTI NAMA BOT LU BANH!
global.owner = ['62858213693245'] // GNTI NOMOR LU!
global.pacarku = ['6285821676621'] // GANTI NMOR LO, JGN PKEK NOMOR PCR LO, NNTI DI AMBIL ORG NNGES🗿
//global.premium = ['62858213693241', '6285821310166']
 // ADD PREM YG LU MAU BANH!!
global.quotes = 'Kesempatan Anda Untuk Sukses Di Setiap Kondisi Selalu Dapat Diukur Oleh Seberapa Besar Kepercayaan Anda Pada Diri Sendiri' // Ganti Quotes, Tapi Trsrh Klian
global.pulsa = '081528965381' // UBAH NOMOR YG AKTIF!
global.dana = '081528965381' // UBAH NOMOR DANA YG AKTIF!
global.ovo = '085821676621' // UBAH NOMOR OVO YG AKTIF!
global.gopay = '085821676621' // UBAH NOMOR GOPAY YG AKTIF!
global.packname = '© Created By' // TRSERAH MO GANTI AP!
global.titlestic = 'RahmXBot Verified✅' // GNTI NAMA BOT LU!
global.fake = 'RAHMXBOT VERIFIED' // GNTI NMA BOT LU BANH!
global.prefa = ['','!','.','/','#','$']
global.sp = '⭔' // JGN DI UBAH²! NTR EROR
global.mess = {
success: '*[SUCCESS]* SUKSES PERMINTAAN ANDA TERKIRIM!',
admin: 'Fitur Ini Khusus Untuk Admin Group!',
botAdmin: 'Bot Harus Menjadi Admin Terlebih Dahulu!',
prem: 'Fitur Ini Khusus Untuk Premium',
owner: 'Fitur Ini Khusus Untuk Owner Bot',
group: 'Fitur Ini Digunakan Hanya Untuk Group!',
private: 'Fitur Ini Digunakan Hanya Untuk Private Chat!',
bot: 'Fitur Ini Khusus Pengguna Nomor Bot',
errorApi: 'Maaf Api Sedang Error!',
wait: '*[WAIT]* SEDANG DIPROSES, HARAP TUNGGU SEBENTAR! PLEASE JEDA 5 DETIK',
endLimit: 'Limit Harian Anda Telah Habis, Limit Akan Direset Setiap Jam 12',
}
global.limitawal = {
premium: "Unlimited",
free: 10
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update'${__filename}'`))
delete require.cache[file]
require(file)
})
