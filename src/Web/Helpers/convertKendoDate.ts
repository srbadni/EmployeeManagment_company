export default class ConvertKendoDate {
    static convertToString(e: any) {
        if (e) {
            let {year, month, day} = e;
            return [year, month, day].join("/")
        }
    }

    static convertToObjDate(e: any) {
        if (e) {
            let result = e.split("/");
            return {year: +result[0], month: +result[1], day: +result[2]}
        }
    }
}