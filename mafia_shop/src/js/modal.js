((MafiaShop) => {
const { $ } = MafiaShop;

const toggleCartDrawer = isOpen => {
    $('#cart-drawer').classList.toggle('on', isOpen);
    $('#page-overlay').classList.toggle('is-visible', isOpen);
};

const closeAll = () => {
    $('#cart-drawer').classList.remove('on');
    $('#checkout-modal').classList.remove('on');
    $('#page-overlay').classList.remove('is-visible');
};

function initializeModal() {
    $('#cart-button').onclick = () => toggleCartDrawer(true);
    $('#close-cart-button').onclick = closeAll;
    $('#page-overlay').onclick = closeAll;

    addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeAll();
        }
    });
}

MafiaShop.toggleCartDrawer = toggleCartDrawer;
MafiaShop.closeAll = closeAll;
MafiaShop.initializeModal = initializeModal;
})(window.MafiaShop = window.MafiaShop || {});