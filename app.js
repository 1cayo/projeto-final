/**
 * Cafeteria - Gestão Ágil Dinâmica (Scrum & Kanban)
 * Gerencia equipe editável, adição/remoção de sprints,
 * criação/atribuição flexível de atividades e cálculo dinâmico do dashboard.
 */

const STORAGE_DATA_KEY = 'cafeteria_full_state_v2';
const STORAGE_LEGACY_KEY = 'cafeteria_kanban_state_v1';

// Dados padrão iniciais
const DEFAULT_MEMBERS = [
  {
    id: 'cayo',
    nome: 'Cayo Nunes',
    papel: 'Banco + Front',
    entidade: 'Categorias (exibição)',
    tela: 'Home com categorias',
    campos: 'nome, descrição, imagem',
    avatar: 'CN',
    maxPoints: 15
  },
  {
    id: 'fernando',
    nome: 'Fernando Erivan',
    papel: 'API + Front',
    entidade: 'Produtos (CRUD completo)',
    tela: 'Gestão de Produtos',
    campos: 'nome, descrição, preço, imagem, categoria (relação)',
    avatar: 'FE',
    maxPoints: 15
  },
  {
    id: 'joao',
    nome: 'João Vitor',
    papel: 'API + Front',
    entidade: 'Reservas (CRUD completo)',
    tela: 'Reservas de mesa',
    campos: 'nome cliente, data, horário, nº pessoas, observação',
    avatar: 'JV',
    maxPoints: 15
  },
  {
    id: 'suedson',
    nome: 'Suedson Fernando',
    papel: 'API + Front',
    entidade: 'Unidades + Autenticação',
    tela: 'Login/Cadastro, Unidades',
    campos: 'nome, endereço, horário, telefone',
    avatar: 'SF',
    maxPoints: 15
  },
  {
    id: 'kaio',
    nome: 'Kaio Gabriel',
    papel: 'API + Front',
    entidade: 'Avaliações (exibição)',
    tela: 'Avaliações & Estrelas',
    campos: 'autor, nota (1–5), comentário',
    avatar: 'KG',
    maxPoints: 15
  }
];

const DEFAULT_SPRINTS = [
  { id: '0', nome: 'Sprint 0', foco: 'Setup & Base', datas: '18/11 a 19/11', resumo: 'Alinhamento Inicial' },
  { id: '1', nome: 'Sprint 1', foco: 'Fundação', datas: '20/11 a 22/11', resumo: 'Back-end & Hooks' },
  { id: '2', nome: 'Sprint 2', foco: 'Funcionalidades', datas: '23/11 a 26/11', resumo: 'Construção de Telas' },
  { id: '3', nome: 'Sprint 3', foco: 'Finalização', datas: '27/11 a 29/11', resumo: 'Deploy & Evidências' }
];

