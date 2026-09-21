const pool = require('../config/db');

// Audit logging middleware
const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // Only log on successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityId = data?.id || req.params?.id || null;
        const userId = req.user?.id || null;
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        const details = `${action} on ${entityType}${entityId ? ` #${entityId}` : ''}`;

        // Fire and forget — don't block the response
        pool.query(
          'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
          [userId, action, entityType, entityId, details, ip]
        ).catch(err => console.error('Audit log error:', err.message));
      }

      return originalJson(data);
    };

    next();
  };
};

module.exports = { auditLog };
