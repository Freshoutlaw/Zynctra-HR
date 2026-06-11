/**
 * /frontend/src/services/api/documentService.ts
 *
 * Document management API service
 */

import apiClient from './apiClient';

class DocumentService {
  async getDocuments(filters?: Record<string, string | number | boolean>) {
    const res = await apiClient.get(
      '/documents',
      filters ? { params: filters } : undefined
    );
    return res.data ?? [];
  }

  async uploadDocument(file: File, metadata?: unknown) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) formData.append('metadata', JSON.stringify(metadata));
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? ''}/documents/upload`,
      { method: 'POST', credentials: 'include', body: formData }
    );
    if (!response.ok) throw new Error('Document upload failed');
    return response.json();
  }

  async shareDocument(documentId: string, emails: string[], permissions?: unknown) {
    const res = await apiClient.post(`/documents/${documentId}/share`, {
      emails,
      permissions,
    });
    return res.data;
  }

  async getDocument(documentId: string) {
    const res = await apiClient.get(`/documents/${documentId}`);
    return res.data;
  }

  async deleteDocument(documentId: string) {
    const res = await apiClient.delete(`/documents/${documentId}`);
    return res.data;
  }

  async searchDocuments(query: string) {
    const res = await apiClient.get('/documents/search', { params: { q: query } });
    return res.data ?? [];
  }

  async getDocumentVersions(documentId: string) {
    const res = await apiClient.get(`/documents/${documentId}/versions`);
    return res.data ?? [];
  }
}

export default new DocumentService();