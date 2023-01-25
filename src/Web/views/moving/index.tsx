import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import ApiService from "../../../service/api/api.service";
import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CFormLabel, CFormSelect
} from "@coreui/react";

const Index = () => {
    const {id: employeeId} = useParams();
    const navigate = useNavigate();
    const [dataFetch, setDataFetch] = useState<any[]>([]);
    const [data, setData] = useState<any>();
    const validation = useRef<any>();
    useEffect(() => {
        ApiService.getAllEmployeees().then((res) => {
            setDataFetch(res.data);
        })
    }, [employeeId])

    const handleChange = useCallback((e) => {
        validation.current.innerText = ""
        setData((prev: any) => ({...prev, [e.target.name]: e.target.value, employeeId}))
    }, [employeeId])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!data) {
            return validation.current.innerText = "انتخاب نام شرکت الزامی است"
        }
        return ApiService.MovingToAnother(data).then((res) => {
            res?.status === 200 && navigate("/company/employees/list")
        })
    }

    return (
        <CCard>
            <form onSubmit={(e) => handleSubmit(e)}>
                <CCardHeader>
                    <h5>جا به جایی کارمند به شرکت دیگر</h5>
                </CCardHeader>
                <CCardBody className="row g-3">
                    <CCol md={3}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="userId">نام شرکت</CFormLabel>
                            <span className={"text-danger ms-1"}>*</span>
                            <CFormSelect aria-label="userId" placeholder="نام شرکت" onChange={(e) => handleChange(e)}
                                         name="userId">
                                <option value={undefined}>انتخاب کنید</option>
                                {dataFetch.map(company => (
                                    <option value={company.id}>{company.name}</option>
                                ))}
                            </CFormSelect>
                            <span className={'text-danger'} ref={validation}/>
                        </div>
                    </CCol>
                </CCardBody>
                <CCardFooter>
                    <div className={'gap-2 d-flex'}>
                        <Link to={"/company/employees/list"} className={'btn btn-light'}>بازگشت</Link>
                        <CButton
                            style={{width: 100}}
                            color={"success"}
                            type={'submit'}
                        >ثبت</CButton>
                    </div>
                </CCardFooter>
            </form>
        </CCard>
    );
};

export default Index;
