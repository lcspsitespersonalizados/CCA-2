// =========================
// CONTROLE GERAL
// =========================

// Toggle menu para mobile
function toggleMenu() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

let paginaAtual = 1;
let itensPorPagina = 3;

let filtros = {
  setor: "Todos os setores",
  status: "Todos os status",
  prioridade: "Todas as prioridades"
};

// NOTA: Não limpar localStorage mais - isso estava removendo as demandas salvas
// localStorage.removeItem('demandas'); // REMOVIDO - causa perda de dados
console.log('Iniciando sistema sem limpar localStorage (demandas serão preservadas)');

// Inicializar array de demandas (variável global local)
let demandasArray = [];

// ADICIONAR variável global
let memoriaViva = [];

// Carregar demandas do localStorage ao iniciar
function carregarDemandas() {
  console.log('carregarDemandas() iniciada');
  console.log('localStorage antes de carregar:', localStorage.length, 'chaves');
  
  try {
    const salvas = localStorage.getItem('demandas');
    console.log('Valor bruto do localStorage:', salvas);
    
    if (salvas) {
      demandasArray = JSON.parse(salvas);
      console.log('Demandas carregadas do localStorage:', demandasArray.length, 'itens');
      console.log('Demandas carregadas:', demandasArray);
    } else {
      console.log('Nenhuma demanda salva encontrada no localStorage');
      demandasArray = [];
    }
  } catch (e) {
    console.log('Erro ao carregar demandas:', e);
    demandasArray = [];
  }
  
  console.log('demandasArray após carregar:', demandasArray.length, 'itens');
}

// Salvar demandas no localStorage
function salvarDemandas() {
  console.log('salvarDemandas() iniciada');
  console.log('demandasArray antes de salvar:', demandasArray.length, 'itens');
  console.log('demandasArray antes de salvar:', demandasArray);
  
  try {
    const dadosParaSalvar = JSON.stringify(demandasArray);
    console.log('Dados para salvar (string):', dadosParaSalvar);
    
    localStorage.setItem('demandas', dadosParaSalvar);
    console.log('Demandas salvas no localStorage:', demandasArray.length, 'itens');
    
    // Verificar se foi salvo corretamente
    const verificado = localStorage.getItem('demandas');
    console.log('Verificação após salvar:', verificado);
    
  } catch (e) {
    console.log('Erro ao salvar demandas:', e);
  }
}

// ADICIONAR funções de persistência
function carregarMemoriaViva() {
  try {
    const salvas = localStorage.getItem('memoriaViva');
    if (salvas) {
      memoriaViva = JSON.parse(salvas);
    } else {
      memoriaViva = [];
    }
  } catch (e) {
    memoriaViva = [];
  }
}

function salvarMemoriaViva() {
  localStorage.setItem('memoriaViva', JSON.stringify(memoriaViva));
}

// Carregar demandas ao iniciar
carregarDemandas();
console.log('Array de demandas inicializado com localStorage:', demandasArray.length, 'itens');

// INICIALIZAÇÃO
carregarMemoriaViva();

// Renderizar memória viva ao iniciar
renderMemoriaViva();

// Renderizar tabela sempre para depuração
console.log('Iniciando renderização da tabela...');
console.log('demandasArray no início:', demandasArray.length, 'itens');
console.log('demandasArray conteúdo:', demandasArray);

// Esperar um pouco para garantir que o DOM esteja pronto
setTimeout(() => {
  renderTabela(demandasArray);
  renderMemoriaViva();
  console.log('Tabela e memória viva renderizadas com demandas carregadas');
}, 100);

// =========================
// MENU
// =========================

function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function openPage(id, el) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
  el.classList.add("active");

  // Pegar texto do span ou do elemento completo
  const span = el.querySelector('span');
  const titulo = span ? span.textContent : el.textContent;
  document.getElementById("titulo").innerText = titulo;
}

// Função para adicionar anexos
let attachments = [];

function addAttachment(type) {
  const attachment = {
    type: type,
    timestamp: new Date().toISOString()
  };
  
  attachments.push(attachment);
  
  // Alternar entre os modos: texto, imagem, áudio
  const textarea = document.getElementById('demanda-texto');
  const fileUpload = document.querySelector('.custum-file-upload');
  const audioUpload = document.querySelector('.custum-audio-upload');
  
  if (type === 'texto') {
    // Mostrar textarea e esconder uploads
    textarea.style.display = 'block';
    fileUpload.style.display = 'none';
    audioUpload.style.display = 'none';
  } else if (type === 'imagem') {
    // Esconder textarea e audio upload, mostrar image upload
    textarea.style.display = 'none';
    fileUpload.style.display = 'flex';
    audioUpload.style.display = 'none';
  } else if (type === 'audio') {
    // Esconder textarea e image upload, mostrar audio upload
    textarea.style.display = 'none';
    fileUpload.style.display = 'none';
    audioUpload.style.display = 'flex';
  }
  
  // Feedback visual temporário
  const btn = event.target;
  const originalBg = btn.style.background;
  const originalBorder = btn.style.borderColor;
  const originalColor = btn.style.color;
  
  // Aplicar estilo verde temporário
  btn.style.background = '#28a745';
  btn.style.borderColor = '#218838';
  btn.style.color = '#ffffff';
  
  // Restaurar estilo original após 300ms
  setTimeout(() => {
    btn.style.background = originalBg;
    btn.style.borderColor = originalBorder;
    btn.style.color = originalColor;
  }, 300);
}

