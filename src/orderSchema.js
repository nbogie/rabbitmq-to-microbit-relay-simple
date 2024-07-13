import Joi from "joi";
//docs are at https://joi.dev/api/

export const orderSchema = Joi.object().keys({
    type: Joi.string().valid("order").required(),
    productId: Joi.string()
        .regex(/^[a-zA-Z0-9-]{5,50}$/)
        .required(),
    quantity: Joi.number().integer().required(),
    email: Joi.string().email().required(),
});