const DEFAULT_TASKS = [
  // Sprint 0
  { id: 'T01', titulo: 'Criar repositório, README com todos os nomes, convidar a equipe e definir branches (feature/nome-tarefa).', sprintId: '0', respId: 'kaio', points: 1, tag: 'Git / Setup', concluida: false },
  { id: 'T02', titulo: 'Criar projeto Next.js + Tailwind + TanStack Query + Zustand e estrutura padrão de pastas.', sprintId: '0', respId: 'kaio', points: 2, tag: 'Frontend Core', concluida: false },
  { id: 'T03', titulo: 'Criar app no Back4App e compartilhar as chaves seguras (com .env.example no repositório).', sprintId: '0', respId: 'cayo', points: 1, tag: 'Back4App', concluida: false },
  { id: 'T04', titulo: 'Identidade visual: paleta de cores (marrom café, creme, verde), fontes e tokens de CSS.', sprintId: '0', respId: 'suedson', points: 2, tag: 'Design System', concluida: false },
  { id: 'T05', titulo: 'Definir os campos da própria entidade (contrato de dados entre front e banco).', sprintId: '0', respId: 'todos', points: 1, tag: 'Contrato API', concluida: false },

  // Sprint 1
  { id: 'T06', titulo: 'Criar as classes no Back4App, relações e permissões (ACL). Destrava a equipe.', sprintId: '1', respId: 'cayo', points: 3, tag: 'Back4App / ACL', concluida: false },
  { id: 'T07', titulo: 'Configurar serviço de e-mail de recuperação de senha no painel Back4App.', sprintId: '1', respId: 'cayo', points: 2, tag: 'Auth Config', concluida: false },
  { id: 'T08', titulo: 'Cadastrar no banco pelo menos 2 objetos válidos da própria entidade.', sprintId: '1', respId: 'todos', points: 1, tag: 'Seed Inicial', concluida: false },
  { id: 'T09', titulo: 'Cliente base da API (lib/parse) e configuração do QueryClientProvider.', sprintId: '1', respId: 'fernando', points: 2, tag: 'API Client', concluida: false },
  { id: 'T10', titulo: 'Hooks de Produtos: listar, buscar, criar, editar e excluir (CRUD completo TanStack).', sprintId: '1', respId: 'fernando', points: 3, tag: 'Hooks CRUD', concluida: false },
  { id: 'T11', titulo: 'Hooks de Reservas: listar, buscar, criar, editar e excluir mesa.', sprintId: '1', respId: 'joao', points: 3, tag: 'Hooks CRUD', concluida: false },
  { id: 'T12', titulo: 'Componentes reutilizáveis UI: Button, Input, Modal e Card.', sprintId: '1', respId: 'joao', points: 2, tag: 'Design System', concluida: false },
  { id: 'T13', titulo: 'API de autenticação (login, logout, cadastro, reset) + useAuthStore.', sprintId: '1', respId: 'suedson', points: 3, tag: 'Auth / Zustand', concluida: false },
  { id: 'T14', titulo: 'Hook de listagem de Unidades/Lojas da cafeteria.', sprintId: '1', respId: 'suedson', points: 1, tag: 'TanStack Query', concluida: false },
  { id: 'T15', titulo: 'Hook de listagem de Avaliações de clientes.', sprintId: '1', respId: 'kaio', points: 1, tag: 'TanStack Query', concluida: false },
  { id: 'T16', titulo: 'Layout base da aplicação: Navbar, Footer e proteção de rotas privadas.', sprintId: '1', respId: 'kaio', points: 2, tag: 'Layout & Rotas', concluida: false },

  // Sprint 2
  { id: 'T17', titulo: 'Home: seção Hero + listagem visual de Categorias com filtros.', sprintId: '2', respId: 'cayo', points: 2, tag: 'Tela Principal', concluida: false },
  { id: 'T18', titulo: 'Tela de Produtos: tabela/cards, formulário, edição e exclusão segura com modal de confirmação.', sprintId: '2', respId: 'fernando', points: 3, tag: 'CRUD Produtos', concluida: false },
  { id: 'T19', titulo: 'Tela de Reservas: listagem, formulário de agendamento, edição e cancelamento.', sprintId: '2', respId: 'joao', points: 3, tag: 'CRUD Reservas', concluida: false },
  { id: 'T20', titulo: 'Telas de Autenticação: Login, Cadastro de novos usuários e fluxo de Logout.', sprintId: '2', respId: 'suedson', points: 2, tag: 'Auth UI', concluida: false },
  { id: 'T21', titulo: 'Tela “Esqueci minha senha” com disparo de e-mail e validação.', sprintId: '2', respId: 'suedson', points: 1, tag: 'Auth UI', concluida: false },
  { id: 'T22', titulo: 'Tela de Unidades da cafeteria (endereços, horários e contato).', sprintId: '2', respId: 'suedson', points: 1, tag: 'Visualização', concluida: false },
  { id: 'T23', titulo: 'Tela de Avaliações com cards elegantes e classificação por estrelas (1 a 5).', sprintId: '2', respId: 'kaio', points: 2, tag: 'Visualização', concluida: false },
  { id: 'T24', titulo: 'Store de Favoritos (useFavoritesStore via Zustand persistente) e botão ❤️ nos produtos.', sprintId: '2', respId: 'kaio', points: 2, tag: 'Estado Global', concluida: false },

  // Sprint 3
  { id: 'T26', titulo: 'Deploy em produção no Vercel e configuração das variáveis de ambiente Back4App.', sprintId: '3', respId: 'cayo', points: 2, tag: 'DevOps', concluida: false },
  { id: 'T27', titulo: 'Revisão minuciosa de CSS, responsividade mobile/tablet e polimento visual de cada tela.', sprintId: '3', respId: 'todos', points: 1, tag: 'Polimento UI', concluida: false },
  { id: 'T28', titulo: 'Roteiro, gravação de vídeo (até 3 min com áudio, mostrando CRUD no Back4App) e upload no YouTube.', sprintId: '3', respId: 'fernando', points: 2, tag: 'Vídeo Demo', concluida: false },
  { id: 'T29', titulo: 'Montar o PDF oficial da apresentação (documentando requisitos atendidos e pendências).', sprintId: '3', respId: 'joao', points: 2, tag: 'Slide & Docs', concluida: false },
  { id: 'T30', titulo: 'Preenchimento individual do respectivo slide: “O que eu implementei no projeto”.', sprintId: '3', respId: 'todos', points: 1, tag: 'Apresentação', concluida: false },
  { id: 'T31', titulo: 'Ensaio geral cronometrado da apresentação (todos os membros falam sua parte).', sprintId: '3', respId: 'todos', points: 1, tag: 'Alinhamento', concluida: false }
];

