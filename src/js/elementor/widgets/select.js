import * as CONFIG from '../config';
import Base from './base';
import Option from "./option";

export default class Select extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.SELECT, defaultAttributes);
    }

    /**
     * Only Call this Method from Base.
     *
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    _createElement() {
        this.$element = $('<select>');

        if (this.options.values && this.options.values.length > 0) {
            this.options.values.forEach((value) => {
                let option;

                option = new Option(value.attributes, {});

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