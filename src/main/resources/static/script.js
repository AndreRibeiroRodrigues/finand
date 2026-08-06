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
    
    const API_URL = window.location.origin === "http://localhost:8080"
      ? "http://localhost:8080"
      : "https://scaling-umbrella-7xq4pp7w9rrcrq97-8080.app.github.dev";
    
    console.log(API_URL);
    try { 
      const response = await fetch(`${API_URL}/api/despesas/get`);
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

    console.log(entries);
    const filtered = await entries
    elements.body.innerHTML = filtered.map((entry) => {
      // const date = new Date(`${entry.date}T12:00:00`);
      return `<tr>
        <td>${formatDate(entry.date)}</td>
        <td>${escapeHtml(entry.category)}</td>
        <td>${escapeHtml(entry.subcategory || '—')}</td>
        <td>${escapeHtml(entry.description)}</td>
        <td class="amount">${formatCurrency(entry.value)}</td>
        <td><span class="badge ${entry.status ? 'yes' : 'no'}">${entry.paid ? 'Sim' : 'Não'}</span></td>
        <td>${escapeHtml(entry.paymentMethod)}</td>
        <td>${escapeHtml(entry.notes || '—')}</td>
        <td><div class="actions">
        <button class="icon-button" data-action="edit" data-id="${entry.id}" type="button">Editar</button>
        <button class="icon-button danger" data-action="delete" data-id="${entry.id}" type="button">Excluir</button>
        </div>
        </td>
      </tr>`;
    }).join('');
    elements.empty.hidden = filtered.length > 0;
    elements.count.textContent =  filtered.length;
    elements.total.textContent = formatCurrency( filtered.reduce((sum, entry) => sum + Number(entry.value), 0));
    elements.result.textContent = `${ filtered.length} ${ filtered.length === 1 ? 'registro' : 'registros'}`;
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

  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();

    

    const id = $("#entryId").value;

    const entry = {
        data: $("#date").value,
        categoria: $("#category").value.trim(),
        subcategoria: $("#subcategory").value.trim(),
        descricao: $("#description").value.trim(),
        valor: Number($("#amount").value),
        pago: $("#paid").value === "true",
        formaPagamento: $("#paymentMethod").value,
        observacao: $("#notes").value.trim()
    };

    try {
        
      const API_URL = window.location.origin === "http://localhost:8080"
          ? "http://localhost:8080"
          : "https://scaling-umbrella-7xq4pp7w9rrcrq97-8080.app.github.dev";

        const method = id
            ? "PUT"
            : "POST";

        const response = await fetch(`${API_URL}/api/despesas/postDespesa`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            const mensagemErro = await response.text();

            throw new Error(
                mensagemErro ||
                `Erro HTTP: ${response.status}`
            );
        }

        const entrySalva = await response.json();

        if (id) {
            entries = entries.map((item) =>
                String(item.id) === String(id)
                    ? entrySalva
                    : item
            );
        } else {
            entries.push(entrySalva);
        }

        render();
        closeModal();

        showToast(
            id
                ? "Lançamento atualizado."
                : "Lançamento adicionado."
        );

        elements.form.reset();

    } catch (error) {
        console.error("Erro ao salvar lançamento:", error);

        showToast("Não foi possível salvar o lançamento.");
    }
  });
  elements.body.addEventListener('click', async (event) => {

    const API_URL = window.location.origin === "http://localhost:8080"
          ? "http://localhost:8080"
          : "https://scaling-umbrella-7xq4pp7w9rrcrq97-8080.app.github.dev";

    const button = event.target.closest('[data-action]'); if (!button) return;
    const entry = entries.find((item) => item.id === button.dataset.id); if (!entry) return;
    if (button.dataset.action === 'edit') openModal(entry);
    if (button.dataset.action === 'delete' && confirm(`Excluir “${entry.description}”?`)) { 
      await fetch(`${API_URL}/api/despesas/${id}`, {
        method: "DELETE"
        
      });
      
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
