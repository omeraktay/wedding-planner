import { useDroppable } from "@dnd-kit/core";

export default   function DroppableSeat({ tableId, seatIndex, guest, totalSeats }) {
    const id = `${tableId}-seat-${seatIndex}`;
    const { setNodeRef, isOver } = useDroppable({ id });

    const angle = (360 / totalSeats) * seatIndex;
    const radius = 65;

    return (
        <div
        ref={setNodeRef}
        data-id={id}
        key={seatIndex}
        style={{
            position: 'absolute',
            top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
            left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '1px dashed #aaa',
            backgroundColor: isOver ? '#bdefff' : guest ? '#d4fce2' : '#f0f0f0',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        >
        {guest ? guest.name : 'Empty'}
        </div>
    );
  }