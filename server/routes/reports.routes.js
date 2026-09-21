const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports/dashboard — Dashboard statistics
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const [
      totalCases, openCases, totalPersons, wantedPersons,
      activeAlerts, pendingAlerts, totalRecords, totalUsers,
      casesByStatus, casesByRegion, alertsByStatus, alertsByPriority, recentActivity
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM criminal_cases'),
      pool.query("SELECT COUNT(*) FROM criminal_cases WHERE status IN ('open', 'under_investigation')"),
      pool.query('SELECT COUNT(*) FROM persons_of_interest'),
      pool.query('SELECT COUNT(*) FROM persons_of_interest WHERE is_wanted = true'),
      pool.query("SELECT COUNT(*) FROM wanted_alerts WHERE status IN ('authorized', 'issued')"),
      pool.query("SELECT COUNT(*) FROM wanted_alerts WHERE status = 'pending'"),
      pool.query('SELECT COUNT(*) FROM criminal_records'),
      pool.query('SELECT COUNT(*) FROM users WHERE is_active = true'),
      pool.query("SELECT status, COUNT(*) as count FROM criminal_cases GROUP BY status"),
      pool.query("SELECT region, COUNT(*) as count FROM criminal_cases WHERE region IS NOT NULL GROUP BY region ORDER BY count DESC LIMIT 10"),
      pool.query("SELECT status, COUNT(*) as count FROM wanted_alerts GROUP BY status"),
      pool.query("SELECT priority, COUNT(*) as count FROM wanted_alerts GROUP BY priority"),
      pool.query(`SELECT al.*, u.first_name || ' ' || u.last_name as user_name
                  FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id
                  ORDER BY al.created_at DESC LIMIT 10`)
    ]);

    res.json({
      stats: {
        totalCases: parseInt(totalCases.rows[0].count),
        openCases: parseInt(openCases.rows[0].count),
        totalPersons: parseInt(totalPersons.rows[0].count),
        wantedPersons: parseInt(wantedPersons.rows[0].count),
        activeAlerts: parseInt(activeAlerts.rows[0].count),
        pendingAlerts: parseInt(pendingAlerts.rows[0].count),
        totalRecords: parseInt(totalRecords.rows[0].count),
        totalUsers: parseInt(totalUsers.rows[0].count),
      },
      charts: {
        casesByStatus: casesByStatus.rows,
        casesByRegion: casesByRegion.rows,
        alertsByStatus: alertsByStatus.rows,
        alertsByPriority: alertsByPriority.rows,
      },
      recentActivity: recentActivity.rows
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/reports/cases — Case statistics
router.get('/cases', authenticate, authorize('admin', 'general_inspectorate'), async (req, res) => {
  try {
    const [byMonth, byNature, byRegion] = await Promise.all([
      pool.query(`SELECT TO_CHAR(incident_date, 'YYYY-MM') as month, COUNT(*) as count
                  FROM criminal_cases GROUP BY month ORDER BY month DESC LIMIT 12`),
      pool.query('SELECT nature, COUNT(*) as count FROM criminal_cases GROUP BY nature ORDER BY count DESC'),
      pool.query('SELECT region, COUNT(*) as count FROM criminal_cases WHERE region IS NOT NULL GROUP BY region ORDER BY count DESC')
    ]);

    res.json({
      byMonth: byMonth.rows,
      byNature: byNature.rows,
      byRegion: byRegion.rows
    });
  } catch (err) {
    console.error('Case reports error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/reports/alerts — Alert statistics
router.get('/alerts', authenticate, authorize('admin', 'general_inspectorate'), async (req, res) => {
  try {
    const [byMonth, byPriority, avgResolutionTime] = await Promise.all([
      pool.query(`SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
                  FROM wanted_alerts GROUP BY month ORDER BY month DESC LIMIT 12`),
      pool.query('SELECT priority, status, COUNT(*) as count FROM wanted_alerts GROUP BY priority, status ORDER BY priority'),
      pool.query(`SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600)::int as avg_hours
                  FROM wanted_alerts WHERE resolved_at IS NOT NULL`)
    ]);

    res.json({
      byMonth: byMonth.rows,
      byPriority: byPriority.rows,
      avgResolutionHours: avgResolutionTime.rows[0]?.avg_hours || 0
    });
  } catch (err) {
    console.error('Alert reports error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
