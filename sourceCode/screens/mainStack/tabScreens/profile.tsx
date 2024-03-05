//@ts-nocheck
import {
    Image, Platform, ScrollView, StyleSheet, Text,
    TouchableOpacity, View, StatusBar, FlatList, SafeAreaView, TextInput,ActivityIndicator
} from "react-native"
import React, { useEffect, useState } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ColorCode from "../../../constants/Styles";
import { TabHeader } from "../../../components";
import { AirbnbRating, Rating } from 'react-native-ratings';
import { addComment, getMyProfile, sendLikeRequest, sendUnLikeRequest, deleteContentApi } from "../../../utils/apiHelpers";
import moment from "moment";
import Video from "react-native-video";
import { setLoginUser } from "../../../redux/cookiesReducer";
import Loader from "../../../components/loader";
import { setLoading, setProfileDat } from "../../../redux/reducer";
import CommentModal from "../../../components/commetModal";
import FullImageModal from "../../../components/fullImageModal";

const Profile = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<any>()
    const [pofileData, setProfileData] = useState({ user: {}, pagination: {} });
    const { loading } = useSelector<any, any>((store) => store.sliceReducer);
    const [showComment, setCommment] = useState(false)
    const [commentArray, setArray] = useState(null)
    const [captionLine, setCaptionLine] = useState(2)
    const isFocused = useIsFocused();
    const [profile,setProfileDats]=useState('')
    const [cacheBuster, setCacheBuster] = useState(0);
    const [imageUlr, setImageUrl] = useState(null)
    const [showImage, setShowImage] = useState(false)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    /*
    useEffect(() => {
        dispatch(setLoading(true))
        getMyProfile().then((res) => {
            clearImageCache()
            dispatch(setLoading(false))
            setProfileData((res?.data))
            // console.log(res?.data?.user?.profilePicture,"res?.data?.user?.profilePicture====>")
            setProfileDats(res?.data?.user?.profilePicture)
            // console.log("res?.data=====>", res?.data, "res?.data=====>")
        })

    }, [isFocused])

  
    useEffect(() => {
        if (isFocused) {
            setPage(1);
            setHasMore(true);
            setLoadingMore(false);
            // Fetch initial data here
        }
    }, [isFocused]);
    
      */

    // console.log(pofileData?.user?.bio,"pofileData=====>")

    const handleDeleteContent = (contentId) => {
        dispatch(setLoading(true));
        deleteContentApi(contentId)
            .then((response) => {
                // Assuming your API returns a successful response for the deletion
                // Filter out the deleted content from your local state to update the UI
                const updatedContent = pofileData.userContent.filter(item => item._id !== contentId);
                setProfileData({
                    ...pofileData,
                    userContent: updatedContent,
                });
                // Optionally, display a success message
                console.log("Content has been deleted successfully.");
            })
            .catch((error) => {
                // Optionally, handle error
                console.error("Failed to delete content:", error);
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };
    
    

    useEffect(() => {
        const initFetch = async () => {
          dispatch(setLoading(true));
          try {
            const res = await getMyProfile(1, 10); // Assume this fetches the first page with 10 items
            setProfileData(res?.data);
            setProfileDats(res?.data?.user?.profilePicture);
            setPage(2); // Prepare for next page fetch
            setHasMore(true); // Assuming there's more data until proven otherwise
          } catch (error) {
            console.error('Error fetching profile data:', error);
          } finally {
            dispatch(setLoading(false));
          }
        };
      
        if (isFocused) {
          initFetch();
        }
      }, [isFocused]); // Depend on isFocused to re-trigger when coming back to the screen
      
     const loadMoreItems = () => {
        if (loadingMore || !hasMore) {
            console.log('Early return:', { loadingMore, hasMore });
            return;
        }
    
        console.log('Loading more items:', { page });
        setLoadingMore(true);
        const nextPage = page + 1;
        const pageSize = 10; 
        getMyProfile(nextPage).then((res) => {
            console.log('Loaded page:', nextPage);
            const newContent = res?.data?.userContent || [];
            setProfileData(prevData => ({
                ...prevData,
                userContent: [...prevData.userContent, ...newContent],
                pagination: res?.data?.pagination
            }));
            setPage(nextPage);
            setHasMore(res?.data?.pagination?.currentPage < res?.data?.pagination?.totalPages);
            setLoadingMore(false);
        }).catch(err => {
            console.error('Failed to load more items:', err);
            setLoadingMore(false);
        });
    };
    
    
      


    const clearImageCache = () => {
        // Increment the cacheBuster value to force a re-fetch of the image
        setCacheBuster((prev) => prev + 1);
      };
    const slicedData = pofileData?.user?.bio?.bioInterests.slice(0, 4);


    const postComment = (data) => {
        addComment(data).then((res) => {
            getMyProfile().then((res) => {
                dispatch(setLoading(false))
                setProfileData((res?.data))
                setCommment(false)
                // console.log("res?.data=====>", res?.data, "res?.data=====>")
            })
        })
    }


    const likeThisPost = (item) => {
        if (item?.likes.includes(pofileData?.user?._id)) {
            sendUnLikeRequest(item?._id).then((res) => {
                getMyProfile().then((res) => {
                    dispatch(setLoading(false))
                    setProfileData((res?.data))
                    // console.log("res?.data=====>", res?.data, "res?.data=====>")
                })
            })
        } else {
            sendLikeRequest(item?._id).then(() => {
                getMyProfile().then((res) => {
                    dispatch(setLoading(false))
                    setProfileData((res?.data))
                    // console.log("res?.data=====>", res?.data, "res?.data=====>")
                })
            })
        }
    }

    const openCoomentSection = (data) => {
        setArray(data)
        setCommment(true)
    }

    const renderItem_didNumber = ({ item, index }: any) => {
        return (
            <TouchableOpacity style={[styles.button, { marginLeft: 5 }]}
                onPress={() => { }}>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
        )
    }
    const showFullImage = (item) => {
        setImageUrl(item)
        setShowImage(!showImage)
    }

    const renderItem = ({ item, index }: any) => {
        //  console.log("done====>", item?.smeVerify, "item=======>",)
        return (
            <View
                style={[styles.postStyle, styles.iosShadow]}>
                <TouchableOpacity style={styles.info}
                    onPress={() => { }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {profile ?
                                <Image
                                    resizeMode='cover'
                                    style={styles.profileImg}
                                    source={{ uri: `${profile}?${cacheBuster}`}}
                                /> :
                                <View style={styles.profileImg}>
                                    <Text style={[styles.boldStyle, { paddingLeft: 15, paddingTop: 15, fontSize: 25 }]}>
                                        {`${pofileData?.user?.firstname?.charAt(0).toUpperCase()}${pofileData?.user?.lastname?.charAt(0).toUpperCase()}`}
                                    </Text>
                                </View>
                            }

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

                        {item?.smeVerify === "Accepted" &&
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

                                    }]}>{item}</Text>)
                        })
                        }
                    </View>
                    <Image style={{}} source={item?.typeImg} />
                </View>
                {item?.contentType == "Video" ?
                  
                  Platform.OS === "android"  ?

                  <TouchableOpacity activeOpacity={1}  onPress={() => { showFullImage(item) }}
                    style={{
                      width: '100%', height: 250,
                      backgroundColor: 'black',
                      borderRadius: 15, marginVertical: 10,
                      alignItems:'center',justifyContent:'center'}}>
                      <View style={{width: 40,
                              height: 40,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 25,
                              backgroundColor: ColorCode.blue_Button_Color,}}>
                      <Image
                           resizeMode='contain'
                              style={{ height: 20, width: 20, tintColor: 'white' }}
                              source={require('../../../assets/images/Polygon1.png')}
                          />
                      </View>

                  </TouchableOpacity>

                  :
                  
                  <TouchableOpacity 
                  onPress={()=>{showFullImage(item)}} 
                  style={{alignItems:'center'}}>
                     <Video
                        resizeMode='cover'
                        source={{ uri: item?.contentURL }}
                        paused={true}
                        style={{ width: '100%', height: 250, backgroundColor: ColorCode.lightGrey, borderRadius: 15, marginVertical: 10 }}
                        repeat={true}
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
                            }}
                            >
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
                </View>
                <View style={styles.line} />
                <View style={{ width: '100%' }}>
                    <Text
                        numberOfLines={captionLine}
                        style={[styles.smalltxt, {
                            textAlign: 'left',
                        }]}
                    >{item?.captions}</Text>

                    {item?.captions?.length > 38 &&
                        <TouchableOpacity onPress={() => { captionLine === 2 ? setCaptionLine(100) : setCaptionLine(2) }}
                            style={{}}>
                            <Text

                                style={[styles.smalltxt, { color: ColorCode.blue_Button_Color }]}>{captionLine === 2 ? 'see more' : 'show less'}</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.line} />
                <View style={[styles.info, { alignItems: 'center', height: 30, }]}>
                    <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'space-between', }}>
                        <TouchableOpacity
                            onPress={() => { likeThisPost(item) }}>
                            <Image
                                tintColor={item?.likes.includes(pofileData?.user?._id) ? ColorCode.blue_Button_Color : 'grey'}
                                source={require('../../../assets/images/heart.png')} />
                        </TouchableOpacity>
                        <Text style={[styles.boldStyle, { paddingLeft: 0 }]}>{item?.likes.length}</Text>
                        <TouchableOpacity
                            onPress={() => { openCoomentSection(item) }}>
                            <Image source={require('../../../assets/images/image_message.png')} />
                        </TouchableOpacity>
                        <Text style={[styles.boldStyle, { paddingLeft: 0 }]}>{item?.comments?.length}</Text>
                        {/* <Image style={{ top: -20 }} source={item?.ShareImage} /> */}

                        
                    </View>

                    <TouchableOpacity
                        onPress={() => handleDeleteContent(item._id)}
                        style={{
                            marginLeft: 5,
                            backgroundColor: 'red', // Set the background color for the delete button
                            borderRadius: 5, // Rounded corners
                            paddingVertical: 5, // Vertical padding
                            paddingHorizontal: 8, // Horizontal padding
                            alignItems: 'center', // Center content horizontally
                            justifyContent: 'center', // Center content vertically
                        }}>
                        <Text style={{
                            color: 'white', // Text color
                            fontSize: 12, // Set the font size
                            fontWeight: 'bold', // Make the text bold
                        }}>DELETE</Text>
                    </TouchableOpacity>

                    {/* <Image style={{ top: -20 }} source={item?.SaveImage} /> */}
                </View>
                <View style={styles.line} />
                {item?.verify === "Yes" &&
                    <View style={[styles.info, { height: 30 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.smalltxt} >{item?.smeVerify === "Pending" ?`Verified : Verification Pending` : "Verified :"}</Text>

                            <Image style={{ marginLeft: 10 }}
                                source={item?.smeVerify === "Accepted" ?
                                    require('../../../assets/images/check_24px.png')
                                    : item?.smeVerify === "Rejected"? require("../../../assets/images/close_24px.png"):null
                                } />
                        </View>

                       
                      {item?.smeVerify != "Pending" &&
                      <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.smalltxt}>Rating</Text>
                            <Rating
                                style={{ marginLeft: 10 }}
                                type="star"
                                ratingCount={5}
                                startingValue={item?.rating}
                                imageSize={20}
                                readonly
                            />
                        </View>
                      }  

                    </View>}

                {item?.smeComments && <View style={styles.line} />}
                {item?.smeComments &&

                    <TextInput
                        // onChangeText={(t) => { setCmt(t) }}
                        value={item?.smeComments}
                        placeholder={'Provide your Comments'}
                        editable={false}
                        style={{
                            height: 50, width: '95%',
                            alignSelf: 'center', backgroundColor: "#F6F6F6",
                            borderRadius: 10, paddingLeft: 10,
                            fontFamily: 'ComicNeue-Bold',
                            color: ColorCode.gray_color,
                        }}
                    />

                }

                
            </View>
        )
    }

    const logout = () => {
        dispatch(setLoginUser({}))
        dispatch(setProfileDat([]))
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }] 
        });
    }

    return (
        <SafeAreaView style={styles.main}>
            {loading && <Loader />}
            {showComment &&
                <CommentModal
                    close={() => { setCommment(false) }}
                    value={commentArray}
                    post={(t) => { postComment(t) }}

                />
            }
            <StatusBar
                barStyle={'dark-content'}
                animated={true}
                backgroundColor={ColorCode.white_Color} />
            <TabHeader myHeading={"Profile"}
                go={() => navigation.goBack()}
                imge={require('../../../assets/images/arrow-left.png')} />
            
                <View style={styles.cards}>
                    <View style={[styles.info, { paddingHorizontal: 5 }]}>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>

                            {profile ?
                                <Image
                                    resizeMode='cover'
                                    style={styles.profileImg}
                                    source={{ uri: `${profile}?${cacheBuster}`}}
                                /> :
                                <View style={styles.profileImg}>
                                    <Text style={[styles.boldStyle, { paddingLeft: 15, paddingTop: 15, fontSize: 25 }]}>
                                        {`${pofileData?.user?.firstname?.charAt(0).toUpperCase()}${pofileData?.user?.lastname?.charAt(0).toUpperCase()}`}
                                    </Text>
                                </View>
                            }
                            <View style={[styles.nameType, { marginLeft: 10 }]}>
                                <Text style={styles.boldStyle}>
                                    {pofileData?.user?.firstname + " " + pofileData?.user?.lastname}
                                </Text>
                                {/* Horizontal Line */}
                                <View style={{marginVertical: 5 }}></View>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <Text style={styles.smalltxt}>
                                        {pofileData?.user?.email}
                                    </Text>
                                </ScrollView>
                            </View>



                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 30 }}>
                                <TouchableOpacity
                                    style={{ height: 50 }}
                                    onPress={() => { navigation.navigate("Setting") }}>
                                    <Image
                                        tintColor={'black'}
                                        source={require('../../../assets/images/regular_settings.png')}
                                    />
                                </TouchableOpacity>

                            </View>


                        </View>
                    </View>

                    <View style={[styles.reelsStyle,]}>
                        <FlatList
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            horizontal
                            contentContainerStyle={{ justifyContent: 'space-between' }}
                            data={ pofileData?.user?.bio?.bioInterests}
                            renderItem={renderItem_didNumber}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                    <Text style={[styles.smalltxt, { marginTop: -15 }]}>{pofileData?.user?.bio?.bioAbout}</Text>
                    <View style={styles.line} />             
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 }]}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                resizeMode='contain'
                                style={{ marginLeft: 10 }}
                                source={require('../../../assets/images/Posts_.png')} />
                            <Text style={[styles.smalltxt, { color: ColorCode.black_Color }]}>{pofileData?.pagination.totalItems}</Text>
                            <Text style={[styles.smalltxt,]}>Posts</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("Connections") }}
                            style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image
                                resizeMode='contain'
                                style={{ marginLeft: 10 }}
                                source={require('../../../assets/images/following_.png')} />
                            <Text style={[styles.smalltxt, { color: ColorCode.black_Color }]}>{pofileData?.user?.followingCount}</Text>
                            <Text style={[styles.smalltxt,]}>Following</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("Connections") }}
                            style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image
                                resizeMode='contain'
                                style={{ marginLeft: 10 }}
                                source={require('../../../assets/images/followers_.png')} />
                            <Text style={[styles.smalltxt, { color: ColorCode.black_Color }]}>{pofileData?.user?.followersCount}</Text>
                            <Text style={[styles.smalltxt,]}>Followers</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: 10 }}>
                <Text style={[styles.smalltxt, { fontSize: 18, color: ColorCode.black_Color }]}>Badge :</Text>
                <Text style={[styles.smalltxt, { fontSize: 16, }]}>
                    {pofileData?.user?.role === 'Subject Matter Expert' ? pofileData?.user?.role : pofileData?.user?.badges}
                </Text>
                </View>
                <View style={[styles.reelsStyle,]}>
                <FlatList
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={pofileData?.userContent}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={0.5} // Trigger the call when half of the last item is visible
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
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
        paddingHorizontal: 15,

    },
    profileImg: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: ColorCode.lightGrey
    },
    nameType: {
        width: 180,


    },
    boldStyle: {
        paddingLeft: 10,
        fontSize: 18,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.black_Color

    },
    smalltxt: {
        paddingLeft: 10,
        fontSize: 14,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.gray_color,

    },
    button: {
        height: 30,
        backgroundColor: ColorCode.blue_Button_Color,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    text: {

        fontSize: 12,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.white_Color,
        paddingHorizontal: 15,
        fontWeight: '400'

    },
    line: {
        height: 2,
        backgroundColor: ColorCode.lightGrey,
        width: '95%',
        marginTop: 5,
        marginHorizontal: 10
    },
    cards: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 10,
        // height: 80,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4, // Elevation for Android
            },
        }),

    }




})


export default Profile;
