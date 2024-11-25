import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
  id: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'ITEM',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className={`group flex flex-col justify-center items-center cursor-pointer relative touch-none ${isDragging ? 'opacity-50' : ''}`}
      ref={dragRef}
    >
      <img
        src={`${process.env.PUBLIC_URL}/bear_paw.png`}
        alt="Drag Me"
        className="w-full h-full cursor-pointer z-10 touch-none"
      />
      <div className="absolute w-10 h-10 bg-transparent rounded-full group-hover:bg-white group-hover:shadow-[0_0_20px_30px_rgba(255,255,255,1)] pointer-events-none"></div>
    </div >
  );
};

export default DraggableItem;
