import * as CONFIG from "./config";
import Widget from './widget';

export default class Grouper {
    /**
     *
     * @param type
     * @param attributes
     * @param options
     */
    constructor(type, attributes, options) {
        this.type = type;
        this.attributes = $.extend({}, attributes);
        this.options = $.extend({}, options);
        this.$group = null;

        this._localizeAttributes();
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

    appendDom($dom) {
        if (!this.$group) {
            this.get();
        }

        this.$group.append($dom);
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    $getListItemGroup() {
        let $group;
        let btnAttrs;
        let btnOptions;
        let button;

        $group = $('<div>');
        $group.addClass('j2f-list-item-group');
        $group.attr('data-group-path', this.options.groupPath);

        btnAttrs = {};
        btnAttrs['data-path'] = this.options.path;
        btnAttrs.type = CONFIG.BUTTON_TYPES.BUTTON;
        btnAttrs.text = {
            en: '-',
            fa: '-'
        };
        btnAttrs.title = {
            en: 'Delete',
            fa: 'حذف'
        };
        btnAttrs.class = 'j2f-btn-delete btn btn-danger';

        btnOptions = {};
        btnOptions.events = {
            click: () => {
                this.options.deleteCb();
                $group.remove();
            }
        };

        button = new Widget(CONFIG.WIDGETS.BUTTON, btnAttrs, btnOptions);

        $group.append(button.getElement());

        return $group;
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    get() {
        if (this.$group) {
            return this.$group;
        }

        let $group;

        $group = $('<div>');

        switch (this.type) {
            case 1:
                let $legend;

                $group = $('<fieldset>');
                $group.addClass('j2f-fieldset');
                $legend = $('<legend>');
                $legend.text(this.attributes.text);
                $group.append($legend);

                break;
            case 2:
                $group = $('<div>');
                $group.addClass('j2f-fields-group');
                $group.attr('data-group-path', this.attributes['data-group-path']);

                break;
        }

        this.$group = $group;
        this._appendDoms();

        return $group;
    }

    _appendDoms() {
        if (!this.$group) {
            this.get();
        }

        if (!this.options.$doms || this.options.$doms.length <= 0) {
            return;
        }

        this.options.$doms.forEach(($dom) => {
            this.appendDom($dom);
        });
    }
};