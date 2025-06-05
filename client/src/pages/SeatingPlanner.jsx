// src/pages/SeatingPlanner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import TableSetup from '../components/TableSetup';
import { DndContext, closestCenter, useDroppable, DragOverlay, useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor, rectIntersection } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import DroppableSeat from '../components/DroppableSeat';
import DraggableGuest from '../components/DraggableGuest';


export default function SeatingPlanner() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [seatingChart, setSeatingChart] = useState(null);
  const [guests, setGuests] = useState([]);
  const [assignedSeats, setAssignedSeats] = useState({});  
  const [unassignedGuests, setUnassignedGuests] = useState([]);
  const [activeGuest, setActiveGuest] = useState(null);


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

  // Do not assign if the seat is laready occupied
  if (updatedSeats[tableId][seatIndex]) return;

  // Assign to new seat if available
  if (!updatedSeats[tableId][seatIndex]) {
    updatedSeats[tableId][seatIndex] = guest;
  }

  setAssignedSeats(updatedSeats);
  setUnassignedGuests(prev => prev.filter(g => g._id !== guestId));
  setActiveGuest(null);
}



function DroppableUnassignedArea({ children }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '200px',
        minHeight: '500px', // Makes it a large drop target
        padding: '12px',
        border: isOver ? '2px dashed #4caf50' : '2px dashed #ccc',
        borderRadius: '8px',
        background: isOver ? '#f0fff0' : '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <h5 style={{ marginBottom: '10px' }}>Guests</h5>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}


function handleDragStart(event) {
  const { active } = event;
  const guest = guests.find(g => g._id === active.id);
  if (guest) {
    setActiveGuest(guest);
  }
}

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: isTouchDevice ?
    { delay: 250, tolerance: 10 } :
    { delay: 75, tolerance: 5 }
  }),
  useSensor(TouchSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  })
)

  if (!seatingChart) return <p>Loading seating chart...</p>;

  return (
  <div className="container-fluid mt-4"  style={{  overflow: "visible", touchAction: "none" }}>
    <TableSetup />
    <h2 className="mb-4">Seating Chart Planner</h2>
    <div className="d-flex gap-5" style={{ alignItems: 'flex-start', overflow: "visible"}}>
      {/* Unassigned Guests */}
        <DndContext sensors={sensors} collisionDetection={ closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{  overflow: "visible" }}>
        <DroppableUnassignedArea>
          <SortableContext items={unassignedGuests.map(g => g._id)} strategy={rectSortingStrategy}>
            {unassignedGuests.map((guest) => (
              <DraggableGuest key={guest._id} guest={guest} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeGuest ? (
              <div
                style={{
                     padding: '24px',
                     border: '1px solid #ccc',
                     borderRadius: '50%',
                     background: '#f9f9f9',
                     margin: '4px 0',
                     cursor: 'grab',
                     fontSize: '12px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     maxWidth: "70px",
                     height: '70px'
                }}
              >
                {activeGuest.name}
              </div>
            ) : null}
          </DragOverlay>
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
