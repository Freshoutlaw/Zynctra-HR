package com.zynctra.learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses", schema = "learning_schema")
public class Course extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "title", nullable = false, length = 256)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "difficulty", nullable = false, length = 16)
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty = Difficulty.BEGINNER;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "requires_certification", nullable = false)
    private Boolean requiresCertification = false;

    public enum