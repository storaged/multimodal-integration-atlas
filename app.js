const DATA_URL = "data/integration_methods_library.csv";

const filterConfig = [
  { id: "axis_correspondence", label: "Correspondence" },
  { id: "axis_missingness", label: "Missingness" },
  { id: "axis_granularity", label: "Granularity" },
  { id: "axis_prior_knowledge", label: "Prior knowledge" },
  { id: "axis_latent_design", label: "Latent design" },
  { id: "axis_architecture", label: "Architecture" },
  { id: "axis_application_level", label: "Application level" },
  { id: "application_task", label: "Application type" },
  { id: "axis_supervision", label: "Supervision" },
  { id: "method_family", label: "Method family" },
];

const axisLabels = {
  axis_correspondence: "Correspondence",
  axis_missingness: "Missingness",
  axis_granularity: "Granularity",
  axis_prior_knowledge: "Prior knowledge",
  axis_latent_design: "Latent design",
  axis_architecture: "Architecture",
  axis_application_level: "Application level",
  axis_supervision: "Supervision",
  application_primary_task: "Application type",
  source_table: "Source",
};

let methods = [];

const suggestionSelects = [
  { id: "suggestFamily", source: "method_family", fallback: ["Other / unsure"] },
  { id: "suggestPairedness", source: "axis_correspondence", fallback: ["unsure"] },
  { id: "suggestMissingness", source: "axis_missingness", fallback: ["unsure"] },
  { id: "suggestLevel", source: "axis_granularity", fallback: ["unsure"] },
  { id: "suggestPrior", source: "axis_prior_knowledge", fallback: ["unsure"] },
  { id: "suggestLatent", source: "axis_latent_design", fallback: ["unsure"] },
  { id: "suggestArchitecture", source: "axis_architecture", fallback: ["unsure"] },
  { id: "suggestApplicationLevel", source: "axis_application_level", fallback: ["unsure"] },
  { id: "suggestSupervision", source: "axis_supervision", fallback: ["unsure"] },
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift();
  return rows
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])),
    );
}

function labelize(value) {
  if (!value) return "unspecified";
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value) {
  return (value || "method")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function csvEscape(value) {
  const safe = value || "";
  if (/[",\n]/.test(safe)) return `"${safe.replaceAll('"', '""')}"`;
  return safe;
}

function selectOptions(id) {
  if (id === "application_task") {
    const tasks = new Set();
    methods.forEach((method) => {
      (method.application_tasks || "")
        .split(";")
        .map((task) => task.trim())
        .filter(Boolean)
        .forEach((task) => tasks.add(task));
    });
    return [...tasks].sort();
  }

  return [...new Set(methods.map((method) => method[id]).filter(Boolean))].sort((a, b) =>
    labelize(a).localeCompare(labelize(b)),
  );
}

function populateSelects() {
  filterConfig.forEach(({ id }) => {
    const select = document.getElementById(id);
    select.innerHTML = "";
    const anyOption = document.createElement("option");
    anyOption.value = "";
    anyOption.textContent = "Any";
    select.appendChild(anyOption);

    selectOptions(id).forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = labelize(value);
      select.appendChild(option);
    });
  });
}

function populateSuggestionSelects() {
  suggestionSelects.forEach(({ id, source, fallback }) => {
    const select = document.getElementById(id);
    select.innerHTML = "";

    const unsure = document.createElement("option");
    unsure.value = "";
    unsure.textContent = "Unspecified";
    select.appendChild(unsure);

    const values = [...new Set([...selectOptions(source), ...fallback])].filter(Boolean);
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = labelize(value);
      select.appendChild(option);
    });
  });
}

function getFilters() {
  const filters = {};
  filterConfig.forEach(({ id }) => {
    filters[id] = document.getElementById(id).value;
  });
  filters.search = document.getElementById("searchInput").value.trim().toLowerCase();
  filters.hideCuration = document.getElementById("hideCuration").checked;
  return filters;
}

function taskMatches(method, value) {
  if (!value) return true;
  return (method.application_tasks || "")
    .split(";")
    .map((task) => task.trim())
    .includes(value);
}

function methodMatches(method, filters) {
  if (filters.hideCuration && method.needs_curation === "yes") return false;
  if (filters.search) {
    const haystack = [
      method.method,
      method.method_family,
      method.method_scope,
      method.application_primary_task,
      method.axis_prior_knowledge,
      method.axis_latent_design,
      method.axis_architecture,
      method.axis_application_level,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(filters.search)) return false;
  }

  return filterConfig.every(({ id }) => {
    const value = filters[id];
    if (!value) return true;
    if (id === "application_task") return taskMatches(method, value);
    return method[id] === value;
  });
}