// Estado global em memória
let appState = {
  members: [],
  sprints: [],
  tasks: []
};

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupGlobalEvents();
  renderAll();
});

/**
 * Carrega os dados persistidos ou inicializa com valores padrão
 */
function loadData() {
  try {
    const rawData = localStorage.getItem(STORAGE_DATA_KEY);
    if (rawData) {
      appState = JSON.parse(rawData);
    } else {
      // Migra legado se houver
      const legacyState = JSON.parse(localStorage.getItem(STORAGE_LEGACY_KEY) || '{}');
      const initialTasks = DEFAULT_TASKS.map(t => ({
        ...t,
        concluida: !!legacyState[t.id]
      }));

      appState = {
        members: DEFAULT_MEMBERS,
        sprints: DEFAULT_SPRINTS,
        tasks: initialTasks
      };
      saveData();
    }
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    appState = {
      members: DEFAULT_MEMBERS,
      sprints: DEFAULT_SPRINTS,
      tasks: DEFAULT_TASKS
    };
  }
}

/**
 * Salva o estado completo no localStorage
 */
function saveData() {
  try {
    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }
}

/**
 * Configura listeners de botões globais e modais
 */
function setupGlobalEvents() {
  // Botões de Ação do Dashboard
  const btnReset = document.getElementById('btn-reset-tasks');
  const btnCheckAll = document.getElementById('btn-check-all');

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Deseja desmarcar todas as atividades concluídas?')) {
        appState.tasks.forEach(t => t.concluida = false);
        saveData();
        renderAll();
        showToast('Progresso reiniciado com sucesso.');
      }
    });
  }

  if (btnCheckAll) {
    btnCheckAll.addEventListener('click', () => {
      appState.tasks.forEach(t => t.concluida = true);
      saveData();
      renderAll();
      showToast('Todas as atividades foram marcadas como concluídas!');
    });
  }

  // Botões para adicionar Sprint e Tarefa
  const btnAddSprint = document.getElementById('btn-add-sprint');
  if (btnAddSprint) {
    btnAddSprint.addEventListener('click', () => openSprintModal());
  }

  const btnAddTaskGlobal = document.getElementById('btn-add-task-global');
  if (btnAddTaskGlobal) {
    btnAddTaskGlobal.addEventListener('click', () => openTaskModal());
  }

  // Fechamento de Modais clicando fora ou no botão fechar
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModals();
      }
    });
  });

  document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  // Formulário de Edição de Membro
  const formMember = document.getElementById('form-edit-member');
  if (formMember) {
    formMember.addEventListener('submit', (e) => {
      e.preventDefault();
      saveMemberForm();
    });
  }

  // Formulário de Sprint
  const formSprint = document.getElementById('form-sprint');
  if (formSprint) {
    formSprint.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSprintForm();
    });
  }

  // Formulário de Tarefa
  const formTask = document.getElementById('form-task');
  if (formTask) {
    formTask.addEventListener('submit', (e) => {
      e.preventDefault();
      saveTaskForm();
    });
  }

  // Botão de Excluir Tarefa
  const btnDeleteTask = document.getElementById('btn-delete-task');
  if (btnDeleteTask) {
    btnDeleteTask.addEventListener('click', () => {
      const taskId = document.getElementById('task-id-field').value;
      if (taskId && confirm(`Tem certeza que deseja excluir a atividade ${taskId}?`)) {
        appState.tasks = appState.tasks.filter(t => t.id !== taskId);
        saveData();
        closeModals();
        renderAll();
        showToast(`Atividade ${taskId} excluída com sucesso.`);
      }
    });
  }
}

/**
 * Renderiza todos os blocos reativos
 */
function renderAll() {
  renderMembers();
  renderDashboardSprints();
  renderKanban();
  updateDashboardMetrics();
}

/**
 * Retorna classe e avatar de um responsável
 */
function getRespMeta(respId) {
  if (respId === 'todos') {
    return { nome: 'Todos', avatar: '👥', colorClass: 'resp-todos' };
  }
  const member = appState.members.find(m => m.id === respId);
  if (member) {
    return {
      nome: member.nome,
      avatar: member.avatar || member.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
      colorClass: `resp-${member.id}`
    };
  }
  return { nome: 'Não atribuído', avatar: '?', colorClass: 'resp-todos' };
}

