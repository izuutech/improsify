import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
const Icon = require('react-native-vector-icons/MaterialCommunityIcons')
  .default as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
}>;
import {GoalCard} from '../components/GoalCard';
import {useStore} from '../store/useStore'; // ✅ Zustand import
import {theme} from '../styles/theme';

export const GoalsScreen: React.FC = () => {
  const {goals, addGoal} = useStore(); // ✅ Zustand usage
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    reward: '',
    xp: 100,
  });

  const handleAddGoal = () => {
    if (!newGoal.title) return;

    addGoal({
      id: Math.random().toString(36).substr(2, 9),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
      reward: newGoal.reward || undefined,
      xp: newGoal.xp,
      progress: 0,
      completed: false,
    });

    setNewGoal({
      title: '',
      description: '',
      targetDate: '',
      reward: '',
      xp: 100,
    });

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}

        {goals.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No goals yet. Add your first one!
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Goal</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Goal</Text>

            <TextInput
              style={styles.input}
              placeholder="Goal title"
              placeholderTextColor={theme.colors.placeholder}
              value={newGoal.title}
              onChangeText={text => setNewGoal({...newGoal, title: text})}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description (optional)"
              placeholderTextColor={theme.colors.placeholder}
              value={newGoal.description}
              onChangeText={text => setNewGoal({...newGoal, description: text})}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Target date (optional) - YYYY-MM-DD"
              placeholderTextColor={theme.colors.placeholder}
              value={newGoal.targetDate}
              onChangeText={text => setNewGoal({...newGoal, targetDate: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Reward (optional)"
              placeholderTextColor={theme.colors.placeholder}
              value={newGoal.reward}
              onChangeText={text => setNewGoal({...newGoal, reward: text})}
            />

            <Text style={styles.label}>XP Reward:</Text>
            <View style={styles.xpSliderContainer}>
              <Text style={styles.xpValue}>{newGoal.xp} XP</Text>
              <View style={styles.xpOptions}>
                {[100, 250, 500, 1000].map(xp => (
                  <TouchableOpacity
                    key={xp}
                    style={[
                      styles.xpOption,
                      newGoal.xp === xp ? styles.selectedXpOption : {},
                    ]}
                    onPress={() => setNewGoal({...newGoal, xp})}>
                    <Text style={styles.xpOptionText}>{xp}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButtonModal]}
                onPress={handleAddGoal}>
                <Text style={styles.modalButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: theme.colors.primary,
    width: 120,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    flexDirection: 'row',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    padding: 12,
    marginBottom: 16,
    color: theme.colors.text,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  xpSliderContainer: {
    marginBottom: 16,
  },
  xpValue: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  xpOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpOption: {
    backgroundColor: theme.colors.background,
    padding: 8,
    borderRadius: theme.roundness,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedXpOption: {
    backgroundColor: theme.colors.primary,
  },
  xpOptionText: {
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: theme.roundness,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  addButtonModal: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});
