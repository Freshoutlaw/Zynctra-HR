package com.zynctra.corehr.controller;

import com.zynctra.corehr.dto.EmployeeDto;
import com.zynctra.corehr.service.EmployeeService;
import com.zynctra.common.constant.ApiConstants;
import com.zynctra.common.dto.ApiResponse;
import com.zynctra.common.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiConstants.API_PREFIX + "/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<EmployeeDto>>> listEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page, Math.min(size, ApiConstants.MAX_PAGE_SIZE));
        PageResponse<EmployeeDto> response = employeeService.listEmployees(status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDto>> getEmployee(@PathVariable String id) {
        EmployeeDto employee = employeeService.getEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok(employee));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDto>> createEmployee(@RequestBody EmployeeDto dto) {
        EmployeeDto created = employeeService.createEmployee(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Employee created successfully"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDto>> updateEmployee(
            @PathVariable String id,
            @RequestBody EmployeeDto dto) {
        EmployeeDto updated = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Employee updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Employee deleted successfully"));
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<ApiResponse<Object>> getEmployeeDocuments(@PathVariable String id) {
        // TODO: Implement document retrieval
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<ApiResponse<Object>> uploadEmployeeDocument(@PathVariable String id) {
        // TODO: Implement document upload
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(null, "Document uploaded successfully"));
    }

    @GetMapping("/{id}/attendance")
    public ResponseEntity<ApiResponse<Object>> getEmployeeAttendance(@PathVariable String id) {
        // TODO: Implement attendance retrieval
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/{id}/performance")
    public ResponseEntity<ApiResponse<Object>> getEmployeePerformance(@PathVariable String id) {
        // TODO: Implement performance retrieval
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/{id}/benefits")
    public ResponseEntity<ApiResponse<Object>> getEmployeeBenefits(@PathVariable String id) {
        // TODO: Implement benefits retrieval
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
