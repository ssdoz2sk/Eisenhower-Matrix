<!-- TODO: Note 列表 -->

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>矩陣列表</h2>
    <ul class="list-group">
      <li class="list-group-item" v-for="(note, index) in noteList" :key="index">
        <router-link :to="{path:'/p/'+note.eisenhower_key}">{{ note.title }}</router-link>
      </li>
      <li class="list-group-item">增加</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data: function () {
    return {
      msg: 'Welcome Eisenhower Matrix'
    }
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
