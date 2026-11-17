((MafiaShop) => {
const { products, $, money } = MafiaShop;

const categories = ['Усе', ...new Set(products.map(product => product.categories))];

let category = 'Усе';
let sort = 'def';

function renderCatalogToolbar() {
    $('#catalog-toolbar').innerHTML = categories.map(item => `
        <button class="category-filter${item === category ? ' on' : ''}" data-c="${item}">
            ${item}
        </button>
    `).join('') + `
        <select id="sort-select" aria-label="Сортування">
            <option value="def">За замовчуванням</option>
            <option value="a"${sort === 'a' ? ' selected' : ''}>
                Спершу дешевші
            </option>
            <option value="d"${sort === 'd' ? ' selected' : ''}>
                Спершу дорожчі
            </option>
        </select>
    `;
}

function renderProductGrid() {
    let filteredProducts = products.filter(
        product => category === 'Усе' || product.categories === category
    );

    if (sort === 'a') {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === 'd') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    $('#product-grid').innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-card-visual" style="--a:${product.accent}">
                ${product.badge ? `
                    <span class="product-badge">${product.badge}</span>
                ` : ''}

                <div class="product-card-playing-cards">
                    ${product.elements.map(element => `
                        <div class="product-card-playing-card">${element}</div>
                    `).join('')}
                </div>
            </div>

            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <details>
                    <summary>Склад набору</summary>
                    <ul>
                        ${product.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </details>

                <div class="product-card-purchase">
                    <b>${money(product.price)}</b>

                    ${product.original ? `
                        <s>${money(product.original)}</s>
                    ` : ''}

                    <button class="add-to-cart-button" data-id="${product.id}">
                        У кошик
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function initializeCatalog(addProductToCart) {
    $('#catalog-toolbar').addEventListener('click', event => {
        const target = event.target;

        if (target.dataset.c) {
            category = target.dataset.c;
            renderCatalogToolbar();
            renderProductGrid();
        }
    });

    $('#catalog-toolbar').addEventListener('change', event => {
        if (event.target.id === 'sort-select') {
            sort = event.target.value;
            renderProductGrid();
        }
    });

    $('#product-grid').addEventListener('click', event => {
        const target = event.target;

        if (target.dataset.id) {
            addProductToCart(target.dataset.id);

            const button = $('#cart-button');

            button.animate(
                [{ transform: 'scale(1.12)' }, { transform: 'none' }],
                200
            );

            target.textContent = 'Додано ✓';

            setTimeout(() => {
                target.textContent = 'У кошик';
            }, 900);
        }
    });

    renderCatalogToolbar();
    renderProductGrid();
}

MafiaShop.initializeCatalog = initializeCatalog;
})(window.MafiaShop = window.MafiaShop || {});