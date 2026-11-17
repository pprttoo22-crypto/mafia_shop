((MafiaShop) => {
const { clearCart, renderCart, $, money } = MafiaShop;

function showCheckoutModal(content) {
    $('#checkout-modal').innerHTML = content;
    $('#checkout-modal').classList.add('on');
    $('#page-overlay').classList.add('is-visible');
}

function checkout(toggleCartDrawer, closeAll) {
    showCheckoutModal(`
        <h2>ОФОРМЛЕННЯ</h2>

        <form id="checkout-form">
            <label>
                Ім’я
                <input name="name" required autocomplete="name">
            </label>

            <label>
                Телефон
                <input name="telephone" type="tel" required autocomplete="tel">
            </label>

            <label>
                Місто та відділення доставки
                <input name="address-delivery" required>
            </label>

            <p class="checkout-note">
                Разом до сплати: <b>${money(renderCart())}</b>.
                Це демонстраційна вітрина: замовлення нікуди не надсилається й оплата не проводиться —
                для реального продажу потрібно підключити сервер і платіжну систему.
            </p>

            <div class="checkout-actions">
                <button type="button" id="return-to-cart">Назад</button>
                <button class="checkout-button go">Підтвердити</button>
            </div>
        </form>
    `);

    $('#return-to-cart').onclick = () => {
        $('#checkout-modal').classList.remove('on');
        toggleCartDrawer(true);
    };

    $('#checkout-form').onsubmit = event => {
        event.preventDefault();

        const name = new FormData(event.target).get('name');

        clearCart();

        showCheckoutModal(`
            <h2>ДЯКУЄМО, ${String(name).toUpperCase()}</h2>

            <p class="checkout-note" style="margin-top:0;font-size:14px">
                Демо-замовлення сформовано. Кошик очищено. Пам’ятайте: у кожного своя роль.
            </p>

            <div class="checkout-actions">
                <button class="checkout-button" id="close-checkout">Закрити</button>
            </div>
        `);

        $('#close-checkout').onclick = closeAll;
    };
}

function initializeCheckout(toggleCartDrawer, closeAll) {
    $('#checkout-button').onclick = () => checkout(toggleCartDrawer, closeAll);
}

MafiaShop.initializeCheckout = initializeCheckout;
})(window.MafiaShop = window.MafiaShop || {});