function scoreMethod(method, filters) {
  let matched = 0;
  let specified = 0;
  filterConfig.forEach(({ id }) => {
    const value = filters[id];
    if (!value) return;
    specified += 1;
    if (id === "application_task" ? taskMatches(method, value) : method[id] === value) {
      matched += 1;
    }
  });
  return specified ? matched : 0;
}

function renderActiveFilters(filters) {
  const container = document.getElementById("activeFilters");
  const chips = [];

  if (filters.search) chips.push(`Search: ${filters.search}`);
  filterConfig.forEach(({ id, label }) => {
    if (filters[id]) chips.push(`${label}: ${labelize(filters[id])}`);
  });
  if (filters.hideCuration) chips.push("Curated rows only");

  container.innerHTML = "";
  chips.forEach((chip) => {
    const element = document.createElement("span");
    element.className = "chip";
    element.textContent = chip;
    container.appendChild(element);
  });
}

function axisBlock(label, value) {
  return `
    <div class="axis">
      <span>${label}</span>
      <strong>${labelize(value)}</strong>
    </div>
  `;
}

function renderMethod(method, score) {
  const statusClass = method.needs_curation === "yes" ? "needs-curation" : "curated";
  const statusText = method.needs_curation === "yes" ? "Needs curation" : "Curated";
  const scoreText = score ? `${score} matched` : "No filters";
  return `
    <article class="method-card">
      <div class="method-topline">
        <div>
          <h3>${method.method}</h3>
          <div class="method-meta">${method.method_family} · ${labelize(method.method_scope)}</div>
        </div>
        <div class="score">${scoreText}</div>
      </div>
      <div class="axis-grid">
        ${axisBlock(axisLabels.axis_correspondence, method.axis_correspondence)}
        ${axisBlock(axisLabels.axis_missingness, method.axis_missingness)}
        ${axisBlock(axisLabels.axis_granularity, method.axis_granularity)}
        ${axisBlock(axisLabels.axis_prior_knowledge, method.axis_prior_knowledge)}
        ${axisBlock(axisLabels.axis_latent_design, method.axis_latent_design)}
        ${axisBlock(axisLabels.axis_architecture, method.axis_architecture)}
        ${axisBlock(axisLabels.axis_application_level, method.axis_application_level)}
        ${axisBlock(axisLabels.axis_supervision, method.axis_supervision)}
        ${axisBlock(axisLabels.application_primary_task, method.application_primary_task)}
        ${axisBlock(axisLabels.source_table, method.source_table)}
      </div>
      <span class="status ${statusClass}">${statusText}</span>
    </article>
  `;
}

function suggestionValue(id) {
  return document.getElementById(id).value.trim();
}

function legacyGranularity(value) {
  if (value === "single-level") return "single";
  if (value === "multi-level") return "multi";
  return "";
}

function candidateCsvRow() {
  const method = suggestionValue("suggestMethod");
  const family = suggestionValue("suggestFamily");
  const task = suggestionValue("suggestTask");
  const granularity = suggestionValue("suggestLevel");
  const citation = suggestionValue("suggestCitation");
  const row = [
    slugify(method),
    method,
    family,
    "",
    suggestionValue("suggestPairedness"),
    suggestionValue("suggestMissingness"),
    granularity,
    suggestionValue("suggestPrior"),
    suggestionValue("suggestLatent"),
    suggestionValue("suggestArchitecture"),
    suggestionValue("suggestApplicationLevel"),
    suggestionValue("suggestSupervision"),
    "Community suggestion",
    "",
    "",
    suggestionValue("suggestPairedness"),
    suggestionValue("suggestMissingness"),
    legacyGranularity(granularity),
    "",
    suggestionValue("suggestPrior"),
    task,
    suggestionValue("suggestSupervision"),
    task.replace(/\s*\+\s*/g, ";"),
    "yes",
    `suggested citation: ${citation}`,
  ];
  return row.map(csvEscape).join(",");
}

