import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import useNavigationApi from '../hooks/useNavigationApi.js';
import MapNavigation from './MapNavigation.js';
import { Foundation, AntDesign } from '@expo/vector-icons';
import BottomSheet from './BottomSheet.js';
import { exhibitors } from '../assets/expositores.js';
import * as Location from 'expo-location';
import styles from './MapStyles';

const MAPBOX_ACCESS_TOKEN = 'sk.eyJ1IjoibGF6YXJvYm9yZ2hpIiwiYSI6ImNsbTczaW5jdzNncGgzam85bjdjcDc3ZnQifQ.hhdcu0s0SZ2gm_ZHQZ4h7A';
Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const UNSELECTED_MARKER_OPACITY = 0.4;

const formatDistance = (distance) => {
    const roundedDistance = Math.round(distance);
    return `${roundedDistance} metros`;
};

const ExhibitorMarker = React.memo(({ exhibitor, selectedExhibitor, selectExhibitor, distance, navigationMode }) => {
    const isSelected = selectedExhibitor && selectedExhibitor.id === exhibitor.id;
    const isVisible = navigationMode ? isSelected : true;
    const markerOpacity = selectedExhibitor ? (isSelected ? 1 : UNSELECTED_MARKER_OPACITY) : 1;

    return isVisible ? (
        <Mapbox.MarkerView
            key={exhibitor.id}
            id={String(exhibitor.id)}
            coordinate={[exhibitor.longitude, exhibitor.latitude]}
            isSelected={isSelected}
            style={{ zIndex: isSelected ? 2 : 1 }}
        >
           <TouchableOpacity onPress={() => selectExhibitor(exhibitor)}>
                <View style={[styles.markerView, { opacity: markerOpacity }]}>
                    {isSelected ? (
                        <Foundation name="marker" size={Platform.OS === 'android' ? 34 : 62} color="red" />
                    ) : (
                        <Foundation name="marker" size={32} color="green" />
                    )}
                    <Text style={[
                        styles.markerText,
                        {
                            fontSize: (Platform.OS === 'android' && isSelected) ? 16 : (isSelected ? 22 : 16),
                            fontWeight: (Platform.OS === 'android' && isSelected) ? '500' : (isSelected ? '600' : '400'),
                        }
                    ]}>
                        {exhibitor.name}
                    </Text>
                </View>
            </TouchableOpacity>

        </Mapbox.MarkerView>
    ) : null;
});