// Função de feedback desativada
// function showAttachmentFeedback(type) {
//   let feedbackText;
//   if (type === 'texto') {
//     feedbackText = '📝 Modo texto ativado';
//   } else if (type === 'imagem') {
//     feedbackText = '📎 Imagem adicionada';
//   } else if (type === 'audio') {
//     feedbackText = '🎤 Áudio adicionado';
//   }
//   
//   // Criar elemento de feedback
//   const feedback = document.createElement('div');
//   feedback.style.cssText = `
//     position: fixed;
//     top: 20px;
//     right: 20px;
//     background: #28a745;
//     color: white;
//     padding: 10px 15px;
//     border-radius: 8px;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     z-index: 10000;
//     font-size: 14px;
//     font-weight: 500;
//     animation: slideIn 0.3s ease;
//   `;
//   
//   feedback.textContent = feedbackText;
//   document.body.appendChild(feedback);
//   
//   // Remover após 3 segundos
//   setTimeout(() => {
//     feedback.style.animation = 'slideOut 0.3s ease';
//     setTimeout(() => {
//       document.body.removeChild(feedback);
//     }, 300);
//   }, 2000);
// }

// Adicionar CSS para animações
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// =========================
// IA DE CLASSIFICAÇÃO (VERSÃO ÚNICA)
// =========================

function analisarDemanda(texto) {
  const t = texto.toLowerCase();

  // sistema de pontuação
  let pontosTI = 0;
  let pontosInfra = 0;
  let pontosRH = 0;

  let pontosAlta = 0;
  let pontosMedia = 0;

  // =========================
  // PALAVRAS TI / SISTEMAS
  // =========================
  const tiPalavras = [
    "sistema", "login", "rede", "internet", "wifi", "wi-fi", "servidor",
    "software", "plataforma", "computador", "pc", "notebook", "erro",
    "bug", "site", "aplicativo", "app", "tela", "travou", "travamento",
    "lentidão", "lento", "caindo", "instabilidade", "acesso", "senha",
    "bloqueio", "cloud", "nuvem", "dados", "arquivo", "upload", "download"
  ];

  // =========================
  // INFRAESTRUTURA
  // =========================
  const infraPalavras = [
    "piso", "teto", "parede", "estrutura", "vazamento", "água",
    "energia", "luz", "tomada", "ar-condicionado", "calor", "quente",
    "quebrado", "quebra", "manutenção", "elevador", "porta", "cadeira",
    "mesa", "ambiente físico", "obra", "reparo", "instalação"
  ];

  // =========================
  // CLASSIFICAÇÃO DE RISCO FÍSICO - INFRAESTRUTURA
  // =========================
  let riscoInfra = 0;

  // palavras de risco baixo
  const infraBaixo = ["lâmpada", "porta", "cadeira", "mesa", "pequeno", "ajuste"];

  // risco médio
  const infraMedio = ["rachadura", "vazamento", "trinca", "piso danificado", "manutenção"];

  // risco alto
  const infraAlto = ["insalubre", "quebrado", "colapso", "queda", "perigo", "risco", "estrutura comprometida", "enorme", "grande rachadura", "risco de queda", "estrutura em colapso", "risco iminente"];

  // pontuação de risco
  for (const p of infraBaixo) if (t.includes(p)) riscoInfra -= 1;
  for (const p of infraMedio) if (t.includes(p)) riscoInfra += 2;
  for (const p of infraAlto) if (t.includes(p)) riscoInfra += 4;

  // decisão de risco
  let nivelRisco = "Baixo";
  let prioridadeInfra = "Baixa";
  let complexidadeInfra = "Baixa";
  let tempoInfra = "5-10 dias";

  if (riscoInfra >= 4) {
    nivelRisco = "Alto";
    prioridadeInfra = "Alta"; // FORÇA prioridade alta obrigatória
    complexidadeInfra = "Alta";
    tempoInfra = "1-3 dias"; // FORÇA tempo urgente
  } 
  else if (riscoInfra >= 2) {
    nivelRisco = "Médio";
    prioridadeInfra = "Média";
    complexidadeInfra = "Média";
    tempoInfra = "3-7 dias";
  } 
  else {
    nivelRisco = "Baixo";
    prioridadeInfra = "Baixa";
    complexidadeInfra = "Baixa";
    tempoInfra = "5-10 dias";
  }

  // =========================
  // PALAVRAS DE CONTEXTO (RH / ORGANIZACIONAL)
  // =========================
  const rhPalavras = [
    "funcionário", "equipe", "setor", "administração", "processo",
    "documento", "atraso", "comunicação", "reunião", "treinamento"
  ];

  // =========================
  // PRIORIDADE ALTA
  // =========================
  const altaPalavras = [
    "não funciona", "sem acesso", "bloqueado", "travou tudo",
    "erro crítico", "parou", "caído", "impede", "urgente",
    "paralisou", "sem sistema", "sem internet", "totalmente fora"
  ];

  // =========================
  // PRIORIDADE MÉDIA
  // =========================
  const mediaPalavras = [
    "lento", "lentidão", "falhando", "instável", "demora",
    "intermitente", "oscila", "erro", "falha parcial"
  ];

  // =========================
  // CONTAGEM DE PONTOS
  // =========================
  for (const p of tiPalavras) if (t.includes(p)) pontosTI++;
  for (const p of infraPalavras) if (t.includes(p)) pontosInfra++;
  for (const p of rhPalavras) if (t.includes(p)) pontosRH++;

  for (const p of altaPalavras) if (t.includes(p)) pontosAlta++;
  for (const p of mediaPalavras) if (t.includes(p)) pontosMedia++;

  // =========================
  // DECISÃO DE TIPO
  // =========================
  let tipo = "Processo Organizacional";
  let setor = "RH";
  let nivelRiscoInfra = "";

  if (pontosTI >= pontosInfra && pontosTI >= pontosRH && pontosTI > 0) {
    tipo = "TI / Sistemas";
    setor = "TI";
  } else if (pontosInfra > 0 && pontosInfra >= pontosTI) {
    tipo = "Infraestrutura Física";
    setor = "Engenharia";
    nivelRiscoInfra = nivelRisco;
  } else if (pontosRH > 0) {
    tipo = "Processo Organizacional";
    setor = "RH";
  }

  // =========================
  // PRIORIDADE
  // =========================
  let prioridade = "Baixa";
  let complexidade = "Baixa";

  if (pontosAlta > 0) {
    prioridade = "Alta";
    complexidade = "Alta";
  } else if (pontosMedia > 0) {
    prioridade = "Média";
    complexidade = "Média";
  } else if (nivelRiscoInfra !== "") {
    // Usar prioridade baseada no risco da infraestrutura
    prioridade = prioridadeInfra;
    complexidade = complexidadeInfra;
  }

  // =========================
  // TEMPO
  // =========================
  let tempo = "3-7 dias";
  if (prioridade === "Alta") tempo = "1 dia";
  if (prioridade === "Média") tempo = "2-3 dias";

  return {
    tipo,
    setor_responsavel: setor,
    prioridade,
    complexidade,
    tempo_estimado: tempo,
    nivel_risco_infraestrutura: nivelRiscoInfra,
    resumo: `Classificado como ${tipo} com prioridade ${prioridade}.` 
  };
}

