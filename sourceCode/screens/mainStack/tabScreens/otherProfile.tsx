//@ts-ignore
//@ts-nocheck
import {
    Image, Platform, ScrollView, StyleSheet, Text,
    TouchableOpacity, View, StatusBar, FlatList, SafeAreaView, ImageBackground,RefreshControl
} from "react-native"
import React, { useEffect, useState } from "react"
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ColorCode from "../../../constants/Styles";
import { AuthHeader, TabHeader } from "../../../components";
import { addComment, bockUser, followUser, getUserData, sendLikeRequest, sendUnLikeRequest, unfollowUser } from "../../../utils/apiHelpers";
import moment from "moment";
import CommentModal from "../../../components/commentModalOtherProfile";
import { Show_Toast } from "../../../components/toast";
import ProfileHeader from "../../../components/profileHeader";
import Video from 'react-native-video';
import Loader from "../../../components/loader";
import { setLoading } from "../../../redux/reducer";
import FullImageModal from "../../../components/fullImageModal";
const OtherProfile = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<any>()
    const [progress, setProgress] = useState(0);
   // const [allData, setAllData] = useState(null)
    const [allData, setAllData] = useState({ content: [] });
    const { other } = useSelector<any, any>((store) => store.sliceReducer);
    const { pofileData,loading } = useSelector<any, any>((store) => store.sliceReducer);
    const [showComment, setCommment] = useState(false)
    const [commentArray, setArray] = useState(null)
    const [captionLine, setCaptionLine] = useState(2)
    const [imageUlr, setImageUrl] = useState(null)
    const [showImage, setShowImage] = useState(false)
    const [button, setButton] = useState(allData?.isFollowing ? "Unfollow" : 'Follow')
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // console.log(allData?.profilePicture,"allData======>", allData, "allData======>")


    useFocusEffect(
        React.useCallback(() => {
          const fetchData = () => {
            setPage(1); // Ensure we reset to page 1
            setHasMore(true); // Reset hasMore to true for fresh fetch
            get(); // Fetch the first page data
          };
    
          fetchData(); // Call fetchData to load initial data
    
          return () => {
            // Optional cleanup actions
          };
        }, [])
      );

        
      const get = () => {
        console.log("Fetching data for Page:", page);
        if (page === 1) setRefreshing(true);
        else dispatch(setLoading(true));
       const payload ={id:other, number:page}
        getUserData(payload)
          .then((res) => {
            const { data: newData } = res;
    
            if (page === 1) {
              setAllData(newData); 
            
            } else {
              setAllData(prevData => ({
               ...prevData,
                content: [...prevData.content, ...newData.content],
                
              }));
             
            }
    
            setHasMore(newData.content.length === currentPageSize);
          })
          .catch(err => {
            console.error("An error occurred while fetching data:", err);
          })
          .finally(() => {
            if (page === 1) setRefreshing(false);
            else dispatch(setLoading(false));
          });
      };

      const onRefresh = () => {
        setPage(1); // Reset to page 1
        setHasMore(true); // Assume there's more data to fetch
        get(); // Fetch page 1 data again
      };
    
    const loadMoreContent = () => {
        if (hasMore) {
          setPage(prevPage => prevPage + 1);
          get()
        }
      };
    
      useEffect(() => {
        if (page > 1) {
          get(page, pageSize); // Fetch next page data when page state updates
        }
      }, [page]);


    const openCoomentSection = (data) => {
        console.log('Opening comment section for item:', data);
        setArray(data)
        setCommment(true)
    }

    useEffect(() => {
        
        setButton(allData?.isFollowing ? "Unfollow" : 'Follow')
        get()
    }, [allData?.isFollowing])


    const postComment = (data) => {
        console.log('Data Sent for Comment', data);
        addComment(data).then((res) => {
            getUserData(other).then((res) => {
                dispatch(setLoading(false))
                setAllData((res?.data))
                setCommment(false)
                // console.log("res?.data=====>", res?.data, "res?.data=====>")
            })
        })
    }

    const showFullImage = (item) => {
        setImageUrl(item)
        setShowImage(!showImage)
    }

    const renderItem_didNumber = ({ item, index }: any) => {
        console.log( item);
      //  console.log('smeVerify value:', item.smeVerify);
        return (
            <View
                style={[styles.postStyle, styles.iosShadow], { marginTop: '0' }}>
                <TouchableOpacity style={styles.info}
                    onPress={() => { }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {allData?.profilePicture ?
                            <Image

                                resizeMode='cover'
                                style={styles.profileImg}
                                source={{ uri: allData?.profilePicture }}
                            />
                            :
                            
                            <View style={styles.profileImg}>
                            </View>
                        }
                        <View style={[styles.nameType, { width: '55%' }]}>
                            <Text style={styles.boldStyle}>{allData?.username}</Text>
                            <Text numberOfLines={2}
                                style={styles.smalltxt}>{item?.heading}</Text>
                        </View>
                    </View>
                    <View style={{ alignSelf: 'flex-start', width: '28%' }}>
                        <Text numberOfLines={1} style={[styles.smalltxt, { marginTop: 12, }]}>{moment(item?.postdate).fromNow()}</Text>
                        {item?.smeVerify  && (
                    <Image
                        source={require('../../../assets/images/security-user.png')}
                        style={{ width: 20, height: 20 , left:60}} // Adjust size as needed
                    />
                )}
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
                                right: 19, // Shifted to the right
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
                        </TouchableOpacity>
                    }



                </View>
                    <View style={{ flexDirection: 'row' }}>
                    {item?.hashtags.map((item) => {
                        // console.log(item,'hastgas=====>')
                        return (
                            <Text
                                numberOfLines={1}
                                style={[styles.smalltxt, {
                                    textAlign: 'left',
                                }]}>{item}</Text>
                        )
                    })
                    }

                </View>
                <View style={styles.line} />
                <View style={styles.info}>
                    <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'space-between', marginTop: 15 }}>
                        <TouchableOpacity
                        
                            onPress={() => { likeThisPost(item) }}
                        >
                            <Image style={{ top: -20 }}
                                //tintColor={item?.likes.includes(pofileData?.user?._id) ? ColorCode.blue_Button_Color : 'grey'}
                                source={require('../../../assets/images/heart.png')} />
                        </TouchableOpacity>
                        <Text style={[styles.boldStyle, { top: -20, paddingLeft: 0 }]}>{item?.likes?.count}</Text>
                        <TouchableOpacity
                            onPress={() => { openCoomentSection(item) }}
                        >
                            <Image style={{ top: -20 }} source={require('../../../assets/images/image_message.png')} />
                        </TouchableOpacity>


                        <Text style={[styles.boldStyle, { top: -20, paddingLeft: 0 }]}>{item?.comments?.length}</Text>

                    </View>


                </View>
            </View>
        )
    }


    const foloowThisUser = () => {
        if (allData?.isFollowing) {
            unfollowUser(allData?.userId).then((res) => {
                setButton("Follow")
            })
        } else {
            followUser(allData?.userId).then((res) => {
                setButton("Unfollow")
            })
        }
    }

    
    const likeThisPost = (item) => {
        if (item?.likes.users.includes(pofileData?.user?.username)) {
            sendUnLikeRequest(item?.contentId).then((res) => {
                getUserData(other).then((res) => {
                    dispatch(setLoading(false))
                    setAllData((res?.data))
                    // console.log("res?.data=====>", res?.data, "res?.data=====>")
                })
            })
        } else {
            sendLikeRequest(item?.contentId).then(() => {
                getUserData(other).then((res) => {
                    dispatch(setLoading(false))
                    setAllData((res?.data))
                    // console.log("res?.data=====>", res?.data, "res?.data=====>")
                })
            })
        }
    }
    
    const renderItem = ({ item, index }: any) => {
        return (
            <TouchableOpacity style={[styles.button, { marginLeft: 5 }]}
                onPress={() => { navigation.navigate('BlockList') }}>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
        )
    }


    const wantToBlock = () => {
        bockUser(allData?.userId).then((res) => {
            console.log(res?.data, "blockuserData=====d>")
        })
    }


    return (
        <SafeAreaView style={styles.main}>
            {loading && <Loader />}
            <StatusBar
                barStyle={'dark-content'}
                animated={true}
                backgroundColor={ColorCode.white_Color}
            />
            <ProfileHeader
                myHeading={"Profile"}
                imge={require('../../../assets/images/arrow-left.png')}
                button={() => { wantToBlock() }}
            />
           
                <View style={[styles.info, { paddingHorizontal: 10 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {allData?.profilePicture ?
                            <Image
                                resizeMode='cover'
                                style={styles.profileImg}
                                source={{ uri: allData?.profilePicture }}
                            />
                            :
                            <View style={styles.profileImg}>
                                    <Text style={[styles.boldStyle, { paddingLeft: 0 }]}>{allData?.usernam?.substring(0, 2)?.toUpperCase()}</Text>
                                    
                                </View>
                        }
                            <View style={[styles.nameType, {flex: 1, marginLeft: 10 }]}>
                                <Text style={[styles.boldStyle, { marginVertical: 1.5 }]}>
                                    {allData?.firstname + " " + allData?.lastname}  {allData?.role === "SME" && <Image
                        resizeMode='center'
                        tintColor={'#F6BE00'}
                        source={require('../../../assets/images/medal-star.png')}
                        style={{ height: 25, width: 25, marginTop: -5 }}
                    />}
                                </Text>


                                <Text style={[styles.smalltxt, { marginVertical: 1.5 }]}>
                                    {allData?.email}
                                </Text>
                                <Text style={[styles.bioAbout, { marginVertical: 1.5 }]}>
                                    {allData?.bioAbout}
                                </Text>
                            </View>
                    </View>

                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15, marginTop: 15
                }}>

                    <FlatList
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        horizontal
                        contentContainerStyle={{ justifyContent: 'space-between' }}
                        data={allData?.bioInterests}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()} />

                </View>

                
                <View style={[styles.cards, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }]}>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.smalltxt, { color: ColorCode.black_Color, fontSize: 18 }]}>{allData?.totalPosts}</Text>
                        <Text style={[styles.smalltxt,]}>Posts</Text>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.smalltxt, { color: ColorCode.black_Color, fontSize: 18 }]}>{allData?.following?.length}</Text>
                        <Text style={[styles.smalltxt,]}>Following</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.smalltxt, { color: ColorCode.black_Color, fontSize: 18 }]}>{allData?.followers?.length}</Text>
                        <Text style={[styles.smalltxt,]}>Followers</Text>
                    </View>
                    
                    <View style={{
                    marginTop: 15, flexDirection: 'row',
                    paddingHorizontal: 20, alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20
                }}>
                    <TouchableOpacity
                        onPress={() => { foloowThisUser() }}
                    >
                        <ImageBackground
                            source={require('../../../assets/images/folow_button_.png')}
                            style={[{ height: 35, width: 120, alignItems: 'center', justifyContent: 'center',paddingHorizontal:2 }]}>
                            <Text style={[styles.boldStyle,
                            { color: ColorCode.yellowText, marginHorizontal: 20 }]}>{button}</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                </View>

                </View>

                <View style={[styles.reelsStyle,]}>
                    <FlatList
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        data={allData?.content}
                        renderItem={renderItem_didNumber}
                        keyExtractor={(item, index) => index.toString()} 
                        onEndReached={loadMoreContent}
                        onEndReachedThreshold={0.5}
                        refreshControl={<RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            />
                          }
                        />
                </View>


           

            {showComment &&
                <CommentModal
                    close={() => { setCommment(false) }}
                    value={commentArray}
                    post={(t) => { postComment(t) }}

                />
            }

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
    smalltxt: {
        paddingLeft: 10,
        fontSize: 14,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.gray_color,

    },
    bioAbout: {
        fontSize: 14,
        paddingLeft:10,
        fontFamily: 'ComicNeue-Bold',
        color: ColorCode.gray_color,
        marginRight: 20, // Right margin to prevent text from touching the edge
        flexShrink: 1 // Allows text to shrink and wrap if needed
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
        
        marginHorizontal: 10,
        marginVertical:10
    },
    color: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        width: 150

    },

    cards: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginLeft: 8,
        marginRight: 8,
        height: 80,
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


export default OtherProfile;