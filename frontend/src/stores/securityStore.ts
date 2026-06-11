import { create } from 'zustand';
import type { IncidentRecord } from '../types/security.types';

interface SecurityState {
  incidents: IncidentRecord[];
  selectedIncident: IncidentRecord | null;
  setIncidents: (incidents: IncidentRecord[]) => void;
  selectIncident: (incident: IncidentRecord | null) => void;
  resolveIncident: (incidentId: string) => void;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  incidents: [],
  selectedIncident: null,
  setIncidents: (incidents) => set({ incidents }),
  selectIncident: (selectedIncident) => set({ selectedIncident }),
  resolveIncident: (incidentId) =>
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === incidentId
          ? { ...incident, resolved: true, resolvedAt: new Date().toISOString() }
          : incident
      ),
      selectedIncident:
        state.selectedIncident?.id === incidentId
          ? { ...state.selectedIncident, resolved: true, resolvedAt: new Date().toISOString() }
          : state.selectedIncident,
    })),
}));
