// src/pages/SeatingPlanner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import TableSetup from '../components/TableSetup';
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import DroppableSeat from '../components/DroppableSeat';
import DraggableGuest from '../components/DraggableGuest';


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

  const guestId = active.id;
  const dropTarget = over.id;

  if (dropTarget === 'unassigned') {
    // Same as before...
    const newAssignedSeats = { ...assignedSeats };
    let removed = false;

    for (const tableId in newAssignedSeats) {
      newAssignedSeats[tableId] = newAssignedSeats[tableId].map(seatGuest => {
        if (seatGuest && seatGuest._id === guestId) {
          removed = true;
          return null;
        }
        return seatGuest;
      });
    }

    if (removed) {
      const movedGuest = guests.find(g => g._id === guestId);
      setAssignedSeats(newAssignedSeats);
      setUnassignedGuests(prev => {
        const alreadyInList = prev.some(g => g._id === guestId);
        return alreadyInList ? prev : [...prev, movedGuest];
      });
    }

    return;
  }

  const seatMatch = dropTarget.match(/^table-(\d+)-seat-(\d+)$/);
  if (!seatMatch) return;

  const [, tableNumStr, seatIndexStr] = seatMatch;
  const tableId = `table-${tableNumStr}`;
  const seatIndex = parseInt(seatIndexStr, 10);
  const guest = guests.find(g => g._id === guestId);

  if (!guest) return;

  const updatedSeats = { ...assignedSeats };

  // Remove guest from previous seat (if any)
  for (const tId in updatedSeats) {
    updatedSeats[tId] = updatedSeats[tId].map(seatGuest =>
      seatGuest && seatGuest._id === guestId ? null : seatGuest
    );
  }

  // Assign to new seat if available
  if (!updatedSeats[tableId][seatIndex]) {
    updatedSeats[tableId][seatIndex] = guest;
  }

  setAssignedSeats(updatedSeats);
  setUnassignedGuests(prev => prev.filter(g => g._id !== guestId));
}



function DroppableUnassignedArea({ children }) {
  const { setNodeRef } = useDroppable({ id: 'unassigned' });

  return (
    <div ref={setNodeRef} style={{ width: '200px'}}>
      <h5>Guests</h5>
      <div style={{display: 'flex',flexWrap: 'wrap'}}>
        {children}
      </div>
    </div>
  );
}

  if (!seatingChart) return <p>Loading seating chart...</p>;

  return (
  <div className="container-fluid mt-4"  style={{  overflow: "visible" }}>
    <TableSetup />
    <h2 className="mb-4">Seating Chart Planner</h2>
    <div className="d-flex gap-5" style={{ alignItems: 'flex-start', overflow: "visible"}}>
      {/* Unassigned Guests */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{  overflow: "visible" }}>
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
            className='table'
            style={{
                border: '1px solid #ccc',
                borderRadius: '50%',
                padding: '2rem',
                width: '280px',
                height: '280px',
                position: 'relative',
                background: '#fffef6',
                boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                margin: "15px"
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
                    assignedSeats={assignedSeats}
                    setAssignedSeats={setAssignedSeats}
                    setUnassignedGuests={setUnassignedGuests}
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
