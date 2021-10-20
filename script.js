// Função para tornar mais prático a captura de elementos
const c = (el)=> document.querySelector(el);
const ca = (el)=> document.querySelectorAll(el);

//Armazena a quantidade de items(pizzas)
let = modalQt = 1;

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
    
        // Adiciona as informações de cada pizza dentro do modal
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



        //Efeito de transição no modal feito com opacity
        // Seta a opacidade do modal para 0      
        c('.pizzaWindowArea').style.opacity = 0;

        //Seta display flex para o modal(no css estava display none)
        c('.pizzaWindowArea').style.display = "flex";

        //Para realizar o efeito de transition, usar timeOut
        setTimeout(() =>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200) // 1/5 de segundo
    })

    // Prencher as informações em pizzaItem
    c('.pizza-area').append(pizzaItem); //append(), pega o conteúdo já existente e adiciona mais um conteúdo, diferente do innerHTML que substitui o conteúdo

})