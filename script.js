// Função para tornar mais prático a captura de elementos
const c = (el)=> document.querySelector(el);
const ca = (el)=> document.querySelectorAll(el);

//Armazena a quantidade de items(pizzas)
let = modalQt = 1;

// Armazena todas as informaçoes da pizza nesse array carrinho
let carrinho = [];

// Adiciona o index de cada item do array pizzaJson para podermos utilizar quando o modal for fechado
let modalKey = 0;

// Listagem das Pizzas
pizzaJson.map((pizza, index) => {
    // Clona o pizza-item com todos os atributos e valores
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //Atribuímos o index do array ao data-key para sabermos qual pizza está sendo selecionada
    pizzaItem.setAttribute('data-key', index);

    // Adiciona as informações de cada pizza
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`; 

    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;

    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;

    // Adiciona um evento de click a tag a, que rodará essa função callback
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        //Remove o evento padrão de atualizar a página
        e.preventDefault(); 

        //o método closest() retorna o ancestral mais próximo
        const key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key
    
        // ADICIONA AS INFORMAÇÕES DE CADA PIZZA DENTRO DO MODAL
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; 

        //Remove a class selected,para fazer uma condição come ela logo abaixo
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //Percorre todos os itens com essa classe e adiciona o tamanho especifico de cada um
        ca(".pizzaInfo--size").forEach((size, sizeIndex) => {

            //Se o sizeIndex for igual a 2(index da pizza tamanho grande) adicione a class selected
            //Faz com que a pizza grande sempre comece selecionada(marketing)
            if(sizeIndex === 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        // Quantidade de pizzas
        c('.pizzaInfo--qt').innerHTML = modalQt;



        //EFEITO DE TRANSIÇÃO NO MODAL FEITO COM OPACITY
        // Seta a opacidade do modal para 0      
        c('.pizzaWindowArea').style.opacity = 0;

        //Seta display flex para o modal(no css estava display none)
        c('.pizzaWindowArea').style.display = "flex";

        //Para realizar o efeito de transition, usar timeOut
        setTimeout(() =>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200) // 1/5 de segundo
    });

    // PRENCHER AS INFORMAÇÕES EM PIZZAITEM
    c('.pizza-area').append(pizzaItem); //append(), pega o conteúdo já existente e adiciona mais um conteúdo, diferente do innerHTML que substitui o conteúdo

});

// EVENTOS DO MODAL
// FUNÇAO QUE QUANDO EXECUTADA FECHA O MODAL
const closeModal = () => {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = "none";
    }, 500)
};

// Percorre essas duas classes e adiciona um evento de click que executa a função closeModal
ca('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//Adicionar ou retirar uma pizza 
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++; //Adiciona um toda vez que a função for acionada
    c('.pizzaInfo--qt').innerHTML = modalQt; //Exibi na tela o novo valor de modalQt
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) { //Verificação para garantir que sempre tera pelomenos 1pizza no carrinho
        modalQt--; //Subtrai um toda vez que a função for acionada
        c('.pizzaInfo--qt').innerHTML = modalQt; //Exibi na tela o novo valor de modalQt
    };
});

// Selecionar o tamanho da pizza desejada
ca(".pizzaInfo--size").forEach((size) => { //Utilizado para que evento seja executado em todas as class pizzaInfo-size
    size.addEventListener('click', () => { //Adiciona um evento de click aos 3 tamanhos disponiveis
        c('.pizzaInfo--size.selected').classList.remove('selected'); //Remove a class selected 
        size.classList.add('selected'); //Adiciona a class selectd
    });
});

// Adiciona um evendo no button adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    //Qual tamanho?
    //O atribute data-key ira identificar qual pizza está sendo selecionada
    let size = +c('.pizzaInfo--size.selected').getAttribute('data-key'); 

    // Para adicionar a quantidade de pizzas de pedidos iguais quando o modal for aberto e fechado novamente
    let identifier = pizzaJson[modalKey].id+'@'+size; //Toda pizza que tiver o mesmo tamanho terá esse identificador
    
    //Verifica se os identifier de cada item dentro do carrinho é igual ao meu identifier
    let key = carrinho.findIndex((item) => item.identifier === identifier);

    if(key > -1) { 
        carrinho[key].qt += modalQt;
    } else { // Adicionar ao carrinho
        carrinho.push({
            identifier,
            id:pizzaJson[modalKey].id, //Qual pizza?
            size, //Qual tamanho?
            qt:modalQt //Quntidade de pizzas?
        });
    }

    updateCart(); //Atualiza o carrinho de compras
    closeModal(); //Fecha o modal
});

// ATUALIZAR O CARRINHO DE COMPRAS
const updateCart = () => {
    // Adiciona no carrinho mobile a quantidade de pizzas
    c('.menu-openner span').innerHTML = carrinho.length;

    if(carrinho.length > 0) { //Se o carrinho tiver ao menos um item selecionado...

        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in carrinho) { //Pega cada um dos itens dentro de carrinho 

            //Se o id de pizzaJson for igual o id do array carrinho ele retorna o item completo(img, price, sizes ....)
            let pizzaItem = pizzaJson.find((item) => item.id === carrinho[i].id);
            subtotal += pizzaItem.price * carrinho[i].qt; //Soma o valor das pizzas adicionas ao carrinho

            //Clona a class cart--item 
            let cartItem = c('.models .cart--item').cloneNode(true);

            // Tamanho da pizza e o nome
            let pizzaSizeName;
            switch(carrinho[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;


            // Adiciona as informações de cada pizza
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].qt;

            //Aumentar ou diminuir a quantidade de pizzas no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(carrinho[i].qt > 1) {  
                    carrinho[i].qt--;
                } else {
                    carrinho.splice(i, 1); //Caso a qtd de pizza seja menor do que um, irá remover o item do carrinho
                };

                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                carrinho[i].qt++;
                updateCart();
            });
           

            // PRENCHEr AS INFORMAÇÕES EM cartItem
            c('.cart').append(cartItem);
            
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else { //Se não tiver nenhum item..
        c('aside').classList.remove('show');
    };
};

