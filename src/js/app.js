$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    dots: false,
    nav: true,
    lazyLoad: true,
    responsive: {
        0: {
            items: 1
        },
        500: {
            items: 2
        },
        800: {
            items: 3
        }
    }
});

$('#slides').superslides({
    slide_easing: 'easeInOutCubic',
    slide_speed: 800,
    play: 4000,
    //pagination: true,
    //hashchange: true,
    scrollable: true
});

document.ontouchmove = function (e) {
    e.preventDefault();
};
$('#slides').hammer().on('swipeleft', function () {
    $(this).superslides('animate', 'next');
});

$('#slides').hammer().on('swiperight', function () {
    $(this).superslides('animate', 'prev');
});






