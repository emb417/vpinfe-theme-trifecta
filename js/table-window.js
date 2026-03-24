/**
 * Table Window
 * Main update logic for the table (playfield) window
 */

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

  const authors = truncateAuthors(authorsRaw);

  updateWheelCarousel(tableView);

  setNodeText(tableView.title, title);
  setNodeText(tableView.manufacturer, manufacturer);
  setNodeText(tableView.year, year);
  setNodeText(tableView.version, versionDisplay);
  setNodeText(tableView.authors, authors);

  if (tableView.manufacturerSeparator) {
    tableView.manufacturerSeparator.style.display =
      manufacturer && year ? "" : "none";
  }
  if (tableView.versionSeparator) {
    tableView.versionSeparator.style.display =
      year && versionDisplay ? "" : "none";
  }

  updateHeroMedia(tableView.heroMedia, title);

  lastRenderedTableIndex = currentTableIndex;
  lastWheelMoveDirection = 0;
}

function truncateAuthors(authors) {
  if (!authors) return "";

  let authorArray = authors;
  if (typeof authors === "string") {
    authorArray = authors
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);
  }

  if (!Array.isArray(authorArray) || authorArray.length === 0) return "";

  const displayAuthors = authorArray.slice(0, 3);

  if (authorArray.length > 3) {
    return displayAuthors.join(", ") + " +" + (authorArray.length - 3);
  }

  return displayAuthors.join(", ");
}
