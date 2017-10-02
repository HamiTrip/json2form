import * as CONFIG from '../config';

export default class Base {
    constructor(attributes, options) {
        attributes = attributes || {};
        options = options || {};

        options.locale = (options.locale || 'fa').toLowerCase();

        this.options = $.extend({}, options);
        this.attributes = $.extend({}, attributes);
        this.$element = null;
        this.$label = null;
        this.$validationErrors = null;
        this.widget = null;
    }

    _localizeAttributes() {
        let locale;

        locale = this.options.locale;

        if (typeof this.attributes.title === 'object') {
            this.attributes.title = locale in this.attributes.title ? this.attributes.title[locale] : this.attributes.title.en;
        }

        if (this.attributes.text) {
            if (typeof this.attributes.text === 'object') {
                this.attributes.text = locale in this.attributes.text ? this.attributes.text[locale] : this.attributes.text.en;
            }
        } else {
            this.attributes.text = this.attributes.title;
        }

        if (typeof this.attributes.placeholder === 'object') {
            this.attributes.placeholder = locale in this.attributes.placeholder ? this.attributes.placeholder[locale] : this.attributes.placeholder.en;
        }
    }

    _initAttributes(defaultAttributes) {
        if (!this.attributes.class && !defaultAttributes.class) {
            this.attributes.class = $.grep([this.attributes.class, defaultAttributes.class], Boolean).join(' ');
            delete defaultAttributes.class;
        }

        $.extend(this.attributes, defaultAttributes);
        this.$element.attr(this.attributes || {});
    }

    _appendToWrapper($element) {
        if (!this.options.$wrapper) {
            this.options.$wrapper = $element;

            return $element;
        }

        this.options.$wrapper.append($element);

        return this.options.$wrapper;
    }

    _createValidationErrors() {
        let $wrapper;

        if (!this.options.validationErrors) {
            return;
        }

        $wrapper = $('<small>');
        $wrapper.addClass('help-block');
        $wrapper.text(this.options.validationErrors.validator_error);

        this.options.$wrapper.addClass('has-error');

        this.$validationErrors = $wrapper;
    }

    /**
     * Create Label Widget.
     *
     * @private
     */
    _createLabel() {
        // Needs to be Overridden.
    }

    /**
     * Create jQuery Widget Element.
     *
     * @private
     */
    _createElement() {
        // Needs to be Overridden.
    }

    /**
     * Event Initializer.
     *
     * @private
     */
    _initEvents() {
        // Needs to be Overridden.
    }

    _initWidget(widget, defaultAttributes) {
        this.widget = CONFIG.WIDGETS[widget.toUpperCase()];

        this._localizeAttributes();
        this._createLabel();
        this._createElement();
        this._createValidationErrors();
        this._initAttributes(defaultAttributes);
        this._initEvents();
    }

    _updateData(value, path) {
        let _path;
        let currentObj;

        _path = path.split(CONFIG.PATH_SEPARATOR);

        currentObj = this.options.data;
        _path.forEach((field, index) => {
            if (_path.length === index + 1) {
                currentObj[field] = value;

                return;
            }

            currentObj = currentObj[field];
        });
    }

    getElement() {
        this._appendToWrapper(this.$label);
        this._appendToWrapper(this.$element);
        this._appendToWrapper(this.$validationErrors);

        return this.options.$wrapper;
    }
}