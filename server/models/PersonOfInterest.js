const mongoose = require('mongoose');
const { nextId } = require('./counter');
const { baseOptions } = require('./schemaOptions');

const GENDERS = ['male', 'female', 'other'];

const personSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  alias: { type: String, default: null },
  date_of_birth: { type: Date, default: null },
  gender: { type: String, enum: GENDERS, default: null },
  nationality: { type: String, default: 'Cameroonian' },
  id_number: { type: String, default: null, index: true },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  physical_desc: { type: String, default: null },
  photo_url: { type: String, default: null },
  is_wanted: { type: Boolean, default: false },
  registered_by: { type: Number, required: true },
}, { ...baseOptions, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

personSchema.index({ last_name: 1, first_name: 1 });

personSchema.pre('save', async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextId('persons_of_interest');
  }
  next();
});

module.exports = {
  PersonOfInterest: mongoose.models.PersonOfInterest || mongoose.model('PersonOfInterest', personSchema),
  GENDERS,
};
