(function (MafiaShop) {
    MafiaShop.$ = selector => document.querySelector(selector);

    MafiaShop.money = value => value.toLocaleString('uk-UA') + ' ₴';
})(window.MafiaShop = window.MafiaShop || {});
