
// Added import to resolve "Cannot find namespace 'React'" for React.ReactNode
import React from 'react';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}