// Courses service extending base API service
import ApiService from "./BaseApiService.js";

class CoursesService extends ApiService {
  // Call parent constructor with courses resource
  constructor() {
    super("courses");
  }
}

export default CoursesService;
