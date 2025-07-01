import { useState } from 'react';

// Configuração base da API
const API_BASE_URL = '/api';

// Função auxiliar para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// API de Projetos
export const projectsAPI = {
  // Listar todos os projetos
  getAll: () => apiRequest('/projects'),
  
  // Obter projeto por ID
  getById: (id) => apiRequest(`/projects/${id}`),
  
  // Criar novo projeto
  create: (projectData) => apiRequest('/projects', {
    method: 'POST',
    body: projectData,
  }),
  
  // Atualizar projeto
  update: (id, projectData) => apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: projectData,
  }),
  
  // Deletar projeto
  delete: (id) => apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// API de Desenvolvedores
export const developersAPI = {
  // Listar todos os desenvolvedores
  getAll: () => apiRequest('/developers'),
  
  // Obter desenvolvedor por ID
  getById: (id) => apiRequest(`/developers/${id}`),
  
  // Criar novo desenvolvedor
  create: (developerData) => apiRequest('/developers', {
    method: 'POST',
    body: developerData,
  }),
  
  // Atualizar desenvolvedor
  update: (id, developerData) => apiRequest(`/developers/${id}`, {
    method: 'PUT',
    body: developerData,
  }),
  
  // Deletar desenvolvedor
  delete: (id) => apiRequest(`/developers/${id}`, {
    method: 'DELETE',
  }),
};

// API de Lançamentos de Tempo
export const timeEntriesAPI = {
  // Listar todos os lançamentos
  getAll: () => apiRequest('/time-entries'),
  
  // Obter lançamento por ID
  getById: (id) => apiRequest(`/time-entries/${id}`),
  
  // Criar novo lançamento
  create: (timeEntryData) => apiRequest('/time-entries', {
    method: 'POST',
    body: timeEntryData,
  }),
  
  // Atualizar lançamento
  update: (id, timeEntryData) => apiRequest(`/time-entries/${id}`, {
    method: 'PUT',
    body: timeEntryData,
  }),
  
  // Deletar lançamento
  delete: (id) => apiRequest(`/time-entries/${id}`, {
    method: 'DELETE',
  }),
  
  // Obter lançamentos por desenvolvedor
  getByDeveloper: (developerId) => apiRequest(`/time-entries/by-developer/${developerId}`),
  
  // Obter lançamentos por projeto
  getByProject: (projectId) => apiRequest(`/time-entries/by-project/${projectId}`),
};

// Hook personalizado para estados de loading e erro
export const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, executeRequest };
};

