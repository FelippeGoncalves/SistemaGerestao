import { TrendingUp, Clock, DollarSign, FolderOpen, Users, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'

const Dashboard = ({ selectedDeveloper, projects, developers, timeEntries }) => {
  // Calcular estatísticas
  const calculateStats = () => {
    let filteredEntries = timeEntries
    let filteredProjects = projects

    if (selectedDeveloper) {
      filteredEntries = timeEntries.filter(entry => entry.developerId === selectedDeveloper.id)
      // Projetos que têm lançamentos do desenvolvedor selecionado
      const projectIds = [...new Set(filteredEntries.map(entry => entry.projectId))]
      filteredProjects = projects.filter(project => projectIds.includes(project.id))
    }

    const totalProjects = filteredProjects.length
    const totalHours = filteredProjects.reduce((sum, project) => sum + project.totalHours, 0)
    const usedHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const remainingHours = totalHours - usedHours

    return {
      totalProjects,
      totalHours,
      usedHours,
      remainingHours
    }
  }

  // Preparar dados para gráficos
  const prepareChartData = () => {
    let filteredEntries = timeEntries
    let filteredProjects = projects

    if (selectedDeveloper) {
      filteredEntries = timeEntries.filter(entry => entry.developerId === selectedDeveloper.id)
      const projectIds = [...new Set(filteredEntries.map(entry => entry.projectId))]
      filteredProjects = projects.filter(project => projectIds.includes(project.id))
    }

    // Dados para gráfico de barras (progresso dos projetos)
    const projectsData = filteredProjects.map(project => {
      const projectEntries = filteredEntries.filter(entry => entry.projectId === project.id)
      const usedHours = projectEntries.reduce((sum, entry) => sum + entry.hours, 0)
      const progress = (usedHours / project.totalHours) * 100

      return {
        name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
        totalHours: project.totalHours,
        usedHours: usedHours,
        remainingHours: project.totalHours - usedHours,
        progress: Math.round(progress)
      }
    })

    // Dados para gráfico de pizza (distribuição de horas por desenvolvedor)
    const developersData = developers.map(developer => {
      const devEntries = filteredEntries.filter(entry => entry.developerId === developer.id)
      const hours = devEntries.reduce((sum, entry) => sum + entry.hours, 0)
      
      return {
        name: developer.name,
        hours: hours,
        value: hours
      }
    }).filter(dev => dev.hours > 0)

    // Dados para gráfico de linha (horas por dia)
    const dailyData = {}
    filteredEntries.forEach(entry => {
      const date = entry.date
      if (!dailyData[date]) {
        dailyData[date] = 0
      }
      dailyData[date] += entry.hours
    })

    const lineData = Object.entries(dailyData)
      .sort(([a], [b]) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')))
      .map(([date, hours]) => ({
        date: date,
        hours: hours
      }))

    return { projectsData, developersData, lineData }
  }

  const stats = calculateStats()
  const { projectsData, developersData, lineData } = prepareChartData()

  // Cores para os gráficos
  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}{entry.name.includes('Horas') ? 'h' : ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">
          {selectedDeveloper ? `Dashboard - ${selectedDeveloper.name}` : 'Dashboard Geral'}
        </h1>
        <p className="page-subtitle">
          Visão geral dos projetos e métricas de desenvolvimento
        </p>
      </div>

      {/* Grid de estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total de Projetos</h3>
            <p>{stats.totalProjects}</p>
            <span>Projetos cadastrados</span>
          </div>
          <div className="stat-icon blue">
            <FolderOpen size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Horas Totais</h3>
            <p>{stats.totalHours}h</p>
            <span>Horas planejadas</span>
          </div>
          <div className="stat-icon purple">
            <Clock size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Horas Utilizadas</h3>
            <p>{stats.usedHours}h</p>
            <span>Horas trabalhadas</span>
          </div>
          <div className="stat-icon green">
            <TrendingUp size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Horas Restantes</h3>
            <p>{stats.remainingHours}h</p>
            <span>Horas disponíveis</span>
          </div>
          <div className="stat-icon yellow">
            <Clock size={28} />
          </div>
        </div>
      </div>

      {/* Seção de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        {/* Gráfico de pizza - Distribuição de horas por desenvolvedor */}
        <div className="page-section">
          <div className="section-header">
            <h2 className="section-title">
              <Users size={20} className="inline mr-2" />
              Distribuição de Horas
            </h2>
          </div>
          <div className="section-content">
            {developersData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={developersData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}h`}
                    labelLine={false}
                  >
                    {developersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <Users className="empty-state-icon" />
                <h3 className="empty-state-title">Nenhum lançamento encontrado</h3>
                <p className="empty-state-description">
                  Adicione lançamentos de horas para visualizar a distribuição
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gráfico de linha - Horas por dia */}
      {lineData.length > 0 && (
        <div className="page-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={20} className="inline mr-2" />
              Evolução de Horas por Dia
            </h2>
          </div>
          <div className="section-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                  name="Horas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Resumo de performance */}
      {selectedDeveloper && (
        <div className="page-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={20} className="inline mr-2" />
              Performance do Desenvolvedor
            </h2>
          </div>
          <div className="section-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.usedHours}h</div>
                <div className="text-sm font-medium text-blue-700">Total de Horas</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalProjects}</div>
                <div className="text-sm font-medium text-green-700">Projetos Ativos</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

