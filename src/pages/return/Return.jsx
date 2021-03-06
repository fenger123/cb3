import React from 'react';
import UserProfile from './../../components/userProfile/UserProfile';
import BookList from './../../components/BookList';
import BookItem from './../../components/bookItem/BookItem';
import {browserHistory} from 'react-router';
import {setUserRentCount} from '../../actions/userAction';
import {selectBook,getRecords,returnBook} from '../../actions/inventoryAction';
import {connect} from 'react-redux';
import {showAlert,showLoading} from '../../actions/promptAction';
import PageHeader from '../../components/pageHeader/pageHeader';
import WeUI from 'react-weui';
import $ from 'jquery';

const {Button,ButtonArea,Toast,Dialog} = WeUI;
const {Alert} = Dialog;

export  class Return extends React.Component {
    constructor(props){
      super(props);
      this.state={
          alert: {
              buttons: [
                  {
                      label: '好的',
                      onClick: this.hideAlert.bind(this)
                  }
              ]
          }
      };

    }
    hideAlert(){
        this.props.dispatch(showAlert(false));
    }
    componentDidMount(){
      //this.props.dispatch(getRecords(this.props.userStore.user._id))
    }
    handleClick(e){
      let checkedReturnBook = [];
      $.each(this.props.unReturnBooks,(index,elem)=>{
        if(elem.isSelected==true){
          checkedReturnBook.push(elem);
        }
      });
      console.log('test');
      let checkedCount = checkedReturnBook.length;
      if(checkedCount==0){
        this.props.dispatch(showAlert(true,'警告','请您选择要归还的图书'));
      }else{
        //确认借书操作
        this.props.dispatch(showLoading(true));
        $.each(checkedReturnBook,(index,elem)=>{
            this.props.dispatch(returnBook(elem.recordId)).then(()=>{
              this.props.dispatch(setUserRentCount('min'))
              checkedCount=checkedCount-1;
              if(checkedCount==0){
                this.props.dispatch(showLoading(false));
                this.props.dispatch(showAlert(true,'提示','还书成功'));
                browserHistory.push('/main');
              }
            });
        });
      }
      //this.props.dispatch();
    }
    render() {
        const {loading,unReturnBooks,dispatch,userStore,prompt} = this.props;
        return (
            <div>
                <PageHeader text="还书" />
              { prompt.loading ?
                  <Toast icon="loading" show={true}>
                      正在加载中...
                  </Toast>
                  :
                  <div>
                    <Alert
                          show={prompt.alert.show}
                          title={prompt.alert.title}
                          buttons={this.state.alert.buttons}>
                              {prompt.alert.content}
                    </Alert>
                <UserProfile userStore={userStore}></UserProfile>
                <BookList hasCheckedButton={true} listName='还书列表' books={unReturnBooks} onSelect={index=>dispatch(selectBook(index,'return'))}> </BookList>
                <ButtonArea>
                    <Button onClick={e=>this.handleClick(e)}>归还图书</Button>
                </ButtonArea>
                </div>
              }
            </div>
        )
    }
}

function mapStateIntoModuleProps(state) {
    const userStore = state.userStore;
    const inventoryStore = state.inventoryStore;
    return {
        userStore : userStore,
        loading: inventoryStore.loading,
        unReturnBooks:inventoryStore.unReturnBooks,
        prompt:state.prompt,
    };
}
export default connect(mapStateIntoModuleProps)(Return);
