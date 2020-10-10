const queries = ['isActive', ''];

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

class Query {
  constructor({ query = undefined, user = undefined }) {
    let area = 'NONE';
    let role = 'NONE';
    this.findObj = {};

    if (user) {
      if (user.area && user.area.length === 3) area = user.area;
      if (user.role) {
        role = user.role;
      }

      if (query && Object.keys(query).length) {
        if (role === 'ADMIN') {
          if (query.area && query.area.length === 3) area = query.area;
          if (query.role) {
            this.findObj[`task.${query.role}`] = { $exists: true, $eq: query.task && query.task === 'COMPLETED' ? true : false };
          }
        } else if (role === 'NO') {
          if (query.role) {
            this.findObj[`task.${query.role}`] = { $exists: true, $eq: query.task && query.task === 'COMPLETED' ? true : false };
          }
        } else {
          this.findObj[`task.${role}`] = { $exists: true, $eq: query.task && query.task === 'COMPLETED' ? true : false };
        }
      } else {
        this.findObj[`task.${role}`] = { $exists: true, $eq: query.task && query.task === 'COMPLETED' ? true : false };
      }
    }

    this.findObj.isActive = query.isActive && query.isActive === 'FALSE' ? false : true;
    this.findObj.$or = [{ endAStation: area }, { endBStation: area }];
  }
}

function fetchqueryBuild(query) {
  const area = query.area && query.area.length === 3 ? query.area : 'NONE';
  const findObj = {};
  findObj['$or'] = [{ endAStation: area }, { endBStation: area }];
  findObj['isActive'] = true;
  return { findObj, area };
}

module.exports = { updateTask, fetchqueryBuild, Query };
