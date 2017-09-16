import * as CONFIG from '../config';
import Base from "./base";

export default class Label extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.LABEL, defaultAttributes);
    }

    /**
     * Only Call this Method from Base.
     *
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    _createElement() {
        let $label;

        $label = $('<label>');
        $label.text(this.attributes.title);

        this.$element = $label;
    }

    _initEvents() {

    }
}