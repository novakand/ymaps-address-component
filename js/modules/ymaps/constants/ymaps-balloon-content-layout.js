export default function () {
    const balloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
        '<div class="popover-content">$[properties.balloonContent]</div>'
    );
    return balloonContentLayout;
}