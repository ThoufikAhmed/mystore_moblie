import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimelineStep } from '../../types';

export interface OrderTimelineProps {
  steps: TimelineStep[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ steps }) => {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <Text className="text-gray-900 font-extrabold text-base mb-4">
        Order Status
      </Text>

      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const iconColor = step.done
          ? '#16a34a'
          : step.active
          ? '#2563eb'
          : '#9ca3af';
        const iconBg = step.done
          ? '#f0fdf4'
          : step.active
          ? '#eff6ff'
          : '#f3f4f6';

        return (
          <View key={step.label} className="flex-row items-start">
            {/* Timeline icon + connecting line */}
            <View className="items-center mr-4">
              <View
                style={{ backgroundColor: iconBg }}
                className={`w-9 h-9 rounded-full items-center justify-center border-2 ${
                  step.active
                    ? 'border-blue-500'
                    : step.done
                    ? 'border-green-500'
                    : 'border-gray-200'
                }`}
              >
                <Ionicons name={step.icon as any} size={18} color={iconColor} />
              </View>

              {!isLast && (
                <View
                  className={`w-0.5 h-8 my-1 ${
                    step.done ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </View>

            {/* Step details */}
            <View className="flex-1 pb-4">
              <View className="flex-row items-center gap-2">
                <Text
                  className={`font-extrabold text-sm ${
                    step.active
                      ? 'text-blue-600'
                      : step.done
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </Text>
                {step.active && (
                  <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                    <Text className="text-blue-700 text-[9px] font-bold">
                      IN PROGRESS
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-400 text-xs mt-0.5">{step.sub}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
