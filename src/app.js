// Supabase helper for Gabriela Rolemberg Manicure & Pedicure
// Provides functions to interact with the `appointments` storage via Supabase

import { createClient } from '@supabase/supabase-js';

// Supabase project credentials (provided)
const SUPABASE_URL = 'https://dkgdupdpdztkkrlykqbp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ2R1cGRwZHp0a2tybHlrcWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTEwNDcsImV4cCI6MjA4MDQ2NzA0N30.3LKjawTvkJ0zta_rYjAha60LfpPwPkR0RfMNXb2YA48';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table schema expected (suggested):
// Table name: appointments
// Columns: id (text or uuid, primary key), service (json), date (text), time (text), professional (text), first_name (text), last_name (text), phone (text), package_option (text), created_at (timestamp)

export async function createAppointment(appointment) {
  // appointment: { id, service, date, time, professional, firstName, lastName, phone, packageOption }
  
  // Convert date from DD/MM/YYYY to YYYY-MM-DD for Supabase
  const dateStr = appointment.date;
  let isoDate = dateStr;
  if (dateStr && dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    isoDate = `${year}-${month}-${day}`;
  }
  
  const payload = {
    service: appointment.service,
    date: isoDate, // Now in YYYY-MM-DD format
    time: appointment.time,
    professional: appointment.professional,
    first_name: appointment.firstName,
    last_name: appointment.lastName,
    phone: appointment.phone,
    package_option: appointment.packageOption || null,
  };

  // Only include id if provided and numeric (let DB auto-generate if not)
  if (appointment.id) {
    const idStr = String(appointment.id);
    if (/^\d+$/.test(idStr)) {
      payload.id = Number(idStr);
    } else {
      payload.id = appointment.id;
    }
  }

  const { data, error } = await supabase.from('appointments').insert([payload]).select('*');
  if (error) throw error;
  return data;
}

export async function updateAppointment(id, updates) {
  // updates: partial fields using the DB column names or camelCase (we'll map camelCase)
  const map = {};
  
  // Convert date from DD/MM/YYYY to YYYY-MM-DD if present
  if (updates.date !== undefined) {
    const dateStr = updates.date;
    if (dateStr && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      map.date = `${year}-${month}-${day}`;
    } else {
      map.date = dateStr;
    }
  }
  
  if (updates.service !== undefined) map.service = updates.service;
  if (updates.time !== undefined) map.time = updates.time;
  if (updates.professional !== undefined) map.professional = updates.professional;
  if (updates.firstName !== undefined) map.first_name = updates.firstName;
  if (updates.lastName !== undefined) map.last_name = updates.lastName;
  if (updates.phone !== undefined) map.phone = updates.phone;
  if (updates.packageOption !== undefined) map.package_option = updates.packageOption;

  const { data, error } = await supabase.from('appointments').update(map).eq('id', id);
  if (error) throw error;
  return data;
}

export async function getAppointments({ limit = 100, order = 'asc' } = {}) {
  let q = supabase.from('appointments').select('*');
  if (order === 'asc') q = q.order('created_at', { ascending: true });
  else q = q.order('created_at', { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function deleteAppointment(id) {
  const { data, error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
  return data;
}

export default {
  supabase,
  createAppointment,
  updateAppointment,
  getAppointments,
  deleteAppointment,
};
