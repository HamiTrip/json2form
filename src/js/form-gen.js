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

    /**
     *
     * @param type
     * @param attributes
     * @private
     */
    _$group(type, attributes) {
        let $group;

        $group = $('<div>');
        $group.css({
            border: '3px solid #000',
            padding: '15px',
        });

        switch (type) {
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
                $legend.text(attributes.text);
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
        }

        return $group;
    }

    /**
     *
     * @param type
     * @param options
     * @returns {*}
     * @private
     */
    _$button(type, options) {
        let button;
        let attributes;

        switch (type) {
            case 'add':
                attributes = {
                    type: CONFIG.BUTTON_TYPES.BUTTON,
                    text: {
                        en: '+',
                        fa: '+'
                    },
                    title: {
                        en: 'Add',
                        fa: 'افزودن'
                    },
                    class: 'btn btn-info',
                    'data-path': options.path,
                };

                button = new Widget(CONFIG.WIDGETS.BUTTON, attributes, {
                    events: {
                        click: options.events.click,
                    }
                });

                break;
            case 'submit':
                attributes = {
                    type: CONFIG.BUTTON_TYPES.BUTTON,
                    title: {
                        en: 'Submit',
                        fa: 'ارسال'
                    },
                    class: 'btn btn-primary',
                    'data-path': options.path,
                };

                button = new Widget(CONFIG.WIDGETS.BUTTON, attributes, {
                    events: {
                        click: options.events.click,
                    }
                });

                break;
            case 'delete':
                attributes = {
                    type: CONFIG.BUTTON_TYPES.BUTTON,
                    text: {
                        en: '-',
                        fa: '-'
                    },
                    title: {
                        en: 'Delete',
                        fa: 'حذف'
                    },
                    class: 'btn btn-danger',
                    'data-path': options.path,
                };

                button = new Widget(CONFIG.WIDGETS.BUTTON, attributes, {
                    events: {
                        click: options.events.click,
                    }
                });

                break;
        }

        return button.getElement();
    }

    _getWidgetType(apiType) {
        let widgetType;

        switch (apiType) {
            case APP_CONFIG.API_TYPES.STRING:
            case APP_CONFIG.API_TYPES.NUMBER:
            case APP_CONFIG.API_TYPES.ENUM:
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
     * @param schema
     * @param attributes
     */
    _createElement(schema) {
        let widget;
        let widgetType;
        let label;
        let options;
        let $wrapper;
        let type;
        let validations;
        let attributes;

        type = schema.type;
        validations = schema.validations || [];
        attributes = schema.attributes;

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

    _push(schema, array) {
        if (schema.kind === 'group') {
            switch (schema.type) {
                case 'object':
                    array.push({});
                    break;
                case 'array':
                    array.push([]);
                    break;
            }
        } else {
            array.push('');
        }

        return array.length - 1;
    }

    _manipulateArray(schema, parentPath, $parent, parentData, index) {
        let itemPath;
        let $group;
        let fieldId;
        let btnDeleteOptions;

        if (index !== -1) {
            fieldId = index;
            index = -1;
        } else {
            fieldId = schema.name;
        }

        itemPath = parentPath + fieldId;

        if (parentData[fieldId] === undefined) {
            parentData[fieldId] = [];
        }

        $group = this._$group(1, {text: fieldId});

        btnDeleteOptions = {
            events: {
                click: () => {
                    console.log($group);
                    // $group.get(0).remove();
                }
            }
        };

        if (parentData.length === 0) {
            let _index;

            _index = this._push(schema.children_schema, parentData[fieldId]);

            btnDeleteOptions.path = itemPath + '::' + _index;

            $group.append(this._$button('delete', btnDeleteOptions));
            this.manipulate($.extend(true, {}, schema.children_schema), itemPath, $group, parentData[fieldId], _index);
        } else {
            parentData[fieldId].forEach((field, index) => {
                btnDeleteOptions.path = itemPath + '::' + index;
                $group.append(this._$button('delete', btnDeleteOptions));
                this.manipulate($.extend(true, {}, schema.children_schema), itemPath, $group, parentData[fieldId], index);
            })
        }

        let $btn;
        let btnOptions;

        btnOptions = {
            events: {
                click: () => {
                    let _index;

                    _index = this._push(schema.children_schema, parentData[fieldId]);
                    btnDeleteOptions.path = itemPath + '::' + _index;

                    $group.append(this._$button('delete', btnDeleteOptions));

                    this.manipulate(
                        schema.children_schema,
                        itemPath,
                        $group,
                        parentData[fieldId],
                        _index)
                    ;
                }
            }
        };

        $btn = this._$button('add', btnOptions);

        $group.prepend($btn);
        $parent.append($group);
    }

    _manipulateMap(schema, parentPath, $parent, parentData, index) {
        let itemPath;
        let $group;
        let fieldId;

        if (index !== -1) {
            fieldId = index;
            $group = this._$group(2, {text: fieldId});
            index = -1;
        } else {
            fieldId = schema.name;
            $group = this._$group(1, {text: fieldId});
        }

        itemPath = parentPath + fieldId;

        if (parentData[fieldId] === undefined) {
            parentData[fieldId] = {}
        }

        for (let item in schema.children) {
            if (!schema.children.hasOwnProperty(item)) {
                continue;
            }

            this.manipulate(schema.children[item], itemPath, $group, parentData[fieldId], index);
        }

        $parent.append($group);
    }

    _manipulateField(schema, parentPath, $parent, parentData, index) {
        let $widget;
        let itemPath;
        let fieldId;

        if (index !== -1) {
            fieldId = index;
            index = -1;
        } else {
            fieldId = schema.name;
        }

        itemPath = parentPath + fieldId;

        schema.attributes = schema.attributes || {};
        schema.attributes['data-path'] = itemPath;

        if (parentData[fieldId] === undefined) {
            parentData[fieldId] = '';
        }

        schema.attributes['value'] = parentData[fieldId];
        $widget = this._createElement(schema);
        $parent.append($widget);
    }

    /**
     *
     */
    manipulate(schema, parentPath, $parent, parentData, index) {
        parentPath = $.trim(parentPath) ? $.trim(parentPath) + '::' : '';

        if (schema.kind === 'field') {
            this._manipulateField(schema, parentPath, $parent, parentData, index);
        } else if (schema.kind === 'group') {
            switch (schema.type) {
                case 'array':
                    this._manipulateArray(schema, parentPath, $parent, parentData, index);
                    break;
                case 'object':
                    this._manipulateMap(schema, parentPath, $parent, parentData, index);
                    break;
            }
        } else {
            console.log('WTF!');
        }
    }

    getForm() {
        let $btnSubmit;
        let btnOptions;

        this.$form = $('<form></form>');

        if (this.schema.kind === 'group') {
            if (this.data['root'] === undefined) {
                let _data;

                _data = {
                    root: this.data
                };

                this.data = _data;
            }

            this.manipulate(this.schema, '', this.$form, this.data, -1);
        }

        btnOptions = {
            events: {
                click: () => {
                    console.log(this.data);
                    console.log(JSON.stringify(this.data));
                }
            }
        };

        $btnSubmit = this._$button('submit', btnOptions);

        this.$form.append($btnSubmit);

        return this.$form;
    }
}
