import * as CONFIG from '../config';
import Base from "./base";

export default class Label extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.LABEL, defaultAttributes);
    }

    _createValidationErrors() {
        // No Validation Errors Is Required!
    }

    _createLabel() {
        // It Doesn't Needs to Label!
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

        this.attributes.class = this.attributes.class.replace(/form-control/g, '');

        this.$element = $label;
    }

    _initEvents() {

    }
}