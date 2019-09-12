const electron = require("electron");
const { app } = electron;
const images = require("./images");

function enabledCycleEffect(items) {
  const nonEffectMenuOffset = 2;
  const selectedIndex = items.findIndex(item => item.checked);
  const nextIndex =
    selectedIndex + 1 < items.length ? selectedIndex + 1 : nonEffectMenuOffset;
  items[nextIndex].checked = true;
}

module.exports = mainWindow => {
  const name = app.getName();

  const template = [
    {
      label: name,
      submenu: [
        {
          label: "Quit",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Effects",
      submenu: [
        {
          label: "Cycle",
          click: menuItem => {
            enabledCycleEffect(menuItem.menu.items);
            mainWindow.webContents.send("effect-cycle");
          }
        },
        { type: "separator" },
        {
          label: "Vanilla",
          type: "radio",
          click: () => mainWindow.webContents.send("effect-choose")
        },
        {
          label: "Ascii",
          type: "radio",
          click: () => mainWindow.webContents.send("effect-choose", "ascii")
        },
        {
          label: "Daltonize",
          type: "radio",
          click: () => mainWindow.webContents.send("effect-choose", "daltonize")
        },
        {
          label: "Filmgrain",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "filmgrain")
        },
        {
          label: "Hex",
          type: "radio",
          click: () => mainWindow.webContents.send("effect-choose", "hex")
        },
        {
          label: "kaleidoscope",
          type: "radio",
          click: _ =>
            mainWindow.webContents.send("effect-choose", "kaleidoscope")
        },
        {
          label: "Mirror",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "mirror")
        },
        {
          label: "Night Vision",
          type: "radio",
          click: _ =>
            mainWindow.webContents.send("effect-choose", "nightvision")
        },
        {
          label: "Pixelate",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "pixelate")
        },
        {
          label: "Ripple",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "ripple")
        },
        {
          label: "Scan Lines",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "scanlines")
        },
        {
          label: "Sketch",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "sketch")
        },
        {
          label: "Vibrance",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "vibrance")
        },
        {
          label: "Vignette",
          type: "radio",
          click: _ => mainWindow.webContents.send("effect-choose", "vignette")
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Photo Directory",
          click: () => images.openDir(images.getPicturesDir(app))
        }
      ]
    }
  ];
  return template;
};
