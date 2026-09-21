const supabase = require('./config/supabase');

const CHANNEL_NAME = 'pcrs-alerts';

async function notifyAlert({ alert, action, actor, person = null, region = null, station = null }) {
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

  const channel = supabase.channel(CHANNEL_NAME);
  await channel.httpSend('notification', payload);
  await supabase.removeChannel(channel);
}

module.exports = { notifyAlert };