// =========================
// FILTRO
// =========================

function filtrarDados(dados) {
  console.log('filtrarDados() chamada com', dados.length, 'dados');
  console.log('Filtros atuais:', filtros);
  
  const resultado = dados.filter(d => {
    const setorMatch = filtros.setor === "Todos os setores" || d.setor === filtros.setor;
    const statusMatch = filtros.status === "Todos os status" || d.status === filtros.status;
    const prioridadeMatch = filtros.prioridade === "Todas as prioridades" || d.prioridade === filtros.prioridade;
    
    const match = setorMatch && statusMatch && prioridadeMatch;
    
    if (!match) {
      console.log('Item filtrado:', {
        item: d,
        setorMatch,
        statusMatch,
        prioridadeMatch
      });
    }
    
    return match;
  });
  
  console.log('Resultado da filtragem:', resultado.length, 'itens');
  return resultado;
}

// =========================
// TABELA
// =========================

function renderTabela(demandas) {
  console.log('renderTabela() chamada com', demandas.length, 'demandas');
  
  const dadosFiltrados = filtrarDados(demandas);
  console.log('Dados filtrados:', dadosFiltrados.length, 'itens');
  
  // Atualizar contador de itens no header
  const contador = document.getElementById('contador-itens');
  if (contador) {
    contador.textContent = `${dadosFiltrados.length} itens`;
  }
  
  // Ordenar por ID decrescente (mais recente primeiro)
  const dadosOrdenados = dadosFiltrados.sort((a, b) => b.id - a.id);
  console.log('Dados ordenados por ID (mais recente primeiro):', dadosOrdenados.map(d => d.id));

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const pagina = dadosFiltrados.slice(inicio, fim);
  console.log('Página atual:', pagina.length, 'itens');

  renderTableView(pagina);
  renderPaginacao(dadosFiltrados.length);
  console.log('Tabela renderizada com sucesso');
}

function renderTableView(demandas) {
  const tbody = document.querySelector("tbody");
  if (!tbody) {
    console.log('tbody não encontrado');
    return;
  }

  // Mostrar tabela, esconder grid
  const table = tbody.closest('table');
  const gridContainer = document.getElementById('grid-container');
  
  if (table) table.style.display = 'table';
  if (gridContainer) gridContainer.style.display = 'none';

  tbody.innerHTML = demandas.map(d => `
    <tr>
      <td>${d.id}</td>
      <td>${d.setor}</td>
      <td>${d.problema}</td>
      <td>${d.prioridade}</td>
      <td>${d.status}</td>
      <td>
        <button class="boton-elegante" onclick="verDemanda(${d.id})">
          Ver
        </button>
      </td>
    </tr>
  `).join("");
}

function renderGridView(demandas) {
  // Esconder tabela, mostrar grid
  const table = document.querySelector('table');
  const gridContainer = document.getElementById('grid-container');
  
  if (table) table.style.display = 'none';
  
  // Criar container grid se não existir
  if (!gridContainer) {
    const container = document.createElement('div');
    container.id = 'grid-container';
    container.className = 'grid-container';
    // Inserir após a tabela
    const tableParent = table.parentElement;
    tableParent.insertBefore(container, table.nextSibling);
  }
  
  gridContainer.style.display = 'grid';
  
  gridContainer.innerHTML = demands.map(d => `
    <div class="demand-card">
      <div class="demand-header">
        <span class="demand-id">#${d.id}</span>
        <span class="demand-setor">${d.setor}</span>
      </div>
      <div class="demand-body">
        <p class="demand-problema">${d.problema}</p>
        <div class="demand-meta">
          <span class="demand-prioridade ${d.prioridade.toLowerCase()}">${d.prioridade}</span>
          <span class="demand-status ${d.status.toLowerCase()}">${d.status}</span>
        </div>
      </div>
      <div class="demand-footer">
        <button class="boton-elegante" onclick="verDemanda(${d.id})">
          Ver Detalhes
        </button>
      </div>
    </div>
  `).join("");
  
  // Verificar se página demandas está ativa
  const demandasPage = document.getElementById('demandas');
  console.log('Página demandas encontrada:', !!demandasPage);
  
  if (!demandasPage) {
    console.log('AVISO: Não estamos na página de demandas!');
    console.log('Página atual:', document.location.href);
  }
}

