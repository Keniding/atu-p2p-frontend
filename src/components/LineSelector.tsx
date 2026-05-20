import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import type { BusLine } from "@/types/bus.types";

interface LineSelectorProps {
  lines: BusLine[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function LineSelector({ lines, selected, onSelect }: LineSelectorProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {lines.map((line) => {
          const isSelected = line.id === selected;
          return (
            <TouchableOpacity
              key={line.id}
              style={[
                styles.chip,
                { borderColor: line.color },
                isSelected && { backgroundColor: line.color },
              ]}
              onPress={() => onSelect(line.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? "#FFFFFF" : line.color },
                ]}
              >
                {line.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  scroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
