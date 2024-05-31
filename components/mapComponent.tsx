import React, { useState, useRef, forwardRef } from 'react';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { View, StyleSheet, Dimensions, ImageURISource } from 'react-native';
import axios from 'axios';
import { sample, shuffle } from 'lodash';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type LatLng = {
    lat: number;
    lng: number;
};

type MarkerOptions = {
    position: LatLng;
    icon?: ImageURISource;
};

type DirectionsService = any;

type Leg = {
    startLocation: LatLng;
    endLocation: LatLng;
};

type RouteOptions = {
    routeId: string;
    legs: Leg[];
    carMarkerOptions: MarkerOptions;
    directionsService: DirectionsService;
};

type Route = {
    routeId: string;
    legs: Leg[];
    color: string;
    carMarkerOptions: MarkerOptions;
    points: { latitude: number; longitude: number }[];
};

const makeCarIcon = (color: string): ImageURISource => {
    return {
        uri: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z" />
        </svg>`)}`
    };
};

const MapComponent = forwardRef(({ initialRegion, routes, moveCar }: { initialRegion: Region, routes: Route[], moveCar: (routeId: string, position: LatLng) => void }, ref) => {

    const mapRef = useRef<MapView>(null);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
            >
                {routes.map((route) => (
                    <React.Fragment key={route.routeId}>
                        <Marker coordinate={{ latitude: route.legs[0].startLocation.lat, longitude: route.legs[0].startLocation.lng }} />
                        <Marker coordinate={{ latitude: route.legs[route.legs.length - 1].endLocation.lat, longitude: route.legs[route.legs.length - 1].endLocation.lng }} />
                        <Marker coordinate={{ latitude: route.carMarkerOptions.position.lat, longitude: route.carMarkerOptions.position.lng }} icon={route.carMarkerOptions.icon} />
                        <Polyline
                            coordinates={route.points}
                            strokeWidth={6}
                            strokeColor={route.color}
                        />
                    </React.Fragment>
                ))}
            </MapView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapComponent;
