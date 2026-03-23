/**
 * Table Window
 * Main update logic for the table (playfield) window
 */

function updateScreen() {
  if (windowName === "table") {
    updateTableWindow();
    tableAudio.play(vpin.getAudioURL(currentTableIndex));
    preloadNearbyMedia();
  } else if (windowName === "bg") {
    updateBGWindow();
  } else if (windowName === "dmd") {
    updateDMDWindow();
  }
}

function updateTableWindow() {
  const container = document.getElementById("rootContainer");
  tableView = ensureTableView(container);

  if (!vpin.tableData || vpin.tableData.length === 0) {
    tableView.shell.style.display = "none";
    tableView.emptyState.style.display = "flex";
    return;
  }

  tableView.shell.style.display = "";
  tableView.emptyState.style.display = "none";

  const table = vpin.getTableMeta(currentTableIndex);
  const info = table.meta.Info || {};
  const vpx = table.meta.VPXFile || {};
  const title =
    info.Title || vpx.filename || table.tableDirName || "Unknown Table";
  const manufacturer = info.Manufacturer || vpx.manufacturer || "";
  const year = info.Year || vpx.year || "";
  const version = info.Version || vpx.version || "";
  const versionDisplay = version ? "v" + version : "";
  const authorsRaw = info.Authors || [];

  // Truncate authors to first 3, add "+" if more
  const authors = truncateAuthors(authorsRaw);

  // Update carousel
  updateWheelCarousel(tableView);

  // Update table info
  setNodeText(tableView.title, title);
  setNodeText(tableView.manufacturer, manufacturer);
  setNodeText(tableView.year, year);
  setNodeText(tableView.version, versionDisplay);
  setNodeText(tableView.authors, authors);

  // Hide separators for empty fields
  if (tableView.manufacturerSeparator) {
    // Hide separator between manufacturer and year if either is empty
    tableView.manufacturerSeparator.style.display =
      manufacturer && year ? "" : "none";
  }
  if (tableView.versionSeparator) {
    // Hide separator between year and version if either is empty
    tableView.versionSeparator.style.display =
      year && versionDisplay ? "" : "none";
  }

  // Update hero media
  updateHeroMedia(tableView.heroMedia, title);

  lastRenderedTableIndex = currentTableIndex;
  lastWheelMoveDirection = 0;
}

function truncateAuthors(authors) {
  if (!authors) return "";

  // Convert to array if string
  let authorArray = authors;
  if (typeof authors === "string") {
    authorArray = authors
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);
  }

  if (!Array.isArray(authorArray) || authorArray.length === 0) return "";

  // Take first 3
  const displayAuthors = authorArray.slice(0, 3);

  // Add "+" if there are more
  if (authorArray.length > 3) {
    return displayAuthors.join(", ") + " +" + (authorArray.length - 3);
  }

  return displayAuthors.join(", ");
}
