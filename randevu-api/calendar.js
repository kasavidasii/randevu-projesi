const { google } = require('googleapis');
const path = require('path');
const KEYFILEPATH = path.join(__dirname, 'randevu-takip-460308-c49f315f4e3e.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const calendarId = 'erayeren84@gmail.com'; // takvim ID'n

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// **Bellekte tutmak için dizi ekliyoruz**
const randevular = [];

async function getMusaitSaatler(tarih) {
  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  const baslangic = new Date(`${tarih}T00:00:00`);
  const bitis = new Date(`${tarih}T23:59:59`);

  const events = await calendar.events.list({
    calendarId,
    timeMin: baslangic.toISOString(),
    timeMax: bitis.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const doluSaatler = events.data.items
    .map(e => e.start.dateTime?.substring(11, 16))
    .filter(Boolean);

  const tumSaatler = [
    "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "12:00", "13:00", 
    "13:30", "14:00", "14:30", "15:00", 
    "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];
  const musaitSaatler = tumSaatler.filter(saat => !doluSaatler.includes(saat));
  return musaitSaatler;
}


async function randevuEkle({ adsoyad, telefon, tarih, saat }) {
  const authClient = await auth.getClient();
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  // Loglama
  console.log("Eklenecek randevu:", { adsoyad, telefon, tarih, saat });

  const baslangic = new Date(`${tarih}T${saat}:00`);
  const bitis = new Date(baslangic.getTime() + 30 * 60 * 1000); // 30 dk randevu

  const event = {
    summary: `Randevu: ${adsoyad}`,
    description: `Telefon: ${telefon}`,
    start: { dateTime: baslangic.toISOString() },
    end: { dateTime: bitis.toISOString() },
  };

  await calendar.events.insert({
    calendarId,
    resource: event,
  }).then(res => {
    console.log("Takvime eklendi:", res.data);

    // **Başarıyla eklenince randevuyu belleğe ekle**
    randevular.push({ adsoyad, telefon, tarih, saat });
  }).catch(err => {
    console.error("Takvime eklenemedi:", err);
    throw err; // Hata olursa dışarıya aktar
  });
}

// **Yeni fonksiyon: tüm randevuları döndür**
function getRandevular() {
  return randevular;
}

module.exports = { getMusaitSaatler, randevuEkle, getRandevular };
