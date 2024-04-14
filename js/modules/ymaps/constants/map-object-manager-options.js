export default function () {
    const objectManagerOptions = {
        clusterize: true,
        gridSize: 100,
        clusterDisableClickZoom: false,
        clusterIcons: [
            {
                href: './assets/images/cluster-icon.svg',
                size: [40, 40],
                offset: [-20, -20]
            },
            {
                href: './assets/images/cluster-icon.svg',
                size: [50, 50],
                offset: [-25, -25]
            },
            {
                href: './assets/images/cluster-icon.svg',
                size: [60, 60],
                offset: [-30, -30]
            }
        ],

        clusterNumbers: [10, 100, 1000],
        clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(
            '<div style="color: #fff; font-size: 16px;">$[properties.geoObjects.length]</div>')
    }
    return objectManagerOptions;
}