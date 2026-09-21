const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
require('dotenv').config();

let io;

function initRealtime(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: true,
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error('Authentication required.'));
            socket.user = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            next(new Error('Invalid or expired token.'));
        }
    });

    io.on('connection', (socket) => {
        socket.join(`role:${socket.user.role}`);
        socket.join(`user:${socket.user.id}`);

        if (socket.user.region) {
            socket.join(`region:${socket.user.region}`);
            socket.join(`checkpoint:${socket.user.region}`);
            socket.join(`public:${socket.user.region}`);
        }

        if (socket.user.station) {
            socket.join(`station:${socket.user.station}`);
            socket.join(`checkpoint:${socket.user.station}`);
        }
    });

    return io;
}

function notifyAlert({ alert, action, actor, person = null, region = null, station = null }) {
    if (!io) return;

    const payload = {
        type: 'wanted_alert',
        action,
        alert: {
            id: alert.id,
            alert_ref: alert.alert_ref,
            status: alert.status,
            priority: alert.priority,
            reason: alert.reason,
            description: alert.description,
            last_known_loc: alert.last_known_loc,
            case_id: alert.case_id,
            person_id: alert.person_id,
            region: region || actor?.region || null,
            station: station || actor?.station || null,
            created_at: alert.created_at || new Date().toISOString(),
        },
        person: person ? {
            id: person.id,
            first_name: person.first_name,
            last_name: person.last_name,
            alias: person.alias,
            photo_url: person.photo_url,
            physical_desc: person.physical_desc,
            gender: person.gender,
            nationality: person.nationality,
            address: person.address,
        } : null,
        actor: {
            id: actor.id,
            name: `${actor.first_name || ''} ${actor.last_name || ''}`.trim(),
            role: actor.role,
            station: actor.station || null,
            region: actor.region || null,
        },
        created_at: new Date().toISOString(),
    };

    const recipients = new Set([
        'role:admin',
        'role:police_officer',
        'role:judicial_authority',
        'role:general_inspectorate',
    ]);

    if (region) {
        recipients.add(`region:${region}`);
        recipients.add(`checkpoint:${region}`);
        recipients.add(`public:${region}`);
    }

    if (station) {
        recipients.add(`station:${station}`);
        recipients.add(`checkpoint:${station}`);
    }

    recipients.forEach((room) => io.to(room).emit('notification', payload));
}

module.exports = { initRealtime, notifyAlert };
