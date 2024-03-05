import { Store } from "../redux";
import { apiClient, apiUploadDataClient } from "./api";
import { ADDCOMMENT, ALLCONTENT, ATHOTP, AUTHRESET, BASE_URL, BLOCKUSERLIST, CHAGEPASSWORD, COMMENTPRIVLAGE, CONTENTCREATE, CONTENTDETAIL, CONTENTVERIFY, DELETE, DELETEACCOUNT, EDUCATIONDETAIL, FOLLOWUNFOLLOW, FOLLOWUSER, GET_METHOD, HOMEPAGE, LIKEREQUEST, MARKREAD, NTIFICATION, OTPPASSWORD, OTPVERIFY, POST_METHOD, PROFILE, PUTMETHOD, REGISTER, SEARCHUSER, SIGNIN, UNFOLLOW, UNLIKEREQUEST, USERBLOCK, USERCERTIFICATION, USERCOURSES, USERPROFILE, USERUNBLOCK, VERIFICATION, WORKEXPERIENCE, DELETECONTENT } from "./apiConstant";

export const registerApi = (payload) => {
    console.log("login_payload--->", payload)
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url: REGISTER,
      data: payload,
    });
  };


  export const loginApi = (payload) => {
    console.log("login_payload--->", payload)
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url: SIGNIN,
      data: payload,
    });
  };

  export const allPostData = (payload) => {
    // console.log("login_payload--->", payload)
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url: `${ALLCONTENT}?page=${payload}&pageSize=10`,
      
      // data: payload,
    });
  };

  export const basicDetail = (payload) => {
    console.log("login_payload--->", payload)
    return apiUploadDataClient({
      baseURL: BASE_URL,
      method: PUTMETHOD,
      url: PROFILE,
      data: payload,
    });
  };

  export const updateEducationDetail = (payload) => {
    console.log("login_payload--->", payload)
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  EDUCATIONDETAIL,
      data: payload,
    });
  };



  export const addWorkExperience = (payload) => {
    console.log("login_payload--->", payload)
    return apiUploadDataClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url: WORKEXPERIENCE,
      data: payload,
    });
  };


  
  export const getMyProfile = (payload) => {
    
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url: `${USERPROFILE}?page=${payload}&pageSize=10`,
      
      // data: payload,
    });
  };

  
  
  export const getHomePageData = (payload) => {
    console.log( payload,"nadbsfhbdj===>")
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url:  `${HOMEPAGE}?page=${payload}&pageSize=10`,
    });
  };



  export const followUnList = () => {
    
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url: FOLLOWUNFOLLOW,
      // data: payload,
    });
  };

  export const globalSearch = (payload) => {
    console.log("login_payload--->", payload)
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url: SEARCHUSER,
      data: payload,
    });
  };

  export const addComment = (payload) => {
    console.log("payload--->", payload)
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url: ADDCOMMENT,
      data: payload,
    });
  };



  export const getAllNotification = () => {
    
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url: NTIFICATION,
      // data: payload,
    });
  };



  export const contentCreate = (payload) => {
    console.log("login_payload--->", payload)
    return apiUploadDataClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url: CONTENTCREATE,
      data: payload,
    });
  };

  export const sendLikeRequest = (payload) => {
    console.log(LIKEREQUEST +"/"+ payload,"login_payload--->")
    return apiClient({
      baseURL: BASE_URL,
      method: PUTMETHOD,
      url: LIKEREQUEST +"/"+ payload,
      // data: payload,
    });
  };

  export const sendUnLikeRequest = (payload) => {
    console.log("login_payload--->", payload)
    return apiClient({
      baseURL: BASE_URL,
      method: PUTMETHOD,
      url:  UNLIKEREQUEST +"/"+ payload,
      // data: payload,
    });
  };


  export const getUserData = (payload) => {
    console.log(payload,"getUserData====>")
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url:  `${CONTENTDETAIL}/${payload?.id}?page=${payload?.number}&pageSize=10` ,
      
    
    });
  };

  export const followUser = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  FOLLOWUSER +"/"+payload,
    
    });
  };

  export const unfollowUser = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: DELETE,
      url:  UNFOLLOW +"/"+payload,
    
    });
  };


  export const bockUser = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  USERBLOCK +"/"+payload,
    
    });
  };

  export const userUnBlock = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  USERUNBLOCK +"/"+payload,
    
    });
  };


  export const blockUSerList = () => {
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url:  BLOCKUSERLIST,
    });
  };


  export const verifyContent = (data,payload) => {
    console.log(data,"login_payload--->",BASE_URL, CONTENTVERIFY+"/"+payload)
    return apiClient({
      baseURL: BASE_URL,
      method: PUTMETHOD,
      url: CONTENTVERIFY+"/"+payload,
      data: data,
    });
  };


  export const changePassword = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  CHAGEPASSWORD,
      data: payload,
    });
  };


  export const getOtp = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  ATHOTP,
      data: payload,
    });
  };


  export const verifyOtp = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:   OTPVERIFY,
      data: payload,
    });
  };

  

  export const otpPassword = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:   OTPPASSWORD,
      data: payload,
    });
  };


  export const resetMyPassword = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:   AUTHRESET,
      data: payload,
    });
  };

  export const markAsReact = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:   MARKREAD,
      data: payload,
    });
  };


  export const chageCommentPrivalge = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:   COMMENTPRIVLAGE,
      data: payload,
    });
  };


  export const deleteAccont = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:   DELETEACCOUNT,
      data: payload,
    });
  };


  export const addCertification = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  USERCERTIFICATION ,
      data: payload,
    });
  };


  export const addCourse = (payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: POST_METHOD,
      url:  USERCOURSES ,
      data: payload,
    });
  };


  export const getPendingVerifyData=(payload) => {
    console.log(payload,"payload------->")
    return apiClient({
      baseURL: BASE_URL,
      method: GET_METHOD,
      url:  `${VERIFICATION}?page=${payload}&pageSize=10`,
      
     
    });
  };


  export const deleteContentApi = (contentId) => {
    console.log(`Deleting content with ID: ${contentId}`);
    return apiClient({
      baseURL: BASE_URL,
      method: DELETE, // Use the DELETE HTTP method
      url: `${DELETECONTENT}/${contentId}`, // Assuming DELETECONTENT is the endpoint for deleting content
      // No need to send data in the body for a DELETE request
    });
  };
  



  
  
  

  
 

  

  

  

  



  


  

 


  


  
  
  

  
  