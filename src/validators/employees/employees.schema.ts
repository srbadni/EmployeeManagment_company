import Joi from "joi";

const EmployeeSchema = Joi.object({
    firstName: Joi.string().regex(/^[,ئ. آ-ی]+$/).required().messages({
        "string.empty": "نام الزامی میباشد",
        "string.pattern.base": "فقط حروف فارسی مجاز است"
    }),
    lastName: Joi.string().regex(/^[,ئ. آ-ی]+$/).required().messages({
        "string.empty": "نام خانوادگی الزامی میباشد",
        "string.pattern.base": "فقط حروف فارسی مجاز است"
    }),
    post: Joi.string().regex(/^[,ئ. آ-ی]+$/).required().messages({
        "string.empty": "سمت الزامی میباشد",
        "string.pattern.base": "فقط حروف فارسی مجاز است"
    }),
    fatherName: Joi.string().regex(/^[,ئ. آ-ی]+$/).required().messages({
        "string.empty": "نام پدر الزامی میباشد",
        "string.pattern.base": "فقط حروف فارسی مجاز است"
    }),
    nationalCode: Joi.string().regex(/^[0-9]+$/).min(10).max(10).required().messages({
        "string.empty": "کد ملی الزامی میباشد",
        'string.min': "کد ملی باید ده رقم باشد",
        'string.max': "کد ملی باید ده رقم باشد",
        "string.pattern.base": "فقط اعداد مجاز است"
    }),
    birthDate: Joi.string().required().messages({
        "any.required": "تاریخ تولد الزامی میباشد",
    }),
    dateOfBecomeEmployee: Joi.string().required().messages({
        "any.required": "تاریخ استخدام الزامی میباشد",
    }),
    phoneNumber: Joi.string().regex(/^[0-9]+$/).min(11).max(11).required().messages({
        "string.empty": "شماره تماس الزامی میباشد",
        'string.min': "شماره تماس باید یازده رقم باشد",
        'string.max': "شماره تماس باید یازده رقم باشد",
        "string.pattern.base": "فقط عدد مجاز است"
    }),
    address: Joi.string().required().messages({
        "string.empty": "آدرس الزامی میباشد",
    }),
    placeOfBirth: Joi.string().regex(/^[,ئ. آ-ی]+$/).required().messages({
        "string.empty": "محل تولد الزامی میباشد",
        "string.pattern.base": "فقط حروف فارسی مجاز است"
    }),
    isMaried: Joi.boolean().required().messages({
        "any.required": "وضعیت تاهل الزامی میباشد",
    })
})

const EmployeeInitialValues = {
    firstName: "",
    lastName: "",
    post: "",
    isMaried: false,
    fatherName: "",
    nationalCode: "",
    birthDate: "",
    dateOfBecomeEmployee: "",
    phoneNumber: "",
    address: "",
    acoountNumber1: "",
    acoountNumber2: "",
    acoountNumberOther: "",
    insuranceNumber: "",
    placeOfBirth: "",
    gender: 1,
    relatives: ""
};

const EditEmployeeInitialValues = {
    acoountNumber1: "",
    acoountNumber2: "",
    acoountNumberOther: "",
    address: "",
    birthDate: "",
    company: "",
    companyId: "",
    dateOfBecomeEmployee: "",
    fatherName: "",
    firstName: "",
    id: "",
    insuranceNumber: "",
    isActive: false,
    isMaried: false,
    lastName: "",
    nationalCode: "",
    phoneNumber: "",
    placeOfBirth: "",
    post: "",
    gender: 1,
    relatives: ""
};

export {EmployeeInitialValues, EmployeeSchema, EditEmployeeInitialValues}
