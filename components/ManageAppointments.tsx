import { useState, useEffect } from 'react';
import { Search, X, Calendar, Clock } from 'lucide-react';
import { deleteAppointment } from '../src/app.js';

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  isPackage?: boolean;
}

interface Appointment {
  id: string;
  service: Service;
  date: string;
  time: string;
  professional: string;
  firstName: string;
  lastName: string;
  phone: string;
  packageOption?: string;
}

interface ManageAppointmentsProps {
  onClose: () => void;
  onReschedule: (appointment: Appointment) => void;
}

export function ManageAppointments({ onClose, onReschedule }: ManageAppointmentsProps) {
  const [searchPhone, setSearchPhone] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Carregar agendamentos do localStorage
    const stored = localStorage.getItem('appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  const handleSearch = () => {
    if (!searchPhone.trim()) {
      setFilteredAppointments([]);
      return;
    }
    const filtered = appointments.filter(apt => 
      apt.phone.replace(/\D/g, '').includes(searchPhone.replace(/\D/g, ''))
    );
    setFilteredAppointments(filtered);
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm('Tem certeza que deseja cancelar este agendamento?');
    if (confirmed) {
      const updatedAppointments = appointments.filter(apt => apt.id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(filteredAppointments.filter(apt => apt.id !== id));
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

      // Deletar do Supabase
      try {
        await deleteAppointment(id);
      } catch (err) {
        console.error('Erro ao deletar do Supabase:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-black">Gerenciar Agendamentos</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Buscar por telefone
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
            />
            <button
              onClick={handleSearch}
              className="bg-black text-white px-4 sm:px-6 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-black mb-1 text-sm sm:text-base">
                      {appointment.firstName} {appointment.lastName}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{appointment.phone}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Serviço:</span>
                    <span className="text-black">{appointment.service.name}</span>
                  </div>
                  {appointment.packageOption && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Pacote:</span>
                      <span className="text-black font-semibold">{appointment.packageOption}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-600" />
                    <span className="text-black">{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-gray-600" />
                    <span className="text-black">{appointment.time}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onReschedule(appointment)}
                    className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    Remarcar
                  </button>
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="flex-1 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors border-2 border-gray-200 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : searchPhone ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum agendamento encontrado para este telefone.</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Digite o telefone para buscar seus agendamentos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
