import { useState, useRef, useEffect } from 'react'
import { BarChart3, Users, Clock, ChevronDown, Calendar, X, Edit, Trash2, FolderOpen, UserPlus } from 'lucide-react'
import { developersAPI } from '../services/api'

export default function ModernLayout({ 
  currentPage, 
  setCurrentPage, 
  children, 
  developers, 
  setDevelopers,
  selectedDeveloper, 
  setSelectedDeveloper,
  selectedPeriod,
  setSelectedPeriod,
  timeEntries 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false)
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false)
  const [isCreateDeveloperModalOpen, setIsCreateDeveloperModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteDeveloperId, setDeleteDeveloperId] = useState(null)
  const [editDeveloper, setEditDeveloper] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const [periodDropdownPosition, setPeriodDropdownPosition] = useState({ top: 0, right: 0 })
  
  const developerButtonRef = useRef(null)
  const periodButtonRef = useRef(null)
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    seniority: 'junior',
    hourlyRate: ''
  })

  const [newDeveloperForm, setNewDeveloperForm] = useState({
    name: '',
    email: '',
    seniority: 'junior',
    hourlyRate: ''
  })

  const calculateDropdownPosition = (buttonRef) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      }
    }
    return { top: 0, right: 0 }
  }

  const handleDeveloperDropdownToggle = () => {
    if (!isDropdownOpen) {
      const position = calculateDropdownPosition(developerButtonRef)
      setDropdownPosition(position)
    }
    setIsDropdownOpen(!isDropdownOpen)
    setIsPeriodDropdownOpen(false)
  }

  const handlePeriodDropdownToggle = () => {
    if (!isPeriodDropdownOpen) {
      const position = calculateDropdownPosition(periodButtonRef)
      setPeriodDropdownPosition(position)
    }
    setIsPeriodDropdownOpen(!isPeriodDropdownOpen)
    setIsDropdownOpen(false)
  }

  const handleDeveloperSelect = (developer) => {
    setSelectedDeveloper(developer)
    setIsDropdownOpen(false)
  }

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period)
    setIsPeriodDropdownOpen(false)
  }

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar se o clique foi em um dropdown item
      if (event.target.closest('.dropdown-menu')) {
        return
      }
      
      if (developerButtonRef.current && !developerButtonRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (periodButtonRef.current && !periodButtonRef.current.contains(event.target)) {
        setIsPeriodDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const generatePeriodOptions = () => {
    const periods = new Set()
    timeEntries.forEach(entry => {
      const date = new Date(entry.createdAt)
      const monthYear = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
      periods.add(monthYear)
    })
    return ['Todos', ...Array.from(periods).sort().reverse()]
  }

  const handleEditDeveloper = (developer) => {
    setEditDeveloper(developer)
    setEditForm({
      name: developer.name,
      email: developer.email,
      seniority: developer.seniority,
      hourlyRate: developer.hourlyRate.toString()
    })
    setIsEditModalOpen(true)
    setIsDeveloperModalOpen(false)
  }

  const handleSaveEdit = async () => {
    if (!editForm.name || !editForm.email || !editForm.hourlyRate) {
      return
    }

    try {
      const updatedData = {
        name: editForm.name,
        email: editForm.email,
        seniority: editForm.seniority,
        hourlyRate: parseFloat(editForm.hourlyRate)
      }

      await developersAPI.update(editDeveloper.id, updatedData)
      
      // Recarregar dados do servidor
      const updatedDevelopers = await developersAPI.getAll()
      setDevelopers(updatedDevelopers)
      
      // Atualizar o desenvolvedor selecionado se for o mesmo que está sendo editado
      if (selectedDeveloper?.id === editDeveloper?.id) {
        const updatedDeveloper = updatedDevelopers.find(dev => dev.id === editDeveloper.id)
        setSelectedDeveloper(updatedDeveloper)
      }
      
      setIsEditModalOpen(false)
      setEditDeveloper(null)
    } catch (error) {
      console.error('Erro ao atualizar desenvolvedor:', error)
      alert('Erro ao atualizar desenvolvedor: ' + error.message)
    }
  }

  const handleDeleteDeveloper = async (developerId) => {
    try {
      await developersAPI.delete(developerId)
      
      // Recarregar dados do servidor
      const updatedDevelopers = await developersAPI.getAll()
      setDevelopers(updatedDevelopers)
      
      setDeleteDeveloperId(null)
      setIsDeveloperModalOpen(false)
      
      if (selectedDeveloper?.id === developerId) {
        setSelectedDeveloper(null)
      }
    } catch (error) {
      console.error('Erro ao deletar desenvolvedor:', error)
      alert('Erro ao deletar desenvolvedor: ' + error.message)
    }
  }

  const handleCreateDeveloper = async () => {
    if (!newDeveloperForm.name || !newDeveloperForm.email || !newDeveloperForm.hourlyRate) {
      return
    }

    try {
      const developerData = {
        name: newDeveloperForm.name,
        email: newDeveloperForm.email,
        seniority: newDeveloperForm.seniority,
        hourlyRate: parseFloat(newDeveloperForm.hourlyRate)
      }

      await developersAPI.create(developerData)
      
      // Recarregar dados do servidor
      const updatedDevelopers = await developersAPI.getAll()
      setDevelopers(updatedDevelopers)
      
      setNewDeveloperForm({
        name: '',
        email: '',
        seniority: 'junior',
        hourlyRate: ''
      })
      setIsCreateDeveloperModalOpen(false)
    } catch (error) {
      console.error('Erro ao criar desenvolvedor:', error)
      alert('Erro ao criar desenvolvedor: ' + error.message)
    }
  }

  const getTotalHours = () => {
    return timeEntries
      .filter(entry => !selectedDeveloper || entry.developerId === selectedDeveloper.id)
      .reduce((sum, entry) => sum + entry.hours, 0)
  }

  const getSeniorityBadge = (seniority) => {
    const badges = {
      junior: { color: 'badge-blue', text: 'Júnior' },
      pleno: { color: 'badge-orange', text: 'Pleno' },
      senior: { color: 'badge-green', text: 'Sênior' }
    }
    const badge = badges[seniority] || badges.junior
    return (
      <span className={`badge ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  const periodOptions = generatePeriodOptions()

  return (
    <div className="app-container">
      <div className="app-layout">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="header-title">Sistema de Gestão de Projetos</h1>
            </div>
            <div className="header-right">
              <button 
                className="stats-item"
                onClick={() => setIsDeveloperModalOpen(true)}
              >
                <Users size={16} />
                <span>{developers.length} Desenvolvedores</span>
              </button>
              
              <div className="developer-selector">
                <button 
                  ref={developerButtonRef}
                  className="stats-item"
                  onClick={handleDeveloperDropdownToggle}
                >
                  <Clock size={16} />
                  <span>
                    {selectedDeveloper ? selectedDeveloper.name : 'Visão Geral'}
                  </span>
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="period-selector">
                <button 
                  ref={periodButtonRef}
                  className="stats-item"
                  onClick={handlePeriodDropdownToggle}
                >
                  <Calendar size={16} />
                  <span>{selectedPeriod}</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <nav className="tab-navigation">
          <button 
            className={`tab ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <BarChart3 size={16} />
            Dashboard
          </button>
          <button 
            className={`tab ${currentPage === 'projects' ? 'active' : ''}`}
            onClick={() => setCurrentPage('projects')}
          >
            <FolderOpen size={16} />
            Projetos
          </button>
          <button 
            className={`tab ${currentPage === 'timeEntries' ? 'active' : ''}`}
            onClick={() => setCurrentPage('timeEntries')}
          >
            <Clock size={16} />
            Lançamentos
          </button>
        </nav>

        <main className="main-content">
          {children}
        </main>
      </div>

      {/* Dropdown de Desenvolvedores */}
      {isDropdownOpen && (
        <div 
          className="dropdown-menu"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <button 
            className="dropdown-item"
            onClick={() => handleDeveloperSelect(null)}
          >
            Visão Geral
          </button>
          {developers.map(developer => (
            <button 
              key={developer.id}
              className="dropdown-item"
              onClick={() => handleDeveloperSelect(developer)}
            >
              {developer.name}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown de Período */}
      {isPeriodDropdownOpen && (
        <div 
          className="dropdown-menu"
          style={{
            top: `${periodDropdownPosition.top}px`,
            right: `${periodDropdownPosition.right}px`
          }}
        >
          {periodOptions.map(period => (
            <button 
              key={period}
              className="dropdown-item"
              onClick={() => handlePeriodSelect(period)}
            >
              {period}
            </button>
          ))}
        </div>
      )}

      {/* Modal de Gerenciamento de Desenvolvedores */}
      {isDeveloperModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container ultra-elegant-scroll" style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Gerenciar Desenvolvedores</h2>
              <button 
                className="modal-close"
                onClick={() => setIsDeveloperModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="table-container-no-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Senioridade</th>
                      <th>Valor/Hora</th>
                      <th>Horas Trabalhadas</th>
                      <th style={{ textAlign: 'center' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {developers.map(developer => {
                      const workedHours = timeEntries
                        .filter(entry => entry.developerId === developer.id)
                        .reduce((sum, entry) => sum + entry.hours, 0)
                      
                      return (
                        <tr key={developer.id}>
                          <td style={{ fontWeight: '600' }}>{developer.name}</td>
                          <td>{developer.email}</td>
                          <td>{getSeniorityBadge(developer.seniority)}</td>
                          <td style={{ fontWeight: '600' }}>R$ {developer.hourlyRate.toFixed(2)}</td>
                          <td style={{ textAlign: 'center', fontWeight: '600' }}>{workedHours}h</td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="action-buttons">
                              <button
                                className="action-button edit"
                                onClick={() => handleEditDeveloper(developer)}
                                title="Editar desenvolvedor"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="action-button delete"
                                onClick={() => setDeleteDeveloperId(developer.id)}
                                title="Excluir desenvolvedor"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Botão para cadastrar novo desenvolvedor */}
              <div className="modal-footer" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--secondary-200)' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setIsDeveloperModalOpen(false)
                    setIsCreateDeveloperModalOpen(true)
                  }}
                  style={{ width: '100%' }}
                >
                  <UserPlus size={16} />
                  Cadastrar Novo Desenvolvedor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Desenvolvedor */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container ultra-elegant-scroll">
            <div className="modal-header">
              <h2 className="modal-title">Editar Desenvolvedor</h2>
              <button 
                className="modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  className="form-input"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite o e-mail"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Senioridade</label>
                  <select
                    className="form-select"
                    value={editForm.seniority}
                    onChange={(e) => setEditForm(prev => ({ ...prev, seniority: e.target.value }))}
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
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="Ex: 120.00"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveEdit}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteDeveloperId && (
        <div className="modal-overlay">
          <div className="modal-container ultra-elegant-scroll" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Exclusão</h2>
              <button 
                className="modal-close"
                onClick={() => setDeleteDeveloperId(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Tem certeza que deseja excluir este desenvolvedor?
                </p>
                <p className="text-sm text-gray-600">
                  Todos os lançamentos relacionados a este desenvolvedor serão mantidos, 
                  mas não será possível criar novos lançamentos para ele.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setDeleteDeveloperId(null)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDeleteDeveloper(deleteDeveloperId)}
              >
                Excluir Desenvolvedor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastrar Desenvolvedor */}
      {isCreateDeveloperModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container ultra-elegant-scroll">
            <div className="modal-header">
              <h2 className="modal-title">Cadastrar Desenvolvedor</h2>
              <button 
                className="modal-close"
                onClick={() => setIsCreateDeveloperModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  className="form-input"
                  value={newDeveloperForm.name}
                  onChange={(e) => setNewDeveloperForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  className="form-input"
                  type="email"
                  value={newDeveloperForm.email}
                  onChange={(e) => setNewDeveloperForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite o e-mail"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Senioridade</label>
                  <select
                    className="form-select"
                    value={newDeveloperForm.seniority}
                    onChange={(e) => setNewDeveloperForm(prev => ({ ...prev, seniority: e.target.value }))}
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
                    value={newDeveloperForm.hourlyRate}
                    onChange={(e) => setNewDeveloperForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="Ex: 120.00"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsCreateDeveloperModalOpen(false)}
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
    </div>
  )
}

