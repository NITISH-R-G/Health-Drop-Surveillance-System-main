import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapView = ({ style, children }: any) => (
    <View style={[styles.container, style]}>
        <Text style={styles.text}>Map View (Mobile Only)</Text>
        {/* Render children (like markers/circles) silently or visually mock them if needed */}
        <View style={styles.content}>{children}</View>
    </View>
);

export const Marker = ({ coordinate, children }: any) => (
    <View style={{ position: 'absolute', opacity: 0 }}>{children}</View>
);

export const Circle = () => null;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0', // Placeholder gray
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        overflow: 'hidden',
    },
    text: {
        color: '#666',
        fontWeight: '500',
    },
    content: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none'
    }
});

export default MapView;
