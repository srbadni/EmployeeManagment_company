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
    CModal,
    CForm,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CRow,
    CFormSelect,
    CModalFooter,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from "@coreui/react";
import {Fragment, useEffect, useRef, useState} from "react";
import DtPicker from 'react-calendar-datetime-picker'
import {Link, useNavigate, useParams} from "react-router-dom";
import {useValidator} from "react-joi";
import {EditEmployeeInitialValues, EmployeeSchema} from "../../../validators/employees/employees.schema";
import ApiService from "../../../service/api/api.service";
import ConvertKendoDate from "../../Helpers/convertKendoDate";
import './employees.scss'
import {useFormik} from "formik";
import DatePicker from "react-multi-date-picker"
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

const Edit = () => {
    const {id} = useParams();
    const ref = useRef<boolean>(false)
    const [showValidationRelatives, setShowValidationRelatives] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(false);
    const [visible, setVisible] = useState(false)
    const [modalState, setModalState] = useState<any>({employeeRelatives: []});
    const [stateShowMore, setStateShowMore] = useState<boolean>(false);
    const navigate = useNavigate();
    const kinshipElement = useRef<any>();
    // @ts-ignore
    const {state, setData, setExplicitField, validate} = useValidator({
        initialData: EditEmployeeInitialValues,
        schema: EmployeeSchema,
        validationOptions: {
            abortEarly: true
        },
    })
    const [isRel, setIsRel] = useState<boolean>(!!state.$data.isMaried)

    useEffect(() => {
        ApiService.getEmployeeById(id).then(result => {
            setData({...result.data})
        })
    }, [setData, id])
    useEffect(() => {
        if (!state.$data.isMaried) {
            setIsRel(false)
            setData((old: any) => ({
                ...old,
                relatives: []
            }))
        } else {
            setIsRel(true)
        }
    }, [state.$data.isMaried, setData])

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
            localState = [...modalState.employeeRelatives, ...localState]
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
                if (itm.modalId) {
                    return itm.modalId !== item.modalId
                } else {
                    return itm.id !== item.id
                }
            });
            prevVar = {...prevVar, relatives}
            return prevVar
        })
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

    const HandleChange = (e: any) => {
        // react < v17
        e.persist()

        setData((old: any) => ({
            ...old,
            [e.target.name]: e.target.value,
        }))
    }

    const openModal = () => {
        setVisible(!visible)
        ref.current = false
    }

    const HandleSubmit = async (): Promise<void> => {
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
                ApiService.editEmployee(data.$data, id).then((e) => {
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
            employeeId: '',
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

            setModalState(() => ({
                employeeRelatives: [
                    {
                        modalId: values.employeeModalId || generateUUID(),
                        id: values.employeeId,
                        firstName: values.employeeFirstName,
                        lastName: values.employeeLastName,
                        kinship: values.employeeKinship ? +values.employeeKinship : values.employeeKinship,
                        birthDate: values.employeeBirthDay,
                        gender: values.employeeGender ? +values.employeeGender : values.employeeGender,
                        grade: values.employeeGrade,
                        semesterGrade: !values.employeeSemesterGrade ? values.employeeSemesterGrade : +values.employeeSemesterGrade,
                    }
                ]
            }))
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
                    <h5>ویرایش</h5>
                </CCardHeader>
                <CCardBody className="row g-3">
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="firstName">نام</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput defaultValue={state.$data.firstName}
                                        onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("firstName", true)} name="firstName"
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
                            <CFormInput defaultValue={state.$data.lastName} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("lastName", true)} name="lastName"
                                        placeholder="نام خانوادگی"
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
                            <CFormInput defaultValue={state.$data.fatherName} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("fatherName", true)} name="fatherName"
                                        placeholder="نام پدر"
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
                            <CFormInput defaultValue={state.$data.nationalCode} maxLength={10} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("nationalCode", true)}
                                        name="nationalCode" placeholder="کد ملی"
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
                            <CFormInput defaultValue={state.$data.post} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("post", true)} name="post"
                                        placeholder="سمت"/>
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
                                initValue={ConvertKendoDate.convertToObjDate(state.$data.birthDate)}
                                onChange={(data) => {
                                    setData((old: any) => ({
                                        ...old,
                                        birthDate: ConvertKendoDate.convertToString(data),
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
                                initValue={ConvertKendoDate.convertToObjDate(state.$data.dateOfBecomeEmployee)}
                                onChange={(data) => {
                                    setData((old: any) => ({
                                        ...old,
                                        dateOfBecomeEmployee: ConvertKendoDate.convertToString(data),
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
                            {state.$errors.dateOfBecomeEmployee?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="phoneNumber">شماره تماس</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput defaultValue={state.$data.phoneNumber} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("phoneNumber", true)}
                                        name="phoneNumber" placeholder="شماره تماس"
                            />
                        </div>
                        <p className="text-danger">
                            {state.$errors.phoneNumber?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="acoountNumber1">شماره حساب پست بانک</CFormLabel>
                            <CFormInput defaultValue={state.$data.acoountNumber1} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("acoountNumber1", true)}
                                        name="acoountNumber1" placeholder="شماره حساب"
                            />
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="acoountNumber2">شماره حساب بانک مهر</CFormLabel>
                            <CFormInput defaultValue={state.$data.acoountNumber2} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("acoountNumber2", true)}
                                        name="acoountNumber2" placeholder="شماره حساب"
                            />
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="acoountNumberOther">شماره حساب بانک رسالت</CFormLabel>
                            <CFormInput defaultValue={state.$data.acoountNumberOther} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("acoountNumberOther", true)}
                                        name="acoountNumberOther" placeholder="شماره حساب"
                            />
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="placeOfBirth">محل تولد</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput defaultValue={state.$data.placeOfBirth} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("placeOfBirth", true)}
                                        name="placeOfBirth" placeholder="محل تولد"
                            />
                        </div>
                        <p className="text-danger">
                            {state.$errors.placeOfBirth?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="insuranceNumber">شماره بیمه</CFormLabel>
                            <CFormInput defaultValue={state.$data.insuranceNumber} onKeyUp={HandleChange}
                                        onBlur={() => setExplicitField("insuranceNumber", true)}
                                        name="insuranceNumber"
                                        placeholder="شماره بیمه"/>
                        </div>
                    </CCol>
                    <CCol md={4}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="address">آدرس</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <textarea defaultValue={state.$data.address} onKeyUp={HandleChange}
                                      className={'form-control'}
                                      rows={3}
                                      onBlur={() => setExplicitField("address", true)} name="address"
                                      placeholder="آدرس"/>
                        </div>
                        <p className="text-danger">
                            {state.$errors.address?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={2}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="isMaried">وﺿﻌﯿﺖ ﺗﺄﻫﻞ</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormCheck type="radio" checked={!!state.$data.isMaried} id={'yes'}
                                        onChange={HandleChangeChecked} name="isMaried" label="متاهل"/>
                            <CFormCheck type="radio" checked={!state.$data.isMaried} id={'no'}
                                        onChange={HandleChangeChecked} name="isMaried" label="مجرد"/>
                        </div>
                        <p className="text-danger">
                            {state.$errors.isMaried?.map((data) => data.$message).join(",")}
                        </p>
                    </CCol>
                    <CCol md={2}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="Gender">جنسیت</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormCheck type="radio" checked={state.$data.gender === 1} id={'male'}
                                        onChange={HandleChangeChecked} name="Gender" label="مذکر"/>
                            <CFormCheck type="radio" checked={state.$data.gender === 2} id={'female'}
                                        onChange={HandleChangeChecked} name="Gender" label="مونث"/>
                        </div>
                    </CCol>
                    {isRel && <Fragment>
                        <h6>اعضای خانواده</h6>
                        <CCol md={12}>
                            <div className={'table-toolbar'}>
                                <CButton onClick={() => openModal()} color="light">افزودن</CButton>

                                {/*Modal*/}
                                <CModal visible={visible} onClose={() => {
                                    setVisible(false)
                                    ref.current = false
                                }}>
                                    <CForm onSubmit={formik.handleSubmit}>
                                        {/*@ts-ignore*/}
                                        <CModalHeader onClose={() => {
                                            ref.current = false
                                            setVisible(false)
                                        }}>
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
                                                            onChange={(e) => handleDtPickerChange(e)}
                                                            weekDays={weekDays}
                                                            months={months}
                                                            maxDate={new Date()}
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
                                    {state.$data?.relatives && [...state.$data.relatives].map((relative: any) => {
                                        return (
                                            <CTableRow id={relative.id} key={relative.id}>
                                                <CTableDataCell hidden={true}>{relative.id}</CTableDataCell>
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

export default Edit;
