import joi from 'joi';

const PasswordSchema = joi.object({
    newPassword: joi.string().required().trim().min(6).messages({
        "string.min": "رمز عبور حتما باید 6 حرف داشته باشد",
        "string.empty": "رمز عبور الزامی میباشد",
    }),
    confirmPassword: joi.string().required().trim().min(6).messages({
        "string.min": "تکرار رمز عبور حتما باید 6 حرف داشته باشد",
        "string.empty": "تکرار رمز عبور الزامی میباشد",
    }),
})

const EditPasswordSchema = joi.object({
    newPassword: joi.string().required().trim().min(6).messages({
        "string.min": "رمز عبور حتما باید 6 حرف داشته باشد",
        "string.empty": "رمز عبور الزامی میباشد",
    }),
    confirmPassword: joi.string().required().trim().min(6).messages({
        "string.min": "تکرار رمز عبور حتما باید 6 حرف داشته باشد",
        "string.empty": "تکرار رمز عبور الزامی میباشد",
    }),
})

const PasswordSchemaInitialValues = {
    newPassword: "",
    confirmPassword: ""
};

const EditPasswordSchemaInitialValues = {
    id: "",
    newPassword: "",
    confirmPassword: ""
}

export {PasswordSchema, PasswordSchemaInitialValues, EditPasswordSchemaInitialValues, EditPasswordSchema}