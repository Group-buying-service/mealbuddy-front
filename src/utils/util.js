const dateFormat = (date) => {
  const dateObject = new Date(date)
  const formmatedDate = dateObject.getFullYear() +
  '-' + ((dateObject.getMonth() + 1) < 10 ? "0" : "") + (dateObject.getMonth() + 1) +
  '-' + (dateObject.getDate() < 10 ? "0" : "") + dateObject.getDate() +
  ' ' + (dateObject.getHours() < 10 ? "0" : "") + dateObject.getHours() +
  ':' + (dateObject.getMinutes() < 10 ? "0" : "") + dateObject.getMinutes();
  return formmatedDate
}

export { dateFormat }