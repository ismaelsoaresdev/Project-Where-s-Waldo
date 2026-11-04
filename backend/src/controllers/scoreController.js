const prisma = require('../prisma');

// Get top 10 high scores ordered by fastest time
exports.getHighScores = async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { timeInSeconds: 'asc' },
      take: 10,
    });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch high scores' });
  }
};

// Save a new player score
exports.createScore = async (req, res) => {
  const { playerName, timeInSeconds } = req.body;

  if (!playerName || typeof timeInSeconds !== 'number') {
    return res.status(400).json({ error: 'Invalid player name or time' });
  }

  try {
    const newScore = await prisma.score.create({
      data: {
        playerName,
        timeInSeconds,
      },
    });
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
};