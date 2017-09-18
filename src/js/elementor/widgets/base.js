import * as CONFIG from '../config';

export default class Base {
    constructor(attributes, options) {
        attributes = attributes || {};
        options = options || {};

        options.locale = (options.locale || 'fa').toLowerCase();

        this.options = $.extend({}, options);
        this.attributes = $.extend({}, attributes);
        this.$element = null;
        this.widget = null;
    }

    _localizeAttributes() {
        let locale;

        locale = this.options.locale;

        this.attributes.title = this.attributes.title ? this.attributes.title[locale] : '';

        if (this.attributes.text) {
            this.attributes.text = this.attributes.text[locale];
        } else {
            this.attributes.text = this.attributes.title;
        }

        this.attributes.placeholder = this.attributes.placeholder ? this.attributes.placeholder[locale] : '';
    }

    _initAttributes(defaultAttributes) {
        this.attributes.class = $.grep([this.attributes.class, defaultAttributes.class], Boolean).join(' ');
        delete defaultAttributes.class;

        $.extend(this.attributes, defaultAttributes);
        this.$element.attr(this.attributes || {});
    }

    /**
     * Override It from Widgets Class.
     *
     * @private
     */
    _createElement() {
        console.error('CreateElement: Override Me Plz!');
    }

    _initEvents() {
        console.error('Events: Override Me Plz!');
    }

    _initWidget(widget, defaultAttributes) {
        this.widget = CONFIG.WIDGETS[widget.toUpperCase()];

        this._localizeAttributes();
        this._createElement();
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
        return this.$element;
    }
}