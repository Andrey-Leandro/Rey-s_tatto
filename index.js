
"use strict";

/* =========================================
   REY'S TATTOO
   Interações, formulários e painel local
   ========================================= */

document.documentElement.classList.add("js-ready");

const WHATSAPP_NUMBER = "5511924872004";
const INSTAGRAM_URL = "https://www.instagram.com/asteri_rey/";
const STORAGE_KEY = "reysTattooRequests";
const DEMO_PIN = "REY2026";

/* -----------------------------------------
   ELEMENTOS E IDENTIDADE
----------------------------------------- */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

document.title = "Rey's Tattoo | Old School Tattoo Studio";

const description = $('meta[name="description"]');

if (description) {
  description.content =
    "Rey's Tattoo: tatuagem Old School, arte autoral e piercing. Conheça nossos artistas e solicite seu orçamento.";
}

/* Atualiza a marca sem depender das substituições manuais do HTML. */

$$(".brand-text").forEach((element) => {
  element.replaceChildren();

  const name = document.createTextNode("REY'S");
  const small = document.createElement("small");

  small.textContent = "TATTOO STUDIO";

  element.append(name, small);
});

/* Configura telefone e Instagram. */

const whatsappBase = `https://wa.me/${WHATSAPP_NUMBER}`;

const directWhatsapp = $("#directWhatsapp");

if (directWhatsapp) {
  directWhatsapp.href = whatsappBase;
  directWhatsapp.target = "_blank";
  directWhatsapp.rel = "noopener noreferrer";
}

$$('a[href*="instagram.com"]').forEach((link) => {
  link.href = INSTAGRAM_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const currentYear = $("#currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* -----------------------------------------
   NOTIFICAÇÕES
----------------------------------------- */

const toast = $("#toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4800);
}

/* -----------------------------------------
   MENU PARA CELULAR
----------------------------------------- */

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );
  });

  $$("a", mainNav).forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  $("#openAdmin")?.addEventListener("click", closeMenu);

  document.addEventListener("click", (event) => {
    if (
      mainNav.classList.contains("open") &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });
}

/* -----------------------------------------
   ANIMAÇÕES AO ROLAR A PÁGINA
----------------------------------------- */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/* -----------------------------------------
   FILTROS DA GALERIA
----------------------------------------- */

const filterButtons = $$(".filter-btn");
const tattooCards = $$(".tattoo-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    tattooCards.forEach((card) => {
      const matches =
        selectedFilter === "todos" ||
        card.dataset.style === selectedFilter;

      card.hidden = !matches;
    });
  });
});

/* -----------------------------------------
   MODAL DAS IMAGENS
----------------------------------------- */

const imageModal = $("#imageModal");
const modalImage = $("#modalImage");
const modalCaption = $("#modalCaption");

function openImageModal(card) {
  if (!imageModal || !modalImage || !modalCaption) return;

  const image = $("img", card);

  if (!image) return;

  modalImage.src = image.src;
  modalImage.alt = image.alt || "Imagem de referência de tatuagem";

  modalCaption.textContent =
    card.dataset.title || "Referência de tatuagem";

  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  $('[data-close-modal]', imageModal)?.focus();
}

function closeImageModal() {
  if (!imageModal) return;

  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (modalImage) {
    modalImage.removeAttribute("src");
  }
}

tattooCards.forEach((card) => {
  card.addEventListener("click", () => {
    openImageModal(card);
  });
});

$$("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeImageModal);
});

$("#modalQuoteLink")?.addEventListener("click", closeImageModal);

/* -----------------------------------------
   BOTÕES DOS ARTISTAS
----------------------------------------- */

$$(".artist-cta").forEach((button) => {
  button.addEventListener("click", () => {
    const artist = button.dataset.artist;
    const artistSelect = $('select[name="artista"]', $("#quoteForm"));

    if (artistSelect && artist) {
      artistSelect.value = artist;
    }

    $("#orcamento")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    setTimeout(() => {
      $('input[name="nome"]', $("#quoteForm"))?.focus({
        preventScroll: true
      });
    }, 500);
  });
});

/* -----------------------------------------
   DATA MÍNIMA DO AGENDAMENTO
----------------------------------------- */

const bookingDate = $("#bookingDate");

function getLocalDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

if (bookingDate) {
  bookingDate.min = getLocalDateString();
}

/* -----------------------------------------
   REFERÊNCIA DE IMAGEM
----------------------------------------- */

const referenceImage = $("#referenceImage");
const fileName = $("#fileName");
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

if (referenceImage && fileName) {
  referenceImage.addEventListener("change", () => {
    const file = referenceImage.files?.[0];

    if (!file) {
      fileName.textContent = "Nenhuma imagem selecionada";
      return;
    }

    if (!file.type.startsWith("image/")) {
      referenceImage.value = "";
      fileName.textContent = "Nenhuma imagem selecionada";
      showToast("Selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      referenceImage.value = "";
      fileName.textContent = "Nenhuma imagem selecionada";

      showToast("A imagem deve ter no máximo 8 MB.");
      return;
    }

    fileName.textContent = file.name;
  });
}

/* -----------------------------------------
   ARMAZENAMENTO LOCAL
----------------------------------------- */

function readRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erro ao ler solicitações:", error);
    return [];
  }
}

