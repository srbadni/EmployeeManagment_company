import http from "../http";

export default class AuthService {
    static changePassword(Data: any) {
        return http.put<any>("/users/change-password", {...Data})
    }
}
