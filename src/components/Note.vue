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
          <draggable class="list-group fill-cell" element="ul" v-model="list" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
            <transition-group type="transition" :name="'flip-list'" class="fill-cell">
              <li class="list-group-item" v-for="element in list" :key="element.order"  @click.self="onEdit(list, element)"> 
                <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed=! element.fixed; return true" aria-hidden="true"></i>
                {{element.title}}
              </li> 
            </transition-group>
          </draggable>
        </div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list2" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
            <transition-group type="transition" :name="'flip-list'" class="fill-cell">
              <li class="list-group-item" v-for="element in list2" :key="element.order"  @click.self="onEdit(list2, element)"> 
                <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                {{element.title}}
              </li> 
            </transition-group>
          </draggable>
        </div>
      </div>
      <div class="table-row">
        <div  class="table-th">不重要</div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list3" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
            <transition-group type="transition" :name="'flip-list'"  class="fill-cell">
              <li class="list-group-item" v-for="element in list3" :key="element.order"  @click.self="onEdit(list3, element)"> 
                <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                {{element.title}}
              </li> 
            </transition-group>
          </draggable>
        </div>
        <div  class="table-cell">
          <draggable class="list-group fill-cell" element="ul" v-model="list4" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false"> 
            <transition-group type="transition" :name="'flip-list'" class="fill-cell">
              <li class="list-group-item" v-for="element in list4" :key="element.order"  @click.self="onEdit(list4, element)" > 
                <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed =! element.fixed" aria-hidden="true"></i>
                  {{element.title}}
              </li> 
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
    <div class="btn btn-default" v-on:click="save" v-if="user">Save test</div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'note',
  data: function () {
    return {
      editable: true,
      isDragging: false,
      delayedDragging: false,
      list: [{title: 'Add', fixed: false, order: 99999}],
      list2: [{title: 'Add', fixed: false, order: 99999}],
      list3: [{title: 'Add', fixed: false, order: 99999}],
      list4: [{title: 'Add', fixed: false, order: 99999}]
    }
  },
  components: {
    draggable
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
        do: this.list, // .slice(0, this.list.length-1),
        decide: this.list2, // .slice(0, this.list2.length-1),
        delegate: this.list3, // .slice(0, this.list3.length-1),
        delete: this.list4, // .slice(0, this.list4.length-1),
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
      if (element.order === 99999) {
        this.isAdding = true
        this.showModal = true
        this.editingList = list
      } else {
        this.isAdding = false
        this.editingTitle = element.title
        this.editingContent = element.content
        this.showModal = true
        this.editingElement = element
      }
    },
    onEditDone () {
      if (this.isAdding) {
        this.editingList.push({
          title: this.editingTitle,
          content: this.editingContent,
          order: this.editingList.length,
          fixed: false
        })
      } else {
        this.editingElement.title = this.editingTitle
        this.editingElement.content = this.editingContent
      }
      this.showModal = false
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.editable,
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
    min-height: 100%;
    width: 100%;
    min-width: 100%;
    display: block;
  }

</style>
