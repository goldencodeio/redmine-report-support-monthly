var OPTIONS = {};

function initMonthlyOptions() {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();

  getOptionsData();

  var sheetName = 'Итог Месяц: ' + formatDate(OPTIONS.startDate).substr(0, 7);
  var existingSheet = _ss.getSheetByName(sheetName);
  if (existingSheet) _ss.deleteSheet(existingSheet);
  createNewSheet(sheetName, '#ffd966');
}

function createNewSheet(name, color) {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();
  return _ss.insertSheet(name).setTabColor(color).setColumnWidth(1, 200).activate().setFrozenColumns(1);
}