const Map = () => {
    const [navigationMode, setNavigationMode] = useState(false);
    
    const slideAnim = useRef(new Animated.Value(-500)).current;
    const heightAnim = useRef(new Animated.Value(0)).current; 

    const [selectedExhibitor, setSelectedExhibitor] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const cameraRef = useRef(null);
    const [firstOpen, setFirstOpen] = useState(true);

    const [deviceCoordinates, setDeviceCoordinates] = useState(null);

    useEffect(() => {
        (async () => {
            let locationSubscription;
            
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }
                
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 3000,
                        distanceInterval: 7,
                    },
                    (location) => {
                        setDeviceCoordinates([
                            location.coords.longitude,
                            location.coords.latitude,
                        ]);
                    }
                );
            } catch (error) {
                console.error("An error occurred:", error);
            }
            
            return () => {
                if (locationSubscription) {
                    locationSubscription.remove();
                }
            };
        })();
    }, []);

    useEffect(() => {
        if (selectedExhibitor === null && isSearchMode) {
            openBottomSheet();
        }
    }, [selectedExhibitor, isSearchMode, openBottomSheet]);
    
    const navigationConfig = useMemo(() => ({
        origin: deviceCoordinates ? {latitude: deviceCoordinates[1], longitude: deviceCoordinates[0]} : null,
        destination: selectedExhibitor ? {latitude: selectedExhibitor.latitude, longitude: selectedExhibitor.longitude} : null,
        token: MAPBOX_ACCESS_TOKEN,
        deviceCoordinates: deviceCoordinates,
        navigationMode: navigationMode
    }), [deviceCoordinates, selectedExhibitor, navigationMode]); // Agregados los demás posibles cambios en dependencias
    
    const { route, error, loading, distance, origin, destination } = useNavigationApi(navigationConfig);

    const openBottomSheet = useCallback(() => {
        console.log(selectedExhibitor)

        const animationDuration = (firstOpen && isSearchMode) ? 250 : 300; // Puedes ajustar estos valores como desees
        let targetValue = selectedExhibitor ? 40 : 100;
        
        if (Platform.OS === 'android') {
            slideAnim.setValue(0);
            heightAnim.setValue(targetValue); 
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: animationDuration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false,
                }),
                Animated.timing(heightAnim, {
                    toValue: targetValue, 
                    duration: animationDuration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false,
                })
            ]).start(() => {
                firstOpen && setFirstOpen(false);
            });
        }
    }, [slideAnim, heightAnim, selectedExhibitor, firstOpen, isSearchMode]);
    
    const closeBottomSheet = useCallback(() => {
    
        const toValueSlide = isSearchMode ? -500 : -100;  // Valor a animar basado en isSearchMode
        const toValueHeight = isSearchMode ? 0 : 60;  // Valor a animar basado en isSearchMode
    
        if (Platform.OS === 'android') {
            slideAnim.setValue(toValueSlide);
            heightAnim.setValue(toValueHeight);
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: toValueSlide,
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: false,
                }),
                Animated.timing(heightAnim, {
                    toValue: toValueHeight,
                    duration: 200,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: false,
                })
            ]).start();
        }
    
        if (navigationMode) {
            toggleNavigationMode();
        }
    }, [slideAnim, heightAnim, navigationMode, toggleNavigationMode, isSearchMode]);
    
    
    
    const selectExhibitor = useCallback((exhibitor) => {
        
        if(isSearchMode){
            closeBottomSheet();
            setSelectedExhibitor(exhibitor);
    
            cameraRef.current.setCamera({
                centerCoordinate: [exhibitor.longitude, exhibitor.latitude],
                zoomLevel: 18,
                animationDuration: 300,
            });
    
            setTimeout(() => {
                setIsSearchMode(false); // Aseguramos que el modo búsqueda esté desactivado
                openBottomSheet();
            }, 80); // puedes ajustar el delay según necesites
        } else {
            // Si no estamos en el modo de búsqueda, simplemente cambiamos el expositor seleccionado
            // y ajustamos la cámara sin cerrar y abrir la BottomSheet.

            selectedExhibitor ?? openBottomSheet();

            setSelectedExhibitor(exhibitor);
            cameraRef.current.setCamera({
                centerCoordinate: [exhibitor.longitude, exhibitor.latitude],
                zoomLevel: 18,
                animationDuration: 300,
            });
            
        }
    }, [isSearchMode, openBottomSheet, closeBottomSheet]);
    

    const onMapPress = useCallback(() => {
        closeBottomSheet();
        setSelectedExhibitor(null);
        setNavigationMode(false);
        setIsSearchMode(false);
    }, []);

    const toggleNavigationMode = useCallback(() => {
        setNavigationMode(prevMode => !prevMode);
    }, []);

    const initiateSearch = () => {
        console.log(selectedExhibitor)
        // Si la BottomSheet ya está visible, la cerramos
        if (selectedExhibitor) {
            setSelectedExhibitor(null);
            closeBottomSheet();
            setIsSearchMode(true);
            
        } else {
            // Si la BottomSheet no está visible, simplemente realizamos la operación de búsqueda
            setIsSearchMode(true);
            openBottomSheet();
        }
    };
    
    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={{ flex: heightAnim.interpolate({
                inputRange: [60, 110],
                outputRange: [1, 0.45]
            }) }}>
                <Mapbox.MapView  style={{ flex: 1 }} onPress={onMapPress} styleURL='mapbox://styles/lazaroborghi/cln8wy7yk07c001qb4r5h2yrg' scaleBarEnabled={false}>
                    <Mapbox.UserLocation visible={true} androidRenderMode='gps' renderMode='native'/>
                    <Mapbox.Camera
                        ref={cameraRef}
                        centerCoordinate={[exhibitors[0].longitude, exhibitors[0].latitude]}
                        zoomLevel={16}
                        animationDuration={1000}
                    />
                    {exhibitors.map((exhibitor) => (
                        <ExhibitorMarker 
                            key={exhibitor.id}
                            exhibitor={exhibitor}
                            selectedExhibitor={selectedExhibitor}
                            selectExhibitor={selectExhibitor}
                            distance={distance}
                            navigationMode={navigationMode}
                        />
                    ))}

                    {navigationMode && (
                        <MapNavigation route={route} cameraRef={cameraRef} origin={origin} destination={destination} />
                    )}
                </Mapbox.MapView>
                <TouchableOpacity 
                    onPress={initiateSearch} 
                    style={[
                        styles.searchButton,
                        {
                            bottom: selectedExhibitor ? 55 : 80,
                            left: '50%',
                            transform: [{translateX: selectedExhibitor ? -50 : -100}],
                            padding: selectedExhibitor ? 5 : 15,
                            width: selectedExhibitor ? 100 : 200,
                            opacity: selectedExhibitor ? 0.60 : 0.85,
                        }
                    ]}
                >
                    <AntDesign name="search1" size={15} style={styles.searchIcon} />
                    <Text style={[styles.searchText, {fontSize: selectedExhibitor ? 14 : 16}]}>
                        {selectedExhibitor ? 'Buscar' : 'Buscar expositores'}
                    </Text>
                </TouchableOpacity>

            </Animated.View>
            <BottomSheet
                slideAnim={slideAnim}
                heightAnim={heightAnim}
                selectedExhibitor={selectedExhibitor}
                distance={distance}
                formatDistance={formatDistance}
                onMapPress={onMapPress}
                navigationMode={navigationMode}
                toggleNavigationMode={toggleNavigationMode}
                isSearchMode={isSearchMode}
                selectExhibitor={selectExhibitor}
            />
        </View>
    );
};

export default Map;
