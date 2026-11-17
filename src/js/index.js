((MafiaShop) => {
const {
    initializeAnimations,
    initializeCart,
    addToCart,
    initializeCatalog,
    initializeCheckout,
    closeAll,
    initializeModal,
    toggleCartDrawer
} = MafiaShop;

initializeModal();
initializeCart();
initializeCatalog(addToCart);
initializeCheckout(toggleCartDrawer, closeAll);
initializeAnimations(closeAll);
})(window.MafiaShop);