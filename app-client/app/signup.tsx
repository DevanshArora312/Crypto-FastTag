import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const Signup = () => {
  const [authToken, setAuthToken] = useState('');
  const [webViewVisible, setWebViewVisible] = useState(true);

  const handleWebViewMessage = (event : any) => {
    const data = event.nativeEvent.data;
    setAuthToken(data);
    setWebViewVisible(false);
  };

  const injectedJavaScript = `
    setTimeout(() => {
      // Simulate login response
      const response = { token: 'fake_jwt_token_123' };
      window.ReactNativeWebView.postMessage(response.token);
    }, 5000);
    true; // Required for Android
  `;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Auth Token: {authToken}</Text>
      
      {webViewVisible && (
        <WebView
          source={{ uri: 'http://10.0.2.2:5173' }}
          onMessage={handleWebViewMessage}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          style={styles.webview}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  text: {
    fontSize: 18,
    padding: 20,
    color:"white"
  },
  webview: {
    flex: 1,
  },
});

export default Signup;