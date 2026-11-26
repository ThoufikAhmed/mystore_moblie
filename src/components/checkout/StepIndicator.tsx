import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review';

export interface StepIndicatorProps {
  current: CheckoutStep;
}

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'address', label: 'Address' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ current }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isCompletedOrActive = index <= currentIndex;

        return (
          <React.Fragment key={step.key}>
            <View className="items-center">
              <View
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  isCompletedOrActive ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color="white" />
                ) : (
                  <Text
                    className={`text-xs font-extrabold ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                className={`text-[10px] font-bold mt-1 ${
                  isCompletedOrActive ? 'text-green-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </Text>
            </View>

            {index < STEPS.length - 1 && (
              <View
                className={`flex-1 h-0.5 mx-1 mb-4 ${
                  index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};
