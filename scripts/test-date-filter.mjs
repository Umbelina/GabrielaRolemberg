// Test date filtering logic

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function filterFutureDates(dates) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('Today:', today.toLocaleDateString('pt-BR'));
  console.log('Today timestamp:', today.getTime());

  return dates.filter(dateStr => {
    const date = parseDate(dateStr);
    date.setHours(0, 0, 0, 0);
    console.log(`Date ${dateStr}:`, date.toLocaleDateString('pt-BR'), 'timestamp:', date.getTime(), '- Future?', date >= today);
    return date >= today;
  }).sort((a, b) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    return dateA.getTime() - dateB.getTime();
  });
}

const availableDates = [
  '05/12/2024',
  '06/12/2024',
  '07/12/2024',
  '09/12/2024',
  '10/12/2024',
  '11/12/2024',
  '12/12/2024',
  '13/12/2024',
  '14/12/2024',
];

console.log('Available dates:', availableDates);
console.log('\n--- Filtering ---\n');
const filtered = filterFutureDates(availableDates);
console.log('\nFiltered dates:', filtered);
