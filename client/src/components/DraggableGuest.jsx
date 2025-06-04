import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';


export default function DraggableGuest({ guest }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: guest._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
    // width: '100%',
    // height: '100%',
    maxWidth: "70px",
    height: '70px'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {guest.name}
    </div>
  );
}