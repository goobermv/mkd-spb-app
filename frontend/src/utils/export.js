export const downloadList = (fileName, data) => {
  if (!data || data.length === 0) {
    alert("Нет данных для выгрузки");
    return;
  }
  
  const BOM = "\uFEFF";
  const header = Object.keys(data[0]).join(",") + "\n";
  const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
  
  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(BOM + header + rows);
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};