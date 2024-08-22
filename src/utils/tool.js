import dayjs from "dayjs";
/**
 * 是否没有值
 *
 * @export
 * @param {*} v
 * @returns
 */
export function isUndef(v) {
  return v === undefined || v === null;
}
/**
 * 是否有值
 *
 * @export
 * @param {*} v
 * @returns
 */
export function isDef(v) {
  return v !== undefined && v !== null;
}

export function warn(str) {
  // eslint-disable-next-line
  console.warn(str)
}

export function noop() {}

export function debounce(fn, interval = 500, immediate = false) {

  let timeout;

  return function() {

    let context = this,
      args = arguments;
    let later = function() {

      timeout = null;
      if (!immediate) fn.apply(context, args);
    };

    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, interval);
    if (callNow) fn.apply(context, args);
  };
}

export  function throttle(fn, interval = 100) {

  let _self = fn,
    timer,
    firstTime = true;
  return function() {

    let args = arguments,
      _me = this;
    if (firstTime) {

      _self.apply(_me, args);
      return (firstTime = false);
    }
    if (timer) {

      return false;
    }
    timer = setTimeout(function() {

      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval);
  };
}

export function checkConflict(blockItem, row, targetBlockItem) {
  function convertTimeStr(time) {
    return dayjs(time).format("MM-DD HH:mm");
  }

  let currentBlock = blockItem;
  let blockList = row.gtArray.filter((item) => {
    return (
      item.movedStatus !== "before" &&
      (targetBlockItem ? item.id !== targetBlockItem.id : true)
    );
  });

  let conflictList = [];

  let blockStart = dayjs(currentBlock.start).valueOf();
  let blockEnd = dayjs(currentBlock.end).valueOf();
  for (let i = 0; i < blockList.length; i++) {
    let compareBlock = blockList[i];
    let compareBlockStart = dayjs(compareBlock.start).valueOf();
    let compareBlockEnd = dayjs(compareBlock.end).valueOf();
    if (
      (compareBlockStart < blockStart && blockStart < compareBlockEnd) ||
      (compareBlockStart < blockEnd && blockEnd < compareBlockEnd) ||
      (compareBlockStart >= blockStart && blockEnd >= compareBlockEnd)
    ) {
      let timeConflictStr = `${currentBlock.id}:(${convertTimeStr(
        currentBlock.start
      )}-${convertTimeStr(currentBlock.end)})с целями：${
        compareBlock.id
      }(${convertTimeStr(compareBlock.start)}-${convertTimeStr(
        compareBlock.end
      )})时间冲突`;

      conflictList.push({
        conflictType: "Конфликт проверки времени",
        conflictDesc: timeConflictStr,
        isIgnore: false
      });
    }
  }
  return {
    blockItem: blockItem,
    targetRowId: row.id,
    blockId: blockItem.id,
    adjustType: "двигаться",
    conflictList: conflictList
  };
}
