async function updateTask(
  oldTasks,
  newTasks = {
    NO: undefined,
    NIB: undefined,
    LCTX: undefined,
    LDTX: undefined,
    MLLN: undefined,
  }
) {
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

module.exports = { updateTask };
