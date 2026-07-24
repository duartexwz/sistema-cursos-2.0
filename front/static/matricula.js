async function carregarResumoPedido() {
    let curso = JSON.parse(localStorage.getItem("cursoSelecionado"));
    
    // Fallback: Busca pela URL caso não esteja no localStorage
    if (!curso) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            try {
                const resposta = await fetch("https://tecno-brasilia.fly.dev/cursos/?limit=100");
                const data = await resposta.json();
                curso = data.cursos.find(c => c.id == id);
            } catch (erro) {
                console.error("Erro ao carregar o curso pela URL:", erro);
            }
        }
    }

    const containerResumo = document.querySelector(".resumo-pedido");

    if (!curso) {
        if (containerResumo) {
            containerResumo.innerHTML = "<p class='mensagem-curso'>Nenhum curso selecionado.</p>";
        }
        return;
    }

    // Helper para converter strings de preço em números reais
    function paraNumero(valor) {
        if (typeof valor === "number") return valor;
        if (!valor) return 0;
        return Number(
            String(valor)
                .replace("R$", "")
                .trim()
                .replace(/\./g, "")
                .replace(",", ".")
        ) || 0;
    }

    // Helper para formatar em moeda brasileira (R$ X.XXX,XX)
    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // Cálculos de valores
    const valorOriginal = paraNumero(curso.precoOriginal ?? curso.preco);
    const desconto = paraNumero(curso.desconto ?? 0);
    const total = valorOriginal - desconto;
    const parcela = total / 12;

    // Injeção do HTML estruturado idêntico ao protótipo
    containerResumo.innerHTML = `
        <!-- Cabeçalho -->
        <div class="resumo-header">
            <span class="material-symbols-outlined icone-carrinho">shopping_cart</span>
            <h3>Resumo do pedido</h3>
        </div>

        <!-- Informações do Curso -->
        <div class="resumo-curso-selecionado">
            <img src="${curso.imagem}" alt="${curso.curso}">
            <div class="curso-info">
                <h4>${curso.curso}</h4>
                <p>${curso.categoria || curso.nivel || 'Formação completa'}</p>
            </div>
        </div>

        <!-- Valores -->
        <div class="resumo-valores">
            <div class="linha-valor">
                <span>Valor do curso</span>
                <span>${formatarMoeda(valorOriginal)}</span>
            </div>
            ${desconto > 0 ? `
            <div class="linha-valor desconto">
                <span>Desconto promocional</span>
                <span>- ${formatarMoeda(desconto)}</span>
            </div>` : ""}
            <div class="linha-valor subtotal">
                <span>Subtotal</span>
                <span>${formatarMoeda(total)}</span>
            </div>
        </div>

        <!-- Total -->
        <div class="resumo-total">
            <div class="linha-total">
                <span class="texto-total">Total</span>
                <span class="valor-total">${formatarMoeda(total)}</span>
            </div>
            <div class="parcelamento">
                <span>em até 12x sem juros de</span>
                <span>${formatarMoeda(parcela)}</span>
            </div>
        </div>

        <!-- Benefícios -->
        <div class="resumo-beneficios">
            <div class="beneficio-item">
                <span class="material-symbols-outlined">verified_user</span>
                <div class="beneficio-textos">
                    <h5>Ambiente 100% seguro</h5>
                    <p>Seus dados protegidos com criptografia de ponta a ponta.</p>
                </div>
            </div>
            <div class="beneficio-item">
                <span class="material-symbols-outlined">workspace_premium</span>
                <div class="beneficio-textos">
                    <h5>Seu acesso é garantido</h5>
                    <p>Acesso imediato após a confirmação do pagamento.</p>
                </div>
            </div>
            <div class="beneficio-item">
                <span class="material-symbols-outlined">calendar_today</span>
                <div class="beneficio-textos">
                    <h5>7 dias de garantia</h5>
                    <p>Você pode solicitar o reembolso em até 7 dias após a matrícula.</p>
                </div>
            </div>
        </div>
    `;
}

carregarResumoPedido();