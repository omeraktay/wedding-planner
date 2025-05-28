import Guest from "../models/Guest.js";

export const getGuests = async (req, res) => {
    try {
        const guests = await Guest.find({createdBy: req.auth.sub});
        res.json(guests);
    } 
    catch (error) {
        res.status(500).json({message: error.message})
    }
};

export const addGuest = async (req, res) => {
    const { name, email, rsvp } = req.body;
    try {
        const newGuest = new Guest({
            name, email, rsvp, createdBy: req.auth.sub
        })
        await newGuest.save();
        res.status(201).json(newGuest);
    } 
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const deleteGuest = async (req, res) => {
    try {
        const guest = await Guest.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.auth.sub
        });
        if(!guest) return res.status(404).json({message: 'Guest not found!'});
        res.jason({message: 'Deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}