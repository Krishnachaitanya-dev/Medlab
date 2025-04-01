import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, Check } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Test } from '@/types';

interface TestSelectionItemProps {
  test: Test;
  isSelected?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
}

export default function TestSelectionItem({ 
  test, 
  isSelected = false, 
  onToggle, 
  onRemove 
}: TestSelectionItemProps) {
  // If onToggle is provided, render a selectable item
  // If onRemove is provided, render a removable item
  const isSelectable = !!onToggle;
  const isRemovable = !!onRemove;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isSelected && styles.selectedContainer
      ]}
      onPress={onToggle}
      disabled={!isSelectable}
    >
      <View style={styles.content}>
        <Text style={styles.testName}>{test.name}</Text>
        <Text style={styles.testCategory}>{test.category}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{test.price.toFixed(2)}</Text>
        
        {isSelectable && (
          <View style={[styles.checkBox, isSelected && styles.checkedBox]}>
            {isSelected && <Check size={16} color="#FFFFFF" />}
          </View>
        )}
        
        {isRemovable && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={onRemove}
          >
            <Trash2 size={18} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedContainer: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`, // 10% opacity of primary color
  },
  content: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  testCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 12,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  removeButton: {
    padding: 4,
  },
});