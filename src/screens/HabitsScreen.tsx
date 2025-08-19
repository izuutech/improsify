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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HabitCard} from '../components/HabitCard';
// 🔁 Replaced AppContext with Zustand store
import {useStore} from '../store/useStore';
import {theme} from '../styles/theme';
const Icon = MaterialCommunityIcons as any;

export const HabitsScreen: React.FC = () => {
  const {habits, addHabit} = useStore(); // 🔁 Using Zustand now

  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const handleAddHabit = () => {
    if (!newHabit.title) return;

    const xpMap = {
      easy: 10,
      medium: 25,
      hard: 50,
    };

    addHabit({
      id: Math.random().toString(36).substr(2, 9),
      title: newHabit.title,
      description: newHabit.description,
      frequency: newHabit.frequency,
      currentStreak: 0,
      longestStreak: 0,
      completedToday: false,
      difficulty: newHabit.difficulty,
      xp: xpMap[newHabit.difficulty],
    });

    setNewHabit({
      title: '',
      description: '',
      frequency: 'daily',
      difficulty: 'medium',
    });

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {habits.map(habit => (
          <HabitCard key={habit.id} habit={habit} />
        ))}

        {habits.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No habits yet. Add your first one!
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}>
        <Icon name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Habit</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Habit</Text>

            <TextInput
              style={styles.input}
              placeholder="Habit title"
              placeholderTextColor={theme.colors.placeholder}
              value={newHabit.title}
              onChangeText={text => setNewHabit({...newHabit, title: text})}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description (optional)"
              placeholderTextColor={theme.colors.placeholder}
              value={newHabit.description}
              onChangeText={text =>
                setNewHabit({...newHabit, description: text})
              }
              multiline
            />

            <Text style={styles.label}>Frequency:</Text>
            <View style={styles.optionRow}>
              {['daily', 'weekly', 'monthly'].map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.optionButton,
                    newHabit.frequency === freq ? styles.selectedOption : {},
                  ]}
                  onPress={() =>
                    setNewHabit({...newHabit, frequency: freq as any})
                  }>
                  <Text style={styles.optionText}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Difficulty:</Text>
            <View style={styles.optionRow}>
              {['easy', 'medium', 'hard'].map(diff => (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.optionButton,
                    newHabit.difficulty === diff ? styles.selectedOption : {},
                  ]}
                  onPress={() =>
                    setNewHabit({...newHabit, difficulty: diff as any})
                  }>
                  <Text style={styles.optionText}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButtonModal]}
                onPress={handleAddHabit}>
                <Text style={styles.modalButtonText}>Add Habit</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: theme.colors.background,
    padding: 10,
    borderRadius: theme.roundness,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
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
