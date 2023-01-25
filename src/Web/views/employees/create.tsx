import {
    CCardBody,
    CCard,
    CButton,
    CFormInput,
    CFormLabel,
    CCol,
    CCardHeader,
    CCardFooter,
    CFormCheck,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CTableBody,
    CModal,
    CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CRow, CFormSelect
} from "@coreui/react";
import {ChangeEvent, Fragment, useEffect, useRef, useState} from "react";
import DtPicker from 'react-calendar-datetime-picker'
import {useValidator} from "react-joi"
import ApiService from "../../../service/api/api.service";
import {Link, useNavigate} from "react-router-dom";
import ConvertKendoDate from "../../Helpers/convertKendoDate";
import {EmployeeInitialValues, EmployeeSchema} from "../../../validators/employees/employees.schema";
import {useFormik} from 'formik';
import './employees.scss'
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en"
import {generateUUID} from "../../Helpers/uuid";
import * as Yup from 'yup';

const ModalSchema = Yup.object().shape({
    employeeFirstName: Yup.string()
        .min(2, 'کوتاه میباشد')
        .max(50, 'طولانی میباشد')
        .matches(
            /^[.,ئ آ-ی]+$/,
            "باید حروف فارسی باشند"
        )
        .required('الزامی میباشد'),
    employeeLastName: Yup.string()
        .min(2, 'کوتاه میباشد')
        .max(50, 'طولانی میباشد')
        .matches(
            /^[.,ئ آ-ی]+$/,
            "باید حروف فارسی باشند"
        )
        .required('الزامی میباشد'),
    employeeBirthDay: Yup.string()
        .required('الزامی میباشد'),
    employeeGender: Yup.string()
        .required('الزامی میباشد'),
    employeeKinship: Yup.string()
        .required('الزامی میباشد'),
    employeeGrade: Yup.string().nullable().typeError('باید حروف وارد نمایید').matches(
        /^[.,ئ آ-ی]+$/,
        "باید حروف فارسی باشند"
    ),
    employeeSemesterGrade: Yup.number().nullable().typeError('باید عدد وارد نمایید')
});

