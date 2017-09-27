import * as UUIDv4 from 'uuid/v4';
import * as CONFIG from '../../config';
import Input from './../input';

export default class UUID extends Input {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

        super(attributes, options);

        this._initWidget(CONFIG.WIDGETS.INPUT_HIDDEN, defaultAttributes);
    }

    _createLabel() {
        // It Doesn't Needs to Label.
    }

    /**
     *
     * @private
     */
    _createElement() {
        this.$element = $('<input>');

        this.attributes.type = CONFIG.INPUT_TYPES.TEXT;

        this.attributes.value = this.attributes.value || UUIDv4();
        this._updateData(this.attributes.value, this.attributes['data-path']);
    }

    /**
     *
     * @private
     */
    _initEvents() {

    }
}