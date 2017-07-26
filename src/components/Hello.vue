<!-- TODO: 預計花費時間。已完成時間。進度條 -->

<template>
  <div class="hello">
    <h1>艾森豪魔術方塊</h1>
    <div class="alert alert-warning" v-show="showAlert == true">
      <strong>Warning!</strong> {{showMessage}}
    </div>
    <div class="table">
      <div class="table-row">
        <div  class="table-th"></div>
        <div  class="table-th">急迫</div>
        <div  class="table-th">不急迫</div>
      </div>
      <div class="table-row">
        <div  class="table-th">重要</div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list"  :options="dragOptions" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list" :key="element.order"  @click.self="onEdit(list, element)" :class="{'timeover': element.usedTime>element.estimatedTime}"> 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="onFixed(element)" aria-hidden="true"></i>
              {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list)">
              增加
            </li>
          </draggable>
        </div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list2" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list2" :key="element.order"  @click.self="onEdit(list2, element)" :class="{'timeover': element.usedTime>element.estimatedTime}" > 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="onFixed(element)" aria-hidden="true"></i>
              {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list2)">
              增加
            </li>
          </draggable>
        </div>
      </div>
      <div class="table-row">
        <div  class="table-th">不重要</div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list3" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list3" :key="element.order"  @click.self="onEdit(list3, element)" :class="{'timeover': element.usedTime>element.estimatedTime}"> 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="onFixed(element)" aria-hidden="true"></i>
              {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list3)">
              增加
            </li>
          </draggable>
        </div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list4" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list4" :key="element.order"  @click.self="onEdit(list4, element)" :class="{'timeover': element.usedTime>element.estimatedTime}" > 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="onFixed(element)" aria-hidden="true"></i>
                {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list4)">
              增加
            </li>
          </draggable>
        </div>
      </div>
    </div>

    <!--<div>publish link: <a v-bind:href="publishLink">{{ publishLink }}</a></div>-->

    <modal v-if="showModal" @close="showModal = false">
      <div slot="header">
        <h3 v-show = "editing == false">{{ editingElement.title }}</h3>
        <h3 v-show = "editing == true" class="form-inline">工作項目：<input class="form-control" v-model="editingElement.title" placeholder="標題"></h3>
      </div>
      <div slot="body" class="fill-cell">
        <div class="fill-cell fill-cell-90p" v-show = "editing == false">
          <vue-markdown class="fill-cell" style="overflow:scroll;" :source="editingElement.content"></vue-markdown>
        </div>
        <div v-show = "editing == true" class="fill-cell fill-cell-90p">
          <h4>工作內容：</h4>
          <textarea placeholder="內容" class="form-control fill-cell fill-cell-90p" v-model="editingElement.content"></textarea>
        </div>

        <div class="row ">
          <div class="col-xs-4">
            <label class="label-ellipsis">預計總時間</label>
          </div>
          <div class="col-xs-8 ">
            <span v-show = "editing == false" class="fill-cell">{{editingElement.estimatedTime}} 小時</span>
            <input v-show = "editing == true" type="number" class="form-control" min="0" v-model.number="editingElement.estimatedTime">
          </div>
        </div>
        <div class="row ">
          <div class="col-xs-4">
            <label class="label-ellipsis">已執行時間</label>
          </div>
          <div class="col-xs-8 ">
            <span v-show = "editing == false" v-bind:class="timeoverEditing" class="fill-cell">{{editingElement.usedTime}} 小時</span>
            <input v-show = "editing == true" type="number" class="form-control" min="0" 
              v-model.number="editingElement.usedTime" v-bind:class="timeoverEditing">
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-danger footer-left" @click="onDel">刪除</button>
        <button class="btn btn-warning footer-left" v-show="editing == false" @click="editing = true">編輯</button>
        <button class="btn btn-warning footer-left" v-show="editing == true" @click="editing = false">完成</button>

        <button class="btn btn-success" @click="onEditDone">確定</button>
        <button class="btn btn-default" @click="onCancel">取消</button>
      </div>
    </modal>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import VueMarkdown from 'vue-markdown'
import Modal from '@/components/Modal'

