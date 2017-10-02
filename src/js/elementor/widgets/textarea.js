import * as CONFIG from '../config';
import Base from './base';
import Label from "./label";

export default class TextArea extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {   };

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.INPUT, defaultAttributes);
    }

    _createLabel() {
        let label;

        label = new Label(
            this.attributes,
            this.options
        );

        this.$label = label.getElement();
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