import Budget from "../models/Budget.js";




export const getBudgetItems = async (req, res) => {
    const userId = req.auth.sub;
    try {
        const items = await Budget.find({userId});
        res.status(200).json(items)
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch budget items.'})
    }
}

export const addBudgetItem = async(req, res) => {
    const userId = req.auth.sub;
    const { name, category, estimatedCost, actualCost, status } = req.body;

    try {
        const newItem = await Budget.create({
            userId, name, category, estimatedCost, actualCost, status
        })
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({message: 'Failed to add budget item!'})
    }
}

export const updateBudgetItem = async(req, res) => {
    const userId = req.auth.sub;
    const { id } = req.params;
    const updates = req.body;

    try {
        const item = await Budget.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true }
        )
        if(!item){
            return res.status(404).json({message: "Item not found!"});
        }
    } catch (error) {
        res.status(500).json({message: 'Failed to update item!'})
    }
}

export const deleteBugetItem = async(req, res) => {
    const userId = req.auth.sub;
    const { id } = req.params;
    try {
        const result = await Budget.findOneAndDelete({_id: id, userId});
        if(!result){
            return res.status(404).json({message: "Item not found !"});
        }
        res.status(200).json({message: 'Item deleted.'})
    } catch (error) {
        res.status(500).json({message: 'Failed to delete item!'});
    }
}