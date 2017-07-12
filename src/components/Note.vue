<!-- TODO: 預計花費時間。已完成時間。進度條 -->

<template>
  <div>
    <div class="table">
      <div class="table-row">
        <div  class="table-th"></div>
        <div  class="table-th">急迫</div>
        <div  class="table-th">不急迫</div>
      </div>
      <div class="table-row">
        <div  class="table-th">重要</div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list"  :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list" :key="element.order"  @click.self="onEdit(list, element)"> 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed=! element.fixed" aria-hidden="true"></i>
              {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list)">
              增加
            </li>
          </draggable>
        </div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list2" :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list2" :key="element.order"  @click.self="onEdit(list2, element)"> 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
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
          <draggable class="list-group fill-cell" element="ul" v-model="list3" :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list3" :key="element.order"  @click.self="onEdit(list3, element)"> 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
              {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list3)">
              增加
            </li>
          </draggable>
        </div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list4" :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="onMoveEnd"> 
            <li class="list-group-item item" v-for="element in list4" :key="element.order"  @click.self="onEdit(list4, element)" > 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed =! element.fixed" aria-hidden="true"></i>
                {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list4)">
              增加
            </li>
          </draggable>
        </div>
      </div>
    </div>

    <modal v-if="showModal" @close="showModal = false">
      <div slot="header">
        <h3 v-show = "editing == false">{{ editingElement.title }}</h3>
        <h3><input v-show = "editing == true" class="fill-cell" v-model="editingElement.title"></h3>
      </div>
      <div slot="body" class="fill-cell">
        <div class="fill-cell" v-show = "editing == false">
          <span class="fill-cell" >
            {{ editingElement.content }}
          </span>
        </div>
        <textarea v-show = "editing == true"
          class="fill-cell" v-model="editingElement.content"></textarea>
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
import Modal from '@/components/Modal'

export default {
  name: 'note',
  data: function () {
    return {
      isDragging: false,
      delayedDragging: false,
      list: [],
      list2: [],
      list3: [],
      list4: [],
      selectElement: null,
      showModal: false,
      editing: false,
      adding: false,
      addingList: null
    }
  },
  components: {
    draggable,
    Modal
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    noteList: {
      type: Object,
      default: {}
    },
    firebasedb: {
      type: Object,
      default: null
    }
  },
  mounted: function () {
    var checkAuthInterval = setInterval(() => {
      if (this.user) {
        clearInterval(checkAuthInterval)
        var getRef = this.firebasedb.ref('eisenhower').child(this.user.uid).child(this.$route.params.id)
        getRef.on('value', (snap) => {
          var data = snap.val()
          this.list = data.do || []
          this.list2 = data.decide || []
          this.list3 = data.delegate || []
          this.list4 = data.delete || []
        })
      }
    }, 250)
  },
  methods: {
    save () {
      var postRef = this.firebasedb.ref('eisenhower').child(this.user.uid).child(this.$route.params.id)
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
      }
      this.showModal = false
    },
    onEdit (list, element) {
      this.editingList = list
      this.selectElement = element
      this.editingElement = {
        title: element.title,
        editTitle: false,
        content: element.content,
        editContent: false
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
          fixed: false
        })
      } else {
        this.selectElement.title = this.editingElement.title
        this.selectElement.content = this.editingElement.content
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
      this.editingList = list
      this.editingElement = {
        title: '',
        content: ''
      }
      this.adding = true
      this.editing = true
      this.showModal = true
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: 'description',
        ghostClass: 'ghost'
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

  .footer-left {
    float: left
  }
</style>
