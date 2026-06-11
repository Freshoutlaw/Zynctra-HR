/**
 * /frontend/src/services/api/atsService.ts
 *
 * Applicant Tracking System API service
 */

import apiClient from './apiClient';

class ATSService {
  async postJob(jobData: unknown) {
    const res = await apiClient.post('/ats/jobs', jobData);
    return res.data;
  }

  async getJobs(filters?: Record<string, string | number | boolean>) {
    const res = await apiClient.get(
      '/ats/jobs',
      filters ? { params: filters } : undefined
    );
    return res.data ?? [];
  }

  async getCandidates(filters?: Record<string, string | number | boolean>) {
    const res = await apiClient.get(
      '/ats/candidates',
      filters ? { params: filters } : undefined
    );
    return res.data ?? [];
  }

  async getCandidate(candidateId: string) {
    const res = await apiClient.get(`/ats/candidates/${candidateId}`);
    return res.data;
  }

  async scoreCandidate(candidateId: string) {
    const res = await apiClient.post(`/ats/candidates/${candidateId}/score`);
    return res.data;
  }

  async parseResume(file: File) {
    // For file uploads we use a direct fetch so we can send FormData
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL ?? ''}/ats/resume/parse`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    );
    if (!res.ok) throw new Error('Resume parse failed');
    return res.json();
  }

  async generateOfferLetter(candidateId: string, letterData: unknown) {
    const res = await apiClient.post(
      `/ats/candidates/${candidateId}/offer-letter`,
      letterData
    );
    return res.data;
  }

  async movePipeline(candidateId: string, toStage: string) {
    const res = await apiClient.patch(`/ats/candidates/${candidateId}`, {
      stage: toStage,
    });
    return res.data;
  }

  async getInterview(interviewId: string) {
    const res = await apiClient.get(`/ats/interviews/${interviewId}`);
    return res.data;
  }

  async scheduleInterview(candidateId: string, schedule: unknown) {
    const res = await apiClient.post(
      `/ats/candidates/${candidateId}/interview`,
      schedule
    );
    return res.data;
  }
}

export default new ATSService();

