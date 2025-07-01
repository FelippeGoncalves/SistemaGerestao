# Frontend - Sistema de Gestão de Projetos

Este diretório contém o código fonte do frontend React do Sistema de Gestão de Projetos.

## 🚀 Tecnologias Utilizadas

- **React 19.1.0** - Biblioteca principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **Radix UI** - Componentes de interface

## 📁 Estrutura do Projeto

```
frontend-source/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes de interface (Radix UI)
│   │   ├── Layout.jsx      # Layout básico
│   │   └── ModernLayout.jsx # Layout moderno principal
│   ├── pages/              # Páginas da aplicação
│   │   ├── Dashboard.jsx   # Dashboard com métricas
│   │   ├── Projects.jsx    # Gestão de projetos
│   │   └── TimeEntries.jsx # Lançamentos de tempo
│   ├── services/           # Serviços e APIs
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitários
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Ponto de entrada
│   ├── App.css             # Estilos globais
│   └── index.css           # Estilos base e Tailwind
├── public/                 # Arquivos estáticos
├── package.json            # Dependências e scripts
└── vite.config.js          # Configuração do Vite
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 20.x ou superior
- npm ou pnpm

### Instalação

```bash
# Instalar dependências
npm install
# ou
pnpm install
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 🎨 Funcionalidades

### Dashboard
- Métricas gerais dos projetos
- Gráficos de progresso
- Distribuição de horas por desenvolvedor
- Estatísticas em tempo real

### Gestão de Projetos
- CRUD completo de projetos
- Visualização de progresso
- Modal de detalhes com informações completas
- Edição inline de projetos

### Lançamentos de Tempo
- Registro de horas trabalhadas
- Filtros por projeto e desenvolvedor
- Histórico completo de lançamentos

### Gestão de Desenvolvedores
- CRUD de desenvolvedores
- Modal de gerenciamento
- Informações de contato e especialidades

## 🎯 Componentes Principais

### ModernLayout.jsx
Layout principal da aplicação com:
- Header responsivo
- Navegação por tabs
- Seletor de desenvolvedor
- Design moderno e acessível

### Dashboard.jsx
- Cards de estatísticas
- Gráficos interativos (Recharts)
- Filtros dinâmicos
- Responsivo para mobile

### Projects.jsx
- Lista de projetos com paginação
- Modal de detalhes avançado
- Edição inline
- Visualização de progresso

### TimeEntries.jsx
- Formulário de lançamento
- Tabela de histórico
- Filtros avançados
- Validações de formulário

## 🎨 Design System

### Cores
- Primária: Azul (#0ea5e9)
- Secundária: Cinza (#71717a)
- Sucesso: Verde (#22c55e)
- Aviso: Amarelo (#f59e0b)
- Erro: Vermelho (#ef4444)

### Componentes UI
Baseados no Radix UI com customizações:
- Buttons, Cards, Modals
- Forms, Inputs, Selects
- Tables, Badges, Progress
- Tooltips, Dropdowns

## 📱 Responsividade

O frontend é totalmente responsivo com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔗 Integração com Backend

O frontend se comunica com o backend Flask através de:
- API REST em `/api/*`
- Fetch API para requisições
- Tratamento de erros
- Estados de loading

## 🚀 Build e Deploy

O build é automaticamente copiado para a pasta `static/` do backend Flask durante o processo de deploy.

```bash
# Build
npm run build

# Os arquivos são gerados em dist/ e copiados para ../sistema-gestao-backend/static/
```

## 📝 Notas de Desenvolvimento

- Utiliza CSS custom properties para temas
- Componentes funcionais com hooks
- Estado local com useState
- Comunicação com API via fetch
- Validação de formulários
- Tratamento de erros
- Loading states
- Feedback visual para usuário

