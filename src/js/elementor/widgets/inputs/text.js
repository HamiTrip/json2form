import * as CONFIG from '../../config';
import Input from './../input';

export default class Text extends Input {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.INPUT_TEXT, defaultAttributes);
    }

    /**
     *
     * @private
     */
    _createElement() {
        this.$element = $('<input>');

        this.attributes.type = CONFIG.INPUT_TYPES.TEXT;
    }

    /**
     *
     * @private
     */
    _initEvents() {
        this.$element.on('input', () => {
            this._updateData(this.$element.val(), this.$element.data('path'));
        });
    }
}