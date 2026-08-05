(() => {
  'use strict';
  const STORAGE_KEY = 'financas95.entries.v1';
  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const $ = (selector) => document.querySelector(selector);
  const elements = { 
    modal: $('#entryModal'), 
    form: $('#entryForm'), 
    body: $('#entriesBody'), 
    empty: $('#emptyState'), 
    search: $('#searchInput'), 
    count: $('#entryCount'), 
    total: $('#grandTotal'), 
    result: $('#resultLabel'), 
    title: $('#modalTitle'), 
    toast: $('#toast') 
  };
  let entries = loadEntries();
  let lastFocusedElement = null;

  async function loadEntries() {
    const URL = 'https://scaling-umbrella-7xq4pp7w9rrcrq97-8080.app.github.dev/api/despesas/get';
    try { 
      const response = await fetch(URL);
      if(!response.ok){
        throw new Error(`Response status: ${response.status}`)
      }
      const result = await response.json();
      console.log(result);
      return result; 
    } catch { 
      return []; 
    } 
  }
  
  function saveEntries() { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); 
  }

  function escapeHtml(value) { 
    const div = document.createElement('div'); 
    div.textContent = String(value ?? ''); 
    return div.innerHTML; 
  }

  function formatCurrency(value) { 
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', currency: 'BRL' 
    }).format(Number(value) || 0); 
  }
  function formatDate(date) { 
    if (!date) return '—'; const [year, month, day] = date.split('-'); 
    return `${day}/${month}/${year}`; 
  }
  function showToast(message) { 
    elements.toast.textContent = message; 
    elements.toast.classList.add('show'); 
    clearTimeout(showToast.timer); 
    showToast.timer = setTimeout(() => elements.toast.classList.remove('show'), 2400); 
  }

  async function render() {
    const query = elements.search.value.trim().toLocaleLowerCase('pt-BR');
    // const filtered = entries.filter(
    //   (entry) => Object.values(entry).some(
    //     (value) => String(value).toLocaleLowerCase('pt-BR').includes(query)
    //   )
    // );

    console.log(entries);
    const filtered = await entries
    elements.body.innerHTML = filtered.map((entry) => {
      const date = new Date(`${entry.date}T12:00:00`);
      return `<tr>
        <td>${formatDate(entry.date)}</td>
        <td>${escapeHtml(entry.category)}</td>
        <td>${escapeHtml(entry.subcategory || '—')}</td>
        <td>${escapeHtml(entry.description)}</td>
        <td class="amount">${formatCurrency(entry.value)}</td>
        <td><span class="badge ${entry.status ? 'yes' : 'no'}">${entry.paid ? 'Sim' : 'Não'}</span></td>
        <td>${escapeHtml(entry.paymentMethod)}</td>
        <td>${escapeHtml(entry.notes || '—')}</td>
        <td><div class="actions"><button class="icon-button" data-action="edit" data-id="${entry.id}" type="button">Editar</button><button class="icon-button danger" data-action="delete" data-id="${entry.id}" type="button">Excluir</button></div></td>
      </tr>`;
    }).join('');
    elements.empty.hidden = filtered.length > 0;
    elements.count.textContent = entries.length;
    elements.total.textContent = formatCurrency(entries.reduce((sum, entry) => sum + Number(entry.amount), 0));
    elements.result.textContent = `${filtered.length} ${filtered.length === 1 ? 'registro' : 'registros'}`;
  }

  function openModal(entry = null) {
    lastFocusedElement = document.activeElement;
    elements.form.reset();
    $('#entryId').value = entry?.id || '';
    elements.title.textContent = entry ? 'Editar lançamento' : 'Novo lançamento';
    if (entry) {
      $('#date').value = entry.date; $('#category').value = entry.category; $('#subcategory').value = entry.subcategory;
      $('#description').value = entry.description; $('#amount').value = entry.amount; $('#paid').value = String(entry.paid);
      $('#paymentMethod').value = entry.paymentMethod; $('#notes').value = entry.notes;
    } else { $('#date').value = new Date().toISOString().slice(0, 10); }
    elements.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#date').focus(), 0);
  }
  function closeModal() { 
    elements.modal.hidden = true; 
    document.body.style.overflow = ''; 
    lastFocusedElement?.focus(); 
  }

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = $('#entryId').value;
    const entry = { 
      date: $('#date').value, 
      category: $('#category').value.trim(), 
      subcategory: $('#subcategory').value.trim(), 
      description: $('#description').value.trim(), 
      amount: Number($('#amount').value), 
      paid: $('#paid').value === 'true', 
      paymentMethod: $('#paymentMethod').value, 
      notes: $('#notes').value.trim() 
    };
    if (id) entries = entries.map((item) => item.id === id ? entry : item); 
    else entries.unshift(entry);
    saveEntries(); 
    render(); 
    closeModal(); 
    showToast(id ? 'Lançamento atualizado.' : 'Lançamento adicionado.');
  });
  elements.body.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]'); if (!button) return;
    const entry = entries.find((item) => item.id === button.dataset.id); if (!entry) return;
    if (button.dataset.action === 'edit') openModal(entry);
    if (button.dataset.action === 'delete' && confirm(`Excluir “${entry.description}”?`)) { 
      entries = entries.filter((item) => item.id !== entry.id); 
      saveEntries(); 
      render(); 
      showToast('Lançamento excluído.'); 
    }
  });
  $('#newEntryButton').addEventListener('click', () => openModal());
  $('#closeModalButton').addEventListener('click', closeModal); 
  $('#cancelButton').addEventListener('click', closeModal);
  elements.search.addEventListener('input', render);
  elements.modal.addEventListener('click', (event) => { 
    if (event.target === elements.modal) closeModal(); 
  });
  document.addEventListener('keydown', (event) => { 
    if (event.key === 'Escape' && !elements.modal.hidden) closeModal(); 
  });
  render();
})();
