import Joi from "joi";
//docs are at https://joi.dev/api/

export const microbitMessageSchema = Joi.object().keys({
    type: Joi.string().valid("microbit").required(),
    from: Joi.string().alphanum().min(1).max(20).required(),
    lightPattern: Joi.string().alphanum().min(1).max(20),
    lightValue: Joi.number().integer(),
    servoValue: Joi.number().min(0).max(255),
});