/**
 * Renderiza os cards de equipe com botão de edição
 */
function renderMembers() {
  const container = document.getElementById('team-cards-container');
  if (!container) return;

  container.innerHTML = '';

  appState.members.forEach(member => {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.setAttribute('data-member-id', member.id);

    const avatarText = member.avatar || member.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    card.innerHTML = `
      <div class="member-top">
        <div class="member-avatar" style="background: var(--membro-${member.id}-bg, #EAEAEA); color: var(--membro-${member.id}-text, #333); border: 2px solid var(--membro-${member.id}-border, #CCC);">
          ${avatarText}
        </div>
        <div class="member-info">
          <h4>${escapeHTML(member.nome)}</h4>
          <div class="member-role">${escapeHTML(member.papel)}</div>
        </div>
        <div class="member-top-actions">
          <button type="button" class="btn-icon-subtle btn-edit-member" data-member-id="${member.id}" title="Editar campos deste integrante">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="member-details">
        <div class="detail-row">
          <span class="detail-label">Entidade:</span>
          <span class="detail-val">${escapeHTML(member.entidade)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tela:</span>
          <span class="detail-val">${escapeHTML(member.tela)}</span>
        </div>
        <div class="fields-box">
          <strong>Campos sugeridos:</strong>
          ${escapeHTML(member.campos)}
        </div>
      </div>

      <div class="member-points">
        <div class="member-points-header">
          <span id="member-points-${member.id}" class="points-badge">0 / ${member.maxPoints || 15} pts</span>
          <span id="member-percent-${member.id}" style="font-weight: 700; color: var(--text-subtle);">0%</span>
        </div>
        <div class="points-bar-bg">
          <div id="member-progress-fill-${member.id}" class="points-bar-fill"></div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Evento de clique para editar integrante
  container.querySelectorAll('.btn-edit-member').forEach(btn => {
    btn.addEventListener('click', () => {
      const memberId = btn.getAttribute('data-member-id');
      openMemberModal(memberId);
    });
  });
}

/**
 * Renderiza o grid de sprints no dashboard
 */
function renderDashboardSprints() {
  const container = document.getElementById('sprints-progress-grid');
  if (!container) return;

  container.innerHTML = '';

  appState.sprints.forEach(sprint => {
    const card = document.createElement('div');
    card.className = 'sprint-prog-card';
    card.id = `dash-sprint-card-${sprint.id}`;

    card.innerHTML = `
      <div class="sprint-prog-head">
        <span class="sprint-prog-title">${escapeHTML(sprint.nome)} (${escapeHTML(sprint.foco)})</span>
        <span id="dash-sprint-${sprint.id}-val" class="sprint-prog-badge">0%</span>
      </div>
      <div class="sprint-prog-bar-track">
        <div id="dash-sprint-${sprint.id}-fill" class="sprint-prog-bar-fill"></div>
      </div>
      <div class="sprint-prog-footer">
        <span>${escapeHTML(sprint.datas)}</span>
        <span id="dash-sprint-${sprint.id}-count">0 tarefas</span>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Renderiza o Quadro Kanban completo com colunas e tarefas
 */
function renderKanban() {
  const container = document.getElementById('kanban-board');
  if (!container) return;

  container.innerHTML = '';

  appState.sprints.forEach(sprint => {
    const sprintTasks = appState.tasks.filter(t => t.sprintId === sprint.id);
    const sprintPointsTotal = sprintTasks.reduce((acc, t) => acc + t.points, 0);

    const column = document.createElement('div');
    column.className = 'kanban-column';
    column.setAttribute('data-sprint-id', sprint.id);

    column.innerHTML = `
      <div class="column-header">
        <div class="column-title-row">
          <div class="column-title">
            <span>${escapeHTML(sprint.nome)}</span>
          </div>
          <div class="column-actions">
            <span class="column-badge" id="sprint-badge-count-${sprint.id}">${sprintTasks.length} Tarefas</span>
            <button type="button" class="btn-icon-subtle btn-edit-sprint" data-sprint-id="${sprint.id}" title="Editar informações da Sprint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            ${appState.sprints.length > 1 ? `
              <button type="button" class="btn-icon-subtle btn-delete-sprint" data-sprint-id="${sprint.id}" title="Excluir Sprint">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="column-dates">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${escapeHTML(sprint.datas)} · ${escapeHTML(sprint.foco)}</span>
        </div>
        <div class="column-summary">
          <span>${escapeHTML(sprint.resumo)}</span>
          <span id="sprint-summary-pts-${sprint.id}">${sprintPointsTotal} pts totais</span>
        </div>
      </div>

      <button type="button" class="btn-column-add" data-sprint-id="${sprint.id}" title="Adicionar atividade nesta sprint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Adicionar Atividade
      </button>

      <div class="cards-container" id="cards-container-${sprint.id}"></div>
    `;

    container.appendChild(column);

    // Renderiza os cards de tarefas desta sprint
    const cardsContainer = column.querySelector(`#cards-container-${sprint.id}`);
    sprintTasks.forEach(task => {
      const card = createTaskCard(task);
      cardsContainer.appendChild(card);
    });
  });

  // Eventos de botões das colunas
  container.querySelectorAll('.btn-column-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const sprintId = btn.getAttribute('data-sprint-id');
      openTaskModal(null, sprintId);
    });
  });

  container.querySelectorAll('.btn-edit-sprint').forEach(btn => {
    btn.addEventListener('click', () => {
      const sprintId = btn.getAttribute('data-sprint-id');
      openSprintModal(sprintId);
    });
  });

  container.querySelectorAll('.btn-delete-sprint').forEach(btn => {
    btn.addEventListener('click', () => {
      const sprintId = btn.getAttribute('data-sprint-id');
      deleteSprint(sprintId);
    });
  });
}

