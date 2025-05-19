const express = require('express');
const cors = require('cors');
const app = express();
const port = 5501;

const { getMusaitSaatler, randevuEkle, getRandevular } = require('./calendar');

app.use(express.json());
app.use(cors());  // BURADA CORS'u etkinleştiriyoruz

app.get('/musait-saatler', async (req, res) => {
  const { tarih } = req.query;
  if (!tarih) return res.status(400).json({ error: "Tarih gerekli" });

  try {
    const saatler = await getMusaitSaatler(tarih);
    res.json({ musaitSaatler: saatler });
  } catch (err) {
    console.error('Saatler alınamadı:', err);
    res.status(500).json({ error: 'Saatler alınamadı' });
  }
});

app.post('/randevu', async (req, res) => {
  const { adsoyad, telefon, tarih, saat } = req.body;

  if (!adsoyad || !telefon || !tarih || !saat) {
    return res.json({ success: false, message: "Lütfen tüm alanları doldurun" });
  }

  try {
    await randevuEkle({ adsoyad, telefon, tarih, saat });
    res.json({ success: true, message: "Randevunuz başarıyla alındı!" });
  } catch (err) {
    console.error('Randevu eklenemedi:', err);
    res.status(500).json({ success: false, message: "Randevu alınamadı. Lütfen tekrar deneyin." });
  }
});

// BURASI EKLENDİ:
app.get('/randevular', (req, res) => {
  const liste = getRandevular();
  res.json(liste);
});

app.listen(port, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${port}`);
});
