const API_URL = "https://script.google.com/macros/s/AKfycbwEbUF74-b-UnZBCiYNuaHcxkXM97UVCmAo6a63m9UhDGHwXTdKFFoXg-PjIjZGR630/exec";

document.getElementById("checkinForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status");
  status.textContent = "Mengirim data...";
  
  const file = document.querySelector("input[name='ktp']").files[0];
  const base64 = await toBase64(file);

  const payload = {
    nama: e.target.nama.value,
    booking: e.target.booking.value,
    hp: e.target.no_hp.value,       // ✅ FIXED
    email: e.target.email.value,
    ktpName: file.name,
    ktpType: file.type,
    ktpFile: base64.split(",")[1]
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"   // ✅ WAJIB ADA
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  window.location.href = data.whatsappUrl;
});

function toBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
