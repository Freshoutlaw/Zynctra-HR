package com.zynctra.corehr.entity;

import com.zynctra.common.entity.SecureBaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "departments", schema = "core_hr_schema")
public class Department extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 16)
    private String code;

    @Column(name = "parent_id", length = 64)
    private String parentId; // Self-referencing hierarchy

    @Column(name = "head_employee_id", length = 64)
    private String headEmployeeId;

    @Column(name = "cost_center", length = 32)
    private String costCenter;

    @Column(name = "location", length = 128)
    private String location;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // Factory
    public static Department create(String name, String code, String createdBy) {
        Department dept = new Department();
        dept.name = name;
        dept.code = code.toUpperCase();
        dept.active = true;
        return dept;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getCode() { return code; }
    public String getParentId() { return parentId; }
    public String getHeadEmployeeId() { return headEmployeeId; }
    public String getCostCenter() { return costCenter; }
    public String getLocation() { return location; }
    public Boolean getActive() { return active; }

    // Setters (mutable fields only)
    public void setName(String name) { this.name = name; }
    public void setParentId(String parentId) { this.parentId = parentId; }
    public void setHeadEmployeeId(String headEmployeeId) { this.headEmployeeId = headEmployeeId; }
    public void setCostCenter(String costCenter) { this.costCenter = costCenter; }
    public void setLocation(String location) { this.location = location; }
    public void setActive(Boolean active) { this.active = active; }
}