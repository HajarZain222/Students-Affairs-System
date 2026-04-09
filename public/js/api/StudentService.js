// Students service extending base API service
import ApiService from "./BaseApiService.js";

class StudentService extends ApiService {
  // Call parent constructor with students resource
  constructor() {
    super("students");
  }
}

export default StudentService;