function issueUrl() {
  const method = suggestionValue("suggestMethod") || "new method";
  const body = [
    "## Method suggestion",
    "",
    `- Method: ${method}`,
    `- Citation or DOI: ${suggestionValue("suggestCitation") || "not provided"}`,
    `- Method family: ${suggestionValue("suggestFamily") || "unspecified"}`,
    `- Correspondence: ${suggestionValue("suggestPairedness") || "unspecified"}`,
    `- Missingness: ${suggestionValue("suggestMissingness") || "unspecified"}`,
    `- Granularity: ${suggestionValue("suggestLevel") || "unspecified"}`,
    `- Prior knowledge: ${suggestionValue("suggestPrior") || "unspecified"}`,
    `- Latent design: ${suggestionValue("suggestLatent") || "unspecified"}`,
    `- Architecture: ${suggestionValue("suggestArchitecture") || "unspecified"}`,
    `- Application level: ${suggestionValue("suggestApplicationLevel") || "unspecified"}`,
    `- Supervision: ${suggestionValue("suggestSupervision") || "unspecified"}`,
    `- Application type: ${suggestionValue("suggestTask") || "unspecified"}`,
    "",
    "## Evidence and rationale",
    "",
    suggestionValue("suggestRationale") || "Not provided.",
    "",
    "## Candidate CSV row",
    "",
    "```csv",
    candidateCsvRow(),
    "```",
  ].join("\n");

  const params = new URLSearchParams({
    title: `Method suggestion: ${method}`,
    body,
    labels: "method suggestion,curation",
  });
  return `https://github.com/storaged/multimodal-integration-atlas/issues/new?${params.toString()}`;
}

function updateSuggestionOutput() {
  document.getElementById("suggestCsvRow").value = candidateCsvRow();
  document.getElementById("openIssueLink").href = issueUrl();
}

function renderResults() {
  const filters = getFilters();
  renderActiveFilters(filters);

  const visible = methods
    .filter((method) => methodMatches(method, filters))
    .map((method) => ({ method, score: scoreMethod(method, filters) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.method.method.localeCompare(b.method.method);
    });

  document.getElementById("visibleCount").textContent = visible.length;
  const list = document.getElementById("resultsList");
  if (!visible.length) {
    list.innerHTML = `<div class="empty-state">No methods match current filters.</div>`;
    return;
  }
  list.innerHTML = visible.map(({ method, score }) => renderMethod(method, score)).join("");
}

function attachEvents() {
  filterConfig.forEach(({ id }) => {
    document.getElementById(id).addEventListener("change", renderResults);
  });
  document.getElementById("searchInput").addEventListener("input", renderResults);
  document.getElementById("hideCuration").addEventListener("change", renderResults);
  document.getElementById("clearFilters").addEventListener("click", () => {
    filterConfig.forEach(({ id }) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("searchInput").value = "";
    document.getElementById("hideCuration").checked = false;
    renderResults();
  });
  document.getElementById("downloadCsv").addEventListener("click", () => {
    window.location.href = DATA_URL;
  });

  const dialog = document.getElementById("suggestDialog");
  document.getElementById("openSuggestDialog").addEventListener("click", () => {
    updateSuggestionOutput();
    dialog.showModal();
  });
  document.getElementById("closeSuggestDialog").addEventListener("click", () => {
    dialog.close();
  });
  document.querySelectorAll("#suggestDialog input, #suggestDialog select, #suggestDialog textarea").forEach((field) => {
    field.addEventListener("input", updateSuggestionOutput);
    field.addEventListener("change", updateSuggestionOutput);
  });
  document.getElementById("copyCsvRow").addEventListener("click", async () => {
    await navigator.clipboard.writeText(document.getElementById("suggestCsvRow").value);
    document.getElementById("copyCsvRow").textContent = "Copied";
    setTimeout(() => {
      document.getElementById("copyCsvRow").textContent = "Copy CSV row";
    }, 1600);
  });
}

async function init() {
  const response = await fetch(DATA_URL);
  const csv = await response.text();
  methods = parseCsv(csv);
  document.getElementById("methodCount").textContent = methods.length;
  document.getElementById("familyCount").textContent = new Set(
    methods.map((method) => method.method_family),
  ).size;
  document.getElementById("curationCount").textContent = methods.filter(
    (method) => method.needs_curation === "yes",
  ).length;
  populateSelects();
  populateSuggestionSelects();
  attachEvents();
  renderResults();
  updateSuggestionOutput();
}

init().catch((error) => {
  document.getElementById("resultsList").innerHTML =
    `<div class="empty-state">Could not load method library: ${error.message}</div>`;
});
