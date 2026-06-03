// cat > /mnt/user-data/outputs/documentService.ts << 'EOF'
/**
 * /frontend/src/services/api/documentService.ts
 * 
 * Document management API service
 */

import apiClient from './apiClient';

class DocumentService {
  async getDocuments(filters?: any) {
    const response = await apiClient.get('/documents', { params: filters });
    return response.data;
  }

  async uploadDocument(file: File, metadata?: any) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    const response = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async shareDocument(documentId: string, emails: string[], permissions?: any) {
    const response = await apiClient.post(`/documents/${documentId}/share`, {
      emails,
      permissions,
    });
    return response.data;
  }

  async getDocument(documentId: string) {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data;
  }

  async deleteDocument(documentId: string) {
    const response = await apiClient.delete(`/documents/${documentId}`);
    return response.data;
  }

  async searchDocuments(query: string) {
    const response = await apiClient.get('/documents/search', {
      params: { q: query },
    });
    return response.data;
  }

  async getDocumentVersions(documentId: string) {
    const response = await apiClient.get(`/documents/${documentId}/versions`);
    return response.data;
  }
}

export default new DocumentService();
// EOF