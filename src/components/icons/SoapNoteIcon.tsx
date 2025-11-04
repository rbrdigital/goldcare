import React from 'react';
import soapNoteIcon from '@/assets/soap-note-icon.svg';

interface SoapNoteIconProps {
  className?: string;
}

export const SoapNoteIcon: React.FC<SoapNoteIconProps> = ({ className }) => {
  return (
    <img 
      src={soapNoteIcon} 
      alt="SOAP Note" 
      className={className}
    />
  );
};
