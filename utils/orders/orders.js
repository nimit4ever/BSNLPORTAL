const queries = ['isActive', ''];

async function updateTask(oldTasks, newTasks = {}) {
  if (newTasks.NO === undefined) {
    if (oldTasks.NO === false) oldTasks.NO = true;
  } else {
    oldTasks.NO = false;
  }

  if (newTasks.NIB === undefined) {
    if (oldTasks.NIB === false) oldTasks.NIB = true;
  } else {
    oldTasks.NIB = false;
  }

  if (newTasks.MLLN === undefined) {
    if (oldTasks.MLLN === false) oldTasks.MLLN = true;
  } else {
    oldTasks.MLLN = false;
  }

  if (newTasks.LCTX === undefined) {
    if (oldTasks.LCTX === false) oldTasks.LCTX = true;
  } else {
    oldTasks.LCTX = false;
  }

  if (newTasks.LDTX === undefined) {
    if (oldTasks.LDTX === false) oldTasks.LDTX = true;
  } else {
    oldTasks.LDTX = false;
  }
}

class Query {
  constructor({ query = undefined, user = undefined }) {
    if (query) {
      if (query.isActive) {
        this.isActive = query.isActive && query.isActive == 0 ? false : true;
      }

      if (user && user.area) {
        this.$or = [{ endAStation: user.area }, { endBStation: user.area }];
      } else if (query.area) {
        this.$or = [{ endAStation: query.area }, { endBStation: query.area }];
      } else {
        this.$or = [{ endAStation: 'NONE' }, { endBStation: 'NONE' }];
      }

      if (user && user.role && user.role !== 'NO') {
        this[user.role] = { $exists: true };
      } else if (query.role) {
        this[query.role] = { $exists: true };
      }

      if (query.reason) {
        if (query.reason === 'INCOMPLETE') {
          this.reason = { $not: { $in: ['COMMISSIONED', 'CANCELLED'] } };
        } else {
          this.reason = query.reason;
        }
      }
      if (query.agency) this.agency = query.agency != 0 ? query.agency : '';
      if (query.orderType) this.orderType = query.orderType;
    }
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