// =========================
// PAGINAÇÃO
// =========================

function renderPaginacao(totalItens) {
  const container = document.getElementById("pagination-numbers");
  if (!container) return;

  const totalPaginas = Math.ceil(totalItens / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(paginaAtual * itensPorPagina, totalItens);

  // Atualizar informações
  document.getElementById('itens-inicio').textContent = inicio;
  document.getElementById('itens-fim').textContent = fim;
  document.getElementById('itens-total').textContent = totalItens;

  // Gerar números das páginas
  let numerosHTML = '';
  const maxVisible = 5;
  let startPage = Math.max(1, paginaAtual - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPaginas, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // Botão primeira página
  if (startPage > 1) {
    numerosHTML += `<button onclick="irParaPagina(1)" class="pagination-number">1</button>`;
    if (startPage > 2) {
      numerosHTML += `<span style="padding: 0 8px; color: #999;">...</span>`;
    }
  }

  // Números das páginas
  for (let i = startPage; i <= endPage; i++) {
    const activeClass = i === paginaAtual ? 'active' : '';
    numerosHTML += `<button onclick="irParaPagina(${i})" class="pagination-number ${activeClass}">${i}</button>`;
  }

  // Botão última página
  if (endPage < totalPaginas) {
    if (endPage < totalPaginas - 1) {
      numerosHTML += `<span style="padding: 0 8px; color: #999;">...</span>`;
    }
    numerosHTML += `<button onclick="irParaPagina(${totalPaginas})" class="pagination-number">${totalPaginas}</button>`;
  }

  container.innerHTML = numerosHTML;

  // Atualizar estado dos botões de navegação
  const btnAnterior = document.getElementById('btn-anterior');
  const btnProximo = document.getElementById('btn-proximo');
  
  btnAnterior.disabled = paginaAtual === 1;
  btnProximo.disabled = paginaAtual === totalPaginas;

  // Re-inicializar ícones Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function mudarPagina(direcao) {
  const totalPaginas = Math.ceil(demandasArray.length / itensPorPagina);
  
  if (direcao === 'anterior') {
    paginaAtual = Math.max(1, paginaAtual - 1);
  } else if (direcao === 'proxima') {
    paginaAtual = Math.min(totalPaginas, paginaAtual + 1);
  }
  
  renderTabela(demandasArray);
  renderPaginacao(demandasArray.length);
}

function irParaPagina(pagina) {
  const totalPaginas = Math.ceil(demandasArray.length / itensPorPagina);
  paginaAtual = Math.max(1, Math.min(pagina, totalPaginas));
  
  renderTabela(demandasArray);
  renderPaginacao(demandasArray.length);
}

// Função mudarItensPorPagina removida - itens por página fixados em 3

// =========================
// MODOS DE VISUALIZAÇÃO
// =========================

let modoVisualizacao = 'table'; // modo padrão

function mudarVisualizacao(modo) {
  modoVisualizacao = modo;
  
  // Atualizar estado dos botões
  const btnGrid = document.getElementById('btn-grid-view');
  const btnTable = document.getElementById('btn-table-view');
  
  if (modo === 'grid') {
    btnGrid.style.background = 'rgba(255,255,255,0.3)';
    btnTable.style.background = 'rgba(255,255,255,0.1)';
  } else {
    btnGrid.style.background = 'rgba(255,255,255,0.1)';
    btnTable.style.background = 'rgba(255,255,255,0.3)';
  }
  
  // Re-renderizar a tabela com o novo modo
  renderTabela(demandasArray);
}

// =========================
// AÇÕES
// =========================

function analisar() {
  const texto = document.getElementById("demanda-texto").value;
  if (!texto.trim()) return;

  const r = analisarDemanda(texto);

  // Atualizar classificações nos cards
  document.getElementById("class-tipo").innerText = r.tipo;
  document.getElementById("class-prioridade").innerText = r.prioridade;
  document.getElementById("class-setor").innerText = r.setor_responsavel;
  document.getElementById("class-complexidade").innerText = r.complexidade;
  
  // Mostrar resultado em card de lista
  mostrarResultadoCard(r);
}

function mostrarResultadoCard(resultado) {
  const resultadoDiv = document.getElementById("resultado");
  const analiseConteudo = document.getElementById("analise-conteudo");
  
  // Cor para prioridade
  let prioridadeColor = '#2e7d32'; // verde (baixa)
  if (resultado.prioridade === 'Alta') prioridadeColor = '#d32f2f'; // vermelho
  else if (resultado.prioridade === 'Média') prioridadeColor = '#f57c00'; // laranja
  
  analiseConteudo.innerHTML = `
    <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #4caf50;">
      <h5 style="margin: 0 0 10px 0; color: #2e7d32; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="brain-circuit" style="width: 16px;"></i>
        Analise de Acessibilidade
      </h5>
      <p style="margin: 0; color: #333; line-height: 1.5;">
        <strong>Tipo:</strong> ${resultado.tipo}<br>
        <strong>Prioridade:</strong> <span style="color: ${prioridadeColor}; font-weight: bold;">${resultado.prioridade}</span><br>
        <strong>Setor responsável:</strong> ${resultado.setor_responsavel}<br>
        <strong>Complexidade:</strong> ${resultado.complexidade}<br>
        <strong>Tempo estimado:</strong> ${resultado.tempo_estimado}
      </p>
    </div>
    <div style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #ff9800;">
      <h5 style="margin: 0 0 10px 0; color: #f57c00; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="file-text" style="width: 16px;"></i>
        Resumo da analise
      </h5>
      <p style="margin: 0; color: #333; line-height: 1.5;">
        ${resultado.resumo}
      </p>
    </div>
  `;
  
  resultadoDiv.style.display = "block";
  
  // Recriar ícones
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function criarDemanda() {
  console.log('criarDemanda() chamada');
  
  const texto = document.getElementById("demanda-texto").value;
  console.log('Texto:', texto);
  
  if (!texto.trim()) {
    console.log('Texto vazio, retornando');
    return;
  }

  const r = analisarDemanda(texto);
  console.log('Resultado da análise:', r);

  const demanda = {
    id: Date.now(),
    problema: texto,
    tipo: r.tipo,
    setor: r.setor_responsavel,
    prioridade: r.prioridade,
    status: "Aberto",
    tempo: r.tempo_estimado
  };
  
  console.log('Demanda criada:', demanda);
  
  // REGRA IMPORTANTE: Manter apenas
  demandasArray.push(demanda);
  console.log('Total de demandas após push:', demandasArray.length);
  console.log('demandasArray após push:', demandasArray);
  
  salvarDemandas();
  
  // Verificação imediata
  setTimeout(() => {
    const verificado = localStorage.getItem('demandas');
    console.log('Verificação 5s após salvar:', verificado);
  }, 5000);
  
  // Também tentar window.demandas para compatibilidade
  try {
    if (!window.demandas || !Array.isArray(window.demandas)) {
      window.demandas = demandasArray;
    } else {
      window.demandas.push(demanda);
    }
  } catch(e) {
    console.log('Erro com window.demandas, usando apenas array local');
  }

  // Limpar campo de texto
  document.getElementById("demanda-texto").value = "";
  
  // Limpar resultado da análise
  document.getElementById('resultado').style.display = 'none';
  
  // Resetar classificações
  document.getElementById('class-tipo').innerText = '-';
  document.getElementById('class-prioridade').innerText = '-';
  document.getElementById('class-setor').innerText = '-';
  document.getElementById('class-complexidade').innerText = '-';

  renderTabela(demandasArray);
  
  mostrarNotificacao(`Demanda criada com sucesso! Tipo: ${r.tipo} - Prioridade: ${r.prioridade}`);
}

// =========================
// FUNÇÕES ADICIONAIS
// =========================

function limparCampos() {
  // Limpar campo de texto
  document.getElementById("demanda-texto").value = "";
  
  // Limpar resultado da análise
  document.getElementById('resultado').style.display = 'none';
  
  // Resetar classificações
  document.getElementById('class-tipo').innerText = '-';
  document.getElementById('class-prioridade').innerText = '-';
  document.getElementById('class-setor').innerText = '-';
  document.getElementById('class-complexidade').innerText = '-';
  
  mostrarNotificacao('Campos limpos com sucesso!');
}

function exportar() {
  console.log('exportar() chamada');
  
  const dados = demandasArray;
  console.log('Dados para exportar:', dados.length, 'itens');
  
  if (dados.length === 0) {
    console.log('Nenhuma demanda para exportar');
    mostrarNotificacao('Nenhuma demanda para exportar!');
    return;
  }
  
  // Criar CSV
  const csv = [
    ['ID', 'Problema', 'Tipo', 'Setor', 'Prioridade', 'Status', 'Tempo'],
    ...dados.map(d => [d.id, d.problema, d.tipo, d.setor, d.prioridade, d.status, d.tempo])
  ].map(row => row.join(',')).join('\n');
  
  console.log('CSV criado, tamanho:', csv.length);
  
  // Criar blob e download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `demandas_${new Date().toISOString().split('T')[0]}.csv`;
  console.log('Iniciando download...');
  a.click();
  window.URL.revokeObjectURL(url);
  
  mostrarNotificacao('Dados exportados com sucesso!');
}

// =========================
// FUNÇÃO VER DEMANDA
// =========================

function verDemanda(id) {
  const demanda = demandasArray.find(d => d.id === id);
  if (!demanda) return;
  
  console.log('Ver demanda:', demanda);
  
  // Criar modal com backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  
  const modal = document.createElement('div');
  modal.className = 'modal-demanda';
  
  modal.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">Demanda #${demanda.id}</h3>
      <button class="modal-close" onclick="fecharModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="modal-field">
        <span class="modal-label">🏢 Setor:</span>
        <span class="modal-value">${demanda.setor}</span>
      </div>
      <div class="modal-field">
        <span class="modal-label">📝 Problema:</span>
        <span class="modal-value">${demanda.problema}</span>
      </div>
      <div class="modal-field">
        <span class="modal-label">🏷️ Tipo:</span>
        <span class="modal-value">${demanda.tipo}</span>
      </div>
      <div class="modal-field">
        <span class="modal-label">⚡ Prioridade:</span>
        <span class="modal-value modal-priority-${demanda.prioridade.toLowerCase()}">${demanda.prioridade}</span>
      </div>
      <div class="modal-field">
        <span class="modal-label">📊 Status:</span>
        <span class="modal-value modal-status-${demanda.status.toLowerCase()}">${demanda.status}</span>
      </div>
      <div class="modal-field">
        <span class="modal-label">⏱️ Tempo Estimado:</span>
        <span class="modal-value">${demanda.tempo}</span>
      </div>
      <div class="modal-field">
        <span class="modal-label">🆔 ID:</span>
        <span class="modal-value">${demanda.id}</span>
      </div>
    </div>
    <div class="modal-footer">
      <button class="boton-elegante" onclick="atualizarStatus(${demanda.id}, 'Em andamento')" style="background: linear-gradient(135deg, #17a2b8, #138496); margin-right: 10px;">
        🔄 Em Andamento
      </button>
      <button class="boton-elegante" onclick="atualizarStatus(${demanda.id}, 'Resolvido')" style="background: linear-gradient(135deg, #28a745, #218838); margin-right: 10px;">
        ✅ Resolvido
      </button>
      <button class="boton-elegante" onclick="fecharModal()">
        ❌ Fechar
      </button>
    </div>
  `;
  
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  
  // Adicionar classe active para mostrar com animação
  setTimeout(() => {
    backdrop.classList.add('active');
  }, 10);
  
  // Fechar com ESC
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      fecharModal();
    }
  };
  
  document.addEventListener('keydown', handleEsc);
  
  // Fechar clicando no backdrop
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      fecharModal();
    }
  });
}

function fecharModal() {
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(backdrop);
    }, 300);
  }
  
  document.removeEventListener('keydown', handleEsc);
}

// =========================
// FUNÇÃO DE RENDERIZAÇÃO DA MEMÓRIA VIVA
// =========================

function renderMemoriaViva() {
  console.log('renderMemoriaViva() chamada com', memoriaViva.length, 'itens');
  
  const container = document.getElementById('memoria-viva-lista');
  if (!container) {
    console.log('Container memoria-viva-lista não encontrado');
    return;
  }
  
  if (memoriaViva.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 10px;">📚</div>
        <h3 style="color: #0a4d33; margin-bottom: 10px;">Memória Viva</h3>
        <p>Nenhuma demanda resolvida ainda.</p>
      </div>
    `;
    return;
  }
  
  // Ordenar memória viva por ID decrescente (mais recente primeiro)
  memoriaViva.sort((a, b) => b.id - a.id);
  console.log('Memória viva ordenada (mais recente primeiro):', memoriaViva.map(d => d.id));
  
  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #0a4d33; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        📚 Memória Viva (${memoriaViva.length} itens)
      </h3>
    </div>
    <div style="display: grid; gap: 20px;">
      ${memoriaViva.map(d => `
        <div class="card-memoria" style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-left: 4px solid #2e7d32; border-radius: 12px; padding: 25px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); transition: all 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #0a4d33; font-size: 1.3rem; font-weight: 700;">Demanda #${d.id}</h3>
            <span style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); color: #2e7d32; padding: 6px 16px; border-radius: 25px; font-size: 0.9rem; font-weight: 600;">✅ Resolvido</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="color: #333; font-weight: 600; margin-bottom: 15px;">${d.problema}</p>
          </div>
          
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">🏢 Setor</div>
              <div style="font-weight: 600; color: #0a4d33;">${d.setor}</div>
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">🏷️ Tipo</div>
              <div style="font-weight: 600; color: #0a4d33;">${d.tipo}</div>
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">⚡ Prioridade</div>
              <div style="font-weight: 600; color: #0a4d33;">${d.prioridade}</div>
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 5px;">⏱️ Tempo</div>
              <div style="font-weight: 600; color: #0a4d33;">${d.tempo}</div>
            </div>
          </div>
          
          <div style="text-align: right;">
            <button class="botao-relatorio" onclick="verRelatorioDemanda(${d.id})">
              <span class="transition"></span>
              <span class="gradient"></span>
              <span class="label">Ver Relatório</span>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  console.log('Memória Viva renderizada com sucesso');
  
  // Atualizar contadores
  atualizarContadoresMemoriaViva();
}

// =========================
// FUNÇÕES AUXILIARES DA MEMÓRIA VIVA
// =========================

function atualizarContadoresMemoriaViva() {
  const contadorElemento = document.getElementById('contador-memoria-viva');
  const tempoElemento = document.getElementById('contador-economia-tempo');
  
  if (contadorElemento) {
    contadorElemento.textContent = memoriaViva.length;
  }
  
  if (tempoElemento) {
    // Calcular tempo economizado (estimativa: 2h por demanda resolvida)
    const horasEconomizadas = memoriaViva.length * 2;
    tempoElemento.textContent = `${horasEconomizadas}h`;
  }
}


function gerarRelatorioDemanda(d) {
  let metodo = "";
  let justificativa = "";
  let impacto = "";
  let explicacaoTempo = "";
  let estilo = "";

  if (d.tipo.includes("TI")) {
    metodo = "ajuste de sistema, correção de falhas e otimização de conectividade";
    justificativa = "o problema estava relacionado a instabilidade em rede, sistema ou acesso digital";
    impacto = "redução de falhas de conectividade e aumento da estabilidade dos serviços digitais";
    estilo = "O diagnóstico foi baseado na análise do comportamento da rede e do sistema, com aplicação de ajustes técnicos na infraestrutura digital.";
  } 
  else if (d.tipo.includes("Infraestrutura")) {
    metodo = "correção estrutural, manutenção física e inspeção técnica do ambiente";
    justificativa = "o problema estava relacionado às condições do piso e do espaço operacional";
    impacto = "melhoria nas condições de segurança e funcionamento do ambiente operacional";
    estilo = "A intervenção foi realizada diretamente no local, com correção dos pontos afetados e adequação das condições de uso.";
  } 
  else {
    metodo = "análise de fluxo, alinhamento organizacional e ajuste de processo interno";
    justificativa = "o problema estava relacionado a falhas de comunicação ou organização interna";
    impacto = "melhoria na comunicação interna e maior fluidez entre setores";
    estilo = "A situação foi tratada com foco na análise do fluxo de trabalho e alinhamento entre as áreas envolvidas.";
  }

  if (d.prioridade === "Alta") {
    explicacaoTempo = "devido ao impacto direto nas operações e necessidade de resposta imediata";
  } else if (d.prioridade === "Média") {
    explicacaoTempo = "devido à necessidade de análise antes da correção completa";
  } else {
    explicacaoTempo = "devido à baixa complexidade e fácil resolução";
  }

  return `
RELATÓRIO DE RESOLUÇÃO – DEMANDA #${d.id}

Problema: ${d.problema}. Método aplicado: ${metodo}, uma vez que ${justificativa}. ${estilo} Tempo de resolução: ${d.tempo}, ${explicacaoTempo}. O sistema CCA automatizou a triagem da demanda, direcionando corretamente para o setor responsável e reduzindo o tempo de análise manual, o que aumentou a eficiência do processo. Como resultado, houve ${impacto}. Conclusão: a solução aplicada foi compatível com o tipo de problema identificado e contribuiu para a melhoria do fluxo operacional.
  `;
}

function verRelatorioDemanda(id) {
  const demanda = memoriaViva.find(d => d.id === id);
  if (!demanda) return;
  
  console.log('Ver relatório da demanda:', demanda);
  
  // Se a demanda já tem relatório, usa; senão, gera
  const relatorio = demanda.relatorio || gerarRelatorioDemanda(demanda);
  
  // Criar modal para exibir relatório
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  
  const modal = document.createElement('div');
  modal.className = 'modal-relatorio';
  
  modal.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">📋 Relatório - Demanda #${demanda.id}</h3>
      <button class="modal-close" onclick="fecharModalRelatorio()">×</button>
    </div>
    <div class="modal-body">
      <div class="relatorio-container">
        <pre style="white-space: pre-wrap; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 0.95rem; line-height: 1.6; color: #2c3e50; margin: 0; background: transparent; border: none;">${relatorio}</pre>
      </div>
      
      <div class="info-demanda" style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 8px; border: 1px solid #e9ecef;">
        <h4 style="margin: 0 0 10px 0; color: #0a4d33; font-size: 1rem;">📊 Informações da Demanda</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
          <div>
            <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">🏢 Setor</div>
            <div style="font-weight: 600; color: #0a4d33;">${demanda.setor}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">🏷️ Tipo</div>
            <div style="font-weight: 600; color: #0a4d33;">${demanda.tipo}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">⚡ Prioridade</div>
            <div style="font-weight: 600; color: #0a4d33;">${demanda.prioridade}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">⏱️ Tempo</div>
            <div style="font-weight: 600; color: #0a4d33;">${demanda.tempo}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="boton-elegante" onclick="copiarRelatorio('${relatorio.replace(/'/g, "\\'")}')" style="background: linear-gradient(135deg, #007bff, #0056b3); margin-right: 10px;">
        📋 Copiar Relatório
      </button>
      <button class="boton-elegante" onclick="fecharModalRelatorio()">
        ❌ Fechar
      </button>
    </div>
  `;
  
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  
  // Adicionar classe active para mostrar com animação
  setTimeout(() => {
    backdrop.classList.add('active');
  }, 10);
  
  // Fechar com ESC
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      fecharModalRelatorio();
    }
  };
  
  document.addEventListener('keydown', handleEsc);
  
  // Fechar clicando no backdrop
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      fecharModalRelatorio();
    }
  });
}

