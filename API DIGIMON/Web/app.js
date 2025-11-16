const app = document.getElementById('app');
const API_BASE_URL = 'https://digimon-api.vercel.app/api/digimon';

function renderBase(content) {
    app.innerHTML = `
        <div class="search-box">
            <input id="digi-search" type="text"
            placeholder="Digite o nome do Digimon para buscar" />
            <button id="btn-search"> Buscar </button>
            <button id="btn-list"> Listar 20 </button>
        </div>

        <div id="content"> ${content || ''} </div>

        <p> Dados da <strong> Digimon API </strong> (${API_BASE_URL}) </p>
    `;

    document.getElementById('btn-search').addEventListener('click', () => {
        const term = document.getElementById('digi-search').value.toLowerCase().trim();
        if (term) {
            loadDigimonByName(term);
        }
    });

    document.getElementById('btn-list').addEventListener('click', () => {
        loadDigimonList();
    });
}

async function loadDigimonList() {
    renderBase('<p> Carregando lista de Digimons... </p>');
    try {
        const res = await fetch(API_BASE_URL); 
        if (!res.ok) throw new Error('Erro na API');
        
        const data = await res.json(); 

        const digimonsLimitados = data.slice(0, 20); 

        const listHtml = `
            <h2> Lista de Digimons (Primeiros 20) </h2>

            <div class="digi-list">
                ${digimonsLimitados.map((d, i) => 
                    `<div class="digi-card"> 
                        <span> ${i + 1}. ${d.name}</span>
                        <button data-name="${d.name}" class="btn-detail"> Detalhes </button>
                    </div>` 
                ).join('')}
            </div>
        `;

        renderBase(listHtml);

        document.querySelectorAll('.btn-detail').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                loadDigimonByName(name);
            });
        });

    } catch (error) {
        console.error(error);
        renderBase(`<h2>Erro ao carregar a lista de digimons.</h2>
        <p> Tente novamente mais tarde. </p>`);
    }
} 

async function loadDigimonByName(name) {
    renderBase('<p> Buscando Digimon... </p>');
    try {
        const res = await fetch(`${API_BASE_URL}/name/${name}`);
        
        if (!res.ok || res.status === 404) throw new Error('Digimon não encontrado');
        
        const dataArray = await res.json();
        const data = dataArray[0];

        const html = `
            <h2>${data.name}</h2>
            <div class="digi-detail">
                <img src="${data.img}" alt="${data.name}"/>
                <div>
                <p> <strong>Level:</strong> ${data.level}</p>
                </div>
            </div>
        `;

        renderBase(html);

    } catch (error) {
        console.error(error);
        renderBase(`<h2> Erro ao carregar o digimon.</h2> 
            <p> Verifique se o nome está correto e tente novamente.</p>`);
    }
} 

loadDigimonList();
 
