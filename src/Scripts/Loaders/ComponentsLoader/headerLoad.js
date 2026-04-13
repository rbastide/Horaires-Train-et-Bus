async function loadHeader() {
  try {
    const res = await fetch("Components/Header.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    document.getElementById("header-placeholder").innerHTML = html;
  } catch (err) {
    console.error("Erreur chargement Header.html :", err);
  }
}

document.addEventListener('DOMContentLoaded', loadHeader);