import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, BarChart3, FolderOpen, Timer } from 'lucide-react'

const Layout = ({ 
  children, 
  currentPage, 
  setCurrentPage, 
  developers, 
  timeEntries, 
  selectedDeveloper, 
  setSelectedDeveloper 
}) => {
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'timeEntries', label: 'Lançamentos', icon: Timer }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-primary">
                Sistema de Gestão de Projetos
              </h1>
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? 'default' : 'ghost'}
                      onClick={() => setCurrentPage(item.id)}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  )
                })}
              </nav>
            </div>

            {/* Right side - Developer counter and hour selector */}
            <div className="flex items-center space-x-4">
              {/* Developer counter */}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary">
                  {developers.length} desenvolvedores
                </Badge>
              </div>

              {/* Hours counter with developer selector */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Select 
                  value={selectedDeveloper ? selectedDeveloper.id.toString() : 'all'} 
                  onValueChange={(value) => {
                    if (value === 'all') {
                      setSelectedDeveloper(null)
                    } else {
                      const developer = developers.find(d => d.id === parseInt(value))
                      setSelectedDeveloper(developer)
                    }
                  }}
                >
                  <SelectTrigger className="w-auto min-w-[120px]">
                    <SelectValue>
                      <div className="flex items-center space-x-1">
                        <span>{totalHours}h</span>
                        {selectedDeveloper && (
                          <span className="text-xs text-muted-foreground">
                            ({selectedDeveloper.name})
                          </span>
                        )}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex flex-col">
                        <span>Todos os desenvolvedores</span>
                        <span className="text-xs text-muted-foreground">
                          {totalHours}h totais
                        </span>
                      </div>
                    </SelectItem>
                    {developers.map((developer) => {
                      const developerHours = timeEntries
                        .filter(entry => entry.developerId === developer.id)
                        .reduce((sum, entry) => sum + entry.hours, 0)
                      
                      return (
                        <SelectItem key={developer.id} value={developer.id.toString()}>
                          <div className="flex flex-col">
                            <span>{developer.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {developerHours}h • {developer.seniority}
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden mt-4 flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage(item.id)}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default Layout

