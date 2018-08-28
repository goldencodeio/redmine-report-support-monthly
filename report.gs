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
 },
 {
   code: 'penalty_claims',
   name: 'Штраф за\nпретензии',
   manual: true
 },
 {
   code: 'penalty_delays',
   name: 'Штраф за\nопоздания',
   manual: true
 },
 {
   code: 'bonus',
   name: 'Премия',
   manual: true
 },
 {
   code: 'finally_bonus',
   name: '% от премии',
   manual: true
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
          sheet.getRange(rowI, columnI++).setValue(reportValue);
        }
      } else {
        if (report.code === 'finally_bonus') {
          sheet.getRange(rowI, columnI).setFormula('=SUM(K' + rowI + '-L' + rowI + '-M' + rowI + '+N' + rowI + ')');
        }
        columnI++;
      }
    });

    columnI = 2;
    rowI++;
    return user;
  });
}
