const { ipcRenderer } = require("electron");
const Chart = require('./src/js/chart');

let pdfNames = []; // Almacenar los nombres de PDF recibidos de persona fisica
let pdfNames2 = []; // Almacenar los nombres de PDF recibidos de persona moral
let pdfNames3 = []; // Almacenar los nombres de PDF recibidos de formularios
let lista = []; // Almacenar los nombres de PDF recibidos de persona fisica
document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("chart");
  ipcRenderer.on("charts", (event, listaArray) => {
    console.log("nombres : ", listaArray);

    if (listaArray && Array.isArray(listaArray)) {
      listaArray.forEach((pdfObj) => {
        // Obtén el nombre del objeto
        const pdfName = pdfObj.nombre;
        const cantBusc = pdfObj.cant_busc;
        // Quitar la extensión ".pdf" del nombre
        const pdfNameWithoutExtension = pdfName.replace(".pdf", "");
        // Agrega el nombre modificado a la lista lista
        lista.push({ nombre: pdfName, cant_busc: cantBusc });
      });
      console.log("Datos agregados a la lista: ", lista);

      // Configuración del gráfico después de recibir los datos
      const ctx = document.getElementById('pdfChart');

      new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: lista.map(item => item.nombre),
          datasets: [{
            label: 'Cantidad Buscada',
            data: lista.map(item => item.cant_busc),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            // r: {
            //   ticks: {
            //     stepSize: 1, // Ajusta el paso según tus necesidades
            //     callback: function(value, index, values) {
            //       const maxLength = 10; // Establece la longitud máxima que deseas mostrar
            //       if (value.length > maxLength) {
            //         return value.substring(0, maxLength) + '...';
            //       } else {
            //         return value;
            //       }
            //     },
            //   },
            // },
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

  });


  //---------------------------------------------------------------------------------
  ipcRenderer.send("names");
  ipcRenderer.on("pdfName", (event, pdfNamesArray) => {
    console.log("nombres : ", pdfNamesArray);

    if (pdfNamesArray && Array.isArray(pdfNamesArray)) {
      pdfNamesArray.forEach((pdfObj) => {
        // Obtén el nombre del objeto
        const pdfName = pdfObj.nombre;
        // Quitar la extensión ".pdf" del nombre
        const pdfNameWithoutExtension = pdfName.replace(".pdf", "");
        // Agrega el nombre modificado a la lista pdfNames
        pdfNames.push(pdfNameWithoutExtension);
      });
      console.log("agregados a la lista: ", pdfNames);
    }
  });
  //persona moral
  ipcRenderer.send("names2");
  ipcRenderer.on("pdfName2", (event, pdfNames2Array) => {
    console.log("moral_nombres : ", pdfNames2Array);

    if (pdfNames2Array && Array.isArray(pdfNames2Array)) {
      pdfNames2Array.forEach((pdfObj) => {
        // Obtén el nombre del objeto
        const pdfName2 = pdfObj.nombre;
        // Quitar la extensión ".pdf" del nombre
        const pdfName2WithoutExtension = pdfName2.replace(".pdf", "");
        // Agrega el nombre modificado a la lista pdfNames
        pdfNames2.push(pdfName2WithoutExtension);
      });
      console.log("agregados a la lista_moral: ", pdfNames2);
    }
  });
  //formularios extraer nombre
  ipcRenderer.send("names_formularios");
  ipcRenderer.on("pdfName_formularios", (event, pdfNames3Array) => {
    console.log("formularios_nombres : ", pdfNames3Array);

    if (pdfNames3Array && Array.isArray(pdfNames3Array)) {
      pdfNames3Array.forEach((pdfObj) => {
        // Obtén el nombre del objeto
        const pdfName3 = pdfObj.nombre;
        // Quitar la extensión ".pdf" del nombre
        const pdfName3WithoutExtension = pdfName3.replace(".pdf", "");
        // Agrega el nombre modificado a la lista pdfNames
        pdfNames3.push(pdfName3WithoutExtension);
      });
      console.log("agregados a la lista_formularios: ", pdfNames3);
    }
  });
 

  ////persona fisica
  const [searchInput, datalist] = [
    document.getElementById("searchInput"),
    document.getElementById("suggestions"),
  ];
  //persona moral
  const [searchInput2, datalist2] = [
    document.getElementById("searchInput2"),
    document.getElementById("suggestions2"),
  ];
  //formularios
  const [searchInput3, datalist3] = [
    document.getElementById("searchInput3"),
    document.getElementById("suggestions3"),
  ];
  //para persona fisica
  searchInput.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredSuggestions = pdfNames.filter((pdfName) =>
      pdfName.toLowerCase().includes(searchText)
    );

    renderSuggestions(filteredSuggestions, datalist);
  });
  //persona moral
  searchInput2.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredSuggestions = pdfNames2.filter((pdfName) =>
      pdfName.toLowerCase().includes(searchText)
    );

    renderSuggestions(filteredSuggestions, datalist2);
  });
  //sugerencia para formularios
  searchInput3.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredSuggestions = pdfNames3.filter((pdfName) =>
      pdfName.toLowerCase().includes(searchText)
    );

    renderSuggestions(filteredSuggestions, datalist3);
  });
  function renderSuggestions(suggestions, datalistElement) {
    datalistElement.innerHTML = ""; // Limpiar el datalist antes de llenarlo

    suggestions.forEach((suggestion) => {
      const optionElement = document.createElement("option");
      optionElement.value = suggestion;
      datalistElement.appendChild(optionElement);
    });
  }
});
let buscar;
let buscar2;
window.onload = function () {
  buscar = document.getElementById("searchButton");
  buscar2 = document.getElementById("searchButton2");
  buscar.addEventListener("click", function () {
    const pdfName = document.getElementById("searchInput").value + ".pdf";

    console.log(`Enviando pdfName: ${pdfName}`);
    ipcRenderer.send("search-pdf", pdfName);
  });
  buscar2.addEventListener("click", function () {
    const pdfName2 = document.getElementById("searchInput2").value + ".pdf";
    console.log(`Enviando pdfName: ${pdfName2}`);
    ipcRenderer.send("search-pdf2", pdfName2);
  });
  ipcRenderer.on("pdfData", (event, pdfData) => {
    populateTable(pdfData);
  });

  ipcRenderer.on("pdfDataUpdated", (event, pdfDataUpdated) => {
    console.log("Received pdfDataUpdated:", pdfDataUpdated);

    if (pdfDataUpdated && Array.isArray(pdfDataUpdated)) {
      updateTable(pdfDataUpdated);
    }
  });
  ipcRenderer.on("pdfDataUpdated2", (event, pdfDataUpdated2) => {
    console.log("Received moral pdfDataUpdated:", pdfDataUpdated2);

    if (pdfDataUpdated2 && Array.isArray(pdfDataUpdated2)) {
      updateTable(pdfDataUpdated2);
    }
  });
  // Solicitar los datos al cargar la página
  ipcRenderer.send("get-pdf-data");
};

