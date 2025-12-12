import { getAppointments, createAppointment, deleteAppointment } from '../src/app.js';

const TEST_ID = 'test-' + Date.now().toString();

const sample = {
  id: TEST_ID,
  service: { id: '1', name: 'Teste', duration: '30 minutos', price: 0 },
  date: '01/01/2099',
  time: '09:00',
  professional: 'Gaby',
  firstName: 'Teste',
  lastName: 'Usuario',
  phone: '+5511999999999',
  packageOption: null,
};

try {
  console.log('Inserting test appointment (no id sent)');
  const created = await createAppointment(sample);
  console.log('Inserted. createAppointment returned:', Array.isArray(created) ? created[0] : created);
  const data = await getAppointments({ limit: 20, order: 'asc' });
  console.log('Total appointments returned:', Array.isArray(data) ? data.length : 'no-array');
  const createdId = created && Array.isArray(created) && created[0] ? created[0].id : null;
  const found = (data || []).find(d => String(d.id) === String(createdId));
  if (found) {
    console.log('Test appointment found:', { id: found.id, date: found.date, time: found.time });
  } else {
    console.warn('Test appointment not found in results.');
  }

  console.log('Cleaning up — deleting test appointment with id', createdId);
  if (createdId) await deleteAppointment(createdId);
  console.log('Deleted. Verifying removal...');
  const after = await getAppointments({ limit: 20, order: 'asc' });
  const still = (after || []).find(d => String(d.id) === String(createdId));
  console.log('Still present after delete?', !!still);
} catch (err) {
  console.error('Error during test:', err?.message || err);
  if (err && err.details) console.error('Details:', err.details);
  process.exitCode = 1;
}
