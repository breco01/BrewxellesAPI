import Brewery from '../models/Brewery.js';

export async function listBreweries(req, res, next) {
  try {
    const {
      limit = 10,
      offset = 0,
      q,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { city: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };

    const [items, total] = await Promise.all([
      Brewery.find(query).sort(sortObj).skip(Number(offset)).limit(Number(limit)),
      Brewery.countDocuments(query),
    ]);

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

export async function getBrewery(req, res, next) {
  try {
    const item = await Brewery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Brewery not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function createBrewery(req, res, next) {
  try {
    const { name, city, website, contactFirstName } = req.body;

    // Basisvalidatie (bovenop Mongoose):
    if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' });
    if (!city || !city.trim()) return res.status(400).json({ error: 'city is required' });
    if (typeof name !== 'string' || typeof city !== 'string')
      return res.status(400).json({ error: 'name and city must be strings' });

    const created = await Brewery.create({ name, city, website, contactFirstName });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateBrewery(req, res, next) {
  try {
    const { name, city, website, contactFirstName } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim())
        return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    if (city !== undefined) {
      if (typeof city !== 'string' || !city.trim())
        return res.status(400).json({ error: 'city must be a non-empty string' });
    }

    const updated = await Brewery.findByIdAndUpdate(
      req.params.id,
      { name, city, website, contactFirstName },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Brewery not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteBrewery(req, res, next) {
  try {
    const deleted = await Brewery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Brewery not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
