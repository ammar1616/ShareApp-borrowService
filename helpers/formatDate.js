const dateFormat = require('date-format');

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = dateFormat('MM-dd-yyyy', date);
  return formattedDate;
}

module.exports = formatDate;
