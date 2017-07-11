<!-- TODO: Note 內容 + back button -->

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
          <draggable class="list-group fill-cell" element="ul" v-model="list"  :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
            <li class="list-group-item item" v-for="element in list" :key="element.order"  @click.self="onEdit(list, element)"> 
              <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed=! element.fixed; return true" aria-hidden="true"></i>
              {{element.title}}
            </li> 
            <li class="list-group-item" slot="footer" @click.self="onCreate(list)">
              增加
            </li>
          </draggable>
        </div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list2" :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
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
          <draggable class="list-group fill-cell" element="ul" v-model="list3" :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
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
          <draggable class="list-group fill-cell" element="ul" v-model="list4" :options="{draggable:'.item', group:'eis'}" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
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
    <div class="btn btn-default" v-on:click="save" v-if="user">Save test</div>
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">{{ editingElement.title }}</h3>
      <div slot="body" class="fill-cell">
        <textarea class="fill-cell" v-model="editingElement.content"></textarea>
      </div>
      <div slot="footer">
        <p style="dfloat: left">Double-click to edit</p>
        <button class="btn btn-success" @click="onEditDone">確定</button>
        <button class="btn btn-default" @click="showModal = false">取消</button>
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
      showModal: false
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
      type: Array,
      default: []
    }
  },
  methods: {
    save () {
      var postRef = this.noteRef.child(this.user.uid)
      postRef.push().set({
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
    onDel (element) {
      var index = this.editingList.indexOf(element)
      if (index > -1) {
        this.editingList.splice(index, 1)
      }
    },
    onEdit (list, element) {
      this.editingElement = {
        title: element.title,
        content: element.content
      }
      this.showModal = true
    },
    onEditDone () {
      this.selectElement.title = this.editingElement.title
      this.selectElement.content = this.editingElement.content
    },
    onCreate (list) {
      list.push({ title: 'test2', content: 'tests', fixed: false })
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

</style>
