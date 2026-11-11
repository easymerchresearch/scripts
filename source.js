

//<![CDATA[
// ENCRYPTION CORE  



function waitForElement(selector, timeout = 60000) {
      return new Promise((resolve, reject) => {
        const interval = 1000;
        let elapsed = 0;
  
        const timer = setInterval(() => {
          const el = document.querySelector(selector);
          if (el) {
            clearInterval(timer);
            resolve(el);
          }
          elapsed += interval;
          if (elapsed >= timeout) {
            clearInterval(timer);
            reject("Element not found: " + selector);
          }
        }, interval);
      });
    }

document.addEventListener('DOMContentLoaded', async function () {
  try {
    var toggle = document.querySelector('.tool-toggle');
    if (!toggle) return;

    var buttons = toggle.querySelectorAll('.tool-toggle-btn');
    var sections = document.querySelectorAll('.tool-content');

    if (!buttons.length || !sections.length) return;

    function switchSection(targetId) {
      if (!targetId) return;

      // Hide all sections
      for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].style.display = 'none';
      }

      // Show selected section
      var activeSection = document.getElementById(targetId);
      if (activeSection) {
        activeSection.classList.add('active');
        activeSection.style.display = 'block';
      }
    }

    function setActiveButton(clickedBtn) {
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
      }
      clickedBtn.classList.add('active');
    }

    // Attach click events
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {

        var target = this.getAttribute('data-target');

        // Switch UI
        setActiveButton(this);
        switchSection(target);
      });
    }

    // 🔥 Initial state (first button)
    var firstBtn = toggle.querySelector('.tool-toggle-btn.active') || buttons[0];
    if (firstBtn) {
      var initialTarget = firstBtn.getAttribute('data-target');
      setActiveButton(firstBtn);
      switchSection(initialTarget);
    }

  } catch (e) {
    console.error("Navigation Toggle Error: ", e);
  }

  await waitForElement("#cmarketMBA");
  startListners();

  // Filters saver
  function getFormFilters() {
  return {
    searchTerm: document.getElementById("searchTermMBA").value,
    inKeywords: document.getElementById("inKeywordsMBA").value,
    exKeywords: document.getElementById("exKeywordsMBA").value,

    market: document.getElementById("cmarketMBA").value,
    product: document.getElementById("cproductMBA").value,

    sortBy: document.getElementById("csortByMBA").value,
    recent: document.getElementById("crecentMBA").value,

    minPrice: document.getElementById("minPriceMBA").value,
    maxPrice: document.getElementById("maxPriceMBA").value,

    minRating: document.getElementById("minRatingMBA").value,
    maxRating: document.getElementById("maxRatingMBA").value,

    offer: document.getElementById("cofferMBA").value,
    fromPage: document.getElementById("fromPageMBA").value,

    hideTrademarks: document.getElementById("hideTrademarks").checked,
    hidePolitics: document.getElementById("hidePolitics").checked,
    expandResults: document.getElementById("expandResults").checked
  };
}
  
  async function saveFilter(name) {
    
    const data = getStorage();
    const filters = getFormFilters();
    const market = filters.market;

    data.filters ||= {};
    data.filters[market] ||= {};

    data.filters[market][name] = filters;

    setStorage(data);
  }
  
  function applyFormFilters(f) {
  document.getElementById("searchTermMBA").value = f.searchTerm || "";
  document.getElementById("inKeywordsMBA").value = f.inKeywords || "";
  document.getElementById("exKeywordsMBA").value = f.exKeywords || "";

  document.getElementById("cmarketMBA").value = f.market || "US";
  document.getElementById("cproductMBA").value = f.product || "tshirt";

  document.getElementById("csortByMBA").value = f.sortBy || "featured";
  document.getElementById("crecentMBA").value = f.recent || "defaultvalue";

  document.getElementById("minPriceMBA").value = f.minPrice || 1;
  document.getElementById("maxPriceMBA").value = f.maxPrice || 100;

  document.getElementById("minRatingMBA").value = f.minRating || "";
  document.getElementById("maxRatingMBA").value = f.maxRating || "";

  document.getElementById("cofferMBA").value = f.offer || "defaultvalue";
  document.getElementById("fromPageMBA").value = f.fromPage || 1;

  document.getElementById("hideTrademarks").checked = !!f.hideTrademarks;
  document.getElementById("hidePolitics").checked = !!f.hidePolitics;
  document.getElementById("expandResults").checked = !!f.expandResults;
}
  
  async function loadFilter(name) {
    const market = document.getElementById("cmarketMBA").value;
    const data = getStorage();

    const preset = data?.filters?.[market]?.[name];
    if (!preset) return;

    applyFormFilters(preset);
  }
  
  async function deleteFilter(name) {
    const market = document.getElementById("cmarketMBA").value;
    const data = getStorage();

    if (data?.filters?.[market]?.[name]) {
      delete data.filters[market][name];
      setStorage(data);
    }
  }
  
 async function loadSavedFiltersList() {
  const market = document.getElementById("cmarketMBA").value;
  const data = getStorage();

  const select = document.getElementById("savedFilters");
  select.innerHTML = "";

  const presets = data?.filters?.[market] || {};

  Object.keys(presets).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}
  
 function getStorage() {
    return JSON.parse(localStorage.getItem("filters") || "{}");
  }
 function showToast(msg) {
    const el = document.createElement("div");
    el.textContent = msg;
    el.className = "toast";
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 2000);
  }
 
 function setStorage(data) {
    localStorage.setItem("filters", JSON.stringify(data));
  }
 async function startListners(params) {
    document.getElementById("saveFilterBtn").onclick = async () => {
      const market = document.getElementById("cmarketMBA").value;

      const inputName = document.getElementById("filterNameInput").value.trim();
      const selectedName = document.getElementById("savedFilters").value;

      // 🎯 Priority: typed name > selected
      const name = inputName || selectedName;

      if (!name) return;

      const data = getStorage();
      const exists = !!data?.filters?.[market]?.[name];

      // ⚠️ Ask only if overwriting
      if (exists) {
        const confirmOverwrite = confirm(`"${name}" already exists. Overwrite it?`);
        if (!confirmOverwrite) return;
      }

      await saveFilter(name);
      loadSavedFiltersList();

      // Optional: clear input after save
      document.getElementById("filterNameInput").value = "";
    };

    document.getElementById("loadFilterBtn").onclick = async () => {
      const name = document.getElementById("savedFilters").value;
      loadFilter(name);
    };

    document.getElementById("deleteFilterBtn").onclick = async () => {
      const name = document.getElementById("savedFilters").value;
      if (!confirm("Delete filter?")) return;
      await deleteFilter(name);
      loadSavedFiltersList();
    };
    
    document.getElementById("cmarketMBA").addEventListener("change", loadSavedFiltersList);
    const select = document.getElementById("savedFilters");

    select.addEventListener("change", () => {
      select.classList.add("active");
    });

    const last = localStorage.getItem("lastFilter");
    if (last) {
      loadFilter(last);
    }
    loadSavedFiltersList();

  }
});

  
  let rawText = "";
  let rawData = [];
  let filteredResult = [];
  
  // ================= STEP 1: READ FILE =================
  function handleFile(e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = (event) => {
          rawText = event.target.result;
          document.getElementById('jsonInput').value = "[File loaded ✅]";
          console.log("File loaded. Ready to parse.");
      };
  
      reader.readAsText(file);
  }
  
  // ================= UNIVERSAL JSON EXTRACT =================
  
  // 🔍 Extract ALL arrays
  function extractAllArrays(data, results = []) {
      if (Array.isArray(data)) {
          results.push(data);
      }
  
      if (typeof data === "object" && data !== null) {
          for (let key in data) {
              extractAllArrays(data[key], results);
          }
      }
  
      return results;
  }
  
  // 🧠 Pick BEST array automatically
  function pickBestArray(arrays) {
      if (!arrays.length) return null;
  
      let best = null;
      let bestScore = -1;
  
      arrays.forEach(arr => {
          if (!arr.length) return;
  
          let score = 0;
  
          // size weight
          score += arr.length;
  
          // prefer objects
          if (typeof arr[0] === "object") {
              score += 50;
          }
  
          // richness (number of keys)
          if (typeof arr[0] === "object") {
              score += Object.keys(arr[0]).length * 5;
          }
  
          if (score > bestScore) {
              bestScore = score;
              best = arr;
          }
      });
  
      return best;
  }
  
  // 🎯 Main extractor
  function extractBestArray(data) {
      const arrays = extractAllArrays(data);
  
      return pickBestArray(arrays);
  }
  
  // ================= STEP 2: PARSE =================
  function parseJSON() {
  
      if (!rawText) {
          rawText = document.getElementById('jsonInput').value;
      }
  
      try {
          const parsed = JSON.parse(rawText);
  
          const extracted = extractBestArray(parsed);
  
          if (!extracted) {
              alert("❌ No usable array found in JSON");
              return;
          }
  
          rawData = extracted;
  
          analyzeFields();
  
      } catch (e) {
          console.error(e);
          alert("Invalid JSON");
      }
  }
  
  // ================= STEP 3: ANALYZE =================
  function analyzeFields() {
  
      const list = document.getElementById('selectionList');
  
      const sampleSize = Math.min(100, rawData.length);
      const keysSet = new Set();
  
      for (let i = 0; i < sampleSize; i++) {
          const item = rawData[i];
  
          if (typeof item === "object") {
              for (let key in item) {
                  keysSet.add(key);
              }
          }
      }
  
      const keys = Array.from(keysSet).sort();
  
      list.innerHTML = "";
  
      keys.forEach(key => {
          list.innerHTML += `
              <label class="key-item">
                  <input type="checkbox" class="field-cb" value="${key}" checked>
                  ${key}
              </label>
          `;
      });
  
      document.getElementById('stats').innerText =
          keys.length + " fields (sampled)";
  
      console.log("Analysis done ✅");
  }
  
  // ================= STEP 4: SELECT =================
  function toggleAll(state) {
      document.querySelectorAll('.field-cb')
          .forEach(cb => cb.checked = state);
  }
  
  // ================= STEP 5: PROCESS =================
  function applyFilter() {
  
      if (!rawData.length) return;
  
      const selectedFields = [...document.querySelectorAll('.field-cb:checked')]
          .map(cb => cb.value);
  
      filteredResult = [];
  
      const chunkSize = 1000;
      let index = 0;
  
      const previewLimit = 50;
  
      function processChunk() {
  
          const end = Math.min(index + chunkSize, rawData.length);
  
          for (let i = index; i < end; i++) {
              const item = rawData[i];
  
              if (typeof item !== "object") continue;
  
              const newItem = {};
  
              for (let j = 0; j < selectedFields.length; j++) {
                  const f = selectedFields[j];
                  if (item[f] !== undefined) {
                      newItem[f] = item[f];
                  }
              }
  
              filteredResult.push(newItem);
          }
  
          index = end;
  
          if (index < rawData.length) {
              setTimeout(processChunk, 0);
          } else {
              console.log("Filtering done ✅");
  
              document.getElementById('jsonOutput').value =
                  JSON.stringify(filteredResult.slice(0, previewLimit), null, 2) +
                  `\n\nShowing ${previewLimit} of ${filteredResult.length}`;
          }
      }
  
      processChunk();
  }
  
  // ================= STEP 6: DOWNLOAD =================
  function downloadJSON() {
  
      if (!filteredResult.length) {
          alert("Run filter first!");
          return;
      }
  
      const chunkSize = 10000;
      let index = 0;
      let part = 1;
  
      function downloadChunk() {
  
          const chunk = filteredResult.slice(index, index + chunkSize);
  
          const blob = new Blob(
              [JSON.stringify(chunk, null, 2)],
              { type: 'application/json' }
          );
  
          const url = URL.createObjectURL(blob);
  
          const a = document.createElement('a');
          a.href = url;
          a.download = `filtered_part_${part}.json`;
          a.click();
  
          URL.revokeObjectURL(url);
  
          index += chunkSize;
          part++;
  
          if (index < filteredResult.length) {
              setTimeout(downloadChunk, 300);
          } else {
              console.log("All parts downloaded ✅");
          }
      }
  
      downloadChunk();
  }
  
  // ================= COPY =================
  function copyOutput() {
      const out = document.getElementById('jsonOutput');
      if (!out.value) return;
  
      navigator.clipboard.writeText(out.value);
  }  
  
   // ================= RESET =================
  function resetJSON() {
      rawText = "";
      rawData = [];
      filteredResult = [];
  
      document.getElementById('jsonInput').value = "";
      document.getElementById('jsonOutput').value = "";
      document.getElementById('selectionList').innerHTML = '<div class="empty-msg">Paste or upload JSON to see fields...</div>';
      document.getElementById('stats').innerText = "0 FIELDS";
  }

  let csvText = "";
  let csvData = [];
  let filteredCSV = [];
  
  // ================= FILE =================
  function handleCSVFile(e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = (event) => {
          csvText = event.target.result;
          document.getElementById('csvInputArea').value = "[CSV loaded ✅]";
      };
  
      reader.readAsText(file);
  }
  
  // ================= PARSER =================
  function parseCSVText(text) {
  
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (!lines.length) return [];
  
      const separator = lines[0].includes(";") ? ";" : ",";
  
      const firstRow = lines[0].split(separator).map(v => v.trim());
  
      // 🧠 detect if header
      const isHeader = firstRow.every(v => isNaN(v) && v.length < 50);
  
      let headers;
  
      if (isHeader) {
          headers = firstRow;
          lines.shift(); // remove header row
      } else {
          // 🔥 generate column names
          headers = firstRow.map((_, i) => `column_${i + 1}`);
      }
  
      const data = [];
  
      for (let i = 0; i < lines.length; i++) {
  
          const values = lines[i].split(separator);
          const obj = {};
  
          headers.forEach((h, index) => {
              obj[h] = values[index]?.trim() || "";
          });
  
          data.push(obj);
      }
  
      return data;
  }
  // ================= PARSE =================
  function parseCSV() {
  
      if (!csvText) {
          csvText = document.getElementById('csvInputArea').value;
      }
  
      csvData = parseCSVText(csvText);
  
      if (!csvData.length) {
          alert("No CSV data found");
          return;
      }
  
      analyzeCSVFields();
  }
  
  // ================= ANALYZE =================
  function analyzeCSVFields() {
  
      const list = document.getElementById('csvSelectionList');
  
      const keys = Object.keys(csvData[0] || {});
  
      list.innerHTML = "";
  
      keys.forEach(key => {
          list.innerHTML += `
              <label class="key-item">
                  <input type="checkbox" class="csv-field-cb" value="${key}" checked>
                  ${key}
              </label>
          `;
      });
  
      document.getElementById('csvStats').innerText = keys.length + " columns";
  }
  
  // ================= TOGGLE =================
  function toggleAllCSV(state) {
      document.querySelectorAll('.csv-field-cb')
          .forEach(cb => cb.checked = state);
  }
  
  // ================= FILTER =================
  function applyCSVFilter() {
  
      if (!csvData.length) return;
  
      const selected = [...document.querySelectorAll('.csv-field-cb:checked')]
          .map(cb => cb.value);
  
      filteredCSV = [];
  
      const chunkSize = 1000;
      let index = 0;
  
      function processChunk() {
  
          const end = Math.min(index + chunkSize, csvData.length);
  
          for (let i = index; i < end; i++) {
              const item = csvData[i];
              const newItem = {};
  
              selected.forEach(f => {
                  if (item[f] !== undefined) {
                      newItem[f] = item[f];
                  }
              });
  
              filteredCSV.push(newItem);
          }
  
          index = end;
  
          if (index < csvData.length) {
              setTimeout(processChunk, 0);
          } else {
              document.getElementById('csvOutputArea').value =
                  JSON.stringify(filteredCSV.slice(0, 50), null, 2) +
                  `\n\nShowing 50 of ${filteredCSV.length}`;
          }
      }
  
      processChunk();
  }
  
  // ================= DOWNLOAD =================
  function downloadCSVasJSON() {
  
      if (!filteredCSV.length) {
          alert("Run filter first!");
          return;
      }
  
      const blob = new Blob(
          [JSON.stringify(filteredCSV, null, 2)],
          { type: 'application/json' }
      );
  
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = "csv_converted.json";
      a.click();
  
      URL.revokeObjectURL(url);
  }
  
  // ================= COPY =================
  function copyCSVOutput() {
      const out = document.getElementById('csvOutputArea');
      if (!out.value) return;
  
      navigator.clipboard.writeText(out.value);
  }
  
  // ================= RESET =================
  function resetCSV() {
      csvText = "";
      csvData = [];
      filteredCSV = [];
  
      document.getElementById('csvInputArea').value = "";
      document.getElementById('csvOutputArea').value = "";
      document.getElementById('csvSelectionList').innerHTML = '<div class="empty-msg">Paste or upload CSV...</div>';
      document.getElementById('csvStats').innerText = "0 Columns";
  }
    
  //]]>
