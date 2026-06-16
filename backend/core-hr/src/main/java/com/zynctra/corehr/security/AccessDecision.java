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
) {
    public boolean isSelf() { return self; }
    public boolean isManager() { return manager; }
    public boolean isHr() { return hr; }
    public boolean isAdmin() { return admin; }
    public boolean isFinance() { return finance; }
    public boolean isDirectorPlus() { return directorPlus; }
}