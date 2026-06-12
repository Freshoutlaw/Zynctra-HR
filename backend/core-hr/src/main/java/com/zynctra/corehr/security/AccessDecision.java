package com.zynctra.corehr.security;

/**
 * Immutable access decision for an employee record.
 */
public record AccessDecision(
    boolean self,
    boolean manager,
    boolean hr,
    boolean admin,
    boolean finance,
    boolean directorPlus
) {}