export const timeRemaining = (timestamp, type = 0) => {
  /*
    Timestamp from blockchain is returned in unix epoch time,
    which automatically gets converted to locale time when passed in new Date()
  */
  let date_future = new Date(timestamp * 1000);
  if (type === 1) {
    // Timestamp from pyAPI is returned in UTC format which needs to be converted into Locale timestamp.
    // date_future = new Date(`${timestamp.replace("T", " ")} UTC`);
    date_future = new Date(timestamp);
  }
  // let newDate = "2022-01-24 05:21:08";
  // let df = new Date(newDate);
  // console.log("df", df);
  const date_now = new Date();
  // Date provided is already elapsed
  if (date_future < date_now) {
    return 0;
  }
  let seconds = Math.floor((date_future - date_now) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
  return { days, hours, minutes, seconds };
};
