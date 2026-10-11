"use strict";

const cars = [
  {
    id: 1,
    brand: "Porsche",
    model: "911 Carrera GTS",
    type: "Esportivo",
    year: 2025,
    power: 541,
    acceleration: 3.0,
    speed: 312,
    price: 1099000,
    engine: "3.6L Boxer Híbrido",
    transmission: "PDK",
    badge: "DESTAQUE",
    image: "imagens/porsche-911.jpg",
    description:
      "Um ícone da engenharia alemã. Precisão, tradição e desempenho em uma experiência de condução inconfundível.",
  },
  {
    id: 2,
    brand: "BMW",
    model: "M4 Competition",
    type: "Esportivo",
    year: 2025,
    power: 510,
    acceleration: 3.9,
    speed: 290,
    price: 850000,
    engine: "3.0L TwinPower Turbo",
    transmission: "Automático",
    badge: "PERFORMANCE",
    image: "imagens/bmw-m4.jpg",
    description:
      "Potência e controle com a personalidade esportiva da divisão BMW M.",
  },
  {
    id: 3,
    brand: "Mercedes-Benz",
    model: "AMG GT",
    type: "Esportivo",
    year: 2025,
    power: 585,
    acceleration: 3.2,
    speed: 315,
    price: 1350000,
    engine: "4.0L V8 Biturbo",
    transmission: "Automático",
    badge: "EXCLUSIVO",
    image: "imagens/mercedes-amg-gt.jpg",
    description:
      "Uma combinação marcante de luxo, tecnologia e desempenho inspirada no automobilismo.",
  },
  {
    id: 4,
    brand: "Audi",
    model: "RS e-tron GT",
    type: "Esportivo",
    year: 2025,
    power: 680,
    acceleration: 3.4,
    speed: 250,
    price: 1100000,
    engine: "Elétrico",
    transmission: "Automático",
    badge: "ELÉTRICO",
    image: "imagens/audi-etron.jpg",
    description:
      "Performance elétrica com o design sofisticado e a tecnologia característicos da Audi.",
  },
  {
    id: 5,
    brand: "Porsche",
    model: "Cayenne Coupé",
    type: "SUV",
    year: 2024,
    power: 353,
    acceleration: 5.7,
    speed: 248,
    price: 760000,
    engine: "3.0L V6 Turbo",
    transmission: "Tiptronic S",
    badge: "VERSATILIDADE",
    image: "imagens/porsche-cayenne.jpg",
    description: "A praticidade de um SUV com o DNA esportivo da Porsche.",
  },
  {
    id: 6,
    brand: "BMW",
    model: "M3 Competition",
    type: "Sedã",
    year: 2024,
    power: 510,
    acceleration: 3.9,
    speed: 290,
    price: 780000,
    engine: "3.0L TwinPower Turbo",
    transmission: "Automático",
    badge: "M POWER",
    image: "imagens/bmw-m3.jpg",
    description:
      "Um sedã que entrega praticidade e uma personalidade verdadeiramente esportiva.",
  },
  {
    id: 7,
    brand: "Mercedes-Benz",
    model: "AMG C 63 S",
    type: "Sedã",
    year: 2025,
    power: 680,
    acceleration: 3.4,
    speed: 280,
    price: 920000,
    engine: "2.0L Híbrido",
    transmission: "Automático",
    badge: "HÍBRIDO",
    image: "imagens/mercedes-c63.jpg",
    description:
      "Tecnologia híbrida de alto desempenho com o conforto de um sedã premium.",
  },
  {
    id: 8,
    brand: "Audi",
    model: "RS Q8",
    type: "SUV",
    year: 2025,
    power: 600,
    acceleration: 3.8,
    speed: 305,
    price: 1180000,
    engine: "4.0L V8 Biturbo",
    transmission: "Tiptronic",
    badge: "ALTA PERFORMANCE",
    image: "imagens/audi-rsq8.jpg",
    description:
      "Um SUV de luxo que combina presença, conforto e desempenho impressionante.",
  },
];

// Catálogo e valores demonstrativos: não são ofertas reais.
// As fotos são ilustrativas e podem não representar o modelo descrito.

const $ = (selector) => document.querySelector(selector);
const money = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("apex-favorites") || "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (id) => Number.isInteger(id) && cars.some((car) => car.id === id),
        )
      : [];
  } catch {
    return [];
  }
}

let favorites = readFavorites();
let compared = [];
let quickFilter = "all";
let toastTimer;

function saveFavorites() {
  try {
    localStorage.setItem("apex-favorites", JSON.stringify(favorites));
  } catch {
    showToast("Não foi possível salvar favoritos neste navegador.");
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2700);
}

