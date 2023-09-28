const mysql = require("mysql");

// Configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: "localhost", // Cambia esto al host de tu servidor MySQL
  user: "root",
  password: null,
  database: "pdf_database",
});

// Conecta a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conexión a la base de datos MySQL establecida correctamente.");
    initializeDatabase(); // Inicializa las tablas si no existen
  }
});

function initializeDatabase() {
  db.query(`CREATE TABLE IF NOT EXISTS pdfs_fisica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cant_busc INT DEFAULT 0,
    ruta VARCHAR(255) NOT NULL
  )`);
  db.query(`CREATE TABLE IF NOT EXISTS pdfs_moral (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cant_busc INT DEFAULT 0,
    ruta VARCHAR(255) NOT NULL
  )`);
  db.query(`CREATE TABLE IF NOT EXISTS Formularios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruta VARCHAR(255) NOT NULL
  )`);
}

//INSERTAR PERSONA FISICA
function insertPDF_Fisica(nombre, ruta) {
  // Tu lógica de inserción para pdf_fisica aquí
  db.query(
    "SELECT * FROM pdfs_fisica WHERE nombre = ?",[nombre],(err, results) => {
      if (err) {
        console.error("Error checking for existing PDF:", err.message);
        return;
      }

      if (results.length === 0) {
        const insertQuery =
          "INSERT INTO pdfs_fisica (nombre, cant_busc, ruta) VALUES (?, ?, ?)";
        db.query(insertQuery, [nombre, 0, ruta], (err) => {
          if (err) {
            console.error("Error inserting PDF:", err.message);
          } else {
            console.log("PDF inserted:", nombre);
          }
        });
      } else {
        console.log("PDF already exists:", nombre);
      }
    }
  );
}

//INSERTAR PERSONAS MORALES
function insertPDF_Moral(nombre, ruta) {
  // Tu lógica de inserción para pdf_moral aquí
  db.query(
    "SELECT * FROM pdfs_moral WHERE nombre = ?",
    [nombre],
    (err, results) => {
      if (err) {
        console.error("Error checking for existing PDF:", err.message);
        return;
      }

      if (results.length === 0) {
        const insertQuery =
          "INSERT INTO pdfs_moral (nombre, cant_busc, ruta) VALUES (?, ?, ?)";
        db.query(insertQuery, [nombre, 0, ruta], (err) => {
          if (err) {
            console.error("Error inserting PDF:", err.message);
          } else {
            console.log("PDF inserted:", nombre);
          }
        });
      } else {
        console.log("PDF already exists:", nombre);
      }
    }
  );
}

//INSERTAR FORMULARIOS
function insertPDF_Formularios (nombre, ruta) {
  // Tu lógica de inserción para pdf_moral aquí
  db.query(
    "SELECT * FROM formularios WHERE nombre = ?",
    [nombre],
    (err, results) => {
      if (err) {
        console.error("Error checking for existing PDF:", err.message);
        return;
      }

      if (results.length === 0) {
        const insertQuery =
          "INSERT INTO formularios (nombre, ruta) VALUES (?, ?, ?)";
        db.query(insertQuery, [nombre, ruta], (err) => {
          if (err) {
            console.error("Error inserting PDF:", err.message);
          } else {
            console.log("PDF inserted:", nombre);
          }
        });
      } else {
        console.log("PDF already exists:", nombre);
      }
    }
  );
}

//consultas para persona fisica
function Consulta_General(event) {
  db.query("SELECT nombre FROM pdfs_fisica", (err, rows) => {
    if (err) {
      console.error("Error fetching PDF data:", err);
    } else {
      event.reply("pdfName", rows); // Enviar los datos de los PDFs al proceso de renderizado
      console.log("nombres_fisicas:", rows);
    }
  });
}

//consultas para persona fisica
function Consulta_General2 (event) {
  db.query("SELECT nombre FROM pdfs_moral", (err, rows) => {
    if (err) {
      console.error("Error fetching PDF data:", err);
    } else {
      event.reply("pdfName2", rows); // Enviar los datos de los PDFs al proceso de renderizado
      console.log("nombres_morales:", rows);
    }
  });
}

