import { useState } from 'react'
import { Plus, Trash2, Clock, User, Calendar, FileText, X, AlertTriangle, UserPlus } from 'lucide-react'
import { timeEntriesAPI, developersAPI } from '../services/api'

const TimeEntries = ({ timeEntries, setTimeEntries, projects, developers, setDevelopers, selectedDeveloper, reloadTimeEntries, reloadDevelopers }) => {
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false)
  const [deleteEntryId, setDeleteEntryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [newTimeEntry, setNewTimeEntry] = useState({
    projectId: '',
    developerId: '',
    description: '',
    hours: '',
    date: new Date().toLocaleDateString('pt-BR')
  })
  const [newDeveloper, setNewDeveloper] = useState({
    name: '',
    email: '',
    seniority: 'junior',
    hourlyRate: ''
  })

  // Filtrar lançamentos por desenvolvedor selecionado
  const filteredTimeEntries = selectedDeveloper 
    ? timeEntries.filter(entry => entry.developerId === selectedDeveloper.id)
    : timeEntries

  const handleCreateTimeEntry = async () => {
    if (!newTimeEntry.projectId || !newTimeEntry.developerId || !newTimeEntry.description || !newTimeEntry.hours || !newTimeEntry.date) {
      return
    }

    try {
      setLoading(true)
      const timeEntryData = {
        projectId: parseInt(newTimeEntry.projectId),
        developerId: parseInt(newTimeEntry.developerId),
        description: newTimeEntry.description,
        hours: parseFloat(newTimeEntry.hours),
        date: newTimeEntry.date
      }

      await timeEntriesAPI.create(timeEntryData)
      await reloadTimeEntries() // Recarregar dados do servidor
      
      setNewTimeEntry({
        projectId: '',
        developerId: '',
        description: '',
        hours: '',
        date: new Date().toLocaleDateString('pt-BR')
      })
      setIsTimeModalOpen(false)
    } catch (error) {
      console.error('Erro ao criar lançamento:', error)
      alert('Erro ao criar lançamento: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDeveloper = async () => {
    if (!newDeveloper.name || !newDeveloper.email || !newDeveloper.hourlyRate) {
      return
    }

    try {
      setLoading(true)
      const developerData = {
        name: newDeveloper.name,
        email: newDeveloper.email,
        seniority: newDeveloper.seniority,
        hourlyRate: parseFloat(newDeveloper.hourlyRate)
      }

      await developersAPI.create(developerData)
      await reloadDevelopers() // Recarregar dados do servidor
      
      setNewDeveloper({
        name: '',
        email: '',
        seniority: 'junior',
        hourlyRate: ''
      })
      setIsDeveloperModalOpen(false)
    } catch (error) {
      console.error('Erro ao criar desenvolvedor:', error)
      alert('Erro ao criar desenvolvedor: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEntry = async (entryId) => {
    try {
      setLoading(true)
      await timeEntriesAPI.delete(entryId)
      await reloadTimeEntries() // Recarregar dados do servidor
      setDeleteEntryId(null)
    } catch (error) {
      console.error('Erro ao deletar lançamento:', error)
      alert('Erro ao deletar lançamento: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDateInput = (value) => {
    // Remove tudo que não é número
    let cleaned = value.replace(/\D/g, '')
    
    // Aplica a máscara dd/MM/yyyy
    if (cleaned.length >= 2) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2)
    }
    if (cleaned.length >= 5) {
      cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9)
    }
    
    return cleaned
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Projeto não encontrado'
  }

  const getDeveloperName = (developerId) => {
    const developer = developers.find(d => d.id === developerId)
    return developer ? developer.name : 'Desenvolvedor não encontrado'
  }

  // Projetos em andamento (que têm horas restantes)
  const activeProjects = projects.filter(project => {
    const usedHours = timeEntries
      .filter(entry => entry.projectId === project.id)
      .reduce((sum, entry) => sum + entry.hours, 0)
    return usedHours < project.totalHours
  })

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <div className="flex items-center gap-4 mb-4">
          <Clock size={32} className="text-primary-600" />
          <div>
            <h1 className="page-title">Lançamentos de Horas</h1>
            <p className="page-subtitle">
              {selectedDeveloper 
                ? `Lançamentos de ${selectedDeveloper.name}` 
                : 'Todos os lançamentos do sistema'
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="btn btn-primary"
            onClick={() => setIsTimeModalOpen(true)}
          >
            <Plus size={16} />
            Lançar Hora
          </button>
        </div>
      </div>

      {/* Histórico de lançamentos */}
      <div className="page-section">
        <div className="section-header">
          <h2 className="section-title">Histórico de Lançamentos</h2>
        </div>
        <div className="section-content">
          {filteredTimeEntries.length > 0 ? (
            <div className="table-container-no-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Projeto</th>
                    <th>Desenvolvedor</th>
                    <th>Atividade</th>
                    <th>Horas</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTimeEntries
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(entry => (
                    <tr key={entry.id}>
                      <td style={{ fontWeight: '600' }}>
                        {entry.date}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                          {getProjectName(entry.projectId)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>
                          {getDeveloperName(entry.developerId)}
                        </div>
                      </td>
                      <td>
                        <div style={{ 
                          maxWidth: '300px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {entry.description}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-green">
                          {entry.hours}h
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="action-button delete"
                          onClick={() => setDeleteEntryId(entry.id)}
                          title="Excluir lançamento"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Clock className="empty-state-icon" />
              <h3 className="empty-state-title">
                {selectedDeveloper 
                  ? 'Nenhum lançamento encontrado para este desenvolvedor'
                  : 'Nenhum lançamento registrado'
                }
              </h3>
              <p className="empty-state-description">
                Comece registrando as horas trabalhadas nos projetos
              </p>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => setIsTimeModalOpen(true)}
              >
                <Plus size={16} />
                Fazer Primeiro Lançamento
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Lançar Hora */}
      {isTimeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container ultra-elegant-scroll">
            <div className="modal-header">
              <h2 className="modal-title">Lançar Hora</h2>
              <button 
                className="modal-close"
                onClick={() => setIsTimeModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Projeto</label>
                  <select
                    className="form-select"
                    value={newTimeEntry.projectId}
                    onChange={(e) => setNewTimeEntry(prev => ({ ...prev, projectId: e.target.value }))}
                  >
                    <option value="">Selecione um projeto</option>
                    {activeProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Desenvolvedor</label>
                  <select
                    className="form-select"
                    value={newTimeEntry.developerId}
                    onChange={(e) => setNewTimeEntry(prev => ({ ...prev, developerId: e.target.value }))}
                  >
                    <option value="">Selecione um desenvolvedor</option>
                    {developers.map(developer => (
                      <option key={developer.id} value={developer.id}>
                        {developer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição da Atividade</label>
                <textarea
                  className="form-textarea"
                  value={newTimeEntry.description}
                  onChange={(e) => setNewTimeEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva a atividade realizada"
                  rows={3}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Horas Trabalhadas</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.5"
                    value={newTimeEntry.hours}
                    onChange={(e) => setNewTimeEntry(prev => ({ ...prev, hours: e.target.value }))}
                    placeholder="Ex: 8"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data do Lançamento</label>
                  <input
                    className="form-input"
                    type="text"
                    value={newTimeEntry.date}
                    onChange={(e) => {
                      const formattedDate = formatDateInput(e.target.value)
                      setNewTimeEntry(prev => ({ ...prev, date: formattedDate }))
                    }}
                    placeholder="dd/MM/yyyy"
                    maxLength="10"
                  />
                  {newTimeEntry.date && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-500)', marginTop: '0.25rem' }}>
                      Data selecionada: {newTimeEntry.date}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsTimeModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateTimeEntry}
              >
                Lançar Hora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastrar Desenvolvedor */}
      {isDeveloperModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container ultra-elegant-scroll">
            <div className="modal-header">
              <h2 className="modal-title">Cadastrar Desenvolvedor</h2>
              <button 
                className="modal-close"
                onClick={() => setIsDeveloperModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  className="form-input"
                  value={newDeveloper.name}
                  onChange={(e) => setNewDeveloper(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  className="form-input"
                  type="email"
                  value={newDeveloper.email}
                  onChange={(e) => setNewDeveloper(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite o e-mail"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Senioridade</label>
                  <select
                    className="form-select"
                    value={newDeveloper.seniority}
                    onChange={(e) => setNewDeveloper(prev => ({ ...prev, seniority: e.target.value }))}
                  >
                    <option value="junior">Júnior</option>
                    <option value="pleno">Pleno</option>
                    <option value="senior">Sênior</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Valor por Hora (R$)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    value={newDeveloper.hourlyRate}
                    onChange={(e) => setNewDeveloper(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="Ex: 120.00"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsDeveloperModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateDeveloper}
              >
                Cadastrar Desenvolvedor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteEntryId && (
        <div className="modal-overlay">
          <div className="modal-container ultra-elegant-scroll" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Exclusão</h2>
              <button 
                className="modal-close"
                onClick={() => setDeleteEntryId(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Tem certeza que deseja excluir este lançamento?
                </p>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita. O lançamento será removido permanentemente.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setDeleteEntryId(null)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDeleteEntry(deleteEntryId)}
              >
                Excluir Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeEntries

