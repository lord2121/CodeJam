let navMenu;
let windowHeight;
function start() {
    navMenu = $(".navMenu");
    navMenu.hide();
    windowWidth = window.innerWidth;
}
function toggleNav() {
    navMenu.fadeToggle();
}