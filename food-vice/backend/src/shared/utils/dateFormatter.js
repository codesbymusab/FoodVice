const dayjs=require('dayjs')
const relativeTime =require("dayjs/plugin/relativeTime")

dayjs.extend(relativeTime);

exports.formatReviewDate= (date) => {
  if (!date) return "";
  return dayjs(date).fromNow(); 
}
