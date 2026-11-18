/**
 * Cafeteria - Dashboard de Acompanhamento e Sincronização Kanban
 * Gerencia o estado das tarefas, cálculo de métricas e atualização reativa do dashboard.
 */

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'cafeteria_kanban_state_v1';

// Mapeamento das 5 tarefas coletivas de "Todos" (onde cada integrante ganha 1 pt)
const TAREFAS_TODOS = ['T05', 'T08', 'T27', 'T30', 'T31'];

// Lista de membros do time
const MEMBROS = [
  { id: 'cayo', nome: 'Cayo Nunes', maxPoints: 15 },
  { id: 'fernando', nome: 'Fernando Erivan', maxPoints: 15 },
  { id: 'joao', nome: 'João Vitor', maxPoints: 15 },
  { id: 'suedson', nome: 'Suedson Fernando', maxPoints: 15 },
  { id: 'kaio', nome: 'Kaio Gabriel', maxPoints: 15 }
];

// Metas de pontos por sprint
const SPRINTS_META = {
  '0': 7,
  '1': 23,
  '2': 16,
  '3': 9
};

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  const taskCards = document.querySelectorAll('.kanban-card[data-task-id]');
  const savedState = carregarEstado();

  // Inicializa checkboxes nos cards
  taskCards.forEach(card => {
    const taskId = card.getAttribute('data-task-id');
    const checkbox = card.querySelector('.task-checkbox');

    if (checkbox) {
      // Aplica estado salvo
      if (savedState[taskId]) {
        checkbox.checked = true;
        card.classList.add('is-completed');
      }

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          card.classList.add('is-completed');
        } else {
          card.classList.remove('is-completed');
        }
        salvarEstado();
        atualizarDashboard();
      });
    }
  });

  // Configura botões de controle rápido
  const btnReset = document.getElementById('btn-reset-tasks');
  const btnCheckAll = document.getElementById('btn-check-all');

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Deseja resetar o progresso de todas as atividades?')) {
        taskCards.forEach(card => {
          const checkbox = card.querySelector('.task-checkbox');
          if (checkbox) checkbox.checked = false;
          card.classList.remove('is-completed');
        });
        salvarEstado();
        atualizarDashboard();
      }
    });
  }

  if (btnCheckAll) {
    btnCheckAll.addEventListener('click', () => {
      taskCards.forEach(card => {
        const checkbox = card.querySelector('.task-checkbox');
        if (checkbox) checkbox.checked = true;
        card.classList.add('is-completed');
      });
      salvarEstado();
      atualizarDashboard();
    });
  }

  // Primeira atualização das métricas
  atualizarDashboard();
}

/**
 * Salva o estado dos checkboxes no localStorage
 */
function salvarEstado() {
  const checkboxes = document.querySelectorAll('.task-checkbox');
  const state = {};
  checkboxes.forEach(cb => {
    state[cb.dataset.taskId] = cb.checked;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Não foi possível salvar no localStorage:', e);
  }
}

/**
 * Carrega o estado salvo
 */
function carregarEstado() {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('grao_prosa_kanban_state_v1');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Recalcula e atualiza todas as métricas do dashboard
 */
function atualizarDashboard() {
  const taskCards = document.querySelectorAll('.kanban-card[data-task-id]');
  const totalTasks = taskCards.length;
  let completedTasksCount = 0;

  // Pontuação por sprint
  const sprintPoints = { '0': 0, '1': 0, '2': 0, '3': 0 };
  const sprintDoneCount = { '0': 0, '1': 0, '2': 0, '3': 0 };
  const sprintTotalCount = { '0': 0, '1': 0, '2': 0, '3': 0 };

  // Pontos por membro (cada um atinge até 15 pts)
  const memberPoints = {
    cayo: 0,
    fernando: 0,
    joao: 0,
    suedson: 0,
    kaio: 0
  };

  // Rastreamento das dependências críticas
  let t06Done = false;
  let t13Done = false;

  taskCards.forEach(card => {
    const taskId = card.getAttribute('data-task-id');
    const points = parseInt(card.getAttribute('data-points') || '1', 10);
    const sprint = card.getAttribute('data-sprint') || '0';
    const resp = (card.getAttribute('data-resp') || '').toLowerCase();
    const isCompleted = card.classList.contains('is-completed');

    if (sprintTotalCount[sprint] !== undefined) {
      sprintTotalCount[sprint]++;
    }

    if (isCompleted) {
      completedTasksCount++;
      if (sprintPoints[sprint] !== undefined) {
        sprintPoints[sprint] += points;
        sprintDoneCount[sprint]++;
      }

      // Se a tarefa for de "Todos", soma 1 pt para cada integrante
      if (resp === 'todos') {
        MEMBROS.forEach(m => {
          memberPoints[m.id] += points;
        });
      } else if (memberPoints[resp] !== undefined) {
        memberPoints[resp] += points;
      }

      if (taskId === 'T06') t06Done = true;
      if (taskId === 'T13') t13Done = true;
    }
  });

  // Cálculo total de pontos obtidos (75 pontos no total do projeto: 15 * 5)
  let totalPointsObtidos = 0;
  MEMBROS.forEach(m => {
    totalPointsObtidos += Math.min(memberPoints[m.id], m.maxPoints);
  });
  const maxProjectPoints = 75;
  const projectPercent = Math.round((totalPointsObtidos / maxProjectPoints) * 100);

  // 1. Atualiza Barra Geral Master
  const masterFill = document.getElementById('dash-master-fill');
  const masterPercentText = document.getElementById('dash-master-percent');
  const masterPointsText = document.getElementById('dash-master-points');
  const masterTasksText = document.getElementById('dash-master-tasks');

  if (masterFill) masterFill.style.width = `${projectPercent}%`;
  if (masterPercentText) masterPercentText.textContent = `${projectPercent}%`;
  if (masterPointsText) masterPointsText.textContent = `${totalPointsObtidos} / ${maxProjectPoints} pts`;
  if (masterTasksText) masterTasksText.textContent = `${completedTasksCount} / ${totalTasks} tarefas`;

  // 2. Atualiza Sprints
  Object.keys(SPRINTS_META).forEach(s => {
    const metaPts = SPRINTS_META[s];
    const pts = sprintPoints[s] || 0;
    const pct = Math.min(100, Math.round((pts / metaPts) * 100));

    const fillElem = document.getElementById(`dash-sprint-${s}-fill`);
    const valElem = document.getElementById(`dash-sprint-${s}-val`);
    const countElem = document.getElementById(`dash-sprint-${s}-count`);

    if (fillElem) fillElem.style.width = `${pct}%`;
    if (valElem) valElem.textContent = `${pct}% (${pts}/${metaPts} pts)`;
    if (countElem) countElem.textContent = `${sprintDoneCount[s]}/${sprintTotalCount[s]} tarefas`;
  });

  // 3. Atualiza Membros
  MEMBROS.forEach(m => {
    const pts = Math.min(memberPoints[m.id], m.maxPoints);
    const pct = Math.round((pts / m.maxPoints) * 100);

    const fillElem = document.getElementById(`member-progress-fill-${m.id}`);
    const badgeElem = document.getElementById(`member-points-${m.id}`);
    const percentElem = document.getElementById(`member-percent-${m.id}`);

    if (fillElem) fillElem.style.width = `${pct}%`;
    if (badgeElem) badgeElem.textContent = `${pts} / ${m.maxPoints} pts`;
    if (percentElem) percentElem.textContent = `${pct}%`;
  });

  // 4. Atualiza Dependências Críticas Visuais
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

