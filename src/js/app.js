import JSON2From from './json2form';

let formGen;

$.getJSON("data-sample.json", (data) => {
    $.getJSON("schema-sample.json", (schema) => {
        let options;

        options = {
            locale: 'en',
        };

        formGen = new JSON2From(schema, data, options);

        $('#form').append(formGen.getForm());
    });
});