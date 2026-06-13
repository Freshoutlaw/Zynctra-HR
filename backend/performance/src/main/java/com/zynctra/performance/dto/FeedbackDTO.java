package com.zynctra.performance.dto;

import jakarta.validation.constraints.*;

/**
 * DTO for 360-degree feedback
 */
public class FeedbackDTO {

    private String id;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    private String reviewId;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    private String providerId;

    @Min(1) @Max(5)
    private Integer rating;

    @Size(max = 2000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String comments;

    private Boolean anonymous = false;

    // Getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public Boolean getAnonymous() { return anonymous; }
    public void setAnonymous(Boolean anonymous) { this.anonymous = anonymous; }
}