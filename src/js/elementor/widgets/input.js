import Base from './base';
import Label from './label';

export default class Input extends Base {
    constructor(attributes, options) {
        super(attributes, options);
    }

    _createLabel() {
        let label;

        label = new Label(
            this.attributes,
            this.options
        );

        this._appendToWrapper(label.getElement());
    }

    /**
     *
     * @protected
     */
    _createElement() {
        // Can be Overridden.
    }

    _initEvents() {
        this.$element.on('input', () => {
            this._updateData(this.$element.val(), this.$element.data('path'));
        });
    }
}