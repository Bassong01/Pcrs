const mongoose = require('mongoose');

// Backs sequential, human-friendly numeric ids (mirrors Postgres SERIAL)
// so the existing frontend — which does Number(id) / === comparisons —
// keeps working unmodified against MongoDB-backed documents.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
}, { versionKey: false });

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

async function nextId(name) {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

// Used by the migration script to align the counter with imported data.
async function setCounter(name, seq) {
  await Counter.findByIdAndUpdate(name, { $set: { seq } }, { upsert: true });
}

module.exports = { Counter, nextId, setCounter };
