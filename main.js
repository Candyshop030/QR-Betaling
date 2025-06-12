
const producten = [
  { naam: "Chocolade", prijs: 2.50, qrLink: "https://tikkie.me/pay/testlink1" },
  { naam: "Limonade", prijs: 1.75, qrLink: "https://tikkie.me/pay/testlink2" },
  { naam: "Snoepzakje", prijs: 1.00, qrLink: "https://tikkie.me/pay/testlink3" }
];

const root = document.getElementById("root");
root.innerHTML = "<h1>Producten</h1>";

producten.forEach(product => {
  const container = document.createElement("div");
  container.style.marginBottom = "20px";

  const title = document.createElement("h2");
  title.textContent = product.naam + " - €" + product.prijs.toFixed(2);

  const qrImage = document.createElement("img");
  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(product.qrLink);
  qrImage.alt = "Scan om te betalen";

  const link = document.createElement("a");
  link.href = product.qrLink;
  link.textContent = "Of klik hier om te betalen";
  link.target = "_blank";

  container.appendChild(title);
  container.appendChild(qrImage);
  container.appendChild(document.createElement("br"));
  container.appendChild(link);

  root.appendChild(container);
});
