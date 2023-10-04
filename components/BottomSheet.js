import React from 'react';
import { View, Text, TouchableOpacity, Animated, Image, ScrollView, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import Exhibitors from './Exhibitors';

const Distance = React.memo(({ getFormattedDistance }) => {
    console.log('Distance Component Rendered');
    return (
        <View style={{justifyContent: 'center', alignItems:'center'}}>
            <Text style={{ fontSize:16, fontWeight: '500', color: 'darkgreen', paddingVertical: 10 }}>
                {getFormattedDistance()}
            </Text>
        </View>
    );
});

const BottomSheet = ({
    slideAnim,
    heightAnim,
    selectedExhibitor,
    distance,
    formatDistance,
    onMapPress,
    navigationMode,
    toggleNavigationMode,
    isSearchMode,
    selectExhibitor,
}) => {

    const [isImageLoading, setImageLoading] = React.useState(false);

    const getFormattedDistance = React.useCallback(() => {
        return `A ${formatDistance(distance)} de distancia`;
    }, [distance, formatDistance]);


    const renderSearchMode = React.useCallback(() => (
        <Animated.View
            style={{
                height: heightAnim.interpolate({
                    inputRange: [60, 100],
                    outputRange: ['0%', '90%']
                }),
                position: 'absolute',
                bottom: slideAnim, 
                left: 0,
                right: 0,
                zIndex: 1,
                backgroundColor: 'white',
                borderRadius: 20,
                shadowOpacity: 0.2,
                elevation: 5,
            }}>
            <Exhibitors onMapPress={onMapPress} selectExhibitor={selectExhibitor} />
        </Animated.View>
    ), [heightAnim, slideAnim, onMapPress, selectExhibitor]);
    
    const renderNormalMode = React.useCallback(() => (
        <Animated.View
            style={{
                height: heightAnim.interpolate({
                    inputRange: [60, 100],
                    outputRange: ['0%', '50%']
                }),
                position: 'absolute',
                bottom: slideAnim,
                left: 0,
                right: 0,
                zIndex: 1,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { 
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.5,
                borderRadius: 20,
                justifyContent: 'space-around',
                paddingBottom: 20,
                elevation: 20,
            }}> 
            {selectedExhibitor && (
                <>
                    <View style={{ flexDirection: 'row', alignItems:'flex-start', justifyContent: 'space-between', alignItems: 'center', paddingVertical:15}}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'left', paddingLeft:20 }}>{selectedExhibitor.name}</Text>                         
                        <TouchableOpacity style={{paddingRight:20}} onPress={onMapPress}>
                            <AntDesign name="close" size={22} color="darkgreen" />
                        </TouchableOpacity>
                    </View>

                    <View style={{height: 1, backgroundColor: '#E0E0E0', marginLeft: 20, marginRight: 20, marginBottom:5}} />
                
                    <View style={{flex: 1, justifyContent:'center', alignItems: 'center', gap: 15, paddingHorizontal: 15}}>
                        <ScrollView style={{ maxHeight: selectedExhibitor.image ? 70 : 200, width: '100%' }}>
                            <Text style={{ fontSize:16 }}>{selectedExhibitor.description}</Text>
                        </ScrollView>
                        {selectedExhibitor.image ? (
                            <View style={{ width: '100%', height: 125, justifyContent: 'center', alignItems: 'center', borderRadius: 15, overflow: 'hidden', borderWidth: 0.15, borderColor: 'darkgreen' }}>
                                {isImageLoading && 
                                    <ActivityIndicator size="large" color="darkgreen" style={{ position: 'absolute' }}/>
                                }
                                <Image 
                                    source={{ uri: selectedExhibitor.image }} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        resizeMode: 'cover', 
                                        opacity: isImageLoading ? 0 : 1 
                                    }} 
                                    onLoadStart={() => setImageLoading(true)}
                                    onLoadEnd={() => setImageLoading(false)}
                                />
                            </View>
                        ) : null}
                    </View>
                </>
            )}
            {selectedExhibitor ? (
                navigationMode ? (
                    <>
                    <Distance getFormattedDistance={getFormattedDistance} />
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection:'row', paddingBottom: 5, gap: 15}}>
                        <TouchableOpacity onPress={toggleNavigationMode} style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', padding:15, borderRadius: 25, gap: 5, backgroundColor: 'white',
                            shadowColor: '#000',
                            shadowOffset: { 
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.5,
                            elevation:5, }}>
                            <MaterialCommunityIcons name="navigation" size={24} color="darkgreen" />
                            <Text style={{fontSize:16, color: 'darkgreen', fontWeight: '500'}}>Iniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleNavigationMode} style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', padding:15, borderRadius: 25, gap: 5, backgroundColor: 'white',
                            shadowColor: '#000',
                            shadowOffset: { 
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.5,
                            elevation:5, }}>
                            <MaterialCommunityIcons name="cancel" size={24} color="darkgreen" />
                            <Text style={{fontSize:16, color: 'darkgreen', fontWeight: '500'}}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                ) : 
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 5, paddingTop:5}}>
                        <TouchableOpacity onPress={toggleNavigationMode} style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', padding:15, borderRadius: 25, gap: 5, backgroundColor: 'white',
                            shadowColor: '#000',
                            shadowOffset: { 
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.5,
                            elevation:5, }}>
                            <MaterialCommunityIcons name="arrow-right-top" size={24} color="darkgreen" />
                            <Text style={{fontSize:16, color: 'darkgreen', fontWeight: '500'}}>Como llegar</Text>
                        </TouchableOpacity>
                    </View>
                    
            ) : null}
            
        </Animated.View>
    ), [heightAnim, slideAnim, selectedExhibitor, onMapPress, navigationMode, toggleNavigationMode, isImageLoading, distance]);    

    return (
        <>
            {isSearchMode ? renderSearchMode() : renderNormalMode()}
        </>
    );
};

export default React.memo(BottomSheet);

