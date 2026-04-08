// Base API service class responsible for generic CRUD operations
class ApiService {
  // Constructor sets base URL based on resource name
  constructor(resource) {
    this.baseUrl = `http://localhost:3000/${resource}`;
  }

  // Fetch all records
  async getAll() {
    const response = await fetch(this.baseUrl);
    return await response.json();
  }

  // Fetch single record by id
  async getById(id) {
    const response = await fetch(`${this.baseUrl}/${id}`);
    return await response.json();
  }

  // Create new record
  async create(data) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  // Update existing record
  async update(id, data) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  // Delete record by id
  async delete(id) {
    await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }
}

export default ApiService;
