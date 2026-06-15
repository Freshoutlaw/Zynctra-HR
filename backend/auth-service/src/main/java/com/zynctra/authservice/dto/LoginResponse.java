package com.zynctra.authservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private UserDto user;

    public LoginResponse() {}

    public LoginResponse(String accessToken, String refreshToken, Long expiresIn, UserDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public Long getExpiresIn() { return expiresIn; }
    public UserDto getUser() { return user; }

    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
    public void setUser(UserDto user) { this.user = user; }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String accessToken;
        private String refreshToken;
        private Long expiresIn;
        private UserDto user;

        public LoginResponseBuilder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }

        public LoginResponseBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public LoginResponseBuilder expiresIn(Long expiresIn) {
            this.expiresIn = expiresIn;
            return this;
        }

        public LoginResponseBuilder user(UserDto user) {
            this.user = user;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(accessToken, refreshToken, expiresIn, user);
        }
    }

    public static class UserDto {
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private Boolean emailVerified;
        private Boolean mfaEnabled;

        public UserDto() {}

        public UserDto(String id, String email, String firstName, String lastName, String role, Boolean emailVerified, Boolean mfaEnabled) {
            this.id = id;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
            this.emailVerified = emailVerified;
            this.mfaEnabled = mfaEnabled;
        }

        public String getId() { return id; }
        public String getEmail() { return email; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getRole() { return role; }
        public Boolean getEmailVerified() { return emailVerified; }
        public Boolean getMfaEnabled() { return mfaEnabled; }

        public void setId(String id) { this.id = id; }
        public void setEmail(String email) { this.email = email; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public void setRole(String role) { this.role = role; }
        public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
        public void setMfaEnabled(Boolean mfaEnabled) { this.mfaEnabled = mfaEnabled; }

        public static UserDtoBuilder builder() {
            return new UserDtoBuilder();
        }

        public static class UserDtoBuilder {
            private String id;
            private String email;
            private String firstName;
            private String lastName;
            private String role;
            private Boolean emailVerified;
            private Boolean mfaEnabled;

            public UserDtoBuilder id(String id) { this.id = id; return this; }
            public UserDtoBuilder email(String email) { this.email = email; return this; }
            public UserDtoBuilder firstName(String firstName) { this.firstName = firstName; return this; }
            public UserDtoBuilder lastName(String lastName) { this.lastName = lastName; return this; }
            public UserDtoBuilder role(String role) { this.role = role; return this; }
            public UserDtoBuilder emailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; return this; }
            public UserDtoBuilder mfaEnabled(Boolean mfaEnabled) { this.mfaEnabled = mfaEnabled; return this; }

            public UserDto build() {
                return new UserDto(id, email, firstName, lastName, role, emailVerified, mfaEnabled);
            }
        }
    }
}
