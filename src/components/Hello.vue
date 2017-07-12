<!-- TODO: Note 列表 -->

<template>
  <div class="hello">
    <h1>艾森豪魔術方塊</h1>
    <h2>魔術方塊列表</h2>
    <span>Double Click to Edit Text</span>
    <ul class="list-group">
      <li class="list-group-item" v-for="(note, index) in noteList" :key="index" @dblclick = "note.editNote = true">
        <router-link :to="{path:'/p/'+note.eisenhower_key}" v-show="note.editNote == false">{{ note.title }}</router-link>
        <input v-show="note.editNote == true" v-model="note.title"
          v-on:blur = "note.editNote = false"
          @keyup.enter = "note.editNote = false">
      </li>
      <li class="list-group-item" @click="addMatrix">增加</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data: function () {
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
      notePush.set({
        eisenhower_key: pushKey,
        title: 'Default',
        editNote: false
      })
      this.$set(this.noteList, notePush.key, {
        this_key: notePush.key,
        eisenhower_key: pushKey,
        title: 'Default',
        editNote: false
      })
    },
    saveTitle (note) {
      // noteRef = this.firebasedb.ref('noteList').child(this.user.uid).child(note.this_key)
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
