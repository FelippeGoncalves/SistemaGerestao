import { useState } from 'react'
import { Plus, Trash2, FolderOpen, Calendar, DollarSign, Clock, TrendingUp, X, AlertTriangle, Edit, Save, Eye } from 'lucide-react'
import { projectsAPI } from '../services/api'

const Projects = ({ projects, setProjects, timeEntries, developers, reloadProjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showTimeEntries, setShowTimeEntries] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [deleteProjectId, setDeleteProjectId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    totalHours: '',
    description: '',
    cell: '',
    client: '',
    service: ''
  })
  const [newProject, setNewProject] = useState({
    name: '',
    totalHours: '',
    description: '',
    cell: '',
    client: '',
    service: ''
  })

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.totalHours || !newProject.description || 
        !newProject.cell || !newProject.client || !newProject.service) {
      return
    }

    try {
      setLoading(true)
      const projectData = {
        name: newProject.name,
        totalHours: parseInt(newProject.totalHours),
        description: newProject.description,
        cell: parseInt(newProject.cell),
        client: parseInt(newProject.client),
        service: parseInt(newProject.service)
      }

      await projectsAPI.create(projectData)
      await reloadProjects() // Recarregar dados do servidor
      
      setNewProject({ 
        name: '', 
        totalHours: '', 
        description: '',
        cell: '',
        client: '',
        service: ''
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      alert('Erro ao criar projeto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      setLoading(true)
      await projectsAPI.delete(projectId)
      await reloadProjects() // Recarregar dados do servidor
      setDeleteProjectId(null)
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
      alert('Erro ao deletar projeto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenProjectDetails = (project) => {
    setSelectedProject(project)
    setEditForm({
      name: project.name,
      totalHours: project.totalHours.toString(),
      description: project.description,
      cell: project.cell.toString(),
      client: project.client.toString(),
      service: project.service.toString()
    })
    setIsEditMode(false)
    setShowTimeEntries(false)
    setIsDetailModalOpen(true)
  }

  const handleEditProject = () => {
    setIsEditMode(true)
  }

  const handleSaveProject = async () => {
    if (!editForm.name || !editForm.totalHours || !editForm.description || 
        !editForm.cell || !editForm.client || !editForm.service) {
      return
    }

    try {
      setLoading(true)
      const projectData = {
        name: editForm.name,
        totalHours: parseInt(editForm.totalHours),
        description: editForm.description,
        cell: parseInt(editForm.cell),
        client: parseInt(editForm.client),
        service: parseInt(editForm.service)
      }

      await projectsAPI.update(selectedProject.id, projectData)
      await reloadProjects() // Recarregar dados do servidor
      
      // Atualizar projeto selecionado
      const updatedProject = { ...selectedProject, ...projectData }
      setSelectedProject(updatedProject)
      setIsEditMode(false)
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      alert('Erro ao atualizar projeto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: selectedProject.name,
      totalHours: selectedProject.totalHours.toString(),
      description: selectedProject.description,
      cell: selectedProject.cell.toString(),
      client: selectedProject.client.toString(),
      service: selectedProject.service.toString()
    })
    setIsEditMode(false)
  }

  const getProjectDevelopers = (project) => {
    const projectEntries = timeEntries.filter(entry => entry.projectId === project.id)
    const developerHours = {}
    
    projectEntries.forEach(entry => {
      if (!developerHours[entry.developerId]) {
        developerHours[entry.developerId] = 0
      }
      developerHours[entry.developerId] += entry.hours
    })

    return Object.entries(developerHours).map(([developerId, hours]) => {
      const developer = developers.find(dev => dev.id === parseInt(developerId))
      return {
        developer: developer || { name: 'Desenvolvedor não encontrado' },
        hours
      }
    }).sort((a, b) => b.hours - a.hours)
  }

  const getProjectTimeEntries = (project) => {
    return timeEntries
      .filter(entry => entry.projectId === project.id)
      .map(entry => {
        const developer = developers.find(dev => dev.id === entry.developerId)
        return {
          ...entry,
          developerName: developer ? developer.name : 'Desenvolvedor não encontrado'
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const getProjectStats = (project) => {
    const projectEntries = timeEntries.filter(entry => entry.projectId === project.id)
    const usedHours = projectEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const remainingHours = project.totalHours - usedHours
    const progress = project.totalHours > 0 ? (usedHours / project.totalHours) * 100 : 0
    
    let status = 'Em Andamento'
    if (progress === 0) status = 'Não Iniciado'
    else if (progress >= 100) status = 'Concluído'
    else if (progress >= 80) status = 'Quase Concluído'

    return {
      usedHours,
      remainingHours,
      progress: Math.round(progress),
      status
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Não Iniciado': 'badge-gray',
      'Em Andamento': 'badge-blue',
      'Quase Concluído': 'badge-orange',
      'Concluído': 'badge-green'
    }
    return <span className={`badge ${statusConfig[status]}`}>{status}</span>
  }

  const calculateTotalStats = () => {
    const totalProjects = projects.length
    const totalHours = projects.reduce((sum, project) => sum + project.totalHours, 0)
    const inProgress = projects.filter(project => {
      const stats = getProjectStats(project)
      return stats.status === 'Em Andamento' || stats.status === 'Quase Concluído'
    }).length
    const completed = projects.filter(project => {
      const stats = getProjectStats(project)
      return stats.status === 'Concluído'
    }).length

    return { totalProjects, totalHours, inProgress, completed }
  }

  const totalStats = calculateTotalStats()

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="page-title">Projetos</h1>
            <p className="page-subtitle">Gerencie seus projetos e acompanhe o progresso</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Grid de estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total de Projetos</h3>
            <p>{totalStats.totalProjects}</p>
            <span>Projetos cadastrados</span>
          </div>
          <div className="stat-icon blue">
            <FolderOpen size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Horas Totais</h3>
            <p>{totalStats.totalHours}h</p>
            <span>Horas planejadas</span>
          </div>
          <div className="stat-icon purple">
            <Clock size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Em Andamento</h3>
            <p>{totalStats.inProgress}</p>
            <span>Projetos ativos</span>
          </div>
          <div className="stat-icon green">
            <TrendingUp size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Concluídos</h3>
            <p>{totalStats.completed}</p>
            <span>Projetos finalizados</span>
          </div>
          <div className="stat-icon orange">
            <FolderOpen size={28} />
          </div>
        </div>
      </div>

      {/* Lista de projetos */}
      <div className="page-section">
        <div className="section-header">
          <h2 className="section-title">Lista de Projetos</h2>
        </div>
        <div className="section-content">
          {projects.length > 0 ? (
            <div className="table-container-no-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Progresso</th>
                    <th>Horas Disponíveis</th>
                    <th>Criado em</th>
                    <th>Valor Gasto</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => {
                    const stats = getProjectStats(project)
                    const projectEntries = timeEntries.filter(entry => entry.projectId === project.id)
                    const valueSpent = projectEntries.reduce((sum, entry) => {
                      // Assumindo valor médio de R$ 80/hora para cálculo
                      return sum + (entry.hours * 80)
                    }, 0)

                    return (
                      <tr key={project.id}>
                        <td>
                          <div 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOpenProjectDetails(project)}
                          >
                            <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--primary-600)' }}>
                              {project.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary-500)' }}>
                              Célula: {project.cell} | Cliente: {project.client} | Serviço: {project.service}
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(stats.status)}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="progress" style={{ width: '80px' }}>
                              <div 
                                className="progress-bar" 
                                style={{ width: `${stats.progress}%` }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                              {stats.progress}%
                            </span>
                          </div>
                        </td>
                        <td style={{ fontWeight: '600' }}>
                          {stats.usedHours}h / {project.totalHours}h
                        </td>
                        <td>
                          {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ fontWeight: '600', color: 'var(--success-600)' }}>
                          R$ {valueSpent.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="action-button delete"
                            onClick={() => setDeleteProjectId(project.id)}
                            title="Excluir projeto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FolderOpen className="empty-state-icon" />
              <h3 className="empty-state-title">Nenhum projeto cadastrado</h3>
              <p className="empty-state-description">
                Comece criando seu primeiro projeto para gerenciar o desenvolvimento
              </p>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                Criar Primeiro Projeto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Novo Projeto */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Novo Projeto</h2>
              <button 
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nome do Projeto</label>
                <input
                  className="form-input"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome do projeto"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Total de Horas</label>
                  <input
                    className="form-input"
                    type="number"
                    value={newProject.totalHours}
                    onChange={(e) => setNewProject(prev => ({ ...prev, totalHours: e.target.value }))}
                    placeholder="Ex: 120"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Célula</label>
                  <input
                    className="form-input"
                    type="number"
                    value={newProject.cell}
                    onChange={(e) => setNewProject(prev => ({ ...prev, cell: e.target.value }))}
                    placeholder="Ex: 101"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cliente</label>
                  <input
                    className="form-input"
                    type="number"
                    value={newProject.client}
                    onChange={(e) => setNewProject(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="Ex: 1001"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Serviço</label>
                  <input
                    className="form-input"
                    type="number"
                    value={newProject.service}
                    onChange={(e) => setNewProject(prev => ({ ...prev, service: e.target.value }))}
                    placeholder="Ex: 2001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-textarea"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o projeto e seus objetivos"
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateProject}
              >
                Criar Projeto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Projeto */}
      {isDetailModalOpen && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-container-no-external-scroll" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditMode ? 'Editar Projeto' : 'Detalhes do Projeto'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setIsDetailModalOpen(false)
                  setIsEditMode(false)
                  setShowTimeEntries(false)
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body modal-body-internal-scroll">
              {/* Informações do Projeto */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Nome do Projeto</label>
                  {isEditMode ? (
                    <input
                      className="form-input"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <div className="form-display">{selectedProject.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Horas Parametrizadas</label>
                  {isEditMode ? (
                    <input
                      className="form-input"
                      type="number"
                      value={editForm.totalHours}
                      onChange={(e) => setEditForm(prev => ({ ...prev, totalHours: e.target.value }))}
                    />
                  ) : (
                    <div className="form-display">{selectedProject.totalHours}h</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Célula</label>
                  {isEditMode ? (
                    <input
                      className="form-input"
                      type="number"
                      value={editForm.cell}
                      onChange={(e) => setEditForm(prev => ({ ...prev, cell: e.target.value }))}
                    />
                  ) : (
                    <div className="form-display">{selectedProject.cell}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Cliente</label>
                  {isEditMode ? (
                    <input
                      className="form-input"
                      type="number"
                      value={editForm.client}
                      onChange={(e) => setEditForm(prev => ({ ...prev, client: e.target.value }))}
                    />
                  ) : (
                    <div className="form-display">{selectedProject.client}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Serviço</label>
                  {isEditMode ? (
                    <input
                      className="form-input"
                      type="number"
                      value={editForm.service}
                      onChange={(e) => setEditForm(prev => ({ ...prev, service: e.target.value }))}
                    />
                  ) : (
                    <div className="form-display">{selectedProject.service}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Progresso Total</label>
                  <div className="form-display">
                    {(() => {
                      const stats = getProjectStats(selectedProject)
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress" style={{ width: '120px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ width: `${stats.progress}%` }}
                            ></div>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                            {stats.progress}% ({stats.usedHours}h / {selectedProject.totalHours}h)
                          </span>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Descrição</label>
                {isEditMode ? (
                  <textarea
                    className="form-input"
                    rows="3"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                ) : (
                  <div className="form-display">{selectedProject.description}</div>
                )}
              </div>

              {/* Desenvolvedores que trabalharam no projeto */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Desenvolvedores e Horas Trabalhadas
                </h3>
                {(() => {
                  const projectDevelopers = getProjectDevelopers(selectedProject)
                  return projectDevelopers.length > 0 ? (
                    <div className="table-container-with-scroll">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Desenvolvedor</th>
                            <th>Horas Trabalhadas</th>
                            <th>Percentual do Projeto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectDevelopers.map((item, index) => (
                            <tr key={index}>
                              <td>{item.developer.name}</td>
                              <td>{item.hours}h</td>
                              <td>
                                {selectedProject.totalHours > 0 
                                  ? Math.round((item.hours / selectedProject.totalHours) * 100)
                                  : 0
                                }%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '2rem', 
                      color: 'var(--secondary-500)',
                      backgroundColor: 'var(--secondary-50)',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      Nenhum lançamento registrado para este projeto
                    </div>
                  )
                })()}
              </div>

              {/* Botão para exibir lançamentos */}
              <div style={{ marginBottom: '1rem' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowTimeEntries(!showTimeEntries)}
                  style={{ width: '100%' }}
                >
                  <Eye size={16} />
                  {showTimeEntries ? 'Ocultar Lançamentos' : 'Exibir Todos os Lançamentos'}
                </button>
              </div>

              {/* Lista de lançamentos */}
              {showTimeEntries && (
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Histórico de Lançamentos
                  </h3>
                  {(() => {
                    const projectTimeEntries = getProjectTimeEntries(selectedProject)
                    return projectTimeEntries.length > 0 ? (
                      <div className="table-container-with-scroll">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Desenvolvedor</th>
                              <th>Horas</th>
                              <th>Descrição</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectTimeEntries.map((entry) => (
                              <tr key={entry.id}>
                                <td>{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                                <td>{entry.developerName}</td>
                                <td>{entry.hours}h</td>
                                <td>{entry.description || 'Sem descrição'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem', 
                        color: 'var(--secondary-500)',
                        backgroundColor: 'var(--secondary-50)',
                        borderRadius: 'var(--radius-lg)'
                      }}>
                        Nenhum lançamento registrado para este projeto
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
            <div className="modal-footer">
              {isEditMode ? (
                <>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSaveProject}
                    disabled={loading}
                  >
                    <Save size={16} />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <button 
                  className="btn btn-primary" 
                  onClick={handleEditProject}
                >
                  <Edit size={16} />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteProjectId && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Exclusão</h2>
              <button 
                className="modal-close"
                onClick={() => setDeleteProjectId(null)}
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
                  Tem certeza que deseja excluir este projeto?
                </p>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita. Todos os lançamentos relacionados 
                  a este projeto também serão removidos.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setDeleteProjectId(null)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDeleteProject(deleteProjectId)}
              >
                Excluir Projeto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects

