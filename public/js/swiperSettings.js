let windowWidth = window.innerWidth;
function deviceType() {
    if (windowWidth >= 1400) return "xxl";
    if (windowWidth >= 1200) return "xl";
    if (windowWidth >= 992) return "lg";
    if (windowWidth >= 768) return "md";
    if (windowWidth >= 576) return "sm";
    return "xs";
}

function swiperSettings() {
    console.log(windowWidth)
    if (windowWidth >= 992) return {
        slidesPerView: 3,
        spaceBetween: 30
    }
    return {
        direction: "vertical",
        slidesPerView: 1,
        spaceBetween: 30
    }
}

const swiper = new Swiper('.swiper', swiperSettings());