// Shared schema options so every model serializes like the old `pg` rows did:
// a plain numeric `id`, no Mongo-specific `_id`/`__v` leaking into API responses.
const baseOptions = {
  id: false,
  toJSON: {
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
};

module.exports = { baseOptions };
