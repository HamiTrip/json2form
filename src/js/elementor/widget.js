import * as CONFIG from './config';
import Text from "./widgets/inputs/text";
import UUID from "./widgets/inputs/uuid";
import Label from "./widgets/label";
import TextArea from "./widgets/textarea";
import Button from "./widgets/button";
import Select from "./widgets/select";

export default class Widget {
    constructor(widgetType, attributes, options) {
        this.widgetType = widgetType.toLowerCase();
        this.attributes = attributes;
        this.options = options;
    }

    /**
     *
     */
    getElement() {
        let widget;

        switch (this.widgetType) {
            case CONFIG.WIDGETS.INPUT_TEXT:
            case CONFIG.WIDGETS.INPUT_HIDDEN:
            case CONFIG.WIDGETS.INPUT_EMAIL:
                widget = new Text(this.attributes, this.options);

                break;
            case CONFIG.WIDGETS.INPUT_UUID:
                widget = new UUID(this.attributes, this.options);

                break;
            case CONFIG.WIDGETS.LABEL:
                widget = new Label(this.attributes, this.options);

                break;
            case CONFIG.WIDGETS.TEXTAREA:
                widget = new TextArea(this.attributes, this.options);

                break;
            case CONFIG.WIDGETS.BUTTON:
                widget = new Button(this.attributes, this.options);

                break;
            case CONFIG.WIDGETS.SELECT:
                widget = new Select(this.attributes, this.options);

                break;
        }

        return widget ? widget.getElement() : null;
    }
}