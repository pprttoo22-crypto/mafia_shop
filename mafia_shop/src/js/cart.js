((MafiaShop) => {
const { products, $, money } = MafiaShop;

let cart = {};

function save() {
    try {
        localStorage.setItem('mafia-cart', JSON.stringify(cart));
    } catch (e) {
    }
}

function renderCart() {
    const ids = Object.keys(cart).filter(
        key => cart[key] > 0 && products.find(product => product.id == key)
    );

    let sum = 0;
    let count = 0;

    $('#cart-items').innerHTML = ids.length
        ? ids.map(key => {
            const product = products.find(item => item.id == key);
            const quantity = cart[key];

            sum += product.price * quantity;
            count += quantity;

            return `
                <div class="cart-item">
                    <span>
                        ${product.name}
                        <small>${money(product.price)}</small>
                    </span>

                    <span class="cart-item-quantity">
                        <button data-m="${key}">−</button>
                        ${quantity}
                        <button data-pl="${key}">+</button>
                    </span>
                </div>
            `;
        }).join('')
        : '<div class="cart-empty-message">Кошик порожній. Колоди чекають на вас.</div>';

    $('#cart-count').textContent = count;
    $('#cart-total').textContent = money(sum);
    $('#checkout-button').disabled = !count;

    save();

    return sum;
}

function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
}

function clearCart() {
    cart = {};
    renderCart();
}

function initializeCart() {
    try {
        cart = JSON.parse(localStorage.getItem('mafia-cart') || '{}') || {};
    } catch (e) {
        cart = {};
    }

    $('#cart-items').addEventListener('click', event => {
        const target = event.target;

        if (target.dataset.pl) {
            cart[target.dataset.pl]++;
            renderCart();
        } else if (target.dataset.m) {
            cart[target.dataset.m]--;

            if (cart[target.dataset.m] <= 0) {
                delete cart[target.dataset.m];
            }

            renderCart();
        }

    });

    renderCart();
}

MafiaShop.renderCart = renderCart;
MafiaShop.addToCart = addToCart;
MafiaShop.clearCart = clearCart;
MafiaShop.initializeCart = initializeCart;
})(window.MafiaShop = window.MafiaShop || {});