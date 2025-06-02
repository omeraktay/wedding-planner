import Guest from "../models/Guest.js";

export const getGuests = async (req, res) => {
    try {
        const guests = await Guest.find({createdBy: req.auth.sub});
        console.log('GET /api/guests works'); 
        res.json(guests);
    } 
    catch (error) {
        res.status(500).json({message: error.message})
    }
};

export const addGuest = async (req, res) => {
    const { name, email, rsvp, plusOnes } = req.body;
    try {
        const newGuest = new Guest({
            name, email, rsvp, plusOnes, createdBy: req.auth.sub
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
        res.json({message: 'Deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateGuest = async (req, res) => {
  try {
    const { name, email, rsvp, plusOnes } = req.body;

    const guest = await Guest.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.auth.sub },
      { name, email, rsvp, plusOnes },
      { new: true }
    );

    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

