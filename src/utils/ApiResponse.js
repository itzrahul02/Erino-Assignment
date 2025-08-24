class ApiResponse{
    constructor(status,data,message="success"){
        this.success = status<400;
        this.status = status;
        this.data = data;
        this.message = message;
    }
}
export {ApiResponse};

 