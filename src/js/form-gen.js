import * as CONFIG from './elementor/config';
import * as APP_CONFIG from './config';
import Widget from './elementor/widget';

export default class FormGen {
    /**
     *
     * @param schema
     * @param data
     */
    constructor(schema, data) {
        this.schema = schema;
        this.data = data || {};
    }

    _uuid() {
        let uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += "-"
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

    _getWidgetType(apiType) {
        let widgetType;

        switch (apiType) {
            case APP_CONFIG.API_TYPES.STRING:
            case APP_CONFIG.API_TYPES.NUMBER:
                widgetType = CONFIG.WIDGETS.INPUT;

                break;
            case APP_CONFIG.API_TYPES.BLOB:
                widgetType = CONFIG.WIDGETS.TEXTAREA;

                break;
        }

        return widgetType;
    }

    _extendAttributes(widgetType, attributes) {
        let defaultAttributes;

        defaultAttributes = {};

        switch (widgetType) {
            case CONFIG.WIDGETS.INPUT:
                defaultAttributes.class = 'form-control';

                break;
            case CONFIG.WIDGETS.BUTTON:
                defaultAttributes.class = 'btn';

                break;

            case CONFIG.WIDGETS.TEXTAREA:
                defaultAttributes.class = 'form-control';

                break;

            case CONFIG.WIDGETS.LABEL:

                break;
        }

        attributes.class = $.grep([attributes.class, defaultAttributes.class], Boolean).join(' ');
        delete defaultAttributes.class;

        $.extend(attributes, defaultAttributes);

        return attributes;
    }

    /**
     *
     * @param item
     * @param attributes
     */
    _createElement(item) {
        let widget;
        let widgetType;
        let label;
        let options;
        let $wrapper;
        let type;
        let validations;
        let attributes;

        type = item.type;
        validations = item.validations || [];
        attributes = item.attributes;

        options = {
            locale: 'en',
            validations: validations,
            data: this.data,
        };

        widgetType = this._getWidgetType(type);

        widget = new Widget(widgetType, this._extendAttributes(widgetType, attributes), options);
        label = new Widget(
            CONFIG.WIDGETS.LABEL,
            this._extendAttributes(
                CONFIG.WIDGETS.LABEL,
                {
                    title: attributes.title,
                }
            ),
            options
        );

        $wrapper = $('<div>');
        $wrapper.addClass('form-group');
        $wrapper.append(label.getElement(), widget.getElement());

        return $wrapper;
    }

    _manipulateArray(schema, parentPath, $parent, parentData) {
        let itemPath;
        let $group;

        itemPath = parentPath + schema.name;

        if (parentData[schema.name] === undefined) {
            parentData[schema.name] = [];
        }

        $group = $('<fieldset style="border: 3px solid #000;padding: 10px 15px;"></fieldset>');
        $group.append($('<legend style="text-indent: 15px;">').text(schema.name));

        this.manipulate(schema.children_schema, itemPath, $group, parentData[schema.name]);

        let $btn;
        $btn = $('<button type="button" class="btn btn-info">+</button>');
        $btn.on('click', () => {
            this.manipulate(schema.children_schema, itemPath, $group, parentData[schema.name]);
        });
        $group.prepend($btn);
        $parent.append($group);
    }

    _manipulateMap(schema, parentPath, $parent, parentData) {
        let itemPath;
        let $group;

        itemPath = parentPath + schema.name;

        if (parentData[schema.name] === undefined) {
            parentData[schema.name] = {}
        }

        $group = $('<fieldset style="border: 1px solid #000; padding: 20px;"></fieldset>');
        $group.append($('<legend style="text-indent: 15px;">').text(schema.name));

        for (let item in schema.children) {
            if (!schema.children.hasOwnProperty(item)) {
                continue;
            }

            this.manipulate(schema.children[item], itemPath, $group, parentData[schema.name]);
        }

        $parent.append($group);
    }

    _manipulateField(schema, parentPath, $parent, parentData) {
        let $widget;
        let itemPath;
        let fieldName;

        itemPath = parentPath + schema.name;

        schema.attributes = schema.attributes || {};
        schema.attributes['data-path'] = itemPath;

        console.log(parentData);
        //
        if (schema.name === 'array-root') {
            console.log('parentData > ', parentData);
            console.log('schema > ', schema);
            parentData.forEach((value, index) => {
                schema.attributes['value'] = value;
                schema.name = parentPath + index;
                $widget = this._createElement(schema);
                $parent.append($widget);
            });

        } else {
            if (parentData[schema.name] === undefined) {
                parentData[schema.name] = '';
            }

            schema.attributes['value'] = parentData[schema.name];
            $widget = this._createElement(schema);
            $parent.append($widget);
        }
    }

    /**
     *
     */
    manipulate(schema, parentPath, $parent, parentData) {
        parentPath = $.trim(parentPath) ? $.trim(parentPath) + '::' : '';

        if (schema.kind === 'field') {
            this._manipulateField(schema, parentPath, $parent, parentData);
        } else if (schema.kind === 'group') {
            switch (schema.type) {
                case 'array':
                    this._manipulateArray(schema, parentPath, $parent, parentData);
                    break;
                case 'object':
                    this._manipulateMap(schema, parentPath, $parent, parentData);
                    break;
            }
        } else {
            console.log('WTF!');
        }
    }

    getForm() {
        let submitButton;
        let attributes;

        this.$form = $('<form></form>');

        if (this.schema.kind === 'group') {
            this.manipulate(this.schema, '', this.$form, this.data);
        }

        // console.log(this.data);

        attributes = {
            type: CONFIG.BUTTON_TYPES.BUTTON,
            title: {
                en: 'Submit',
                fa: 'ارسال'
            },
            class: 'btn-primary',
        };

        submitButton = new Widget(CONFIG.WIDGETS.BUTTON, this._extendAttributes(CONFIG.WIDGETS.BUTTON, attributes), {});

        let $btn = submitButton.getElement();
        $btn.on('click', () => {
            console.log(this.data);
        });

        this.$form.append($btn);

        return this.$form;
    }
}
