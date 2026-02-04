/**
 * @task S4S1
 * 역할 기반 접근 제어 (RBAC)
 */
const ROLES = {
    USER: 'user',
    PREMIUM: 'premium',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
};

const PERMISSIONS = {
    [ROLES.USER]: ['read:own', 'update:own'],
    [ROLES.PREMIUM]: ['read:own', 'update:own', 'use:ai'],
    [ROLES.ADMIN]: ['read:all', 'update:all', 'manage:users', 'manage:subscriptions'],
    [ROLES.SUPER_ADMIN]: ['*']
};

function hasPermission(role, permission) {
    const rolePermissions = PERMISSIONS[role] || [];
    return rolePermissions.includes('*') || rolePermissions.includes(permission);
}

module.exports = { ROLES, PERMISSIONS, hasPermission };
