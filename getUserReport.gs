function getUserReport(report, user, userIndex) {
  switch (report) {
    case 'work_time':
      return getWorkTime(userIndex);
      break;

    case 'written_time':
      return getWrittenTimeRating(user, userIndex);
      break;

    case 'total_tasks':
      return getCountTotalTasks(user, userIndex);
      break;

    case 'done_tasks':
      return getCountDoneTasks(user, userIndex);
      break;

    case 'critical_tasks':
      return getCountCriticalTasks(user, userIndex);
      break;

    case 'overdue_tasks':
      return getOverdueTasks(user, userIndex);
      break;

    case 'paid_separately':
      return getPaidSeparatelyTasks(user, userIndex);
      break;

    case 'claims':
      return getClaims(user, userIndex);
      break;

    case 'client_rating_avg':
      return getClientRatingAverage(user, userIndex);
      break;

    case 'boss_rating_avg':
      return getBossRatingAverage(user, userIndex);
      break;

    case 'kpi_rating_avg':
      return getKPIRatingAverage(user, userIndex);
      break;
  }
}

function getWorkTime(i) {
  return OPTIONS.performersWorkHours[i];
}

function getWrittenTimeRating(user, i) {
  var res = APIRequest('time_entries', {query: [
    {key: 'user_id', value: user.id},
    {key: 'spent_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}
  ]});

  var timeEntries = res.time_entries.reduce(function(a, c) {
    return a + c.hours;
  }, 0);

  if (!OPTIONS.performersWorkHours[i]) return 0;
  var rating = (timeEntries / parseInt(OPTIONS.performersWorkHours[i], 10)) * 5;
  return (rating > 5) ? 5 : rating;
}

function getCountTotalTasks(user, i) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: '*'},
    {key: 'created_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}
  ]});
  return res.issues;
}

function getCountDoneTasks(user, userIndex) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}
  ]});

  var filteredIssuesWithRate = res.issues.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });
  return [res.issues, filteredIssuesWithRate];
}

function getCountCriticalTasks(user, i) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)},
    {key: 'priority_id', value: '5'}
  ]});

  var criticalTasksWithRate = res.issues.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });

  return [res.issues, criticalTasksWithRate];
}

function getPaidSeparatelyTasks(user, i) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)},
    {key: 'cf_24', value: 'Единовременная услуга (К оплате)'}
  ]});

  var paidSeparatelyTasksWithRate = res.issues.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });

  return [res.issues, paidSeparatelyTasksWithRate];
}

function getClaims(user, i) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: 5},
    {key: 'status_id', value: '*'},
    {key: 'created_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}
  ]});

  var allClaims = res.issues.filter(function(item) {
    var responsibles = item.custom_fields.find(function(i) {return i.id === 40}).value;
    for (var i = 0; i < responsibles.length; i++) {
      if (parseInt(responsibles[i], 10) === user.id) return true;
    }
  });

  var closedClaims = allClaims.filter(function(item) {
    return item.status.id === 5;
  });

  return [allClaims, closedClaims];
}

function getClientRatingAverage(user, i) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)},
    {key: 'cf_7', value: '*'}
  ]});

  var sum = res.issues.reduce(function(a, c) {
    return a + parseInt(c.custom_fields.find(function(i) {return i.id === 7}).value, 10);
  }, 0);

  return res.issues.length ? sum / res.issues.length : 0;
}

function getBossRatingAverage(user, i) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)},
    {key: 'cf_8', value: '*'}
  ]});

  var sum = res.issues.reduce(function(a, c) {
    return a + parseInt(c.custom_fields.find(function(i) {return i.id === 8}).value, 10);
  }, 0);

  return res.issues.length ? sum / res.issues.length : 0;
}

function getKPIRatingAverage(user, i) {
  var writtenTimeRating = getWrittenTimeRating(user, i);
  var clientRatingAverage = getClientRatingAverage(user, i);
  var bossRatingAverage = getBossRatingAverage(user, i);

  return (writtenTimeRating + clientRatingAverage + bossRatingAverage) / 3;
}