function getFilteredCars() {
  const search = $("#searchInput").value.toLocaleLowerCase("pt-BR").trim();
  const brand = $("#brandFilter").value;
  const type = $("#typeFilter").value;
  const sort = $("#sortFilter").value;

  const result = cars.filter((car) => {
    const textMatch = `${car.brand} ${car.model}`
      .toLocaleLowerCase("pt-BR")
      .includes(search);
    const brandMatch = brand === "all" || car.brand === brand;
    const typeMatch = type === "all" || car.type === type;
    const quickMatch =
      quickFilter === "all" ||
      (quickFilter === "favorites"
        ? favorites.includes(car.id)
        : car.type === quickFilter);

    return textMatch && brandMatch && typeMatch && quickMatch;
  });

  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "power-desc") result.sort((a, b) => b.power - a.power);
  if (sort === "year-desc") result.sort((a, b) => b.year - a.year);

  return result;
}

function renderCars() {
  const filtered = getFilteredCars();

  $("#resultsCount").textContent =
    `${String(filtered.length).padStart(2, "0")} VEÍCULOS`;
  $("#favoritesCount").textContent = favorites.length;
  $("#emptyState").classList.toggle("hidden", filtered.length > 0);

  $("#carGrid").innerHTML = filtered
    .map(
      (car) => `
    <article class="car-card">
      <div class="car-image">
        <img src="${car.image}" alt="Imagem ilustrativa de ${car.brand} ${car.model}"
          loading="lazy" onerror="this.style.opacity='.15'">
        <span class="car-badge">${car.badge}</span>
        <button class="favorite-btn ${favorites.includes(car.id) ? "active" : ""}"
          data-action="favorite" data-id="${car.id}"
          aria-label="${favorites.includes(car.id) ? "Remover dos" : "Adicionar aos"} favoritos"
          aria-pressed="${favorites.includes(car.id)}">♥</button>
      </div>
      <div class="car-info">
        <span class="car-brand">${car.brand.toUpperCase()} / ${car.type.toUpperCase()}</span>
        <h3>${car.model}</h3>
        <div class="car-specs">
          <span>⚡ ${car.power} cv</span>
          <span>◷ ${car.acceleration.toFixed(1).replace(".", ",")}s</span>
          <span>◈ ${car.year}</span>
        </div>
        <div class="car-bottom">
          <div class="car-price">
            <small>VALOR ILUSTRATIVO</small>
            <strong>${money(car.price)}</strong>
          </div>
          <button class="details-btn" data-action="details" data-id="${car.id}">DETALHES ↗</button>
        </div>
        <label class="compare-label">
          <input type="checkbox" data-action="compare" data-id="${car.id}"
            ${compared.includes(car.id) ? "checked" : ""}>
          Adicionar à comparação
        </label>
      </div>
    </article>
  `,
    )
    .join("");

  updateCompareBar();
}

function setQuickFilter(value) {
  quickFilter = value;
  document.querySelectorAll("[data-quick]").forEach((button) => {
    button.classList.toggle("active", button.dataset.quick === value);
  });
  renderCars();
}

function clearFilters() {
  $("#searchInput").value = "";
  $("#brandFilter").value = "all";
  $("#typeFilter").value = "all";
  $("#sortFilter").value = "default";
  setQuickFilter("all");
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((item) => item !== id);
    showToast("Removido dos favoritos");
  } else {
    favorites.push(id);
    showToast("Adicionado aos favoritos ♥");
  }
  saveFavorites();
  renderCars();
}

function toggleCompare(id, checked) {
  if (checked && compared.length >= 3) {
    showToast("Selecione no máximo 3 veículos.");
    renderCars();
    return;
  }

  compared = checked
    ? [...compared, id]
    : compared.filter((item) => item !== id);

  renderCars();
}

function updateCompareBar() {
  $("#compareBar").classList.toggle("hidden", compared.length === 0);
  $("#compareCount").textContent = `${compared.length}/3`;
  $("#openCompare").disabled = compared.length < 2;
  $("#openCompare").style.opacity = compared.length < 2 ? ".5" : "1";
}

