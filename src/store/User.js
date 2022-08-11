import { makeAutoObservable } from "mobx";
import Cookies from "js-cookie";

class User{
  user = null;
  premissions = null;

  constructor(){
    makeAutoObservable(this)
  };

  setUser = (data) => {
    this.user = data;

    this.premissions = {
      isAdmin : data.role === 'ROLE_ADMIN',
      isSewer : data.role === 'ROLE_SEWER',
      isCustomer : data.role === 'ROLE_CUSTOMER'
    }

    if(data.token){
      Cookies.set('my_token', data.token)
    }
  };

  removeUser = () => {
    this.user = null;
    this.premissions = null;

    Cookies.remove('my_token')
  }
};

export default new User();