chrome.webNavigation.onCommitted.addListener(
  async options => {
    if (options.frameType !== "outermost_frame") return;
    await chrome.scripting.executeScript({
      target: { tabId: options.tabId },
      files: ["after-load.js"],
      world: "MAIN",
    });
  },
  {
    url: [
      {
        hostSuffix: "munzee.com",
      },
    ],
  }
);
