(() => {
  'use strict';

  const API_BASE = '/api/despesas';
  const SESSION_KEY = 'financas95.sessionUser';
  const $ = (selector) => document.querySelector(selector);
  const elements = {
    modal: $('#entryModal'),
    form: $('#entryForm'),
    body: $('#entriesBody'),
    empty: $('#emptyState'),
    search: $('#searchInput'),
    yearFilter: $('#yearFilter'),
    monthFilter: $('#monthFilter'),
    count: $('#entryCount'),
    total: $('#grandTotal'),
    result: $('#resultLabel'),
    title: $('#modalTitle'),
    toast: $('#toast'),
    loginView: $('#loginView'),
    expensesView: $('#expensesView'),
    loginForm: $('#loginForm'),
    loginError: $('#loginError'),
    clock: $('#taskbarClock')
  };

  let entries = [];
  let entriesLoaded = false;
  let lastFocusedElement = null;
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Erro HTTP ${response.status}`);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function loadEntries() {
    entries = await request(`${API_BASE}/get`);
    entriesLoaded = true;
    updateDateFilters();
    render();
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
      .format(Number(value) || 0);
  }

  function toDateInputValue(date) {
    return date ? String(date).slice(0, 10) : '';
  }

  function formatDate(date) {
    const normalized = toDateInputValue(date);
    if (!normalized) return '—';
    const [year, month, day] = normalized.split('-');
    return `${day}/${month}/${year}`;
  }

  function paymentMethodLabel(value) {
    const labels = {
      PIX: 'PIX',
      CARTAO_CREDITO: 'Cartão de crédito',
      CARTAO_DEBITO: 'Cartão de débito',
      BOLETO: 'Boleto',
      DINHEIRO: 'Dinheiro',
      TRANSFERENCIA: 'Transferência'
    };
    return labels[value] || value || '—';
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove('show'), 2400);
  }

  function getDateParts(date) {
    const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(toDateInputValue(date));
    return match ? { year: match[1], month: match[2] } : null;
  }

  function setSelectOptions(select, values, labelForValue) {
    const selected = select.value;
    select.innerHTML = '<option value="">Todos</option>' + values.map((value) =>
      `<option value="${escapeHtml(value)}">${escapeHtml(labelForValue(value))}</option>`
    ).join('');
    select.value = values.includes(selected) ? selected : '';
  }

  function updateDateFilters() {
    const years = [...new Set(entries.map((entry) => getDateParts(entry.date)?.year).filter(Boolean))]
      .sort((a, b) => Number(b) - Number(a));
    setSelectOptions(elements.yearFilter, years, (year) => year);
    updateMonthFilter();
  }

  function updateMonthFilter() {
    const year = elements.yearFilter.value;
    const months = [...new Set(entries.map((entry) => getDateParts(entry.date))
      .filter((date) => date && (!year || date.year === year)).map((date) => date.month))]
      .sort((a, b) => Number(a) - Number(b));
    setSelectOptions(elements.monthFilter, months, (month) => monthNames[Number(month) - 1]);
  }

  function filteredEntries() {
    const query = elements.search.value.trim().toLocaleLowerCase('pt-BR');
    const year = elements.yearFilter.value;
    const month = elements.monthFilter.value;
    return entries.filter((entry) => {
      const date = getDateParts(entry.date);
      const searchable = [entry.date, entry.category, entry.subcategory, entry.description,
        entry.status, paymentMethodLabel(entry.paymentMethod), entry.observation]
        .join(' ').toLocaleLowerCase('pt-BR');
      return (!year || date?.year === year) && (!month || date?.month === month) && searchable.includes(query);
    });
  }

  function render() {
    const filtered = filteredEntries();
    elements.body.innerHTML = filtered.map((entry) => {
      const paid = entry.status === 'PAGO';
      return `<tr>
        <td>${formatDate(entry.date)}</td>
        <td title="${escapeHtml(entry.category)}">${escapeHtml(entry.category)}</td>
        <td title="${escapeHtml(entry.subcategory || '')}">${escapeHtml(entry.subcategory || '—')}</td>
        <td title="${escapeHtml(entry.description)}">${escapeHtml(entry.description)}</td>
        <td class="amount">${formatCurrency(entry.value)}</td>
        <td><span class="badge ${paid ? 'yes' : 'no'}">${paid ? 'Sim' : 'Não'}</span></td>
        <td>${escapeHtml(paymentMethodLabel(entry.paymentMethod))}</td>
        <td title="${escapeHtml(entry.observation || '')}">${escapeHtml(entry.observation || '—')}</td>
        <td><div class="actions">
          <button class="icon-button" data-action="edit" data-id="${entry.id}" type="button">Editar</button>
          <button class="icon-button danger" data-action="delete" data-id="${entry.id}" type="button">Excluir</button>
        </div></td>
      </tr>`;
    }).join('');
    elements.empty.hidden = filtered.length > 0;
    elements.count.textContent = filtered.length;
    elements.total.textContent = formatCurrency(filtered.reduce((sum, entry) => sum + Number(entry.value), 0));
    elements.result.textContent = `${filtered.length} ${filtered.length === 1 ? 'registro' : 'registros'}`;
  }

  function openModal(entry = null) {
    lastFocusedElement = document.activeElement;
    elements.form.reset();
    $('#entryId').value = entry?.id || '';
    elements.title.textContent = entry ? 'Editar lançamento' : 'Novo lançamento';
    if (entry) {
      $('#date').value = toDateInputValue(entry.date);
      $('#category').value = entry.category || '';
      $('#subcategory').value = entry.subcategory || '';
      $('#description').value = entry.description || '';
      $('#amount').value = entry.value;
      $('#paid').value = entry.status;
      $('#paymentMethod').value = entry.paymentMethod || '';
      $('#notes').value = entry.observation || '';
    } else {
      $('#date').value = new Date().toISOString().slice(0, 10);
    }
    elements.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#date').focus(), 0);
  }

  function closeModal() {
    elements.modal.hidden = true;
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
  }

  elements.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#entryId').value;
    const entry = {
      date: $('#date').value, category: $('#category').value.trim(),
      subcategory: $('#subcategory').value.trim(), description: $('#description').value.trim(),
      value: Number($('#amount').value), status: $('#paid').value,
      paymentMethod: $('#paymentMethod').value || null, observation: $('#notes').value.trim()
    };
    const submit = elements.form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const saved = await request(id ? `${API_BASE}/${encodeURIComponent(id)}` : `${API_BASE}/postDespesa`, {
        method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry)
      });
      entries = id ? entries.map((item) => String(item.id) === id ? saved : item) : [...entries, saved];
      updateDateFilters(); render(); closeModal();
      showToast(id ? 'Lançamento atualizado.' : 'Lançamento adicionado.');
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      showToast('Não foi possível salvar o lançamento.');
    } finally { submit.disabled = false; }
  });

  elements.body.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const id = button.dataset.id;
    const entry = entries.find((item) => String(item.id) === id);
    if (!entry) return;
    if (button.dataset.action === 'edit') { openModal(entry); return; }
    if (button.dataset.action !== 'delete' || !confirm(`Excluir “${entry.description}”?`)) return;
    button.disabled = true;
    try {
      await request(`${API_BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
      entries = entries.filter((item) => String(item.id) !== id);
      updateDateFilters(); render(); showToast('Lançamento excluído.');
    } catch (error) {
      console.error('Erro ao excluir lançamento:', error);
      button.disabled = false; showToast('Não foi possível excluir o lançamento.');
    }
  });

  async function showView(requestedView) {
    let view = requestedView;
    if (view === 'expenses' && !sessionStorage.getItem(SESSION_KEY)) {
      view = 'login';
      showToast('Faça login para abrir as despesas.');
    }
    elements.loginView.hidden = view !== 'login';
    elements.expensesView.hidden = view !== 'expenses';
    document.querySelectorAll('[data-open-view]').forEach((button) => {
      const active = button.dataset.openView === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (view === 'expenses' && !entriesLoaded) {
      try { await loadEntries(); }
      catch (error) {
        console.error('Erro ao carregar lançamentos:', error);
        render(); showToast('Não foi possível carregar os lançamentos.');
      }
    }
  }
  //login form
  elements.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = $('#loginUsername').value.trim();
    const password = $('#loginPassword').value;
    if (!username || !password) {
      elements.loginError.textContent = 'Preencha o usuário e a senha.';
      elements.loginError.hidden = false;
      return;
    }
    elements.loginError.hidden = true;
    sessionStorage.setItem(SESSION_KEY, username);
    $('#loginPassword').value = '';
    showToast(`Bem-vindo, ${username}.`);
    await showView('expenses');
  });

  $('#newEntryButton').addEventListener('click', () => openModal());
  $('#closeModalButton').addEventListener('click', closeModal);
  $('#cancelButton').addEventListener('click', closeModal);
  elements.search.addEventListener('input', render);
  elements.yearFilter.addEventListener('change', () => { updateMonthFilter(); render(); });
  elements.monthFilter.addEventListener('change', render);
  elements.modal.addEventListener('click', (event) => { if (event.target === elements.modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !elements.modal.hidden) closeModal(); });
  document.querySelectorAll('[data-open-view]').forEach((button) =>
    button.addEventListener('click', () => showView(button.dataset.openView)));
  $('.start-button').addEventListener('click', () => showView('login'));

  function updateClock() {
    elements.clock.textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  }
  updateClock();
  setInterval(updateClock, 30000);
  showView(sessionStorage.getItem(SESSION_KEY) ? 'expenses' : 'login');
})();
