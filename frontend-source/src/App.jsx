import { useState, useEffect } from 'react'
import ModernLayout from './components/ModernLayout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import TimeEntries from './pages/TimeEntries'
import { projectsAPI, developersAPI, timeEntriesAPI } from './services/api'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedDeveloper, setSelectedDeveloper] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('Todos')
  
  // Estados dos dados
  const [projects, setProjects] = useState([])
  const [developers, setDevelopers] = useState([])
  const [timeEntries, setTimeEntries] = useState([])
  
  // Estados de loading e erro
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Carregar todos os dados em paralelo
        const [projectsData, developersData, timeEntriesData] = await Promise.all([
          projectsAPI.getAll(),
          developersAPI.getAll(),
          timeEntriesAPI.getAll()
        ])
        
        setProjects(projectsData)
        setDevelopers(developersData)
        setTimeEntries(timeEntriesData)
      } catch (err) {
        setError(err.message)
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Função para recarregar projetos
  const reloadProjects = async () => {
    try {
      const projectsData = await projectsAPI.getAll()
      setProjects(projectsData)
    } catch (err) {
      console.error('Erro ao recarregar projetos:', err)
    }
  }

  // Função para recarregar desenvolvedores
  const reloadDevelopers = async () => {
    try {
      const developersData = await developersAPI.getAll()
      setDevelopers(developersData)
    } catch (err) {
      console.error('Erro ao recarregar desenvolvedores:', err)
    }
  }

  // Função para recarregar lançamentos
  const reloadTimeEntries = async () => {
    try {
      const timeEntriesData = await timeEntriesAPI.getAll()
      setTimeEntries(timeEntriesData)
    } catch (err) {
      console.error('Erro ao recarregar lançamentos:', err)
    }
  }

  // Props comuns para todas as páginas
  const commonProps = {
    selectedDeveloper,
    projects,
    setProjects,
    developers,
    setDevelopers,
    timeEntries,
    setTimeEntries,
    reloadProjects,
    reloadDevelopers,
    reloadTimeEntries
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  // Mostrar erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'projects':
        return (
          <Projects 
            projects={projects}
            setProjects={setProjects}
            timeEntries={timeEntries}
            developers={developers}
            reloadProjects={reloadProjects}
          />
        )
      case 'timeEntries':
        return (
          <TimeEntries 
            timeEntries={timeEntries}
            setTimeEntries={setTimeEntries}
            projects={projects}
            developers={developers}
            setDevelopers={setDevelopers}
            reloadTimeEntries={reloadTimeEntries}
            reloadDevelopers={reloadDevelopers}
          />
        )
      default:
        return <Dashboard {...commonProps} />
    }
  }

  return (
    <ModernLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      developers={developers}
      setDevelopers={setDevelopers}
      selectedDeveloper={selectedDeveloper}
      setSelectedDeveloper={setSelectedDeveloper}
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      timeEntries={timeEntries}
    >
      {renderCurrentPage()}
    </ModernLayout>
  )
}

export default App

