import { useDroppable } from "@dnd-kit/core";
import DraggableGuest from "./DraggableGuest";
import { useState } from "react";


export default   function DroppableSeat({ 
  tableId, 
  seatIndex, 
  guest, 
  totalSeats, 
  assignedSeats, 
  setAssignedSeats, 
  setUnassignedGuests }) {

    const angle = (360 / totalSeats) * seatIndex;
    const radius = 65;
    const dropId = `${tableId}-seat-${seatIndex}`;
    const { setNodeRef, isOver } = useDroppable({ id: dropId });
    const [fadingSeats, setFadingSeats] = useState({});

  return (
    <div
      key={seatIndex}
      ref={setNodeRef}
      title={guest ? "Double-click to unassign" : ""}
      className={`seat rounded-circle p-2 d-flex justify-content-center align-items-center position-absolute bg-light 
        ${isOver ? "hovered" : ""}
        ${fadingSeats[`${tableId}-${seatIndex}`] ? "fade-out" : ""}`}
      style={{
        position: 'absolute',
        top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
        left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
        transform: 'translate(-50%, -50%)',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        border: '1px dashed #aaa',
        backgroundColor: isOver ? '#4caf50' :guest ? '#d4fce2' : '#f0f0f0',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
onDoubleClick={() => {
  if (!guest) return;

  const seatKey = `${tableId}-${seatIndex}`;
  setFadingSeats((prev) => ({ ...prev, [seatKey]: true }));

  setTimeout(() => {
    setAssignedSeats(prev => {
      const updated = { ...prev };
      updated[tableId][seatIndex] = null;
      return updated;
    });

    setUnassignedGuests(prev => {
      // Avoid duplicates
      return prev.some((g) => g._id === guest._id)
        ? prev
        : [...prev, guest];
    });

    setFadingSeats((prev) => {
      const updated = { ...prev };
      delete updated[seatKey];
      return updated;
    });
  }, 400);
}}

    >
      {guest ? <DraggableGuest guest={guest} /> : 'Empty'}
    </div>
    );
  }
  