function populateTable(pdfData) {
  const tableBody = document.querySelector("#tramitesTable tbody");
  tableBody.innerHTML = ""; // Limpiamos la tabla antes de actualizarla

  if (pdfData && Array.isArray(pdfData)) {
    pdfData.forEach((pdf) => {
      const row = createRow(pdf);
      tableBody.appendChild(row);
    });
  }
}

function updateTable(pdfDataUpdated) {
  const tableBody = document.querySelector("#tramitesTable tbody");

  // Eliminar los elementos existentes de la tabla
  tableBody.innerHTML = "";

  if (pdfDataUpdated && Array.isArray(pdfDataUpdated)) {
    pdfDataUpdated.forEach((pdf) => {
      const row = createRow(pdf);
      tableBody.appendChild(row);
    });
  }
}

function createRow(pdf) {
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  const actionsCell = document.createElement("td");

  nameCell.textContent = pdf.nombre;

  actionsCell.innerHTML = '<button class="viewButton">Ver</button>';
  actionsCell.querySelector(".viewButton").addEventListener("click", () => {
    // Lógica para mostrar el PDF en el iframe
    const pdfIframeViewer = document.getElementById("pdfIframeViewer");
    pdfIframeViewer.src = pdf.ruta;
  });

  row.appendChild(nameCell);
  row.appendChild(actionsCell);

  return row;
}