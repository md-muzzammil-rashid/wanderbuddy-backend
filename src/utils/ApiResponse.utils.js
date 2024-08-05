class ApiResponse{
    constructor(statusCode, message, data, success = true){
        this.statusCode = statusCode
        this.message = message || "Success"
        this.data = data
        this.success = success 
    }
}
export default ApiResponse