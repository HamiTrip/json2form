import * as CONFIG from '../config';
import Base from './base';

export default class Option extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.OPTION, defaultAttributes);
    }

    /**
     * Only Call this Method from Base.
     *
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    _createElement() {
        this.$element = $('<option>');
        this.$element.text(this.attributes.text || this.attributes.title);
    }

    _initEvents() {
        // There Is Nothing Yet!
    }
}