/**
 * Cria um elemento HTML para um cartão de tarefa
 */
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = `kanban-card ${task.concluida ? 'is-completed' : ''}`;
  card.setAttribute('data-task-id', task.id);
  card.setAttribute('data-points', task.points);
  card.setAttribute('data-sprint', task.sprintId);
  card.setAttribute('data-resp', task.respId);

  const respMeta = getRespMeta(task.respId);
  const diffLabel = task.points === 1 ? '⭐ 1 pt' : task.points === 2 ? '⭐⭐ 2 pts' : '⭐⭐⭐ 3 pts';
  const diffClass = `d${task.points}`;

  // Borda especial para dependências críticas
  if (task.id === 'T06') {
    card.style.borderLeft = '3px solid var(--accent-rust)';
  } else if (task.id === 'T13') {
    card.style.borderLeft = '3px solid var(--accent-amber)';
  }

  card.innerHTML = `
    <div class="card-top">
      <div class="card-top-left">
        <span class="task-id">${escapeHTML(task.id)}</span>
        <span class="task-diff ${diffClass}">${diffLabel}</span>
      </div>
      <div class="card-top-right">
        <button type="button" class="btn-edit-task" data-task-id="${task.id}" title="Editar atividade ou mudar responsável/sprint">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <label class="task-check-wrapper" title="Marcar como concluída">
          <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.concluida ? 'checked' : ''}>
        </label>
      </div>
    </div>
    <div class="task-title">
      ${task.id === 'T06' ? '<strong>Dependência Crítica:</strong> ' : ''}
      ${task.id === 'T13' ? '<strong>Crítico:</strong> ' : ''}
      ${escapeHTML(task.titulo)}
    </div>
    <div class="card-footer">
      <div class="resp-badge ${respMeta.colorClass}">
        <span class="avatar-mini">${respMeta.avatar}</span>
        <span>${escapeHTML(respMeta.nome)}</span>
      </div>
      <span class="task-tag">${escapeHTML(task.tag || 'Atividade')}</span>
    </div>
  `;

  // Evento de marcar como concluída
  const checkbox = card.querySelector('.task-checkbox');
  checkbox.addEventListener('change', () => {
    task.concluida = checkbox.checked;
    if (task.concluida) {
      card.classList.add('is-completed');
    } else {
      card.classList.remove('is-completed');
    }
    saveData();
    updateDashboardMetrics();
  });

  // Evento de editar tarefa
  const btnEdit = card.querySelector('.btn-edit-task');
  btnEdit.addEventListener('click', (e) => {
    e.stopPropagation();
    openTaskModal(task.id);
  });

  return card;
}

/**
 * Atualiza todas as métricas do dashboard e barras de progresso
 */
