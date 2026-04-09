// Employees service extending base API service
import ApiService from "./BaseApiService.js";

class EmployeeService extends ApiService {
  // Call parent constructor with employees resource
  constructor() {
    super("employees");
  }
}

export default EmployeeService;
