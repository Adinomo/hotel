const form = document.getElementById("checkinForm");
const previewImg = document.getElementById("previewImg");
const previewText = document.getElementById("previewText");
const ktpInput = document.getElementById("ktpInput");
const progressBar = document.getElementById("progressBar");
const statusLine = document.getElementById("status");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalText = document.getElementById("modalText");

// preview file when selected
ktpInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) {
    previewImg.src = "";
    previewText.style.display = "block";
    return;
  }
  previewText.style.display = "none";
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// helper: show modal
function showModal(text) {
  modalText.innerText = text || "Check-in berhasil!";
  modal.style.display = "flex";
}

// close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// submit with progress
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusLine.style.color = "#ffcc00";
  statusLine.textContent = "Mengirim data...";

  const data = new FormData(form);

  // Use XMLHttpRequest to track upload progress
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/checkin", true);

  xhr.upload.onprogress = function (evt) {
    if (evt.lengthComputable) {
      const percent = Math.round((evt.loaded / evt.total) * 100);
      progressBar.style.width = percent + "%";
    }
  };

  xhr.onload = function () {
    try {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        statusLine.style.color = "#7ee7bf";
        statusLine.textContent = "✔ " + (res.message || "Berhasil");
        progressBar.style.width = "100%";
        form.reset();
        previewImg.src = "";
        previewText.style.display = "block";
        setTimeout(() => showModal(res.message || "Check-in berhasil!"), 400);
      } else {
        statusLine.style.color = "salmon";
        statusLine.textContent = "✖ " + (res.message || "Terjadi kesalahan");
      }
    } catch (err) {
      statusLine.style.color = "salmon";
      statusLine.textContent = "✖ Response error";
    }
  };

  xhr.onerror = function () {
    statusLine.style.color = "salmon";
    statusLine.textContent = "✖ Gagal mengirim (network)";
  };

  xhr.send(data);
});
