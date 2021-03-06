
import React, { Component } from 'react';
import { currentProjectTasks, addProjectLastTask } from '../../redux/reducers/main-reducer';
import { connect } from 'react-redux';
import axios from 'axios'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import './task.css'

const customContentStyle = {
  width: '633px',
  maxWidth: 'none',
  fontFamily: 'helvetica',
  fontSize: '16px',

};

class Create_task extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            taskName: '',
            taskStart: '',
            taskEnd: '',
            taskUser:'',
            taskDesc: '',
            taskRole: '',
            taskUniqueKey:'',
            taskShow: false,
            taskLink: 'http://',
            taskNumber: 1
          };

          this.handleTaskDateStart = this.handleTaskDateStart.bind(this);
          this.handleTaskDateEnd =  this.handleTaskDateEnd.bind(this);
        
    }
    

    handleOpen = () => {
        this.setState({open: true});
      };
    
    handleClose = () => {
      this.setState({open: false});
    };

    handleTaskInput( e, event, date ) {
      let value = e.target.value
      let name = e.target.name

      this.setState({
        [name]: value
      })
    };
    handleTaskDateStart(event, dateStart ) {
      this.setState({
        taskStart: dateStart
      })
    };

    handleTaskDateEnd(event, date ) {
      this.setState({
        taskEnd: date
      })
    };

    createUniqueKey(){
      let projectKey = this.props.company_name + new Date();
      let finalKey = projectKey.replace(/[^A-Z0-9]/ig, "0").toLowerCase();
    }


    createNewTask() {
      let link;
      if( this.state.taskLink === 'http://' )
        link = ''
      else
        link = this.state.taskLink

      let state = this.state
      let body = {
        task_name: state.taskName,
        task_start_date: state.taskStart +'',
        task_finished_date: state.taskEnd + '',
        task_user_1: state.taskUser,
        task_description: state.taskDesc,
        task_role: state.taskRole,
        task_unique_key: this.props.project_unique_key,
        task_show: state.taskShow,
        task_link: link,
        task_number: state.taskNumber
      }

      this.props.currentProjectTasks( this.props.project_unique_key, body )
        .then( () => this.props.addProjectLastTask( state.taskNumber ) )
          .then(()=>{this.handleClose()})
            .then( () => this.setState({ taskShow: false, taskNumber: this.state.taskNumber + 1, taskLink: 'http://' }) )
    }
    
      render() {
        const actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={this.handleClose}
          />,
          <FlatButton
            label="+ Add Task"
            primary={true}
            onClick={()=>{this.createNewTask()}}
          />,
        ];

        let userInfo = this.props.company_users.map((e, i) => {
          return (
                  <option key={i} value={e.user_id}>{`${e.user_firstname} ${e.user_lastname}`}</option>
          )
      })


    
        return (
          <div>
            
            {/* <RaisedButton label="Add Task" onClick={this.handleOpen} /> */}
            <button className='task-open-modal' onClick={this.handleOpen} >ADD TASK</button>
            <Dialog
              title="Add Task"
              actions={actions}
              modal={false}
              open={this.state.open}
              contentStyle={customContentStyle}
              onRequestClose={this.handleClose}
            >

{/* TASK NAME */}
              <input name='taskName' placeholder='Task Name' className='task-create-task-input task-create-task-input-long' onChange={(e)=>{
              this.handleTaskInput(e)}} maxLength='50'/>
              <div className='task-char-count'>{this.state.taskName.length}/{50}</div>              

{/* TASK START DATE */}
              <div className='task-start-finish-date'>
              <DatePicker  hintText="Start Date" 
                name='taskStart'  onChange={
              this.handleTaskDateStart}/>

{/* TASK FINISH DATE */}
              <div className='task-start-finish-date-spacer'></div>
              <DatePicker  name='taskEnd' hintText="Finish Date" 
               onChange={
              this.handleTaskDateEnd}/>
              </div>

{/* TASK DESCRIPTION */}
              <input  name='taskDesc' placeholder='Task Description' className='task-create-task-input task-create-task-input-long'  onChange={(e)=>{
              this.handleTaskInput(e)}} maxLength='100'/>
              <div className='task-char-count'>{this.state.taskDesc.length}/{100}</div>

{/* TASK USER OR ROLE */}
              <div>
              <select name='taskUser' className='task-create-task-input'  onChange={(e)=>{
              this.handleTaskInput(e)}}>
              <option selected='User' disabled='User'>User</option>
                  {userInfo}
                </select>
              </div>

{/* TASK LINK */}
              <input  name='taskLink' placeholder='Task Link' defaultValue='http://' className='task-create-task-input task-create-task-input-long'  onChange={(e)=>{
              this.handleTaskInput(e)}}/>
            </Dialog>
          </div>
        );
      }
    }
    function mapStateToProps( state ) {  
      return state
    }

export default connect( mapStateToProps, {currentProjectTasks, addProjectLastTask} )(Create_task)