export default {
  name: 'note',
  data: function () {
    return {
      editAble: true,
      isDragging: false,
      delayedDragging: false,
      list: [],
      list2: [],
      list3: [],
      list4: [],
      selectElement: null,
      editingElement: null,
      showModal: false,
      editing: false,
      adding: false,
      addingList: null,
      publishLink: '',
      showAlert: true,
      showMessage: '請先登入'
    }
  },
  components: {
    draggable,
    Modal,
    VueMarkdown
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    firebasedb: {
      type: Object,
      default: null
    }
  },
  methods: {
    save () {
      if (!this.user) {
        return
      }
      var postRef = this.firebasedb.ref('eisenhower').child(this.user.uid)
      postRef.set({
        do: this.list,
        decide: this.list2,
        delegate: this.list3,
        delete: this.list4,
        updateTime: new Date().getTime()
      }).then(function () {
      }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error)
      })
    },
    onFixed (element) {
      element.fixed = !element.fixed
      this.save()
    },
    onMove ({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    onMoveEnd () {
      this.isDragging = false
      this.save()
    },
    onDel () {
      var index = this.editingList.indexOf(this.selectElement)
      if (index > -1) {
        this.editingList.splice(index, 1)
        this.save()
      }
      this.showModal = false
    },
    onEdit (list, element) {
      this.editingList = list
      this.selectElement = element
      this.editingElement = {
        title: element.title,
        content: element.content,
        estimatedTime: element.estimatedTime,
        usedTime: element.usedTime
      }
      this.showModal = true
    },
    onEditDone () {
      if (this.editingElement.title.trim() === '') {
        return
      }
      if (this.adding) {
        this.editingList.push({
          title: this.editingElement.title,
          content: this.editingElement.content,
          estimatedTime: this.editingElement.estimatedTime,
          usedTime: this.editingElement.usedTime,
          fixed: false
        })
      } else {
        this.selectElement.title = this.editingElement.title
        this.selectElement.content = this.editingElement.content
        this.selectElement.estimatedTime = this.editingElement.estimatedTime
        this.selectElement.usedTime = this.editingElement.usedTime
      }
      this.showModal = false
      this.adding = false
      this.editing = false
      this.save()
    },
    onCancel () {
      this.adding = false
      this.editing = false
      this.showModal = false
    },
    onCreate (list) {
      if (!this.user) {
        alert('請先登入')
        return
      }
      this.editingList = list
      this.editingElement = {
        title: '',
        content: '',
        estimatedTime: 0,
        usedTime: 0
      }
      this.adding = true
      this.editing = true
      this.showModal = true
    }
  },
  computed: {
    dragOptions () {
      return { // {draggable:'.item', group:'eis'}
        animation: 0,
        group: 'description',
        disabled: !this.editAble,
        ghostClass: 'ghost'
      }
    },
    timeoverEditing: function () {
      return {
        timeover: this.editingElement.usedTime > this.editingElement.estimatedTime
      }
    }
  },
  watch: {
    isDragging (newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    },
    user (newUser) {
      var matrixId = this.$route.params.id
      var getRef = null
      if (newUser) { // Already Login
        this.showAlert = false
        if (matrixId) { // 看別人或自己的 matrix
          if (matrixId === newUser.uid) {
            this.editAble = true
            this.publishLink = window.location.host + '/p/' + matrixId
            getRef = this.firebasedb.ref('eisenhower').child(matrixId)
          } else {
            this.editAble = false
            getRef = this.firebasedb.ref('eisenhower').child(matrixId)
            this.publishLink = window.location.host + '/p/' + matrixId
          }
        } else {
          this.editAble = true
          getRef = this.firebasedb.ref('eisenhower').child(newUser.uid)
          this.publishLink = window.location.host + '/p/' + newUser.uid
        }
      } else {
        if (matrixId) { // 別人的 martix
          this.editAble = false
          getRef = this.firebasedb.ref('eisenhower').child(matrixId)
          this.publishLink = window.location.host + '/p/' + matrixId
        } else {
          this.editAble = false
          console.log('Please Login')
          this.showAlert = true
          this.showMessage = '請先登入'
          this.list = []
          this.list2 = []
          this.list3 = []
          this.list4 = []
          return
        }
      }
      getRef.on('value', (snap) => {
        var data = snap.val()
        this.list = data.do || []
        this.list2 = data.decide || []
        this.list3 = data.delegate || []
        this.list4 = data.delete || []
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .table {
    display: table;
    border-collapse:separate;
    border-spacing: 5px;
    border: 2px solid #fff;
  }

  .table-row {
    display: table-row;
  }

  .table-cell {
    display: table-cell;
    border: 3px solid #777;
    width: 10px;
    height: 100px;
  }
  
  .table-th {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    width: 1px;
    height: 100px;
  }

  .fill-cell {
    height: 100%;
    /*min-height: 100%;*/
    width: 100%;
    min-width: 100%;
    display: block;
  }

  .fill-cell-90p {
    height: 90%;
    /*min-height: 100%;*/
    width: 100%;
    min-width: 100%;
    display: block;
  }

  .label-ellipsis {
    width: 100%;
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: ellipsis;
  }

  .timeover {
    background-color: pink
  }

  .footer-left {
    float: left
  }

</style>
