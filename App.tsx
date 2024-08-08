import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Tts from 'react-native-tts';
import { Picker } from '@react-native-picker/picker';

const AIHighTechAssistant = () => {
  const [sentence, setSentence] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const availableVoices = await Tts.voices();
        setVoices(availableVoices);

        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].id); // Default to the first available voice
          Tts.setDefaultVoice(availableVoices[0].id);
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };

    fetchVoices();
  }, []);

  useEffect(() => {
    const fetchSentence = async () => {
      try {
        const response = await fetch('https://actions.thinkingai.in/api/assistant');
        const data = await response.json();

        if (data && data.sentence) {
          setSentence(data.sentence);
          Tts.speak(data.sentence);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching sentence:', error);
        setError('Error fetching sentence. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSentence();
    const interval = setInterval(fetchSentence, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleVoiceChange = (voiceId) => {
    setSelectedVoice(voiceId);
    Tts.setDefaultVoice(voiceId);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0f0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/ai_assistant.png')}
        style={styles.image}
      />
      <Picker
        selectedValue={selectedVoice}
        onValueChange={(itemValue) => handleVoiceChange(itemValue)}
        style={styles.picker}
      >
        {voices.map((voice) => (
          <Picker.Item key={voice.id} label={voice.name} value={voice.id} />
        ))}
      </Picker>
      <Text style={styles.sentence}>{sentence}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75,
    borderColor: '#0f0',
    borderWidth: 2,
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  picker: {
    width: '100%',
    color: '#0f0',
    backgroundColor: '#333',
    marginVertical: 20,
  },
  sentence: {
    color: '#0f0',
    fontSize: 24,
    textAlign: 'center',
    margin: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});

export default AIHighTechAssistant;
