const TOKEN_KEY = "token";

export default class StorageService {

    static getToken() {
        return localStorage.getItem(TOKEN_KEY)
    }

    static getName() {
        return localStorage.getItem("name")
    }

    static setToken(token: string | undefined) {
        if (token)
            return localStorage.setItem(TOKEN_KEY, token)
    }

    static setName(name: string | undefined) {
        if (name)
            return localStorage.setItem("name", name)
    }

    static removeName() {
        return localStorage.removeItem("name")
    }

    static removeToken() {
        return localStorage.removeItem(TOKEN_KEY)
    }

}
