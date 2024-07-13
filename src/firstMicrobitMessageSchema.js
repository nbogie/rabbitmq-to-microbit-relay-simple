import Joi from "joi";
//docs are at https://joi.dev/api/

export const orderSchema = Joi.object().keys({
    type: Joi.string().valid("microbit").required(),
    number: Joi.number().integer().required().min(0).max(255),
});
