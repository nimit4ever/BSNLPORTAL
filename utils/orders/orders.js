async function updateTask(oldTasks, newTasks = { NO: undefined, NIB: undefined, LCTX: undefined, LDTX: undefined, MLLN: undefined }) {
  for (task in newTasks) {
    if (newTasks.hasOwnProperty(task)) {
      if (newTasks[task] === undefined) {
        if (oldTasks[task] === false) {
          oldTasks[task] = true;
        }
      }

      if (oldTasks[task] === undefined) {
        if (newTasks[task] === false) {
          oldTasks[task] = false;
        }
      }
    }
  }
}

function searchBuild({ query, user }, active = true) {
  let findObj = {};
  console.log(Object.keys(query).length);
  if (Object.keys(query).length) {
    findObj = queryBuild(query, active).findObj;
  } else {
    let task = 'task';
    if (user) {
      if (!(user.role === 'NO' || user.role === 'ADMIN')) {
        task = 'task.' + user.role;
        findObj[task] = { $exists: true, $eq: false };
      }
      if (user.area && user.area.length === 3) {
        findObj['$or'] = [{ endAStation: user.area }, { endBStation: user.area }];
      }
    }
    findObj['isActive'] = active;
  }
  return findObj;
}

function queryBuild(query, active = true) {
  const area = query.area && query.area.length === 3 ? query.area : 'NONE';
  const findObj = {};
  findObj['$or'] = [{ endAStation: area }, { endBStation: area }];
  findObj['isActive'] = active;
  return { findObj, area };
}

module.exports = { updateTask, searchBuild, queryBuild };
