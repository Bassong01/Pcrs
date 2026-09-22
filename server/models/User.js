const mongoose = require('mongoose');
const { nextId } = require('./counter');
const { baseOptions } = require('./schemaOptions');

const ROLES = ['admin', 'police_officer', 'judicial_authority', 'general_inspectorate'];

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  role: { type: String, required: true, enum: ROLES },
  badge_number: { type: String, unique: true, sparse: true, default: null },
  station: { type: String, default: null },
  region: { type: String, default: null },
  phone: { type: String, default: null },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date, default: null },
}, { ...baseOptions, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

userSchema.pre('save', async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextId('users');
  }
  next();
});

module.exports = { User: mongoose.models.User || mongoose.model('User', userSchema), ROLES };
