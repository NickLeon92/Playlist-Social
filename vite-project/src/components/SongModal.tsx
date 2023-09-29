import React, { FC } from 'react';

// Define the prop types
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SongModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Modal Title</h2>
        <p>This is the modal content.</p>
      </div>
    </div>
  );
};

export default SongModal;
