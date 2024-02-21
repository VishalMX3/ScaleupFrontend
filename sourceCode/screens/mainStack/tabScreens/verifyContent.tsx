import {
    Image, Platform, ScrollView, StyleSheet, Text, Modal,
    TextInput, TouchableOpacity, View, StatusBar, FlatList, SafeAreaView, Alert, ActivityIndicator
} from "react-native"
import React, { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ColorCode from "../../../constants/Styles";
import OpacityButton from "../../../components/opacityButton";
import InputText from "../../../components/textInput";
import { AuthHeader, TabHeader } from "../../../components";
import Strings from "../../../constants/strings";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import reelsData from "../../../constants/helpers";
import axios from 'axios';
import { addComment, allPostData, getHomePageData, getUserData, sendLikeRequest, sendUnLikeRequest, verifyContent, getPendingVerifyData } from "../../../utils/apiHelpers";
import moment from "moment";
import CommentModal from "../../../components/commetModal";
import Loader from "../../../components/loader";
import { setLoading, setOther } from "../../../redux/reducer";
import VarifyContentHeader from "../../../components/verifyContentHeader";
import { AirbnbRating } from "react-native-ratings";
import Video from 'react-native-video';
import FullImageModal from "../../../components/fullImageModal";


const ValidateContent = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<any>()
    const { other, loading } = useSelector<any, any>((store) => store.sliceReducer);
    const [home, setHome] = useState([])
    const [rating, setrating] = useState(null)
    const [cmt, setCmt] = useState('')
    const [acp, setacp] = useState(false)
    const [captionLine, setCaptionLine] = useState(2)
    const [imageUlr, setImageUrl] = useState(null)
    const [showImage, setShowImage] = useState(false)
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [contentData, setContentData] = useState([]);

    /*
        const get = () => {
            dispatch(setLoading(true));
            getPendingVerifyData().then((res) => {
             //  console.log("API Response:", res); // Log the complete response
                setHome(res.data.pendingContent); // Access the pendingContent array
                dispatch(setLoading(false));
            }).catch((error) => {
                console.error('API Error:', error);
                dispatch(setLoading(false));
            });
        };
    
    
        useEffect(() => {
            get()
        }, [])
    
    */

    useEffect(() => {
        fetchContent();
    }, []); // Ensure this effect only runs once after mount

    const fetchContent = async () => {
        //console.log(`Attempting to fetch content for page ${page}, hasMore: ${hasMore}, isFetchingMore: ${isFetchingMore}`);

        if (!hasMore || isFetchingMore) return;

        dispatch(setLoading(true));
        setIsFetchingMore(true);

        try {
            console.log(`Sending request to getPendingVerifyData with page: ${page}, pageSize: 10`);
            const response = await getPendingVerifyData(page);
            console.log(`Received data for page ${page}:`, response.data.pendingContent);

            if (response.data.pendingContent.length > 0) {
                setHome(prevContent => [...prevContent, ...response.data.pendingContent]);
                setPage(prevPage => prevPage + 1);
                const newDataLength = response.data.pendingContent.length;
                console.log(`New data length for page ${page}: ${newDataLength}`);
                setHasMore(newDataLength >= 10); // Assuming pageSize is 10
            } else {
                console.log('No more data to fetch.');
                setHasMore(false); // No more data to fetch
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            dispatch(setLoading(false));
            setIsFetchingMore(false);
        }
    };



    // console.log(cmt,"cmt------>")

    const contentVarification = (payload) => {
        dispatch(setLoading(true))
        const data = {
            "rating": rating,
            "smeVerify": acp === true ? "Accepted" : "Rejected",
            "smeComments": cmt
        }
        verifyContent(data, payload).then((res) => {
            // console.log(res?.data, "data----->");
            // Clear states
            setCmt('');
            setrating(null);
            setacp(false); // Reset to default state
            dispatch(setLoading(false));
            // Call function to remove the item from the list
            removeItemFromView(home.findIndex((item) => item._id === payload));
        });
    };

    const removeItemFromView = (index) => {
        const updatedHome = [...home];
        updatedHome.splice(index, 1);
        setHome(updatedHome);
    };




    const showFullImage = (item) => {
        setImageUrl(item)
        setShowImage(!showImage)
    }

    const setUserData = (item) => {
        dispatch(setOther(item))
        navigation.navigate("OtherProfile")
    }

    const approveButtonStyle = acp === true ? styles.selectedButton : styles.unselectedButton;
    const rejectButtonStyle = acp === false ? styles.selectedButton : styles.unselectedButton;

    const renderItem_didNumber = ({ item, index }: any) => {
        // console.log(item, "==item======>")
        const handleSubmit = (itemId, itemIndex) => {
            contentVarification(itemId);
            removeItemFromView(itemIndex);
        };
        return (
            <View
                style={[styles.postStyle, styles.iosShadow]}>
                <TouchableOpacity style={styles.info}
                    onPress={() => { setUserData(item?.userId?._id) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {item?.userId?.profilePicture ?
                            <Image
                                resizeMode='cover'
                                style={styles.profileImg}
                                source={{ uri: item?.userId?.profilePicture }} />
                            :
                            <View style={styles.profileImg} />}

                        <View style={[styles.nameType, { width: '55%' }]}>
                            <Text style={styles.boldStyle}>{item?.username}</Text>
                            <Text
                                numberOfLines={2}
                                style={styles.smalltxt}>{item?.heading}</Text>
                        </View>
                    </View>
                    <View style={{ alignSelf: 'flex-start', width: '28%' }}>
                        <Text numberOfLines={1} style={[styles.smalltxt,
                        { marginTop: 12, }]}>{moment(item?.postdate).fromNow()}</Text>

                        {item?.isVerified &&
                            <Image
                                style={{ alignSelf: 'flex-end', marginRight: 10 }}
                                source={require('../../../assets/images/security-user.png')}
                            />
                        }
                    </View>

                </TouchableOpacity>
                <View style={styles.info}>
                    <View style={{ flexDirection: 'row', }}>
                        {item?.relatedTopics.map((item) => {
                            // console.log(item,'hastgas=====>')
                            return (
                                <Text
                                    numberOfLines={2}
                                    style={[styles.smalltxt, {
                                        textAlign: 'left',
                                        marginTop: 5,

                                    }]}>{item}</Text>
                            )

                        })

                        }



                    </View>

                    <Image style={{}} source={item?.typeImg} />
                </View>

                {item?.contentType == "Video" ?

                    Platform.OS === "android" ?

                        <TouchableOpacity activeOpacity={1} onPress={() => { showFullImage(item) }}
                            style={{
                                width: '100%', height: 250,
                                backgroundColor: 'black',
                                borderRadius: 15, marginVertical: 10,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 25,
                                backgroundColor: ColorCode.blue_Button_Color,
                            }}>
                                <Image
                                    resizeMode='contain'
                                    style={{ height: 20, width: 20, tintColor: 'white' }}
                                    source={require('../../../assets/images/Polygon1.png')}
                                />
                            </View>

                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={{ alignItems: 'center' }}
                            activeOpacity={1}
                            onPress={() => { showFullImage(item) }}
                        >
                            <Video
                                resizeMode='cover'
                                source={{ uri: item?.contentURL }}
                                paused={true}
                                style={{
                                    width: '100%', height: 250,
                                    backgroundColor: ColorCode.lightGrey,
                                    borderRadius: 15, marginVertical: 10
                                }}
                                repeat={false}
                                controls={false}

                            >
                            </Video>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: -10, // Shifted to the top
                                    right: 9, // Shifted to the right
                                    //left: 90,
                                    width: 20,
                                    height: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 25,
                                    backgroundColor: ColorCode.blue_Button_Color,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                }}>
                                <Image
                                    style={{ height: 12, width: 12, tintColor: 'white' }}
                                    source={require('../../../assets/images/Polygon1.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    :
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { showFullImage(item) }}
                        style={{
                            width: '100%',
                            height: 250,
                            backgroundColor: ColorCode.lightGrey,
                            borderRadius: 15, marginVertical: 10
                        }}>
                        <Image
                            style={{ height: '100%', width: '100%' }}
                            resizeMode='contain'
                            source={{ uri: item?.contentURL }} />
                    </TouchableOpacity>
                }

                <View style={{ width: '100%' }}>
                    <Text
                        numberOfLines={captionLine}
                        style={[styles.smalltxt, {
                            textAlign: 'left',
                        }]}
                    >{item?.captions}</Text>

                    {item?.captions.length > 38 &&
                        <TouchableOpacity onPress={() => { captionLine === 2 ? setCaptionLine(100) : setCaptionLine(2) }}
                            style={{}}>
                            <Text style={[styles.smalltxt, { color: ColorCode.blue_Button_Color }]}>{captionLine === 2 ? 'see more' : 'show less'}</Text>
                        </TouchableOpacity>}



                </View>
                <View style={styles.line} />

                <View style={{ flexDirection: 'row' }}>
                    {item?.hashtags.map((item) => {
                        // console.log(item,'hastgas=====>')
                        return (
                            <Text
                                numberOfLines={2}
                                style={[styles.smalltxt, {
                                    textAlign: 'left',
                                }]}>{item}</Text>
                        )
                    })
                    }
                    {/* {item?.isVerified &&
                        <Image
                            source={require('../../../assets/images/security-user.png')}
                        />
                    } */}
                </View>
                <View style={[styles.info, { paddingHorizontal: 15 }]}>
                    <Text style={{}} >Verified :</Text>
                    <TouchableOpacity onPress={() => setacp(true)} style={approveButtonStyle}>
                        <Image source={require('../../../assets/images/check_24px.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setacp(false)} style={rejectButtonStyle}>
                        <Image source={require('../../../assets/images/close_24px.png')} />
                    </TouchableOpacity>

                    <Text style={{}}>Rating</Text>

                    <AirbnbRating
                        starContainerStyle={{ marginBottom: 30 }}
                        count={5}
                        defaultRating={0}
                        onFinishRating={(t) => { setrating(t) }}
                        size={15} />

                </View>


                <TextInput
                    onChangeText={(t) => { setCmt(t) }}
                    value={cmt}
                    placeholder={'Provide your Comments'}
                    keyboardType={'default'}
                    style={{
                        height: 50, width: '90%',
                        alignSelf: 'center', backgroundColor: "#F6F6F6",
                        borderRadius: 10, paddingLeft: 10, marginTop: -20, marginBottom: 10
                    }}
                />
                <TouchableOpacity onPress={() => handleSubmit(item._id, index)} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>

        )
    }

    return (
        <SafeAreaView style={styles.main}>

            {loading && <Loader />}

            <StatusBar
                barStyle={'dark-content'}
                animated={true}
                backgroundColor={ColorCode.white_Color} />
            <VarifyContentHeader />
            <View style={[styles.reelsStyle,]}>

                <FlatList
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={home}
                    renderItem={renderItem_didNumber}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={fetchContent}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => isFetchingMore && <ActivityIndicator size="large" />}

                />


            </View>



            {showImage &&
                <FullImageModal
                    imageUrl={imageUlr}
                    close={() => { setShowImage(false) }}
                />
            }


        </SafeAreaView>

    )

}



const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: ColorCode.white_Color
    },
    reelsStyle: {
        flex: 1,
        margin: 12
    },
    postStyle: {
        // height: 300,
        width: "100%",
        backgroundColor: ColorCode.white_Color,
        borderRadius: 15,

    },
    iosShadow: {
        shadowColor: '#ddd',
        shadowOffset: { width: -2, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
        marginTop: 10
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 45,
        paddingHorizontal: 25,
        width: '100%',
        marginVertical: 10,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    androidShadow: {
        elevation: 10,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",

    },
    profileImg: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: ColorCode.lightGrey
    },
    nameType: {

    },
    boldStyle: {
        paddingLeft: 10,
        fontSize: 18,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.black_Color

    },

    submitButton: {
        backgroundColor: 'black', // Choose your color
        padding: 7,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 140
    },
    submitButtonText: {
        color: 'white', // Choose your text color
        fontSize: 16,
        fontFamily: 'ComicNeue-Bold',

    },
    smalltxt: {
        paddingLeft: 10,
        fontSize: 14,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.gray_color,

    },
    selectedButton: {
        backgroundColor: 'gold', // Or any color indicating selection

        // ... other styling as needed
    },
    unselectedButton: {
        backgroundColor: 'white', // Or any color indicating not selected
        borderRadius: 0,
        // ... other styling as needed
    },




})

export default ValidateContent;