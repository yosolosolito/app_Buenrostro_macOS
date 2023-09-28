const { app, ipcMain, Notification,dialog  } = require('electron');
const { autoUpdater } = require("electron-updater");
let isUpdateAvailable = false;
// Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
function checkForUpdates() {
  autoUpdater
    .checkForUpdates()
    .then((info) => {
      if (
        info &&
        info.updateInfo &&
        info.updateInfo.version !== app.getVersion()
      ) {
        isUpdateAvailable = true;
        // mainScreen.showMessage(`Update available. Current version ${app.getVersion()}`);
        const options = {
          type: "question",
          buttons: ["Sí", "Cancelar"],
          defaultId: 0,
          title: "Estado de Actualización",
          message: "Hay una nueva versión disponible. ¿Deseas actualizar?",
          detail: `Update available. Current version ${app.getVersion()}`,
        };
        dialog.showMessageBox(options).then((response) => {
          if (response.response === 0) {
            ipcMain.emit("start-update");
          } else if (response.response === 1) {
          }
        });
      } else {
        isUpdateAvailable = false;
        const notification = new Notification({
          title: "Estado de la Actulizacion.",
          body: `No update available. Current version ${app.getVersion()}`,
        });
        notification.show();
        // Close the notification after 5 seconds (5000 ms)
        setTimeout(() => {
          notification.close();
        }, 3000);
      }
    })
    .catch((error) => {
      const notification = new Notification({
        title: "Estado de la Actulizacion.",
        body: `Error checking for updates: ${error.message}`,
      });
      notification.show();
      // Close the notification after 5 seconds (5000 ms)
      setTimeout(() => {
        notification.close();
      }, 3000);
    });
}
ipcMain.on("start-update", () => {
  if (isUpdateAvailable) {
    autoUpdater
      .downloadUpdate()
      .then((path) => {
        // mainScreen.showMessage(`Update downloaded. Current version ${app.getVersion()}. Please restart the application to apply the update.`);
        const notification = new Notification({
          title: "Estado de la descarga.",
          body: `Update downloaded. Current version ${app.getVersion()}. Please restart the application to apply the update.`,
        });

        notification.show();

        // Close the notification after 5 seconds (5000 ms)
        setTimeout(() => {
          notification.close();
        }, 3000);
        // Agrega lógica para mostrar un botón "Restart" o similar para reiniciar la aplicación y aplicar la actualización.
      })
      .catch((error) => {
        // mainScreen.showMessage(`Error downloading update: ${error.message}. Please check your internet connection and try again.`);
        const notification = new Notification({
          title: "Estado de la descarga.",
          body: `Error downloading update: ${error.message}. Please check your internet connection and try again.`,
        });

        notification.show();

        // Close the notification after 5 seconds (5000 ms)
        setTimeout(() => {
          notification.close();
        }, 3000);
      });
  } else {
    mainScreen.showMessage("No update available.");
    const notification = new Notification({
      title: "Estado de la descarga.",
      body: `"No update available.`,
    });

    notification.show();

    // Close the notification after 5 seconds (5000 ms)
    setTimeout(() => {
      notification.close();
    }, 3000);
  }
});

module.exports = {
    checkForUpdates
};