function updateDashboardMetrics() {
  const totalTasks = appState.tasks.length;
  const completedTasks = appState.tasks.filter(t => t.concluida);
  const completedTasksCount = completedTasks.length;

  // Pontuação e contagem por sprint
  const sprintStats = {};
  appState.sprints.forEach(s => {
    sprintStats[s.id] = { totalPts: 0, donePts: 0, totalCount: 0, doneCount: 0 };
  });

  // Pontos por membro
  const memberPoints = {};
  appState.members.forEach(m => {
    memberPoints[m.id] = 0;
  });

  let t06Done = false;
  let t13Done = false;

  appState.tasks.forEach(task => {
    const sId = task.sprintId;
    if (!sprintStats[sId]) {
      sprintStats[sId] = { totalPts: 0, donePts: 0, totalCount: 0, doneCount: 0 };
    }

    sprintStats[sId].totalPts += task.points;
    sprintStats[sId].totalCount++;

    if (task.concluida) {
      sprintStats[sId].donePts += task.points;
      sprintStats[sId].doneCount++;

      // Atribuição de pontos aos membros
      if (task.respId === 'todos') {
        appState.members.forEach(m => {
          memberPoints[m.id] += task.points;
        });
      } else if (memberPoints[task.respId] !== undefined) {
        memberPoints[task.respId] += task.points;
      }

      if (task.id === 'T06') t06Done = true;
      if (task.id === 'T13') t13Done = true;
    }
  });

  // Cálculo master geral
  let totalProjectTargetPts = 0;
  appState.members.forEach(m => {
    totalProjectTargetPts += (m.maxPoints || 15);
  });
  if (totalProjectTargetPts === 0) totalProjectTargetPts = 75;

  let totalPointsObtidos = 0;
  appState.members.forEach(m => {
    totalPointsObtidos += Math.min(memberPoints[m.id] || 0, m.maxPoints || 15);
  });

  const projectPercent = totalProjectTargetPts > 0 
    ? Math.min(100, Math.round((totalPointsObtidos / totalProjectTargetPts) * 100))
    : 0;

  // 1. Atualiza Barra Master
  const masterFill = document.getElementById('dash-master-fill');
  const masterPercentText = document.getElementById('dash-master-percent');
  const masterPointsText = document.getElementById('dash-master-points');
  const masterTasksText = document.getElementById('dash-master-tasks');

  if (masterFill) masterFill.style.width = `${projectPercent}%`;
  if (masterPercentText) masterPercentText.textContent = `${projectPercent}%`;
  if (masterPointsText) masterPointsText.textContent = `${totalPointsObtidos} / ${totalProjectTargetPts} pts`;
  if (masterTasksText) masterTasksText.textContent = `${completedTasksCount} / ${totalTasks} tarefas`;

  // 2. Atualiza Sprints no Dashboard
  appState.sprints.forEach(s => {
    const stat = sprintStats[s.id] || { totalPts: 0, donePts: 0, totalCount: 0, doneCount: 0 };
    const pct = stat.totalPts > 0 ? Math.min(100, Math.round((stat.donePts / stat.totalPts) * 100)) : 0;

    const fillElem = document.getElementById(`dash-sprint-${s.id}-fill`);
    const valElem = document.getElementById(`dash-sprint-${s.id}-val`);
    const countElem = document.getElementById(`dash-sprint-${s.id}-count`);

    if (fillElem) fillElem.style.width = `${pct}%`;
    if (valElem) valElem.textContent = `${pct}% (${stat.donePts}/${stat.totalPts} pts)`;
    if (countElem) countElem.textContent = `${stat.doneCount}/${stat.totalCount} tarefas`;

    // Atualiza badges no cabeçalho da coluna do Kanban se existirem
    const badgeCount = document.getElementById(`sprint-badge-count-${s.id}`);
    const summaryPts = document.getElementById(`sprint-summary-pts-${s.id}`);
    if (badgeCount) badgeCount.textContent = `${stat.totalCount} Tarefas`;
    if (summaryPts) summaryPts.textContent = `${stat.totalPts} pts totais`;
  });

  // 3. Atualiza Membros
  appState.members.forEach(m => {
    const maxPts = m.maxPoints || 15;
    const pts = Math.min(memberPoints[m.id] || 0, maxPts);
    const pct = Math.round((pts / maxPts) * 100);

    const fillElem = document.getElementById(`member-progress-fill-${m.id}`);
    const badgeElem = document.getElementById(`member-points-${m.id}`);
    const percentElem = document.getElementById(`member-percent-${m.id}`);

    if (fillElem) fillElem.style.width = `${pct}%`;
    if (badgeElem) badgeElem.textContent = `${pts} / ${maxPts} pts`;
    if (percentElem) percentElem.textContent = `${pct}%`;
  });

  // 4. Dependências Críticas
  const depT06 = document.getElementById('dep-badge-t06');
  const depT13 = document.getElementById('dep-badge-t13');

  if (depT06) {
    if (t06Done) {
      depT06.textContent = '✓ Concluída (Classes Liberadas)';
      depT06.style.background = '#EFF6ED';
      depT06.style.color = '#2D6335';
    } else {
      depT06.textContent = 'Até 21/11 (Bloqueante)';
      depT06.style.background = '#FDF0ED';
      depT06.style.color = 'var(--accent-rust)';
    }
  }

  if (depT13) {
    if (t13Done) {
      depT13.textContent = '✓ Concluída (Rotas Liberadas)';
      depT13.style.background = '#EFF6ED';
      depT13.style.color = '#2D6335';
    } else {
      depT13.textContent = 'Pendente (Prioritário)';
      depT13.style.background = '#FEF8EC';
      depT13.style.color = 'var(--accent-amber)';
    }
  }
}

