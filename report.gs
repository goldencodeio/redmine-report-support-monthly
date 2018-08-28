var REPORT = [
  {
    code: 'work_time',
    name: 'Рабочее\nвремя',
    manual: false
  },
  {
    code: 'written_time',
    name: 'Средняя оценка\nза списанное время',
    manual: false
  },
  {
    code: 'total_tasks',
    name: 'Всего\nзадач',
    manual: false
  },
  {
    code: 'done_tasks',
    name: 'Выполнено/\nОценено',
    manual: false
  },
  {
    code: 'critical_tasks',
    name: 'Критических/\nОценено',
    manual: false
  },
 {
   code: 'paid_separately',
   name: 'Оплачивается\nотдельно/\nОценено',
   manual: false
 },
  {
    code: 'unsubscribed',
    name: 'Неотписано/\nОценено',
    manual: false
  },
 {
   code: 'claims',
   name: 'Претензий/\nОтработано',
   manual: false
 },
 {
   code: 'client_rating_avg',
   name: 'Ср. Оценка\nзаявителя',
   manual: false
 },
 {
   code: 'boss_rating_avg',
   name: 'Ср. Оценка\nведения задачи',
   manual: false
 },
 {
   code: 'kpi_rating_avg',
   name: 'Коэффи-\nциент KPI',
   manual: false
 }
];

function processReports() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var rowI = 2;
  var columnI = 2;

  OPTIONS.performers = OPTIONS.performers.map(function(user, userIndex) {
    user.reports = {};

    REPORT.forEach(function(report) {
      if (!report.manual) {
        var reportValue = getUserReport(report.code, user, userIndex);        
        if ((Array.isArray(reportValue))) {
          var listUrl = '';
          if ((Array.isArray(reportValue[0]))) {
            reportValue[0].forEach(function(task) {
              listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
            });
            sheet.getRange(rowI, columnI++).setValue(reportValue[0].length + ' / '+ reportValue[1].length).setNote(listUrl);
          } else {
            reportValue.forEach(function(task) {
              listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
            });
            sheet.getRange(rowI, columnI++).setValue(reportValue.length).setNote(listUrl);
          }
        } else {
          if (report.code === 'work_time' && reportValue === 0) sheet.hideRows(rowI);
          sheet.getRange(rowI, columnI++).setValue(reportValue);
        }
      } else {
        if (parseInt(OPTIONS.performersWorkHours[userIndex], 10) === 0) sheet.getRange(rowI, columnI).setValue(0);
        ss.setNamedRange('manualRange' + rowI + columnI, sheet.getRange(sheet.getRange(rowI, columnI++).getA1Notation()));
      }
    });

    columnI = 2;
    rowI++;
    return user;
  });
}
