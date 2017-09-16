import * as CONFIG from '../config';
import Base from './base';

export default class Input extends Base {
    constructor(attributes, options) {
        let defaultAttributes;

        defaultAttributes = {};

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
        this.$element = $('<input>');
        this.attributes.type = CONFIG.INPUT_TYPES.TEXT;

        if (this.options.validations) {
            for (let inputType in CONFIG.INPUT_TYPES) {
                if (CONFIG.INPUT_TYPES.hasOwnProperty(inputType)) {
                    if (this.options.validations.includes(CONFIG.INPUT_TYPES[inputType])) {
                        this.attributes.type = CONFIG.INPUT_TYPES[inputType];
                    }
                }
            }
        }
    }

    _initEvents() {
        this.$element.on('input', () => {
            this._updateData(this.$element.val(), this.$element.data('path'));
        });
    }
}