function saveRequests(requests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return true;
  } catch (error) {
    console.error("Erro ao salvar solicitações:", error);

    showToast(
      "Não foi possível salvar no navegador. Verifique o armazenamento disponível."
    );

    return false;
  }
}

function getFormValues(form) {
  const data = {};

  for (const [key, value] of new FormData(form).entries()) {
    if (key === "consentimento") {
      continue;
    }

    if (value instanceof File) {
      if (value.name) {
        data[key] = value.name;
      }

      continue;
    }

    data[key] = String(value).trim();
  }

  return data;
}

function createRequest(type, data) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    createdAt: new Date().toISOString(),
    status: "Nova solicitação",
    data
  };
}

function addRequest(type, data) {
  const requests = readRequests();

  requests.unshift(createRequest(type, data));

  return saveRequests(requests);
}

/* -----------------------------------------
   WHATSAPP
----------------------------------------- */

function buildQuoteMessage(data) {
  const lines = [
    "Olá, Rey's Tattoo! Quero solicitar um orçamento.",
    "",
    `Nome: ${data.nome || "Não informado"}`,
    `WhatsApp: ${data.telefone || "Não informado"}`,
    `Estilo: ${data.estilo || "Não informado"}`,
    `Tamanho: ${data.tamanho || "Não informado"}`,
    `Região do corpo: ${data.regiao || "Não informada"}`,
    `Artista: ${data.artista || "Sem preferência"}`,
    "",
    "Sobre minha ideia:",
    data.descricao || "Ainda preciso de ajuda com a ideia."
  ];

  if (data.referencia) {
    lines.push(
      "",
      `Referência selecionada: ${data.referencia}`,
      "Enviarei a imagem separadamente nesta conversa."
    );
  }

  return lines.join("\n");
}

function buildBookingMessage(data) {
  return [
    "Olá, Rey's Tattoo! Quero solicitar um agendamento.",
    "",
    `Nome: ${data.nome || "Não informado"}`,
    `WhatsApp: ${data.telefone || "Não informado"}`,
    `Serviço: ${data.servico || "Não informado"}`,
    `Artista: ${data.artista || "Sem preferência"}`,
    `Data desejada: ${data.data || "Não informada"}`,
    `Período: ${data.periodo || "Não informado"}`,
    `Observações: ${data.observacoes || "Nenhuma"}`,
    "",
    "Se houver disponibilidade, por favor, me informem os horários."
  ].join("\n");
}