/* ==========================================================================
   MODAIS E OPERAÇÕES CRUD (MEMBROS, SPRINTS, TAREFAS)
   ========================================================================== */

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

/**
 * MODAL: Editar Membro
 */
function openMemberModal(memberId) {
  const member = appState.members.find(m => m.id === memberId);
  if (!member) return;

  document.getElementById('member-edit-id').value = member.id;
  document.getElementById('member-edit-nome').value = member.nome;
  document.getElementById('member-edit-papel').value = member.papel;
  document.getElementById('member-edit-entidade').value = member.entidade;
  document.getElementById('member-edit-tela').value = member.tela;
  document.getElementById('member-edit-campos').value = member.campos;

  document.getElementById('modal-edit-member').classList.add('active');
}

function saveMemberForm() {
  const memberId = document.getElementById('member-edit-id').value;
  const member = appState.members.find(m => m.id === memberId);
  if (!member) return;

  member.nome = document.getElementById('member-edit-nome').value.trim();
  member.papel = document.getElementById('member-edit-papel').value.trim();
  member.entidade = document.getElementById('member-edit-entidade').value.trim();
  member.tela = document.getElementById('member-edit-tela').value.trim();
  member.campos = document.getElementById('member-edit-campos').value.trim();
  member.avatar = member.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  saveData();
  closeModals();
  renderAll();
  showToast(`Informações de ${member.nome} atualizadas com sucesso.`);
}

/**
 * MODAL: Adicionar / Editar Sprint
 */
function openSprintModal(sprintId = null) {
  const isEdit = !!sprintId;
  const modal = document.getElementById('modal-sprint');
  const titleElem = document.getElementById('modal-sprint-title');
  const idField = document.getElementById('sprint-id-field');
  const nomeField = document.getElementById('sprint-nome-field');
  const focoField = document.getElementById('sprint-foco-field');
  const datasField = document.getElementById('sprint-datas-field');
  const resumoField = document.getElementById('sprint-resumo-field');

  if (isEdit) {
    const sprint = appState.sprints.find(s => s.id === sprintId);
    if (!sprint) return;
    titleElem.textContent = 'Editar Sprint';
    idField.value = sprint.id;
    nomeField.value = sprint.nome;
    focoField.value = sprint.foco;
    datasField.value = sprint.datas;
    resumoField.value = sprint.resumo;
  } else {
    titleElem.textContent = 'Adicionar Nova Sprint';
    const nextNum = appState.sprints.length;
    idField.value = '';
    nomeField.value = `Sprint ${nextNum}`;
    focoField.value = 'Nova Etapa';
    datasField.value = 'Período a definir';
    resumoField.value = 'Planejamento e entregas';
  }

  modal.classList.add('active');
}

function saveSprintForm() {
  const idField = document.getElementById('sprint-id-field').value;
  const nome = document.getElementById('sprint-nome-field').value.trim();
  const foco = document.getElementById('sprint-foco-field').value.trim();
  const datas = document.getElementById('sprint-datas-field').value.trim();
  const resumo = document.getElementById('sprint-resumo-field').value.trim();

  if (!nome) {
    alert('Por favor, informe o nome da Sprint.');
    return;
  }

  if (idField) {
    // Edição
    const sprint = appState.sprints.find(s => s.id === idField);
    if (sprint) {
      sprint.nome = nome;
      sprint.foco = foco;
      sprint.datas = datas;
      sprint.resumo = resumo;
    }
  } else {
    // Nova Sprint
    const newId = String(Date.now());
    appState.sprints.push({
      id: newId,
      nome,
      foco,
      datas,
      resumo
    });
  }

  saveData();
  closeModals();
  renderAll();
  showToast('Sprint salva com sucesso!');
}

