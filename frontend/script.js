document.getElementById("checkinForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  let form = document.getElementById("checkinForm");
  let formData = new FormData(form);

  document.getElementById("status").style.color = "#ffcc00";
  document.getElementById("status").innerText = "Mengirim data...";

  try {
    const response = await fetch("http://localhost:3000/checkin", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("status").style.color = "#00ff99";
      document.getElementById("status").innerText = "✔ " + result.message;
      form.reset();
    } else {
      document.getElementById("status").style.color = "red";
      document.getElementById("status").innerText = "✖ " + result.message;
    }

  } catch (err) {
    document.getElementById("status").style.color = "red";
    document.getElementById("status").innerText = "Gagal menghubungi server";
  }
});