function openWhatsApp(message) {
  const url =
    `${whatsappBase}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

/* -----------------------------------------
   FORMULÁRIO DE ORÇAMENTO
----------------------------------------- */

const quoteForm = $("#quoteForm");

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const data = getFormValues(quoteForm);

    const saved = addRequest("Orçamento", data);

    if (saved) {
      showToast(
        "Solicitação registrada neste navegador. Abrindo o WhatsApp..."
      );
    }

    openWhatsApp(buildQuoteMessage(data));

    const hasReference = Boolean(data.referencia);

    quoteForm.reset();

    if (fileName) {
      fileName.textContent = "Nenhuma imagem selecionada";
    }

    if (hasReference) {
      showToast(
        "A imagem não é anexada automaticamente. Envie-a na conversa do WhatsApp."
      );
    }
  });
}

/* -----------------------------------------
   FORMULÁRIO DE AGENDAMENTO
----------------------------------------- */

const bookingForm = $("#bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) return;

    const data = getFormValues(bookingForm);

    if (data.data && data.data < getLocalDateString()) {
      showToast("Escolha uma data de hoje em diante.");
      bookingDate?.focus();
      return;
    }

    const saved = addRequest("Agendamento", data);

    if (saved) {
      showToast(
        "Pedido registrado localmente. Abrindo o WhatsApp..."
      );
    }

    openWhatsApp(buildBookingMessage(data));

    bookingForm.reset();

    if (bookingDate) {
      bookingDate.min = getLocalDateString();
    }
  });
}

/* -----------------------------------------
   PAINEL ADMINISTRATIVO DEMONSTRATIVO
----------------------------------------- */

const adminModal = $("#adminModal");
const adminLoginView = $("#adminLoginView");
const adminDashboard = $("#adminDashboard");
const adminLoginForm = $("#adminLoginForm");
const adminError = $("#adminError");

let adminSession = false;

function openAdminModal() {
  if (!adminModal) return;

  adminModal.classList.add("is-open");
  adminModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (adminSession) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
}

function closeAdminModal() {
  if (!adminModal) return;

  adminModal.classList.remove("is-open");
  adminModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function showAdminLogin() {
  if (adminLoginView) adminLoginView.hidden = false;
  if (adminDashboard) adminDashboard.hidden = true;

  if (adminError) adminError.textContent = "";

  setTimeout(() => {
    $("#adminPin")?.focus({ preventScroll: true });
  }, 50);
}

function showAdminDashboard() {
  if (adminLoginView) adminLoginView.hidden = true;
  if (adminDashboard) adminDashboard.hidden = false;

  renderAdminRequests();
}

$("#openAdmin")?.addEventListener("click", openAdminModal);

$$("[data-close-admin]").forEach((button) => {
  button.addEventListener("click", closeAdminModal);
});

/*
  PIN demonstrativo: REY2026.
  Não é uma autenticação segura para uso em produção.
*/

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const suppliedPin = $("#adminPin")?.value ?? "";

    if (suppliedPin === DEMO_PIN) {
      adminSession = true;

      if ($("#adminPin")) {
        $("#adminPin").value = "";
      }

      showAdminDashboard();
      showToast("Painel demonstrativo aberto.");
    } else {
      if (adminError) {
        adminError.textContent = "Código incorreto. Tente novamente.";
      }

      $("#adminPin")?.select();
    }
  });
}

$("#adminLogout")?.addEventListener("click", () => {
  adminSession = false;

  showAdminLogin();
  showToast("Você saiu do painel.");
});

/* -----------------------------------------
   CONTEÚDO DO PAINEL
----------------------------------------- */

function createTextElement(tag, text, className = "") {
  const element = document.createElement(tag);

  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Data não disponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function renderAdminRequests() {
  const requests = readRequests();
  const list = $("#adminRequestList");

  if (!list) return;

  const total = $("#totalRequests");
  const quotes = $("#quoteRequests");
  const bookings = $("#bookingRequests");

  if (total) {
    total.textContent = String(requests.length);
  }

  if (quotes) {
    quotes.textContent = String(
      requests.filter((item) => item.type === "Orçamento").length
    );
  }

  if (bookings) {
    bookings.textContent = String(
      requests.filter((item) => item.type === "Agendamento").length
    );
  }

  list.replaceChildren();

  if (requests.length === 0) {
    list.append(
      createTextElement(
        "p",
        "Nenhuma solicitação salva ainda. Os novos pedidos aparecerão aqui neste navegador.",
        "admin-empty"
      )
    );

    return;
  }

  requests.forEach((request) => {
    const card = document.createElement("article");
    card.className = "admin-request";

    const header = document.createElement("div");
    header.className = "admin-request-head";

    const title = createTextElement(
      "h4",
      `${request.type || "Solicitação"} · ${
        request.data?.nome || "Cliente sem nome"
      }`
    );

    const badge = createTextElement(
      "span",
      request.status || "Nova solicitação",
      "status-label"
    );

    header.append(title, badge);
    card.append(header);

    const details = request.data || {};

    const labels = {
      telefone: "WhatsApp",
      estilo: "Estilo",
      tamanho: "Tamanho",
      regiao: "Região do corpo",
      artista: "Artista",
      descricao: "Descrição",
      servico: "Serviço",
      data: "Data desejada",
      periodo: "Período",
      observacoes: "Observações",
      referencia: "Referência"
    };

    Object.entries(details).forEach(([key, value]) => {
      if (!value) return;

      if (key === "consentimento") return;

      const label = labels[key] || key;

      card.append(
        createTextElement("p", `${label}: ${String(value)}`)
      );
    });

    card.append(
      createTextElement("time", formatDate(request.createdAt))
    );

    const deleteButton = createTextElement(
      "button",
      "Excluir registro"
    );

    deleteButton.type = "button";
    deleteButton.className = "delete-request";

    deleteButton.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Deseja excluir este registro salvo neste navegador?"
      );

      if (!confirmed) return;

      const updatedRequests = readRequests().filter(
        (item) => item.id !== request.id
      );

      if (saveRequests(updatedRequests)) {
        renderAdminRequests();
        showToast("Registro excluído.");
      }
    });

    card.append(deleteButton);
    list.append(card);
  });
}

/* -----------------------------------------
   EXPORTAR REGISTROS COMO JSON
----------------------------------------- */

$("#exportRequests")?.addEventListener("click", () => {
  const requests = readRequests();

  if (requests.length === 0) {
    showToast("Ainda não existem registros para exportar.");
    return;
  }

  const json = JSON.stringify(requests, null, 2);
  const blob = new Blob([json], {
    type: "application/json;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "reys-tattoo-solicitacoes.json";

  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showToast("Arquivo JSON preparado para exportação.");
});

/* -----------------------------------------
   FECHAR MODAIS COM ESC
----------------------------------------- */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  closeImageModal();
  closeAdminModal();
  closeMenu();
});

/* -----------------------------------------
   INICIALIZAÇÃO
----------------------------------------- */

console.log(
  "Rey's Tattoo carregado! Old School na estética, JavaScript na ação. ✳"
);
