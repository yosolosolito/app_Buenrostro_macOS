const {app,BrowserWindow,ipcMain,Notification,shell,dialog} = require("electron");
const path = require("path");
const { initializeDatabase, insertPDF_Fisica,obtner_pdf, obtner_chart, actulizar_pdf2, Consulta_General2, Consulta_General3, insertPDF_Moral,Consulta_General,actulizar_pdf } = require("./database"); // Ajusta la ruta según la ubicación de tu archivo database.js
// const { showInternetStatus } = require("./status_internet"); // Ajusta la ruta según la ubicación de tu archivo database.js
const { checkForUpdates } = require("./update");
const iconPath = path.join(
  __dirname,
  "src",
  "assets",
  "image",
  "LOGO-BUENROSTRO.ico"
);
let win;
let wininicio;
let db; // Declara db aquí para que sea accesible en todo el archivo
function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nativeWindowOpen: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
  win.webContents.on("will-navigate", (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
}
function inicioWindow() {
  wininicio = new BrowserWindow({
    width: 1366,
    height: 768,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nativeWindowOpen: true,
      sandbox: false,
      preload: path.join(__dirname, "inicio.js"),
    },
  });
  wininicio.loadFile("inicio.html");
}
ipcMain.on("inicio", () => {
  const isValid = validaInicio();
  if (isValid) {
    createWindow();
    wininicio.close();
    checkForUpdates();
    const pdfFolderPathFisica = path.join(__dirname, "src", "PDF", "Persona_Fisica");
    const pdfFolderPathMoral = path.join(__dirname, "src", "PDF", "Persona_Moral");
    const fs = require("fs");

    // Leer archivos PDF de la carpeta persona_fisica
    const pdfFilesFisica = fs
      .readdirSync(pdfFolderPathFisica)
      .filter((file) => file.toLowerCase().endsWith(".pdf"));

    // Leer archivos PDF de la carpeta persona_moral
    const pdfFilesMoral = fs
      .readdirSync(pdfFolderPathMoral)
      .filter((file) => file.toLowerCase().endsWith(".pdf"));

    // Insertar PDFs de persona física en la base de datos
    pdfFilesFisica.forEach((file) => {
      const nombre = file;
      const ruta_fisica = `src/PDF/Persona_Fisica/${file}`;
      insertPDF_Fisica(nombre, ruta_fisica);
    });
    // Insertar PDFs de persona moral en la base de datos
    pdfFilesMoral.forEach((file) => {
      const nombre = file;
      const ruta_moral = `src/PDF/Persona_Moral/${file}`;
      insertPDF_Moral(nombre, ruta_moral);
    });
    ipcMain.on("chart", (event) => {
      obtner_chart(event);
    });
    ipcMain.on("get-pdf-data", (event) => {
      obtner_pdf(event);
    });
    ipcMain.on("names", (event) => {
      Consulta_General(event);
    });
    ipcMain.on("names2", (event) => {
      Consulta_General2(event);
    });
    ipcMain.on("names_formularios", (event) => {
      Consulta_General3(event);
    });
  }
});
app.whenReady().then(() => {
  db = initializeDatabase();
  inicioWindow();
  // showInternetStatus();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }else{
    app.quit();
  }
});

app.on("activate", () => {
  if (wininicio === null) {
    createWindow();
  }
});

function validaInicio() {
  return true;
}
ipcMain.on("search-pdf", (event, pdfName) => {
  actulizar_pdf(event,pdfName);
});
ipcMain.on("search-pdf2", (event, pdfName) => {
  actulizar_pdf2(event,pdfName);
});