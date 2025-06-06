import OverallBudget from "../models/OverallBudget.js";


export const setBudget = async (req, res) => {
  const userId = req.auth.sub;
  const { totalBudget } = req.body;

  try {
    // Find or create a "master" entry to store the totalBudget
    let entry = await OverallBudget.findOne({ userId });

    if (!entry) {
      entry = await OverallBudget.create({
        userId,
        overallBudget: totalBudget,
      });
    } else {
      entry.overallBudget = totalBudget;
      await entry.save();
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update your total budget!' });
  }
};

export const getOverallBudget = async (req, res) => {
    const userId = req.auth.sub;
    try {
        const budget = await OverallBudget.findOne({userId});
        res.status(200).json(budget)
    } catch (error) {
        res.status(500).json({message: "Failed to get overall budget!"});
    }
}

export const updateOverallBudget = async (req, res) => {
    const userId = req.auth.sub;
    const { id } = req.params;
    const updated = req.body;
    try {
        const newBudget = await OverallBudget.fondOneAndUpdate(
            {_id: id, userId},
            updated,
            { new: true }
        )
        if(!newBudget) return res.status(404).json({message: "Budget not found!"})
    } catch (error) {
        res.status(500).json({message: "Failed to update your overall budget!"})
    }
}