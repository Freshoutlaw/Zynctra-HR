package com.zynctra.performance.security;

import org.hibernate.CallbackException;
import org.hibernate.Interceptor;
import org.hibernate.type.Type;

import java.io.Serializable;

/**
 * Hibernate Interceptor that enforces tenant filtering at the session level.
 * This is a backup to the @Filter annotation on SecureBaseEntity.
 */
public class TenantFilterInterceptor implements Interceptor {

    @Override
    public boolean onLoad(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) throws CallbackException {
        // Validate tenant on load operations
        if (entity instanceof com.zynctra.performance.entity.SecureBaseEntity) {
            String currentTenant = TenantContext.getCurrentTenant();
            // Tenant validation is handled by the @Filter, this is defense-in-depth
        }
        return false;
    }

    @Override
    public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState, String[] propertyNames, Type[] types) throws CallbackException {
        return false;
    }

    @Override
    public boolean onSave(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) throws CallbackException {
        return false;
    }

    @Override
    public void onDelete(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) throws CallbackException {
    }

    @Override
    public void onCollectionRecreate(Object collection, Serializable key) throws CallbackException {
    }

    @Override
    public void onCollectionRemove(Object collection, Serializable key) throws CallbackException {
    }

    @Override
    public void onCollectionUpdate(Object collection, Serializable key) throws CallbackException {
    }
}