//consultas para formularios
function Consulta_General3 (event) {
  db.query("SELECT nombre FROM formularios", (err, rows) => {
    if (err) {
      console.error("Error fetching PDF data:", err);
    } else {
      event.reply("pdfName_formularios", rows); // Enviar los datos de los PDFs al proceso de renderizado
      console.log("nombres_formularios:", rows);
    }
  });
}

//para persona moral
function actulizar_pdf(event, pdfName) {
  console.log(`Recibiendo pdfName: ${pdfName}`);
  const updateQuery =
    "UPDATE pdfs_fisica SET cant_busc = cant_busc + 1 WHERE nombre = ?";
  db.query(updateQuery, [pdfName], (err) => {
    if (err) {
      console.error("Error updating PDF counters:", err.message);
    } else {
      console.log(`PDF counters updated for ${pdfName}`);
      event.reply("pdf-searched"); // Notificar que se ha realizado una búsqueda
      // Luego de actualizar el contador, buscar los PDFs con 10 búsquedas
      db.query("SELECT * FROM pdfs_fisica WHERE cant_busc >=10 UNION SELECT * FROM pdfs_moral WHERE cant_busc >=10", (err, rows) => {
        if (err) {
          console.error("Error fetching PDF data:", err);
        } else {
          // Emitir evento pdfDataUpdated con los PDFs que llegaron a 10 búsquedas
          event.reply("pdfDataUpdated", rows);
          console.log("Received pdfDataUpdated:", rows);
        }
      });
    }
  });
}

//ACTUALIZAR PERSONA MORAL
function actulizar_pdf2(event, pdfName) {
  console.log(`Recibiendo pdfName: ${pdfName}`);
  const updateQuery =
    "UPDATE pdfs_moral SET cant_busc = cant_busc + 1 WHERE nombre = ?";
  db.query(updateQuery, [pdfName], (err) => {
    if (err) {
      console.error("Error updating PDF counters:", err.message);
    } else {
      console.log(`PDF counters updated for ${pdfName}`);
      event.reply("pdf-searched"); // Notificar que se ha realizado una búsqueda
      // Luego de actualizar el contador, buscar los PDFs con 10 búsquedas
      db.query("SELECT * FROM pdfs_fisica WHERE cant_busc >=10 UNION SELECT * FROM pdfs_moral WHERE cant_busc >=10", (err, rows) => {
        if (err) {
          console.error("Error fetching PDF data:", err);
        } else {
          // Emitir evento pdfDataUpdated con los PDFs que llegaron a 10 búsquedas
          event.reply("pdfDataUpdated2", rows);
          console.log("Received_moral pdfDataUpdated:", rows);
        }
      });
    }
  });
}

function obtner_pdf(event) {
  db.query("SELECT * FROM pdfs_fisica WHERE cant_busc >=10 UNION SELECT * FROM pdfs_moral WHERE cant_busc >=10", (err, rows) => {
    if (err) {
      console.error("Error fetching PDF data:", err);
    } else {
      event.reply("pdfData", rows); // Enviar los datos de los PDFs al proceso de renderizado
    }
  });
}

//EXTRACCION DE DATOS DE PERSONA FISICA, PARA GRAFICARLO EN CHART.JS
function obtner_chart(event) {
  db.query("SELECT * FROM pdfs_fisica WHERE cant_busc >=10", (err, rows) => {
    if (err) {
      console.error("Error fetching PDF data:", err);
    } else {
      event.reply("charts", rows); // Enviar los datos de los PDFs al proceso de renderizado
    }
  });
}

//consultas para persona fisica
module.exports = {
  initializeDatabase,
  insertPDF_Fisica,
  insertPDF_Moral,
  Consulta_General,
  actulizar_pdf,
  obtner_pdf,
  obtner_chart,
  Consulta_General2,
  actulizar_pdf2,
  Consulta_General3,
};