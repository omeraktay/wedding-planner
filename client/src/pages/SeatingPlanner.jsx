// src/pages/SeatingPlanner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import TableSetup from '../components/TableSetup';
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import DroppableSeat from '../components/DroppableSeat';

function DraggableGuest({ guest }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: guest._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#f9f9f9',
    margin: '4px 0',
    zIndex: 1000,
    position: 'relative',
    cursor: 'default',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {guest.name}
    </div>
  );
}

export default function SeatingPlanner() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [seatingChart, setSeatingChart] = useState(null);
  const [guests, setGuests] = useState([]);
  const [assignedSeats, setAssignedSeats] = useState({});  
  const [unassignedGuests, setUnassignedGuests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();

      const [chartRes, guestRes] = await Promise.all([
        axios.get('http://localhost:3000/api/seating-chart', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:3000/api/guests', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

        const filteredGuests = [];

    guestRes.data.forEach(guest => {
      if (guest.rsvp === 'Confirmed') {
        filteredGuests.push(guest);
        if (guest.plusOnes && typeof guest.plusOnes === 'number') {
          for (let i = 0; i < guest.plusOnes; i++) {
            filteredGuests.push({
              _id: `${guest._id}-plusone-${i}`,
              name: `${guest.name} +${i + 1}`,
              isPlusOnes: true,
            });
          }
        }
      } else if (guest.rsvp === 'pending') {
        filteredGuests.push(guest);
      }
    });
        setSeatingChart(chartRes.data);
        setGuests(filteredGuests);
        setUnassignedGuests(filteredGuests);

        // Create initial seat structure
        const initialAssignments = {};
        for (let i = 0; i < chartRes.data.tableCount; i++) {
        initialAssignments[`table-${i + 1}`] = Array(chartRes.data.seatsPerTable).fill(null);
        }
        setAssignedSeats(initialAssignments);

    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated, getAccessTokenSilently]);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || !active) return;

    const draggedGuestId = active.id;
    const targetId = over.id;

    console.log('Dragged Guest:', draggedGuestId);
    console.log('Dropped On:', targetId);

    if (!targetId.includes('seat')) {
        console.log('Invalid drop target');
        return;
    }

    const [tableLabel, tableNumber, , seatIndexStr] = targetId.split('-');
    const tableId = `${tableLabel}-${tableNumber}`; // e.g., "table-1"
    const seatIndex = parseInt(seatIndexStr);

    if (!assignedSeats[tableId]) {
        console.log('Invalid table:', tableId);
        return;
    }

    if (assignedSeats[tableId][seatIndex]) {
        console.log('Seat already taken');
        return;
    }

    const guestToAssign = unassignedGuests.find((g) => g._id === draggedGuestId);
    if (!guestToAssign) {
        console.log('Guest not found');
        return;
    }

    const updatedAssigned = { ...assignedSeats };
    updatedAssigned[tableId][seatIndex] = guestToAssign;
    setAssignedSeats(updatedAssigned);

    const updatedUnassigned = unassignedGuests.filter((g) => g._id !== draggedGuestId);
    setUnassignedGuests(updatedUnassigned);
  }

function DroppableUnassignedArea({ children }) {
  const { setNodeRef } = useDroppable({ id: 'unassigned' });

  return (
    <div ref={setNodeRef} style={{ width: '250px', maxHeight: '75vh', marginRight: '15px' }}>
      <h5>Unassigned Guests</h5>
      {children}
    </div>
  );
}

function DroppableSeat({ tableId, seatIndex, guest, totalSeats }) {
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

  if (!seatingChart) return <p>Loading seating chart...</p>;

  return (
  <div className="container-fluid mt-4">
    <TableSetup />
    <h2 className="mb-4">Seating Chart Planner</h2>
    <div className="d-flex gap-4" style={{ alignItems: 'flex-start', overflow: "visible"}}>
      {/* Unassigned Guests */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ width: '250px', maxHeight: '75vh', marginRight: "15px", overflow: "visible" }}>
        <h5>Unassigned Guests</h5>
        <p style={{fontSize: "12px"}}>(Grab it from centre)</p>
        <DroppableUnassignedArea>
          <SortableContext items={unassignedGuests.map(g => g._id)} strategy={rectSortingStrategy}>
            {unassignedGuests.map((guest) => (
              <DraggableGuest key={guest._id} guest={guest} />
            ))}
          </SortableContext>
        </DroppableUnassignedArea>
      </div>

      {/* Tables Area */}
      <div className="flex-grow-1 d-flex flex-wrap gap-5">
        {Object.entries(assignedSeats).map(([tableId, seats], tableIndex) => (
            <div
            key={tableId}
            style={{
                border: '1px solid #ccc',
                borderRadius: '50%',
                padding: '2rem',
                width: '240px',
                height: '240px',
                position: 'relative',
                background: '#fffef6',
                boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                // zIndex: "-1"
            }}
            >
                <h6 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%)', zIndex: "1" }}>
                Table {tableIndex + 1}
                </h6>
                <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#fffef6',
                }}
                >
               {seats.map((guest, seatIndex) => (
                <DroppableSeat
                    key={`${tableId}-seat-${seatIndex}`}
                    tableId={tableId}
                    seatIndex={seatIndex}
                    guest={guest}
                    totalSeats={seats.length}
                />
                ))}
                </div>
            </div>
            ))}
      </div>
            </DndContext>
    </div>
  </div>
);

}
