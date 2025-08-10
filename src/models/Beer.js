import mongoose from 'mongoose';

const beerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    breweryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brewery',
      required: true,
    },
    style: { type: String, required: true, trim: true }, // bv. IPA, Saison, Tripel
    abv: { type: Number, required: true, min: 0, max: 20 }, // alcohol %
    ibu: { type: Number, min: 0, max: 120 },               // bitterness
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Beer', beerSchema);
