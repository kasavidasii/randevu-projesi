    let sonRandevu = null;
    const uyariSesi = document.getElementById("uyariSesi");

    async function sonRandevuyuGetir() {
      try {
        const response = await fetch("http://localhost:5501/randevular");
        const randevular = await response.json();

        if (randevular.length === 0) return;

        const veri = randevular[randevular.length - 1]; // Son randevu

        if (!sonRandevu || JSON.stringify(sonRandevu) !== JSON.stringify(veri)) {
          sonRandevu = veri;

          const mesajKutusu = document.getElementById("mesaj");
          mesajKutusu.classList.remove("kirmizi");
          mesajKutusu.innerHTML = `
            <strong>Yeni bir randevu alındı:</strong><br>
            Ad Soyad: ${veri.adsoyad}<br>
            Telefon: ${veri.telefon}<br>
            Tarih: ${veri.tarih}<br>
            Saat: ${veri.saat}
          `;

          document.getElementById("tamamButonu").style.display = "inline-block";
          uyariSesi.play(); // 🔊 Sesi çal
        }
      } catch (error) {
        console.error("Randevu alınamadı:", error);
      }
    }

    // "Tamam" butonuna basıldığında ses durur ve yazılar kırmızıya döner
    document.getElementById("tamamButonu").addEventListener("click", () => {
      const mesajKutusu = document.getElementById("mesaj");
      mesajKutusu.classList.add("kirmizi");
      uyariSesi.pause(); // 🔇 Sesi durdur
      uyariSesi.currentTime = 0; // Baştan başlatmak için sıfırla
    });

    window.onload = () => {
      sonRandevuyuGetir();
      setInterval(sonRandevuyuGetir, 5000);
    };