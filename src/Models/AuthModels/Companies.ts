import {IEmployees} from "./IEmployees";

export interface ICompany {
    id?: string;
    CompanyName: string;
    UserName: string;
    Password: string;
    Employees: IEmployees[];
    CreatedDate: Date;
}