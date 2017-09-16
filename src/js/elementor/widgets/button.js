import * as CONFIG from '../config';
import Base from './base';

export default class Button extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.BUTTON, defaultAttributes);
    }

    /**
     * Only Call this Method from Base.
     *
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    _createElement() {
        let $element;

        $element = $('<button>');
        $element.text(this.attributes.title);

        this.$element = $element;

    }

    _initEvents() {

    }
}