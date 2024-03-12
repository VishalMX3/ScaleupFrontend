//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { View,StyleSheet, TouchableOpacity, Image, Modal,  ActivityIndicator, Platform } from 'react-native';
import ColorCode from '../constants/Styles';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import { incrementViewCountApi } from '../utils/apiHelpers'; 
const FullImageModal = (props: any) => {
    const navigation = useNavigation<any>()
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [hasViewBeenCounted, setHasViewBeenCounted] = useState(false);
    const { loginUser } = useSelector<any, any>((store) => store.cookies);

    useEffect(() => {
        // Reset view count flag whenever the modal is opened with a new video
        setHasViewBeenCounted(false);
      }, [props.imageUrl]);

      
      const handleLoad = () => {
        setLoading(false);
        const contentId = props.imageUrl?._id || props.imageUrl?.contentId;
        console.log(contentId);
        // Start a timer to increment view count if video is played for at least 10 seconds
        if (!hasViewBeenCounted && props.imageUrl?.contentType === "Video") {
          setTimeout(() => {
            incrementViewCountApi(contentId)
              .then(() => {
                console.log("View count incremented");
                setHasViewBeenCounted(true); // Ensure view count is incremented only once per video play
              })
              .catch((error) => console.error("Error incrementing view count", error));
          }, 10000); // 10 seconds
        }
      };


    return (
        <Modal transparent={true} animationType="slide" style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flex: 1 }}
                keyboardShouldPersistTaps="handled">

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => props.close()}
                    style={{
                        height: 50, width: 50,
                        position: 'absolute', backgroundColor: 'white',
                        zIndex: 1, alignItems: 'center',
                        justifyContent: 'center', borderRadius: 25,
                        top: 50, left: 0
                    }}>
                    <Image
                        source={require('../assets/images/close_24px.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.main}
                    activeOpacity={1}
                // onPress={() => { props.close() } } 
                >

                    <View style={styles.inner}>
                        {props?.imageUrl?.contentType === "Video" ?

                        Platform.OS === "ios" ?

                            <Video
                                resizeMode='contain'
                                source={{ uri: props?.imageUrl?.contentURL }}
                                style={{
                                    width: '100%', height: '100%',
                                    borderRadius: 15, marginVertical: 10
                                }}
                                onLoad={handleLoad}
                                repeat={false}
                               // onLoad={() => setLoading(false)}
                                controls={true}
                            />
                  :
                            <VideoPlayer
                                resizeMode='contain'
                                source={{ uri: props?.imageUrl?.contentURL }}
                                style={{
                                    width: '100%', height: '100%',
                                    borderRadius: 15, marginVertical: 10
                                }}
                                onLoad={handleLoad}
                                repeat={true}
                                //onLoad={() => setLoading(false)}
                                controls={true}
                            />
                            :

                            <Image
                                resizeMode='center'
                                style={{ height: '100%', width: '100%' }}
                                source={{ uri: props?.imageUrl?.contentURL }}
                                onLoad={() => setLoading(false)}
                            />
                        }

                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={ColorCode.white_Color} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity >
            </KeyboardAwareScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorCode.black_Color,
    },
    inner: {
        height: '80%',
        width: '100%',
        backgroundColor: ColorCode.black_Color,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    boldStyle: {
        fontSize: 18,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.black_Color,
        textAlign: 'center',
        marginTop: 20,
    },
    smalltxt: {
        fontSize: 14,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.gray_color,
    },
    enter: {
        height: 50,
        width: '80%',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'grey',
        marginTop: 20,
        padding: 10,
    },
});

export default FullImageModal;