const Create = () => {
    const ref = useRef<boolean>(false)
    const [showValidationRelatives, setShowValidationRelatives] = useState<boolean>(false);
    const [isRel, setIsRel] = useState<boolean>(false)
    const [visible, setVisible] = useState(false)
    const [disable, setDisable] = useState<boolean>(false);
    const [modalState, setModalState] = useState<any>({employeeRelatives: []});
    const [stateShowMore, setStateShowMore] = useState<boolean>(false);
    const navigate = useNavigate();
    const kinshipElement = useRef<any>();
    // @ts-ignore
    const {state, setData, setExplicitField, validate} = useValidator({
        initialData: EmployeeInitialValues,
        schema: EmployeeSchema,
        validationOptions: {
            abortEarly: true
        },
    })

    const weekDays = ["شن", "یک", "دو", "سه", "چهار", "پنج", "جم"]
    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]

    useEffect(() => {
        if (!ref.current) {
            formik.setValues(() => ({
                employeeModalId: '',
                employeeId: "",
                employeeFirstName: "",
                employeeLastName: "",
                employeeKinship: undefined,
                employeeBirthDay: "",
                employeeGender: undefined,
                employeeGrade: null,
                employeeSemesterGrade: null
            }))
            formik.setTouched({})
        }
    }, [visible])

    useEffect(() => {
        let localState = state.$data.relatives || [];
        let isThere: any;
        if (localState) {

            let test: any;
            let testModalId: any;
            if (!modalState.employeeRelatives[0]?.id)
                isThere = localState.find((item: any) => (item.id === modalState.employeeRelatives[0].id &&
                    item.modalId === modalState.employeeRelatives[0].modalId))
            else
                isThere = localState.find((item: any) => (item.id === modalState.employeeRelatives[0].id))
            let index;
            if (isThere || isThere?.id === "") {
                test = isThere.id
                testModalId = isThere.modalId
                index = localState.findIndex((item: any) => {
                    if (item.modalId)
                        return item.modalId === testModalId
                    else
                        return item.id === test
                })
                if (isThere?.id !== "") {
                    localState = localState.filter((item: any) => item.id !== test)
                }
                let isIn = localState.find((item: any) => item.modalId === modalState.employeeRelatives[0].modalId);
                if (!!isIn) localState = localState.filter((item: any) => item.modalId !== modalState.employeeRelatives[0].modalId);
                if (index !== -1) {
                    localState.splice(index, 0, modalState.employeeRelatives[0]);
                } else {
                    localState.push(modalState.employeeRelatives[0])
                }
            }
        }
        if (!isThere) {
            localState = [...localState, ...modalState.employeeRelatives]
        } else {
            localState = [...localState]
        }
        setData((old: any) => ({
            ...old,
            relatives: localState,
        }))
        setShowValidationRelatives(false)
    }, [modalState, setData])

    const handleEdit = (item: any, uuid: string) => {

        setVisible(true)
        ref.current = true;
        formik.setValues(() => ({
            employeeModalId: uuid,
            employeeId: item.id,
            employeeFirstName: item.firstName,
            employeeLastName: item.lastName,
            employeeKinship: item.kinship,
            employeeBirthDay: item.birthDate,
            employeeGender: item.gender,
            employeeGrade: item.grade,
            employeeSemesterGrade: item.semesterGrade
        }))
    }

    const handleDelete = (item: any) => {
        setData((prev: any) => {
            let prevVar = prev;
            let relatives = prev.relatives.filter((itm: any) => {
                return itm.modalId !== item.modalId
            });
            prevVar = {...prevVar, relatives}
            return prevVar
        })
    }

    const openModal = () => {
        setVisible(!visible)
        ref.current = false
    }

    const HandleChangeChecked = (e: any) => {
        // react < v17
        e.persist()

        if (e.target.name === "Gender") {
            if (e.target.id === 'male') {
                return setData((old: any) => ({
                    ...old,
                    gender: 1,
                }))
            } else {
                return setData((old: any) => ({
                    ...old,
                    gender: 2,
                }))
            }
        }

        if (e.target.id === 'yes') {
            setIsRel(true)
            setData((old: any) => ({
                ...old,
                relatives: [],
                [e.target.name]: true
            }))
        } else {
            setIsRel(false)
            setShowValidationRelatives(false)
            setData((old: any) => ({
                ...old,
                [e.target.name]: false,
            }))
        }
    }

    const HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // react < v17
        e.persist()

        setData((old: any) => ({
            ...old,
            [e.target.name]: e.target.value,
        }))
    }

    const handleChangeNumbers = (e: any) => {
        //
    }

    const HandleSubmit = async (e: any): Promise<void> => {
        await validate();
        let data = state;
        data.$data = {...data.$data, employeeRelatives: data.$data.relatives}

        if (!data.$data.employeeRelatives.length && data.$data.isMaried) {
            setShowValidationRelatives(true)
        } else {
            if (data.$data.acoountNumber1 === "") {
                data.$data.acoountNumber1 = null
            }
            if (data.$data.acoountNumber2 === "") {
                data.$data.acoountNumber2 = null
            }
            if (data.$data.acoountNumberOther === "") {
                data.$data.acoountNumberOther = null
            }
            if (data.$data.insuranceNumber === "") {
                data.$data.insuranceNumber = null
            }
            if (!data.$all_source_errors.length) {
                ApiService.addEmployeeToCompany(data.$data).then((e) => {
                    setDisable(true)
                    e?.status === 200 ? navigate("/company/employees/list") : setDisable(false)
                })
            }
        }
    }

    enum genderTypeEnum {
        Unknown = 0,
        Male = 1,
        Female = 2
    }

    enum kinshipTypeEnum {
        Spouse = 1,
        Child = 2,
        Unknown = 0,
    }

    const renderKinship = (item: any) => {
        if (item === 1)
            return <CTableDataCell>همسر</CTableDataCell>
        if (item === 2)
            return <CTableDataCell>فرزند</CTableDataCell>
        if (item === 3)
            return <CTableDataCell>نامشخص</CTableDataCell>
        return <CTableDataCell>{item}</CTableDataCell>
    }

    const renderGender = (item: any) => {
        if (item === 1)
            return <CTableDataCell>مذکر</CTableDataCell>
        if (item === 2)
            return <CTableDataCell>مونث</CTableDataCell>
        if (item === 0)
            return <CTableDataCell>نامشخص</CTableDataCell>
        return <CTableDataCell>{item}</CTableDataCell>
    }

    const formik = useFormik({
        initialValues: {
            employeeModalId: "",
            employeeFirstName: '',
            employeeLastName: '',
            employeeKinship: undefined,
            employeeBirthDay: '',
            employeeGender: undefined,
            employeeGrade: null,
            employeeSemesterGrade: null
        },
        validationSchema: ModalSchema,
        onSubmit: values => {
            setModalState({
                employeeRelatives: [
                    {
                        modalId: values.employeeModalId || generateUUID(),
                        id: "",
                        firstName: values.employeeFirstName,
                        lastName: values.employeeLastName,
                        kinship: values.employeeKinship ? +values.employeeKinship : values.employeeKinship,
                        birthDate: values.employeeBirthDay,
                        gender: values.employeeGender ? +values.employeeGender : values.employeeGender,
                        grade: values.employeeGrade,
                        semesterGrade: !values.employeeSemesterGrade ? values.employeeSemesterGrade : +values.employeeSemesterGrade,
                    }
                ]
            })
            ref.current = false;
            setVisible(false)
        },
    });

    useEffect(() => {
        if (kinshipElement.current?.value === 2 || kinshipElement.current?.value === "2") {
            setStateShowMore(true)
        } else {
            setStateShowMore(false)
        }
        setTimeout(() => {
            if (kinshipElement.current?.value === 2 || kinshipElement.current?.value === "2") {
                setStateShowMore(true)
            } else {
                setStateShowMore(false)
            }
            // @ts-ignore
        }, [300])
    }, [formik?.values, visible])

    const handleDtPickerChange = (e: any) => {
        formik.setValues((old) => ({
            ...old,
            employeeBirthDay: `${e.year}/${e.month}/${e.day}`
        }))
    }

    const handleKinship = ({target: {value}}: any) => {
        if (value === "1" || value === 1) {
            formik.setValues((old) => ({
                ...old,
                employeeKinship: value,
                employeeGrade: null,
                employeeSemesterGrade: null
            }))
        }
        if (value === "2" || value === 2) {
            formik.setValues((old) => ({
                ...old,
                employeeKinship: value
            }))
        }
    }

    return (
        <Fragment>
            <CCard>
                <CCardHeader>
                    <h5>افزودن کارمند جدید</h5>
                </CCardHeader>
                <CCardBody className="row g-3">
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="firstName">نام</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange}
                                        onBlur={() => setExplicitField("firstName", true)}
                                        name="firstName"
                                        placeholder="نام"
                            />
                        </div>
                        <p className="text-danger">
                            {state.$errors.firstName?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="lastName">نام خانوادگی</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange} name="lastName" placeholder="نام خانوادگی"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.lastName?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="fatherName">نام پدر</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange} name="fatherName" placeholder="نام پدر"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.fatherName?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="nationalCode">کد ملی</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange} maxLength={10} name="nationalCode" placeholder="کد ملی"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.nationalCode?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="post">سمت</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange} name="post" placeholder="سمت"/>
                        </div>

                        <p className="text-danger">
                            {state.$errors.post?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="birthDate">تاریخ تولد</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <DtPicker
                                onChange={(data) => {
                                    setData((old: any) => ({
                                        ...old,
                                        birthDate: ConvertKendoDate.convertToString(data),
                                    }))
                                }}
                                maxDate={{
                                    year: Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', {
                                        year: "numeric"
                                    })) - 15,
                                    month: Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', {
                                        month: "numeric"
                                    })),
                                    day: Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', {
                                        day: "numeric"
                                    }))
                                }}
                                local="fa"
                                inputClass={"form-control bg-white"}
                                showWeekend
                                todayBtn
                                placeholder={"وارد نمایید"}
                            />
                        </div>
                        <p className="text-danger">
                            {state.$errors.birthDate?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="dateOfBecomeEmployee">تاریخ استخدام</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <DtPicker
                                onChange={(data) => {
                                    setData((old: any) => ({
                                        ...old,
                                        dateOfBecomeEmployee: ConvertKendoDate.convertToString(data),
                                    }))
                                }}
                                local="fa"
                                maxDate={{
                                    year: Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', {
                                        year: "numeric"
                                    })),
                                    month: Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', {
                                        month: "numeric"
                                    })),
                                    day: Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', {
                                        day: "numeric"
                                    }))
                                }}
                                inputClass={"form-control bg-white"}
                                showWeekend
                                todayBtn
                                placeholder={"وارد نمایید"}
                            />
                        </div>
                        <p className="text-danger">
                            {state.$errors.dateOfBecomeEmployee?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="phoneNumber">شماره تماس</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange} name="phoneNumber" placeholder="شماره تماس"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.phoneNumber?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="acoountNumber1">شماره حساب پست بانک</CFormLabel>
                            <CFormInput onChange={(e) => {
                                HandleChange(e)
                                handleChangeNumbers(e)
                            }} name="acoountNumber1" placeholder="شماره حساب"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.acoountNumber1?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="acoountNumber2">شماره حساب بانک مهر</CFormLabel>
                            <CFormInput onChange={(e) => {
                                HandleChange(e)
                                handleChangeNumbers(e)
                            }} name="acoountNumber2" placeholder="شماره حساب"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.acoountNumber2?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="acoountNumberOther">شماره حساب بانک رسالت</CFormLabel>
                            <CFormInput onChange={(e) => {
                                HandleChange(e)
                                handleChangeNumbers(e)
                            }} name="acoountNumberOther" placeholder="شماره حساب بانک رسالت"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.acoountNumberOther?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="placeOfBirth">محل تولد</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange} name="placeOfBirth" placeholder="محل تولد"
                            />
                        </div>

                        <p className="text-danger">
                            {state.$errors.placeOfBirth?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="insuranceNumber">شماره بیمه</CFormLabel>
                            <CFormInput onChange={(e) => {
                                HandleChange(e)
                                handleChangeNumbers(e)
                            }} name="insuranceNumber"
                                        placeholder="شماره بیمه"/>
                        </div>

                        <p className="text-danger">
                            {state.$errors.insuranceNumber?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={4}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="address">آدرس</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <textarea rows={3} className={'form-control'} onChange={HandleChange} name="address"
                                      placeholder="آدرس"/>
                        </div>

                        <p className="text-danger">
                            {state.$errors.address?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={2} className={'ms-xl-4'}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="isMaried">وﺿﻌﯿﺖ ﺗﺄﻫﻞ</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormCheck type="radio" id={'yes'} onChange={HandleChangeChecked} name="isMaried"
                                        label="متاهل"/>
                            <CFormCheck type="radio" defaultChecked={true} id={'no'} onChange={HandleChangeChecked}
                                        name="isMaried" label="مجرد"/>
                        </div>
                        <p className="text-danger">
                            {state.$errors.isMaried?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={2}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Gender">جنسیت</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormCheck type="radio" id={'male'} defaultChecked={true} onChange={HandleChangeChecked}
                                        name="Gender"
                                        label="مذکر"/>
                            <CFormCheck type="radio" id={'no'} onChange={HandleChangeChecked}
                                        name="Gender" label="مونث"/>
                        </div>
                    </CCol>
                    {isRel && <Fragment>
                        <h6>اعضای خانواده</h6>
                        <CCol md={12}>
                            <div className={'table-toolbar'}>
                                <CButton onClick={() => openModal()} color="light">افزودن</CButton>

                                {/*modal*/}
                                <CModal visible={visible} onClose={() => {
                                    setVisible(false)
                                    ref.current = false
                                }}>
                                    <CForm onSubmit={formik.handleSubmit}>
                                        {/*@ts-ignore*/}
                                        <CModalHeader>
                                            <CModalTitle>افزودن اعضا</CModalTitle>
                                        </CModalHeader>
                                        <CModalBody>
                                            <CRow>
                                                <div className="col-6">
                                                    <CFormLabel className={'mt-4'}
                                                                htmlFor="employeeFirstName">نام</CFormLabel>
                                                    <span className={'text-danger'}>*</span>
                                                    <CFormInput type="text" id="employeeFirstName"
                                                                onChange={formik.handleChange}
                                                                value={formik.values.employeeFirstName}
                                                                aria-describedby="text"/>
                                                    {formik.errors.employeeFirstName && formik.touched.employeeFirstName ? (
                                                        <div
                                                            className={'text-danger'}>{formik.errors.employeeFirstName}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-6">
                                                    <CFormLabel className={'mt-4'} htmlFor="employeeLastName">نام
                                                        خانوادگی</CFormLabel>
                                                    <span className={'text-danger'}>*</span>
                                                    <CFormInput type="text" id="employeeLastName"
                                                                onChange={formik.handleChange}
                                                                value={formik.values.employeeLastName}
                                                                aria-describedby="text"/>
                                                    {formik.errors.employeeLastName && formik.touched.employeeLastName ? (
                                                        <div
                                                            className={'text-danger'}>{formik.errors.employeeLastName}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-6">
                                                    <CFormLabel className={'mt-4'} htmlFor="employeeBirthDay">تاریخ
                                                        تولد</CFormLabel>
                                                    <span className={'text-danger'}>*</span>
                                                    <div style={{direction: "rtl"}}>
                                                        <DatePicker
                                                            weekDays={weekDays}
                                                            months={months}
                                                            maxDate={new Date()}
                                                            onChange={(e) => handleDtPickerChange(e)}
                                                            calendar={persian}
                                                            value={formik.values.employeeBirthDay}
                                                            locale={persian_en}
                                                            calendarPosition="bottom-right"
                                                        />
                                                    </div>
                                                    {formik.errors.employeeBirthDay && formik.touched.employeeBirthDay ? (
                                                        <div
                                                            className={'text-danger'}>{formik.errors.employeeBirthDay}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-6">
                                                    <CFormLabel className={'mt-4'}>جنسیت</CFormLabel>
                                                    <span className={'text-danger'}>*</span>
                                                    <CFormSelect id={'employeeGender'} name={'employeeGender'}
                                                                 onChange={formik.handleChange}
                                                                 value={formik.values.employeeGender}>
                                                        <option value={genderTypeEnum.Unknown}>انتخاب کنید</option>
                                                        <option value={genderTypeEnum.Female}>مونث</option>
                                                        <option value={genderTypeEnum.Male}>مذکر</option>
                                                    </CFormSelect>
                                                    {formik.errors.employeeGender && formik.touched.employeeGender ? (
                                                        <div
                                                            className={'text-danger'}>{formik.errors.employeeGender}</div>
                                                    ) : null}
                                                </div>
                                                <div className="col-6">
                                                    <CFormLabel className={'mt-4'}>نسبت</CFormLabel>
                                                    <span className={'text-danger'}>*</span>
                                                    <CFormSelect ref={kinshipElement} id={'employeeKinship'}
                                                                 name={'employeeKinship'}
                                                                 onChange={(e) => handleKinship(e)}
                                                                 value={formik.values.employeeKinship}>
                                                        <option value={kinshipTypeEnum.Unknown}>انتخاب کنید</option>
                                                        <option value={kinshipTypeEnum.Spouse}>همسر</option>
                                                        <option value={kinshipTypeEnum.Child}>فرزند</option>
                                                    </CFormSelect>
                                                    {formik.errors.employeeKinship && formik.touched.employeeKinship ? (
                                                        <div
                                                            className={'text-danger'}>{formik.errors.employeeKinship}</div>
                                                    ) : null}
                                                </div>
                                                {stateShowMore ? <Fragment>
                                                    <div className="col-6">
                                                        <CFormLabel className={'mt-4'}
                                                                    htmlFor="employeeGrade">مقطع تحصیلی</CFormLabel>
                                                        <CFormInput type="text" id="employeeGrade"
                                                                    onChange={formik.handleChange}
                                                            //@ts-ignore
                                                                    value={formik.values.employeeGrade}
                                                                    aria-describedby="text"/>
                                                        {formik.errors.employeeGrade && formik.touched.employeeGrade ? (
                                                            <div
                                                                className={'text-danger'}>{formik.errors.employeeGrade}</div>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-6">
                                                        <CFormLabel className={'mt-4'}
                                                                    htmlFor="employeeSemesterGrade">نمره آخرین مقطع
                                                            تحصیلی</CFormLabel>
                                                        <CFormInput type="text" id="employeeSemesterGrade"
                                                                    onChange={formik.handleChange}
                                                            //@ts-ignore
                                                                    value={formik.values.employeeSemesterGrade}
                                                                    aria-describedby="text"/>
                                                        {formik.errors.employeeSemesterGrade && formik.touched.employeeSemesterGrade ? (
                                                            <div
                                                                className={'text-danger'}>{formik.errors.employeeSemesterGrade}</div>
                                                        ) : null}
                                                    </div>
                                                </Fragment> : null}
                                            </CRow>
                                        </CModalBody>
                                        <CModalFooter>
                                            <CButton color="secondary" onClick={() => {
                                                setVisible(false)
                                                ref.current = false
                                            }}>
                                                بستن
                                            </CButton>
                                            <CButton type={'submit'} color="primary">ذخیره</CButton>
                                        </CModalFooter>
                                    </CForm>
                                </CModal>

                            </div>
                            <CTable striped>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">نام</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">نام خانوادگی</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">نسبت</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">تاریخ تولد</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">جنسیت</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">مقطع تحصیلی</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">نمره کارنامه تحصیلی</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {[...state.$data.relatives].map((relative: any) => {
                                        return (
                                            <CTableRow id={relative.id} key={relative.id}>
                                                <CTableDataCell hidden={true}>{relative.modalId}</CTableDataCell>
                                                <CTableDataCell>{relative.firstName}</CTableDataCell>
                                                <CTableDataCell>{relative.lastName}</CTableDataCell>
                                                {renderKinship(relative.kinship)}
                                                <CTableDataCell>{relative.birthDate}</CTableDataCell>
                                                {renderGender(relative.gender)}
                                                <CTableDataCell>{relative.grade}</CTableDataCell>
                                                <CTableDataCell>{relative.semesterGrade}</CTableDataCell>
                                                <CTableDataCell className={'d-flex gap-2'}>
                                                    <CButton color="secondary"
                                                             onClick={() => handleEdit(relative, relative.modalId)}>ویرایش</CButton>
                                                    <CButton color="danger"
                                                             onClick={() => handleDelete(relative)}>حذف</CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        )
                                    })}
                                </CTableBody>
                            </CTable>
                        </CCol>
                    </Fragment>}
                    {showValidationRelatives && <p className={'text-danger'}>در صورت متاهل بودن وارد کردن اعضای خانواده الزامی میباشد</p>}
                </CCardBody>
                <CCardFooter>
                    <div className={'gap-2 d-flex'}>
                        <Link to={"/company/employees/list"} className={'btn btn-light'}>بازگشت</Link>
                        <CButton
                            disabled={disable}
                            style={{width: 100}}
                            color={"success"}
                            onClick={HandleSubmit}>ثبت</CButton>
                    </div>
                </CCardFooter>
            </CCard>
        </Fragment>
    )
}

export default Create;
