import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class ModelStore extends EventEmitter {
  constructor() {
    super()
    this.list = [];
    this.multipleList = [];
    this.instance = null;
    this.klass= null;
    this.reason = null;
  }

  listModel(list){
    this.list = [];
    this.klass = list.klass
    for (var i = 0, len = list.data.length; i < len; ++i) {
      this.list.push(list.data[i]);
      if (i === len - 1 ) {
        this.emit("got_list");
      }
    }
    if(list.data.length == 0){
      this.emit("got_list");
    }

  }


  listMultipleModel(list){
    console.log('>>>>>', list)
    this.multipleList = list.data;
    this.klass = list.klass
    this.emit("got_multiple_list");
  }

  showIntance(instance){
    this.klass = instance.klass
    this.instance = instance.data
    this.emit("got_instance");
  }

  setIntance(instance){
    this.klass = instance.klass
    this.instance = instance.data
    this.emit("set_instance");
  }


  deleteIntance(instance){
    this.klass = instance.klass
    this.instance = instance.data
    this.emit("deleted_instance");
  }

  postFile(instance){
    console.log(instance)
    this.klass = instance.klass
    this.instance = instance.data
    this.emit("file_posted");
  }

  setIntanceFailure(reason){
    console.log(reason)
    this.reason = 'Error'
    this.klass = ''
    this.emit("set_instance");
  }

  getReason(){
    return this.reason
  }

  getIntance() {
    return this.instance
  }

  getList(){
    return this.list
  }

  getListnKlass(){
    return [this.list, this.klass]
  }


  getMutipleList(){
    return this.multipleList
  }

  getKlass(){
    return this.klass
  }

  handleActions(action) {
    switch(action.type) {
      case "LIST_MODEL_SUCCESS": {
        this.listModel(action.list);
        break;
      }
      case "MULTIPLE_LIST_MODEL_SUCCESS": {
        this.listMultipleModel(action.list);
        break;
      }
      case "GET_INSTANCE_SUCCESS": {
        this.showIntance(action.instance);
        break;
      }
      case "DELETE_INSTANCE_SUCCESS": {
        this.deleteIntance(action.instance);
        break;
      }
      case "SET_INSTANCE_SUCCESS": {
        this.setIntance(action.instance);
        break;
      }
      case "POST_FILE_SUCCESS": {
        this.postFile(action.instance);
        break;
      }
      case "SET_INSTANCE_FAILURE": {
        console.log(action)
        this.setIntanceFailure(action.reason);
        break;
      }

      
    }
  }
}


const modelStore = new ModelStore;
dispatcher.register(modelStore.handleActions.bind(modelStore));

export default modelStore;
