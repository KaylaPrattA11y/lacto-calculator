const formatDecimal = (number) => new Intl.NumberFormat("default", { maximumSignificantDigits: 3 }).format(number);

const formatDate = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("default", {
    weekday: 'short',
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: 'numeric',
  })?.format(d);
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDateForInputField(date = new Date()) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

const addOneDay = date => {
  date.setDate(date.getDate() + 1);
  return date;
}

const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
})
const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
]
function formatTimeAgo(date) {
  let duration = (date - new Date()) / 1000

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name)
    }
    duration /= division.amount
  }
}