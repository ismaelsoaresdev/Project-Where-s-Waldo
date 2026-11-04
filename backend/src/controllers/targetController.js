const prisma = require('../prisma');

// Fetch all target names and IDs (excluding coordinates to prevent cheating on the frontend)
exports.getTargets = async (req, res) => {
  try {
    const targets = await prisma.target.findMany({
      select: { id: true, name: true }
    });
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
};

// Validate if user click (x, y percentages) lands within the target's bounding box
exports.validateClick = async (req, res) => {
  const { targetId, x, y } = req.body;

  try {
    const target = await prisma.target.findUnique({
      where: { id: targetId }
    });

    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    const isMatch =
      x >= target.minX &&
      x <= target.maxX &&
      y >= target.minY &&
      y <= target.maxY;

    res.json({ found: isMatch });
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
};