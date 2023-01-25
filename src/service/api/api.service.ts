import Api from '../api';
import {ICompany} from "../../Models/AuthModels/Companies";
import {IEmployees} from "../../Models/AuthModels/IEmployees";
import http from "../api";
import {IChangeStatus} from "../../Models/AuthModels/IChangeStatus";

export default class ApiService {

    static getAllEmployees(id?: ICompany["id"]) {
        return Api.get<IEmployees[]>("/employees/get-all-employees")
    }

    static getEmployeeById(id?: IEmployees["id"]) {
        return Api.get<IEmployees>(`/employees/getby/${id}`)
    }

    static getAllEmployeees() {
        return Api.get<IEmployees[]>(`/users/get-all`)
    }

    static checkUserToken() {
        return Api.get<any>(`/users/check-user`)
    }

    static addEmployeeToCompany(Data: IEmployees) {
        return http.post<IEmployees>("/employees/create", {...Data})
    }

    static editEmployee(Data: IEmployees, id: IEmployees["id"]) {
        return http.put<IEmployees>("/employees/info-edit", {...Data, id})
    }

    static employeeChangeStatus(userId: IEmployees["id"]) {
        return Api.put<IChangeStatus>("/employees/change-status", {userId})
    }

    static MovingToAnother(data: any) {
        return Api.put<any>("/employees/move-to/companies", data)
    }
}
