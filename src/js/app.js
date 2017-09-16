import FormGen from './form-gen';

const LOCALE = 'fa';

let data = {
    'root': {
        "x_domain": "xdomain",
        "flights": {
            "username": "username value",
            "client_data": {
                "lua_formula": "hfjh jkh s 34 () {} [] 523kjfh kj hdjf",
                "name": "fjkjdfkjsldj"
            }
        },
        "nsp": [
            {
                "email": {
                    "email_en_register_template_id": "123",
                    "email_fa_register_template_id": "345"
                },
                "sms": {
                    "sms_en_register_template_id": 543,
                    "sms_fa_register_template_id": 368
                }
            },
            {
                "email": {
                    "email_en_register_template_id": 123,
                    "email_fa_register_template_id": 345
                },
                "sms": {
                    "sms_en_register_template_id": 543,
                    "sms_fa_register_template_id": 368
                }
            }
        ],
        "arrays": [
            ["arr1"],
            ["arr2"]
        ],
        "names": [
            "ali",
            "hasan"
        ]
    }
};

let schema = {
    "name": "root",
    "type": "object",
    "kind": "group",
    "children": [
        {
            "name": "x_domain",
            "type": "string",
            "kind": "field",
            "validations": [
                "required",
                "alpha"
            ],
            "attributes": {
                "title": {
                    "en": "X Domain",
                    "fa": "دامنه ایکس"
                },
                "placeholder": {
                    "en": "X Domain...",
                    "fa": "Damaneye Ix..."
                },
                "disabled": false,
                "readonly": false
            }
        },
        {
            "name": "flights",
            "type": "object",
            "kind": "group",
            "attributes": {
                "title": {
                    "en": "Flights",
                    "fa": "پروازها"
                }
            },
            "children": [
                {
                    "name": "username",
                    "type": "string",
                    "kind": "field",
                    "attributes": {
                        "title": {
                            "en": "Username",
                            "fa": "نام کاربری"
                        },
                        "placeholder": {
                            "en": "Username...",
                            "fa": "نام کاربری..."
                        }
                    }
                },
                {
                    "name": "client_data",
                    "type": "object",
                    "kind": "group",
                    "children": [
                        {
                            "name": "lua_formula",
                            "type": "blob",
                            "kind": "field",
                            "validations": [
                                "required"
                            ],
                            "attributes": {
                                "title": {
                                    "en": "Lua",
                                    "fa": "لوا"
                                },
                                "placeholder": {
                                    "en": "Lua...",
                                    "fa": "لوا..."
                                }
                            }
                        },
                        {
                            "name": "name",
                            "type": "string",
                            "kind": "field",
                            "attributes": {
                                "title": {
                                    "en": "Username",
                                    "fa": "نام کاربری"
                                },
                                "placeholder": {
                                    "en": "Username...",
                                    "fa": "نام کاربری..."
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            "name": "nsp",
            "type": "array",
            "kind": "group",
            "children_schema": {
                "name": "array-root",
                "type": "object",
                "kind": "group",
                "children": [
                    {
                        "name": "email",
                        "type": "object",
                        "kind": "group",
                        "children": [
                            {
                                "name": "email_en_register_template_id",
                                "type": "string",
                                "kind": "field",
                                "validations": [
                                    "required",
                                    "email"
                                ],
                                "attributes": {
                                    "title": {
                                        "en": "EmailEn En",
                                        "fa": "EmailEn Fa"
                                    },
                                    "placeholder": {
                                        "en": "EmailEn En...",
                                        "fa": "EmailEn Fa..."
                                    }
                                }
                            },
                            {
                                "name": "email_fa_register_template_id",
                                "type": "string",
                                "kind": "field",
                                "validations": [
                                    "required",
                                    "numeric"
                                ],
                                "attributes": {
                                    "title": {
                                        "en": "EmailFaId En",
                                        "fa": "EmailFaId Fa"
                                    },
                                    "placeholder": {
                                        "en": "EmailFaId En...",
                                        "fa": "EmailFaId Fa..."
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "sms",
                        "type": "object",
                        "kind": "group",
                        "children": [
                            {
                                "name": "sms_en_register_template_id",
                                "type": "number",
                                "kind": "field",
                                "validations": [
                                    "required"
                                ],
                                "attributes": {
                                    "title": {
                                        "en": "SmsEn En",
                                        "fa": "SmsEn Fa"
                                    },
                                    "placeholder": {
                                        "en": "SmsEn En...",
                                        "fa": "SmsEn Fa..."
                                    }
                                }
                            },
                            {
                                "name": "sms_fa_register_template_id",
                                "type": "number",
                                "kind": "field",
                                "validations": [
                                    "required"
                                ],
                                "attributes": {
                                    "title": {
                                        "en": "SmsFaId En",
                                        "fa": "SmsFaId Fa"
                                    },
                                    "placeholder": {
                                        "en": "SmsFaId En...",
                                        "fa": "SmsFaId Fa..."
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "name": "names",
            "type": "array",
            "kind": "group",
            "children_schema": {
                "name": "array-root",
                "type": "string",
                "kind": "field"
            }
        },
        {
            "name": "arrays",
            "type": "array",
            "kind": "group",
            "children_schema": {
                "name": "array-root",
                "type": "array",
                "kind": "group",
                "children_schema": {
                    "name": "array-root",
                    "type": "string",
                    "kind": "field"
                }
            }
        }
    ]
};

let formGen;

$.getJSON("data-sample.json", (data) => {
    $.getJSON("schema-sample.json", (schema) => {
        formGen = new FormGen(schema, {});

        $('#form').append(formGen.getForm());
    });
});