function fecharModalRelatorio() {
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(backdrop);
    }, 300);
  }
  
  document.removeEventListener('keydown', handleEsc);
}

function copiarRelatorio(texto) {
  navigator.clipboard.writeText(texto).then(() => {
    mostrarNotificacao('Relatório copiado para a área de transferência!', 'success');
  }).catch(() => {
    mostrarNotificacao('Erro ao copiar relatório', 'error');
  });
}

// =========================
// FUNÇÕES AUXILIARES DA MEMÓRIA VIVA
// =========================

function atualizarContadoresMemoriaViva() {
  const contadorElemento = document.getElementById('contador-memoria-viva');
  const tempoElemento = document.getElementById('contador-economia-tempo');
  
  if (contadorElemento) {
    contadorElemento.textContent = memoriaViva.length;
  }
  
  if (tempoElemento) {
    // Calcular tempo economizado (estimativa: 2h por demanda resolvida)
    const horasEconomizadas = memoriaViva.length * 2;
    tempoElemento.textContent = `${horasEconomizadas}h`;
  }
}

function buscarMemoriaViva() {
  const termoBusca = document.getElementById('busca-memoria-viva').value.toLowerCase();
  
  if (!termoBusca) {
    renderMemoriaViva();
    return;
  }
  
  const filtradas = memoriaViva.filter(demanda => 
    demanda.problema.toLowerCase().includes(termoBusca) ||
    demanda.setor.toLowerCase().includes(termoBusca) ||
    demanda.tipo.toLowerCase().includes(termoBusca) ||
    demanda.prioridade.toLowerCase().includes(termoBusca)
  );
  
  const container = document.getElementById('memoria-viva-lista');
  if (!container) return;
  
  if (filtradas.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
        <h3 style="color: #0a4d33; margin-bottom: 10px;">Nenhuma demanda encontrada</h3>
        <p>Nenhuma demanda resolvida corresponde à busca "${termoBusca}".</p>
      </div>
    `;
    return;
  }
  
  // Renderizar resultados filtrados
  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #0a4d33; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        🔍 Resultados da busca (${filtradas.length} itens)
      </h3>
    </div>
    <div style="display: grid; gap: 15px;">
      ${filtradas.map(demanda => `
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-left: 4px solid #2e7d32; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #0a4d33; font-size: 1.1rem; font-weight: 600;">#${demanda.id}</h4>
            <span style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">✅ Resolvido</span>
          </div>
          
          <div style="margin-bottom: 10px;">
            <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${demanda.problema}</div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
            <div>
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">🏢 Setor</div>
              <div style="font-weight: 600; color: #0a4d33;">${demanda.setor}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">🏷️ Tipo</div>
              <div style="font-weight: 600; color: #0a4d33;">${demanda.tipo}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">⚡ Prioridade</div>
              <div style="font-weight: 600; color: #0a4d33;">${demanda.prioridade}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">⏱️ Tempo</div>
              <div style="font-weight: 600; color: #0a4d33;">${demanda.tempo}</div>
            </div>
          </div>
          <div style="margin-top: 15px; text-align: right;">
            <button class="botao-relatorio" onclick="verRelatorioDemanda(${demanda.id})">
              <span class="transition"></span>
              <span class="gradient"></span>
              <span class="label">Ver Relatório</span>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// =========================
// FUNÇÕES DE MEMÓRIA VIVA
// =========================

// FUNÇÃO PARA MOVER PARA MEMÓRIA VIVA
function moverParaMemoriaViva(id) {
  const index = demandasArray.findIndex(d => d.id === id);
  if (index === -1) return;

  const demanda = demandasArray[index];

  if (demanda.status !== "Resolvido") return;

  memoriaViva.push(demanda);
  salvarMemoriaViva();

  demandasArray.splice(index, 1);
  salvarDemandas();

  renderTabela(demandasArray);
}

// FUNÇÃO DE ATUALIZAÇÃO DE STATUS
function atualizarStatus(id, novoStatus) {
  const demanda = demandasArray.find(d => d.id === id);
  if (!demanda) return;

  demanda.status = novoStatus;

  if (novoStatus === "Resolvido") {
    // Gerar relatório automático
    const relatorio = gerarRelatorioDemanda(demanda);

    // Adicionar à memória viva com relatório
    memoriaViva.push({
      ...demanda,
      relatorio: relatorio
    });
    salvarMemoriaViva();
    
    // Remover de demandasArray
    const index = demandasArray.findIndex(d => d.id === id);
    if (index !== -1) {
      demandasArray.splice(index, 1);
    }
    
    // Salvar demandasArray
    salvarDemandas();
    
    // Atualizar tabela de demandas
    renderTabela(demandasArray);
    
    // Atualizar memória viva
    renderMemoriaViva();
    
    // Fechar modal
    fecharModal();
    
    mostrarNotificacao('Demanda resolvida e relatório gerado!', 'success');
  } else {
    salvarDemandas();
    renderTabela(demandasArray);
    fecharModal();
  }
}

// =========================
// FUNÇÕES DE FILTRO
// =========================

function aplicarFiltros() {
  console.log('aplicarFiltros() chamada');
  
  // Verificar se página correta está ativa
  const demandasPage = document.getElementById('demandas');
  console.log('Página demandas encontrada:', !!demandasPage);
  
  // Listar todos os selects na página
  const todosSelects = document.querySelectorAll('select');
  console.log('Todos os selects encontrados:', todosSelects.length);
  todosSelects.forEach((select, index) => {
    console.log(`Select ${index}:`, select.id, 'valor:', select.value);
  });
  
  // Atualizar objeto de filtros
  const setorSelect = document.getElementById('filtro-setor');
  const statusSelect = document.getElementById('filtro-status');
  const prioridadeSelect = document.getElementById('filtro-prioridade');
  
  console.log('Selects encontrados:', {
    setor: !!setorSelect,
    status: !!statusSelect,
    prioridade: !!prioridadeSelect
  });
  
  if (setorSelect) {
    filtros.setor = setorSelect.value;
    console.log('Setor selecionado:', setorSelect.value);
  }
  if (statusSelect) {
    filtros.status = statusSelect.value;
    console.log('Status selecionado:', statusSelect.value);
  }
  if (prioridadeSelect) {
    filtros.prioridade = prioridadeSelect.value;
    console.log('Prioridade selecionada:', prioridadeSelect.value);
  }
  
  console.log('Filtros atualizados:', filtros);
  console.log('DemandasArray antes de filtrar:', demandasArray.length);
  
  // Resetar página e renderizar tabela
  paginaAtual = 1;
  renderTabela(demandasArray);
  
  console.log('Tabela renderizada com filtros');
  mostrarNotificacao('Filtros aplicados com sucesso!');
}

function limparFiltros() {
  // Resetar filtros
  filtros = {
    setor: "Todos os setores",
    status: "Todos os status",
    prioridade: "Todas as prioridades"
  };
  
  // Resetar selects
  const setorSelect = document.getElementById('filtro-setor');
  const statusSelect = document.getElementById('filtro-status');
  const prioridadeSelect = document.getElementById('filtro-prioridade');
  
  if (setorSelect) setorSelect.value = 'Todos os setores';
  if (statusSelect) statusSelect.value = 'Todos os status';
  if (prioridadeSelect) prioridadeSelect.value = 'Todas as prioridades';
  
  // Resetar página e renderizar
  paginaAtual = 1;
  renderTabela(demandasArray);
  
  console.log('Filtros limpos');
  mostrarNotificacao('Filtros limpos!');
}

// =========================
// POPUP ELEGANTE
// =========================

function mostrarNotificacao(msg, type = 'success') {
  // Criar popup se não existir
  let popup = document.getElementById('notification-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'notification-popup';
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-size: 14px;
      font-weight: 500;
      max-width: 300px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(popup);
  }
  
  // Definir cor baseada no tipo
  const colors = {
    success: 'linear-gradient(135deg, #28a745, #218838)',
    error: 'linear-gradient(135deg, #dc3545, #c82333)',
    info: 'linear-gradient(135deg, #17a2b8, #138496)'
  };
  
  // Aplicar estilo
  popup.style.background = colors[type] || colors.success;
  popup.style.color = 'white';
  popup.textContent = msg;
  
  // Mostrar popup
  popup.style.opacity = '1';
  popup.style.transform = 'translateX(0)';
  
  // Auto-remover após 3 segundos
  setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 300);
  }, 3000);
}
