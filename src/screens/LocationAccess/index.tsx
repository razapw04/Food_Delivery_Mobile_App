import React from 'react';
import {Image, StatusBar, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import Button from '../../components/button/Button';
import {handleAccessLocation} from './useController';

const Pin = require('../../assets/icons/Pin.png');

const LocationAcess = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://images.unsplash.com/photo-1636815529481-c2897925b69f?q=80&w=1101&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
        </View>

        <Button
          title="Access Location"
          onPress={handleAccessLocation}
          icon={Pin}
        />

        <Text style={styles.text}>
          Food Will access your location
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LocationAcess;
