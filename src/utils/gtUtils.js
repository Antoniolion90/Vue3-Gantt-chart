// import dayjs from 'dayjs'

const cacheParseTime = (function() {
  let cacheString = {};
  let cacheValue = {};
  let count = 0;

  return function(timeName, timeString) {
    if (cacheString[timeName] !== timeString) {
      if (count++ > 10000) {
        cacheString = {};
        cacheValue = {};
      }
      cacheString[timeName] = timeString;
      return (cacheValue[timeName] = parseTime(timeString));
    }

    return cacheValue[timeName];
  };
})();

/**
 * 根据配置项计算两个时间的在gantt 图中的长度
 * 注：时间上start 早， end 晚
 *
 * @export
 * @param {string} start
 * @param {string} end
 * @param {{scale:number,cellWidth:number}} arg
 * @returns number
 */
export function getWidthAbout2Times(start, end, arg) {
  const { scale, cellWidth } = arg;
  const pStart = cacheParseTime("pStart", start);
  const pEnd = parseTime(end);
  return (diffTimeByMinutes(pStart, pEnd) / scale) * cellWidth;
}

/**
 * 根据配置项计算 相对于 时间轴起始时间的距离 是 getWidthAbout2Times 的特化
 * 注：时间上，time 晚  beginTimeOfTimeLine 早
 *
 * @export
 * @param {string} time
 * @param {string} beginTimeOfTimeLine
 * @param {{scale:number,cellWidth:number}} arg
 * @returns number
 */
export function getPositionOffset(time, beginTimeOfTimeLine, arg) {
  const { scale, cellWidth } = arg;
  const pTime = cacheParseTime("pStart", time);
  const pBeginTimeOfTimeLine = cacheParseTime(
    "pBeginTimeOfTimeLine",
    beginTimeOfTimeLine
  );
  return (diffTimeByMinutes(pBeginTimeOfTimeLine, pTime) / scale) * cellWidth;
}

function parseTime(time) {
  return new Date(time);
}
/**
 * 计算两个时间相差的分钟数
 *
 * @param {string} start
 * @param {string} end
 * @returns
 */
function diffTimeByMinutes(start, end) {
  const diff = end.getTime() - start.getTime();
  return diff / 1000 / 60;
}

