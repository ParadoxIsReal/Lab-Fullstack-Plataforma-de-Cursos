import {
 renderTabela, salvarTarefa,
 editarTarefa, excluirTarefa
} from './controle/TarefaControle.mjs';

// Expõe funções globalmente (necessário pois HTML usa onclick="...")
Object.assign(window, {
 renderTabela,
 salvarTarefa,
 editarTarefa,
 excluirTarefa
});

// Inicializa a tabela ao carregar
document.addEventListener('DOMContentLoaded', renderTabela);