# Instruções de Uso - Sistema de Gestão de Projetos

## 🎯 Primeiros Passos

### 1. Executando o Sistema
```bash
# No terminal, navegue até a pasta do projeto
cd sistema-gestao-projetos

# Execute o comando para iniciar o sistema
pnpm run dev --host

# O sistema estará disponível em: http://localhost:5173
```

### 2. Navegação Principal
O sistema possui 3 páginas principais acessíveis pelo menu superior:
- **Dashboard**: Visão geral e estatísticas
- **Projetos**: Gerenciamento de projetos
- **Lançamentos**: Registro de horas trabalhadas

## 📊 Como Usar o Dashboard

### Visualização Geral
- Ao acessar, você verá 4 cards principais:
  - **Total de Projetos**: Quantidade de projetos cadastrados
  - **Horas Totais**: Soma de todas as horas dos projetos
  - **Horas Utilizadas**: Total de horas já lançadas
  - **Horas Restantes**: Diferença entre total e utilizadas

### Filtro por Desenvolvedor
1. No canto superior direito, clique no botão com o número de horas
2. Selecione um desenvolvedor específico ou "Todos os desenvolvedores"
3. O dashboard será atualizado mostrando apenas os dados do desenvolvedor selecionado

### Gráficos
- **Gráfico de Barras**: Mostra a distribuição de horas (totais, utilizadas, restantes)
- **Gráfico de Pizza**: Exibe o progresso geral em percentual

## 🗂️ Gerenciando Projetos

### Visualizando Projetos
A página de Projetos mostra uma tabela com:
- Nome do projeto
- Status (Não Iniciado, Em Andamento, Concluído)
- Barra de progresso
- Horas disponíveis (restantes/total)
- Data de criação
- Valor gasto até o momento

### Cadastrando Novo Projeto
1. Clique no botão "Novo Projeto"
2. Preencha os campos:
   - **Nome do Projeto**: Título do projeto
   - **Total de Horas**: Quantidade de horas estimadas
   - **Descrição**: Detalhes sobre o projeto
3. Clique em "Cadastrar"

### Excluindo Projeto
1. Clique no ícone de lixeira na linha do projeto
2. Confirme a exclusão no diálogo que aparecer

## ⏰ Lançando Horas

### Visualizando Lançamentos
A página mostra o histórico de todos os lançamentos com:
- Data do lançamento
- Projeto relacionado
- Desenvolvedor responsável
- Descrição da atividade
- Quantidade de horas
- Valor calculado

### Registrando Novo Lançamento
1. Clique no botão "Lançar Hora"
2. Preencha os campos:
   - **Projeto**: Selecione um projeto em andamento
   - **Desenvolvedor**: Escolha o desenvolvedor
   - **Descrição da Atividade**: Detalhe o que foi feito
   - **Quantidade de Horas**: Número de horas trabalhadas
   - **Data**: Data do trabalho (padrão: hoje)
3. Clique em "Lançar"

### Cadastrando Desenvolvedor
1. Clique no botão "Cadastrar Desenvolvedor"
2. Preencha os campos:
   - **Nome**: Nome completo
   - **E-mail**: Email de contato
   - **Senioridade**: Júnior, Pleno ou Sênior
   - **Valor por Hora**: Valor em reais
3. Clique em "Cadastrar"

## 🎛️ Funcionalidades Avançadas

### Contador de Desenvolvedores
- No header, você verá o número total de desenvolvedores cadastrados
- Este número é atualizado automaticamente

### Sistema de Filtros
- O filtro por desenvolvedor afeta todas as páginas
- Quando um desenvolvedor está selecionado, você verá apenas:
  - Projetos em que ele trabalhou
  - Lançamentos feitos por ele
  - Estatísticas específicas dele

### Cálculos Automáticos
- **Status dos Projetos**: Atualizado automaticamente baseado no progresso
- **Valores**: Calculados usando o valor/hora de cada desenvolvedor
- **Progresso**: Baseado na proporção de horas lançadas vs. total

## 🔍 Dicas de Uso

### Para Gestores
1. Use o Dashboard para ter uma visão geral rápida
2. Filtre por desenvolvedor para acompanhar performance individual
3. Monitore o progresso dos projetos na página de Projetos

### Para Desenvolvedores
1. Registre suas horas diariamente na página de Lançamentos
2. Seja específico na descrição das atividades
3. Verifique se o projeto correto está selecionado

### Para Administradores
1. Cadastre todos os desenvolvedores antes de iniciar os projetos
2. Defina valores/hora realistas para cálculos precisos
3. Revise periodicamente os lançamentos para garantir precisão

## ⚠️ Observações Importantes

### Projetos em Andamento
- Apenas projetos com horas restantes aparecem no seletor de lançamentos
- Projetos concluídos (100% das horas utilizadas) não aceitam novos lançamentos

### Exclusão de Dados
- A exclusão de projetos é permanente
- Certifique-se antes de confirmar a exclusão

### Valores Monetários
- Todos os valores são calculados em Reais (R$)
- Os cálculos são baseados no valor/hora de cada desenvolvedor

## 🆘 Resolução de Problemas

### Sistema não carrega
- Verifique se o comando `pnpm run dev --host` foi executado
- Confirme se a porta 5173 não está sendo usada por outro programa

### Dados não aparecem
- Verifique se há projetos cadastrados
- Confirme se há desenvolvedores cadastrados
- Verifique se o filtro por desenvolvedor não está limitando a visualização

### Problemas de cálculo
- Confirme se os valores/hora dos desenvolvedores estão corretos
- Verifique se as horas lançadas estão com valores válidos

---

**Para suporte adicional, consulte a documentação técnica no arquivo README.md**

