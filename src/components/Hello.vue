<!-- TODO: Note 列表 -->

<template>
  <div class="hello">
    <h1>艾森豪魔術方塊</h1>
    <h2>魔術方塊列表</h2>
    <span>Double Click to Edit Text</span>
    <ul class="list-group">
      <li class="list-group-item" v-for="(note, index) in noteList" :key="index" @dblclick = "onEditTitle(note)">
        <router-link :to="{path:'/p/'+note.eisenhower_key}" v-show="note.editNote == false">{{ note.title }}</router-link>
        <input v-show="note.editNote == true" v-model="note.title"
          v-focus = "note.editNote"
          v-on:blur = "saveTitle(note)"
          @keyup.enter = "saveTitle(note)">
      </li>
      <li class="list-group-item" @click="addMatrix">增加</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data: function () {
    return {}
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
  methods: {
    addMatrix () {
      var postRef = this.firebasedb.ref('eisenhower').child(this.user.uid)
      var push = postRef.push()
      push.set({
        updateTime: new Date().getTime()
      })
      var pushKey = push.key

      var noteRef = this.firebasedb.ref('noteList').child(this.user.uid)
      var notePush = noteRef.push()
      var notePushKey = notePush.key
      notePush.set({
        thisKey: notePushKey,
        eisenhower_key: pushKey,
        title: 'Default',
        editNote: false
      })
      console.log(notePushKey)
      this.$set(this.noteList, notePushKey, {
        thisKey: notePushKey,
        eisenhower_key: pushKey,
        title: 'Default',
        editNote: false
      })
    },
    onEditTitle (note) {
      note.editNote = true
      console.log(this.$children)
    },
    saveTitle (note) {
      var noteRef = this.firebasedb.ref('noteList').child(this.user.uid).child(note.thisKey)
      noteRef.update({
        'title': note.title
      })
      note.editNote = false
    }
  },
  directives: {
    focus (el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
