package com.zynctra.auth.service;

import com.zynctra.auth.dto.AuthResponse;
import com.zynctra.auth.dto.LoginRequest;
import com.zynctra.common.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Assuming UserDetails implementation contains userId, tenantId, and roles
        // In a real implementation, you'd cast to your custom UserPrincipal
        String userId = authentication.getName(); 
        String tenantId = "T001"; // Placeholder: Retrieve from UserPrincipal
        String role = "ROLE_USER"; // Placeholder: Retrieve from Authorities

        String access = jwtTokenProvider.generateAccessToken(userId, request.getEmail(), tenantId, role);
        String refresh = jwtTokenProvider.generateRefreshToken(userId, tenantId);

        return AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .build();
    }

    public AuthResponse refreshToken(String token) {
        String cleanToken = token.replace("Bearer ", "");
        String userId = jwtTokenProvider.getUserIdFromToken(cleanToken);
        String tenantId = jwtTokenProvider.getTenantIdFromToken(cleanToken);
        
        return AuthResponse.builder()
                .accessToken(jwtTokenProvider.generateAccessToken(userId, "email@placeholder.com", tenantId, "ROLE_USER"))
                .refreshToken(jwtTokenProvider.generateRefreshToken(userId, tenantId))
                .build();
    }
}