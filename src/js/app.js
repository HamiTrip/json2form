import JSON2From from './json2form';

let formGen;

$.getJSON("data-sample.json", (data) => {
    $.getJSON("schema-sample.json", (schema) => {
        let options;

        options = {
            locale: 'en',
        };

        formGen = new JSON2From(schema, data, options);

        $('#btn-submit').on('click', () => {
            console.log(formGen.getData());
        });

        $('#form').prepend(formGen.getForm());
    });
});