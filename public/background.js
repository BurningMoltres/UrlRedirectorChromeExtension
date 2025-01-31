

const defaultShortcuts = [
  { shortcut: "g", url: "https://www.google.com/search?q=" },
  { shortcut: "yt", url: "https://www.youtube.com/results?search_query=" },
  { shortcut: "gh", url: "https://github.com/" },
  { shortcut: "wk", url: "https://en.wikipedia.org/wiki/" },
  { shortcut: "geek", url: "https://www.geeksforgeeks.org/" },
  { shortcut: "amazon", url: "https://www.amazon.in/s?k=" },
];

chrome.storage.sync.get("shortcuts", (data) => {
  let storedShortcuts = data?.shortcuts || [];
  const mergedShortcuts = mergeShortcuts(defaultShortcuts, storedShortcuts);
  chrome.storage.sync.set({ shortcuts: mergedShortcuts }, () => {
    console.log("Shortcuts initialized (defaults and user-defined).");
  });
});

function mergeShortcuts(defaults, stored) {
  const merged = [...stored];
  defaults.forEach((defaultShortcuts) => {
    const existingShortcutIndex = merged.findIndex(
      (storedShortcuts) =>
        storedShortcuts.shortcut === defaultShortcuts.shortcut
    );

    if (existingShortcutIndex === -1) {
      merged.push(defaultShortcuts);
    }
  });
  return merged;
}
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    const url = details.url;
    const urlObj = new URL(url);
    const searchTerm = urlObj?.searchParams.get("q");

    const parts = searchTerm?.indexOf(" ");

    if (parts !== -1) {
      const prefix = searchTerm?.substring(0, parts);
      const searchQuery = searchTerm?.substring(parts + 1);
 
      if (prefix === "yt") {
        targetUrl =
          "https://" + `www.youtube.com/results?search_query=${searchQuery}`;
        chrome.tabs.update(details.tabId, { url: targetUrl });
        return;
      }
      if (prefix === "gh") {
        targetUrl = `https://github.com/${searchQuery}`;
        chrome.tabs.update(details.tabId, { url: targetUrl });
        return;
      }
      if (prefix === "g") {
        targetUrl = `https://www.google.com/search?q=${searchQuery}`;
        chrome.tabs.update(details.tabId, { url: targetUrl });
        return;
      }
      if (prefix === "wk") {
        targetUrl = `https://en.wikipedia.org/wiki/${searchQuery}`;
        chrome.tabs.update(details.tabId, { url: targetUrl });
        return;
      }
      if (prefix === "amazon") {
        targetUrl = `https://www.amazon.in/s?k=${searchQuery}`;
        chrome.tabs.update(details.tabId, { url: targetUrl });
        return;
      }
    }

    if (searchTerm) {
      chrome.storage.sync.get("shortcuts", (data) => {
        const shortcuts = data?.shortcuts || [];

        const matchingShortcut = shortcuts.find(
          (shortcut) => shortcut?.shortcut === searchTerm
        );

        if (matchingShortcut) {
       

          let targetUrl = matchingShortcut?.url;
          if (
            !targetUrl.startsWith("http://") &&
            !targetUrl.startsWith("https://")
          ) {
            // If it's not a full URL, assume it's a domain or path and prepend https://
            targetUrl = "https://" + targetUrl;
          }
       
          chrome.tabs.update(details.tabId, { url: targetUrl });
        } else {
          console.log("No matching shortcut found for:", searchTerm);
         
        }
      });
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] }
);
