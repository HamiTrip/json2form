import * as CONFIG from './elementor/config';
import * as APP_CONFIG from './config';
import Grouper from './elementor/grouper';
import Widget from './elementor/widget';

export default class JSON2Form {
    /**
     *
     * @param schema
     * @param data
     * @param options
     */
    constructor(schema, data, options) {
        this.schema = schema;
        this.data = data || {};

        this.options = options || {};
        this.options.locale = this.options.locale || 'en';
    }

    _deleteData(path) {
        let _path;
        let currentObj;

        _path = path.split(CONFIG.PATH_SEPARATOR);

        currentObj = this.data;

        _path.forEach((field, index) => {
            if (_path.length === index + 1) {
                delete currentObj[field];

                return;
            }

            currentObj = currentObj[field];
        });
    }

    _getValidationError(path) {
        let validation;

        if (!this.options.validationErrors || !Array.isArray(this.options.validationErrors)) {
            return;
        }

        validation = null;

        this.options.validationErrors.forEach((item) => {
            if (item.field_path === path && validation === null) {
                validation = item;
            }
        });

        return validation;
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
     * @param options
     * @private
     */
    _$group(type, attributes, options) {
        return new Grouper(type, attributes, options);
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
                    },
                    locale: this.options.locale,
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
                    },
                    locale: this.options.locale,
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
                    },
                    locale: this.options.locale,
                });

                break;
        }

        return button.getElement();
    }

    _getWidgetType(apiType) {
        let widgetType;

        switch (apiType) {
            case APP_CONFIG.API_TYPES.TEXT:
                widgetType = CONFIG.WIDGETS.INPUT_TEXT;

                break;
            case APP_CONFIG.API_TYPES.UUID:
                widgetType = CONFIG.WIDGETS.INPUT_UUID;

                break;
            case APP_CONFIG.API_TYPES.SELECT:
                widgetType = CONFIG.WIDGETS.SELECT;

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
            case CONFIG.WIDGETS.INPUT_TEXT:
            case CONFIG.WIDGETS.INPUT_EMAIL:
                defaultAttributes.class = 'form-control';

                break;
            case CONFIG.WIDGETS.TEXTAREA:
                defaultAttributes.class = 'form-control';

                break;
            case CONFIG.WIDGETS.SELECT:
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
        let options;
        let $wrapper;
        let type;
        let validations;
        let attributes;
        let selectOptions;

        type = schema.type;
        validations = schema.validations || [];
        attributes = schema.attributes;
        selectOptions = schema.options || null;

        $wrapper = $('<div>');
        $wrapper.addClass('form-group');

        options = {
            locale: this.options.locale,
            validations: validations,
            validationErrors: schema.validationErrors,
            data: this.data,
            options: selectOptions,
            $wrapper: $wrapper,
        };

        widget = new Widget(this._getWidgetType(type), this._extendAttributes(type, attributes), options);

        $wrapper.append(widget.getElement());

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

    /**
     *
     * @param schema
     * @param parentPath
     * @param $parent
     * @param parentData
     * @param index
     * @private
     */
    _manipulateArray(schema, parentPath, $parent, parentData, index) {
        let itemPath;
        let group;
        let fieldId;
        let btnDeleteOptions;

        btnDeleteOptions = {};

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

        group = this._$group(1, schema.attributes, this.options);

        if (parentData.length === 0) {
            let _index;
            let path;
            let $listItemGroup;
            let params;

            _index = this._push(schema.children_schema, parentData[fieldId]);
            path = itemPath + '::' + _index;

            params = {
                type: '',
                attributes: {},
                options: {
                    locale: this.options.locale,
                    path: path,
                    groupPath: path,
                    deleteCb: ((_path) => {
                        return () => {
                            this._deleteData(_path);
                        };
                    })(path)
                }
            };

            $listItemGroup = (new Grouper(params.type, params.attributes, params.options)).$getListItemGroup();

            this.manipulate(
                $.extend(true, {}, schema.children_schema),
                itemPath,
                $listItemGroup,
                parentData[fieldId],
                _index
            );

            group.get().append($listItemGroup);
        } else {
            parentData[fieldId].forEach((field, index) => {
                let path;
                let $listItemGroup;
                let params;

                path = itemPath + '::' + index;

                params = {
                    type: '',
                    attributes: {},
                    options: {
                        locale: this.options.locale,
                        path: path,
                        groupPath: path,
                        deleteCb: ((_path) => {
                            return () => {
                                this._deleteData(_path);
                            };
                        })(path)
                    }
                };

                $listItemGroup = (new Grouper(params.type, schema.attributes, params.options)).$getListItemGroup();

                this.manipulate(
                    $.extend(true, {}, schema.children_schema),
                    itemPath,
                    $listItemGroup,
                    parentData[fieldId],
                    index
                );

                group.get().append($listItemGroup);
            });
        }

        let $btn;
        let btnOptions;

        btnOptions = {
            events: {
                click: () => {
                    let _index;
                    let path;
                    let $listItemGroup;
                    let params;

                    _index = this._push(schema.children_schema, parentData[fieldId]);
                    path = itemPath + '::' + _index;

                    params = {
                        type: '',
                        attributes: {},
                        options: {
                            locale: this.options.locale,
                            path: path,
                            groupPath: path,
                            deleteCb: ((_path) => {
                                return () => {
                                    this._deleteData(_path);
                                };
                            })(path)
                        }
                    };

                    $listItemGroup = (new Grouper(params.type, params.attributes, params.options)).$getListItemGroup();

                    this.manipulate(
                        $.extend(true, {}, schema.children_schema),
                        itemPath,
                        $listItemGroup,
                        parentData[fieldId],
                        _index
                    );

                    group.get().append($listItemGroup);
                }
            }
        };

        $btn = this._$button('add', btnOptions);

        group.get().prepend($btn);
        $parent.append(group.get());
    }

    /**
     *
     * @param schema
     * @param parentPath
     * @param $parent
     * @param parentData
     * @param index
     * @private
     */
    _manipulateMap(schema, parentPath, $parent, parentData, index) {
        let itemPath;
        let group;
        let fieldId;

        if (index !== -1) {
            fieldId = index;
            index = -1;
        } else {
            fieldId = schema.name;
            // group = this._$group(1, {text: fieldId}, {});
        }

        itemPath = parentPath + fieldId;

        if (isNaN(fieldId)) {
            group = this._$group(1, schema.attributes, this.options);
        } else {
            schema.attributes['data-group-path'] = itemPath;
            group = this._$group(2, schema.attributes, this.options);
        }

        if (parentData[fieldId] === undefined) {
            parentData[fieldId] = {};
        }

        for (let item in schema.children) {
            if (!schema.children.hasOwnProperty(item)) {
                continue;
            }

            this.manipulate(schema.children[item], itemPath, group.get(), parentData[fieldId], index);
        }

        $parent.append(group.get());
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

        schema.attributes.value = parentData[fieldId];
        schema.validationErrors = this._getValidationError(itemPath);

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
            console.log('UnSupport Kind/Type!');
        }
    }

    _generateElements() {
        if (this.schema.kind === 'group') {
            if (this.data.root === undefined) {
                let _data;

                _data = {
                    root: this.data
                };

                this.data = _data;
            }

            this.manipulate(this.schema, '', this.$form, this.data, -1);
        }
    }

    /**
     * Generate jQuery Form Element.
     *
     * @returns {*}
     */
    getForm() {
        this.$form = $('<form>');
        this._generateElements();

        return this.$form;
    }

    getElements() {
        this.$form = $('<div>');
        this._generateElements();

        return this.$form;
    }

    /**
     * Return Last State of Form Data as Object or String.
     *
     * @returns {{object: *, string}}
     */
    getData() {
        return {
            object: this.data,
            string: JSON.stringify(this.data),
        };
    }
}
