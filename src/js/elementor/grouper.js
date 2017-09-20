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
        this.attributes = attributes || {};
        this.options = options || {};
        this.$group = null;

        this.attributes = $.extend({}, this.attributes);
        this.options = $.extend({}, this.options);

        this._localizeAttributes();
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
        $group.css({
            border: '3px solid #000',
            padding: '15px',
        });

        switch (this.type) {
            case 1:
                let $legend;

                $group = $('<fieldset>');
                $group.css({
                    border: '2px solid #000',
                    padding: '10px 15px',
                    margin: 'auto auto 35px auto'
                });
                $legend = $('<legend>');
                $legend.css({
                    'text-indent': '15px',
                });
                $legend.text(this.attributes.text);
                $group.append($legend);

                break;
            case 2:
                $group = $('<div>');
                $group.css({
                    border: '1px solid #000',
                    background: '#eee',
                    padding: '20px',
                    margin: '10px',
                });
                $group.attr('data-group-path', this.attributes['data-group-path']);

                break;
            case 3:
                $group = $('<div>');
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