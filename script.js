//<!-- 🔹 SLIDER JS -->

  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;

  // Otomatik geçiş fonksiyonu
  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  // Slaytları 5 saniyede bir otomatik geçirecek
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 9000); // 5 saniyede bir geçiş

  // Noktalara tıklandığında slaytı göster
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i; // Tıklanan noktayı aktif yap
      showSlide(i);
    });
  });

  // Sayfa yüklendiğinde ilk slaytı göster
  showSlide(current);

  document.getElementById("show-more-btn").addEventListener("click", function () {
    const hiddenBoxes = document.querySelectorAll(".extra-opinion");
    hiddenBoxes.forEach(function (box) {
      box.style.display = "block";
    });
    this.style.display = "none"; // Butonu gizle
  });
 // galeri
function openLightbox(imgElement) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = imgElement.src;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// randevu
function openModal() {
  document.getElementById('randevuModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('randevuModal').style.display = 'none';
}


// Tarih seçilince uygun saatleri getir
document.querySelector('input[name="tarih"]').addEventListener('change', async (e) => {
  const secilenTarih = e.target.value; // yyyy-mm-dd
  const res = await fetch(`http://localhost:5501/musait-saatler?tarih=${secilenTarih}`); // port 5501 olmalı
  const data = await res.json();

  const saatSelect = document.querySelector('select[name="saat"]');
  saatSelect.innerHTML = ''; // önceki saatleri temizle

  if (data.musaitSaatler.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'Uygun saat yok';
    option.disabled = true;
    saatSelect.appendChild(option);
    return;
  }

  data.musaitSaatler.forEach(saat => {
    const option = document.createElement('option');
    option.value = saat;
    option.textContent = saat;
    saatSelect.appendChild(option);
  });
});

// Form gönderilince randevuyu takvime ekle
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const adsoyad = document.querySelector('input[name="adsoyad"]').value;
  const telefon = document.querySelector('input[name="telefon"]').value;
  const tarih = document.querySelector('input[name="tarih"]').value;
  const saat = document.querySelector('select[name="saat"]').value;

  if (!adsoyad || !telefon || !tarih || !saat) {
    alert('Lütfen tüm alanları doldurun.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5501/randevu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adsoyad, telefon, tarih, saat })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error('Hata:', err);
    alert('Randevu alınamadı. Lütfen tekrar deneyin.');
  }
});



