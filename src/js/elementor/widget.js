import * as CONFIG from './config';
import Input from "./widgets/input";
import Label from "./widgets/label";
import TextArea from "./widgets/textarea";
import Button from "./widgets/button";

export default class Widget {
    constructor(widgetType, attributes, options) {
        this.widget = CONFIG.WIDGETS[widgetType.toUpperCase()];
        this.attributes = attributes;
        this.options = options;
    }

    /**
     *
     */
    getElement() {
        let widget;

        switch (this.widget) {
            case CONFIG.WIDGETS.INPUT:
                widget = new Input(this.attributes, this.options);

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
        }

        return widget ? widget.getElement() : null;
    }
}