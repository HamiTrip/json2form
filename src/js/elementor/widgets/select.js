import * as CONFIG from '../config';
import Base from './base';
import Option from "./option";
import Label from "./label";

export default class Select extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.SELECT, defaultAttributes);
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
        this.$element = $('<select>');

        if (this.options.options && this.options.options.length > 0) {
            this.options.options.forEach((value) => {
                let option;

                option = new Option(value.attributes, value);

                this.$element.append(option.getElement());
            });
        }

        this.$element.val(this.attributes.value);
        delete this.attributes.value;
    }

    _initEvents() {
        this.$element.on('change', () => {
            this._updateData(this.$element.val(), this.$element.data('path'));
        });
    }
}