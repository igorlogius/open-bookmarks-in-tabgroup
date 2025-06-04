/* global browser */

const manifest = browser.runtime.getManifest();
const extname = manifest.name;

browser.menus.create({
  title: extname,
  contexts: ["bookmark"],
  onclick: async (info, tab) => {
    const [btNode] = await browser.bookmarks.get(info.bookmarkId);
    const createdTabs = [];
    if (typeof btNode.url === "string") {
      createdTabs.push(await browser.tabs.create({ url: btNode.url }));
    } else {
      for (const c of await browser.bookmarks.getChildren(btNode.id)) {
        createdTabs.push(await browser.tabs.create({ url: c.url }));
      }
    }
    if (createdTabs.length > 0) {
      browser.tabs.group({
        // tbd. set name as soon as the option is available
        // ref. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/group
        tabIds: createdTabs.map((t) => t.id),
      });
    }
  },
});
