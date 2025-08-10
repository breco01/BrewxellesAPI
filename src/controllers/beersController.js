import Beer from '../models/Beer.js';
import Brewery from '../models/Brewery.js';

export async function listBeers(req, res, next) {
  try {
    const {
      limit = 10,
      offset = 0,
      q,
      sort = 'createdAt',
      order = 'desc',
      brewery,
      style,
      populate,
    } = req.query;

    const query = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { style: { $regex: q, $options: 'i' } },
      ];
    }
    if (brewery) query.breweryId = brewery;
    if (style) query.style = { $regex: style, $options: 'i' };

    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

    let cursor = Beer.find(query).sort(sortObj).skip(Number(offset)).limit(Number(limit));
    if (populate === 'true') cursor = cursor.populate('breweryId');

    const [items, total] = await Promise.all([cursor, Beer.countDocuments(query)]);

    res.json({
      total,
      limit: Number(limit),
      offset: Number(offset),
      sort,
      order,
      items,
    });
  } catch (err) {
    next(err);
  }
}

export async function getBeer(req, res, next) {
  try {
    const { populate } = req.query;
    let q = Beer.findById(req.params.id);
    if (populate === 'true') q = q.populate('breweryId');
    const item = await q;
    if (!item) return res.status(404).json({ error: 'Beer not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function createBeer(req, res, next) {
  try {
    const { name, breweryId, style, abv, ibu, description } = req.body;

    // Basisvalidatie (types + niet-lege strings + numeriek)
    if (!name || typeof name !== 'string' || !name.trim())
      return res.status(400).json({ error: 'name is required (non-empty string)' });
    if (!style || typeof style !== 'string' || !style.trim())
      return res.status(400).json({ error: 'style is required (non-empty string)' });
    if (breweryId === undefined)
      return res.status(400).json({ error: 'breweryId is required' });
    if (typeof abv !== 'number')
      return res.status(400).json({ error: 'abv must be a number' });
    if (ibu !== undefined && typeof ibu !== 'number')
      return res.status(400).json({ error: 'ibu must be a number' });

    const brewery = await Brewery.findById(breweryId);
    if (!brewery) return res.status(400).json({ error: 'breweryId does not reference a Brewery' });

    const created = await Beer.create({ name, breweryId, style, abv, ibu, description });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateBeer(req, res, next) {
  try {
    const { name, breweryId, style, abv, ibu, description } = req.body;

    if (name !== undefined && (typeof name !== 'string' || !name.trim()))
      return res.status(400).json({ error: 'name must be a non-empty string' });
    if (style !== undefined && (typeof style !== 'string' || !style.trim()))
      return res.status(400).json({ error: 'style must be a non-empty string' });
    if (abv !== undefined && typeof abv !== 'number')
      return res.status(400).json({ error: 'abv must be a number' });
    if (ibu !== undefined && typeof ibu !== 'number')
      return res.status(400).json({ error: 'ibu must be a number' });

    if (breweryId !== undefined) {
      const brewery = await Brewery.findById(breweryId);
      if (!brewery) return res.status(400).json({ error: 'breweryId does not reference a Brewery' });
    }

    const updated = await Beer.findByIdAndUpdate(
      req.params.id,
      { name, breweryId, style, abv, ibu, description },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Beer not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteBeer(req, res, next) {
  try {
    const deleted = await Beer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Beer not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
