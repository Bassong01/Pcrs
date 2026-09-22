const mongoose = require('mongoose');
const { nextId } = require('./counter');
const { baseOptions } = require('./schemaOptions');

const STATUSES = ['open', 'under_investigation', 'closed', 'archived'];

const criminalCaseSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  reference_no: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  nature: { type: String, required: true },
  description: { type: String, default: null },
  location: { type: String, default: null },
  region: { type: String, default: null, index: true },
  incident_date: { type: Date, required: true },
  status: { type: String, enum: STATUSES, default: 'open', index: true },
  registered_by: { type: Number, required: true, index: true },
}, { ...baseOptions, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

criminalCaseSchema.pre('save', async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextId('criminal_cases');
  }
  next();
});

module.exports = {
  CriminalCase: mongoose.models.CriminalCase || mongoose.model('CriminalCase', criminalCaseSchema),
  CASE_STATUSES: STATUSES,
};
