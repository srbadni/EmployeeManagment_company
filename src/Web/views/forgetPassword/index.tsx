import {CCardBody, CCard, CButton, CForm, CFormInput, CFormLabel, CCol} from "@coreui/react";
import {FC, Fragment} from "react";
import {Link, useNavigate} from "react-router-dom";
import AuthService from "../../../service/auth/auth.service";
import {PasswordSchema, PasswordSchemaInitialValues} from '../../../validators/password/password.schema'
import {useValidator} from "react-joi"
import {useSelector} from "react-redux";

const Create: FC<any> = () => {
    const userId = useSelector((store: any) => store.auth.userId);
    // @ts-ignore
    const {state, setData, setExplicitField, validate} = useValidator({
        initialData: PasswordSchemaInitialValues,
        schema: PasswordSchema,
        validationOptions: {
            abortEarly: true
        },
    })

    const HandleChange = (e: any) => {
        // react < v17
        e.persist()

        setData((old: any) => ({
            ...old,
            [e.target.name]: e.target.value,
        }))
    }

    const navigate = useNavigate();
    const HandleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        await validate();
        if (!state.$all_source_errors.length) {
            AuthService.changePassword({...state.$data, id: userId}).then((e) => {
                e?.status === 200 && navigate("/")
            })
        }
    }

    return (
        <Fragment>
            <CCard>
                <CCardBody>
                    <CForm className={"row"} onSubmit={HandleSubmit}>
                        <legend>تغییر رمز عبور</legend>
                        <CCol md={3} className="mb-3">
                            <CFormLabel htmlFor="newPassword">رمز عبور جدید</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange}
                                        name="newPassword"
                                        type={"password"}
                                        onBlur={() => setExplicitField("newPassword", true)}
                                        placeholder="رمز عبور جدید"/>
                            <p className="text-danger">
                                {state.$errors.newPassword?.map((data: any) => data.$message).join(",")}
                            </p>
                        </CCol>
                        <CCol md={3} className="mb-3">
                            <CFormLabel htmlFor="confirmPassword">تکرار رمز عبور جدید</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormInput onChange={HandleChange}
                                        name="confirmPassword"
                                        type={"password"}
                                        onBlur={() => setExplicitField("confirmPassword", true)}
                                        placeholder="تکرار رمز عبور جدید"/>
                            <p className="text-danger">
                                {state.$errors.confirmPassword?.map((data: any) => data.$message).join(",")}
                            </p>
                        </CCol>
                        <CCol md={12} className={'gap-2 d-flex'}>
                            <Link to={"/"} className={'btn btn-light'}>بازگشت</Link>
                            <CButton color={"success"} type="submit">ثبت</CButton>
                        </CCol>
                    </CForm>
                </CCardBody>
            </CCard>
        </Fragment>
    )
}

export default Create;
