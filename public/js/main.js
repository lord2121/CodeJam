let navMenu;

function start() {
    navMenu = $(".navMenu");
    navMenu.hide();
}

function toggleNav() {
    navMenu.fadeToggle();
}