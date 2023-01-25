import {Grid, GridColumn, GridNoRecords, GridToolbar} from '@progress/kendo-react-grid';
import {ExcelExport} from "@progress/kendo-react-excel-export";
import {Fragment, useEffect, useRef, useState} from "react";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import {Link} from "react-router-dom";
import {IEmployees} from "../../../Models/AuthModels/IEmployees";
import ApiService from "../../../service/api/api.service";
import useGridFilterable from "../../../hooks/useGridFilterable";
import {CompositeFilterDescriptor} from "@progress/kendo-data-query";

const Employees = () => {

    const [EmployeeDataFetch, setEmployeeDataFetch] = useState<IEmployees[]>([]);

    useEffect(() => {
        ApiService.getAllEmployees().then((res) => {
            setEmployeeDataFetch(res.data);
        })
    }, [])

    const CommandCell = (props: any) => (
        <td>
            <CDropdown className={"position-static"}>
                <CDropdownToggle color="light">عملیات</CDropdownToggle>
                <CDropdownMenu>
                    <Link className={'dropdown-item'}
                          to={`/company/employees/edit/${props.dataItem.id}`}
                    >ویرایش</Link>
                    <Link className={'dropdown-item'}
                          to={`/company/employees/moving/${props.dataItem.id}`}
                    >جا به جایی</Link>
                    <CDropdownItem className={'dropdown-item'}
                                   onClick={() => {
                                       ApiService.employeeChangeStatus(props.dataItem.id).then(() => {
                                           return ApiService.getAllEmployees()
                                       }).then((res) => {
                                           setEmployeeDataFetch(res.data);
                                       })
                                   }}>
                        تغییر وضعیت
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
        </td>
    );

    const _export = useRef<ExcelExport | null>(null);
    const excelExport = () => {
        if (_export.current !== null) {
            _export.current.save();
        }
    };

    const initialFilter: CompositeFilterDescriptor = {
        logic: "and",
        filters: [],
    };
    const {gridControlProps} = useGridFilterable({
        data: EmployeeDataFetch,
        initialFilter
    });

    return (
        <Fragment>
            <ExcelExport data={EmployeeDataFetch} ref={_export} dir='rtl'>
                <Grid
                    {...gridControlProps()}
                    sortable={'true'}
                    style={{height: "550px"}}
                >
                    <GridToolbar>
                        <button
                            title="خروجی اکسل"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                            onClick={excelExport}
                        >
                            خروجی اکسل
                        </button>
                    </GridToolbar>
                    <GridNoRecords>
                        کارمندی وجود ندارد
                    </GridNoRecords>
                    <GridColumn field="firstName" width="150" title="نام"/>
                    <GridColumn field="lastName" width="150" title="نام خانوادگی"/>
                    <GridColumn field="post" width="150" title="سمت"/>
                    <GridColumn field="isMaried" width="150" title="وضعیت تاهل"/>
                    <GridColumn field="gender" width="150" title="جنسیت"/>
                    <GridColumn field="nationalCode" width="150" title="کد ملی"/>
                    <GridColumn field="birthDate" width="150" title="تاریخ تولد"/>
                    <GridColumn field="placeOfBirth" width="150" title="محل تولد"/>
                    <GridColumn field="dateOfBecomeEmployee" width="150" title="تاریخ استخدام"/>
                    <GridColumn field="phoneNumber" width="150" title="شماره تماس"/>
                    <GridColumn field="acoountNumber1" width="200" title="شماره حساب پست بانک"/>
                    <GridColumn field="acoountNumber2" width="200" title="شماره حساب بانک مهر"/>
                    <GridColumn field="acoountNumberOther" width="200" title="شماره حساب بانک رسالت"/>
                    <GridColumn field="insuranceNumber" width="180" title="شماره بیمه"/>
                    <GridColumn field="address" width="170" title="آدرس"/>
                    <GridColumn field="isActive" width="150" title="وضعیت"/>
                    <GridColumn cell={CommandCell} width="150" title="عملیات"/>
                </Grid>
            </ExcelExport>
        </Fragment>
    )
}

export default Employees;
