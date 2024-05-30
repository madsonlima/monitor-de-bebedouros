import { StyleSheet, View, Text } from 'react-native';

import DBFetch from '@/components/DBFetch'

export default function HomeScreen() {

  return (
    <View style={styles.titleContainer}>

      <DBFetch />

    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F4F2'
  },
});
