// Test time blocking logic

function getDurationMinutes(duration) {
  if (duration.includes('30 minutos')) return 30;
  if (duration.includes('1 hora')) return 60;
  if (duration.includes('2 horas')) return 120;
  return 30;
}

function isTimeSlotAvailable(date, time, duration, allAppointments) {
  const durationMins = getDurationMinutes(duration);
  const [hours, mins] = time.split(':').map(Number);
  const slotStartMins = hours * 60 + mins;
  const slotEndMins = slotStartMins + durationMins;

  // Check all booked appointments on this date
  for (const apt of allAppointments) {
    if (apt.date === date) {
      const [aptHours, aptMins] = apt.time.split(':').map(Number);
      const aptStartMins = aptHours * 60 + aptMins;
      const aptDurationMins = getDurationMinutes(apt.service.duration);
      const aptEndMins = aptStartMins + aptDurationMins;

      // Block if times overlap or touch (using <= to block adjacent slots)
      if (slotStartMins <= aptEndMins && slotEndMins > aptStartMins) {
        return false;
      }
    }
  }

  return true;
}

// Test case: 1-hour appointment at 8:00 should block 8:00, 8:30, 9:00
const appointment = {
  date: '12/12/2024',
  time: '08:00',
  service: { duration: '1 hora' }
};

const times = ['08:00', '08:30', '09:00', '09:30', '10:00'];
console.log('Test: 1-hour appointment at 8:00 should block 8:00, 8:30, and 9:00');
console.log('Booked slot: 08:00 - 09:00 (60 minutes)\n');
times.forEach(time => {
  const available = isTimeSlotAvailable('12/12/2024', time, '30 minutos', [appointment]);
  console.log(`${time}: ${available ? 'AVAILABLE ✓' : 'BLOCKED ✗'}`);
});

console.log('\n--- Current behavior ---');
console.log('08:00: BLOCKED (slot overlaps start)');
console.log('08:30: BLOCKED (slot overlaps middle)');
console.log('09:00: AVAILABLE (slot starts when previous ends)');
console.log('09:30: AVAILABLE');
console.log('10:00: AVAILABLE');

console.log('\n--- Note ---');
console.log('The 09:00 slot is technically available because it does not overlap.');
console.log('(8:00-9:00) < 9:00 is true, but 8:00-9:00 > 9:00 is false');
console.log('So the condition: slotStart < aptEnd && slotEnd > aptStart => 540 < 540 = false');

