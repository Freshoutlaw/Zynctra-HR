// at > /mnt/user-data/outputs/atsService.ts << 'EOF'
/**
 * /frontend/src/services/api/atsService.ts
 * 
 * Applicant Tracking System API service
 */

import apiClient from './apiClient';

class ATSService {
  async postJob(jobData: any) {
    const response = await apiClient.post('/ats/jobs', jobData);
    return response.data;
  }

  async getJobs(filters?: any) {
    const response = await apiClient.get('/ats/jobs', { params: filters });
    return response.data;
  }

  async getCandidates(filters?: any) {
    const response = await apiClient.get('/ats/candidates', { params: filters });
    return response.data;
  }

  async getCandidate(candidateId: string) {
    const response = await apiClient.get(`/ats/candidates/${candidateId}`);
    return response.data;
  }

  async scoreCandidate(candidateId: string) {
    const response = await apiClient.post(`/ats/candidates/${candidateId}/score`);
    return response.data;
  }

  async parsedResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/ats/resume/parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async generateOfferLetter(candidateId: string, letterData: any) {
    const response = await apiClient.post(
      `/ats/candidates/${candidateId}/offer-letter`,
      letterData
    );
    return response.data;
  }

  async movePipeline(candidateId: string, toStage: string) {
    const response = await apiClient.patch(`/ats/candidates/${candidateId}`, {
      stage: toStage,
    });
    return response.data;
  }

  async getInterview(interviewId: string) {
    const response = await apiClient.get(`/ats/interviews/${interviewId}`);
    return response.data;
  }

  async scheduleInterview(candidateId: string, schedule: any) {
    const response = await apiClient.post(
      `/ats/candidates/${candidateId}/interview`,
      schedule
    );
    return response.data;
  }
}

export default new ATSService();
EOF
