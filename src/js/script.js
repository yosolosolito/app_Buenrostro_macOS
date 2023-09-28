// Ejecutar función en el evento click
window.addEventListener("DOMContentLoaded", function() {
    // Tu código aquí
    document.getElementById("btn_open").addEventListener("click", function() {
      document.getElementById("body").classList.toggle("body_move");
      document.getElementById("menu_side").classList.toggle("menu__side_move");
    });
  
    // Otro código aquí...
  });
  
  // Si el ancho de la página es menor a 760px, ocultará el menú al recargar la página
  function updateMenu() {
    if (window.innerWidth > 760) {
        document.getElementById("body").classList.remove("body_move");
        document.getElementById("menu_side").classList.remove("menu__side_move");
    } else {
        document.getElementById("body").classList.add("body_move");
        document.getElementById("menu_side").classList.add("menu__side_move");
    }
  }
  
  window.addEventListener("resize", updateMenu);
  window.addEventListener("load", updateMenu);
  
  // Encuentra el elemento de opción "Trámites" y el submenú
  const tramitesOption = document.querySelector('.options__menu .option');
  const subMenu = document.querySelector('.options__menu .sub-menu');
  
  // Agrega un evento de clic al elemento de opción "Trámites"
  tramitesOption.addEventListener('click', function() {
    // Alterna la clase "active" en el submenú para mostrarlo u ocultarlo
    subMenu.classList.toggle('active');
  });
  
  const opciones = document.querySelectorAll('.options__menu .option');
  
  // Agrega un evento click a cada opción
  opciones.forEach(opcion => {
    opcion.addEventListener('click', function() {
        // Elimina la clase 'selected' de todas las opciones
        opciones.forEach(op => op.classList.remove('selected'));
  
        // Agrega la clase 'selected' a la opción actual
        this.classList.add('selected');
    });
  });
  // Configura los eventos de clic en las opciones del menú
  function setupMenuOptionClicks() {
    const opciones = document.querySelectorAll('.options__menu .option');
  
    // Agrega un evento click a cada opción
    opciones.forEach(opcion => {
      opcion.addEventListener('click', function() {
        // Elimina la clase 'selected' de todas las opciones
        opciones.forEach(op => op.classList.remove('selected'));
  
        // Agrega la clase 'selected' a la opción actual
        this.classList.add('selected');
      });
    });
  }
  
  // Obtén todas las opciones del menú y los contenidos correspondientes
  const menuOptions = document.querySelectorAll(".option");
  const contentSections = document.querySelectorAll("main > div");
  
  // Oculta todos los contenidos excepto el primero al cargar la página
  for (let i = 1; i < contentSections.length; i++) {
      contentSections[i].style.display = "none";
  }
  
  // Agrega un controlador de eventos a cada opción del menú
  menuOptions.forEach((option, index) => {
      option.addEventListener("click", () => {
          // Oculta todos los contenidos
          contentSections.forEach(section => {
              section.style.display = "none";
          });
  
          // Muestra el contenido correspondiente a la opción seleccionada
          contentSections[index].style.display = "block";
      });
  });
  //buscar pdf PERSONA FISICA
  
  $(function () {
      const pdfContainer = document.getElementById("pdfContainer");
      const pdfIframe = document.getElementById("pdfIframe");
      const searchButton = document.getElementById("searchButton");
      const searchInput = document.getElementById("searchInput");
  
      searchButton.addEventListener("click", function () {
          const searchTerm = searchInput.value.trim();
          if (searchTerm !== "") {
  
  
              const pdfPath = `src/PDF/Persona_Fisica/${searchTerm}.pdf`;
  
              fetch(pdfPath)
                  .then(response => {
                      if (response.ok) {
                          return response.blob();
                      } else {
                          throw new Error("Archivo no encontrado");
                      }
                  })
                  .then(blob => {
                      const pdfURL = URL.createObjectURL(blob);
                      pdfIframe.src = pdfURL;
                      pdfContainer.innerHTML = ""; // Limpia el contenido anterior
                  })
                  .catch(error => {
                      pdfContainer.innerHTML = `Archivo no encontrado: ${error.message}`;
                  });
          }
      });
  });
  //buscar pdf PERSONA MORAL
  const searchButton2 = document.getElementById("searchButton2");
  const searchInput2 = document.getElementById("searchInput2");
  const pdfIframe2 = document.getElementById("pdfIframe2");
  $(function () {
      searchButton2.addEventListener("click", function () {
          const searchTerm2 = searchInput2.value.trim();
          if (searchTerm2 !== "") {
              const pdfPath2 = `src/PDF/Persona_Moral/${searchTerm2}.pdf`;
  
              fetch(pdfPath2)
                  .then((response) => {
                      if (response.ok) {
                          return response.blob();
                      } else {
                          throw new Error("Archivo no encontrado");
                      }
                  })
                  .then((blob) => {
                      const pdfURL2 = URL.createObjectURL(blob);
                      pdfIframe2.src = pdfURL2;
                      pdfContainer2.innerHTML = ""; // Limpia el contenido anterior
                  })
                  .catch((error) => {
                      pdfContainer2.innerHTML = `Archivo no encontrado: ${error.message}`;
                  });
          }
      });
  });
  //buscar pdf FORMULARIOS
  const searchButton3 = document.getElementById("searchButton3");
  const searchInput3 = document.getElementById("searchInput3");
  const pdfIframe3 = document.getElementById("pdfIframe3");
  $(function () {
      $("#searchInput3").autocomplete({
          source: [
              "Manifestacion de RFC de beneficiario controlador Bambu de Chiapas", "Manifestacion RFC Socios", "Form" // Placeholder suggestions
          ],
          response: function (event, ui) {
              ui.content = ui.content.map(item => {
                  return { label: item.label.replace(/^[.\s]+/, ''), value: item.value };
              });
          },
          select: function (event, ui) {
              const searchTerm3 = ui.item.value;
              if (searchTerm3 !== "") {
                  // incrementSearchCount();
  
                  const pdfPath3 = `src/Forms/${searchTerm3}.pdf`;
  
                  fetch(pdfPath3)
                      .then(response => {
                          if (response.ok) {
                              return response.blob();
                          } else {
                              throw new Error("Archivo no encontrado");
                          }
                      })
                      .then(blob => {
                          const pdfURL3 = URL.createObjectURL(blob);
                          pdfIframe3.src = pdfURL3;
                          pdfContainer3.innerHTML = ""; // Limpia el contenido anterior
                      })
                      .catch(error => {
                          pdfContainer3.innerHTML = `Archivo no encontrado: ${error.message}`;
                      });
              }
          }
      });
      searchButton3.addEventListener("click", function () {
          const searchTerm3 = searchInput3.value.trim();
          if (searchTerm3 !== "") {
              const pdfPath3 = `src/Forms/${searchTerm3}.pdf`;
  
              fetch(pdfPath3)
                  .then((response) => {
                      if (response.ok) {
                          return response.blob();
                      } else {
                          throw new Error("Archivo no encontrado");
                      }
                  })
                  .then((blob) => {
                      const pdfURL3 = URL.createObjectURL(blob);
                      pdfIframe3.src = pdfURL3;
                      pdfContainer3.innerHTML = ""; // Limpia el contenido anterior
                  })
                  .catch((error) => {
                      pdfContainer3.innerHTML = `Archivo no encontrado: ${error.message}`;
                  });
          }
      });
  });
  document.addEventListener("DOMContentLoaded", function () {
      const switchInput = document.querySelector(".switch input");
    
      switchInput.addEventListener("change", function () {
        const body = document.querySelector("body");
        body.classList.toggle("dark-mode");
      });
    });