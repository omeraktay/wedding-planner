export default function DroppableUnassignedArea({ children }) {
  const { setNodeRef } = useDroppable({ id: 'unassigned' });

  return (
    <div ref={setNodeRef} style={{ width: '250px', maxHeight: '75vh', marginRight: '15px' }}>
      <h5>Unassigned Guests</h5>
      {children}
    </div>
  );
}
