import React from 'react';
import { View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  elevated?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = true,
  bordered = true,
  className = '',
  ...props
}) => {
  return (
    <View
      className={`bg-white rounded-2xl ${elevated ? 'shadow-sm' : ''} ${
        bordered ? 'border border-gray-100' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
