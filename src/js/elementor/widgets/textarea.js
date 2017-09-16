import * as CONFIG from '../config';
import Base from './base';

export default class TextArea extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {   };

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.INPUT, defaultAttributes);
    }

    /**
     * Only Call this Method from Base.
     *
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    _createElement() {
        this.$element = $('<textarea>');
    }

    _initEvents() {

    }
}