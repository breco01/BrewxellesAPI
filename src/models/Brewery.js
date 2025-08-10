import mongoose from 'mongoose';

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
const noDigitsRegex = /^[^\d]*$/;

const brewerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || urlRegex.test(v),
        message: 'Invalid website URL.',
      },
    },
    contactFirstName: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || noDigitsRegex.test(v),
        message: 'First name cannot contain digits.',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Brewery', brewerySchema);