function deleteSprint(sprintId) {
  const sprint = appState.sprints.find(s => s.id === sprintId);
  if (!sprint) return;

  const tasksInSprint = appState.tasks.filter(t => t.sprintId === sprintId);
  let confirmMsg = `Deseja realmente remover a ${sprint.nome}?`;
  if (tasksInSprint.length > 0) {
    confirmMsg += `\nEla contém ${tasksInSprint.length} atividade(s) que também serão removidas.`;
  }

  if (confirm(confirmMsg)) {
    appState.sprints = appState.sprints.filter(s => s.id !== sprintId);
    appState.tasks = appState.tasks.filter(t => t.sprintId !== sprintId);
    saveData();
    renderAll();
    showToast(`${sprint.nome} removida com sucesso.`);
  }
}

/**
 * MODAL: Adicionar / Editar Tarefa & Atribuir a quem quiser
 */
function openTaskModal(taskId = null, defaultSprintId = null) {
  const isEdit = !!taskId;
  const modal = document.getElementById('modal-task');
  const titleElem = document.getElementById('modal-task-title');
  const idField = document.getElementById('task-id-field');
  const tituloField = document.getElementById('task-titulo-field');
  const sprintSelect = document.getElementById('task-sprint-select');
  const respSelect = document.getElementById('task-resp-select');
  const pointsSelect = document.getElementById('task-points-select');
  const tagField = document.getElementById('task-tag-field');
  const btnDelete = document.getElementById('btn-delete-task');

  // Popula os selects dinamicamente
  sprintSelect.innerHTML = '';
  appState.sprints.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.nome} (${s.foco})`;
    sprintSelect.appendChild(opt);
  });

  respSelect.innerHTML = '';
  appState.members.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.nome} (${m.papel})`;
    respSelect.appendChild(opt);
  });
  const optTodos = document.createElement('option');
  optTodos.value = 'todos';
  optTodos.textContent = '👥 Todos os Integrantes';
  respSelect.appendChild(optTodos);

  if (isEdit) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;

    titleElem.textContent = `Editar Atividade ${task.id}`;
    idField.value = task.id;
    tituloField.value = task.titulo;
    sprintSelect.value = task.sprintId;
    respSelect.value = task.respId;
    pointsSelect.value = String(task.points);
    tagField.value = task.tag || '';
    if (btnDelete) btnDelete.style.display = 'inline-block';
  } else {
    titleElem.textContent = 'Adicionar Nova Atividade';
    // Gera próximo ID
    const maxNum = appState.tasks.reduce((max, t) => {
      const match = t.id.match(/^T(\d+)$/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const nextId = `T${String(maxNum + 1).padStart(2, '0')}`;

    idField.value = nextId;
    tituloField.value = '';
    if (defaultSprintId && appState.sprints.some(s => s.id === defaultSprintId)) {
      sprintSelect.value = defaultSprintId;
    } else if (appState.sprints.length > 0) {
      sprintSelect.value = appState.sprints[0].id;
    }
    respSelect.value = appState.members[0] ? appState.members[0].id : 'todos';
    pointsSelect.value = '2';
    tagField.value = 'Frontend';
    if (btnDelete) btnDelete.style.display = 'none';
  }

  modal.classList.add('active');
}

function saveTaskForm() {
  const taskId = document.getElementById('task-id-field').value.trim();
  const titulo = document.getElementById('task-titulo-field').value.trim();
  const sprintId = document.getElementById('task-sprint-select').value;
  const respId = document.getElementById('task-resp-select').value;
  const points = parseInt(document.getElementById('task-points-select').value, 10) || 1;
  const tag = document.getElementById('task-tag-field').value.trim() || 'Atividade';

  if (!titulo) {
    alert('Por favor, informe a descrição da atividade.');
    return;
  }

  const existingIndex = appState.tasks.findIndex(t => t.id === taskId);
  if (existingIndex >= 0) {
    // Atualiza existente (pode ter mudado de sprint ou responsável)
    const task = appState.tasks[existingIndex];
    task.titulo = titulo;
    task.sprintId = sprintId;
    task.respId = respId;
    task.points = points;
    task.tag = tag;
  } else {
    // Nova tarefa
    appState.tasks.push({
      id: taskId,
      titulo,
      sprintId,
      respId,
      points,
      tag,
      concluida: false
    });
  }

  saveData();
  closeModals();
  renderAll();
  showToast(`Atividade ${taskId} salva com sucesso!`);
}

/**
 * Toast feedback temporário
 */
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${escapeHTML(message)}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Sanitização básica de strings para prevenção de XSS
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
