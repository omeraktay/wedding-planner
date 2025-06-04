import SeatingChart from "../models/SeatingChart.js";

export const saveUpdateSeating = async (req, res) => {
    const { tableCount, seatsPerTable } = req.body;
    const userId = req.auth.sub;
    try {
        let chart = await SeatingChart.findOne({userId})
        if(chart){
            chart.tableCount = tableCount;
            chart.seatsPerTable = seatsPerTable;
            await chart.save();
        }
        else{
            chart = await SeatingChart.create({userId, tableCount, seatsPerTable});
        }
        res.status(200).json(chart);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Failed to save seating chart!'});
    }
}

export const getSeating = async (req, res) => {
    const userId = req.auth.sub;
    try {
        const chart = await SeatingChart.findOne({userId});
        res.status(200).json(chart);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Failed to fetch seating chart!"});
    }
} 

// export const assignGuest = async (req, res) => {
//     const userId = req.auth.sub;
//     const { guestId, table, seat } = req.body;

//     try {
//         const chart = await SeatingChart.findOne({userId});
//         if(!chart){
//             return res.status(404).json({message: "Seating chart not found!"});
//         }
//         chart.assignment = chart.assignment.filter(a => a.guestId.toString() !== guestId); // To remove existing assignment for the guest
//         chart.assignment.push({ guestId, table, seat }); // To add new assignment
//         await chart.save();
//         res.status(200).json(chart);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: "Failed to assign guest to table!"});
//     }
// }

export const saveAssignments  = async (req, res) => {
    const userId = req.auth.sub;
    const{ assignments } = req.body;
    try {
        const chart = await SeatingChart.findOne({userId});
        if(!chart){
            return res.status(404).json({message: "Seating chart not found!"});
        }
        chart.assignments = assignments;
        await chart.save();
        res.status(200).json({message: "Assignment saved", assignments});
    } catch (error) {
        res.status(500).json({message: "Failed to save assignment!"})
    }
}

export const getAssignments = async (req, res) => {
    const userId = req.auth.sub;
    try {
        const chart = await SeatingChart.findOne({ userId });
        if(!chart){
            return res.status(404).json({message: "Seating chart not found!"});
        }
        res.status(200).json(chart.assignments || {});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Failed to fetch assignments!'});
    }
}