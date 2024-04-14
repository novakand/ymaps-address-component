import { default as balloonContentLayout } from './ymaps-balloon-content-layout.js';

export default function () {

    const anchorTranslate = {
        'center': 'translate(-50%,-50%)',
        'top': 'translate(-50%,0)',
        'top-left': 'translate(0,0)',
        'top-right': 'translate(-100%,0)',
        'bottom': 'translate(-50%,-100%)',
        'bottom-left': 'translate(0,-100%)',
        'bottom-right': 'translate(-100%,-100%)',
        'left': 'translate(0,-50%)',
        'right': 'translate(-100%,-50%)'
    };
    const balloonLayout = ymaps.templateLayoutFactory.createClass(
        `<div class="map-infobox map-infobox-anchor-bottom"><div class="map-infobox-tip"></div><div class="map-infobox-content">
        <div class="infobox-wrapper" id="content-infobox">
            <div class="infobox-wrapper-description">
              <div class="infobox-wrapper-title">Точка №209 <a>Василий</a></div>
              <div class="infobox-wrapper-text">Каприяна Молдова (50.655113, 45.152603)</div>
              <div class="infobox-wrapper-text">Радиус: 500м</div>
            </div>
          </div>
	</div></div>`,
        {
            build() {
                console.log('build',this)
                this.constructor.superclass.build.call(this);
                this.element = document.querySelector('.map-infobox');
                this.element.addEventListener('click', this.onCloseClick.bind(this));
                this.target = this.getData().geoObject.getOverlaySync().getIconElement().querySelector('.ymaps-2-1-79-image');
                console.log(this.target,'this.target')
                this.container = this.getData().geometry.getMap().container.getElement();
                this.map = this.getData().geometry.getMap();
                this.coor = this.getData().geometry.getCoordinates();
                this.bal = this.getData().geoObject;
                this.pixelOffset = this.getOffsetTarget();
                const map = this.getData().geometry.getMap();
            },

            clear() {
                this.constructor.superclass.clear.call(this);
            },

            onDataChange() {
                const offsetBottom = this.getOffset(this.pixelOffset);
                const anchor = this.getAnchor(offsetBottom[0]);
                const offset = this.getOffset(this.pixelOffset, anchor);
                this.classes = [];
                this.classes.push('map-infobox');
                this.element.style.transform = `${anchorTranslate[anchor]} translate(${offset[0]}px,${offset[1]}px)`;
                this.classes.push(`map-infobox-anchor-${anchor}`);
                this.element.className = this.classes.join(' ');
            },


            getAnchor(bottomY) {
                const mib = this.container.getBoundingClientRect();
                const wb = this.element?.getBoundingClientRect();
                const projection = this.map.options.get('projection', {});
                const divPosition = this.map.converter.globalToPage(
                    projection.toGlobalPixels(
                        this.coor,
                        this.map.getZoom(),
                    ),
                );

                if (!mib || !wb || !divPosition) return 'bottom';

                const isTop = divPosition[1] + bottomY < wb.height;
                const isBottom = divPosition[1] > mib.height - wb.height;
                const isLeft = divPosition[0] < wb.width / 2;
                const isRight = divPosition[0] > mib.width - wb.width / 2;

                if (isTop) {
                    if (isLeft) return 'top-left';
                    if (isRight) return 'top-right';
                    return 'top';
                }
                if (isBottom) {
                    if (isLeft) return 'bottom-left';
                    if (isRight) return 'bottom-right';
                }
                if (isLeft) return 'left';
                if (isRight) return 'right';

                return 'bottom';
            },

            getOffset(offset = [0, 0], anchor = 'bottom') {
                return this.convertPoint(offset[anchor] || [0, 0]);
            },

            convertPoint(a) {
                if (Array.isArray(a)) {
                    return [a[0], a[1]];
                }
                return [a[0], a[1]];
            },

            getOffsetTarget(addOffset = [0, 0]) {
                const content = this.target.getBoundingClientRect();
                const markerHeight = content.height + addOffset[1] - (-5.8 / 2);
                const markerRadius = content.width / 2;
                const linearOffset = Math.sqrt(Math.pow(markerRadius + addOffset[0], 2) / 2);

                return {
                    'top': [linearOffset / 2, 0],
                    'top-left': [0, 0],
                    'top-right': [0, 0],
                    'bottom': [linearOffset / 2, -markerHeight],
                    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                    'left': [markerRadius + linearOffset, (markerHeight - markerRadius) * -1],
                    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
                }
            },

            createTemplate(content) {
                content.classList.add("map-infobox-content");
                htmlTemplate.appendChild(bubbleAnchor);
                htmlTemplate.appendChild(content);
                return htmlTemplate;
            },

            onSublayoutSizeChange() {
                balloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
                if (!this._isElement(this.element)) {
                    return;
                }
            },


            onCloseClick(event) {
                event.preventDefault();
                // this.events.fire('userclose');
            },
            _isElement(element) {
                return element;
            }
        }
    );

    return { balloonLayout, balloonContentLayout: balloonContentLayout() };

}