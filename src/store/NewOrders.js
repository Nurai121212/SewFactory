import { makeAutoObservable } from "mobx";

class NewOrders{
  orders = 0;

  constructor(){
    makeAutoObservable(this)
  };

  increment = (data) => {
    this.orders += data
  }

  decriment = () => {
    if(this.orders !== 0){
      this.orders -= 1;
    }
  }
};

export default new NewOrders();