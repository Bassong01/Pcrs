const mongoose = require('mongoose');
const { nextId } = require('./counter');
const { baseOptions } = require('./schemaOptions');

const casePersonSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  case_id: { type: Number, required: true, index: true },
  person_id: { type: Number, required: true, index: true },
  role_in_case: { type: String, default: 'suspect' },
  added_at: { type: Date, default: Date.now },
}, baseOptions);

casePersonSchema.index({ case_id: 1, person_id: 1 }, { unique: true });

casePersonSchema.pre('save', async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextId('case_persons');
  }
  next();
});

module.exports = { CasePerson: mongoose.models.CasePerson || mongoose.model('CasePerson', casePersonSchema) };