function openModal(html) {
  $("#modalContent").innerHTML = html;
  $("#modal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  $("#closeModal").focus();
}

function closeModal() {
  $("#modal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function showDetails(id) {
  const car = cars.find((item) => item.id === id);
  if (!car) return;

  openModal(`
    <img class="modal-car-image" src="${car.image}" alt="Imagem ilustrativa de ${car.model}">
    <div class="modal-body">
      <span class="car-brand">${car.brand.toUpperCase()} / ${car.type.toUpperCase()}</span>
      <h2>${car.model}</h2>
      <p>${car.description}</p>
      <div class="modal-spec-grid">
        <div class="modal-spec"><span>POTÊNCIA</span><strong>${car.power} cv</strong></div>
        <div class="modal-spec"><span>0–100 KM/H</span><strong>${car.acceleration.toFixed(1).replace(".", ",")} s</strong></div>
        <div class="modal-spec"><span>VELOCIDADE MÁXIMA</span><strong>${car.speed} km/h</strong></div>
        <div class="modal-spec"><span>ANO</span><strong>${car.year}</strong></div>
        <div class="modal-spec"><span>MOTORIZAÇÃO</span><strong>${car.engine}</strong></div>
        <div class="modal-spec"><span>TRANSMISSÃO</span><strong>${car.transmission}</strong></div>
      </div>
      <div class="car-price"><small>VALOR ILUSTRATIVO</small><strong>${money(car.price)}</strong></div>
      <br>
      <button class="btn btn-primary" id="simulateSelected" data-id="${car.id}">SIMULAR FINANCIAMENTO ↗</button>
    </div>
  `);
}

function showComparison() {
  if (compared.length < 2) return;

  const selected = compared
    .map((id) => cars.find((car) => car.id === id))
    .filter(Boolean);
  const rows = [
    ["Marca", "brand"],
    ["Categoria", "type"],
    ["Ano", "year"],
    ["Potência", "power"],
    ["0–100 km/h", "acceleration"],
    ["Velocidade máxima", "speed"],
    ["Motor", "engine"],
    ["Transmissão", "transmission"],
    ["Preço ilustrativo", "price"],
  ];

  const format = (car, field) => {
    if (field === "price") return money(car.price);
    if (field === "power") return `${car.power} cv`;
    if (field === "speed") return `${car.speed} km/h`;
    if (field === "acceleration")
      return `${car.acceleration.toFixed(1).replace(".", ",")} s`;
    return car[field];
  };

  openModal(`
    <div class="modal-body">
      <span class="section-kicker">SIDE BY SIDE</span>
      <h2>COMPARAR VEÍCULOS</h2>
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead><tr><th>CARACTERÍSTICA</th>${selected.map((car) => `<th>${car.model}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows
              .map(
                ([label, field]) => `
              <tr><td>${label}</td>${selected.map((car) => `<td>${format(car, field)}</td>`).join("")}</tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <p>Dados demonstrativos para comparação. Consulte informações oficiais antes de qualquer decisão de compra.</p>
    </div>
  `);
}

function updateFinance() {
  const car =
    cars.find((item) => item.id === Number($("#financeCar").value)) || cars[0];
  const downPercent = Number($("#downPayment").value);
  const months = Number($("#months").value);
  const interest = Number($("#interestRate").value);

  $("#downPaymentLabel").textContent = `${downPercent}%`;
  $("#monthsLabel").textContent = `${months} meses`;

  if (!Number.isFinite(interest) || interest < 0 || interest > 10) {
    $("#monthlyPrice").textContent = "Taxa inválida";
    return;
  }

  const down = (car.price * downPercent) / 100;
  const amount = car.price - down;
  const rate = interest / 100;
  const monthly =
    rate === 0
      ? amount / months
      : (amount * rate) / (1 - Math.pow(1 + rate, -months));

  $("#monthlyPrice").textContent = money(monthly);
  $("#financePrice").textContent = money(car.price);
  $("#financeDown").textContent = money(down);
  $("#financeAmount").textContent = money(amount);
  $("#financeTotal").textContent = money(monthly * months);
}

function setupFinance() {
  $("#financeCar").innerHTML = cars
    .map(
      (car) =>
        `<option value="${car.id}">${car.brand} ${car.model} — ${money(car.price)}</option>`,
    )
    .join("");

  ["financeCar", "downPayment", "months", "interestRate"].forEach((id) => {
    $("#" + id).addEventListener("input", updateFinance);
  });

  updateFinance();
}

// Eventos dos filtros
["searchInput", "brandFilter", "typeFilter", "sortFilter"].forEach((id) => {
  $("#" + id).addEventListener(
    id === "searchInput" ? "input" : "change",
    renderCars,
  );
});

$("#clearFilters").addEventListener("click", clearFilters);
$("#resetEmpty").addEventListener("click", clearFilters);

document.querySelectorAll("[data-quick]").forEach((button) => {
  button.addEventListener("click", () => setQuickFilter(button.dataset.quick));
});

$("#favoritesShortcut").addEventListener("click", () => {
  $("#searchInput").value = "";
  $("#brandFilter").value = "all";
  $("#typeFilter").value = "all";
  setQuickFilter("favorites");
  $("#catalogo").scrollIntoView({ behavior: "smooth" });
});

// Eventos dos cards, incluindo os criados dinamicamente
$("#carGrid").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "favorite") toggleFavorite(id);
  if (button.dataset.action === "details") showDetails(id);
});

$("#carGrid").addEventListener("change", (event) => {
  const input = event.target.closest('input[data-action="compare"]');
  if (input) toggleCompare(Number(input.dataset.id), input.checked);
});

// Comparação
$("#clearCompare").addEventListener("click", () => {
  compared = [];
  renderCars();
});

$("#openCompare").addEventListener("click", showComparison);

// Modal
$("#closeModal").addEventListener("click", closeModal);

$("#modal").addEventListener("click", (event) => {
  if (event.target.dataset.close === "true") closeModal();

  const simulateButton = event.target.closest("#simulateSelected");
  if (simulateButton) {
    $("#financeCar").value = simulateButton.dataset.id;
    updateFinance();
    closeModal();
    $("#financiamento").scrollIntoView({ behavior: "smooth" });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// Menu mobile
$("#menuToggle").addEventListener("click", () => {
  $("#navLinks").classList.toggle("open");
});

document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => $("#navLinks").classList.remove("open"));
});

// Inicialização
setupFinance();
renderCars();
