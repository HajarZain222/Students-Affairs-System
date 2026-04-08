// Instructors service extending base API service
import ApiService from "./BaseApiService.js";

class InstructorsService extends ApiService {
  // Call parent constructor with instructors resource
  constructor() {
    super("instructors");
  }
}

export default InstructorsService;
