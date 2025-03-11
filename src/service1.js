import axios from 'axios';
import swal from 'sweetalert';
import { jwtDecode } from 'jwt-decode';


//דפולטיבית API הגדרת כתובת 
axios.defaults.baseURL = process.env.REACT_APP_API_URL
//תפיסת שגיאות
axios.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
  console.log("a");

  if (error.response.status === 401) {
   await console.log("b");
    // return (window.location.href = "/register");
  }
  else {

    swal(`${error.name}`, `${error.message}`, "error")
    console.log(+ ":" + error.message);
  }
});
setAuthorizationBearer();

//שמירת הטוקן בלקוח
async function  saveAccessToken(authResult) {
  await console.log(authResult);
  localStorage.setItem("access_token", authResult.token);
  setAuthorizationBearer();
}
//שמירת הטוקן באופן דפולטיבי בקריאות שרת
function setAuthorizationBearer() {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
}
function helpgetLoginUser(){
  const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        return jwtDecode(accessToken);
      }
      return null;
}
//API בקשות 
export default {
    //בדיקת משתמש אם הוא מחובר  
  getLoginUser: () => {
      return helpgetLoginUser()
    },
  //שליפת כל המשימות
  getTasks: async () => {
    const result = await axios.get()
    return result.data;
  }
  ,
  //שליפת כל המשתמשים
  getTUsers: async () => {
    const result = await axios.get('users');
    return result.data;
  },
  //הוספת משימה
  addTask: async (name) => {
    const id = helpgetLoginUser().id;
    const result = axios.post(`?name=${name}&id=${id}`)
    return await result.data;
  }
  //הרשמה
  ,
  addUser: async (IdUsers, Name, Password) => {
    const res = await axios.post(`addUser`, { IdUsers, Name, Password })
    if (res.data != null){
      console.log(res.data);
      
            saveAccessToken(res.data);

    }
    else
      swal("אתה  רשום אצלינו", "הכנס להתחברות", "error")
    return res;
  },
  //התחברות
  login: async (IdUsers, Name, Password) => {
    const res = await axios.post("login", { IdUsers, Name, Password });
  await  console.log(res);
    if (res){
    if (res.data != null){
      saveAccessToken(res.data.jwt);
      console.log(res.data);
    }
  }
    else
      swal("אתה לא רשום אצלינו", "הכנס להרשמה", " info")
    return res;
  },
  //קבלת איפורמציה
  info: async () => {
    return await axios.get("info")
  }
  ,
  //שליפת משימות ע"פ משתמש
  byId: async (id) => {
    return await axios.get(`byId?id=${id}`)
  }
  //עדכון משימה
  , setCompleted: async (id, isComplete) => {
    //http://localhost:5179/1?IsComplete=true

    console.log('setCompleted', { id, isComplete })
    const result = axios.put(`${id}?IsComplete=${isComplete}`)
    return (await result).data;
  },
//מחיקת משימה
  deleteTask: async (id) => {
    const result = axios.delete(`${id}`)

    return (await result).data;
  },

  //התנתקות
  logout:()=>{
    localStorage.removeItem("access_token");

    // localStorage.setItem("access_token", "");
  },

};


